#!/usr/bin/env python3
"""
Find the sparkle watermark by template matching.
Use the user's uploaded icon as a template and slide it across each frame
using normalized cross-correlation. Sparkle is semi-transparent so the
match won't be perfect — we look for the highest peak.
"""
import numpy as np
from PIL import Image
import os

# Load template
template_rgba = Image.open("/home/z/my-project/upload/waterpark.png").convert("L")
template_arr = np.array(template_rgba).astype(np.float32)
# Normalize template
template_arr = (template_arr - template_arr.mean()) / (template_arr.std() + 1e-6)
TH, TW = template_arr.shape  # 77, 66

print(f"Template size: {TH}x{TW}")

frames_dir = "/tmp/videoframes"
frames = sorted([f for f in os.listdir(frames_dir) if f.startswith("all_") and f.endswith(".jpg")])

def find_template(gray_arr, template):
    """Sliding window normalized cross-correlation. Returns (best_y, best_x, best_score)."""
    H, W = gray_arr.shape
    th, tw = template.shape
    best = (-1, -1, -1.0)
    # Try a few sizes (template scaling)
    for scale in [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]:
        new_th, new_tw = int(th*scale), int(tw*scale)
        if new_th >= H or new_tw >= W:
            continue
        # Resize template
        from PIL import Image as PImage
        t_img = PImage.fromarray(template.astype(np.float32))
        t_resized = np.array(t_img.resize((new_tw, new_th), PImage.LANCZOS))
        t_norm = (t_resized - t_resized.mean()) / (t_resized.std() + 1e-6)
        # Slide (downsample step)
        step = 5
        for y in range(0, H - new_th, step):
            for x in range(0, W - new_tw, step):
                window = gray_arr[y:y+new_th, x:x+new_tw]
                w_norm = (window - window.mean()) / (window.std() + 1e-6)
                # NCC
                score = float((w_norm * t_norm).mean())
                if score > best[2]:
                    best = (y, x, score)
    return best

# Process a few frames
for fname in frames[:5]:
    img = Image.open(os.path.join(frames_dir, fname)).convert("L")
    gray = np.array(img).astype(np.float32)
    y, x, score = find_template(gray, template_arr)
    print(f"{fname}: best match at x={x}, y={y}, score={score:.4f}")
