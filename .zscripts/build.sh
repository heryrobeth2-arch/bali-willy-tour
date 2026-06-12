#!/bin/bash
# Bali Willy Tour - Build Script for Space-Z Platform
# Follows platform Z.ai recommended configuration
# Creates a SOURCE CODE artifact for dev mode deployment
# allowedDevOrigins works in dev mode, allowing iframe preview

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour - Build ==="

# Install dependencies
echo "Installing dependencies..."
if command -v bun &>/dev/null; then
  bun install 2>&1
elif [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi

# Create deployment artifact (source code for dev mode)
# bun run dev compiles on-the-fly, no pre-build needed
if [ -n "$BUILD_ID" ]; then
  echo "Creating deployment artifact..."
  ARTIFACT="/tmp/build_fullstack_${BUILD_ID}"

  tar czf "${ARTIFACT}.tar.gz" \
    --exclude='./node_modules' \
    --exclude='./.next' \
    --exclude='./.git' \
    --exclude='./skills' \
    --exclude='./agent-ctx' \
    --exclude='./worklog.md' \
    --exclude='./download' \
    --exclude='.DS_Store' \
    .

  SIZE=$(du -sh "${ARTIFACT}.tar.gz" 2>/dev/null | cut -f1 || echo "unknown")
  echo "Artifact created: ${ARTIFACT}.tar.gz ($SIZE)"

  # Verify critical files
  echo "Verifying artifact..."
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "\.zscripts/dev\.sh" && echo "  ✓ .zscripts/dev.sh" || echo "  ✗ .zscripts/dev.sh MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "next\.config" && echo "  ✓ next.config" || echo "  ✗ next.config MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "package\.json" && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
  tar tzf "${ARTIFACT}.tar.gz" | grep -q "src/app" && echo "  ✓ src/app/" || echo "  ✗ src/app/ MISSING"
else
  echo "No BUILD_ID set, skipping artifact creation"
fi

echo "=== Build Complete ==="
