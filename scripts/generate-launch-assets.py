"""Rebuild precise brand assets and responsive photos. Requires ImageMagick and fontTools."""
import json
from pathlib import Path
import subprocess
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
SOURCE = ROOT / 'design-ideas/launch'
SOURCE.mkdir(parents=True, exist_ok=True)
grids = json.loads(subprocess.check_output([
    'node', '--input-type=module', '-e',
    "import { artworkGrids } from './src/artwork.ts'; console.log(JSON.stringify(artworkGrids))"
], cwd=ROOT, text=True))
font = TTFont(ROOT / 'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff')
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()


def lettering(text, x, y, size, fill='#eeede8'):
    scale = size / font['head'].unitsPerEm
    parts = []
    for char in text:
        glyph = glyphs[cmap[ord(char)]]
        pen = SVGPathPen(glyphs)
        glyph.draw(pen)
        parts.append(f'<path d="{pen.getCommands()}" transform="translate({x} {y}) scale({scale} {-scale})" fill="{fill}"/>')
        x += glyph.width * scale
    return ''.join(parts)


def svg(width, height, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{body}</svg>'


def render(source, destination, size):
    subprocess.run(['magick', '-background', 'none', '-density', '192', str(source), '-resize', size, '-depth', '8', '-strip', '-define', 'png:compression-level=9', str(destination)], check=True)


# A simplified 3x3 ring remains legible at 16px, with every circle on a square grid.
icon = '<rect width="64" height="64" fill="#111110"/>'
icon += '<g fill="none" stroke="#eeede8" stroke-width="3.5">'
icon += ''.join(f'<circle cx="{x}" cy="{y}" r="5"/>' for y in [14, 32, 50] for x in [14, 32, 50] if (x, y) != (32, 32))
icon += '</g>'
(PUBLIC / 'favicon.svg').write_text(svg(64, 64, icon))
render(PUBLIC / 'favicon.svg', PUBLIC / 'apple-touch-icon.png', '180x180')
subprocess.run(['magick', '-background', 'none', str(PUBLIC / 'favicon.svg'), '-define', 'icon:auto-resize=48,32,16', str(PUBLIC / 'favicon.ico')], check=True)

# Exact circle geometry and outlined brand type, with no generated raster lettering.
card = '<rect width="1200" height="630" fill="#111110"/>'
card += '<g fill="none" stroke="#eeede8" stroke-width="4.4">'
card += ''.join(f'<circle cx="{94+x*37}" cy="{94+y*37}" r="10.4"/>' for x, y in grids['360']['cells'])
card += '</g>'
card += lettering('Everything starts', 76, 443, 58)
card += lettering('with a circle.', 76, 510, 58)
card += lettering('MONOCHROME CLOTHING', 80, 579, 16, '#a4a49c')
card += lettering('COMING SOON', 965, 579, 16, '#a4a49c')
card += '<path d="M80 544H1120" stroke="#343430"/>'
card += '<g fill="none" stroke="#a4a49c" stroke-width=".95">'
card += ''.join(f'<circle cx="{873+x*10.5}" cy="{132+y*10.5}" r="2.94"/>' for x, y in grids['circle']['cells'])
card += '</g>'
(SOURCE / 'social-preview.svg').write_text(svg(1200, 630, card))
render(SOURCE / 'social-preview.svg', PUBLIC / 'social-preview.png', '1200x630')

for folder, widths in [('campaign', [640, 672, 832]), ('garment-blanks', [384, 640]), ('lookbook', [480, 576, 768])]:
    originals = ROOT / 'design-ideas' / ('campaign-blanks' if folder == 'campaign' else folder)
    for source in originals.glob('*.png'):
        for width in widths:
            target = PUBLIC / 'images' / folder / f'{source.stem}-{width}.webp'
            subprocess.run(['magick', str(source), '-resize', f'{width}x', '-strip', '-quality', '82', str(target)], check=True)
print('Generated launch graphics and responsive WebP images.')
