#!/usr/bin/env python3
"""Merge cover + body PDF, add metadata, save to download/"""
from pypdf import PdfWriter, PdfReader, Transformation
from pypdf.generic import RectangleObject
import os

COVER_PDF = '/home/z/my-project/scripts/setup_guide/cover.pdf'
BODY_PDF = '/home/z/my-project/scripts/setup_guide/body.pdf'
OUTPUT = '/home/z/my-project/download/Setup-Guide-Client-Baru-BWT.pdf'

writer = PdfWriter()

# Read body first to get exact page dimensions
body_reader = PdfReader(BODY_PDF)
target_width = float(body_reader.pages[0].mediabox.width)
target_height = float(body_reader.pages[0].mediabox.height)
print(f'Target page size from body: {target_width} x {target_height} pt')

# Append cover, scale to match body page size exactly
cover_reader = PdfReader(COVER_PDF)
for page in cover_reader.pages:
    cw = float(page.mediabox.width)
    ch = float(page.mediabox.height)
    sx = target_width / cw
    sy = target_height / ch
    # Scale page content
    page.scale_to(target_width, target_height)
    # Also set the mediabox explicitly
    page.mediabox = RectangleObject((0, 0, target_width, target_height))
    page.cropbox = RectangleObject((0, 0, target_width, target_height))
    writer.add_page(page)
    print(f'Cover scaled from {cw}x{ch} to {target_width}x{target_height} (sx={sx:.4f}, sy={sy:.4f})')

# Append body
for page in body_reader.pages:
    writer.add_page(page)

# Add metadata
writer.add_metadata({
    '/Title': 'Setup Guide untuk Client Baru - Checklist Branding Website Tour',
    '/Author': 'Bali Willy Tour',
    '/Subject': 'Checklist Branding untuk Duplikasi Website BWT ke Client Baru',
    '/Creator': 'BWT Internal Documentation',
    '/Keywords': 'setup guide, branding, checklist, BWT, client, duplikasi, website tour',
})

# Ensure output dir
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

with open(OUTPUT, 'wb') as f:
    writer.write(f)

# Stats
size_kb = os.path.getsize(OUTPUT) / 1024
total_pages = len(cover_reader.pages) + len(body_reader.pages)
print(f'\nFinal PDF: {OUTPUT}')
print(f'Size: {size_kb:.1f} KB')
print(f'Pages: {total_pages} (cover + {len(body_reader.pages)} body)')
