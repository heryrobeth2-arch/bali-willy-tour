#!/bin/sh

set -e

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$SCRIPT_DIR"

# 存储所有子进程的 PID
pids=""

# 清理函数：优雅关闭所有服务
cleanup() {
    echo ""
    echo "🛑 正在关闭所有服务..."

    for pid in $pids; do
        if kill -0 "$pid" 2>/dev/null; then
            kill -TERM "$pid" 2>/dev/null
        fi
    done

    sleep 1
    for pid in $pids; do
        if kill -0 "$pid" 2>/dev/null; then
            kill -KILL "$pid" 2>/dev/null
        fi
    done

    echo "✅ 所有服务已关闭"
    exit 0
}

echo "🚀 启动 Bali Willy Tour..."
echo ""

# 切换到构建目录
cd "$BUILD_DIR" || exit 1

ls -lah

# 启动 Next.js 服务器
if [ -f "./next-service-dist/server.js" ]; then
    echo "🚀 启动 Next.js 服务器..."
    cd next-service-dist/ || exit 1

    # 设置环境变量
    export NODE_ENV=production
    export PORT="${PORT:-3000}"
    export HOSTNAME="${HOSTNAME:-0.0.0.0}"

    # 后台启动 Next.js
    bun server.js &
    NEXT_PID=$!
    pids="$NEXT_PID"

    # 等待一小段时间检查进程是否成功启动
    sleep 2
    if ! kill -0 "$NEXT_PID" 2>/dev/null; then
        echo "❌ Next.js 服务器启动失败"
        exit 1
    else
        echo "✅ Next.js 服务器已启动 (PID: $NEXT_PID, Port: $PORT)"
    fi

    cd ../
else
    echo "⚠️  未找到 Next.js 服务器文件: ./next-service-dist/server.js"
    echo "尝试 dev 模式启动..."
    if [ -f "./.zscripts/dev.sh" ]; then
        bash .zscripts/dev.sh &
        NEXT_PID=$!
        pids="$NEXT_PID"
    fi
fi

# 启动 Caddy（如果存在 Caddyfile）
if [ -f "Caddyfile" ]; then
    echo "🚀 启动 Caddy..."
    exec caddy run --config Caddyfile --adapter caddyfile
else
    echo "ℹ️  无 Caddyfile，等待进程结束..."
    wait "$NEXT_PID"
fi
