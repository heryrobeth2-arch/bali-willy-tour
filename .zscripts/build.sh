#!/bin/bash

# 将 stderr 重定向到 stdout
exec 2>&1

set -e

NEXTJS_PROJECT_DIR="/home/z/my-project"

if [ ! -d "$NEXTJS_PROJECT_DIR" ]; then
    echo "ERROR: Project directory not found: $NEXTJS_PROJECT_DIR"
    exit 1
fi

echo "Building Bali Willy Tour..."
cd "$NEXTJS_PROJECT_DIR" || exit 1

export NEXT_TELEMETRY_DISABLED=1

BUILD_DIR="/tmp/build_fullstack_$BUILD_ID"
echo "Build directory: $BUILD_DIR"
rm -rf "$BUILD_DIR" 2>/dev/null
mkdir -p "$BUILD_DIR"

# Install dependencies
echo "Installing dependencies..."
bun install

# Build Next.js (required for output: standalone in next.config.ts)
echo "Building Next.js application..."
bun run build

# Copy ALL source files for dev mode deployment
# The container runs .zscripts/dev.sh which executes "bun run dev"
# Dev mode compiles on-the-fly, but we also include standalone as fallback
echo "Collecting files for deployment artifact..."

# Copy source code directly (NOT into subdirectory - avoids double nesting)
cp -r src "$BUILD_DIR/src"

# Copy config files
cp next.config.ts "$BUILD_DIR/next.config.ts"
cp package.json "$BUILD_DIR/package.json"
cp bun.lock "$BUILD_DIR/bun.lock" 2>/dev/null || true
cp tailwind.config.ts "$BUILD_DIR/tailwind.config.ts" 2>/dev/null || true
cp postcss.config.mjs "$BUILD_DIR/postcss.config.mjs" 2>/dev/null || true
cp tsconfig.json "$BUILD_DIR/tsconfig.json" 2>/dev/null || true
cp components.json "$BUILD_DIR/components.json" 2>/dev/null || true
cp eslint.config.mjs "$BUILD_DIR/eslint.config.mjs" 2>/dev/null || true
cp next-env.d.ts "$BUILD_DIR/next-env.d.ts" 2>/dev/null || true
cp Caddyfile "$BUILD_DIR/Caddyfile" 2>/dev/null || true
cp .env "$BUILD_DIR/.env" 2>/dev/null || true
cp .env.local "$BUILD_DIR/.env.local" 2>/dev/null || true
cp .gitignore "$BUILD_DIR/.gitignore" 2>/dev/null || true

# Copy public directory
cp -r public "$BUILD_DIR/public" 2>/dev/null || true

# Copy standalone build as fallback
if [ -d ".next/standalone" ]; then
    echo "  - Copying standalone build as fallback"
    cp -r .next/standalone "$BUILD_DIR/next-service-dist"
    # Copy static files into standalone
    if [ -d ".next/static" ]; then
        mkdir -p "$BUILD_DIR/next-service-dist/.next"
        cp -r .next/static "$BUILD_DIR/next-service-dist/.next/"
    fi
    # Copy public into standalone
    if [ -d "public" ] && [ ! -d "$BUILD_DIR/next-service-dist/public" ]; then
        cp -r public "$BUILD_DIR/next-service-dist/public"
    fi
fi

# Copy .zscripts with dev.sh
mkdir -p "$BUILD_DIR/.zscripts"
cp .zscripts/dev.sh "$BUILD_DIR/.zscripts/dev.sh"
chmod +x "$BUILD_DIR/.zscripts/dev.sh"

echo "  - All files collected"

# Package into tar.gz
PACKAGE_FILE="${BUILD_DIR}.tar.gz"
echo "Packaging to $PACKAGE_FILE..."
cd "$BUILD_DIR" || exit 1
tar -czf "$PACKAGE_FILE" .
cd - > /dev/null || exit 1

echo ""
echo "Build complete! Package: $PACKAGE_FILE"
ls -lh "$PACKAGE_FILE"
