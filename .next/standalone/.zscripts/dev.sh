#!/bin/bash
# Bali Willy Tour - Development Server Script
# Used by the Space-Z platform to start the dev server

cd /home/z/my-project || exit 1
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

echo "=== Bali Willy Tour - Starting Dev Server ==="

# Check if standalone build exists and use it
if [ -d ".next/standalone" ] && [ -f ".next/standalone/server.js" ]; then
  echo "Found standalone build, starting production server..."

  cd .next/standalone || exit 1

  # Start the Next.js standalone server
  node server.js &
  SERVER_PID=$!

  # Wait for server to be ready
  for i in $(seq 1 30); do
    if curl -s -o /dev/null http://localhost:$PORT/ --connect-timeout 1 2>/dev/null; then
      echo "Server is ready on port $PORT!"
      break
    fi
    sleep 1
  done

  # Keep the process running
  wait $SERVER_PID
else
  echo "No standalone build found, starting dev server..."

  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    if [ -f "bun.lock" ]; then
      bun install 2>&1
    elif [ -f "package-lock.json" ]; then
      npm ci --prefer-offline 2>&1 || npm install 2>&1
    else
      npm install 2>&1
    fi
  fi

  # Start Next.js dev server
  exec npx next dev -p $PORT -H 0.0.0.0
fi
