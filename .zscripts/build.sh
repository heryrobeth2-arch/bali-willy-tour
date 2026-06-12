#!/bin/bash
exec 2>&1

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NEXTJS_PROJECT_DIR="/home/z/my-project"

cd "$NEXTJS_PROJECT_DIR" || exit 1

export NEXT_TELEMETRY_DISABLED=1

echo "🚀 开始构建 Bali Willy Tour..."

# 安装依赖
echo "📦 安装依赖..."
bun install 2>&1 || npm install 2>&1

# 构建 Next.js 应用
echo "🔨 构建 Next.js 应用..."
bun run build 2>&1 || npx next build 2>&1

BUILD_DIR="/tmp/build_fullstack_$BUILD_ID"

if [ -z "$BUILD_ID" ]; then
    echo "⚠️  No BUILD_ID set, skipping artifact creation"
    exit 0
fi

echo "📁 创建构建目录: $BUILD_DIR"
rm -rf "$BUILD_DIR" 2>/dev/null
mkdir -p "$BUILD_DIR"

# === CRITICAL: Copy source code + config to ROOT (for dev mode) ===
# The platform's /start.sh runs .zscripts/dev.sh which does "bun run dev"
# Dev mode needs source code and package.json at the root level

echo "  - 复制源代码 (src/)"
cp -r src "$BUILD_DIR/src"

echo "  - 复制配置文件"
cp next.config.ts "$BUILD_DIR/next.config.ts"
cp package.json "$BUILD_DIR/package.json"
cp bun.lock "$BUILD_DIR/bun.lock" 2>/dev/null || cp bun.lockb "$BUILD_DIR/bun.lockb" 2>/dev/null || true
cp tailwind.config.ts "$BUILD_DIR/tailwind.config.ts" 2>/dev/null || true
cp postcss.config.mjs "$BUILD_DIR/postcss.config.mjs" 2>/dev/null || true
cp tsconfig.json "$BUILD_DIR/tsconfig.json" 2>/dev/null || true
cp components.json "$BUILD_DIR/components.json" 2>/dev/null || true
cp eslint.config.mjs "$BUILD_DIR/eslint.config.mjs" 2>/dev/null || true
cp next-env.d.ts "$BUILD_DIR/next-env.d.ts" 2>/dev/null || true
cp .env "$BUILD_DIR/.env" 2>/dev/null || true
cp .env.local "$BUILD_DIR/.env.local" 2>/dev/null || true
cp .gitignore "$BUILD_DIR/.gitignore" 2>/dev/null || true

echo "  - 复制 public/"
cp -r public "$BUILD_DIR/public" 2>/dev/null || true

# Copy .zscripts with dev.sh
echo "  - 复制 .zscripts/"
mkdir -p "$BUILD_DIR/.zscripts"
cp .zscripts/dev.sh "$BUILD_DIR/.zscripts/dev.sh"
chmod +x "$BUILD_DIR/.zscripts/dev.sh"

# === Also include standalone build as fallback ===
if [ -d ".next/standalone" ]; then
    echo "  - 复制 .next/standalone -> next-service-dist/"
    cp -r .next/standalone "$BUILD_DIR/next-service-dist/"
    if [ -d ".next/static" ]; then
        mkdir -p "$BUILD_DIR/next-service-dist/.next"
        cp -r .next/static "$BUILD_DIR/next-service-dist/.next/"
    fi
    if [ -d "public" ] && [ ! -d "$BUILD_DIR/next-service-dist/public" ]; then
        cp -r public "$BUILD_DIR/next-service-dist/public"
    fi
fi

# Copy Caddyfile
if [ -f "Caddyfile" ]; then
    echo "  - 复制 Caddyfile"
    cp Caddyfile "$BUILD_DIR/"
fi

# Copy start.sh
if [ -f "$SCRIPT_DIR/start.sh" ]; then
    echo "  - 复制 start.sh"
    cp "$SCRIPT_DIR/start.sh" "$BUILD_DIR/start.sh"
    chmod +x "$BUILD_DIR/start.sh"
fi

# 打包
PACKAGE_FILE="${BUILD_DIR}.tar.gz"
echo "📦 打包..."
cd "$BUILD_DIR" || exit 1
tar -czf "$PACKAGE_FILE" .
cd - > /dev/null || exit 1

echo "✅ 构建完成！"
ls -lh "$PACKAGE_FILE"
