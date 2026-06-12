#!/bin/bash
# Bali Willy Tour - Dev Script for Space-Z Platform
# This script runs as user 'z' in the deployment container
# Strategy: Install dependencies and run dev mode with origin stripping

cd /home/z/my-project || { echo "FATAL: Cannot cd to /home/z/my-project"; exit 1; }

# Ensure dev mode works correctly
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=development

# Critical: Strip Origin headers to bypass Next.js dev cross-origin check
# This allows the Space-Z preview iframe to work correctly
if [ -f "origin-stripper.js" ]; then
  export NODE_OPTIONS="--require /home/z/my-project/origin-stripper.js"
  echo "Origin stripper loaded - bypassing Next.js cross-origin checks"
fi

echo "=== Bali Willy Tour - Starting ==="
echo "PWD: $(pwd)"
echo "Node: $(node --version 2>/dev/null || echo 'NOT FOUND')"
echo "Bun: $(bun --version 2>/dev/null || echo 'NOT FOUND')"
echo "NODE_OPTIONS: ${NODE_OPTIONS:-none}"

# Install all dependencies (including devDependencies needed for dev mode)
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

# Start the development server with origin stripping
echo "Starting Next.js dev server (with origin stripping for preview iframe)..."
if command -v bun &>/dev/null; then
  exec bun run dev
else
  exec npx next dev -p $PORT -H 0.0.0.0
fi
