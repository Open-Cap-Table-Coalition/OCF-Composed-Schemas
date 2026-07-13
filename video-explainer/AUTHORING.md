# Editing the explainer video — a guide for newcomers

Everything you see in the video is generated from **one Python file, [`gen.py`](gen.py)**. There is
no video editor and no timeline UI: each slide is a small Python function that *draws* shapes and
text at pixel coordinates, and a list called `SCENES` is the running order. You edit Python, then
re-render.

This guide gets you from "I've never seen this" to "I changed the words / added a slide / re-exported
the video" without needing to understand the whole file.

---

## 1. The mental model (read this first)

```
gen.py  ──►  one SVG per animation frame  ──►  PNG (rsvg-convert)  ──►  mp4 / gif (ffmpeg)
                                                                    └►  pptx (build_pptx*.py)
```

- A **scene** = one slide = one function `s_something(t, dur)`. `t` is the time in seconds *within*
  that scene; `dur` is how long the scene lasts. The function returns a string of SVG.
- The **`SCENES` list** near the bottom of `gen.py` is the whole video, in order:
  `("name", s_function, duration_seconds)`. Reorder the list → reorder the video.
- **Animation** is just opacity ramps driven by `t` (see §6). For editing *content* you can ignore
  timing entirely — change the words and re-render.

So the three things you'll ever touch:
1. **the strings inside a scene function** (to change wording/numbers),
2. **the `SCENES` list** (to reorder, retime, add, or remove slides),
3. **the palette constants** at the top (to change colors).

---

## 2. Setup (one time)

You need three command-line tools (macOS with Homebrew):

```sh
brew install librsvg ffmpeg     # rsvg-convert + ffmpeg
python3 --version               # any Python 3
```

Work **inside this `video-explainer/` folder** — that's where `gen.py` lives and where the working
folders (`frames/`, `stills/`, …) get created. (PowerPoint export additionally needs
`python-pptx`; see §7.)

---

## 3. The fast loop — preview one slide in ~2 seconds

This is the workflow you'll use constantly. Building the SVGs is instant; you only render the one
slide you're working on.

```sh
# 1. list the slides and their timings
python3 gen.py manifest

# 2. after any edit, regenerate all scene "stills" (fully-revealed frames) — instant
python3 gen.py stills stills

# 3. render just the slide you care about to a PNG and open it
rsvg-convert -w 1280 -h 720 stills/core.svg -o preview.png && open preview.png
```

Swap `core` for any scene name from `manifest`. Loop: edit `gen.py` → `stills` → `rsvg-convert` →
look. Only do the full render (§7) when you're happy.

---

## 4. Common edits (recipes)

### Change wording or a number on a slide
Find the scene name in `manifest`, jump to its function (`def s_<name>`), and edit the string.
Example — the "counted" numbers live in `s_loss_counted`; the object lists live in `s_inout`
(the `IN=[...]` / `OUT=[...]` tables). Change the text, re-preview.

### Make a slide stay up longer / shorter
Edit its duration (the third value) in `SCENES`:
```python
("core", s_core, 12.0),   # ← seconds; bump to 15.0 to hold longer
```

### Reorder slides
Move the line within `SCENES`. That's the entire operation.

### Remove a slide
Delete (or comment out with `#`) its line in `SCENES`. The function can stay; it just won't be used.

### Change the brand colors
Edit the palette constants at the top of `gen.py` (`BRAND`, `BG`, `OCF`, `CARTA`, `CORE`, `LOST`,
`AMBER`, …). Every scene reads these, so one change re-themes the whole video.

### Change the bottom narration line
Each scene ends with a `caption(t, "…", start=…)` call — edit that string. `caption` auto-wraps.

---

## 5. Adding a new slide — full worked example

Say you want a new slide after the recap that lists next steps.

**Step 1 — write the function.** Copy the shape of an existing simple scene. A scene always:
starts with `scene_opacity` (for the fade in/out), draws onto a `background()`, and returns the
whole thing wrapped in a `<g>`.

```python
def s_next_steps(t, dur):
    o = scene_opacity(t, dur)
    out = [background()]                                  # dark-indigo content bg
    out.append(heading(t, "Next steps", "where this goes from here"))
    items = ["Pilot the OCF ⇄ Carta fold on a live cap table",
             "Close the highest-value OCF gaps first",
             "Wire OCF-Tools validation into the review flow"]
    for i, s in enumerate(items):
        ro = appear(t, 0.5 + i*0.3, 0.5)                 # staggered fade-in
        out.append(circle(360, 400 + i*90, 9, CORE, ro))
        out.append(text(400, 410 + i*90, s, 30, fill=WHITE, opacity=ro))
    out.append(caption(t, "A short, concrete path — not a rewrite.", start=1.8))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'
```

**Step 2 — add it to `SCENES`** where you want it to play:
```python
    ("recap",      s_recap,      10.0),
    ("nextsteps",  s_next_steps, 10.0),   # ← new
    ("close",      s_close,       7.0),
```

**Step 3 — preview it:**
```sh
python3 gen.py stills stills && rsvg-convert -w 1280 -h 720 stills/nextsteps.svg -o preview.png && open preview.png
```

Tweak coordinates until it looks right, then do the full render (§7).

---

## 6. How motion works (only if you want animation)

You don't need this to change content. When you do want things to appear in sequence:

- `appear(t, start, dur=0.5)` returns **0 → 1** as local time `t` passes `start` (eased). Multiply it
  into any `opacity=` argument to fade that element in at `start`. Stagger `start` per element for a
  build-on effect (see the loop in §5).
- Every scene is wrapped in `<g opacity="{scene_opacity(...)}">`, which fades the **whole slide** in
  at the start and out at the end — you get scene transitions for free.
- The "stills"/"plates" renders sample each scene at 72% of its duration, i.e. **fully revealed**, so
  previews and the PowerPoint decks show the finished state regardless of animation.

---

## 7. Re-rendering the outputs

**Video (mp4 + gif):**
```sh
rm -rf frames && mkdir frames
python3 gen.py all frames --fps 20
ls frames/*.svg | xargs -P 8 -I {} sh -c 'rsvg-convert -w 1920 -h 1080 "{}" -o "${1%.svg}.png"' _ {}
ffmpeg -y -framerate 20 -i frames/f%05d.png -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 -movflags +faststart ocf-core-explainer.mp4
ffmpeg -y -i ocf-core-explainer.mp4 -vf "fps=12,scale=900:-1:flags=lanczos,palettegen=stats_mode=diff" palette.png
ffmpeg -y -threads 1 -filter_complex_threads 1 -i ocf-core-explainer.mp4 -i palette.png \
  -filter_complex "[0:v]fps=12,scale=900:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" ocf-core-explainer.gif
```

**PowerPoint decks** (needs `pip install python-pptx`): see the *PowerPoint deck* section of
[`README.md`](README.md) — `build_pptx.py` (image deck) and `build_pptx_editable.py` (editable deck).
Both just consume the same scenes, so any edit you make to `gen.py` flows through automatically.

---

## 8. The drawing toolkit (cheat-sheet)

**Canvas:** 1920 × 1080, origin top-left. Rough zones: headings ~`y=150`, content ~`y=280–840`,
the caption bar ~`y=946`. Center is `x=960`.

**Palette names** (all defined at the top): `WHITE`, `MUTE`, `FAINT`, `BG`, `PANEL`, `BORDER`,
`BRAND`; and per-concept `OCF`/`CARTA`/`CORE`/`LOST`/`AMBER` each with a matching `_FILL` (dark) and
`_TXT` (light) variant.

| Helper | Draws |
| --- | --- |
| `background(brand=False)` | full-slide bg. `brand=True` → the bright OCTC-indigo hero bg (title/close) |
| `heading(t, title, sub=None)` | centered title (+ optional subtitle) at the top |
| `caption(t, "…")` | the bottom narration bar (auto-wraps) |
| `text(x, y, s, size, fill, weight, anchor, opacity, italic)` | one line of text; `anchor="middle"` to center on `x`, `weight="bold"` |
| `card(x, y, w, title, subtitle, rows, accent, accent_fill, …)` | a titled panel with rows; `rows=[("label","in"/"out"/"warn"/"carta"/"plain")]`. **Returns `(svg, height)`** — capture both |
| `rrect / line / arrow / circle` | rounded rect, line, arrow, circle (fill/stroke/opacity/dash args) |
| `check / cross / warn / badge` | ✓ / ✗ / ⚠ glyphs and a pill-style status badge |
| `octc_mark(cx, cy, R)` | the OCTC aperture logo mark |
| `icon_loop / shield / spark / diff / bubble / commits` | the little concept icons used in the flows |

**`gen.py` modes:** `manifest` (timings) · `stills DIR` (fully-revealed frame per scene) ·
`plates DIR` (same, text removed — for the editable deck) · `all DIR [--fps N]` (every frame).

---

## 9. Gotchas (things that will bite you)

- **`card()` returns a tuple** `(svg_string, height)`. Do `c, h = card(...)`; append `c`, and use `h`
  to place things below it. Appending the tuple directly will error.
- **Keep the data honest.** The numbers, object names, and field mappings are pulled from the real
  repo (`core/core-ledger.md`, `docs/core-lossy-inventory.md`, `docs/core-unmapped-inventory.md`).
  If you change a claim, check it against those first.
- **Fonts must exist on the machine** rendering it: `Helvetica Neue` and `Menlo` (both stock on
  macOS). rsvg substitutes silently if they're missing, which shifts text.
- **zsh filename loops need an array.** `for nm in $var` does *not* word-split in zsh. Use
  `order=(a b c); for nm in $order`.
- **Don't `rm -f s*.png`** in a folder that has `stakeholder.png`/`stockclass.png` — the glob eats
  them. Put temp files in a subfolder.
- **The gif's second ffmpeg pass uses `-threads 1 -filter_complex_threads 1`** on purpose — the
  `paletteuse` filter hits an internal ffmpeg bug when multithreaded.
- **Full opacity by default.** In a still/plate render every `appear()` is finished, so anything you
  see missing there is a content bug, not a timing one.

---

## 10. Where things live

| File | Role |
| --- | --- |
| `gen.py` | **the whole video** — palette, drawing helpers, one `s_*` function per slide, the `SCENES` order, the render modes |
| `build_pptx.py` | builds the image PowerPoint deck |
| `build_pptx_editable.py` | builds the editable PowerPoint deck |
| `README.md` | what the video is, scene-by-scene, and the exact rebuild commands |
| `AUTHORING.md` | this guide |
| `ocf-core-explainer.{mp4,gif,pptx}` · `*-editable.pptx` · `poster.png` | the generated outputs |
