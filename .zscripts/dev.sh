#!/bin/bash
# Bali Willy Tour - Development/Production Server Script
# Used by the Space-Z platform to start the server
# Handles both development mode and standalone production mode

cd /home/z/my-project || exit 1
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

echo "=== Bali Willy Tour - Starting Server ==="

# Option 1: Use standalone Next.js server (preferred for production)
if [ -d ".next/standalone" ] && [ -f ".next/standalone/server.js" ]; then
  echo "Found standalone build (.next/standalone/server.js), starting production server..."
  cd .next/standalone || exit 1

  # Ensure static assets are in place
  if [ ! -d ".next/static" ]; then
    echo "WARNING: .next/static not found in standalone dir, some assets may be missing"
  fi

  # Ensure public directory is in place
  if [ ! -d "public" ]; then
    echo "WARNING: public/ not found in standalone dir"
  fi

  # Start the standalone server
  node server.js &
  SERVER_PID=$!

  # Wait for server to be ready
  for i in $(seq 1 30); do
    if curl -s -o /dev/null http://localhost:$PORT/ --connect-timeout 1 2>/dev/null; then
      echo "✓ Standalone server is ready on port $PORT!"
      break
    fi
    if [ $i -eq 30 ]; then
      echo "WARNING: Server did not respond within 30s"
    fi
    sleep 1
  done

  # Keep the process running
  wait $SERVER_PID
  exit 0
fi

# Option 2: Use bun run dev (requires source code + package.json)
if [ -f "package.json" ]; then
  echo "No standalone build found, starting with bun..."

  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    if command -v bun &>/dev/null; then
      bun install 2>&1
    elif [ -f "package-lock.json" ]; then
      npm ci --prefer-offline 2>&1 || npm install 2>&1
    else
      npm install 2>&1
    fi
  fi

  # Start the dev server
  echo "Starting dev server..."
  if command -v bun &>/dev/null; then
    exec bun run dev
  else
    exec npx next dev -p $PORT -H 0.0.0.0
  fi
fi

echo "ERROR: Could not start server - no standalone build or package.json found"
exit 1
