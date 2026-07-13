# OCF Core — explainer video

A ~3-minute, plain-English motion explainer that walks a **non-technical** viewer from
"what is a cap table?" to "what is OCF Core, and how did we build it?" — through real
example objects.

| File | What it is |
| --- | --- |
| `ocf-core-explainer.mp4` | 1920×1080, h264, 30 fps, 319 s, ~11 MB (primary) |
| `ocf-core-explainer.gif` | 900×506, 12 fps, ~14 MB (for embeds/chat) |
| `ocf-core-explainer.pptx` | **27-slide deck (image)** — one slide per scene, 16:9, each the final frame as a full-bleed image. Pixel-perfect styling; text **not** editable |
| `ocf-core-explainer-editable.pptx` | **27-slide deck (editable)** — same styling, but every word is a native, **editable** text box over a text-less styled plate (429 text boxes) |
| `poster.png` | still thumbnail (the recap scene) |
| `gen.py` | the SVG frame generator (see *Rebuilding* below) |
| `build_pptx.py` | builds the image deck from rendered slide PNGs |
| `build_pptx_editable.py` | builds the editable deck (plate PNGs + parsed text) |

> **In git vs. generated.** Only the *source* is committed — `gen.py`, `build_pptx*.py`, and the
> docs. The **media and decks** (`*.mp4`, `*.gif`, `*.pptx`, `poster.png`) are **generated and
> git-ignored**: they're large and fully reproducible, so run the steps in *Rebuilding* to produce
> them locally.

**Want to change it?** → [`AUTHORING.md`](AUTHORING.md) (edit the video / add slides) and
[`AUTHORING-PPTX.md`](AUTHORING-PPTX.md) (edit the decks; how to make them fully editable). The
source of truth for everything is `gen.py`.

## What it teaches (in order)

**Intro (context, ~80 s):** the Open Cap Table Coalition (its makeup and mission), the
fragmentation **N×N problem** it set out to solve (many firms/platforms/companies each building
their own converters — worse now that agentic tools let anyone spin up new models/platforms),
**OCF v1's** story (2021→2022), **why event-driven** (a snapshot is a photo at one moment; the
underlying event stream is the source of truth SMEs audit against — so OCF models the events and
**computes/validates** the snapshot at any date, now real in **OCF-Tools**, demoed later), then the
**board mandate** in two beats — *"Why now"* (agentic workflows heighten the
need for a **deterministic oracle**; OCF + its validation tools already provide predictable
cap-table integrity; aligning OCF with Carta unlocks the agentic future) and *"So we propose OCF
Core"* (a strict, verifiable subset that transforms **to and from Carta**, with a **migration path
for OCF v1 adopters**). *(Sourced from the OCT Law Firm Working Group briefing deck; per direction,
OCX is not covered.)*

Then the **explainer**:

1. **What a cap table is** — a company's ledger of who owns what.
2. **What an OCF object is** — one rich record in the Open Cap Format standard.
3. **What a Carta object is** — the same idea in Carta's own, often simpler, shape.
4. **Two ways to keep the ledger** — OCF is **event-driven** (a stream of events you replay to get
   today's picture); Carta is **hybrid** — a live snapshot/**statement** of current state *plus*
   some events. This is *why* some OCF events convert into state changes rather than Carta events.
5. **What OCF Core is** — the part of OCF that *always* converts cleanly into Carta —
   **derived**, field by field, not hand-declared.
6. **The rule** — keep a fact if Carta can hold it; losing a little *precision* is OK, losing a
   whole *thing* is not; an object joins Core only if at least one real fact lands.
7. **How we write it down** — one small, declarative `.mapping.md` file per object (`rename`,
   `enum-remap`, `unmappable`, and for the hard cases **polymorphism** and **composite**),
   handled like the legal docs they encode: **proposed → reviewed → validated (CI) → versioned**
   in git. A transparent, auditable approach to mapping between the standards.
8. **Worked examples** (below): four objects that show how OCF folds into Carta, then a fifth
   showing the reverse gap — followed by a recap.
9. **Core vs. Core loss** — a four-scene analytical block:
   - **strict** Core (only what lands cleanly) vs **rich** Core (also keeps lossy-home fields);
   - a **specific in/out inventory** — the **21** objects in Core vs the **26** not-yet (grouped by
     family: issuances/cancellations in, most acceptances/retractions/transfers out);
   - the loss **counted** — **49** field-mappings that land lossily vs **249** dropped with no home;
   - **lossy vs. lossless examples, with the why** — `par_value`/`quantity`/`class_type` land whole;
     `addresses`→one, `contact_info`→one email, `conversion_rights`→ratio+price collapse.
   *(All from `core/core-ledger.md`, `docs/core-lossy-inventory.md`, `docs/core-unmapped-inventory.md`.)*

## The example objects

Each pick is grounded in the real derived ledger (`core/core-ledger.md`), not invented:

| Rule illustrated | Object | Why (from the ledger) |
| --- | --- | --- |
| **Comfortable in Core** | `StockClass` | `admissible ✓`, **8 payload fields land** (name, class type, shares authorized, par value, price, liquidation prefs) — the most of any object. A little detail (votes-per-share, board dates) stays behind. |
| **Composite** | `StockTransfer` | Carta has no "transfer", so one OCF event folds into a **cancel + issue** pair; `quantity`/`date` land on both steps. `admissible ✓` in both stock families. |
| **Lossy** | `Stakeholder` | `admissible ✓` but only **3 payload land**. A *person* whose address list (`array→scalar`), structured name (`structure→scalar`), tax IDs and contact info are lost on the way out. |
| **Totally out** | `StockAcceptance` | `✗ no-payload` — recording that a shareholder *accepted* their shares isn't data Carta stores, so nothing lands and it stays out of Core. |

**Then the gap runs both ways.** A fifth example — *"Where Carta knows more"* (an option
exercise) — shows the reverse: Carta records the **cash paid and taxes withheld**, and models
equity types like **phantom stock / profits interests**, which **OCF v1 has no field for**. That's
a *gap in OCF*, fulfilling the other half of the board mandate. (Grounded in `core/core-gaps.md` §b3,
"true gaps — OCF lacks the concept.")

Design language matches the repo's own diagrams: **green = OCF · blue = Carta · gold = Core ·
red/dashed = lost.** Complex objects are shown as a focused subset, with peripheral detail
deliberately blurred (still visible, not the focus).

**Brand.** Styled to the Open Cap Table Coalition identity: the OCTC **indigo** (`#2f2ce3`) with
white type, a recreated **aperture logo mark** (title/close bookends + a subtle corner watermark
on content scenes), and spaced-uppercase brand type. Content scenes sit on a dark-indigo tint of
the brand so the multi-colour field coding keeps its contrast.

## Rebuilding

Requires `rsvg-convert` (librsvg), `ffmpeg`, and `python3` — no browser needed.

```sh
# 1. generate the SVG frame sequence (20 fps → 6380 frames)
python3 gen.py all frames --fps 20

# 2. render every frame to PNG (parallel)
ls frames/*.svg | xargs -P 8 -I {} sh -c 'rsvg-convert -w 1920 -h 1080 "{}" -o "${1%.svg}.png"' _ {}

# 3. mp4
ffmpeg -y -framerate 20 -i frames/f%05d.png \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 -movflags +faststart \
  ocf-core-explainer.mp4

# 4. gif (single-threaded filtering avoids a paletteuse bug)
ffmpeg -y -i ocf-core-explainer.mp4 -vf "fps=12,scale=900:-1:flags=lanczos,palettegen=stats_mode=diff" palette.png
ffmpeg -y -threads 1 -filter_complex_threads 1 -i ocf-core-explainer.mp4 -i palette.png \
  -filter_complex "[0:v]fps=12,scale=900:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  ocf-core-explainer.gif
```

Other `gen.py` modes: `python3 gen.py manifest` (scene timings) and
`python3 gen.py stills OUTDIR` (one representative frame per scene, for quick review).

### PowerPoint deck

One slide per scene, each the scene's final (fully-revealed) frame as a full-bleed 16:9 image —
so styling is preserved exactly and animation is dropped. Needs `python-pptx` (`pip install
python-pptx`).

```sh
# 1. render each scene's final frame at high res, in scene order
python3 gen.py stills stills
i=1; for nm in $(python3 gen.py manifest | awk '$1!="TOTAL"{print $1}'); do
  rsvg-convert -w 2560 -h 1440 "stills/$nm.svg" -o "slides/$(printf %02d $i)_$nm.png"; i=$((i+1)); done

# 2. assemble the image deck
python3 build_pptx.py   # reads slides/*.png → ocf-core-explainer.pptx
```

**Editable deck.** Same look, but every word is a native, editable text box laid over a *text-less*
styled plate (so the shapes/icons/gradients stay exact and the text is editable):

```sh
python3 gen.py plates plates          # scenes with text suppressed (shapes/icons only)
i=1; for nm in $(python3 gen.py manifest | awk '$1!="TOTAL"{print $1}'); do
  rsvg-convert -w 2560 -h 1440 "plates/$nm.svg" -o "plate_png/$(printf %02d $i)_$nm.png"; i=$((i+1)); done
python3 gen.py stills stills          # with-text SVGs (text coords are parsed from these)
python3 build_pptx_editable.py        # → ocf-core-explainer-editable.pptx
```

Text is placed from the exact SVG coordinates (so the image deck / stills are the reference look).
Vertical placement was not visually verified (no LibreOffice on the build box); if text sits a
touch high/low in PowerPoint, tune the single `0.34` baseline offset in `build_pptx_editable.py`.

The narration is on-screen captions only (silent) so it works identically as mp4 or gif. To edit
copy, timing, or scene order, everything lives in the `SCENES` list and per-scene functions in
`gen.py`.
