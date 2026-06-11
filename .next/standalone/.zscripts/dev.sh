#!/bin/bash
cd /home/z/my-project || exit 1
export PORT=3000
export HOSTNAME=0.0.0.0
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Starting ==="

# Priority 1: Standalone server at project root (from flattened artifact)
if [ -f "server.js" ]; then
  echo "Found standalone server.js at project root, starting production server..."
  exec node server.js
fi

# Priority 2: Standalone server in .next/standalone/ (local dev build)
if [ -f ".next/standalone/server.js" ]; then
  echo "Found .next/standalone/server.js, starting production server..."
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

# Priority 3: Build standalone if we have the source, then start
if [ -f "package.json" ] && [ ! -f "server.js" ] && [ ! -f ".next/standalone/server.js" ]; then
  echo "No standalone build found. Building first..."
  
  # Install dependencies
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
  
  # Build
  if command -v bun &>/dev/null; then
    bun run build 2>&1
  else
    npx next build 2>&1
  fi
  
  # Copy static files
  if [ -d ".next/standalone" ]; then
    cp -r public .next/standalone/public 2>/dev/null || true
    mkdir -p .next/standalone/.next
    cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
    
    cd .next/standalone
    exec node server.js
  fi
fi

# Fallback: Start dev server
echo "Starting dev server..."
if [ ! -d "node_modules" ]; then
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
