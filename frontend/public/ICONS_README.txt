PWA ICONS NEEDED
=================

This directory needs two PNG icon files for the PWA to work properly:

1. icon-192.png (192x192 pixels)
2. icon-512.png (512x512 pixels)

RECOMMENDED DESIGN:
- Background color: #06B6D4 (turquesa)
- Icon: White taxi cab or letter "M" for Martha
- Rounded corners optional
- Should be simple and recognizable at small sizes

TOOLS TO CREATE ICONS:
- Online: https://www.favicon-generator.org/
- Online: https://realfavicongenerator.net/
- Desktop: Adobe Illustrator, Figma, Inkscape
- Code: ImageMagick, PIL/Pillow (Python)

QUICK CREATION WITH IMAGEMAGICK:
If ImageMagick is installed:
  convert -size 192x192 xc:#06B6D4 -gravity center -pointsize 120 -fill white -annotate +0+0 "M" icon-192.png
  convert -size 512x512 xc:#06B6D4 -gravity center -pointsize 320 -fill white -annotate +0+0 "M" icon-512.png

QUICK CREATION WITH PYTHON (PIL):
  from PIL import Image, ImageDraw, ImageFont
  img = Image.new('RGB', (192, 192), '#06B6D4')
  img.save('icon-192.png')

For now, the app will work without these icons, but they are required for:
- Installing the PWA on mobile devices
- App icon on home screen
- Proper PWA manifest validation

NOTE: Until proper icons are added, the PWA install prompt may not appear.
