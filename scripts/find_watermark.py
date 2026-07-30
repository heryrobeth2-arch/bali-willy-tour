#!/usr/bin/env python3
"""
Scan video frames to find a small white 4-pointed sparkle watermark.
The watermark is semi-transparent white, so we look for small clusters of
bright pixels in areas that should otherwise not be uniformly bright.

Strategy:
- Load a few sample frames from the video.
- For each frame, scan a sliding window across candidate regions
  (corners + center + edges) and compute mean brightness.
- A sparkle on dark background will show as: window has high std (some
  bright pixels mixed with dark), with peak pixels > 230 and surrounded
  by darker pixels.
- Print top candidates with coordinates.
"""
from PIL import Image
import numpy as np
import os

frames_dir = "/tmp/videoframes"
frames = sorted([f for f in os.listdir(frames_dir) if f.startswith("all_") and f.endswith(".jpg")])

# Watermark is 66x77 in original icon, but in 1920x1080 video it's probably smaller.
# Try a range of sizes.
WATERMARK_SIZES = [(30, 35), (40, 46), (50, 58), (60, 70), (80, 90)]

def find_sparkle(arr):
    """arr is HxWx3 uint8. Find candidate sparkle locations."""
    H, W, _ = arr.shape
    # Convert to grayscale (luminance)
    gray = arr.mean(axis=2).astype(np.float32)
    # Find pixels that are very bright AND have darker neighbors (sparkle shape)
    bright_mask = gray > 220
    # For each bright pixel, check if its local neighborhood has high contrast
    candidates = []
    # Downsample scan: check every 10 pixels
    for y in range(0, H-80, 10):
        for x in range(0, W-80, 10):
            # Skip large uniform-bright regions (sky etc.) - we want ISOLATED bright spots
            window = gray[max(0,y-5):y+85, max(0,x-5):x+85]
            if window.size == 0:
                continue
            # Count bright pixels in window
            n_bright = (window > 220).sum()
            n_total = window.size
            if n_bright == 0 or n_bright == n_total:
                continue
            # Sparkle should have a small cluster of bright pixels surrounded by darker
            bright_ratio = n_bright / n_total
            if 0.005 < bright_ratio < 0.15:  # 0.5% to 15% of window is bright
                mean_window = window.mean()
                mean_bright = window[window > 220].mean()
                if mean_bright - mean_window > 80:  # strong contrast
                    candidates.append({
                        "x": x, "y": y,
                        "bright_ratio": bright_ratio,
                        "contrast": mean_bright - mean_window,
                        "mean_bright": mean_bright,
                    })
    # Sort by contrast (highest first)
    candidates.sort(key=lambda c: c["contrast"], reverse=True)
    return candidates[:5]

for fname in frames[:10]:
    path = os.path.join(frames_dir, fname)
    img = Image.open(path).convert("RGB")
    arr = np.array(img)
    cands = find_sparkle(arr)
    if cands:
        print(f"\n{fname}:")
        for c in cands[:3]:
            print(f"  x={c['x']:4d} y={c['y']:4d}  bright_ratio={c['bright_ratio']:.3f}  contrast={c['contrast']:.0f}")
    else:
        print(f"\n{fname}: no candidates")
