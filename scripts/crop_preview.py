#!/usr/bin/env python3
"""Crop and zoom the delogo preview frame to verify the rectangle covers the watermark."""
from PIL import Image
img = Image.open('/tmp/videoframes/delogo_show2_01.jpg')
# Crop bottom-right area where watermark is, expanded
crop = img.crop((1500, 820, 1920, 1080))
crop = crop.resize((crop.width * 3, crop.height * 3), Image.LANCZOS)
crop.save('/tmp/videoframes/delogo_show2_br.png')
print('saved', crop.size)
