// serve.js — static server + live reload via SSE
// Usage: node serve.js
// Then open http://localhost:3000

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webm': 'video/webm',
  '.mp4':  'video/mp4',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

// SSE clients waiting for reload signal
let clients = [];

// Watch entire project folder for changes
fs.watch(ROOT, { recursive: true }, (event, filename) => {
  if (!filename) return;
  if (filename.includes('node_modules')) return;
  console.log(`[reload] ${filename}`);
  clients.forEach(res => res.write('data: reload\n\n'));
  clients = [];
});

// Tiny script injected into HTML — connects to SSE and reloads on signal
const INJECT = `
<script>
(function(){
  var es = new EventSource('/__livereload');
  es.onmessage = function(){ location.reload(); };
  es.onerror   = function(){ setTimeout(function(){ location.reload(); }, 1000); };
})();
</script>`;

const server = http.createServer((req, res) => {
  // Live-reload SSE endpoint
  if (req.url === '/__livereload') {
    res.writeHead(200, {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    });
    res.write(': connected\n\n');
    clients.push(res);
    req.on('close', () => { clients = clients.filter(c => c !== res); });
    return;
  }

  // Resolve file path
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + urlPath);
      return;
    }

    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });

    // Inject live-reload script just before </body>
    if (ext === '.html') {
      const html = data.toString().replace('</body>', INJECT + '</body>');
      res.end(html);
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n  Ryokan of The Spirits`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log(`  Watching for changes...`);
});
