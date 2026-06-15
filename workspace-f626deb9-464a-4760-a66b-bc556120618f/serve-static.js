const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOSTNAME || '0.0.0.0';
const OUT_DIR = path.join(__dirname, 'out');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(OUT_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Handle _next directory (Next.js static assets)
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try with .html extension for SPA-like routing
      if (!ext) {
        const htmlPath = filePath + '.html';
        fs.readFile(htmlPath, (err2, data2) => {
          if (err2) {
            // Try 404.html
            fs.readFile(path.join(OUT_DIR, '404.html'), (err3, data3) => {
              if (err3) {
                res.writeHead(404);
                res.end('Not Found');
              } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(data3);
              }
            });
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data2);
          }
        });
      } else {
        // Try 404.html
        fs.readFile(path.join(OUT_DIR, '404.html'), (err3, data3) => {
          if (err3) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(data3);
          }
        });
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Static server running at http://${HOST}:${PORT}`);
});
