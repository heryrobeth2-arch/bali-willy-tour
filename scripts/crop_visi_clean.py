#!/usr/bin/env python3
from PIL import Image
img = Image.open('/tmp/videoframes/visi_clean_01.jpg')
crop = img.crop((850, 620, 1280, 720))
crop = crop.resize((crop.width * 3, crop.height * 3), Image.LANCZOS)
crop.save('/tmp/videoframes/visi_clean_br.png')
print('saved', crop.size)
