#!/bin/bash
cd /home/z/my-project || exit 1
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Starting (Production) ==="

# Use dev.sh for startup (handles all cases: flattened artifact, standalone, dev)
if [ -f "./.zscripts/dev.sh" ]; then
  exec bash .zscripts/dev.sh
fi

# Fallback: if standalone server exists at root (flattened artifact)
if [ -f "server.js" ]; then
  exec node server.js
fi

# Fallback: standalone in .next/standalone/
if [ -f ".next/standalone/server.js" ]; then
  cd .next/standalone
  exec node server.js
fi

# Last resort: dev server
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
