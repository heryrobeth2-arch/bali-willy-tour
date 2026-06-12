#!/bin/bash
# Bali Willy Tour - Dev Script for Space-Z Platform
# Follows platform Z.ai recommended configuration
# IMPORTANT: Must use dev mode so allowedDevOrigins works for iframe preview

cd /home/z/my-project || { echo "FATAL: Cannot cd to /home/z/my-project"; exit 1; }
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=development

echo "=== Bali Willy Tour - Starting Dev Mode ==="
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

# Start dev server - allowedDevOrigins only works in DEV mode
if command -v bun &>/dev/null; then
  echo "Starting bun run dev..."
  exec bun run dev
else
  echo "Starting npx next dev..."
  exec npx next dev -p $PORT -H 0.0.0.0
fi
