#!/bin/bash
# Bali Willy Tour - Build Script for Space-Z Platform
# Creates a SOURCE CODE deployment artifact
# Runtime uses: npx next dev + NODE_OPTIONS="--require origin-stripper.js"
# This bypasses Next.js cross-origin check for iframe preview

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Build (Source Code Artifact) ==="

# Install dependencies
echo "[1/2] Installing dependencies..."
if command -v bun &>/dev/null; then
  bun install 2>&1
elif [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi

# Verify critical files exist
echo "Verifying critical files..."
[ -f "origin-stripper.js" ] && echo "  ✓ origin-stripper.js" || echo "  ✗ origin-stripper.js MISSING"
[ -f ".zscripts/dev.sh" ] && echo "  ✓ .zscripts/dev.sh" || echo "  ✗ .zscripts/dev.sh MISSING"
[ -f "src/middleware.ts" ] && echo "  ✓ src/middleware.ts" || echo "  ✗ src/middleware.ts MISSING"
[ -f "next.config.ts" ] && echo "  ✓ next.config.ts" || echo "  ✗ next.config.ts MISSING"
[ -f "package.json" ] && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"

# Create deployment artifact (source code only - no build needed)
# The dev server (npx next dev) compiles on-the-fly
if [ -n "$BUILD_ID" ]; then
  echo "[2/2] Creating deployment artifact..."
  ARTIFACT="/tmp/build_fullstack_${BUILD_ID}"

  tar czf "${ARTIFACT}.tar.gz" \
    --exclude='./node_modules' \
    --exclude='./.next' \
    --exclude='./.git' \
    --exclude='./skills' \
    --exclude='./.zscripts.backup' \
    --exclude='./.zscripts.backup2' \
    --exclude='./agent-ctx' \
    --exclude='./worklog.md' \
    --exclude='./download' \
    --exclude='./custom-server.js' \
    --exclude='.DS_Store' \
    .

  SIZE=$(du -sh "${ARTIFACT}.tar.gz" 2>/dev/null | cut -f1 || echo "unknown")
  echo "Artifact created: ${ARTIFACT}.tar.gz ($SIZE)"

  # Verify critical files in artifact
  echo "Verifying artifact contents..."
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "origin-stripper" && echo "  ✓ origin-stripper.js" || echo "  ✗ origin-stripper.js MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.zscripts/dev\.sh" && echo "  ✓ .zscripts/dev.sh" || echo "  ✗ .zscripts/dev.sh MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "next\.config" && echo "  ✓ next.config" || echo "  ✗ next.config MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "package\.json" && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "src/middleware" && echo "  ✓ src/middleware.ts" || echo "  ✗ src/middleware.ts MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "src/app" && echo "  ✓ src/app/" || echo "  ✗ src/app/ MISSING"
else
  echo "[2/2] No BUILD_ID set, skipping artifact creation"
fi

echo "=== Build Complete ==="
