#!/bin/bash
# Bali Willy Tour - Dev Script for Space-Z Platform
# This script runs as user 'z' in the deployment container
# Priority 1: Standalone production server (no cross-origin check)
# Priority 2: Dev mode with origin stripping

cd /home/z/my-project || { echo "FATAL: Cannot cd to /home/z/my-project"; exit 1; }
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Starting ==="
echo "PWD: $(pwd)"
echo "Node: $(node --version 2>/dev/null || echo 'NOT FOUND')"
echo "Bun: $(bun --version 2>/dev/null || echo 'NOT FOUND')"
echo "Files at root: $(ls -1 | tr '\n' ' ')"

# Priority 1: Standalone server at root (from flattened artifact)
# Production mode has NO cross-origin check - this fixes the preview iframe
if [ -f "server.js" ]; then
  echo ""
  echo "Found server.js at root - starting STANDALONE PRODUCTION server..."
  echo "Production mode bypasses Next.js cross-origin check for iframe preview"
  exec node server.js
fi

# Priority 2: Standalone server in .next/standalone/
if [ -f ".next/standalone/server.js" ]; then
  echo ""
  echo "Found .next/standalone/server.js - starting standalone server..."
  # Copy static files if needed
  if [ -d "public" ] && [ ! -d ".next/standalone/public" ]; then
    cp -r public .next/standalone/public
  fi
  if [ -d ".next/static" ] && [ ! -d ".next/standalone/.next/static" ]; then
    mkdir -p .next/standalone/.next
    cp -r .next/static .next/standalone/.next/static
  fi
  cd .next/standalone
  exec node server.js
fi

# Priority 3: Dev mode with origin stripping
echo ""
echo "No standalone build found. Starting DEV mode with origin stripping..."

export NODE_ENV=development
if [ -f "origin-stripper.js" ]; then
  export NODE_OPTIONS="--require /home/z/my-project/origin-stripper.js"
  echo "Origin stripper loaded - bypassing Next.js cross-origin checks"
fi

if [ ! -d "node_modules" ] || [ ! -d "node_modules/next" ]; then
  echo "Installing dependencies..."
  if command -v bun &>/dev/null; then
    bun install 2>&1
  else
    npm install 2>&1
  fi
fi

if command -v bun &>/dev/null; then
  exec bun run dev
else
  exec npx next dev -p $PORT -H 0.0.0.0
fi
