#!/usr/bin/env python3
from PIL import Image
img = Image.open("/tmp/videoframes/visi_frame.jpg")
print("Frame size:", img.size)
# Bottom-right corner of 1280x720 frame
crop = img.crop((900, 500, 1280, 720))
crop = crop.resize((crop.width * 3, crop.height * 3), Image.LANCZOS)
crop.save("/tmp/videoframes/visi_br.png")
print("saved", crop.size)
