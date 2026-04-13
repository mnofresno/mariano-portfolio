// Simple static file server for development
// No requiere dependencias locales, solo Node.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3500;
const PUBLIC_DIR = path.join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
};

function sendFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
}

function resolveFilePath(requestPath, callback) {
  const normalizedPath = decodeURIComponent(requestPath.split('?')[0] || '/');
  const relativePath = normalizedPath === '/' ? '/index.html' : normalizedPath;
  const directPath = path.join(PUBLIC_DIR, relativePath);
  const candidates = [directPath];

  if (!path.extname(directPath)) {
    candidates.push(path.join(directPath, 'index.html'));
    candidates.push(`${directPath}.html`);
  }

  (function next(index) {
    if (index >= candidates.length) {
      callback(null);
      return;
    }

    fs.stat(candidates[index], (err, stats) => {
      if (!err && stats.isFile()) {
        callback(candidates[index]);
        return;
      }

      next(index + 1);
    });
  })(0);
}

http.createServer((req, res) => {
  resolveFilePath(req.url, (filePath) => {
    if (filePath) {
      sendFile(filePath, res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  });
}).listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});
