#!/bin/bash
# Bali Willy Tour - Build Script
# Creates deployment artifact with BOTH formats for maximum compatibility:
# 1. next-service-dist/ - standalone server (for platform's deployed container)
# 2. Full project structure (for dev.sh compatibility)

exec 2>&1
set -e

cd /home/z/my-project || exit 1
export NEXT_TELEMETRY_DISABLED=1

echo "=== Bali Willy Tour Build ==="

# Install dependencies
echo "Installing dependencies..."
if [ -f "package-lock.json" ]; then
  npm ci --prefer-offline 2>&1 || npm install 2>&1
else
  npm install 2>&1
fi

# Build Next.js with standalone output
echo "Building Next.js..."
npx next build 2>&1

# Prepare standalone: copy static and public into standalone directory
if [ -d ".next/standalone" ]; then
  echo "Preparing standalone server..."
  if [ ! -d ".next/standalone/.next/static" ] && [ -d ".next/static" ]; then
    cp -r .next/static .next/standalone/.next/
  fi
  if [ ! -d ".next/standalone/public" ] && [ -d "public" ]; then
    cp -r public .next/standalone/
  fi
  echo "Standalone server ready!"
else
  echo "WARNING: Standalone output not found! Build may have failed."
fi

echo "Build complete!"

# Create deployment artifact
if [ -n "$BUILD_ID" ]; then
    ARTIFACT_DIR="/tmp/build_fullstack_${BUILD_ID}"
    echo "Creating deployment artifact: ${ARTIFACT_DIR}"

    rm -rf "$ARTIFACT_DIR" 2>/dev/null || true
    mkdir -p "$ARTIFACT_DIR"

    # === FORMAT 1: next-service-dist (for deployed container) ===
    # This is what the platform's deployed container looks for
    if [ -d ".next/standalone" ]; then
        echo "  - Creating next-service-dist/ from standalone..."
        cp -r .next/standalone "$ARTIFACT_DIR/next-service-dist/"
    fi

    # === FORMAT 2: Full project files (for dev.sh compatibility) ===
    echo "  - Copying project files for dev.sh compatibility..."
    cp -r .zscripts "$ARTIFACT_DIR/"
    cp package.json package-lock.json "$ARTIFACT_DIR/"
    cp Caddyfile "$ARTIFACT_DIR/" 2>/dev/null || true
    cp next.config.ts tsconfig.json "$ARTIFACT_DIR/" 2>/dev/null || true
    cp -r public "$ARTIFACT_DIR/"
    cp -r src "$ARTIFACT_DIR/"
    cp .env "$ARTIFACT_DIR/" 2>/dev/null || true
    cp .gitignore "$ARTIFACT_DIR/" 2>/dev/null || true
    cp components.json "$ARTIFACT_DIR/" 2>/dev/null || true
    cp eslint.config.mjs "$ARTIFACT_DIR/" 2>/dev/null || true
    cp postcss.config.mjs "$ARTIFACT_DIR/" 2>/dev/null || true
    cp tailwind.config.ts "$ARTIFACT_DIR/" 2>/dev/null || true
    cp next-env.d.ts "$ARTIFACT_DIR/" 2>/dev/null || true

    # Copy .next (without cache)
    mkdir -p "$ARTIFACT_DIR/.next"
    cp -r .next/standalone "$ARTIFACT_DIR/.next/"
    cp -r .next/static "$ARTIFACT_DIR/.next/"
    cp .next/BUILD_ID "$ARTIFACT_DIR/.next/" 2>/dev/null || true
    cp .next/package.json "$ARTIFACT_DIR/.next/" 2>/dev/null || true
    cp .next/routes-manifest.json "$ARTIFACT_DIR/.next/" 2>/dev/null || true
    cp .next/prerender-manifest.json "$ARTIFACT_DIR/.next/" 2>/dev/null || true
    cp .next/required-server-files.json "$ARTIFACT_DIR/.next/" 2>/dev/null || true

    # Create empty db directory
    mkdir -p "$ARTIFACT_DIR/db"

    # Copy start.sh (entry point for deployed container)
    echo "  - Copying start.sh"
    cp .zscripts/start.sh "$ARTIFACT_DIR/start.sh"
    chmod +x "$ARTIFACT_DIR/start.sh"

    # Verify critical files
    echo "  - Verifying artifact..."
    [ -f "$ARTIFACT_DIR/next-service-dist/server.js" ] && echo "    ✓ next-service-dist/server.js" || echo "    ✗ next-service-dist/server.js MISSING"
    [ -f "$ARTIFACT_DIR/next-service-dist/.next/BUILD_ID" ] && echo "    ✓ next-service-dist/.next/BUILD_ID" || echo "    ✗ next-service-dist/.next/BUILD_ID MISSING"
    [ -d "$ARTIFACT_DIR/next-service-dist/node_modules" ] && echo "    ✓ next-service-dist/node_modules" || echo "    ✗ next-service-dist/node_modules MISSING"
    [ -d "$ARTIFACT_DIR/next-service-dist/.next/static" ] && echo "    ✓ next-service-dist/.next/static" || echo "    ✗ next-service-dist/.next/static MISSING"
    [ -d "$ARTIFACT_DIR/next-service-dist/public" ] && echo "    ✓ next-service-dist/public" || echo "    ✗ next-service-dist/public MISSING"
    [ -f "$ARTIFACT_DIR/.zscripts/dev.sh" ] && echo "    ✓ .zscripts/dev.sh" || echo "    ✗ .zscripts/dev.sh MISSING"
    [ -f "$ARTIFACT_DIR/.next/standalone/server.js" ] && echo "    ✓ .next/standalone/server.js" || echo "    ✗ .next/standalone/server.js MISSING"
    [ -f "$ARTIFACT_DIR/package.json" ] && echo "    ✓ package.json" || echo "    ✗ package.json MISSING"
    [ -f "$ARTIFACT_DIR/start.sh" ] && echo "    ✓ start.sh" || echo "    ✗ start.sh MISSING"
    [ -f "$ARTIFACT_DIR/Caddyfile" ] && echo "    ✓ Caddyfile" || echo "    ✗ Caddyfile MISSING"

    # Package as plain tar (matching repo.tar format)
    PACKAGE_FILE="${ARTIFACT_DIR}.tar"
    echo "Packaging to $PACKAGE_FILE..."
    cd "$ARTIFACT_DIR" || exit 1
    tar -cf "$PACKAGE_FILE" .
    cd - > /dev/null || exit 1

    SIZE=$(du -sh "$PACKAGE_FILE" | cut -f1)
    echo "Build complete! Artifact: $PACKAGE_FILE ($SIZE)"

    # Also create gzipped and zip versions
    cd "$ARTIFACT_DIR" || exit 1
    tar -czf "${ARTIFACT_DIR}.tar.gz" .
    zip -r "${ARTIFACT_DIR}.zip" . > /dev/null 2>&1 || true
    cd - > /dev/null || exit 1

    echo "Also created ${ARTIFACT_DIR}.tar.gz and ${ARTIFACT_DIR}.zip"
fi
