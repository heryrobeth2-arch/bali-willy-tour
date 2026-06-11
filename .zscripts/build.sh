#!/bin/bash
# Bali Willy Tour - Build Script for Space-Z Platform
# Creates FLATTENED standalone deployment artifact
# After extraction: server.js at root, node_modules at root, etc.

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Build ==="

# [1/3] Install dependencies
echo "[1/3] Installing dependencies..."
if command -v bun &>/dev/null; then
  bun install 2>&1
elif [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi

# [2/3] Build standalone production output
echo "[2/3] Building standalone production..."
if command -v bun &>/dev/null; then
  bun run build 2>&1
else
  npx next build 2>&1
fi

# Verify standalone output
if [ ! -f ".next/standalone/server.js" ]; then
  echo "ERROR: Standalone build failed - server.js not found!"
  exit 1
fi
echo "  ✓ Standalone build successful"

# Copy static files into standalone directory
echo "Copying static files into standalone directory..."
if [ -d "public" ]; then
  rm -rf .next/standalone/public 2>/dev/null
  cp -r public .next/standalone/public
  echo "  ✓ public/ copied"
fi
if [ -d ".next/static" ]; then
  mkdir -p .next/standalone/.next
  rm -rf .next/standalone/.next/static 2>/dev/null
  cp -r .next/static .next/standalone/.next/static
  echo "  ✓ .next/static/ copied"
fi
if [ -f "Caddyfile" ]; then
  cp Caddyfile .next/standalone/Caddyfile
  echo "  ✓ Caddyfile copied"
fi
mkdir -p .next/standalone/.zscripts
cp .zscripts/dev.sh .next/standalone/.zscripts/dev.sh
cp .zscripts/start.sh .next/standalone/.zscripts/start.sh
chmod +x .next/standalone/.zscripts/*.sh
echo "  ✓ .zscripts/ copied"

# [3/3] Create deployment artifact (FLATTENED from standalone dir)
if [ -n "$BUILD_ID" ]; then
  echo "[3/3] Creating deployment artifact..."
  ARTIFACT="/tmp/build_fullstack_${BUILD_ID}"

  # Package from the standalone directory (flattened structure)
  # After platform extraction to /home/z/my-project/:
  #   /home/z/my-project/server.js
  #   /home/z/my-project/node_modules/
  #   /home/z/my-project/.next/
  #   /home/z/my-project/public/
  #   /home/z/my-project/Caddyfile
  #   /home/z/my-project/.zscripts/
  #   /home/z/my-project/package.json
  cd .next/standalone

  tar czf "${ARTIFACT}.tar.gz" \
    --exclude='./node_modules/.cache' \
    --exclude='./src' \
    .

  cd /home/z/my-project

  SIZE=$(du -sh "${ARTIFACT}.tar.gz" 2>/dev/null | cut -f1 || echo "unknown")
  echo "Artifact created: ${ARTIFACT}.tar.gz ($SIZE)"

  # Verify critical files
  echo "Verifying artifact..."
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "^\./server\.js$" && echo "  ✓ server.js at root" || echo "  ✗ server.js at root MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "Caddyfile" && echo "  ✓ Caddyfile" || echo "  ✗ Caddyfile MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.zscripts/dev\.sh" && echo "  ✓ .zscripts/dev.sh" || echo "  ✗ .zscripts/dev.sh MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.next/static" && echo "  ✓ .next/static" || echo "  ✗ .next/static MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "public/" && echo "  ✓ public/" || echo "  ✗ public/ MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "package\.json" && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "node_modules/next" && echo "  ✓ node_modules/next" || echo "  ✗ node_modules/next MISSING"
else
  echo "[3/3] No BUILD_ID set, skipping artifact creation"
fi

echo "=== Build Complete ==="
