#!/bin/bash
# Bali Willy Tour - Development Startup Script
# Runs in the deployment container via /start.sh
# Prefers standalone production server, falls back to dev mode

cd /home/z/my-project || exit 1
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Starting ==="

# Check if standalone production build exists
if [ -f ".next/standalone/server.js" ]; then
  echo "Found standalone production build, starting..."

  # Ensure static files are in place
  if [ -d "public" ] && [ ! -d ".next/standalone/public" ]; then
    cp -r public .next/standalone/public 2>/dev/null || true
  fi
  if [ -d ".next/static" ] && [ ! -d ".next/standalone/.next/static" ]; then
    mkdir -p .next/standalone/.next
    cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
  fi

  cd .next/standalone
  exec node server.js
fi

# Fallback: install deps and start dev server
echo "No standalone build found, starting dev server..."

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

if command -v bun &>/dev/null; then
  exec bun run dev
else
  exec npx next dev -p $PORT -H 0.0.0.0
fi
