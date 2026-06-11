#!/bin/bash
# Bali Willy Tour - Production Start Script
# Used by the Space-Z deployment container to start the app
# This runs INSIDE the deployed container after the artifact is extracted

set -e

cd /home/z/my-project || exit 1
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

echo "============================================"
echo " Bali Willy Tour - Starting (Production)"
echo "============================================"

# Option 1: Use standalone Next.js server (preferred)
if [ -f ".next/standalone/server.js" ]; then
  echo "Starting Next.js standalone server..."

  cd .next/standalone || exit 1

  # Start the standalone server
  node server.js &
  SERVER_PID=$!

  # Wait for server to be ready
  for i in $(seq 1 30); do
    if curl -s -o /dev/null http://localhost:$PORT/ --connect-timeout 1 2>/dev/null; then
      echo "Next.js server ready on port $PORT!"
      break
    fi
    if [ $i -eq 30 ]; then
      echo "WARNING: Server did not respond within 30s"
    fi
    sleep 1
  done

  # Start mini-services if available
  if [ -d "mini-services-dist" ] && [ -f "mini-services-dist/mini-services-start.sh" ]; then
    echo "Starting mini-services..."
    bash mini-services-dist/mini-services-start.sh &
  fi

  # Keep running
  wait $SERVER_PID
  exit 0
fi

# Option 2: Use dev.sh as fallback
if [ -f "./.zscripts/dev.sh" ]; then
  echo "Starting via .zscripts/dev.sh..."
  exec bash .zscripts/dev.sh
fi

# Option 3: Start Next.js directly
if [ -d "node_modules" ]; then
  echo "Starting Next.js directly..."
  exec node_modules/.bin/next start -p $PORT -H 0.0.0.0
fi

# Option 4: Last resort - install and start
echo "No pre-built server found, installing and building..."
if [ -f "bun.lock" ]; then
  bun install 2>&1
elif [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi
npx next build 2>&1

if [ -d ".next/standalone" ]; then
  cd .next/standalone || exit 1
  exec node server.js
else
  exec node_modules/.bin/next start -p $PORT -H 0.0.0.0
fi
