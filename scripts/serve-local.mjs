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

let idleTimer;
function refreshIdleTimer(server) {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => server.close(() => process.exit(0)), idleMs);
  idleTimer.unref?.();
}

function resolveRequestPath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const relative = decoded.replace(/^\/+/, '') || 'index.html';
  const candidate = path.resolve(clientRoot, relative);
  if (candidate !== clientRoot && !candidate.startsWith(`${clientRoot}${path.sep}`)) return null;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const indexFile = path.join(candidate, 'index.html');
    if (fs.existsSync(indexFile)) return indexFile;
  }
  return path.join(clientRoot, 'index.html');
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
