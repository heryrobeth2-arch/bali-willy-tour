#!/bin/sh
# Bali Willy Tour - Deployment Start Script (Static)
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export NEXT_TELEMETRY_DISABLED=1
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

echo "============================================"
echo " Bali Willy Tour - Starting (Static Mode)"
echo "============================================"

# Option 1: Use dev.sh
if [ -f "./.zscripts/dev.sh" ]; then
    echo "Starting via .zscripts/dev.sh..."
    exec bash .zscripts/dev.sh
fi

# Option 2: Serve out/ directly
if [ -d "./out" ] && [ -f "./out/index.html" ]; then
    echo "Serving static site from out/ directory..."
    cd out || exit 1
    if command -v python3 &>/dev/null; then
        exec python3 -m http.server $PORT --bind 0.0.0.0
    elif command -v python &>/dev/null; then
        exec python -m SimpleHTTPServer $PORT
    else
        echo "ERROR: No Python available"
        exit 1
    fi
fi

# Option 3: Build from source and serve
echo "No static output found, building..."
if [ -f "package-lock.json" ]; then
    npm ci --prefer-offline 2>&1 || npm install 2>&1
else
    npm install 2>&1
fi

npx next build 2>&1

if [ -d "./.zscripts/dev.sh" ]; then
    exec bash .zscripts/dev.sh
elif [ -d "./out" ]; then
    cd out || exit 1
    exec python3 -m http.server $PORT --bind 0.0.0.0
fi

echo "ERROR: Failed to start"
exit 1
