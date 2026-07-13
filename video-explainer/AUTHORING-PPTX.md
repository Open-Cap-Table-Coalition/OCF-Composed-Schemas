# Editing the PowerPoint decks — and how to make them fully editable

This is the PowerPoint companion to [`AUTHORING.md`](AUTHORING.md) (which covers the video). Read
this to change the slides, regenerate the decks, and understand exactly what is and isn't editable —
and how to get to **fully editable**.

---

## 0. The one thing to internalize

**`gen.py` is the source of truth. The `.pptx` files are exports.** Both decks are generated from
the same scenes as the video, so the *reliable, fully-editable* way to change anything — text,
shapes, colors, layout, slide order, adding/removing slides — is to **edit `gen.py` and re-export**
(see AUTHORING.md, then §3 below). Editing inside PowerPoint is for quick, local touch-ups.

---

## 1. There are two decks

| File | Styling | What's editable in PowerPoint |
| --- | --- | --- |
| `ocf-core-explainer.pptx` | pixel-perfect | **nothing** — each slide is a single full-bleed image |
| `ocf-core-explainer-editable.pptx` | same look | **all text** — every word is a native text box; the shapes/icons/background are one image behind them |

Both are 27 slides, 16:9. Use the **editable** one for edits.

Why the shapes are an image (the "plate"): PowerPoint can't reproduce the custom look (the OCTC
aperture mark, gradients, the concept icons) as native shapes without losing fidelity, so the
shapes+icons+background of each scene are baked into a text-less background image and the **text is
laid back on top as real, editable text boxes**. You get exact styling *and* editable copy.

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
```

(`mkdir slides plate_png` first if they don't exist. These commands assume `zsh`/`bash`.)

---

## 4. How to make it FULLY editable

"Fully editable" = every element (text **and** shapes/icons) is a native, movable PowerPoint object.
There are three routes, best first:

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

### Route C — Ask for an auto native-shape exporter
The scenes can be converted to native PowerPoint shapes programmatically (rounded-rects → shapes,
circles → ovals, lines → connectors, text → text boxes, with the handful of path-based icons — the
aperture mark, shields, sparkles, checks, arrowheads — embedded as small images). I can add a
`build_pptx_native.py` that does this. Caveat: there's **no headless PowerPoint renderer on the
build machine (no LibreOffice)**, so a native deck can't be visually verified here — it would need a
quick eyeball in PowerPoint. Say the word and I'll build it.

**Bottom line:** for a genuinely complete, repeatable edit, use **Route A** (`gen.py`). Routes B/C
are for when a specific slide must be reworked with native shapes directly in PowerPoint.

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
- **Both decks regenerate from the same scenes**, so never hand-edit one deck and expect the other
  (or the video) to match — change `gen.py` and re-export all three.

---

## 6. File map (PPTX-related)

| File | Role |
| --- | --- |
| `ocf-core-explainer.pptx` | image deck (pixel-perfect, not editable) |
| `ocf-core-explainer-editable.pptx` | editable-text deck (native text over styled plates) |
| `build_pptx.py` | builds the image deck from `slides/*.png` |
| `build_pptx_editable.py` | builds the editable deck (parses text from `stills/`, plates from `plate_png/`) |
| `gen.py` | **the fully-editable source** — scenes, styling, and the `plates`/`stills` modes the builders consume |
| `AUTHORING.md` | how to edit the video/scenes (applies to the decks too, via re-export) |
