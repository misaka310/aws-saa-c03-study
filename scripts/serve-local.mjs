import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientRoot = path.join(repoRoot, 'dist', 'client');
const host = '127.0.0.1';
const port = Number(process.env.SAA_STUDY_PORT || 8765);
const idleMs = 60 * 60 * 1000;

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.gif', 'image/gif'],
  ['.svg', 'image/svg+xml'],
]);

if (!fs.existsSync(path.join(clientRoot, 'index.html'))) {
  console.error('dist/client/index.html is missing. Run node scripts/build-sites.mjs first.');
  process.exit(1);
}

function buildAssetIndex(root) {
  const assets = new Map();

  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;

      const relative = path.relative(root, fullPath).split(path.sep).join('/');
      const route = `/${relative}`;
      const asset = {
        filePath: fullPath,
        contentType: contentTypes.get(path.extname(entry.name).toLowerCase()) || 'application/octet-stream',
      };
      assets.set(route, asset);

      if (entry.name === 'index.html') {
        const directoryRoute = path.posix.dirname(route);
        const cleanDirectoryRoute = directoryRoute === '/' ? '/' : directoryRoute.replace(/\/$/, '');
        assets.set(cleanDirectoryRoute, asset);
        if (cleanDirectoryRoute !== '/') assets.set(`${cleanDirectoryRoute}/`, asset);
      }
    }
  }

  visit(root);
  return assets;
}

const assetIndex = buildAssetIndex(clientRoot);
const rootAsset = assetIndex.get('/');

let idleTimer;
function refreshIdleTimer(server) {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => server.close(() => process.exit(0)), idleMs);
  idleTimer.unref?.();
}

function normalizeRequestRoute(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(String(urlPath || '/').split('?')[0]);
  } catch {
    return null;
  }
  if (decoded.includes('\0') || decoded.includes('\\')) return null;
  const normalized = path.posix.normalize(`/${decoded.replace(/^\/+/, '')}`);
  return normalized.startsWith('/') ? normalized : null;
}

function resolveRequestAsset(urlPath) {
  const route = normalizeRequestRoute(urlPath);
  if (!route) return null;
  return assetIndex.get(route) || assetIndex.get(`${route}/`) || rootAsset || null;
}

const server = http.createServer((request, response) => {
  refreshIdleTimer(server);
  const asset = resolveRequestAsset(request.url || '/');
  if (!asset) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
    return;
  }
  fs.readFile(asset.filePath, (error, data) => {
    if (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Could not read file');
      return;
    }
    response.writeHead(200, {
      'content-type': asset.contentType,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    });
    response.end(data);
  });
});

server.on('error', (error) => {
  if (error?.code === 'EADDRINUSE') process.exit(0);
  console.error(error);
  process.exit(1);
});

server.listen(port, host, () => {
  refreshIdleTimer(server);
  console.log(`AWS SAA study portal: http://${host}:${port}/`);
});
