#!/usr/bin/env python3
from PIL import Image
for i in [1, 2, 3]:
    img = Image.open(f"/tmp/videoframes/clean_{i:02d}.jpg")
    crop = img.crop((1500, 820, 1920, 1080))
    crop = crop.resize((crop.width * 3, crop.height * 3), Image.LANCZOS)
    crop.save(f"/tmp/videoframes/clean_br_{i:02d}.png")
print("saved")
