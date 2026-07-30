#!/bin/bash
# Bali Willy Tour - Dev Script for Space-Z Platform
# Follows platform Z.ai recommended configuration

cd /home/z/my-project || { echo "FATAL: Cannot cd to /home/z/my-project"; exit 1; }
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Starting ==="
echo "PWD: $(pwd)"
echo "Node: $(node --version 2>/dev/null || echo 'NOT FOUND')"
echo "Bun: $(bun --version 2>/dev/null || echo 'NOT FOUND')"

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "node_modules/next" ]; then
  echo "Installing dependencies..."
  if command -v bun &>/dev/null; then
    bun install 2>&1
  else
    npm install 2>&1
  fi
fi

# Priority 1: Standalone production server (from build artifact)
# Production mode has NO cross-origin check - preview works perfectly
if [ -f "server.js" ]; then
  echo ""
  echo "Found server.js - starting STANDALONE PRODUCTION server..."
  echo "Production mode: no cross-origin check, iframe preview will work"
  export NODE_ENV=production
  exec node server.js
fi

# Priority 2: Dev mode (for when no standalone build exists)
echo ""
echo "Starting DEV mode..."
export NODE_ENV=development

if command -v bun &>/dev/null; then
  echo "Using bun run dev..."
  exec bun run dev
else
  echo "Using npx next dev..."
  exec npx next dev -p $PORT -H 0.0.0.0
fi
