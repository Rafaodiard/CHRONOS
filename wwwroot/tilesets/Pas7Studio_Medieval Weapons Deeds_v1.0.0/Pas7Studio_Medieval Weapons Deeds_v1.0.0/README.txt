Medieval Weapons Deeds — by Pas7 Studio
Version: 1.0.0

WHAT'S INSIDE
- Sprite size: 128x128 (original)
- Includes: Diffuse sprites + optional Normal maps + optional Mask/Material maps
- Provided formats: PNG (and optional DDS sources for some maps)
- Atlases: PNG + JSON (TexturePacker-like) + CSV (with UVs)

FOLDERS
- Sprites/     Individual sprites (diffuse/normals/masks)
- Atlases/     Sprite atlases + mapping files (JSON/CSV)
- Docs/        manifest.json per set
- Previews/    Watermarked images for product page

NAMING RULES
- Base/diffuse: <root>.png
- Masks/material: <root>_m.png or <root>_m.dds (also: _mask/_orm/_rma)
- Normals: <root>_n.png (also: _normal/_normals)
IMPORTANT: root must match (example: MM_warsickle.*)

ATLAS IMPORT NOTES
- If using mipmaps or bilinear filtering: padding >= 4 and extrude >= 2 are recommended to reduce seams.
- Normals should be imported as normal maps (non-sRGB) in engines that support it.

SUPPORT
Contact: pas7std@gmail.com
