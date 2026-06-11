#!/bin/bash
# Bali Willy Tour - Production Build Script (Standalone Mode)
# This script is called by the Space-Z deploy API during "Publish → Update"
# It builds the Next.js project in standalone mode and creates a deployment artifact
# The artifact contains the FULL project so the deployed container can either:
#   1. Use the standalone server (.next/standalone/server.js) for production
#   2. Fall back to bun run dev if standalone doesn't work

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Production Build (Standalone) ==="

# Step 1: Install dependencies
echo "[1/4] Installing dependencies..."
if [ -f "bun.lock" ]; then
  bun install 2>&1
elif [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi

# Step 2: Build Next.js in standalone mode
echo "[2/4] Building Next.js (standalone mode)..."
npx next build 2>&1

# Verify standalone output exists
if [ ! -d ".next/standalone" ]; then
  echo "ERROR: .next/standalone directory not found! Build may have failed."
  exit 1
fi
echo "  ✓ .next/standalone created"

# Copy static assets into the standalone directory
echo "[3/4] Copying static assets into standalone directory..."

# Copy public/ to .next/standalone/public/
if [ -d "public" ]; then
  rm -rf .next/standalone/public 2>/dev/null
  cp -r public .next/standalone/public 2>/dev/null || true
  echo "  ✓ public/ → .next/standalone/public/"
fi

# Copy .next/static/ to .next/standalone/.next/static/
if [ -d ".next/static" ]; then
  rm -rf .next/standalone/.next/static 2>/dev/null
  mkdir -p .next/standalone/.next/static
  cp -r .next/static/* .next/standalone/.next/static/ 2>/dev/null || true
  echo "  ✓ .next/static/ → .next/standalone/.next/static/"
fi

# Copy Caddyfile into standalone directory
if [ -f "Caddyfile" ]; then
  cp Caddyfile .next/standalone/Caddyfile 2>/dev/null || true
  echo "  ✓ Caddyfile → .next/standalone/Caddyfile"
fi

# Copy .zscripts into standalone directory for start.sh reference
mkdir -p .next/standalone/.zscripts
cp .zscripts/start.sh .next/standalone/.zscripts/start.sh 2>/dev/null || true
cp .zscripts/dev.sh .next/standalone/.zscripts/dev.sh 2>/dev/null || true
chmod +x .next/standalone/.zscripts/*.sh 2>/dev/null || true
echo "  ✓ .zscripts/ → .next/standalone/.zscripts/"

# Step 4: Create deployment artifact
# This contains the FULL project directory so the deployed container
# can use either standalone mode or dev mode
if [ -n "$BUILD_ID" ]; then
  echo "[4/4] Creating deployment artifact..."
  ARTIFACT="/tmp/build_fullstack_${BUILD_ID}"

  tar czf "${ARTIFACT}.tar.gz" \
    --exclude='./node_modules' \
    --exclude='./.next/cache' \
    --exclude='.git' \
    --exclude='./skills' \
    --exclude='./download' \
    --exclude='./upload' \
    --exclude='./agent-ctx' \
    --exclude='./db' \
    --exclude='./out' \
    --exclude='./mini-services' \
    --exclude='./mini-services-dist' \
    --exclude='./next-service-dist' \
    --exclude='.pm2' \
    --exclude='*.log' \
    --exclude='./serve-static.js' \
    --exclude='./.zscripts/*.bak' \
    --exclude='./.zscripts/dev.pid' \
    --exclude='./.zscripts/watchdog.sh' \
    --exclude='./.zscripts/mini-services-*' \
    .

  SIZE=$(du -sh "${ARTIFACT}.tar.gz" 2>/dev/null | cut -f1 || echo "unknown")
  echo "Artifact created: ${ARTIFACT}.tar.gz ($SIZE)"

  # Verify critical files in artifact
  echo "Verifying artifact contents..."
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "package\.json" && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "src/app" && echo "  ✓ src/app/" || echo "  ✗ src/app/ MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.next/standalone/server\.js" && echo "  ✓ .next/standalone/server.js" || echo "  ✗ .next/standalone/server.js MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.next/standalone/\.next/static" && echo "  ✓ .next/standalone/.next/static" || echo "  ✗ .next/standalone/.next/static MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.next/standalone/public" && echo "  ✓ .next/standalone/public/" || echo "  ✗ .next/standalone/public/ MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "Caddyfile" && echo "  ✓ Caddyfile" || echo "  ✗ Caddyfile MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.zscripts/dev\.sh" && echo "  ✓ .zscripts/dev.sh" || echo "  ✗ .zscripts/dev.sh MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "next\.config" && echo "  ✓ next.config" || echo "  ✗ next.config MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "skills" && echo "  ✗ skills/ FOUND (should be excluded!)" || echo "  ✓ skills/ excluded"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "node_modules" && echo "  ✗ root node_modules/ FOUND (should be excluded!)" || echo "  ✓ root node_modules/ excluded"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "standalone/node_modules" && echo "  ✓ .next/standalone/node_modules/" || echo "  ✗ standalone node_modules MISSING"
else
  echo "[4/4] No BUILD_ID set, skipping artifact creation (dev mode)"
fi

echo "=== Build Complete ==="
