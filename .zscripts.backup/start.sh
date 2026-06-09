#!/bin/sh
# Bali Willy Tour - Deployment Start Script
# Supports BOTH next-service-dist format AND full project format

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "============================================"
echo " Bali Willy Tour - Starting Deployment"
echo "============================================"
echo "Directory: $SCRIPT_DIR"

cd "$SCRIPT_DIR" || exit 1

export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

# OPTION 1: next-service-dist format (standalone - fastest)
if [ -f "./next-service-dist/server.js" ]; then
    echo "Starting Next.js standalone server (next-service-dist)..."

    cd next-service-dist/ || exit 1

    # Verify BUILD_ID exists
    if [ ! -f ".next/BUILD_ID" ]; then
        echo "ERROR: .next/BUILD_ID not found in next-service-dist"
        exit 1
    fi

    # Start the standalone server
    node server.js &
    SERVER_PID=$!

    # Wait for server to be ready
    echo "Waiting for server to start (PID: $SERVER_PID)..."
    MAX_WAIT=30
    WAITED=0
    while [ $WAITED -lt $MAX_WAIT ]; do
        if ! kill -0 "$SERVER_PID" 2>/dev/null; then
            echo "ERROR: Next.js server process died"
            exit 1
        fi
        if curl -s --connect-timeout 1 http://localhost:$PORT > /dev/null 2>&1; then
            echo "Next.js server is ready on port $PORT!"
            break
        fi
        sleep 1
        WAITED=$((WAITED + 1))
    done

    cd "$SCRIPT_DIR" || exit 1

# OPTION 2: Full project format (.zscripts/dev.sh)
elif [ -f "./.zscripts/dev.sh" ]; then
    echo "Starting via .zscripts/dev.sh..."
    bash .zscripts/dev.sh &
    SERVER_PID=$!
    sleep 5

# OPTION 3: .next/standalone directly
elif [ -f "./.next/standalone/server.js" ]; then
    echo "Starting standalone server directly..."
    cd .next/standalone || exit 1
    node server.js &
    SERVER_PID=$!
    sleep 3
    cd "$SCRIPT_DIR" || exit 1

else
    echo "ERROR: No server startup method found"
    echo "Missing: next-service-dist/server.js, .zscripts/dev.sh, .next/standalone/server.js"
    exit 1
fi

# Start Caddy if Caddyfile exists
if [ -f "./Caddyfile" ]; then
    echo "Starting Caddy on port 81..."
    exec caddy run --config Caddyfile --adapter caddyfile
else
    echo "No Caddyfile found, keeping processes alive..."
    wait
fi
