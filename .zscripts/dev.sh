#!/bin/bash
# Bali Willy Tour - Dev Script for Space-Z Platform
# This script runs as user 'z' in the deployment container
#
# CRITICAL: Must use Node.js runtime (npx next dev), NOT bun run dev
# Bun doesn't respect NODE_OPTIONS env var, so origin-stripper.js won't load
# Node.js respects NODE_OPTIONS, so the origin-stripper patch takes effect

cd /home/z/my-project || { echo "FATAL: Cannot cd to /home/z/my-project"; exit 1; }
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=development

echo "=== Bali Willy Tour - Starting ==="
echo "PWD: $(pwd)"
echo "Node: $(node --version 2>/dev/null || echo 'NOT FOUND')"
echo "Files at root: $(ls -1 | tr '\n' ' ')"

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "node_modules/next" ]; then
  echo "Installing dependencies..."
  if command -v bun &>/dev/null; then
    bun install 2>&1
  else
    npm install 2>&1
  fi
fi

# Load origin-stripper.js via NODE_OPTIONS (strips Origin headers at HTTP level)
# This bypasses Next.js cross-origin check, allowing iframe preview to work
if [ -f "origin-stripper.js" ]; then
  export NODE_OPTIONS="--require /home/z/my-project/origin-stripper.js"
  echo "Origin stripper loaded via NODE_OPTIONS"
  echo "Cross-origin iframe requests will be allowed"
fi

# IMPORTANT: Use npx next dev, NOT bun run dev
# bun doesn't respect NODE_OPTIONS and uses its own JavaScript runtime,
# so the origin-stripper.js patch would have NO EFFECT with bun
echo "Starting Next.js dev server with Node.js runtime..."
exec npx next dev -p $PORT -H 0.0.0.0
