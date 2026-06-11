#!/bin/bash
# Bali Willy Tour - Build Script
# Creates a minimal deployment artifact with just source code
# The deployment container will run: bun install && bun run dev

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Build ==="

# Verify the project builds successfully
echo "[1/3] Verifying build..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  if command -v bun &>/dev/null; then
    bun install 2>&1
  elif [ -f "package-lock.json" ]; then
    npm ci --prefer-offline 2>&1 || npm install 2>&1
  else
    npm install 2>&1
  fi
fi

# Quick build check (don't need to keep the output)
echo "Running build verification..."
npx next build 2>&1 | tail -5
echo "  ✓ Build verified"

# Create minimal deployment artifact
if [ -n "$BUILD_ID" ]; then
  echo "[2/3] Creating deployment artifact..."
  ARTIFACT="/tmp/build_fullstack_${BUILD_ID}"

  # Package ONLY what's needed for bun install + bun run dev
  # No node_modules, no .next - those will be created in the deployment container
  tar czf "${ARTIFACT}.tar.gz" \
    --exclude='./node_modules' \
    --exclude='.git' \
    --exclude='./.next' \
    --exclude='./out' \
    --exclude='./skills' \
    --exclude='./download' \
    --exclude='./upload' \
    --exclude='./agent-ctx' \
    --exclude='./db' \
    --exclude='./mini-services' \
    --exclude='./mini-services-dist' \
    --exclude='./next-service-dist' \
    --exclude='.pm2' \
    --exclude='*.log' \
    --exclude='./serve-static.js' \
    --exclude='./.zscripts.backup' \
    --exclude='./.zscripts/*.bak' \
    --exclude='./.zscripts/dev.pid' \
    --exclude='./.zscripts/watchdog.sh' \
    --exclude='./.zscripts/mini-services-*' \
    --exclude='./.zscripts/build.sh' \
    --exclude='./worklog.md' \
    --exclude='./bootstrap' \
    .

  SIZE=$(du -sh "${ARTIFACT}.tar.gz" 2>/dev/null | cut -f1 || echo "unknown")
  echo "Artifact created: ${ARTIFACT}.tar.gz ($SIZE)"

  # Verify critical files
  echo "[3/3] Verifying artifact..."
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "package\.json" && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "bun\.lock" && echo "  ✓ bun.lock" || echo "  ✗ bun.lock MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "src/app" && echo "  ✓ src/app/" || echo "  ✗ src/app/ MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "next\.config" && echo "  ✓ next.config" || echo "  ✗ next.config MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "public/" && echo "  ✓ public/" || echo "  ✗ public/ MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.zscripts/dev\.sh" && echo "  ✓ .zscripts/dev.sh" || echo "  ✗ .zscripts/dev.sh MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "Caddyfile" && echo "  ✓ Caddyfile" || echo "  ✗ Caddyfile MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "node_modules" && echo "  ✗ node_modules FOUND (should be excluded!)" || echo "  ✓ node_modules excluded"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.next" && echo "  ✗ .next FOUND (should be excluded!)" || echo "  ✓ .next excluded"
else
  echo "[2/3] No BUILD_ID set, skipping artifact creation"
fi

echo "=== Build Complete ==="
