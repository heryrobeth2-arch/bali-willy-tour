#!/bin/sh
# Watchdog: Restarts Next.js if it dies
# Run this in background to keep the sandbox active

cd /home/z/my-project || exit 1
export PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1

while true; do
  if ! curl -s -o /dev/null http://localhost:3000/ --connect-timeout 2 2>/dev/null; then
    echo "[$(date '+%H:%M:%S')] Next.js not responding, restarting..." >> /tmp/watchdog.log
    pkill -f "next start" 2>/dev/null; sleep 1
    NODE_ENV=production node_modules/.bin/next start -p $PORT -H $HOSTNAME >> /tmp/next_run.log 2>&1 &
    sleep 5
  fi
  sleep 10
done
