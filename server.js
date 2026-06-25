// Simple static file server for development
// No requiere dependencias locales, solo Node.js
const http = require('http');
const fs = require('fs');
const https = require('https');
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

function proxyCultsGallery(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const limit = Math.max(1, Math.min(12, Number.parseInt(requestUrl.searchParams.get('limit') || '6', 10) || 6));
  const remoteUrl = `https://mariano.fresno.ar/cults/portfolio.html?limit=${limit}`;

  https.get(remoteUrl, {
    headers: {
      'User-Agent': 'mariano-portfolio-dev-server/1.0'
    }
  }, (remoteRes) => {
    let body = '';

    remoteRes.on('data', (chunk) => {
      body += chunk;
    });

    remoteRes.on('end', () => {
      if (remoteRes.statusCode >= 200 && remoteRes.statusCode < 300 && body) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store'
        });
        res.end(body);
        return;
      }

      res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Unable to load remote Cults3D gallery preview.' }));
    });
  }).on('error', () => {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Unable to reach remote Cults3D gallery service.' }));
  });
}

http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);

  if (pathname === '/api/cults-gallery') {
    proxyCultsGallery(req, res);
    return;
  }

  let filePath = path.join(PUBLIC_DIR, pathname);
  if (filePath.endsWith('/')) filePath += 'index.html';

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    }
  });
}).listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});
