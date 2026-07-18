# Editing the PowerPoint decks — and how to make them fully editable

This is the PowerPoint companion to [`AUTHORING.md`](AUTHORING.md) (which covers the video). Read
this to change the slides, regenerate the decks, and understand exactly what is and isn't editable —
and how to get to **fully editable**.

---

## 0. The one thing to internalize

**`gen.py` is the source of truth. The `.pptx` files are exports.** All three decks are generated
from the same scenes as the video, so the *reliable, fully-editable* way to change anything — text,
shapes, colors, layout, slide order, adding/removing slides — is to **edit `gen.py` and re-export**
(see AUTHORING.md, then §3 below). Editing inside PowerPoint is for quick, local touch-ups.

---

## 1. There are three decks

| File | Styling | What's editable in PowerPoint |
| --- | --- | --- |
| `ocf-core-explainer.pptx` | pixel-perfect | **nothing** — each slide is a single full-bleed image |
| `ocf-core-explainer-editable.pptx` | same look | **all text** — every word is a native text box; the shapes/icons/background are one image behind them |
| `ocf-core-explainer-native.pptx` | native rebuild | **everything** — every shape, icon, line, gradient and word is a native, movable PowerPoint object; **no images at all** |

All three are 32 slides, 16:9. Want to touch up *text only*? Use the **editable** deck. Want to
move/recolor/redraw *shapes* too? Use the **native** deck (§4, Route C — now built).

Why the editable deck bakes the shapes into an image (the "plate"): it lays real text boxes over a
single background image per scene, so the styling is pixel-exact but the shapes aren't editable. The
**native** deck instead rebuilds each scene's shapes as genuine PowerPoint objects (rounded
rectangles, ovals, connectors, freeforms, native radial-gradient fills) with the text on top — so
*every* element is editable. The trade-off: it's a faithful *rebuild*, not a pixel-for-pixel copy
(see the fidelity notes in §4 and §5).

---

## 2. Editing text in PowerPoint (the editable deck)

1. Open `ocf-core-explainer-editable.pptx`.
2. Click any text — it's a normal text box. Edit, restyle, move, or delete it.
3. Fonts are **Helvetica Neue** (body/headings) and **Menlo** (the mono `field → target` lines).
   Both are stock on macOS; keep them installed so text matches.

What you **can** do here: fix wording, numbers, a title; change a font/size/color; reposition or
remove a text box.

What you **can't** do here: move or recolor the boxes, arrows, circles, icons, or backgrounds —
those live in the background image. For that, see §4.

> Placement note: text boxes are positioned from the video's exact coordinates. If a line sits a
> touch high or low, nudge it, or (to fix globally) tune the single `0.34` baseline constant in
> `build_pptx_editable.py` and re-export. This wasn't visually verified on the build machine (no
> LibreOffice), so give it a quick look on first open.

---

## 3. Regenerating the decks after a `gen.py` change

Any edit to `gen.py` (see AUTHORING.md) flows into both decks. You need `python-pptx`
(`pip install python-pptx`, ideally in a venv). From this folder:

```sh
# shared: render each scene's final (fully-revealed) frame in scene order
python3 gen.py stills stills
i=1; for nm in $(python3 gen.py manifest | awk '$1!="TOTAL"{print $1}'); do
  rsvg-convert -w 2560 -h 1440 "stills/$nm.svg" -o "slides/$(printf %02d $i)_$nm.png"; i=$((i+1)); done

# image deck (pixel-perfect, text baked)
python3 build_pptx.py                     # → ocf-core-explainer.pptx

# editable deck (native text over text-less plates)
python3 gen.py plates plates
i=1; for nm in $(python3 gen.py manifest | awk '$1!="TOTAL"{print $1}'); do
  rsvg-convert -w 2560 -h 1440 "plates/$nm.svg" -o "plate_png/$(printf %02d $i)_$nm.png"; i=$((i+1)); done
python3 build_pptx_editable.py            # → ocf-core-explainer-editable.pptx

# native deck (every element a native PowerPoint object — no images)
python3 build_pptx_native.py              # → ocf-core-explainer-native.pptx
#   reads stills/*.svg directly (no rsvg / no PNGs needed); just needs `stills` above.
```

(`mkdir slides plate_png` first if they don't exist. These commands assume `zsh`/`bash`.)

---

## 4. How to make it FULLY editable

"Fully editable" = every element (text **and** shapes/icons) is a native, movable PowerPoint object.
**This already exists as `ocf-core-explainer-native.pptx`** (built by Route C below) — just open it
and start moving things. The three routes below cover: regenerating that deck from source (A),
hand-reworking a single slide (B), and how the native exporter itself works (C).

### Route A — Edit `gen.py` and re-export  ✅ recommended, truly complete
`gen.py` *is* the fully-editable definition of every slide: each shape, color, position, and word is
code you can change, and re-exporting rebuilds the video and both decks in sync. This is the only
route that keeps the custom icons/gradients perfect. Use it for anything structural. See
[`AUTHORING.md`](AUTHORING.md) — it's designed for non-video-experts.

### Route B — Rebuild the shapes natively in PowerPoint  (manual, per slide)
Every shape in the deck is deliberately simple: **rounded rectangles, circles/dots, straight lines,
and text** — plus a few icon glyphs. To make a slide's shapes native:
1. Start from the **editable** deck (text is already native).
2. Delete the background image on that slide.
3. Set the slide background fill to the scene's background color (below).
4. Re-draw the panels/dots/lines with **Insert → Shapes**, using the palette hex codes and the
   coordinate mapping below. Re-add the icons from the image deck (copy the region) if needed.

**Palette (hex):**

| Role | Hex | | Role | Hex |
| --- | --- | --- | --- | --- |
| Brand indigo (hero bg) | `2F2CE3` | | OCF green | `34C46F` |
| Content bg (dark indigo) | `0C0D26` | | Carta blue | `4D8BFF` |
| Panel fill | `181B39` | | Core gold | `FFC21F` |
| Panel border | `31366A` | | Lost/red | `FF6B6B` |
| White text | `EEF1FB` | | Amber | `FFB02E` |
| Muted text | `99A1C6` | | (each accent also has a dark `_FILL` and light `_TXT` — see `gen.py`) |

**Coordinate mapping:** the design canvas is **1920 × 1080 px** mapped onto the **13.333″ × 7.5″**
slide. So a pixel value → inches is `px ÷ 1920 × 13.333` (equivalently `px × 0.006944″`). A shape at
SVG `x=140, y=286, w=800, h=548` becomes `left≈0.97″, top≈1.99″, w≈5.56″, h≈3.80″`. Fonts: SVG
`font-size` in px → points is `px × 0.5` (e.g. a 30px label ≈ 15pt). All of a scene's exact numbers
are visible in its `s_<name>` function in `gen.py`.

### Route C — The auto native-shape exporter  ✅ built (`build_pptx_native.py`)
This is done. `build_pptx_native.py` reads the same `stills/*.svg` the editable deck uses and
converts **every** element to a native PowerPoint object:

| SVG | → PowerPoint |
| --- | --- |
| `<rect rx>` | rounded-rectangle / rectangle autoshape (corner radius preserved) |
| `<circle>` / `<ellipse>` | oval autoshape |
| `<line>` | straight connector |
| `<polygon>` | filled freeform |
| `<path>` (checks, crosses, shields, loop arcs, arrowheads, the aperture mark) | freeform — curves/arcs sampled to smooth segments, so even the icons are native (no embedded images) |
| `<text>` | native text box (same placement as the editable deck) |
| the vignette `<rect fill="url(#…)">` | a native **radial-gradient** fill |

Run it with `python3 build_pptx_native.py` (needs `python-pptx` and a prior `gen.py stills stills`;
see §3). Output: `ocf-core-explainer-native.pptx` — 32 slides, ~1,245 native objects, **zero images**.

**Fidelity caveats** (it's a faithful *rebuild*, not a pixel copy — and there's **no headless
PowerPoint/LibreOffice renderer on the build machine**, so the render itself wasn't eyeballed here;
give it a quick look on first open):
- Curves and arcs (shields, the loop icon, the aperture's broken rings) are sampled to short
  straight segments — smooth at slide scale, and still editable as freeform points.
- Dashed strokes use PowerPoint's preset "dash" style, not the SVG's exact dash lengths (affects the
  decorative aperture rings only).
- The vignette gradient's falloff reaches full-dark at the slide corner rather than the SVG's exact
  radius — a subtle difference on a subtle effect.
- Fonts still need to be installed (Helvetica Neue, Menlo), same as the editable deck.

The exporter was validated structurally: all text recovered 1:1, every shape in bounds, and all
generated OOXML passes element-ordering checks. Only the *visual* render is unverified (no renderer).

**Bottom line:** to just edit everything, open **`ocf-core-explainer-native.pptx`** (Route C). For a
genuinely complete, repeatable change that also updates the video, edit **`gen.py`** (Route A) and
re-export all three decks. Route B is for hand-reworking one slide in place.

---

## 5. Gotchas

- **`python-pptx` is required** to build the decks (`pip install python-pptx`; a scratch venv is
  fine). It is **not** needed to *open or edit* the decks — only to regenerate them.
- **Keep the fonts** (Helvetica Neue, Menlo) installed, or text reflows/substitutes.
- **The image deck has no editable content** by design — don't try to edit it; use the editable one
  or `gen.py`.
- **Data accuracy:** the object lists, counts (21 in / 26 out, 49 lossy / 249 no-home), and field
  examples come from the real repo. If you change a claim, verify it against `core/core-ledger.md`,
  `docs/core-lossy-inventory.md`, and `docs/core-unmapped-inventory.md`.
- **All three decks regenerate from the same scenes**, so never hand-edit one deck and expect the
  others (or the video) to match — change `gen.py` and re-export all three.
- **The native deck is a rebuild, not a pixel copy**, and it wasn't visually verified here (no
  PowerPoint/LibreOffice renderer on the build machine) — eyeball it in PowerPoint on first open.
  It's the deck to use when you need to move or restyle *shapes*, not just text.

---

## 6. File map (PPTX-related)

| File | Role |
| --- | --- |
| `ocf-core-explainer.pptx` | image deck (pixel-perfect, not editable) |
| `ocf-core-explainer-editable.pptx` | editable-text deck (native text over styled plates) |
| `ocf-core-explainer-native.pptx` | fully-native deck (every element a PowerPoint object, no images) |
| `build_pptx.py` | builds the image deck from `slides/*.png` |
| `build_pptx_editable.py` | builds the editable deck (parses text from `stills/`, plates from `plate_png/`) |
| `build_pptx_native.py` | builds the native deck (converts every element in `stills/*.svg` to a native shape) |
| `gen.py` | **the fully-editable source** — scenes, styling, and the `plates`/`stills` modes the builders consume |
| `AUTHORING.md` | how to edit the video/scenes (applies to the decks too, via re-export) |
