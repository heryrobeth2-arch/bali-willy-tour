// Patch Node.js HTTP/HTTPS Server emit to strip Origin header
// This bypasses Next.js dev mode cross-origin checks
// allowing the preview iframe on Space-Z platform to work

const http = require('http');
const https = require('https');

// Patch HTTP Server's emit method
const httpEmit = http.Server.prototype.emit;
http.Server.prototype.emit = function(event, ...args) {
  if (event === 'request' && args[0] && args[0].headers) {
    delete args[0].headers.origin;
  }
  if (event === 'upgrade' && args[0] && args[0].headers) {
    delete args[0].headers.origin;
  }
  return httpEmit.call(this, event, ...args);
};

// Patch HTTPS Server's emit method
const httpsEmit = https.Server.prototype.emit;
https.Server.prototype.emit = function(event, ...args) {
  if (event === 'request' && args[0] && args[0].headers) {
    delete args[0].headers.origin;
  }
  if (event === 'upgrade' && args[0] && args[0].headers) {
    delete args[0].headers.origin;
  }
  return httpsEmit.call(this, event, ...args);
};

console.log('[origin-stripper] Patched HTTP/HTTPS Server to strip Origin headers');
