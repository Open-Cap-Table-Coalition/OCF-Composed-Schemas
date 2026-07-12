# OCF Core — explainer video

A ~3-minute, plain-English motion explainer that walks a **non-technical** viewer from
"what is a cap table?" to "what is OCF Core, and how did we build it?" — through real
example objects.

| File | What it is |
| --- | --- |
| `ocf-core-explainer.mp4` | 1920×1080, h264, 30 fps, 237 s, ~7.6 MB (primary) |
| `ocf-core-explainer.gif` | 900×506, 12 fps, ~11 MB (for embeds/chat) |
| `poster.png` | still thumbnail (the recap scene) |
| `gen.py` | the SVG frame generator (see *Rebuilding* below) |

> This folder is **untracked** in git. It's yours to keep, `.gitignore`, or commit — the
> binaries are large for a schema repo, so it's left out of the tree by default.

## What it teaches (in order)

**Intro (context, ~55 s):** the Open Cap Table Coalition (its makeup and mission), the
fragmentation **problem** it set out to solve, **OCF v1's** story (an open, event-driven format,
2021→2022), then the **board mandate** in two beats — *"Why now"* (agentic workflows heighten the
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
# 1. generate the SVG frame sequence (20 fps → 4740 frames)
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

The narration is on-screen captions only (silent) so it works identically as mp4 or gif. To edit
copy, timing, or scene order, everything lives in the `SCENES` list and per-scene functions in
`gen.py`.
