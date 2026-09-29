"""Export the existing Butterfly back print. Requires Pillow, CairoSVG, fonttools and Node."""

import io
import json
from pathlib import Path
import subprocess
import zipfile

import cairosvg
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageCms, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "exports" / "printful" / "butterfly"
OUT.mkdir(parents=True, exist_ok=True)
art = json.loads(subprocess.check_output([
    "node", "--input-type=module", "-e",
    'import {artworkGrids,ringRadius,ringStroke} from "./src/artwork.ts";'
    'console.log(JSON.stringify({grid:artworkGrids.butterfly,ringRadius,ringStroke}));',
], cwd=ROOT, text=True))

# Match GarmentImage.tsx's 464 x 360 nested SVG, centered at x=512.
grid = art["grid"]
step = min(464 / grid["columns"], 360 / grid["rows"])
origin_x = 280 + (464 - grid["columns"] * step) / 2 + step / 2
origin_y = 525 + (360 - grid["rows"] * step) / 2 + step / 2
circles = "\n".join(
    f'<circle cx="{origin_x+x*step}" cy="{origin_y+y*step}" '
    f'r="{art["ringRadius"]*step}" />' for x, y in grid["cells"]
)

# Arial's metric-compatible Linux fallback, frozen into paths in the master.
font_path = subprocess.check_output(["fc-match", "-f", "%{file}", "Arial"], text=True)
font = TTFont(font_path)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
scale = 21 / font["head"].unitsPerEm
names = [cmap[ord(char)] for char in "CHANGE"]
advances = [font["hmtx"][name][0] * scale + 12 for name in names]
cursor = 512 - sum(advances) / 2
paths = []
for name, advance in zip(names, advances):
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(pen)
    paths.append(f'<path transform="translate({cursor} 929) scale({scale} {-scale})" d="{pen.getCommands()}" />')
    cursor += advance

def svg(ink, viewbox, width, height):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="{viewbox}">'
        f'<g fill="none" stroke="{ink}" stroke-width="{art["ringStroke"]*step}">{circles}</g>'
        f'<g fill="{ink}">{"".join(paths)}</g></svg>'
    )

# Find tight artwork bounds, including the outlined caption; retain a safety margin.
probe = Image.open(io.BytesIO(cairosvg.svg2png(
    bytestring=svg("#ffffff", "280 525 464 420", 4640, 4200).encode()
)))
left, top, right, bottom = probe.getbbox()
x, y = 280 + left / 10 - 0.5, 525 + top / 10 - 0.5
w, h = (right-left) / 10 + 1, (bottom-top) / 10 + 1
pixel_width = round(28 / 2.54 * 300)
pixel_height = round(pixel_width * h / w)
viewbox = f"{x} {y} {w} {h}"
profile = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
files = []
preview = Image.new("RGB", (1200, 690), "#dedbd4")
draw = ImageDraw.Draw(preview)
draw.text((25, 20), "BUTTERFLY / BACK / preview only - do not upload", fill="#171717")
for index, (color, ink, background) in enumerate([
    ("white", "#ffffff", "#171717"),
    ("black", "#000000", "#f4f3ef"),
]):
    stem = f"360-butterfly-back-28cm-{color}"
    master = svg(ink, viewbox, "28cm", f"{28*h/w}cm")
    svg_path = OUT / f"{stem}.svg"
    svg_path.write_text(master)
    im = Image.open(io.BytesIO(cairosvg.svg2png(
        bytestring=master.encode(), output_width=pixel_width, output_height=pixel_height
    ))).convert("RGBA")
    png_path = OUT / f"{stem}.png"
    im.save(png_path, dpi=(300, 300), icc_profile=profile)
    files.extend([png_path, svg_path])
    im.thumbnail((530, 560), Image.Resampling.LANCZOS)
    draw.rectangle((index*600+15, 60, index*600+585, 645), fill=background)
    preview.paste(im, (index*600+(600-im.width)//2, 70+(560-im.height)//2), im)
    draw.text((index*600+25, 660), f"{color} ink", fill="#171717")
    print(f"{png_path.name}: {pixel_width} x {pixel_height}, 300 DPI")
preview_path = OUT / "preview-only-do-not-upload.jpg"
preview.save(preview_path, quality=95, icc_profile=profile)
readme = OUT / "README.txt"
readme.write_text(f"""BUTTERFLY HOODIE / BACK PRINT

Upload 360-butterfly-back-28cm-white.png for black or dark hoodies.
Upload 360-butterfly-back-28cm-black.png for white or light hoodies.

Both PNGs: {pixel_width} x {pixel_height} pixels, 300 DPI, transparent RGBA,
embedded sRGB profile. Solid white #FFFFFF or black #000000 ink.
Suggested width: 28 cm / 11.02 inches. Height: {28*h/w:.2f} cm.

The artwork reproduces the project's butterfly ring geometry, with CHANGE
underneath at the site's original relative size and spacing. The site's Arial
fallback, {Path(font_path).name}, is converted to vector paths, so the SVGs
do not depend on installed fonts. Ink colors follow the solid-white export
approach used for Full Circle, rather than the site's tinted preview colors.

In Printful, choose DTG printing and upload the PNG to the BACK print area.
Set the width to 28 cm with proportions locked. Center it horizontally and
adjust vertical placement with the hood in mind. Preview on your chosen
hoodie and size; reduce proportionally if the product's print area requires it.
Printful can enlarge uploads automatically, so check the final width.
This is artwork only, not a garment-specific placement template.

SVGs are scalable masters. The preview JPG is for viewing only; do not print it.
No front design is included in this package.

Printful guidance: https://www.printful.com/creating-dtg-file
Regenerate: python scripts/export-butterfly.py
Dependencies: Node, Pillow, CairoSVG, fonttools, fontconfig and an Arial-compatible font.
""")
files.extend([preview_path, readme])
with zipfile.ZipFile(OUT / "360-butterfly-back-printful-files.zip", "w", zipfile.ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, arcname=path.name)
