#!/bin/bash
# Bali Willy Tour - Production Startup Script
# Uses standalone server for instant startup (no npm install needed)
cd /home/z/my-project || exit 1
export PORT=3000
export HOSTNAME=0.0.0.0
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

echo "=== Bali Willy Tour Starting ==="
echo "Node: $(node --version 2>/dev/null || echo 'NOT FOUND')"
echo "PWD: $PWD"

# PRIORITY 1: Try standalone server (fastest - no npm install needed)
if [ -f ".next/standalone/server.js" ]; then
  echo "Found standalone server - starting directly..."

  # Ensure static files are in place
  if [ ! -d ".next/standalone/.next/static" ] && [ -d ".next/static" ]; then
    echo "Copying .next/static to standalone..."
    cp -r .next/static .next/standalone/.next/ 2>/dev/null
  fi

  # Ensure public directory is in place
  if [ ! -d ".next/standalone/public" ] && [ -d "public" ]; then
    echo "Copying public to standalone..."
    cp -r public .next/standalone/ 2>/dev/null
  fi

  # Start standalone server from standalone directory
  # This is required because server.js does process.chdir(__dirname)
  echo "Starting Next.js standalone server on port 3000..."
  cd .next/standalone || exit 1
  exec node server.js
fi

# PRIORITY 2: Try next start if node_modules exists
if [ -f "node_modules/.bin/next" ] && [ -f ".next/BUILD_ID" ]; then
  echo "Found next binary and build - starting with next start..."
  exec node_modules/.bin/next start -p 3000 -H 0.0.0.0
fi

# PRIORITY 3: Need to install deps and/or build (slow path)
echo "No standalone or next binary found - installing dependencies..."

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
  if [ -f "package-lock.json" ]; then
    npm ci --prefer-offline 2>&1 || npm install 2>&1
  else
    npm install 2>&1
  fi
fi

if [ ! -f ".next/BUILD_ID" ]; then
  echo "Building Next.js..."
  npx next build 2>&1
fi

# Try standalone again after build
if [ -f ".next/standalone/server.js" ]; then
  if [ ! -d ".next/standalone/.next/static" ] && [ -d ".next/static" ]; then
    cp -r .next/static .next/standalone/.next/ 2>/dev/null
  fi
  if [ ! -d ".next/standalone/public" ] && [ -d "public" ]; then
    cp -r public .next/standalone/ 2>/dev/null
  fi
  cd .next/standalone || exit 1
  exec node server.js
else
  exec node_modules/.bin/next start -p 3000 -H 0.0.0.0
fi
