#!/bin/bash
# Bali Willy Tour - Production Build Script (Standalone Mode)
# This script is called by the Space-Z deploy API during "Publish → Update"
# It builds the Next.js project in standalone mode and creates a deployment artifact

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Production Build (Standalone) ==="

# Step 1: Install dependencies
echo "[1/5] Installing dependencies..."
if [ -f "bun.lock" ]; then
  bun install 2>&1
elif [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi

# Step 2: Build Next.js in standalone mode
echo "[2/5] Building Next.js (standalone mode)..."
npx next build 2>&1

# Verify standalone output exists
if [ ! -d ".next/standalone" ]; then
  echo "ERROR: .next/standalone directory not found! Build may have failed."
  exit 1
fi
echo "  ✓ .next/standalone created"

# Step 3: Copy static assets to standalone directory
echo "[3/5] Copying static assets..."
# Copy public folder
if [ -d "public" ]; then
  rm -rf .next/standalone/public 2>/dev/null
  cp -r public .next/standalone/public 2>/dev/null || true
  echo "  ✓ public/ copied"
fi

# Copy static files (.next/static) to standalone/.next/static
if [ -d ".next/static" ]; then
  rm -rf .next/standalone/.next/static 2>/dev/null
  mkdir -p .next/standalone/.next/static
  cp -r .next/static/* .next/standalone/.next/static/ 2>/dev/null || true
  echo "  ✓ .next/static copied"
fi

# Copy Caddyfile into standalone directory
if [ -f "Caddyfile" ]; then
  cp Caddyfile .next/standalone/Caddyfile 2>/dev/null || true
  echo "  ✓ Caddyfile copied"
fi

# Copy .zscripts/start.sh into standalone directory
mkdir -p .next/standalone/.zscripts
cp .zscripts/start.sh .next/standalone/.zscripts/start.sh 2>/dev/null || true
cp .zscripts/dev.sh .next/standalone/.zscripts/dev.sh 2>/dev/null || true
chmod +x .next/standalone/.zscripts/*.sh 2>/dev/null || true
echo "  ✓ .zscripts/ copied"

# Step 4: Build mini-services (if any)
echo "[4/5] Building mini-services..."
if [ -d "mini-services" ] && [ -f ".zscripts/mini-services-build.sh" ]; then
  bash .zscripts/mini-services-build.sh 2>&1 || echo "  ℹ Mini-services build skipped"
else
  echo "  ℹ No mini-services to build"
fi

# Step 5: Create deployment artifact from standalone directory
if [ -n "$BUILD_ID" ]; then
  echo "[5/5] Creating deployment artifact..."
  ARTIFACT="/tmp/build_fullstack_${BUILD_ID}"
  STANDALONE_DIR=".next/standalone"

  # Create clean artifact - ONLY standalone directory contents
  # Exclude unnecessary files that bloat the artifact
  cd "$STANDALONE_DIR" || exit 1

  tar czf "${ARTIFACT}.tar.gz" \
    --exclude='./node_modules/.cache' \
    --exclude='./.git' \
    --exclude='./skills' \
    --exclude='./download' \
    --exclude='./upload' \
    --exclude='./agent-ctx' \
    --exclude='./db' \
    --exclude='./src' \
    --exclude='./out' \
    --exclude='./.next/cache' \
    --exclude='*.log' \
    --exclude='./.zscripts/mini-services-*' \
    --exclude='./.zscripts/watchdog.sh' \
    --exclude='./.zscripts/dev.pid' \
    --exclude='./.zscripts/*.bak' \
    .

  cd /home/z/my-project || exit 1

  SIZE=$(du -sh "${ARTIFACT}.tar.gz" 2>/dev/null | cut -f1 || echo "unknown")
  echo "Artifact created: ${ARTIFACT}.tar.gz ($SIZE)"

  # Verify critical files in artifact
  echo "Verifying artifact contents..."
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "package\.json" && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "server\.js" && echo "  ✓ server.js" || echo "  ✗ server.js MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.next/static" && echo "  ✓ .next/static" || echo "  ✗ .next/static MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "public" && echo "  ✓ public/" || echo "  ✗ public/ MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "Caddyfile" && echo "  ✓ Caddyfile" || echo "  ✗ Caddyfile MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "node_modules" && echo "  ✓ node_modules/" || echo "  ✗ node_modules/ MISSING"
else
  echo "[5/5] No BUILD_ID set, skipping artifact creation (dev mode)"
fi

echo "=== Build Complete ==="
