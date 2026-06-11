#!/bin/bash
# Bali Willy Tour - Dev Script for Space-Z Platform
# This script runs as user 'z' in the deployment container
# Strategy: Install all dependencies (including devDeps) and run dev mode

cd /home/z/my-project || { echo "FATAL: Cannot cd to /home/z/my-project"; exit 1; }

# Ensure dev mode works correctly
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=development

echo "=== Bali Willy Tour - Starting ==="
echo "PWD: $(pwd)"
echo "Node: $(node --version 2>/dev/null || echo 'NOT FOUND')"
echo "Bun: $(bun --version 2>/dev/null || echo 'NOT FOUND')"
echo "Files: $(ls -1 | tr '\n' ' ')"

# Install all dependencies (including devDependencies needed for dev mode)
# We explicitly set NODE_ENV=development above to ensure devDeps are installed
if [ ! -d "node_modules" ] || [ ! -d "node_modules/next" ]; then
  echo "Installing dependencies (including devDependencies)..."
  if command -v bun &>/dev/null; then
    bun install 2>&1
  else
    npm install 2>&1
  fi
fi

# Verify critical dependencies
echo "Verifying dependencies..."
if [ ! -d "node_modules/next" ]; then
  echo "ERROR: next module not found! Reinstalling..."
  if command -v bun &>/dev/null; then
    bun install 2>&1
  else
    npm install 2>&1
  fi
fi

# Start the development server
echo "Starting Next.js dev server..."
if command -v bun &>/dev/null; then
  exec bun run dev
else
  exec npx next dev -p $PORT -H 0.0.0.0
fi
