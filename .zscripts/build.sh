#!/bin/bash
# Bali Willy Tour - Build Script for Space-Z Platform
# Creates deployment artifact with standalone production build

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Build ==="

# [1/4] Install dependencies
echo "[1/4] Installing dependencies..."
if command -v bun &>/dev/null; then
  bun install 2>&1
elif [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi

# [2/4] Build standalone production output
echo "[2/4] Building standalone production..."
if command -v bun &>/dev/null; then
  bun run build 2>&1
else
  npx next build 2>&1
fi

# Verify standalone output
if [ ! -f ".next/standalone/server.js" ]; then
  echo "ERROR: Standalone build failed - server.js not found!"
  echo "Make sure next.config.ts has output: 'standalone'"
  exit 1
fi
echo "  ✓ Standalone build successful"

# [3/4] Copy static files into standalone directory
echo "[3/4] Copying static files..."
# Copy public/ → .next/standalone/public/
if [ -d "public" ]; then
  cp -r public .next/standalone/public 2>/dev/null || true
  echo "  ✓ public/ copied"
fi
# Copy .next/static/ → .next/standalone/.next/static/
if [ -d ".next/static" ]; then
  mkdir -p .next/standalone/.next
  cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
  echo "  ✓ .next/static/ copied"
fi
# Copy Caddyfile → .next/standalone/Caddyfile
if [ -f "Caddyfile" ]; then
  cp Caddyfile .next/standalone/Caddyfile
  echo "  ✓ Caddyfile copied"
fi
# Copy .zscripts (dev.sh, start.sh) → .next/standalone/.zscripts/
if [ -d ".zscripts" ]; then
  mkdir -p .next/standalone/.zscripts
  cp .zscripts/dev.sh .next/standalone/.zscripts/dev.sh 2>/dev/null || true
  cp .zscripts/start.sh .next/standalone/.zscripts/start.sh 2>/dev/null || true
  chmod +x .next/standalone/.zscripts/*.sh 2>/dev/null || true
  echo "  ✓ .zscripts/ copied"
fi

# [4/4] Create deployment artifact
if [ -n "$BUILD_ID" ]; then
  echo "[4/4] Creating deployment artifact..."
  ARTIFACT="/tmp/build_fullstack_${BUILD_ID}"

  # Package from the standalone directory (flattened structure)
  # The platform expects: server.js at root, Caddyfile at root, .zscripts/ at root
  cd .next/standalone

  tar czf "${ARTIFACT}.tar.gz" \
    --exclude='./node_modules/.cache' \
    --exclude='./src' \
    .

  cd /home/z/my-project

  SIZE=$(du -sh "${ARTIFACT}.tar.gz" 2>/dev/null | cut -f1 || echo "unknown")
  echo "Artifact created: ${ARTIFACT}.tar.gz ($SIZE)"

  # Verify critical files in artifact
  echo "Verifying artifact contents..."
  tar tzf "${ARTIFACT}.tar.gz" | head -30
  echo "---"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "server\.js" && echo "  ✓ server.js" || echo "  ✗ server.js MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "Caddyfile" && echo "  ✓ Caddyfile" || echo "  ✗ Caddyfile MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.zscripts/dev\.sh" && echo "  ✓ .zscripts/dev.sh" || echo "  ✗ .zscripts/dev.sh MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.next/static" && echo "  ✓ .next/static" || echo "  ✗ .next/static MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "public/" && echo "  ✓ public/" || echo "  ✗ public/ MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "package\.json" && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
else
  echo "[4/4] No BUILD_ID set, skipping artifact creation"
fi

echo "=== Build Complete ==="
