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

const indexFile = path.join(clientRoot, 'index.html');
if (!fs.existsSync(indexFile)) {
  console.error('dist/client/index.html is missing. Run node scripts/build-sites.mjs first.');
  process.exit(1);
}

function buildStaticFileMap(root) {
  const files = new Map();
  const visit = (directory, relativeDirectory = '') => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      const relative = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        visit(absolute, relative);
      } else if (entry.isFile()) {
        files.set(relative, absolute);
      }
    }
  };
  visit(root);
  return files;
}

const staticFiles = buildStaticFileMap(clientRoot);

let idleTimer;
function refreshIdleTimer(server) {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => server.close(() => process.exit(0)), idleMs);
  idleTimer.unref?.();
}

function resolveRequestPath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(String(urlPath || '/').split('?')[0]);
  } catch {
    return null;
  }
  if (decoded.includes('\0') || decoded.includes('\\')) return null;
  const relative = decoded.replace(/^\/+/, '') || 'index.html';
  if (relative.split('/').some((segment) => segment === '.' || segment === '..')) return null;
  if (relative.endsWith('/')) {
    return staticFiles.get(`${relative}index.html`) || indexFile;
  }
  return staticFiles.get(relative) || indexFile;
}

const server = http.createServer((request, response) => {
  refreshIdleTimer(server);
  const file = resolveRequestPath(request.url || '/');
  if (!file) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Could not read file');
      return;
    }
    response.writeHead(200, {
      'content-type': contentTypes.get(path.extname(file).toLowerCase()) || 'application/octet-stream',
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
