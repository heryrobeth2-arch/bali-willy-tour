#!/bin/bash
cd /home/z/my-project || exit 1
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

echo "=== Bali Willy Tour Starting (Static Mode) ==="

# Build static site if not already built
if [ ! -d "out" ] || [ ! -f "out/index.html" ]; then
  echo "Building static site..."
  if [ ! -d "node_modules" ]; then
    if [ -f "package-lock.json" ]; then
      npm ci --prefer-offline 2>&1 || npm install 2>&1
    else
      npm install 2>&1
    fi
  fi
  npx next build 2>&1
fi

# Serve the static files
if [ -d "out" ] && [ -f "out/index.html" ]; then
  # Option 1: Use PM2 + serve-static.js (if PM2 and node available)
  if command -v pm2 &>/dev/null && [ -f "serve-static.js" ]; then
    echo "Starting static server with PM2..."
    pm2 start serve-static.js --name "bali-willy-tour" -i 1 2>/dev/null || pm2 restart bali-willy-tour 2>/dev/null
    pm2 save 2>/dev/null

    # Wait for server to be ready
    for i in $(seq 1 30); do
      if curl -s -o /dev/null http://localhost:$PORT/ --connect-timeout 1 2>/dev/null; then
        echo "Server is ready on port $PORT!"
        break
      fi
      sleep 1
    done

    exec pm2 logs bali-willy-tour --raw
  fi

  # Option 2: Use Python HTTP server (fallback, works everywhere)
  if command -v python3 &>/dev/null; then
    echo "Starting static server with Python..."
    cd out || exit 1
    exec python3 -m http.server $PORT --bind 0.0.0.0
  elif command -v python &>/dev/null; then
    echo "Starting static server with Python2..."
    cd out || exit 1
    exec python -m SimpleHTTPServer $PORT
  fi

  # Option 3: Use Node.js serve-static.js directly
  if [ -f "serve-static.js" ]; then
    echo "Starting static server with Node.js..."
    exec node serve-static.js
  fi
fi

echo "ERROR: Failed to start server"
exit 1
