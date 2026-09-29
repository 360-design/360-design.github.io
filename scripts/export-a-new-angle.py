"""Export existing 360 artwork. Requires Node, Pillow and CairoSVG.

Run from any directory: python scripts/export-a-new-angle.py
"""

import io
import json
from pathlib import Path
import subprocess
import zipfile

import cairosvg
from PIL import Image, ImageCms, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "exports" / "printful" / "a-new-angle"
OUT.mkdir(parents=True, exist_ok=True)
art = json.loads(subprocess.check_output([
    "node", "--input-type=module", "-e",
    'import { artworkGrids, ringRadius, ringStroke } from "./src/artwork.ts";'
    'console.log(JSON.stringify({grid:artworkGrids["360"],ringRadius,ringStroke}));',
], cwd=ROOT, text=True))
profile = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
radius = art["ringRadius"]
stroke = art["ringStroke"]
outer = radius + stroke / 2
files = []
previews = []

for garment, ink, background in [
    ("black-shirt", "#f0efe9", "#171717"),
    ("white-shirt", "#161615", "#f4f3ef"),
]:
    for side in ("front", "back"):
        cells = art["grid"]["cells"]
        if side == "back":
            # Exactly the site's clockwise rotation: (x, y) -> (-y, x).
            cells = [(-y, x) for x, y in cells]
        min_x = min(x for x, y in cells) - outer
        min_y = min(y for x, y in cells) - outer
        width = max(x for x, y in cells) + outer - min_x
        height = max(y for x, y in cells) + outer - min_y
        # Tiny transparent margin prevents clipping antialiasing at the edge.
        pad = 0.02
        width += 2 * pad
        height += 2 * pad
        if side == "front":
            px_w, dpi = 1200, 600
            px_h = round(px_w * height / width)
        else:
            px_h, dpi = 3600, 300
            px_w = round(px_h * width / height)
        circles = "\n".join(
            f'<circle cx="{x}" cy="{y}" r="{radius}" />' for x, y in cells
        )
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'width="{px_w / dpi}in" height="{px_h / dpi}in" '
            f'viewBox="{min_x-pad} {min_y-pad} {width} {height}">\n'
            f'<g fill="none" stroke="{ink}" stroke-width="{stroke}">\n'
            f'{circles}\n</g>\n</svg>\n'
        )
        stem = f"{side}-360-{garment}"
        svg_path = OUT / f"{stem}.svg"
        svg_path.write_text(svg)
        raster = cairosvg.svg2png(
            bytestring=svg.encode(), output_width=px_w, output_height=px_h
        )
        im = Image.open(io.BytesIO(raster)).convert("RGBA")
        png_path = OUT / f"{stem}.png"
        im.save(png_path, dpi=(dpi, dpi), icc_profile=profile)
        files.extend([svg_path, png_path])
        thumb = im.copy()
        thumb.thumbnail((300, 580), Image.Resampling.LANCZOS)
        previews.append((garment, side, background, thumb))
        print(f"{png_path.name}: {px_w} x {px_h}, {dpi} DPI, "
              f"{px_w / dpi:.2f} x {px_h / dpi:.2f} inches")

sheet = Image.new("RGB", (1440, 760), "#dedbd4")
draw = ImageDraw.Draw(sheet)
draw.text((30, 20), "A NEW ANGLE / artwork reference only / do not upload this preview", fill="#171717")
for index, (garment, side, background, thumb) in enumerate(previews):
    left = index * 360
    draw.rectangle((left + 15, 65, left + 345, 710), fill=background)
    sheet.paste(thumb, (left + (360 - thumb.width) // 2, 90 + (580 - thumb.height) // 2), thumb)
    draw.text((left + 20, 730), f"{garment} / {side}", fill="#171717")
sheet.save(OUT / "PREVIEW-do-not-upload.jpg", quality=95, icc_profile=profile)

readme = """# A new angle / Printful artwork

Upload the PNG files, one per print location. SVG files are scalable masters.
These exports use the existing site's 360 ring geometry and ink colors.
No garment photo, background rectangle, or 'A new angle' title is printed.

| Shirt color | Front upload | Back upload |
| --- | --- | --- |
| Black | front-360-black-shirt.png | back-360-black-shirt.png |
| White | front-360-white-shirt.png | back-360-white-shirt.png |

Black-shirt artwork uses off-white #f0efe9. White-shirt artwork uses charcoal
#161615. All PNGs have transparent backgrounds and embedded sRGB profiles.
Front: 600 DPI at 2 inches wide. Back: 300 DPI at 12 inches tall.
Files are cropped around the artwork with a tiny transparent safety margin.

## Placement

1. Choose your T-shirt model, color, and printing method in Printful.
   These files are prepared for DTG printing, not embroidery.
2. Upload the matching FRONT PNG to the front print area. Set its width to
   2 inches / 5.08 cm, keep proportions locked, and position on the wearer's
   left chest, which is the right side when looking at the shirt's front.
3. Upload the matching BACK PNG to the back print area. Set its height to
   12 inches / 30.48 cm, keep proportions locked, and center horizontally.
   The design is already rotated clockwise, with 3 at the top and 0 at the
   bottom. Do not rotate or mirror it again.
4. Review both placements in the product preview. The suggested dimensions
   are starting points, not a template for a specific Printful garment.
   Follow your chosen product's print-area limits and file guidelines.
   If necessary, reduce the size proportionally to fit the available area.

The preview JPG shows each artwork enlarged independently for inspection;
it is not a shirt mockup or a placement/relative-scale guide. Do not upload it.
The front mark contains fine rings; inspect the physical sample before a run.

Printful guidance checked September 28, 2026:
https://www.printful.com/creating-dtg-file
https://help.printful.com/hc/en-us/articles/50264019148177-How-should-I-prepare-my-print-file-for-the-best-results

To regenerate from the repository artwork:
Install Pillow and CairoSVG in a Python environment, then run
`python scripts/export-a-new-angle.py` with Node available.
"""
(OUT / "README.md").write_text(readme)
files.extend([OUT / "README.md", OUT / "PREVIEW-do-not-upload.jpg"])
with zipfile.ZipFile(OUT.parent / "a-new-angle-printful.zip", "w", zipfile.ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, arcname=f"a-new-angle/{path.name}")
