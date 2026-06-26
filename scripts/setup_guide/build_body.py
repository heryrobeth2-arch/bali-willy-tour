#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Setup Guide untuk Client Baru - Body PDF (ReportLab)
BWT Internal Reference Document
"""

import os
import sys
import hashlib
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm, cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, ListFlowable, ListItem, HRFlowable
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ============================================================
# FONT REGISTRATION
# ============================================================
FONT_DIR = '/usr/share/fonts'

# Noto Serif SC for headings (professional serif)
pdfmetrics.registerFont(TTFont('NotoSerif', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerif-Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerif-SemiBold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-SemiBold.ttf'))
registerFontFamily('NotoSerif', normal='NotoSerif', bold='NotoSerif-Bold')

# Noto Sans for body (clean sans-serif) - use Liberation Sans
pdfmetrics.registerFont(TTFont('NotoSans', f'{FONT_DIR}/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSans-Bold', f'{FONT_DIR}/truetype/liberation/LiberationSans-Bold.ttf'))
registerFontFamily('NotoSans', normal='NotoSans', bold='NotoSans-Bold')

# Use Liberation Sans as alternative sans
pdfmetrics.registerFont(TTFont('LibSans', f'{FONT_DIR}/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Bold', f'{FONT_DIR}/truetype/liberation/LiberationSans-Bold.ttf'))
registerFontFamily('LibSans', normal='LibSans', bold='LibSans-Bold')

# ============================================================
# COLOR PALETTE - BWT Teal Brand
# ============================================================
# Primary brand teal
TEAL_PRIMARY = colors.HexColor('#0F766E')   # teal-700
TEAL_DARK = colors.HexColor('#134E4A')      # teal-900
TEAL_LIGHT = colors.HexColor('#CCFBF1')     # teal-100
TEAL_LIGHTER = colors.HexColor('#F0FDFA')   # teal-50

# Neutrals
TEXT_PRIMARY = colors.HexColor('#1F2937')   # gray-800
TEXT_BODY = colors.HexColor('#374151')      # gray-700
TEXT_MUTED = colors.HexColor('#6B7280')     # gray-500
TEXT_LIGHT = colors.HexColor('#9CA3AF')     # gray-400

# Backgrounds
BG_WHITE = colors.white
BG_PAGE = colors.HexColor('#FFFFFF')
BG_SOFT = colors.HexColor('#F9FAFB')        # gray-50
BG_CARD = colors.HexColor('#F3F4F6')        # gray-100

# Borders
BORDER_LIGHT = colors.HexColor('#E5E7EB')   # gray-200
BORDER_MED = colors.HexColor('#D1D5DB')     # gray-300

# Status colors
SUCCESS = colors.HexColor('#16A34A')        # green-600
SUCCESS_BG = colors.HexColor('#F0FDF4')     # green-50
WARNING = colors.HexColor('#D97706')        # amber-600
WARNING_BG = colors.HexColor('#FFFBEB')     # amber-50

# Table colors
TABLE_HEADER_BG = TEAL_PRIMARY
TABLE_HEADER_TEXT = colors.white
TABLE_ROW_EVEN = colors.white
TABLE_ROW_ODD = colors.HexColor('#F9FAFB')
TABLE_BORDER = BORDER_LIGHT

# ============================================================
# PAGE DIMENSIONS
# ============================================================
PAGE_WIDTH, PAGE_HEIGHT = A4  # 595.27 x 841.89 pts
LEFT_MARGIN = 20 * mm
RIGHT_MARGIN = 20 * mm
TOP_MARGIN = 22 * mm
BOTTOM_MARGIN = 22 * mm
CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN

# ============================================================
# STYLES
# ============================================================
def make_styles():
    styles = {}

    # H1 - Chapter title
    styles['h1'] = ParagraphStyle(
        'H1',
        fontName='NotoSerif-Bold',
        fontSize=22,
        leading=28,
        textColor=TEXT_PRIMARY,
        spaceBefore=10,
        spaceAfter=14,
        alignment=TA_LEFT,
    )

    # H2 - Section
    styles['h2'] = ParagraphStyle(
        'H2',
        fontName='NotoSerif-Bold',
        fontSize=15,
        leading=20,
        textColor=TEAL_PRIMARY,
        spaceBefore=16,
        spaceAfter=8,
        alignment=TA_LEFT,
    )

    # H3 - Sub-section
    styles['h3'] = ParagraphStyle(
        'H3',
        fontName='NotoSerif-SemiBold',
        fontSize=12,
        leading=16,
        textColor=TEXT_PRIMARY,
        spaceBefore=10,
        spaceAfter=6,
        alignment=TA_LEFT,
    )

    # Body
    styles['body'] = ParagraphStyle(
        'Body',
        fontName='NotoSans',
        fontSize=10,
        leading=16,
        textColor=TEXT_BODY,
        spaceBefore=0,
        spaceAfter=8,
        alignment=TA_LEFT,
    )

    # Body justified variant
    styles['body_justified'] = ParagraphStyle(
        'BodyJ',
        fontName='NotoSans',
        fontSize=10,
        leading=16,
        textColor=TEXT_BODY,
        spaceBefore=0,
        spaceAfter=8,
        alignment=TA_LEFT,
    )

    # Bullet item
    styles['bullet'] = ParagraphStyle(
        'Bullet',
        fontName='NotoSans',
        fontSize=10,
        leading=15,
        textColor=TEXT_BODY,
        leftIndent=18,
        bulletIndent=6,
        spaceBefore=2,
        spaceAfter=2,
        alignment=TA_LEFT,
    )

    # Checklist item (checkbox + text)
    styles['checklist'] = ParagraphStyle(
        'Checklist',
        fontName='NotoSans',
        fontSize=10,
        leading=15,
        textColor=TEXT_BODY,
        leftIndent=22,
        spaceBefore=3,
        spaceAfter=3,
        alignment=TA_LEFT,
    )

    # Code block
    styles['code'] = ParagraphStyle(
        'Code',
        fontName='LibSans',
        fontSize=9,
        leading=13,
        textColor=TEAL_DARK,
        backColor=TEAL_LIGHTER,
        borderColor=TEAL_LIGHT,
        borderWidth=0.5,
        borderPadding=8,
        leftIndent=8,
        rightIndent=8,
        spaceBefore=6,
        spaceAfter=8,
        alignment=TA_LEFT,
    )

    # Caption / muted
    styles['caption'] = ParagraphStyle(
        'Caption',
        fontName='NotoSans',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_MUTED,
        spaceBefore=2,
        spaceAfter=10,
        alignment=TA_LEFT,
    )

    # Table cell - header
    styles['th'] = ParagraphStyle(
        'Th',
        fontName='NotoSerif-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.white,
        alignment=TA_LEFT,
    )

    # Table cell - body
    styles['td'] = ParagraphStyle(
        'Td',
        fontName='NotoSans',
        fontSize=9,
        leading=12,
        textColor=TEXT_BODY,
        alignment=TA_LEFT,
    )

    # Table cell - body bold
    styles['td_bold'] = ParagraphStyle(
        'TdBold',
        fontName='NotoSerif-Bold',
        fontSize=9,
        leading=12,
        textColor=TEXT_PRIMARY,
        alignment=TA_LEFT,
    )

    # TOC level 0
    styles['toc0'] = ParagraphStyle(
        'TOC0',
        fontName='NotoSerif-Bold',
        fontSize=11,
        leading=18,
        textColor=TEXT_PRIMARY,
        leftIndent=0,
        spaceBefore=6,
    )

    # TOC level 1
    styles['toc1'] = ParagraphStyle(
        'TOC1',
        fontName='NotoSans',
        fontSize=9.5,
        leading=14,
        textColor=TEXT_MUTED,
        leftIndent=18,
    )

    return styles


STYLES = make_styles()


# ============================================================
# HELPERS
# ============================================================
def add_heading(text, level=0):
    """Add heading with bookmark for TOC."""
    key = f'h_{hashlib.md5(text.encode()).hexdigest()[:8]}'
    style = STYLES['h1'] if level == 0 else (STYLES['h2'] if level == 1 else STYLES['h3'])
    p = Paragraph(f'<a name="{key}"/>{text}', style)
    p.bookmark_name = key
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p


def body(text):
    return Paragraph(text, STYLES['body'])


def bullet(text):
    return Paragraph(f'&bull; &nbsp;{text}', STYLES['bullet'])


def checklist(text):
    """Render a checkbox + text item."""
    return Paragraph(f'<font color="#0F766E">&#9744;</font> &nbsp;{text}', STYLES['checklist'])


def code_block(text):
    """Render a code-style block."""
    # Escape XML
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    return Paragraph(text.replace('\n', '<br/>'), STYLES['code'])


def make_table(data, col_widths=None, header=True):
    """Build a styled table.
    data: list of rows, each row = list of strings or Paragraphs
    col_widths: list of widths in points
    """
    if col_widths is None:
        n_cols = len(data[0])
        col_widths = [CONTENT_WIDTH / n_cols] * n_cols

    # Wrap strings in Paragraph
    wrapped = []
    for i, row in enumerate(data):
        wrow = []
        for cell in row:
            if isinstance(cell, str):
                style = STYLES['th'] if (header and i == 0) else STYLES['td']
                wrow.append(Paragraph(cell, style))
            else:
                wrow.append(cell)
        wrapped.append(wrow)

    t = Table(wrapped, colWidths=col_widths, repeatRows=1 if header else 0)
    ts = [
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, TABLE_BORDER),
    ]
    if header:
        ts += [
            ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_BG),
            ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
            ('FONTNAME', (0, 0), (-1, 0), 'NotoSerif-Bold'),
        ]
        # Stripe odd rows
        for i in range(1, len(data)):
            if i % 2 == 0:
                ts.append(('BACKGROUND', (0, i), (-1, i), TABLE_ROW_ODD))
    t.setStyle(TableStyle(ts))
    return t


def hr():
    return HRFlowable(width='100%', thickness=0.5, color=BORDER_LIGHT, spaceBefore=8, spaceAfter=8)


def spacer(h=8):
    return Spacer(1, h)


# ============================================================
# PAGE TEMPLATE - Header & Footer
# ============================================================
def on_page(canvas, doc):
    canvas.saveState()
    page_num = canvas.getPageNumber()

    # Footer line
    canvas.setStrokeColor(BORDER_LIGHT)
    canvas.setLineWidth(0.5)
    canvas.line(LEFT_MARGIN, 15 * mm, PAGE_WIDTH - RIGHT_MARGIN, 15 * mm)

    # Footer left - brand
    canvas.setFont('NotoSerif-Bold', 8)
    canvas.setFillColor(TEAL_PRIMARY)
    canvas.drawString(LEFT_MARGIN, 10 * mm, 'BALI WILLY TOUR')

    # Footer center - doc title
    canvas.setFont('NotoSans', 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawCentredString(PAGE_WIDTH / 2, 10 * mm, 'Setup Guide untuk Client Baru')

    # Footer right - page number
    canvas.setFont('NotoSans', 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawRightString(PAGE_WIDTH - RIGHT_MARGIN, 10 * mm, f'Halaman {page_num}')

    # Header dot (top-right) - small teal accent
    canvas.setFillColor(TEAL_PRIMARY)
    canvas.circle(PAGE_WIDTH - RIGHT_MARGIN - 2, PAGE_HEIGHT - 12 * mm, 2, fill=1, stroke=0)

    canvas.restoreState()


# ============================================================
# TOC DOC TEMPLATE
# ============================================================
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))


# ============================================================
# CONTENT BUILDERS
# ============================================================
def build_toc():
    """Build Table of Contents page."""
    story = []
    story.append(Paragraph('Daftar Isi', STYLES['h1']))
    story.append(Spacer(1, 6))

    toc = TableOfContents()
    toc.levelStyles = [STYLES['toc0'], STYLES['toc1']]
    story.append(toc)
    story.append(PageBreak())
    return story


def build_chapter_1():
    """Bab 1 - Pendahuluan"""
    story = []
    story.append(add_heading('Bab 1 - Pendahuluan', level=0))

    story.append(add_heading('1.1 Tujuan Dokumen', level=1))
    story.append(body(
        'Dokumen ini disusun sebagai <b>checklist internal</b> pemilik Bali Willy Tour (BWT) untuk '
        'mengantisipasi situasi ketika ada client baru yang memerlukan aplikasi website tour serupa. '
        'Dokumen berisi daftar komprehensif semua elemen branding yang harus diubah saat proses '
        'duplikasi kode BWT menjadi website baru untuk client lain.'
    ))
    story.append(body(
        'Dengan checklist ini, proses duplikasi menjadi terstruktur, tidak ada item terlewat, '
        'dan estimasi waktu pengerjaan bisa diprediksi lebih akurat. Dokumen juga berfungsi '
        'sebagai dokumentasi knowledge transfer jika suatu saat ada anggota tim baru yang '
        'mengerjakan proyek serupa.'
    ))

    story.append(add_heading('1.2 Kapan Dokumen Dipakai', level=1))
    story.append(body('Gunakan dokumen ini pada situasi berikut:'))
    story.append(bullet('Saat menerima deal client baru yang minta website tour seperti BWT.'))
    story.append(bullet('Saat memberikan quote/harga ke calon client yang minta referensi BWT.'))
    story.append(bullet('Saat melatih anggota tim baru untuk mengerjakan proyek duplikasi.'))
    story.append(bullet('Saat melakukan audit ulang website existing BWT untuk konsistensi branding.'))

    story.append(add_heading('1.3 Asumsi & Prasyarat', level=1))
    story.append(body(
        'Dokumen ini dibuat dengan asumsi bahwa kodebase Bali Willy Tour sudah ada dan siap '
        'di-duplikat. Berikut prasyarat teknis yang harus dipenuhi sebelum menjalankan checklist:'
    ))
    story.append(bullet('Repo kode BWT tersedia di lokal atau GitHub (private repo).'))
    story.append(bullet('Akses ke Vercel dashboard dengan SSO login aktif.'))
    story.append(bullet('Node.js 18+ dan npm/bun terinstall di mesin development.'))
    story.append(bullet('Editor kode (VS Code) dengan ekstensi Tailwind CSS IntelliSense.'))
    story.append(bullet('Akses ke Prisma Studio untuk inspeksi database.'))
    story.append(bullet('Akun Google Workspace untuk email bisnis client (opsional).'))

    story.append(add_heading('1.4 Workflow Singkat', level=1))
    story.append(body(
        'Workflow umum saat ada client baru: (1) <b>Duplikat kode</b> - salin folder BWT ke folder '
        'baru atau fork repo GitHub. (2) <b>Buat Vercel project baru</b> via dashboard (karena SSO '
        'enforcement membatasi pembuatan project via API). (3) <b>Jalankan checklist branding</b> '
        'dari Bab 2 sampai Bab 9 secara berurutan. (4) <b>Final QC</b> menggunakan checklist di '
        'Bab 10. (5) <b>Deploy ke production</b> via Vercel. (6) <b>Handover</b> kredensial dan '
        'panduan singkat ke client.'
    ))

    story.append(add_heading('1.5 Estimasi Waktu Pengerjaan', level=1))
    story.append(body(
        'Untuk client dengan branding siap (logo, warna, foto sudah disiapkan), total waktu '
        'pengerjaan sekitar <b>2-4 jam kerja</b>. Berikut breakdown estimasinya:'
    ))

    time_data = [
        ['Fase', 'Aktivitas', 'Estimasi'],
        ['1', 'Duplikat kode + setup Vercel project', '15 menit'],
        ['2', 'Briefing & kumpulkan aset client', '30 menit'],
        ['3', 'Identitas visual (logo, warna, font)', '30 menit'],
        ['4', 'Konten teks & multi-bahasa', '45 menit'],
        ['5', 'Domain & email setup', '20 menit'],
        ['6', 'SEO & metadata', '15 menit'],
        ['7', 'Aset media (foto, favicon, OG)', '20 menit'],
        ['8', 'Integrasi (WhatsApp, social, analytics)', '15 menit'],
        ['9', 'Reset database & data bisnis', '15 menit'],
        ['10', 'Final QC & deploy', '30 menit'],
        ['Total', '', '3-4 jam'],
    ]
    story.append(make_table(time_data, col_widths=[40, CONTENT_WIDTH - 40 - 70, 70]))
    story.append(spacer(8))
    story.append(body(
        'Estimasi di atas tidak termasuk waktu tunggu client menyiapkan aset (logo, foto, copy). '
        'Jika client butuh revisi, tambahkan buffer 1-2 jam. Untuk customisasi besar seperti '
        'menambah modul baru (misal: sistem pembayaran online, multi-currency), estimasi waktu '
        'bisa membengkak hingga 1-3 hari kerja.'
    ))

    story.append(PageBreak())
    return story


def build_chapter_2():
    """Bab 2 - Persiapan & Briefing Client"""
    story = []
    story.append(add_heading('Bab 2 - Persiapan & Briefing Client', level=0))

    story.append(body(
        'Sebelum mulai duplikasi kode, wajib mengumpulkan semua aset branding dari client terlebih '
        'dahulu. Mempunyai aset lengkap di awal akan menghemat waktu bolak-balik komunikasi, '
        'menghindari revisi besar di tengah jalan, dan memastikan hasil akhir benar-benar '
        'mencerminkan brand client - bukan asumsi kita.'
    ))

    story.append(add_heading('2.1 Daftar Aset yang Wajib Dikumpulkan', level=1))
    story.append(body(
        'Berikut checklist aset yang harus dikumpulkan dari client SEBELUM mulai mengerjakan '
        'duplikasi. Kirimkan tabel ini ke client dalam bentuk Google Form atau PDF agar mudah diisi.'
    ))

    briefing_data = [
        ['No', 'Item Briefing', 'Catatan / Contoh'],
        ['1', 'Nama Brand & Tagline', '"Tour Company X" - "Explore The Beauty"'],
        ['2', 'Logo file', 'SVG/PNG transparan, min 1024px, versi hitam & putih'],
        ['3', 'Brand colors (HEX)', 'Primer: #0F766E, Sekunder: #F59E0B, Aksen: #1F2937'],
        ['4', 'Domain utama', 'tourcompanyx.com / .id / .co.id (cek ketersediaan di Namecheap)'],
        ['5', 'Foto destinasi/produk', 'Min 5 foto, resolusi 1920x1080, format JPG/WebP'],
        ['6', 'Nomor WhatsApp bisnis', 'Format 62xxx tanpa tanda + atau 0 di depan'],
        ['7', 'Email bisnis', 'hello@tourcompanyx.com (butuh Google Workspace)'],
        ['8', 'Social media handles', 'Instagram, Facebook, TikTok, YouTube'],
        ['9', 'Daftar paket tour + harga', 'Format: nama paket, destinasi, harga per pax'],
        ['10', 'Daftar destinasi yang ditawarkan', 'Minimum 4 destinasi untuk Package A-D'],
        ['11', 'Bahasa target', 'ID only / ID+EN / ID+EN+ZH / ID+EN+KR'],
        ['12', 'Foto team / about', 'Opsional, untuk halaman About'],
        ['13', 'Izin operasional / legal', 'Untuk footer jika diwajibkan lokal'],
        ['14', 'Deadline go-live', 'Target tanggal launch'],
    ]
    story.append(make_table(briefing_data, col_widths=[25, 170, CONTENT_WIDTH - 25 - 170]))
    story.append(spacer(8))

    story.append(add_heading('2.2 Tips Briefing dengan Client Non-Teknis', level=1))
    story.append(body(
        'Kebanyakan pemilik bisnis tour tidak paham istilah teknis. Saat briefing, gunakan '
        'bahasa awam dan berikan contoh konkret. Misalnya, jangan minta "logo SVG transparan" '
        'tanpa menjelaskan artinya - sampaikan "logo tanpa background putih, format file yang '
        'bisa di-zoom tanpa pecah". Selalu sediakan template contoh sebagai referensi visual.'
    ))
    story.append(body(
        'Jika client tidak punya logo, tawarkan jasa desain logo sebagai upsell (estimasi budget '
        'Rp 500.000 - Rp 2.000.000 di Fiverr/Canva Pro). Jika client tidak punya foto destinasi, '
        'gunakan stok foto gratis dari Unsplash/Pexels dengan filter destinasi setempat, lalu '
        'ganti bertahap setelah client dapat foto asli.'
    ))

    story.append(add_heading('2.3 Kontrak & Pembayaran', level=1))
    story.append(body(
        'Sebelum mulai coding, pastikan kontrak dan DP sudah clear. Standar industri untuk '
        'website tour seperti BWT: <b>DP 50% di awal, pelunasan 50% sebelum go-live</b>. Sertakan '
        'juga pasal tentang scope perubahan (maksimal 3 kali revisi major gratis, setelahnya '
        'dikenakan biaya per jam). Lampirkan dokumen ini sebagai bagian dari kontrak sebagai '
        'referensi teknis agar client paham cakupan pekerjaan.'
    ))

    story.append(PageBreak())
    return story


def build_chapter_3():
    """Bab 3 - Identitas Visual"""
    story = []
    story.append(add_heading('Bab 3 - Identitas Visual', level=0))

    story.append(body(
        'Identitas visual adalah elemen pertama yang dilihat pengunjung website. Perubahan '
        'identitas visual yang konsisten di seluruh halaman akan membuat client merasa website '
        'tersebut benar-benar "milik mereka", bukan sekadar template yang diganti teks. '
        'Bab ini berisi daftar file dan lokasi yang wajib dimodifikasi.'
    ))

    story.append(add_heading('3.1 Logo & Favicon', level=1))
    story.append(body(
        'Logo adalah elemen branding paling kritis. Ganti logo di semua lokasi berikut, dan '
        'pastikan logo baru memiliki rasio yang mirip dengan logo BWT agar layout header tidak '
        'rusak. Idealnya logo client berbentuk persegi atau horizontal dengan rasio 2:1 hingga 4:1.'
    ))

    logo_data = [
        ['Lokasi File', 'Fungsi', 'Aksi yang Diperlukan', 'Estimasi'],
        ['public/images/logo-bulat.png', 'Logo header (bulat)', 'Ganti dengan logo client, jaga rasio', '5 menit'],
        ['public/images/logo-bulat-footer.png', 'Logo footer', 'Ganti dengan varian putih/logo monokrom', '5 menit'],
        ['public/favicon.ico', 'Favicon browser tab', 'Generate dari logo via favicon.io', '5 menit'],
        ['public/apple-touch-icon.png', 'iOS home screen icon', 'Generate 180x180px PNG', '3 menit'],
        ['public/icon-192.png', 'Android Chrome icon', 'Generate 192x192px PNG', '3 menit'],
        ['public/icon-512.png', 'Android Chrome icon (large)', 'Generate 512x512px PNG', '3 menit'],
        ['src/app/opengraph-image.png', 'OG image default', 'Buat custom OG image 1200x630', '15 menit'],
    ]
    story.append(make_table(logo_data, col_widths=[180, 130, 175, 50]))
    story.append(spacer(8))

    story.append(add_heading('3.2 Brand Colors', level=1))
    story.append(body(
        'BWT menggunakan warna <font color="#0F766E"><b>teal #0F766E</b></font> sebagai primer '
        'dan <font color="#F59E0B"><b>amber #F59E0B</b></font> sebagai aksen. Untuk client baru, '
        'ganti kedua warna ini dengan brand color client. Cara terbersih: definisikan sebagai CSS '
        'variable di <code>src/app/globals.css</code> dan tailwind config.'
    ))

    story.append(code_block(
        "// src/app/globals.css\n"
        "@theme {\n"
        "  --color-brand-50: #F0FDFA;   /* client teal-50 */\n"
        "  --color-brand-500: #14B8A6;  /* client teal-500 */\n"
        "  --color-brand-600: #0F766E;  /* client teal-700 - primary */\n"
        "  --color-brand-700: #115E59;  /* client teal-800 */\n"
        "  --color-accent: #F59E0B;     /* client amber - accent */\n"
        "}"
    ))

    story.append(body(
        'Setelah mendefinisikan CSS variable, cari semua instance <code>teal-600</code>, '
        '<code>teal-700</code>, <code>teal-500</code> di seluruh komponen dan ganti dengan '
        '<code>brand-600</code>, <code>brand-700</code>, <code>brand-500</code>. Gunakan fitur '
        'Find & Replace di VS Code dengan regex untuk efisiensi. Estimasi waktu: 20 menit.'
    ))

    story.append(add_heading('3.3 Tipografi & Font', level=1))
    story.append(body(
        'BWT menggunakan font sistem (sans-serif default Tailwind) untuk body dan '
        '<code>font-serif</code> untuk heading. Jika client punya brand font sendiri, '
        'daftarkan di <code>src/app/layout.tsx</code> via next/font/google atau self-hosted.'
    ))

    font_data = [
        ['Lokasi', 'Aksi', 'Estimasi'],
        ['src/app/layout.tsx (metadata.fonts)', 'Update font family di metadata', '5 menit'],
        ['src/app/globals.css (font-family)', 'Ganti base font jika perlu', '5 menit'],
        ['tailwind.config.ts (fontFamily)', 'Tambah brand-sans, brand-serif', '5 menit'],
        ['public/fonts/* (self-hosted)', 'Upload font files jika tidak pakai Google Fonts', '15 menit'],
    ]
    story.append(make_table(font_data, col_widths=[220, 270, 60]))
    story.append(spacer(8))

    story.append(add_heading('3.4 Ikon & Illustration', level=1))
    story.append(body(
        'BWT menggunakan <b>lucide-react</b> untuk semua ikon - ikon ini netral dan tidak perlu '
        'diganti. Yang perlu dicek: apakah ada ikon custom BWT (misal: logo destinasi, badge, '
        'mascot) yang perlu di-ganti dengan versi client. Cari di folder <code>public/icons/</code> '
        'dan <code>src/components/icons/</code>.'
    ))

    story.append(PageBreak())
    return story


def build_chapter_4():
    """Bab 4 - Konten Teks & Brand Voice"""
    story = []
    story.append(add_heading('Bab 4 - Konten Teks & Brand Voice', level=0))

    story.append(body(
        'Konten teks adalah elemen branding yang paling banyak dan paling mudah terlewat. '
        'BWT punya 3 bahasa (ID, EN, ZH) yang semuanya harus di-update. File utama yang harus '
        'dimodifikasi: <code>src/lib/i18n/translations.ts</code>. File ini berisi semua string '
        'teks yang ditampilkan di UI, dipisahkan per bahasa.'
    ))

    story.append(add_heading('4.1 Nama Brand & Tagline', level=1))
    story.append(body(
        'Cari semua instance "Bali Willy Tour" atau "BWT" di seluruh codebase. Lokasi utama:'
    ))
    story.append(bullet('<code>src/components/header.tsx</code> - logo + nama brand di navbar'))
    story.append(bullet('<code>src/components/footer.tsx</code> - nama brand di footer + copyright'))
    story.append(bullet('<code>src/app/layout.tsx</code> - metadata.title dan metadata.title.default'))
    story.append(bullet('<code>src/lib/i18n/translations.ts</code> - cari "Bali Willy Tour" di 3 blok bahasa'))
    story.append(bullet('<code>public/manifest.json</code> - "name" dan "short_name" untuk PWA'))

    story.append(add_heading('4.2 Hero & Deskripsi Perusahaan', level=1))
    story.append(body(
        'Hero text di homepage adalah copy pertama yang dilihat pengunjung. Lokasi: '
        '<code>src/components/hero-section.tsx</code> atau di translations.ts dengan key seperti '
        '<code>heroTitle</code>, <code>heroSubtitle</code>. Ganti dengan tagline client.'
    ))

    story.append(code_block(
        "// Contoh struktur di translations.ts\n"
        "id: {\n"
        "  heroTitle: ' jelajahi keindahan bali bersama kami',  // ganti ke brand client\n"
        "  heroSubtitle: 'paket tour terlengkap dengan harga terbaik',\n"
        "  brandName: 'Tour Company X',\n"
        "  // ...\n"
        "}\n"
        "en: { /* sama, versi inggris */ }\n"
        "zh: { /* sama, versi mandarin */ }"
    ))

    story.append(add_heading('4.3 Paket Tour & Destinasi', level=1))
    story.append(body(
        'Ini bagian paling kompleks. BWT punya struktur paket: <b>4 paket reguler</b> (A, B, C, D), '
        '<b>4 paket Nusa Penida</b> (NP-A, NP-B, NP-C, NP-D), dan <b>1 paket multi-hari</b> '
        '(4D3N Discover Penida). Untuk client baru, ganti seluruh konten paket dengan paket '
        'milik client. Lokasi: <code>src/components/paket-tour-section.tsx</code> dan '
        '<code>src/lib/i18n/translations.ts</code>.'
    ))

    story.append(body('Checklist penggantian:'))
    story.append(checklist('Nama paket (npPackageA, npPackageB, pkgA, pkgB, dll)'))
    story.append(checklist('Deskripsi paket (pkgADesc, npPackageADesc, dll)'))
    story.append(checklist('Daftar destinasi (npDestKelingking, destTanahLot, dll)'))
    story.append(checklist('Harga per pax di array prices (paket-tour-section.tsx)'))
    story.append(checklist('Include & exclude items (npInclude1-8, include1-10)'))
    story.append(checklist('Syarat & ketentuan (termsKeys di multiDayPackages)'))
    story.append(checklist('Itinerary paket multi-hari (day1Title, day1Desc, day1Meals, dll)'))
    story.append(checklist('Gambar paket (public/images/package-*.jpg, nusa-penida.jpg)'))

    story.append(add_heading('4.4 Multi-Bahasa Konsisten', level=1))
    story.append(body(
        'BWT punya 3 bahasa: <b>Indonesia (id)</b>, <b>English (en)</b>, dan <b>Mandarin (zh)</b>. '
        'Untuk client baru, tentukan bahasa target terlebih dahulu. Jika client hanya butuh 1 '
        'bahasa (misal: ID only), hapus blok en dan zh dari translations.ts untuk mengurangi '
        'maintenance. Jika client butuh bahasa lain seperti Korea atau Jepang, tambah blok baru '
        'dan gunakan jasa translator (budget Rp 200-500K per bahasa untuk 100+ string).'
    ))

    story.append(add_heading('4.5 Tombol CTA & Microcopy', level=1))
    story.append(body(
        'Microcopy adalah teks pendek di tombol, label form, dan tooltip. Walaupun terlihat '
        'kecil, microcopy yang konsisten dengan brand voice client akan menambah profesionalisme. '
        'Contoh: BWT menggunakan "Booking Sekarang" dan "Tanya WhatsApp". Jika client lebih '
        'santai, bisa diganti jadi "Pesan Tour" dan "Chat di WhatsApp". Cari semua instance CTA '
        'di translations.ts dan komponen.'
    ))

    story.append(PageBreak())
    return story


def build_chapter_5():
    """Bab 5 - Domain, Hosting & Email"""
    story = []
    story.append(add_heading('Bab 5 - Domain, Hosting & Email', level=0))

    story.append(body(
        'Domain adalah alamat online client di internet. Hosting di Vercel sudah include '
        'gratis untuk hobby plan (cukup untuk traffic kecil-menengah). Email bisnis dengan '
        'domain sendiri (hello@client.com) lebih profesional daripada gmail gratis.'
    ))

    story.append(add_heading('5.1 Pembelian Domain', level=1))
    story.append(body(
        'Rekomendasi registrar domain: <b>Namecheap</b> (murah, free WHOIS privacy), '
        '<b>Cloudflare</b> (DNS cepat, harga cost), <b>Niagahoster</b> (untuk .id, support lokal). '
        'Estimasi biaya: .com Rp 150-200K/tahun, .id Rp 300-500K/tahun. Beli domain langsung '
        'atas nama client agar client punya kepemilikan penuh.'
    ))

    story.append(add_heading('5.2 Setup DNS ke Vercel', level=1))
    story.append(body(
        'Setelah domain dibeli, arahkan DNS ke Vercel. Ada 2 metode: <b>A Record</b> (untuk '
        'apex domain seperti client.com) atau <b>CNAME</b> (untuk subdomain seperti www.client.com). '
        'Vercel dashboard akan memberikan nilai record yang harus di-set.'
    ))

    story.append(code_block(
        "# Contoh DNS Record (di dashboard registrar):\n"
        "Type    Name     Value                          TTL\n"
        "A       @        76.76.21.21                    Auto\n"
        "CNAME   www      cname.vercel-dns.com           Auto\n"
        "\n"
        "# Optional: email via Google Workspace\n"
        "MX      @        aspmx.l.google.com             3600\n"
        "TXT     @        google-site-verification=XXX   3600"
    ))

    story.append(body(
        'Setelah DNS di-set, tambahkan domain di Vercel dashboard: <b>Project Settings &gt; '
        'Domains &gt; Add</b>. Vercel akan otomatis generate SSL certificate (Let\'s Encrypt). '
        'Tunggu 5-30 menit untuk propagasi DNS sebelum domain aktif.'
    ))

    story.append(add_heading('5.3 Email Bisnis', level=1))
    story.append(body(
        'Untuk email bisnis dengan domain sendiri (hello@client.com), rekomendasi: '
        '<b>Google Workspace</b> (Rp 110K/bulan/user, familiar, integrate dengan Google Calendar), '
        '<b>Zoho Mail</b> (gratis 5 user, cukup untuk bisnis kecil), atau '
        '<b>Cloudflare Email Routing</b> (gratis, forward ke gmail). Pilih berdasarkan budget '
        'client dan kebutuhan storage.'
    ))

    story.append(add_heading('5.4 Subdomain untuk Staging', level=1))
    story.append(body(
        'Best practice: setup 2 domain - <b>production</b> (client.com) untuk live site, dan '
        '<b>staging</b> (staging.client.com atau dev.client.com) untuk testing perubahan sebelum '
        'push ke production. Staging domain gratis di Vercel (preview deployment otomatis). '
        'Dengan staging, client bisa preview perubahan tanpa risiko ganggu production.'
    ))

    story.append(PageBreak())
    return story


def build_chapter_6():
    """Bab 6 - SEO & Metadata"""
    story = []
    story.append(add_heading('Bab 6 - SEO & Metadata', level=0))

    story.append(body(
        'SEO (Search Engine Optimization) menentukan apakah website client muncul di hasil '
        'pencarian Google. Setup metadata yang benar di awal akan memberikan dampak jangka '
        'panjang pada traffic organik. BWT sudah implementasi metadata Next.js, tinggal ganti '
        'kontennya dengan info client.'
    ))

    story.append(add_heading('6.1 Title & Meta Description', level=1))
    story.append(body(
        'Lokasi: <code>src/app/layout.tsx</code> di bagian export const metadata. Title tag '
        'harus 50-60 karakter, meta description 150-160 karakter. Sertakan keyword utama dan '
        'nama brand.'
    ))

    story.append(code_block(
        "// src/app/layout.tsx\n"
        "export const metadata: Metadata = {\n"
        "  title: {\n"
        "    default: 'Tour Company X - Paket Tour Bali Terlengkap',  // ganti ke brand client\n"
        "    template: '%s | Tour Company X',\n"
        "  },\n"
        "  description: 'jelajahi keindahan bali dengan paket tour terlengkap...',  // 150-160 char\n"
        "  keywords: ['paket tour bali', 'tour company x', 'wisata bali'],  // 5-10 keyword\n"
        "  authors: [{ name: 'Tour Company X' }],\n"
        "  openGraph: { /* lihat sub-bab OG */ },\n"
        "}"
    ))

    story.append(add_heading('6.2 Open Graph & Twitter Card', level=1))
    story.append(body(
        'OG image adalah preview yang muncul saat link dishare di Facebook/WhatsApp/LinkedIn. '
        'Buat custom OG image 1200x630px dengan logo client + tagline. Lokasi: '
        '<code>public/og-image.jpg</code> dan <code>src/app/opengraph-image.png</code>. '
        'Twitter card image ukuran 1200x600px.'
    ))

    og_data = [
        ['Property', 'Ukuran', 'Format', 'Lokasi'],
        ['og:image', '1200x630px', 'JPG/PNG', 'public/og-image.jpg'],
        ['twitter:card', '1200x600px', 'JPG/PNG', 'public/twitter-card.jpg'],
        ['favicon', '32x32, 16x16', 'ICO', 'public/favicon.ico'],
        ['apple-touch-icon', '180x180px', 'PNG', 'public/apple-touch-icon.png'],
        ['manifest icon', '192x192, 512x512', 'PNG', 'public/icon-*.png'],
    ]
    story.append(make_table(og_data, col_widths=[140, 130, 80, CONTENT_WIDTH - 140 - 130 - 80]))
    story.append(spacer(8))

    story.append(add_heading('6.3 Sitemap & Robots.txt', level=1))
    story.append(body(
        'Sitemap membantu Google menemukan semua halaman website. BWT menggunakan Next.js '
        'dynamic sitemap di <code>src/app/sitemap.ts</code>. Update dengan URL client. '
        'Robots.txt di <code>src/app/robots.ts</code> - pastikan tidak memblock crawl.'
    ))

    story.append(code_block(
        "// src/app/sitemap.ts\n"
        "export default async function sitemap(): Promise<MetadataRoute.Sitemap> {\n"
        "  const baseUrl = 'https://tourcompanyx.com';  // ganti ke domain client\n"
        "  return [\n"
        "    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },\n"
        "    { url: `${baseUrl}/#paket-tour`, lastModified: new Date(), priority: 0.8 },\n"
        "    { url: `${baseUrl}/#kontak-booking`, lastModified: new Date(), priority: 0.9 },\n"
        "  ];\n"
        "}"
    ))

    story.append(add_heading('6.4 Google Analytics & Search Console', level=1))
    story.append(body(
        'Setup analytics untuk tracking pengunjung: <b>Google Analytics 4</b> (gratis, '
        'komprehensif) atau <b>Vercel Analytics</b> (built-in, simpel). Tambahkan '
        '<code>NEXT_PUBLIC_GA_ID</code> di <code>.env.local</code> dan environment variables '
        'di Vercel dashboard. Submit sitemap ke Google Search Console untuk indexing cepat.'
    ))

    story.append(add_heading('6.5 Schema Markup (JSON-LD)', level=1))
    story.append(body(
        'Schema markup membantu Google memahami konteks bisnis (TouristAttraction, '
        'LocalBusiness, TouristTrip). Tambahkan di <code>src/app/layout.tsx</code> atau '
        'komponen halaman terkait. Contoh schema untuk TouristAttraction:'
    ))

    story.append(code_block(
        '// src/app/layout.tsx\n'
        'const jsonLd = {\n'
        '  "@context": "https://schema.org",\n'
        '  "@type": "TouristAttraction",\n'
        '  "name": "Tour Company X",\n'
        '  "image": "https://tourcompanyx.com/og-image.jpg",\n'
        '  "url": "https://tourcompanyx.com",\n'
        '  "telephone": "+62-xxx-xxx-xxxx",\n'
        '  "priceRange": "$$",\n'
        '  "address": { /* alamat client */ }\n'
        '};\n'
        '// Render: <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />'
    ))

    story.append(PageBreak())
    return story


def build_chapter_7():
    """Bab 7 - Aset Visual & Media"""
    story = []
    story.append(add_heading('Bab 7 - Aset Visual & Media', level=0))

    story.append(body(
        'Aset visual (foto, video, ilustrasi) adalah elemen yang paling mempengaruhi kesan '
        'pertama pengunjung. Foto destinasi yang berkualitas tinggi akan meningkatkan '
        'konversi booking. Sebaliknya, foto buram atau tidak relevan akan menurunkan kepercayaan '
        'calon customer. Bab ini berisi checklist aset media yang wajib disiapkan.'
    ))

    story.append(add_heading('7.1 Foto Destinasi & Paket Tour', level=1))
    story.append(body(
        'BWT punya sekitar 20+ foto destinasi di folder <code>public/images/</code>. Ganti '
        'semua dengan foto destinasi client. Jika client tidak punya foto sendiri, gunakan '
        'stok foto gratis dari <b>Unsplash</b>, <b>Pexels</b>, atau <b>Pixabay</b> dengan '
        'lisensi komersial gratis.'
    ))

    photo_data = [
        ['Aset', 'Dimensi', 'Format', 'Lokasi', 'Catatan'],
        ['Hero homepage', '1920x1080', 'WebP/JPG', 'public/images/hero-bg.jpg', 'Foto utama, koma 60%'],
        ['Foto paket A', '1200x800', 'WebP/JPG', 'public/images/package-a.jpg', '1 foto per paket'],
        ['Foto paket B', '1200x800', 'WebP/JPG', 'public/images/package-b.jpg', ''],
        ['Foto paket C', '1200x800', 'WebP/JPG', 'public/images/package-c.jpg', ''],
        ['Foto paket D', '1200x800', 'WebP/JPG', 'public/images/package-d.jpg', ''],
        ['Foto Nusa Penida', '1200x800', 'WebP/JPG', 'public/images/nusa-penida.jpg', '4 foto NP'],
        ['Foto gallery', '800x600', 'WebP/JPG', 'public/images/gallery-*.jpg', 'Min 6 foto'],
        ['Logo brand', 'SVG/PNG', 'SVG prefer', 'public/images/logo.svg', 'Transparan'],
        ['OG image', '1200x630', 'JPG', 'public/og-image.jpg', 'Share preview'],
    ]
    story.append(make_table(photo_data, col_widths=[100, 80, 60, 160, CONTENT_WIDTH - 100 - 80 - 60 - 160]))
    story.append(spacer(8))

    story.append(add_heading('7.2 Optimasi Gambar', level=1))
    story.append(body(
        'Semua gambar wajib dioptimasi untuk fast loading. Target: setiap foto < 300KB. '
        'Gunakan <b>TinyPNG</b> (online, gratis 20 foto/hari), <b>Squoosh</b> (Google, gratis), '
        'atau <b>Sharp</b> (Node.js library, otomatis via script). Konversi semua JPG ke WebP '
        'untuk ukuran 25-35% lebih kecil dengan kualitas sama.'
    ))

    story.append(code_block(
        '# Contoh script optimasi batch menggunakan Sharp\n'
        '# Install: npm install sharp\n'
        '# File: scripts/optimize-images.js\n'
        '\n'
        'const sharp = require("sharp");\n'
        'const fs = require("fs");\n'
        '\n'
        'const inputDir = "./public/images/raw/";\n'
        'const outputDir = "./public/images/";\n'
        '\n'
        'fs.readdirSync(inputDir).forEach(file => {\n'
        '  if (!file.match(/\\.(jpg|jpeg|png)$/i)) return;\n'
        '  sharp(inputDir + file)\n'
        '    .resize(1200, 800, { fit: "cover" })\n'
        '    .webp({ quality: 80 })\n'
        '    .toFile(outputDir + file.replace(/\\.(jpg|jpeg|png)$/i, ".webp"));\n'
        '});'
    ))

    story.append(add_heading('7.3 Favicon Set Lengkap', level=1))
    story.append(body(
        'Favicon adalah ikon kecil yang muncul di tab browser. Generate set lengkap dari logo '
        'client menggunakan <b>realfavicongenerator.net</b> (gratis) atau <b>favicon.io</b>. '
        'Upload semua file ke folder <code>public/</code>. Set lengkap mencakup: favicon.ico '
        '(16x16, 32x32), apple-touch-icon.png (180x180), icon-192.png dan icon-512.png '
        '(Android Chrome), safari-pinned-tab.svg (SVG monokrom).'
    ))

    story.append(add_heading('7.4 Video & Aset Dinamis', level=1))
    story.append(body(
        'Jika client punya video promo tour, upload ke YouTube/Vimeo dan embed di homepage. '
        'Jangan host video langsung di Vercel (limit 100MB file size, bandwidth terbatas). '
        'Untuk background video di hero section, gunakan file pendek (5-10 detik, loop, '
        '< 5MB) atau pakai animasi CSS saja untuk performa lebih baik.'
    ))

    story.append(PageBreak())
    return story


def build_chapter_8():
    """Bab 8 - Kontak & Integrasi Pihak Ketiga"""
    story = []
    story.append(add_heading('Bab 8 - Kontak & Integrasi Pihak Ketiga', level=0))

    story.append(body(
        'Integrasi pihak ketiga (WhatsApp, email, payment, analytics) memungkinkan website '
        'berinteraksi dengan sistem eksternal. Setiap integrasi punya API key atau ID yang '
        'harus di-update untuk client baru. Jangan pernah commit API key ke Git - selalu '
        'simpan di environment variables.'
    ))

    story.append(add_heading('8.1 WhatsApp Business', level=1))
    story.append(body(
        'Nomor WhatsApp BWT tersebar di sekitar 15-20 lokasi di codebase. Cara paling efisien: '
        'cari semua instance nomor lama <code>6285222329128</code> via Find in Files, lalu '
        'ganti ke nomor client (format: 62xxx tanpa tanda + atau 0 di depan).'
    ))

    story.append(code_block(
        '# Cari semua instance nomor WhatsApp BWT\n'
        'grep -rn "6285222329128" src/ public/ 2>/dev/null\n'
        '\n'
        '# Format link WhatsApp dengan pre-filled message\n'
        '# https://wa.me/62XXX?text=Halo%20Tour%20Company%20X%2C%20saya%20mau%20booking...\n'
        '\n'
        '# Contoh di komponen:\n'
        '<Link href="https://wa.me/62XXX?text=Halo%20Tour%20Company%20X%2C%20saya%20mau%20tanya%20paket%20tour">\n'
        '  <Phone /> Chat WhatsApp\n'
        '</Link>'
    ))

    story.append(add_heading('8.2 Email Kontak', level=1))
    story.append(body(
        'Cari email <code>heryrobeth2@gmail.com</code> di seluruh codebase, ganti dengan email '
        'bisnis client (hello@client.com). Lokasi utama: <code>src/components/footer.tsx</code>, '
        '<code>src/components/contact-section.tsx</code>, <code>src/lib/i18n/translations.ts</code>. '
        'Pertimbangkan menggunakan form contact (dengan Resend atau Nodemailer) agar email '
        'tidak terlihat langsung di source code (mengurangi spam).'
    ))

    story.append(add_heading('8.3 Google Maps Embed', level=1))
    story.append(body(
        'Google Maps embed di section kontak menunjukkan lokasi kantor client. Cari Google Maps '
        'URL di <code>src/components/contact-section.tsx</code> atau <code>footer.tsx</code>, '
        'ganti dengan lokasi client. Dapatkan embed code via Google Maps &gt; Share &gt; Embed '
        'a map. Pakai iframe standard (tanpa API key) sudah cukup untuk display.'
    ))

    story.append(add_heading('8.4 Social Media Links', level=1))
    story.append(body(
        'Update semua link social media di footer dan contact section. Cari icon social '
        '(Instagram, Facebook, TikTok, YouTube) di <code>src/components/footer.tsx</code>. '
        'Hapus platform yang tidak dipakai client, tambah yang dipakai. Pastikan link membuka '
        'di tab baru (target="_blank" rel="noopener noreferrer").'
    ))

    story.append(add_heading('8.5 Payment Gateway (Opsional)', level=1))
    story.append(body(
        'Jika client butuh online payment (DP atau full payment online), integrasikan payment '
        'gateway: <b>Midtrans</b> (paling populer di Indonesia, support QRIS, e-wallet, '
        'kartu kredit - fee 2-3% per transaksi), <b>Xendit</b> (alternatif, fitur serupa), '
        'atau <b>DOKU</b>. Setup API keys di Vercel environment variables. BWT saat ini belum '
        'punya payment gateway - booking via WhatsApp only.'
    ))

    story.append(add_heading('8.6 Analytics & Tracking', level=1))
    story.append(body(
        'Setiap client idealnya punya akun analytics sendiri agar mereka bisa monitoring '
        'traffic secara mandiri. Setup: <b>Google Analytics 4</b> (gratis, untuk traffic '
        'analysis), <b>Google Search Console</b> (gratis, untuk indexing & SEO), '
        '<b>Facebook Pixel</b> (opsional, jika client jalan iklan Facebook/Instagram). '
        'Tambahkan ID tracking di <code>.env.local</code> dan Vercel env vars.'
    ))

    story.append(PageBreak())
    return story


def build_chapter_9():
    """Bab 9 - Database & Data Bisnis"""
    story = []
    story.append(add_heading('Bab 9 - Database & Data Bisnis', level=0))

    story.append(body(
        'Database BWT berisi data demo (members, vouchers, rewards, tour packages) yang '
        'tidak boleh dibawa ke client baru. Reset database sepenuhnya dan isi ulang dengan '
        'data bisnis client. BWT menggunakan <b>SQLite</b> via Prisma ORM - simpel dan cukup '
        'untuk traffic kecil. Untuk client dengan traffic tinggi, migrasi ke PostgreSQL '
        '(Vercel Postgres atau Supabase).'
    ))

    story.append(add_heading('9.1 Reset Database', level=1))
    story.append(body(
        'Hapus database lama dan buat fresh. Jalankan command berikut di root project:'
    ))

    story.append(code_block(
        '# Hapus database lama\n'
        'rm prisma/dev.db\n'
        '\n'
        '# Apply schema ke database baru\n'
        'npx prisma db push\n'
        '\n'
        '# (Optional) Buka Prisma Studio untuk inspeksi\n'
        'npx prisma studio\n'
        '\n'
        '# (Production) Set DATABASE_URL di Vercel env vars\n'
        '# Jangan commit file dev.db ke Git!'
    ))

    story.append(add_heading('9.2 Reset Data Demo', level=1))
    story.append(body(
        'File <code>src/lib/demo-data.ts</code> berisi data dummy untuk demo (5 tour packages, '
        '3 sample members, 2 vouchers). Hapus atau ganti dengan data bisnis client. Untuk '
        'production, sebaiknya data tidak di-hardcode di file, tapi di-fetch dari database '
        'via Prisma queries.'
    ))

    story.append(add_heading('9.3 Reset Membership Data', level=1))
    story.append(body(
        'BWT punya sistem membership dengan tier (Silver, Gold, Platinum) dan point reward. '
        'Lokasi: <code>prisma/seed.ts</code>. Hapus semua sample members, voucher templates, '
        'dan reward items. Setup tier membership sesuai struktur bisnis client (mungkin '
        'beda nama tier, beda threshold point, beda reward).'
    ))

    story.append(add_heading('9.4 Admin Account & Security', level=1))
    story.append(body(
        'Ganti default admin credentials untuk client. Lokasi: <code>prisma/seed.ts</code> '
        '(look for admin user). Set password yang kuat (min 12 karakter, kombinasi huruf, '
        'angka, simbol). Generate NEXTAUTH_SECRET baru untuk client - jangan pakai secret BWT.'
    ))

    story.append(code_block(
        '# Generate NEXTAUTH_SECRET baru\n'
        'openssl rand -base64 32\n'
        '\n'
        '# Set di .env.local (development) dan Vercel env vars (production)\n'
        'NEXTAUTH_SECRET="generated-secret-string-here"\n'
        'NEXTAUTH_URL="https://tourcompanyx.com"\n'
        'DATABASE_URL="file:./dev.db"  # development\n'
        '# DATABASE_URL="postgresql://..." # production'
    ))

    story.append(add_heading('9.5 Testing End-to-End', level=1))
    story.append(body(
        'Sebelum deploy ke production, test semua flow bisnis secara end-to-end:'
    ))
    story.append(checklist('Login admin dengan credentials baru - berhasil'))
    story.append(checklist('Login member (daftar baru) - berhasil'))
    story.append(checklist('Booking paket tour - tombol "Booking Sekarang" redirect ke WhatsApp dengan pesan yang benar'))
    story.append(checklist('Cek paket tour ditampilkan dengan harga yang benar (3 bahasa)'))
    story.append(checklist('Multi-day package dialog detail - itinerary Day 1-4 tampil rapi di mobile & desktop'))
    story.append(checklist('Membership daftar + login + redeem reward - flow lengkap'))
    story.append(checklist('Voucher verify via API - respond 200 OK'))
    story.append(checklist('Form kontak kirim ke email client'))

    story.append(PageBreak())
    return story


def build_chapter_10():
    """Bab 10 - Final QC & Go-Live Checklist"""
    story = []
    story.append(add_heading('Bab 10 - Final QC & Go-Live Checklist', level=0))

    story.append(body(
        'Final Quality Control (QC) adalah gerbang terakhir sebelum website client go-live. '
        'Lewati tahap ini dan Anda akan kena komplain client besoknya. Investasi 30 menit '
        'untuk QC akan menghemat berjam-jam debugging masalah di produksi. Jalankan setiap '
        'item di bawah secara berurutan, jangan skip.'
    ))

    story.append(add_heading('10.1 Cross-Browser & Cross-Device Test', level=1))
    story.append(body('Test website di minimal 4 kombinasi browser + device:'))
    story.append(checklist('Mobile Safari (iPhone) - layout responsif, semua section rapi'))
    story.append(checklist('Mobile Chrome (Android) - layout responsif, tombol CTA bisa di-tap'))
    story.append(checklist('Desktop Chrome - layout grid 3-4 kolom, hover effects'))
    story.append(checklist('Desktop Firefox - layout tidak rusak, font render OK'))
    story.append(checklist('Desktop Safari (jika ada) - layout tidak rusak'))
    story.append(checklist('Desktop Edge - layout tidak rusak'))
    story.append(checklist('Hard refresh (Ctrl+Shift+R) di setiap device untuk clear cache'))

    story.append(add_heading('10.2 Functional Test', level=1))
    story.append(body('Test semua fitur interaktif:'))
    story.append(checklist('Ganti bahasa (ID/EN/ZH) - semua teks berubah, tidak ada string kosong'))
    story.append(checklist('Semua internal link tidak 404 - cek header nav, footer links, CTA buttons'))
    story.append(checklist('Form booking/kontak kirim ke WhatsApp/email client (bukan BWT)'))
    story.append(checklist('Multi-day package "Lihat Detail" dialog buka & tutup dengan smooth'))
    story.append(checklist('Itinerary Day 1-4 di dialog - layout rapi di mobile (tidak overlap)'))
    story.append(checklist('Carousel gambar paket multi-hari - next/prev button berfungsi'))
    story.append(checklist('Horizontal scroll kartu paket di mobile - swipe gesture jalan'))
    story.append(checklist('Membership login & dashboard - data user tampil benar'))
    story.append(checklist('Voucher verify endpoint - return JSON success'))

    story.append(add_heading('10.3 SEO & Performance Audit', level=1))
    story.append(body('Test via Chrome DevTools &gt; Lighthouse:'))
    story.append(checklist('Lighthouse Performance score > 90'))
    story.append(checklist('Lighthouse Accessibility score > 90'))
    story.append(checklist('Lighthouse Best Practices > 90'))
    story.append(checklist('Lighthouse SEO > 90'))
    story.append(checklist('First Contentful Paint (FCP) < 1.5 detik'))
    story.append(checklist('Largest Contentful Paint (LCP) < 2.5 detik'))
    story.append(checklist('Page size total < 2MB'))
    story.append(checklist('View-source: cek title tag, meta description, OG tags sudah benar'))
    story.append(checklist('Test di mobile-friendly test Google Search Console'))

    story.append(add_heading('10.4 Pre-Launch Setup', level=1))
    story.append(body('Sebelum tekan tombol "Deploy" ke production:'))
    story.append(checklist('Submit sitemap.xml ke Google Search Console'))
    story.append(checklist('Setup Vercel Analytics di dashboard'))
    story.append(checklist('Backup database awal (download dev.db atau export dari Vercel)'))
    story.append(checklist('Setup uptime monitoring (UptimeRobot gratis - alert jika website down)'))
    story.append(checklist('Test SSL certificate valid (https://www.ssllabs.com/ssltest/)'))
    story.append(checklist('Custom domain sudah aktif & redirect www ke non-www (atau sebaliknya)'))
    story.append(checklist('Test deploy ke Vercel preview domain sebelum production'))

    story.append(add_heading('10.5 Handover ke Client', level=1))
    story.append(body(
        'Setelah go-live, handover semua kredensial dan dokumentasi ke client. Buat satu '
        'folder Google Drive / Dropbox berisi:'
    ))
    story.append(checklist('Akun Vercel (email + password atau invite sebagai team member)'))
    story.append(checklist('Akun registrar domain (Namecheap/Cloudflare)'))
    story.append(checklist('Akun Google Workspace / email bisnis'))
    story.append(checklist('Akun Google Analytics & Search Console'))
    story.append(checklist('Akun Google Maps Platform (jika ada API key)'))
    story.append(checklist('Akun payment gateway (Midtrans/Xendit) jika ada'))
    story.append(checklist('Admin credentials website (URL, username, password)'))
    story.append(checklist('Panduan singkat: cara update paket tour, cara tambah member, cara cek booking'))
    story.append(checklist('Dokumen ini (Setup Guide) sebagai referensi teknis'))

    story.append(add_heading('10.6 Post-Launch Monitoring (7 Hari Pertama)', level=1))
    story.append(body(
        'Pantau website client selama 7 hari pertama setelah go-live. Cek setiap hari: '
        'apakah website uptime 100%? Apakah ada error log di Vercel? Apakah ada user baru '
        'daftar member? Apakah ada booking masuk via WhatsApp? Jika ada masalah, respons '
        'dalam 24 jam. Setelah 7 hari stabil, serahkan monitoring penuh ke client (atau '
        'tawarkan paket maintenance bulanan sebagai upsell).'
    ))

    story.append(PageBreak())
    return story


def build_appendix_a():
    """Lampiran A - Template Briefing Client"""
    story = []
    story.append(add_heading('Lampiran A - Template Briefing Client', level=0))

    story.append(body(
        'Form kosong di bawah ini bisa di-print atau dijadikan Google Form untuk dikirim ke '
        'client. Minta client mengisi semua bagian sebelum mulai coding. Jika ada bagian yang '
        'kosong, follow-up ke client - jangan asumsi.'
    ))

    story.append(add_heading('A.1 Informasi Brand', level=1))
    story.append(body('Nama Brand: _________________________________________________'))
    story.append(body('Tagline: _________________________________________________'))
    story.append(body('Tahun berdiri: _________________________________________________'))
    story.append(body('Nama pemilik / kontak person: _________________________________________________'))

    story.append(add_heading('A.2 Brand Visual', level=1))
    story.append(body('Warna primer (HEX): _________________________________________________'))
    story.append(body('Warna sekunder (HEX): _________________________________________________'))
    story.append(body('Warna aksen (HEX): _________________________________________________'))
    story.append(body('Logo file (upload): _________________________________________________'))
    story.append(body('Font preferensi (jika ada): _________________________________________________'))

    story.append(add_heading('A.3 Kontak & Online Presence', level=1))
    story.append(body('Domain yang diinginkan: _________________________________________________'))
    story.append(body('Nomor WhatsApp bisnis: _________________________________________________'))
    story.append(body('Email bisnis: _________________________________________________'))
    story.append(body('Alamat kantor (untuk Google Maps): _________________________________________________'))
    story.append(body('Instagram: _________________________________________________'))
    story.append(body('Facebook: _________________________________________________'))
    story.append(body('TikTok: _________________________________________________'))
    story.append(body('YouTube: _________________________________________________'))

    story.append(add_heading('A.4 Paket Tour & Destinasi', level=1))
    story.append(body('Daftar paket tour yang ditawarkan (5 slot, tambah lembar jika perlu):'))
    story.append(body('1. Nama: _________________ | Destinasi: _________________ | Harga: _________________'))
    story.append(body('2. Nama: _________________ | Destinasi: _________________ | Harga: _________________'))
    story.append(body('3. Nama: _________________ | Destinasi: _________________ | Harga: _________________'))
    story.append(body('4. Nama: _________________ | Destinasi: _________________ | Harga: _________________'))
    story.append(body('5. Nama: _________________ | Destinasi: _________________ | Harga: _________________'))

    story.append(add_heading('A.5 Bahasa & Target Market', level=1))
    story.append(body('Bahasa website (centang yang relevan):'))
    story.append(checklist('Indonesia'))
    story.append(checklist('English'))
    story.append(checklist('Mandarin'))
    story.append(checklist('Korea'))
    story.append(checklist('Jepang'))
    story.append(checklist('Lainnya: _________________________________________________'))
    story.append(body('Target market utama: _________________________________________________'))

    story.append(add_heading('A.6 Timeline & Budget', level=1))
    story.append(body('Deadline go-live: _________________________________________________'))
    story.append(body('Budget terjangkau: _________________________________________________'))
    story.append(body('DP 50% sudah dibayar: ____________________ (tanggal)'))
    story.append(body('Catatan tambahan: _________________________________________________'))

    story.append(PageBreak())
    return story


def build_appendix_b():
    """Lampiran B - Daftar File Penting"""
    story = []
    story.append(add_heading('Lampiran B - Daftar File Penting', level=0))

    story.append(body(
        'Daftar file dan folder yang wajib dimodifikasi saat duplikasi project BWT ke client '
        'baru. Urutan berdasarkan prioritas - file di atas lebih kritis. Gunakan Find in Files '
        'di VS Code untuk navigasi cepat.'
    ))

    file_data = [
        ['Path File', 'Fungsi', 'Aksi yang Diperlukan'],
        ['public/images/*', 'Semua aset gambar', 'Ganti dengan foto client (logo, hero, paket, gallery)'],
        ['public/favicon.ico', 'Favicon browser', 'Generate dari logo client'],
        ['public/og-image.jpg', 'OG image share', 'Buat 1200x630px dengan brand client'],
        ['src/app/layout.tsx', 'Root layout + metadata', 'Update title, description, OG, JSON-LD'],
        ['src/app/globals.css', 'Global styles + brand variables', 'Update CSS variables warna brand'],
        ['src/app/sitemap.ts', 'Sitemap.xml dinamis', 'Update baseUrl ke domain client'],
        ['src/app/robots.ts', 'Robots.txt', 'Update sitemap URL'],
        ['src/lib/i18n/translations.ts', 'Semua string teks (ID/EN/ZH)', 'Ganti nama brand, paket, deskripsi, kontak'],
        ['src/lib/demo-data.ts', 'Data dummy demo', 'Hapus atau ganti dengan data client'],
        ['src/components/header.tsx', 'Navbar + logo', 'Ganti logo, nama brand, link nav'],
        ['src/components/footer.tsx', 'Footer + kontak', 'Update kontak, social media, copyright'],
        ['src/components/hero-section.tsx', 'Hero homepage', 'Ganti hero text & background image'],
        ['src/components/paket-tour-section.tsx', 'Daftar paket tour', 'Update array paket, harga, destinasi'],
        ['src/components/multi-day-package-card.tsx', 'Paket multi-hari (4D3N)', 'Update data paket, gambar, itinerary'],
        ['src/components/contact-section.tsx', 'Section kontak', 'Update WA, email, Google Maps embed'],
        ['prisma/schema.prisma', 'Database schema', 'Tidak perlu diubah (struktur sama)'],
        ['prisma/seed.ts', 'Seed data (admin, members)', 'Reset & ganti dengan data client'],
        ['.env.local', 'Environment variables', 'Update semua secrets & API keys'],
        ['tailwind.config.ts', 'Tailwind config', 'Update fontFamily & warna brand'],
        ['public/manifest.json', 'PWA manifest', 'Update name, short_name, icons'],
    ]
    story.append(make_table(file_data, col_widths=[200, 150, CONTENT_WIDTH - 200 - 150]))
    story.append(spacer(8))

    story.append(add_heading('B.1 Command Cepat untuk Audit', level=1))
    story.append(body('Beberapa command yang berguna saat proses duplikasi:'))

    story.append(code_block(
        '# Cari semua instance nomor WhatsApp BWT\n'
        'grep -rn "6285222329128" src/ public/ 2>/dev/null\n'
        '\n'
        '# Cari semua instance email BWT\n'
        'grep -rn "heryrobeth2@gmail.com" src/ public/ 2>/dev/null\n'
        '\n'
        '# Cari semua instance nama brand "Bali Willy Tour" / "BWT"\n'
        'grep -rnE "Bali Willy Tour|BWT" src/ public/ 2>/dev/null\n'
        '\n'
        '# Cari semua instance warna teal BWT\n'
        'grep -rn "teal-600\\|teal-700\\|#0F766E" src/ 2>/dev/null\n'
        '\n'
        '# Cari semua link hardcoded ke domain BWT\n'
        'grep -rn "my-project-delta-pearl.vercel.app\\|bali-willy-tour" src/ public/ 2>/dev/null\n'
        '\n'
        '# Reset database\n'
        'rm prisma/dev.db && npx prisma db push\n'
        '\n'
        '# Build lokal untuk verifikasi\n'
        'npm run build\n'
        '\n'
        '# Deploy ke Vercel production\n'
        'npx vercel deploy --prod --token VERCEL_TOKEN'
    ))

    story.append(add_heading('B.2 Catatan Akhir', level=1))
    story.append(body(
        'Dokumen ini akan terus di-update seiring pengalaman menangani client baru. Catat setiap '
        'kasus khusus yang ditemukan di lapangan (misal: client minta fitur tidak standar, '
        'masalah compatibility dengan service tertentu, atau tips yang mempercepat workflow). '
        'Update dokumen di versi berikutnya agar knowledge base terus berkembang.'
    ))
    story.append(body(
        'Untuk pertanyaan teknis atau klarifikasi, hubungi developer yang mengerjakan BWT '
        'atau buka issue di repository internal. Selamat menjalankan proyek client baru!'
    ))

    return story


# ============================================================
# MAIN BUILD
# ============================================================
def main():
    output_path = '/home/z/my-project/scripts/setup_guide/body.pdf'

    doc = TocDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=LEFT_MARGIN,
        rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN,
        bottomMargin=BOTTOM_MARGIN,
        title='Setup Guide untuk Client Baru',
        author='Bali Willy Tour',
        subject='Checklist Branding untuk Duplikasi Website BWT',
        creator='BWT Internal',
    )

    story = []

    # TOC first
    story.extend(build_toc())

    # Chapters
    story.extend(build_chapter_1())
    story.extend(build_chapter_2())
    story.extend(build_chapter_3())
    story.extend(build_chapter_4())
    story.extend(build_chapter_5())
    story.extend(build_chapter_6())
    story.extend(build_chapter_7())
    story.extend(build_chapter_8())
    story.extend(build_chapter_9())
    story.extend(build_chapter_10())
    story.extend(build_appendix_a())
    story.extend(build_appendix_b())

    doc.multiBuild(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f'Body PDF generated: {output_path}')


if __name__ == '__main__':
    main()
