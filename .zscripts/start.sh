#!/bin/sh

set -e

# Bali Willy Tour - Start Script for Space-Z Platform
# This script runs in the deployment container after artifact extraction
# IMPORTANT: Uses DEV mode so allowedDevOrigins works for iframe preview

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "Starting Bali Willy Tour..."
ls -lah

# Set environment variables
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=development

# Install dependencies
echo "Installing dependencies..."
bun install

# Start dev server (NOT production - allowedDevOrigins only works in dev mode)
echo "Starting Next.js dev server (dev mode for iframe preview)..."
bun run dev &
DEV_PID=$!

# Wait for server to be ready
echo "Waiting for dev server to start..."
attempts=0
max_attempts=60
while [ $attempts -lt $max_attempts ]; do
    if curl -s --connect-timeout 2 --max-time 5 "http://localhost:3000" > /dev/null 2>&1; then
        echo "Next.js dev server is ready!"
        break
    fi
    attempts=$((attempts + 1))
    echo "Attempt $attempts/$max_attempts: waiting..."
    sleep 2
done

if [ $attempts -ge $max_attempts ]; then
    echo "ERROR: Dev server failed to start within $max_attempts attempts"
    exit 1
fi

# Health check
echo "Performing health check..."
curl -fsS localhost:3000 > /dev/null
echo "Health check passed!"

# Write PID file
echo "$DEV_PID" > .zscripts/dev.pid
echo "Dev server PID: $DEV_PID"

disown "$DEV_PID" 2>/dev/null || true

# Start Caddy as foreground process (main process)
if [ -f "Caddyfile" ]; then
    echo "Starting Caddy..."
    exec caddy run --config Caddyfile --adapter caddyfile
else
    echo "No Caddyfile found, keeping process alive..."
    wait "$DEV_PID"
fi
