#!/bin/bash
# Bali Willy Tour - Build Script (Minimal)
# Platform uses `bun run dev` - no need for pre-build in deployed container

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour Build ==="

# Install dependencies (for local build verification)
if [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi

# Build locally to verify the project compiles
echo "Building for verification..."
npx next build 2>&1

echo "Build verified!"

# Create deployment artifact - MINIMAL
if [ -n "$BUILD_ID" ]; then
    ARTIFACT="/tmp/build_fullstack_${BUILD_ID}"
    echo "Creating deployment artifact: ${ARTIFACT}.tar"

    # Include ONLY what's needed for bun install + bun run dev
    # No node_modules, no .next (bun run dev compiles on-the-fly)
    tar cf "${ARTIFACT}.tar" \
      --exclude='./node_modules' \
      --exclude='.git' \
      --exclude='./.next' \
      --exclude='skills' --exclude='upload' --exclude='download' \
      --exclude='agent-ctx' --exclude='db' --exclude='*.log' \
      --exclude='keep-alive.sh' --exclude='bun.lock' \
      --exclude='.pm2' --exclude='.zscripts.backup' \
      --exclude='serve-static.js' --exclude='.zscripts/dev.sh.bak' \
      --exclude='.zscripts/start.sh.bak' --exclude='.zscripts/dev.pid' \
      --exclude='.zscripts/watchdog.sh' \
      --exclude='.zscripts/mini-services-*' \
      .

    SIZE=$(du -sh "${ARTIFACT}.tar" | cut -f1)
    echo "Artifact created: ${ARTIFACT}.tar ($SIZE)"

    # Verify critical files
    tar tf "${ARTIFACT}.tar" | grep -q "package\.json" && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
    tar tf "${ARTIFACT}.tar" | grep -q "next\.config" && echo "  ✓ next.config" || echo "  ✗ next.config MISSING"
    tar tf "${ARTIFACT}.tar" | grep -q "src/app" && echo "  ✓ src/app" || echo "  ✗ src/app MISSING"
    # Verify NO dev.sh (so platform uses default bun flow)
    tar tf "${ARTIFACT}.tar" | grep -q "dev\.sh$" && echo "  ✗ dev.sh FOUND (should not exist!)" || echo "  ✓ No dev.sh (platform will use bun flow)"

    gzip -c "${ARTIFACT}.tar" > "${ARTIFACT}.tar.gz" 2>/dev/null || true
fi
