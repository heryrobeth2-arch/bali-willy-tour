#!/bin/bash
# Bali Willy Tour - Build Script for Space-Z Platform
# Creates a FULL PROJECT deployment artifact
# The deployment container will install deps and run dev mode

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Build ==="

# [1/3] Install dependencies and build (to verify the project compiles)
echo "[1/3] Installing dependencies..."
if command -v bun &>/dev/null; then
  bun install 2>&1
elif [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi

# [2/3] Build to verify project compiles successfully
echo "[2/3] Building project to verify compilation..."
if command -v bun &>/dev/null; then
  bun run build 2>&1
else
  npx next build 2>&1
fi
echo "  ✓ Build successful - project compiles correctly"

# [3/3] Create deployment artifact with FULL PROJECT
if [ -n "$BUILD_ID" ]; then
  echo "[3/3] Creating deployment artifact..."
  ARTIFACT="/tmp/build_fullstack_${BUILD_ID}"

  # Create artifact from project root with source code and config files
  # Do NOT include node_modules (too large, will install in deployment container)
  # Do NOT include .next/ build output (dev mode rebuilds it)
  tar czf "${ARTIFACT}.tar.gz" \
    --exclude='./node_modules' \
    --exclude='./node_modules_standalone' \
    --exclude='./.next' \
    --exclude='./next-service-dist' \
    --exclude='./download' \
    --exclude='./.git' \
    --exclude='./bootstrap' \
    --exclude='./db' \
    --exclude='./upload' \
    --exclude='./skills' \
    --exclude='./.zscripts.backup' \
    --exclude='./bun.lock' \
    --exclude='./package-lock.json' \
    --exclude='./.env' \
    --exclude='./.env.local' \
    --exclude='./startup.log' \
    --exclude='./*.bak' \
    --exclude='./.zscripts/*.bak' \
    --exclude='./.zscripts/*.pid' \
    --exclude='./serve-static.js' \
    --exclude='./worklog.md' \
    .

  SIZE=$(du -sh "${ARTIFACT}.tar.gz" 2>/dev/null | cut -f1 || echo "unknown")
  echo "Artifact created: ${ARTIFACT}.tar.gz ($SIZE)"

  # Verify critical files
  echo "Verifying artifact..."
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "package\.json" && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "next\.config" && echo "  ✓ next.config" || echo "  ✗ next.config MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.zscripts/dev\.sh" && echo "  ✓ .zscripts/dev.sh" || echo "  ✗ .zscripts/dev.sh MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "src/app" && echo "  ✓ src/app" || echo "  ✗ src/app MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "public/" && echo "  ✓ public/" || echo "  ✗ public/ MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "Caddyfile" && echo "  ✓ Caddyfile" || echo "  ✗ Caddyfile MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "tsconfig" && echo "  ✓ tsconfig" || echo "  ✗ tsconfig MISSING"
else
  echo "[3/3] No BUILD_ID set, skipping artifact creation"
fi

echo "=== Build Complete ==="
