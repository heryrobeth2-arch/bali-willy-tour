const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Strip Origin header to bypass Next.js dev cross-origin check
      // This allows the preview iframe to work correctly on Space-Z platform
      delete req.headers.origin;

      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Handle WebSocket upgrade for HMR (Hot Module Replacement)
  // Next.js uses WebSocket for HMR in dev mode
  // We need to strip the Origin header here too to bypass cross-origin checks
  server.on('upgrade', (req, socket, head) => {
    // Strip Origin header on WebSocket upgrade too
    delete req.headers.origin;

    // Forward the upgrade request - Next.js internal HMR server will handle it
    // The HMR WebSocket is handled by Next.js internally through the server instance
    // We just need to make sure the Origin header is removed
  });

  server
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port} (dev: ${dev})`);
    });
});
