#!/bin/bash
cd /home/z/my-project || exit 1
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Starting (Production) ==="

# Use dev.sh for startup
if [ -f "./.zscripts/dev.sh" ]; then
  exec bash .zscripts/dev.sh
fi

# Fallback: install and start
if [ ! -d "node_modules" ]; then
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
