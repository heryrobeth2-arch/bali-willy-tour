#!/bin/bash
cd /home/z/my-project || { echo "FATAL: Cannot cd to /home/z/my-project"; exit 1; }
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Starting ==="
echo "PWD: $(pwd)"
echo "Files: $(ls | tr '\n' ' ')"

# Priority 1: Standalone server at root (from flattened artifact)
if [ -f "server.js" ]; then
  echo "Starting standalone server from root..."
  exec node server.js
fi

# Priority 2: Standalone server in .next/standalone/
if [ -f ".next/standalone/server.js" ]; then
  echo "Starting standalone server from .next/standalone/..."
  cd .next/standalone
  exec node server.js
fi

# Priority 3: Install deps + dev mode (slow fallback)
echo "No standalone build. Installing and starting dev server..."

if [ ! -d "node_modules" ]; then
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
