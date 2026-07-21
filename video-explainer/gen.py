#!/usr/bin/env python3
"""OCF Core explainer — SVG frame generator.

Modes:
  python gen.py manifest              # print scene list + timings
  python gen.py stills OUTDIR         # one representative PNG-ready SVG per scene
  python gen.py all OUTDIR [--fps N]  # full frame sequence (SVG) for the whole timeline

Design system (matches the repo's own diagram palette):
  green = OCF   blue = Carta   gold = Core   red/dashed = lost
"""
import sys, os, math, re
from pathlib import Path

W, H = 1920, 1080
FPS = 15

# ---- palette (aligned to the Open Cap Table Coalition brand) ---------------
BRAND     = "#2f2ce3"   # OCTC brand indigo (hero backgrounds, watermark)
BRAND_DK  = "#1b1aa6"   # darker brand indigo for gradients
BG        = "#0c0d26"   # dark indigo content background (brand-tied)
BG2       = "#060716"   # vignette outer
PANEL     = "#181b39"   # card panel (indigo-tinted)
BORDER    = "#31366a"
WHITE     = "#eef1fb"
MUTE      = "#99a1c6"
FAINT     = "#6a7099"
OCF       = "#34c46f"; OCF_FILL = "#0f3020"; OCF_TXT = "#82dca4"
CARTA     = "#4d8bff"; CARTA_FILL = "#122a52"; CARTA_TXT = "#9cc0ff"
CORE      = "#ffc21f"; CORE_FILL = "#3a2e06"; CORE_TXT = "#ffd764"
LOST      = "#ff6b6b"; LOST_FILL = "#3a1622"
AMBER     = "#ffb02e"

FONT = "Helvetica Neue, Helvetica, Arial, sans-serif"
MONO = "Menlo, monospace"

# These analysis scenes read their counts from the checked-in Core artifacts,
# so a rebuild cannot silently preserve stale hand-entered numbers.
REPO_ROOT = Path(__file__).resolve().parent.parent

def _count_core_claims():
    allow = (REPO_ROOT / "core" / "allow-list.yml").read_text(encoding="utf-8")
    strict = len(re.findall(r"^\s+-\s+\S+\s*$", allow, flags=re.MULTILINE))
    # PlanSecurity* schemas are OCF compatibility wrappers for the
    # EquityCompensation* entities and are not separate economic objects in the
    # Core inventory. Match the ledger's entity count rather than counting
    # every wrapper file as a new object.
    object_files = list((REPO_ROOT / "objects").rglob("*.schema.json"))
    object_total = len(
        [file for file in object_files if not file.stem.startswith("PlanSecurity")]
    )
    lossy = (REPO_ROOT / "docs" / "core-lossy-inventory.md").read_text(encoding="utf-8")
    unmapped = (REPO_ROOT / "docs" / "core-unmapped-inventory.md").read_text(encoding="utf-8")
    lossy_match = re.search(
        r"Lossy home .*?\((\d+) \(entity,variant,field\) rows across (\d+) objects; (\d+) OCF-required\)",
        lossy,
    )
    no_home_match = re.search(r"No home .*?\((\d+) across (\d+) objects\)", lossy)
    no_home_required_match = re.search(r"(\d+) per-flavor rows, (\d+) OCF-required", unmapped)
    if not lossy_match or not no_home_match or not no_home_required_match:
        raise RuntimeError("Could not read Core inventory counts for the explainer")
    return {
        "strict": strict,
        "out": object_total - strict,
        "lossy": int(lossy_match.group(1)),
        "lossy_objects": int(lossy_match.group(2)),
        "lossy_required": int(lossy_match.group(3)),
        "no_home": int(no_home_match.group(1)),
        "no_home_objects": int(no_home_match.group(2)),
        "no_home_required": int(no_home_required_match.group(2)),
    }

CORE_COUNTS = _count_core_claims()

# ---- easing / util ---------------------------------------------------------
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def lerp(a, b, t): return a + (b - a) * t
def ease_out(t): t = clamp(t); return 1 - (1 - t) ** 3
def ease_io(t):
    t = clamp(t)
    return 4 * t * t * t if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2

def appear(t, start, dur=0.5):
    """opacity 0..1 easing in, given local time t and a start time."""
    return ease_out((t - start) / dur) if dur > 0 else (1.0 if t >= start else 0.0)

def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

def wrap(s, n):
    out, line = [], ""
    for w in s.split():
        if len(line) + len(w) + 1 <= n:
            line = (line + " " + w).strip()
        else:
            out.append(line); line = w
    if line: out.append(line)
    return out

# ---- svg primitives --------------------------------------------------------
TEXT_ON = True  # set False to render text-less "plates" (backgrounds for the editable PPTX)

def text(x, y, s, size=32, fill=WHITE, weight="normal", anchor="start",
         opacity=1.0, family=FONT, spacing=None, italic=False):
    if not TEXT_ON: return ""
    if opacity <= 0.001: return ""
    ls = f' letter-spacing="{spacing}"' if spacing else ""
    st = ' font-style="italic"' if italic else ""
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" '
            f'font-size="{size}" fill="{fill}" font-weight="{weight}" '
            f'text-anchor="{anchor}" opacity="{opacity:.3f}"{ls}{st}>{esc(s)}</text>')

def multiline(x, y, lines, size, lh, **kw):
    return "".join(text(x, y + i * lh, ln, size, **kw) for i, ln in enumerate(lines))

def rrect(x, y, w, h, r=16, fill=PANEL, stroke=None, sw=2, opacity=1.0, dash=None, blur=None):
    if opacity <= 0.001: return ""
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    d = f' stroke-dasharray="{dash}"' if dash else ""
    b = f' filter="url(#blur)"' if blur else ""
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r}" '
            f'fill="{fill}"{s}{d}{b} opacity="{opacity:.3f}"/>')

def line(x1, y1, x2, y2, color=MUTE, w=3, opacity=1.0, dash=None):
    if opacity <= 0.001: return ""
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke="{color}" stroke-width="{w}"{d} opacity="{opacity:.3f}" stroke-linecap="round"/>')

def arrow(x1, y1, x2, y2, color=MUTE, w=3, opacity=1.0, dash=None, head=12):
    if opacity <= 0.001: return ""
    ang = math.atan2(y2 - y1, x2 - x1)
    bx, by = x2 - head * math.cos(ang), y2 - head * math.sin(ang)
    p1 = (x2, y2)
    p2 = (bx - head * 0.6 * math.sin(ang), by + head * 0.6 * math.cos(ang))
    p3 = (bx + head * 0.6 * math.sin(ang), by - head * 0.6 * math.cos(ang))
    tri = f'<polygon points="{p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f} {p3[0]:.1f},{p3[1]:.1f}" fill="{color}" opacity="{opacity:.3f}"/>'
    return line(x1, y1, bx, by, color, w, opacity, dash) + tri

def circle(cx, cy, r, fill, opacity=1.0, stroke=None, sw=2):
    if opacity <= 0.001: return ""
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{fill}"{s} opacity="{opacity:.3f}"/>'

def check(cx, cy, r, color=OCF, opacity=1.0):
    if opacity <= 0.001: return ""
    return (circle(cx, cy, r, color, opacity) +
            f'<path d="M {cx-r*0.42:.1f} {cy:.1f} L {cx-r*0.08:.1f} {cy+r*0.34:.1f} L {cx+r*0.46:.1f} {cy-r*0.34:.1f}" '
            f'stroke="#0b1017" stroke-width="{max(3,r*0.22):.1f}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="{opacity:.3f}"/>')

def cross(cx, cy, r, color=LOST, opacity=1.0):
    if opacity <= 0.001: return ""
    o = r * 0.4
    return (circle(cx, cy, r, color, opacity) +
            f'<path d="M {cx-o:.1f} {cy-o:.1f} L {cx+o:.1f} {cy+o:.1f} M {cx+o:.1f} {cy-o:.1f} L {cx-o:.1f} {cy+o:.1f}" '
            f'stroke="#0b1017" stroke-width="{max(3,r*0.22):.1f}" stroke-linecap="round" opacity="{opacity:.3f}"/>')

def octc_mark(cx, cy, R, color=WHITE, opacity=1.0):
    """The Open Cap Table Coalition aperture mark: a solid inner disc, a thin ring,
    and two broken (dashed) concentric arcs — recreated as line art."""
    if opacity <= 0.001: return ""
    sw = max(2.0, R * 0.055)
    circ = lambda r: 2 * math.pi * r
    r_disc, r_ring, r_o1, r_o2 = R*0.34, R*0.55, R*0.76, R*0.95
    c1, c2 = circ(r_o1), circ(r_o2)
    out = [circle(cx, cy, r_disc, color, opacity)]  # inner disc
    out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r_ring:.1f}" fill="none" '
               f'stroke="{color}" stroke-width="{sw:.1f}" opacity="{opacity:.3f}"/>')
    # outer broken rings: big dashes + gaps, rotated so the gaps sit asymmetrically
    out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r_o1:.1f}" fill="none" '
               f'stroke="{color}" stroke-width="{sw:.1f}" stroke-linecap="round" '
               f'stroke-dasharray="{c1*0.30:.1f} {c1*0.103:.1f}" '
               f'transform="rotate(-32 {cx:.1f} {cy:.1f})" opacity="{opacity:.3f}"/>')
    out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r_o2:.1f}" fill="none" '
               f'stroke="{color}" stroke-width="{sw:.1f}" stroke-linecap="round" '
               f'stroke-dasharray="{c2*0.22:.1f} {c2*0.28:.1f}" '
               f'transform="rotate(120 {cx:.1f} {cy:.1f})" opacity="{opacity:.3f}"/>')
    return "".join(out)

def warn(cx, cy, r, color=AMBER, opacity=1.0):
    if opacity <= 0.001: return ""
    p = f'{cx:.1f},{cy-r:.1f} {cx-r*0.92:.1f},{cy+r*0.7:.1f} {cx+r*0.92:.1f},{cy+r*0.7:.1f}'
    return (f'<polygon points="{p}" fill="{color}" opacity="{opacity:.3f}"/>'
            f'<rect x="{cx-r*0.09:.1f}" y="{cy-r*0.35:.1f}" width="{r*0.18:.1f}" height="{r*0.62:.1f}" rx="{r*0.09:.1f}" fill="#0b1017" opacity="{opacity:.3f}"/>'
            f'<circle cx="{cx:.1f}" cy="{cy+r*0.48:.1f}" r="{r*0.1:.1f}" fill="#0b1017" opacity="{opacity:.3f}"/>')

def badge(cx, y, label, color, glyph="check", opacity=1.0, w=560):
    if opacity <= 0.001: return ""
    x = cx - w / 2
    g = ""
    gi = x + 44
    if glyph == "check": g = check(gi, y + 34, 22, color, opacity)
    elif glyph == "cross": g = cross(gi, y + 34, 22, color, opacity)
    elif glyph == "warn": g = warn(gi, y + 34, 22, color, opacity)
    return (rrect(x, y, w, 68, 34, fill="#11161d", stroke=color, sw=2.5, opacity=opacity) +
            g + text(gi + 40, y + 46, label, 30, fill=color, weight="bold", opacity=opacity))

# ---- concept icons (for the "why now" flow) --------------------------------
def _arrowhead(x, y, ang, size, color, op):
    p2 = (x - size*math.cos(ang-0.42), y - size*math.sin(ang-0.42))
    p3 = (x - size*math.cos(ang+0.42), y - size*math.sin(ang+0.42))
    return f'<polygon points="{x:.1f},{y:.1f} {p2[0]:.1f},{p2[1]:.1f} {p3[0]:.1f},{p3[1]:.1f}" fill="{color}" opacity="{op:.3f}"/>'

def _checkmark(cx, cy, r, color, op):
    return (f'<path d="M {cx-r*0.5:.1f} {cy+r*0.02:.1f} L {cx-r*0.08:.1f} {cy+r*0.42:.1f} '
            f'L {cx+r*0.58:.1f} {cy-r*0.4:.1f}" stroke="{color}" stroke-width="{max(3,r*0.16):.1f}" '
            f'fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="{op:.3f}"/>')

def icon_loop(cx, cy, r, color, op=1.0):
    """A refresh / cycle glyph — two chasing arrows. Reads as 'agentic loop'."""
    if op <= 0.001: return ""
    sw = max(3.5, r*0.16); out = []
    for a, b in [(-165, -25), (15, 155)]:
        t0 = math.radians(a); t1 = math.radians(b)
        x0 = cx+r*math.cos(t0); y0 = cy+r*math.sin(t0)
        x1 = cx+r*math.cos(t1); y1 = cy+r*math.sin(t1)
        out.append(f'<path d="M {x0:.1f} {y0:.1f} A {r:.1f} {r:.1f} 0 0 1 {x1:.1f} {y1:.1f}" '
                   f'fill="none" stroke="{color}" stroke-width="{sw:.1f}" stroke-linecap="round" opacity="{op:.3f}"/>')
        out.append(_arrowhead(x1, y1, t1+math.pi/2, sw*2.8, color, op))
    return "".join(out)

def icon_shield(cx, cy, r, color, op=1.0):
    """A shield with a check — 'verifiable integrity / a trusted oracle'."""
    if op <= 0.001: return ""
    w = r*0.92; top = cy-r
    d = (f'M {cx:.1f} {top:.1f} L {cx+w:.1f} {top+r*0.34:.1f} L {cx+w:.1f} {cy+r*0.12:.1f} '
         f'Q {cx+w:.1f} {cy+r*0.72:.1f} {cx:.1f} {cy+r:.1f} '
         f'Q {cx-w:.1f} {cy+r*0.72:.1f} {cx-w:.1f} {cy+r*0.12:.1f} '
         f'L {cx-w:.1f} {top+r*0.34:.1f} Z')
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{max(3.5,r*0.12):.1f}" '
            f'stroke-linejoin="round" opacity="{op:.3f}"/>' + _checkmark(cx, cy-r*0.02, r*0.5, color, op))

def icon_spark(cx, cy, r, color, op=1.0):
    """A 4-point sparkle (+ a small companion) — the AI/'agentic future'."""
    if op <= 0.001: return ""
    k = r*0.30
    pts = [(cx,cy-r),(cx+k,cy-k),(cx+r,cy),(cx+k,cy+k),(cx,cy+r),(cx-k,cy+k),(cx-r,cy),(cx-k,cy-k)]
    p = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    return (f'<polygon points="{p}" fill="{color}" opacity="{op:.3f}"/>'
            + circle(cx+r*0.98, cy-r*0.86, r*0.17, color, op))

def icon_diff(cx, cy, r, op=1.0):
    """Three stacked lines (added / removed / context) — a change / diff."""
    if op <= 0.001: return ""
    lw = r*0.30
    return (rrect(cx-r*0.7, cy-r*0.62, r*1.45, lw, lw/2, fill=OCF, opacity=op)
          + rrect(cx-r*0.7, cy-r*0.15, r*1.02, lw, lw/2, fill=LOST, opacity=op)
          + rrect(cx-r*0.7, cy+r*0.32, r*1.28, lw, lw/2, fill="#7f88b0", opacity=op))

def icon_bubble(cx, cy, r, color, op=1.0):
    """A speech bubble with a check — review & approve."""
    if op <= 0.001: return ""
    bw = r*1.8; bh = r*1.3; bx = cx-bw/2; by = cy-bh/2-r*0.12
    out = [rrect(bx, by, bw, bh, r*0.32, fill="none", stroke=color, sw=max(3,r*0.13), opacity=op)]
    out.append(f'<polygon points="{cx-r*0.42:.1f},{by+bh-2:.1f} {cx-r*0.02:.1f},{by+bh-2:.1f} '
               f'{cx-r*0.55:.1f},{by+bh+r*0.42:.1f}" fill="{color}" opacity="{op:.3f}"/>')
    out.append(_checkmark(cx, by+bh/2, r*0.5, color, op))
    return "".join(out)

def icon_commits(cx, cy, r, color, op=1.0):
    """A little git graph — commit dots with a branch. Versioned history."""
    if op <= 0.001: return ""
    sw = max(3, r*0.12); mx = cx-r*0.45
    out = [line(mx, cy-r*0.72, mx, cy+r*0.72, color, sw, op)]
    for dy in (-r*0.62, 0, r*0.62):
        out.append(circle(mx, cy+dy, r*0.2, color, op))
    out.append(f'<path d="M {mx:.1f} {cy:.1f} Q {cx+r*0.15:.1f} {cy:.1f} {cx+r*0.55:.1f} {cy-r*0.5:.1f}" '
               f'fill="none" stroke="{color}" stroke-width="{sw:.1f}" opacity="{op:.3f}"/>')
    out.append(circle(cx+r*0.6, cy-r*0.58, r*0.2, color, op))
    return "".join(out)

# ---- higher-level: a data card ---------------------------------------------
def card(x, y, w, title, subtitle, rows, accent=OCF, accent_fill=OCF_FILL,
         opacity=1.0, row_reveal=None, t=0.0, row_h=52, head_h=96, blur_rows=None):
    """rows: list of (label, state) where state in {'in','out','warn','plain'} or a dict.
       row_reveal: (start, stagger) to fade rows in sequentially by local time t."""
    blur_rows = blur_rows or set()
    n = len(rows)
    h = head_h + n * row_h + 24
    out = [rrect(x, y, w, h, 20, fill=PANEL, stroke=accent, sw=2.5, opacity=opacity)]
    out.append(rrect(x, y, w, head_h, 20, fill=accent_fill, opacity=opacity))
    out.append(rrect(x, y + head_h - 20, w, 20, 0, fill=accent_fill, opacity=opacity))
    out.append(text(x + 30, y + 44, title, 34, fill=WHITE, weight="bold", opacity=opacity))
    out.append(text(x + 30, y + 78, subtitle, 22, fill=accent, weight="bold", opacity=opacity, spacing="1"))
    for i, row in enumerate(rows):
        ry = y + head_h + 12 + i * row_h
        ro = opacity
        if row_reveal:
            st, stag = row_reveal
            ro = opacity * appear(t, st + i * stag, 0.45)
        if ro <= 0.001:
            continue
        label, state = row if isinstance(row, tuple) else (row, "plain")
        blurred = i in blur_rows
        col = {"in": OCF_TXT, "out": LOST, "warn": AMBER, "plain": WHITE, "carta": CARTA_TXT}.get(state, WHITE)
        dot = {"in": OCF, "out": LOST, "warn": AMBER, "carta": CARTA}.get(state)
        if blurred:
            out.append(f'<g filter="url(#blur)">' + text(x + 62, ry + 34, label, 26, fill=MUTE, opacity=ro * 0.8) + '</g>')
            continue
        if dot:
            out.append(circle(x + 40, ry + 26, 7, dot, ro))
        out.append(text(x + 62, ry + 34, label, 26, fill=col, opacity=ro))
    return "".join(out), h

# ---- scene chrome ----------------------------------------------------------
def background(brand=False, watermark=True):
    if brand:
        return (f'<rect width="{W}" height="{H}" fill="{BRAND}"/>'
                f'<rect width="{W}" height="{H}" fill="url(#brandvig)"/>')
    out = [f'<rect width="{W}" height="{H}" fill="{BG}"/>',
           f'<rect width="{W}" height="{H}" fill="url(#vig)"/>']
    if watermark:
        out.append(octc_mark(1816, 98, 40, WHITE, 0.09))  # subtle brand watermark, top-right
    return "".join(out)

def heading(t, title, sub=None, start=0.0):
    o = appear(t, start, 0.5)
    dy = lerp(18, 0, ease_out((t - start) / 0.5))
    out = text(W/2, 150 - dy, title, 62, fill=WHITE, weight="bold", anchor="middle", opacity=o)
    if sub:
        out += text(W/2, 205 - dy, sub, 30, fill=MUTE, anchor="middle", opacity=appear(t, start+0.15, 0.5))
    return out

def caption(t, lines, start=0.0):
    o = appear(t, start, 0.5)
    if o <= 0.001: return ""
    bw = 1500; bx = (W - bw) / 2; by = 946; bh = 100
    out = [rrect(bx, by, bw, bh, 22, fill="#111433", stroke=BORDER, sw=1.5, opacity=o*0.96)]
    out.append(rrect(bx, by, 8, bh, 4, fill=CORE, opacity=o))
    if isinstance(lines, str): lines = wrap(lines, 78)
    ty = by + bh/2 - (len(lines)-1)*20 + 10
    for i, ln in enumerate(lines):
        out.append(text(bx + 44, ty + i*40, ln, 27, fill="#ccd2f2", opacity=o))
    return "".join(out)

def scene_opacity(t, dur, fin=0.45, fout=0.4):
    return min(appear(t, 0, fin), ease_out((dur - t)/fout) if t > dur-fout else 1.0)

# ============================================================================
# SCENES  (each returns inner svg for local time t within [0,dur])
# ============================================================================
def s_title(t, dur):
    o = scene_opacity(t, dur)
    out = [background(brand=True)]
    cx = W/2
    out.append(octc_mark(cx, 300, 118, WHITE, appear(t, 0.0, 0.7)))
    out.append(text(cx, 540, "OCF CORE", 128, fill=WHITE, weight="bold", anchor="middle",
                    opacity=appear(t,0.3,0.7), spacing="10"))
    sw = ease_out((t-0.7)/0.8)
    out.append(line(cx-300*sw, 588, cx+300*sw, 588, "#ffffff", 4, appear(t,0.7,0.3)))
    out.append(multiline(cx, 660, wrap("How a rich cap-table standard becomes a clean, always-convertible core", 52),
                         33, 46, fill="#d7dcf6", anchor="middle", opacity=appear(t,0.9,0.7)))
    out.append(text(cx, 810, "A PLAIN-ENGLISH TOUR", 24, fill="#c3c8ee", anchor="middle",
                    opacity=appear(t,1.5,0.6), spacing="6"))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'

def s_coalition(t, dur):
    o=scene_opacity(t,dur); out=[background(brand=True)]
    cx=960
    out.append(text(cx,150,"The Open Cap Table Coalition",58,fill=WHITE,weight="bold",anchor="middle",opacity=appear(t,0.0,0.6)))
    out.append(text(cx,208,"substantially all of the private-company equity industry, at one table",29,
                    fill="#d7dcf6",anchor="middle",opacity=appear(t,0.2,0.6)))
    hub=(cx,512); R=90; hw=180
    nodes=[(600,378,"Cap-table software"),(600,646,"Transfer agents & banks"),
           (1320,378,"Law firms"),(1320,646,"Registries & markets")]
    # spokes (drawn first, behind the hub)
    for i,(nx,ny,lab) in enumerate(nodes):
        ro=appear(t,1.0+i*0.16,0.5)
        ex=nx+(hw if nx<cx else -hw); ey=ny
        dx=ex-hub[0]; dy=ey-hub[1]; L=(dx*dx+dy*dy)**0.5; ux,uy=dx/L,dy/L
        out.append(line(hub[0]+ux*(R+14),hub[1]+uy*(R+14),ex,ey,"#ffffff",2,ro*0.5))
    # central aperture mark = the hub
    out.append(octc_mark(hub[0],hub[1],R,WHITE,appear(t,0.5,0.7)))
    # category nodes
    for i,(nx,ny,lab) in enumerate(nodes):
        ro=appear(t,1.1+i*0.16,0.5)
        out.append(rrect(nx-hw,ny-38,hw*2,76,20,fill="#413fe0",stroke="#ffffff",sw=2,opacity=ro))
        out.append(text(nx,ny+9,lab,25,fill=WHITE,weight="bold",anchor="middle",opacity=ro))
    # founding members
    mo=appear(t,2.0,0.6)
    out.append(text(cx,842,"FOUNDING MEMBERS INCLUDE",22,fill="#bcc0f2",anchor="middle",opacity=mo,spacing="4"))
    members="Carta · Cooley · Fenwick · Goodwin · Gunderson Dettmer · Latham & Watkins · Morgan Stanley · Orrick · Wilson Sonsini"
    out.append(multiline(cx,888,wrap(members,74),25,40,fill="#e9ebfb",anchor="middle",opacity=mo))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_problem(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"The problem it set out to solve","everyone working off the same data — with no shared language"))
    # party-type legend (centered)
    leg=appear(t,0.3,0.5)
    TYP=[("Law firms","#f0a020"),("Platforms","#4d8bff"),("Companies","#8f8bff")]
    for i,(lab,co) in enumerate(TYP):
        gx=660+i*300
        out.append(circle(gx,252,9,co,leg)); out.append(text(gx+18,260,lab,23,fill=MUTE,opacity=leg))
    def ring(ccx,ccy,rad,n,phase=-90):
        return [(ccx+rad*math.cos(math.radians(phase+i*360.0/n)),
                 ccy+rad*math.sin(math.radians(phase+i*360.0/n))) for i in range(n)]
    n=6; rad=150; tcol=[TYP[i%3][1] for i in range(n)]
    # LEFT — the N x N mesh (everyone builds their own converters)
    lcx,lcy=600,516; Lp=ring(lcx,lcy,rad,n)
    out.append(text(lcx,330,"WITHOUT A STANDARD",24,fill=LOST,weight="bold",anchor="middle",opacity=appear(t,0.5,0.5),spacing="2"))
    eo=appear(t,0.9,0.7)
    for i in range(n):
        for j in range(i+1,n):
            out.append(line(Lp[i][0],Lp[i][1],Lp[j][0],Lp[j][1],LOST,1.6,eo*0.45))
    for i,(px,py) in enumerate(Lp):
        out.append(circle(px,py,15,tcol[i],appear(t,0.6+i*0.05,0.4),stroke=BG,sw=3))
    out.append(text(lcx,724,"N × N custom converters",27,fill=WHITE,weight="bold",anchor="middle",opacity=appear(t,1.8,0.5)))
    # middle — collapse to one format
    out.append(arrow(892,516,1028,516,MUTE,3,appear(t,2.1,0.5)))
    out.append(text(960,490,"one format",19,fill=MUTE,anchor="middle",opacity=appear(t,2.2,0.5)))
    # RIGHT — hub-and-spoke through the shared standard
    rcx,rcy=1320,516; Rp=ring(rcx,rcy,rad,n)
    out.append(text(rcx,330,"WITH ONE STANDARD",24,fill=OCF,weight="bold",anchor="middle",opacity=appear(t,2.3,0.5),spacing="2"))
    for i,(px,py) in enumerate(Rp):
        out.append(line(rcx,rcy,px,py,OCF,2,appear(t,2.5+i*0.05,0.4)*0.6))
    out.append(circle(rcx,rcy,36,CORE_FILL,appear(t,2.4,0.5),stroke=CORE,sw=3))
    out.append(text(rcx,rcy+8,"OCF",22,fill=CORE_TXT,weight="bold",anchor="middle",opacity=appear(t,2.4,0.5)))
    for i,(px,py) in enumerate(Rp):
        out.append(circle(px,py,15,tcol[i],appear(t,2.5+i*0.05,0.4),stroke=BG,sw=3))
    out.append(text(rcx,724,"N connections — one each",27,fill=WHITE,weight="bold",anchor="middle",opacity=appear(t,3.0,0.5)))
    # the agentic amplifier
    out.append(text(W/2,800,"And agentic tools now let anyone spin up new models — even new platforms.",28,
                    fill=AMBER,weight="bold",anchor="middle",opacity=appear(t,3.4,0.6)))
    out.append(caption(t,"N firms × N platforms × N companies, each rolling their own converters — or one shared format everyone speaks.",start=3.6))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_ocf_standard(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"OCF — one open standard","built by the Coalition's Technical Working Group"))
    y=470; x0=360; x1=1560
    out.append(line(x0,y,x1,y,OCF,3,appear(t,0.6,0.6)))
    nodes=[("Oct 2021","first preview",0.08),("Dec 2021","event-driven redesign",0.5),("2022","v1.0 released",0.92)]
    for i,(date,desc,fx) in enumerate(nodes):
        ro=appear(t,0.9+i*0.32,0.5); nx=x0+(x1-x0)*fx
        out.append(circle(nx,y,13,OCF,ro,stroke=BG,sw=4))
        out.append(text(nx,y-38,date,29,fill=WHITE,weight="bold",anchor="middle",opacity=ro))
        out.append(text(nx,y+58,desc,24,fill=OCF_TXT,anchor="middle",opacity=ro))
    out.append(text(W/2, 706, "An open, event-driven file format any platform can read and write —", 30, fill=WHITE, anchor="middle", opacity=appear(t,2.1,0.6)))
    out.append(text(W/2, 748, "so a cap table can move intact.", 30, fill=WHITE, weight="bold", anchor="middle", opacity=appear(t,2.2,0.6)))
    out.append(caption(t, "The Open Cap Format (OCF) v1.0 — a shared, event-driven format for cap-table data.", start=2.5))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_events_why(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Why an event-driven standard?","because a cap table is always moving"))
    cx=960
    out.append(text(cx,262,"WHAT YOU USUALLY SEE",22,fill=MUTE,anchor="middle",opacity=appear(t,0.4,0.5),spacing="3"))
    sc,sh=card(cx-260,286,520,"Cap table","A SNAPSHOT · AS OF ONE DATE",
               [("Founders — 58%","carta"),("Investors — 29%","carta"),("Option pool — 13%","carta")],
               accent=CARTA,accent_fill=CARTA_FILL,opacity=appear(t,0.5,0.5),row_reveal=(0.8,0.14),t=t)
    out.append(sc)
    tly=692; co=appear(t,1.7,0.5)
    out.append(line(cx,286+sh,cx,tly-16,MUTE,2,co,dash="6 7"))
    out.append(_arrowhead(cx,tly-16,math.pi/2,13,MUTE,co))
    out.append(text(cx+22,616,"just one moment in time",20,fill=MUTE,opacity=co))
    out.append(text(232,648,"THE EVENTS THAT ACTUALLY CHANGE IT",22,fill=OCF_TXT,opacity=appear(t,1.9,0.6),spacing="2"))
    out.append(line(232,tly,1688,tly,OCF,3,appear(t,1.9,0.6)))
    evs=["issuance","option pool +","grant","transfer","pool +","exercise"]
    for i,ev in enumerate(evs):
        ex=300+i*264; ro=appear(t,2.1+i*0.11,0.4)
        out.append(circle(ex,tly,11,OCF,ro,stroke=BG,sw=3))
        out.append(text(ex,tly+44,ev,21,fill=WHITE,anchor="middle",opacity=ro))
    out.append(caption(t,"Lawyers and SMEs constantly audit the snapshot against the events that changed it — issuances, transfers, pool increases.",start=2.9))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_ocf_events(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"So OCF models the events","the source of truth — the snapshot is computed from it"))
    lc,lh=card(180,330,470,"OCF event log","THE SOURCE OF TRUTH",
               [("Stock issued","in"),("Option pool +","in"),("Transfer","in"),("Option granted","in")],
               accent=OCF,accent_fill=OCF_FILL,opacity=appear(t,0.5,0.5),row_reveal=(0.8,0.13),t=t)
    out.append(lc)
    my=330+lh/2
    out.append(arrow(650,my,878,my,MUTE,3,appear(t,1.3,0.5)))
    ex=960
    eo=appear(t,1.5,0.55)
    out.append(circle(ex,my,74,CORE_FILL,eo,stroke=CORE,sw=3))
    out.append(icon_loop(ex,my,34,CORE,eo))
    out.append(text(ex,my+110,"OCF-Tools",28,fill=CORE_TXT,weight="bold",anchor="middle",opacity=eo))
    out.append(text(ex,my+144,"compute + validate",22,fill=MUTE,anchor="middle",opacity=eo))
    out.append(arrow(ex+80,my,1250,my,MUTE,3,appear(t,1.9,0.5)))
    rc,rh=card(1250,330,490,"Snapshot","AS OF ANY DATE",
               [("Founders — 58%","carta"),("Investors — 29%","carta"),("Option pool — 13%","carta")],
               accent=CARTA,accent_fill=CARTA_FILL,opacity=appear(t,2.1,0.5),row_reveal=(2.3,0.12),t=t)
    out.append(rc)
    vy=330+rh+34; vo=appear(t,2.7,0.5)
    out.append(check(1425,vy,16,OCF,vo)); out.append(text(1451,vy+8,"validated",24,fill=OCF_TXT,weight="bold",opacity=vo))
    out.append(text(W/2,812,"Compute the cap table at any point in time — and validate it. Real today in OCF-Tools (demo later).",
                    26,fill=WHITE,anchor="middle",opacity=appear(t,3.0,0.6)))
    out.append(caption(t,"OCF's plan from day one: model the events, then derive and check the snapshot at any date.",start=3.2))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_why(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Why now","why trustworthy cap-table data matters more than ever"))
    cy=478; r=98
    nodes=[
        (380,  CARTA, "loop",   "Agentic loops",       "AI runs the cap table"),
        (960,  OCF,   "shield", "OCF",                 "verifiable integrity"),
        (1540, CORE,  "spark",  "The agentic future",  "safe across systems"),
    ]
    starts=[0.4, 1.3, 2.2]
    for i,(cx,co,icon,title,sub) in enumerate(nodes):
        ro=appear(t,starts[i],0.5)
        out.append(circle(cx,cy,r,"#12152e",ro,stroke=co,sw=3.5))
        if icon=="loop":     out.append(icon_loop(cx,cy,r*0.52,co,ro))
        elif icon=="shield": out.append(icon_shield(cx,cy-2,r*0.56,co,ro))
        else:                out.append(icon_spark(cx-4,cy,r*0.52,co,ro))
        out.append(text(cx,cy+r+54,title,30,fill=co,weight="bold",anchor="middle",opacity=ro))
        out.append(text(cx,cy+r+92,sub,23,fill=MUTE,anchor="middle",opacity=ro))
    labels=["needs a deterministic oracle","aligned with Carta"]
    for i in range(2):
        ro=appear(t,0.9+i*0.9,0.5)
        x0=nodes[i][0]+r+14; x1=nodes[i+1][0]-r-14
        out.append(arrow(x0,cy,x1,cy,CORE,3.5,ro))
        out.append(text((x0+x1)/2,cy-24,labels[i],23,fill=CORE_TXT,weight="bold",anchor="middle",opacity=ro))
    out.append(caption(t,"Agentic workflows have only heightened the need for a deterministic oracle — which OCF, aligned with Carta, provides.",start=2.7))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_analysis(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"So we propose OCF Core","map the gaps, then close them into one convertible core"))
    bw=380; bh=150; y=326; ox=270; kx=770; cx2=1270
    oo=appear(t,0.5,0.5); co=appear(t,0.6,0.5); ko=appear(t,0.9,0.5)
    out.append(rrect(ox,y,bw,bh,18, fill=PANEL, stroke=OCF, sw=2.5, opacity=oo))
    out.append(text(ox+bw/2,y+70,"OCF",42,fill=OCF,weight="bold",anchor="middle",opacity=oo))
    out.append(text(ox+bw/2,y+112,"the full standard",22,fill=MUTE,anchor="middle",opacity=oo))
    out.append(rrect(cx2,y,bw,bh,18, fill=PANEL, stroke=CARTA, sw=2.5, opacity=co))
    out.append(text(cx2+bw/2,y+70,"Carta",42,fill=CARTA,weight="bold",anchor="middle",opacity=co))
    out.append(text(cx2+bw/2,y+112,"a leading platform",22,fill=MUTE,anchor="middle",opacity=co))
    # OCF Core — the emphasized bridge in the middle
    out.append(rrect(kx,y-18,bw,bh+36,20, fill="#1c1706", stroke=CORE, sw=3.5, opacity=ko))
    out.append(text(kx+bw/2,y+66,"OCF Core",40,fill=CORE_TXT,weight="bold",anchor="middle",opacity=ko))
    out.append(text(kx+bw/2,y+108,"OCF-shaped bridge",22,fill=CORE_TXT,anchor="middle",opacity=ko))
    a1=appear(t,1.3,0.5); a2=appear(t,1.6,0.5)
    out.append(arrow(ox+bw+8, y+bh/2, kx-8, y+bh/2, OCF, 3.5, a1))
    out.append(text((ox+bw+kx)/2, y+bh/2-22, "projection of", 21, fill=OCF_TXT, anchor="middle", opacity=a1))
    out.append(arrow(kx+bw+8, y+bh/2-11, cx2-8, y+bh/2-11, CORE, 3.5, a2))
    out.append(arrow(cx2-8, y+bh/2+21, kx+bw+8, y+bh/2+21, CORE, 3.5, a2))
    out.append(text((kx+bw+cx2)/2, y+bh/2-34, "fold + enrich", 21, fill=CORE_TXT, weight="bold", anchor="middle", opacity=a2))
    out.append(text(W/2, 620, "Folds to Carta; enriches back to OCF Extended when context is available.", 30,
                    fill=WHITE, weight="bold", anchor="middle", opacity=appear(t,2.1,0.6)))
    out.append(text(W/2, 668, "The mapping work finds the gaps in OCF v1 and Carta; OCF Core closes them.", 26,
                    fill=MUTE, anchor="middle", opacity=appear(t,2.4,0.6)))
    out.append(caption(t, "Hence this effort: map the gaps and define an OCF-shaped Core that can fold to Carta and return as OCF Extended.", start=2.7))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_captable(t, dur):
    o = scene_opacity(t, dur); out=[background()]
    out.append(heading(t, "First, the basics — a cap table"))
    cx=W/2; cy=520
    # company node
    co=appear(t,0.5,0.5)
    out.append(circle(cx, cy, 82, PANEL, co, stroke=CORE, sw=3))
    out.append(text(cx, cy-6, "Company", 26, fill=WHITE, weight="bold", anchor="middle", opacity=co))
    out.append(text(cx, cy+30, "cap table", 20, fill=CORE, anchor="middle", opacity=co))
    owners=[("Founder", -520),("Investors",-175),("Employees",175),("Option pool",520)]
    for i,(lab,dx) in enumerate(owners):
        oo=appear(t,0.9+i*0.18,0.5)
        ox=cx+dx; oy=cy+250
        out.append(line(cx,cy+82, ox,oy-46, BORDER, 2.5, oo))
        out.append(circle(ox,oy,46, "#11161d", oo, stroke=CARTA, sw=2.5))
        out.append(text(ox,oy+6, lab.split()[0][0], 30, fill=CARTA_TXT, weight="bold", anchor="middle", opacity=oo))
        out.append(text(ox,oy+90, lab, 24, fill=MUTE, anchor="middle", opacity=oo))
    out.append(caption(t, "Think of it as the company's ledger of who owns what — and every event that changes it.", start=1.6))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_ocf(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"An OCF object","OCF = Open Cap Format, an open standard for cap-table data"))
    rows=[("name  ·  full legal name","plain"),("relationship  ·  employee, investor…","plain"),
          ("addresses  ·  a list","plain"),("tax IDs  ·  a list","plain"),
          ("contact info  ·  emails & phones","plain"),("issuer-assigned id","plain")]
    c,ch=card(W/2-320, 260, 640, "Stakeholder", "OCF OBJECT · A PERSON", rows, accent=OCF, accent_fill=OCF_FILL,
              opacity=appear(t,0.4,0.5), row_reveal=(0.7,0.16), t=t)
    out.append(c)
    out.append(text(W/2, 880, "One object = one record. OCF captures each fact in rich detail.", 28,
                    fill=OCF_TXT, anchor="middle", opacity=appear(t,1.8,0.6)))
    out.append(caption(t, "An OCF object is one record — here, a person on the cap table.", start=0.9))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_carta(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"A Carta object","Carta is a cap-table platform — it stores the same idea, its own way"))
    rows=[("fullName","carta"),("relationship","carta"),("email","carta")]
    c,ch=card(W/2-320, 300, 640, "Stakeholder", "CARTA OBJECT · A PERSON", rows, accent=CARTA, accent_fill=CARTA_FILL,
              opacity=appear(t,0.4,0.5), row_reveal=(0.7,0.2), t=t)
    out.append(c)
    out.append(text(W/2, 720, "Same person — fewer fields.", 30, fill=CARTA_TXT, anchor="middle", weight="bold", opacity=appear(t,1.5,0.6)))
    out.append(text(W/2, 770, "Carta often holds less detail than OCF.", 26, fill=MUTE, anchor="middle", opacity=appear(t,1.7,0.6)))
    out.append(caption(t, "A Carta object holds the same concept — but sometimes with less detail.", start=0.9))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_architecture(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Two ways to keep the ledger","the deeper difference between OCF and Carta"))
    # LEFT — OCF: a stream of events
    lx=190; pw=520; ph=60; gap=13; y0=316
    events=["Company formed","Shares issued","Shares transferred","Options granted","Vesting event"]
    lo=appear(t,0.5,0.5)
    out.append(text(lx+40, 288, "OCF · EVENT-DRIVEN", 27, fill=OCF, weight="bold", opacity=lo, spacing="2"))
    ys=[y0+i*(ph+gap) for i in range(len(events))]
    sx=lx+18
    out.append(line(sx, ys[0]+ph/2, sx, ys[-1]+ph/2, OCF, 3, appear(t,0.7,0.5)))
    for i,ev in enumerate(events):
        ro=appear(t,0.8+i*0.16,0.45); y=ys[i]
        out.append(circle(sx, y+ph/2, 9, OCF, ro, stroke=BG, sw=3))
        out.append(rrect(lx+44, y, pw, ph, 12, fill=PANEL, stroke=OCF, sw=2, opacity=ro))
        out.append(text(lx+72, y+ph/2+9, ev, 25, fill=WHITE, opacity=ro))
    out.append(text(lx+40, ys[-1]+ph+52, "Every change is an event —", 25, fill=OCF_TXT, opacity=appear(t,1.8,0.5)))
    out.append(text(lx+40, ys[-1]+ph+86, "replay them to see today's picture.", 25, fill=MUTE, opacity=appear(t,1.9,0.5)))
    # RIGHT — Carta: a snapshot + some events
    rx=1120
    co=appear(t,1.3,0.5)
    out.append(text(rx+40, 288, "CARTA · HYBRID", 27, fill=CARTA, weight="bold", opacity=co, spacing="2"))
    snap,sh=card(rx, 316, 600, "Current holdings", "A STATEMENT · SNAPSHOT OF STATE NOW",
                 [("Alice  —  1,000 shares","carta"),("Bob  —  500 shares","carta"),("Pool  —  200 shares","carta")],
                 accent=CARTA, accent_fill=CARTA_FILL, opacity=appear(t,1.4,0.5), row_reveal=(1.7,0.14), t=t)
    out.append(snap)
    ey=316+sh+34
    out.append(text(rx+6, ey, "…plus some events", 26, fill=CARTA_TXT, weight="bold", opacity=appear(t,2.5,0.5)))
    for i,ev in enumerate(["Issuance","Exercise"]):
        ro=appear(t,2.7+i*0.2,0.45); px=rx+i*306
        out.append(rrect(px, ey+22, 286, 58, 12, fill=PANEL, stroke=CARTA, sw=2, opacity=ro))
        out.append(circle(px+30, ey+51, 7, CARTA, ro))
        out.append(text(px+52, ey+59, ev, 24, fill=WHITE, opacity=ro))
    # insight bar
    io=appear(t,3.4,0.6)
    out.append(rrect(W/2-830, 812, 1660, 72, 18, fill="#1a1405", stroke=CORE, sw=2, opacity=io))
    out.append(text(W/2, 857, "So an OCF event lands either as a Carta event — or as a change to Carta's snapshot.",
                    30, fill=CORE_TXT, anchor="middle", weight="bold", opacity=io))
    out.append(caption(t, "OCF logs every event. Carta keeps a live snapshot plus some events — a hybrid. That's why some events convert into state changes.", start=3.8))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_core(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"So what is OCF Core?"))
    cx=W/2; cy=500; r=210
    oa=appear(t,0.5,0.6)
    # two overlapping circles
    out.append(circle(cx-120, cy, r, "none", oa, stroke=OCF, sw=4))
    out.append(f'<circle cx="{cx-120}" cy="{cy}" r="{r}" fill="{OCF}" opacity="{oa*0.10:.3f}"/>')
    out.append(circle(cx+120, cy, r, "none", oa, stroke=CARTA, sw=4))
    out.append(f'<circle cx="{cx+120}" cy="{cy}" r="{r}" fill="{CARTA}" opacity="{oa*0.10:.3f}"/>')
    out.append(text(cx-235, cy-r-24, "OCF", 40, fill=OCF, weight="bold", anchor="middle", opacity=oa))
    out.append(text(cx+235, cy-r-24, "Carta", 40, fill=CARTA, weight="bold", anchor="middle", opacity=oa))
    # intersection highlight
    io=appear(t,1.3,0.6)
    out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="150" ry="150" fill="{CORE}" opacity="{io*0.22:.3f}"/>')
    out.append(text(cx, cy-6, "CORE", 44, fill=CORE_TXT, weight="bold", anchor="middle", opacity=io))
    out.append(text(cx, cy+40, "always converts", 24, fill=CORE_TXT, anchor="middle", opacity=io))
    out.append(text(W/2, 830, "Core = the part of OCF that always converts cleanly into Carta.", 32,
                    fill=WHITE, anchor="middle", weight="bold", opacity=appear(t,2.0,0.6)))
    out.append(caption(t, "We don't hand-pick Core. We derive it — checking every object, field by field.", start=2.4))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_rule(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"The rule we apply to every field"))
    cx=W/2; x=cx-620; y=290; lh=118
    rules=[
        (OCF,  "check", "Keep a fact if Carta can hold it.", "It joins Core."),
        (CORE, "warn",  "Losing a little precision is OK.", "A rounded number, a date format — fine."),
        (LOST, "cross", "Losing a whole thing is not.", "A dropped list or relationship — flagged, left out."),
    ]
    for i,(co,g,main,sub) in enumerate(rules):
        ro=appear(t,0.6+i*0.4,0.5); ry=y+i*lh
        out.append(rrect(x, ry, 1240, 96, 18, fill="#11161d", stroke=BORDER, sw=1.5, opacity=ro))
        gi=x+58
        if g=="check": out.append(check(gi,ry+48,28,co,ro))
        elif g=="cross": out.append(cross(gi,ry+48,28,co,ro))
        else: out.append(warn(gi,ry+48,28,co,ro))
        out.append(text(x+120, ry+44, main, 34, fill=WHITE, weight="bold", opacity=ro))
        out.append(text(x+120, ry+80, sub, 25, fill=MUTE, opacity=ro))
    # object gate line
    go=appear(t,2.2,0.6)
    out.append(text(cx, 780, "And an object joins Core only if at least one real fact lands.", 32,
                    fill=CORE_TXT, anchor="middle", weight="bold", opacity=go))
    out.append(caption(t, "Simple test: does it land in Carta — without dropping anything essential?", start=2.6))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def _example_frame(t, dur, n, title, sub):
    out=[background()]
    out.append(text(160, 120, f"EXAMPLE {n}", 26, fill=CORE, weight="bold", opacity=appear(t,0.0,0.4), spacing="4"))
    out.append(text(160, 178, title, 54, fill=WHITE, weight="bold", opacity=appear(t,0.1,0.5)))
    out.append(text(160, 226, sub, 28, fill=MUTE, opacity=appear(t,0.2,0.5)))
    return out

def s_mapfiles(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"How we write it down","one small, declarative file per object — not code"))
    fx=150; fy=300; fw=850
    lines=[("name","rename","fullName",OCF),
           ("class_type","enum-remap","shareClass",CARTA),
           ("par_value","rename","parValue",OCF),
           ("votes_per_share","unmappable","—",LOST)]
    fh=112+len(lines)*66+58
    fo=appear(t,0.4,0.5)
    out.append(rrect(fx,fy,fw,fh,16, fill=PANEL, stroke=BORDER, sw=2, opacity=fo))
    out.append(rrect(fx,fy,fw,60,16, fill="#1e2246", opacity=fo))
    out.append(rrect(fx,fy+44,fw,16,0, fill="#1e2246", opacity=fo))
    out.append(circle(fx+30,fy+30,8,CORE,fo))
    out.append(text(fx+52,fy+40,"StockClass.mapping.md",26,fill=WHITE,weight="bold",family=MONO,opacity=fo))
    for i,(field,kind,tgt,co) in enumerate(lines):
        ro=appear(t,0.8+i*0.18,0.45); ly=fy+92+i*66
        out.append(text(fx+34,ly+34,field,25,fill="#cdd3f0",family=MONO,opacity=ro))
        pw=len(kind)*13+54; px=fx+330
        out.append(rrect(px,ly+8,pw,44,22, fill="none", stroke=co, sw=2, opacity=ro))
        out.append(circle(px+22,ly+30,6,co,ro))
        out.append(text(px+38,ly+38,kind,22,fill=co,opacity=ro))
        out.append(text(px+pw+28,ly+34,"→ "+tgt,24,fill=MUTE,family=MONO,opacity=ro))
    bo=appear(t,1.7,0.5)
    out.append(f'<g filter="url(#blur)" opacity="{bo*0.6:.3f}">'
               + text(fx+34,fy+fh-26,"…13 fields in all — each one accounted for",22,fill=MUTE,family=MONO)+'</g>')
    # right — the two power constructs, as mini-diagrams
    rx=1090
    out.append(text(rx, 322, "FOR THE HARD CASES", 22, fill=FAINT, weight="bold", opacity=appear(t,1.9,0.5), spacing="3"))
    py=408; po=appear(t,2.1,0.5)
    out.append(circle(rx+30,py,16,OCF,po))
    for dy in (-46,0,46):
        out.append(line(rx+46,py, rx+178,py+dy, CARTA, 2.5, po))
        out.append(circle(rx+196,py+dy,13,CARTA,po))
    out.append(text(rx+250,py-6,"polymorphism",27,fill=WHITE,weight="bold",opacity=po))
    out.append(text(rx+250,py+28,"one object → several Carta families",22,fill=MUTE,opacity=po))
    cyy=572; c2=appear(t,2.4,0.5)
    out.append(circle(rx+30,cyy,16,OCF,c2))
    for dy in (-28,28):
        out.append(arrow(rx+46,cyy, rx+176,cyy+dy, CARTA, 2.5, c2))
        out.append(circle(rx+196,cyy+dy,13,CARTA,c2))
    out.append(text(rx+250,cyy-6,"composite",27,fill=WHITE,weight="bold",opacity=c2))
    out.append(text(rx+250,cyy+28,"one event → an ordered set of records",22,fill=MUTE,opacity=c2))
    out.append(caption(t,"Every field's fate is written down — a handful of declarative rules, one small file per object.",start=2.7))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_process(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Versionable. Reviewable. Verified.","handled like the legal documents they encode"))
    cy=474; r=86
    nodes=[
        (300,  CARTA,     "diff",    "Propose",  "a mapping as a change"),
        (720,  "#8f8bff", "bubble",  "Review",   "people read & approve"),
        (1140, OCF,       "shield",  "Validate", "CI enforces the rules"),
        (1560, CORE,      "commits", "Version",  "tracked in git history"),
    ]
    starts=[0.4,0.95,1.5,2.05]
    for i,(cx,co,icon,title,sub) in enumerate(nodes):
        ro=appear(t,starts[i],0.5)
        out.append(circle(cx,cy,r,"#12152e",ro,stroke=co,sw=3.5))
        if icon=="diff":     out.append(icon_diff(cx,cy,r*0.5,ro))
        elif icon=="bubble": out.append(icon_bubble(cx,cy,r*0.5,co,ro))
        elif icon=="shield": out.append(icon_shield(cx,cy-2,r*0.56,co,ro))
        else:                out.append(icon_commits(cx,cy,r*0.62,co,ro))
        out.append(text(cx,cy+r+52,title,29,fill=co,weight="bold",anchor="middle",opacity=ro))
        out.append(text(cx,cy+r+88,sub,22,fill=MUTE,anchor="middle",opacity=ro))
    for i in range(3):
        ro=appear(t,0.75+i*0.55,0.5)
        x0=nodes[i][0]+r+12; x1=nodes[i+1][0]-r-12
        out.append(arrow(x0,cy,x1,cy,FAINT,3,ro))
    out.append(caption(t,"Each mapping is proposed, reviewed like a legal document, machine-checked, then versioned — a full audit trail.",start=2.6))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_stockclass(t, dur):
    o=scene_opacity(t,dur)
    out=_example_frame(t,dur,1,"A share class","StockClass · e.g. “Common Stock” — the backbone of a cap table")
    # OCF card left
    rows=[("name","in"),("class type","in"),("shares authorized","in"),("par value","in"),
          ("price per share","in"),("liquidation preference","in")]
    lx=170; ly=300
    c,ch=card(lx,ly,560,"StockClass","OCF", rows, accent=OCF, accent_fill=OCF_FILL,
              opacity=appear(t,0.4,0.5), row_reveal=(0.7,0.13), t=t)
    out.append(c)
    # blurred drops beneath
    bo=appear(t,2.4,0.6)
    out.append(f'<g filter="url(#blur)" opacity="{bo*0.7:.3f}">'
               + text(lx+20, ly+ch+58, "votes per share · board dates · conversion rights", 22, fill=MUTE) + '</g>')
    out.append(text(lx, ly+ch+96, "…a little extra detail stays behind", 21, fill=FAINT, opacity=bo, italic=True))
    # Carta card right
    crows=[("name","carta"),("shareClass","carta"),("authorized","carta"),("parValue","carta"),
           ("issuePrice","carta"),("liquidationMultiple","carta")]
    rx=1190
    cc,cch=card(rx,ly,560,"ShareClass","CARTA", crows, accent=CARTA, accent_fill=CARTA_FILL,
              opacity=appear(t,0.9,0.5), row_reveal=(1.2,0.13), t=t)
    out.append(cc)
    # flow arrows between rows
    for i in range(6):
        ao=appear(t,1.6+i*0.09,0.4)
        yy=ly+96+12+i*52+26
        out.append(arrow(lx+560, yy, rx, yy, OCF, 3, ao*0.9))
    out.append(badge(W/2, 852, "Comfortably in Core — 8 facts land", OCF, "check", appear(t,2.7,0.6), w=640))
    out.append(caption(t, "Its core economics land cleanly in Carta, so StockClass sits comfortably in Core.", start=2.9))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_transfer(t, dur):
    o=scene_opacity(t,dur)
    out=_example_frame(t,dur,2,"Transferring shares","StockTransfer · one event becomes two Carta records")
    lx=170; ly=360
    c,ch=card(lx,ly,520,"StockTransfer","OCF · ONE EVENT",
              [("quantity","in"),("date","in"),("from / to","plain")], accent=OCF, accent_fill=OCF_FILL,
              opacity=appear(t,0.4,0.5), row_reveal=(0.7,0.15), t=t)
    out.append(c)
    out.append(text(lx+10, ly+ch+66, "Carta records state — no “transfer” event…", 26, fill=MUTE, opacity=appear(t,1.4,0.5)))
    out.append(text(lx+10, ly+ch+106, "so it becomes a pair of state changes:", 26, fill=CARTA_TXT, weight="bold", opacity=appear(t,1.6,0.5)))
    # two carta cards
    rx=1120
    c1,_=card(rx,250,640,"Cancel certificate","CARTA · STEP 1 (the old shares)",
              [("quantity","carta"),("effective date","carta"),("reason: TRANSFERRED","carta")],
              accent=CARTA, accent_fill=CARTA_FILL, opacity=appear(t,1.2,0.5), row_reveal=(1.5,0.12), t=t)
    c2,_=card(rx,556,640,"Issue certificate","CARTA · STEP 2 (the new owner)",
              [("quantity","carta"),("issue date","carta"),("reason: TRANSFERRED","carta")],
              accent=CARTA, accent_fill=CARTA_FILL, opacity=appear(t,1.6,0.5), row_reveal=(1.9,0.12), t=t)
    out.append(c1); out.append(c2)
    out.append(arrow(lx+520, ly+64, rx, 340, OCF, 3.5, appear(t,2.0,0.4)))
    out.append(arrow(lx+520, ly+112, rx, 646, OCF, 3.5, appear(t,2.2,0.4)))
    out.append(badge(W/2, 852, "In Core — as a composite pair", OCF, "check", appear(t,2.6,0.6), w=600))
    out.append(caption(t, "One real-world event, recorded as two Carta steps. Quantity and date ride along.", start=2.8))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_stakeholder(t, dur):
    o=scene_opacity(t,dur)
    out=_example_frame(t,dur,3,"A person","Stakeholder · joins Core, but some detail is lost")
    lx=170; ly=300
    rows=[("relationship  →  kept (coarsened)","in"),("investor id  →  kept","in"),
          ("full structured name  →  flattened","out"),("address list  →  only one survives","out"),
          ("tax IDs  →  dropped","out"),("contact methods  →  flattened","out")]
    c,ch=card(lx,ly,760,"Stakeholder","OCF · A PERSON", rows, accent=OCF, accent_fill=OCF_FILL,
              opacity=appear(t,0.4,0.5), row_reveal=(0.7,0.16), t=t)
    out.append(c)
    # right side: kept vs lost columns
    rx=1120
    ko=appear(t,1.8,0.6)
    out.append(text(rx, 330, "Lands in Carta", 30, fill=OCF_TXT, weight="bold", opacity=ko))
    for i,lab in enumerate(["relationship","investor id"]):
        out.append(check(rx+20, 388+i*56, 16, OCF, appear(t,2.0+i*0.15,0.4)))
        out.append(text(rx+52, 398+i*56, lab, 26, fill=WHITE, opacity=appear(t,2.0+i*0.15,0.4)))
    lo=appear(t,2.4,0.6)
    out.append(text(rx, 560, "Lost on the way", 30, fill=LOST, weight="bold", opacity=lo))
    for i,lab in enumerate(["address list","tax IDs","structured name","contact methods"]):
        out.append(cross(rx+20, 618+i*56, 16, LOST, appear(t,2.6+i*0.12,0.4)))
        out.append(text(rx+52, 628+i*56, lab, 26, fill=MUTE, opacity=appear(t,2.6+i*0.12,0.4)))
    out.append(badge(W/2, 852, "In Core — but with losses", AMBER, "warn", appear(t,3.3,0.6), w=560))
    out.append(caption(t, "The person joins Core, but their address list, tax IDs and contact details don't fully survive.", start=3.5))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_acceptance(t, dur):
    o=scene_opacity(t,dur)
    out=_example_frame(t,dur,4,"Accepting shares","StockAcceptance · nothing for Carta to carry")
    lx=170; ly=340
    c,ch=card(lx,ly,560,"StockAcceptance","OCF · AN EVENT",
              [("which security","plain"),("date","plain"),("(that's all it records)","plain")],
              accent=OCF, accent_fill=OCF_FILL, opacity=appear(t,0.4,0.5), row_reveal=(0.7,0.15), t=t)
    out.append(c)
    out.append(text(lx+4, ly+ch+70, "This just records that a shareholder", 26, fill=MUTE, opacity=appear(t,1.4,0.5)))
    out.append(text(lx+4, ly+ch+108, "accepted their shares.", 26, fill=WHITE, weight="bold", opacity=appear(t,1.5,0.5)))
    # no-home sink
    rx=1230; ry=440
    so=appear(t,1.6,0.6)
    out.append(circle(rx, ry, 120, LOST_FILL, so, stroke=LOST, sw=3))
    out.append(text(rx, ry-6, "⌀", 90, fill=LOST, anchor="middle", opacity=so))
    out.append(text(rx, ry+150, "Carta stores no", 28, fill=LOST, anchor="middle", weight="bold", opacity=appear(t,1.9,0.5)))
    out.append(text(rx, ry+188, "“acceptance” data", 28, fill=LOST, anchor="middle", weight="bold", opacity=appear(t,1.9,0.5)))
    out.append(arrow(lx+560, ly+60, rx-120, ry, LOST, 3, appear(t,2.1,0.4), dash="8 8"))
    out.append(badge(W/2, 852, "Not in Core — no facts land", LOST, "cross", appear(t,2.6,0.6), w=560))
    out.append(caption(t, "With no real fact that Carta can hold, StockAcceptance stays out of Core.", start=2.8))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_recap(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Four objects, one rule"))
    cards=[("StockClass","comfortable",OCF,"check","8 facts land"),
           ("StockTransfer","composite",CARTA,"check","one event → two"),
           ("Stakeholder","lossy",AMBER,"warn","lands, loses detail"),
           ("StockAcceptance","out",LOST,"cross","nothing lands")]
    cw=400; gap=30; total=4*cw+3*gap; sx=(W-total)/2; y=320
    for i,(nm,tag,co,g,note) in enumerate(cards):
        ro=appear(t,0.6+i*0.25,0.5); x=sx+i*(cw+gap)
        out.append(rrect(x,y,cw,360,20, fill=PANEL, stroke=co, sw=2.5, opacity=ro))
        out.append(rrect(x,y,cw,10,4, fill=co, opacity=ro))
        if g=="check": out.append(check(x+cw/2,y+120,44,co,ro))
        elif g=="warn": out.append(warn(x+cw/2,y+120,44,co,ro))
        else: out.append(cross(x+cw/2,y+120,44,co,ro))
        out.append(text(x+cw/2,y+220,nm,30,fill=WHITE,weight="bold",anchor="middle",opacity=ro))
        out.append(text(x+cw/2,y+266,tag.upper(),24,fill=co,weight="bold",anchor="middle",opacity=ro,spacing="2"))
        out.append(text(x+cw/2,y+312,note,22,fill=MUTE,anchor="middle",opacity=ro))
    out.append(text(W/2, 790, "Every OCF object gets this test — automatically, field by field.", 32,
                    fill=WHITE, anchor="middle", weight="bold", opacity=appear(t,1.9,0.6)))
    out.append(caption(t, "That's the analysis the board asked for: how cap tables move between OCF and Carta — and the gaps in each.", start=2.2))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_ocfgap(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(text(160,120,"THE GAP RUNS BOTH WAYS",26,fill=CORE,weight="bold",opacity=appear(t,0,0.4),spacing="4"))
    out.append(text(160,178,"Where Carta knows more",54,fill=WHITE,weight="bold",opacity=appear(t,0.1,0.5)))
    out.append(text(160,226,"An option exercise — Carta records detail OCF v1 doesn't",28,fill=MUTE,opacity=appear(t,0.2,0.5)))
    lx=170; rx=1130; cy=340
    lc,lh=card(lx,cy,560,"EquityCompExercise","OCF · THE EVENT",
               [("shares exercised","in"),("exercise date","in"),("which security","plain")],
               accent=OCF,accent_fill=OCF_FILL,opacity=appear(t,0.4,0.5),row_reveal=(0.7,0.14),t=t)
    out.append(lc)
    rc,rh=card(rx,cy,620,"Option exercise","CARTA · SAME EVENT, MORE DETAIL",
               [("shares exercised","carta"),("exercise date","carta"),
                ("cash paid to exercise","warn"),("taxes withheld","warn"),("tax detail, line by line","warn")],
               accent=CARTA,accent_fill=CARTA_FILL,opacity=appear(t,0.9,0.5),row_reveal=(1.2,0.13),t=t)
    out.append(rc)
    for i in range(2):  # the two shared rows flow OCF -> Carta (aligned)
        ao=appear(t,1.7+i*0.12,0.4); yy=cy+96+12+i*52+26
        out.append(arrow(lx+560, yy, rx, yy, OCF, 3, ao*0.9))
    # amber callout: the extra Carta rows have no OCF source
    go=appear(t,2.5,0.6)
    out.append(rrect(rx+40, cy+rh+18, 540, 60, 14, fill="#211703", stroke=AMBER, sw=2, opacity=go))
    out.append(warn(rx+74, cy+rh+48, 18, AMBER, go))
    out.append(text(rx+108, cy+rh+57, "OCF v1 has no field for these", 25, fill=AMBER, opacity=go))
    so=appear(t,2.9,0.6)
    out.append(multiline(lx+4, cy+lh+58, wrap("Carta also models equity types OCF v1 lacks — like phantom stock and profits interests.",44),
                         24,36,fill=MUTE,opacity=so))
    out.append(badge(W/2, 852, "A gap in OCF v1 — flagged to close", AMBER, "warn", appear(t,3.2,0.6), w=620))
    out.append(caption(t,"Sometimes Carta captures useful detail OCF doesn't — the cash and taxes on an exercise. Those become gaps for OCF to close.",start=3.4))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_strict_rich(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Core vs. Core loss","strict keeps only what lands cleanly; rich also keeps what lands lossily"))
    cxc,cyc=610,524
    oa=appear(t,0.5,0.6)
    out.append(f'<circle cx="{cxc}" cy="{cyc}" r="250" fill="{LOST}" opacity="{oa*0.10:.3f}" stroke="{LOST}" stroke-width="2"/>')
    ra=appear(t,0.9,0.6)
    out.append(f'<circle cx="{cxc}" cy="{cyc}" r="176" fill="{CORE}" opacity="{ra*0.16:.3f}" stroke="{CORE}" stroke-width="2.5"/>')
    sa=appear(t,1.3,0.6)
    out.append(f'<circle cx="{cxc}" cy="{cyc}" r="104" fill="{OCF}" opacity="{sa*0.30:.3f}" stroke="{OCF}" stroke-width="3"/>')
    out.append(text(cxc,cyc-4,"STRICT",34,fill=OCF_TXT,weight="bold",anchor="middle",opacity=sa))
    out.append(text(cxc,cyc+32,"Core",24,fill=OCF_TXT,anchor="middle",opacity=sa))
    out.append(text(cxc,cyc-140,"RICH adds lossy-home",21,fill=CORE_TXT,anchor="middle",opacity=ra))
    out.append(text(cxc,cyc-216,"no Carta home",21,fill=LOST,anchor="middle",opacity=oa))
    kx=1030; ky=336
    keys=[(OCF,"Strict Core","lands cleanly in Carta — lossless",1.5),
          (CORE,"Rich Core","also keeps fields that land, but lossily",1.8),
          (LOST,"No home","Carta can't hold it at all — a gap",2.1)]
    for i,(co,h,sub,st) in enumerate(keys):
        ro=appear(t,st,0.5); yy=ky+i*116
        out.append(circle(kx+14,yy,11,co,ro))
        out.append(text(kx+40,yy+9,h,30,fill=WHITE,weight="bold",opacity=ro))
        out.append(text(kx+40,yy+46,sub,24,fill=MUTE,opacity=ro))
    out.append(text(kx,ky+3*116+2,"strict ⊂ rich · OCF-shaped",24,fill=FAINT,weight="bold",opacity=appear(t,2.5,0.5)))
    out.append(caption(t,"Value-loss is fine — coarsen a number or an enum. Dropping a whole thing (a list, a relationship) is not.",start=2.7))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_loss_counted(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"The loss, counted","generated straight from the mappings — recomputed on every build"))
    cw=680; gap=80; y=322; ch=336
    lx=W/2-cw-gap/2; rx=W/2+gap/2
    lo=appear(t,0.5,0.5)
    out.append(rrect(lx,y,cw,ch,22,fill="#211703",stroke=AMBER,sw=2.5,opacity=lo))
    out.append(text(lx+40,y+62,"LOSSY HOME",24,fill=AMBER,weight="bold",opacity=lo,spacing="2"))
    out.append(text(lx+40,y+182,str(CORE_COUNTS["lossy"]),118,fill=AMBER,weight="bold",opacity=appear(t,0.7,0.6)))
    out.append(text(lx+236,y+150,"field-mappings",34,fill=WHITE,opacity=appear(t,0.9,0.5)))
    out.append(text(lx+236,y+196,f'{CORE_COUNTS["lossy_objects"]} objects · {CORE_COUNTS["lossy_required"]} required',25,fill=MUTE,opacity=appear(t,0.9,0.5)))
    out.append(text(lx+40,y+262,"a Carta home that narrows on the way out",25,fill="#dcdff2",opacity=appear(t,1.1,0.5)))
    out.append(text(lx+40,y+300,"(list→one, combine, split) — rich-Core candidates",23,fill=MUTE,opacity=appear(t,1.1,0.5)))
    ro=appear(t,1.4,0.5)
    out.append(rrect(rx,y,cw,ch,22,fill="#2a0f16",stroke=LOST,sw=2.5,opacity=ro))
    out.append(text(rx+40,y+62,"NO CARTA HOME",24,fill=LOST,weight="bold",opacity=ro,spacing="2"))
    out.append(text(rx+40,y+182,str(CORE_COUNTS["no_home"]),118,fill=LOST,weight="bold",opacity=appear(t,1.6,0.6)))
    out.append(text(rx+286,y+150,"dropped fields",34,fill=WHITE,opacity=appear(t,1.8,0.5)))
    out.append(text(rx+286,y+196,f'{CORE_COUNTS["no_home_objects"]} objects · {CORE_COUNTS["no_home_required"]} required',25,fill=MUTE,opacity=appear(t,1.8,0.5)))
    out.append(text(rx+40,y+262,"Carta has nowhere to put them —",25,fill="#f0dada",opacity=appear(t,2.0,0.5)))
    out.append(text(rx+40,y+300,"dropped on the fold, and logged as gaps",23,fill=MUTE,opacity=appear(t,2.0,0.5)))
    out.append(text(W/2,724,"Two generated inventories — lossy-home & unmapped — never hand-maintained, always current.",26,
                    fill=WHITE,anchor="middle",opacity=appear(t,2.4,0.6)))
    out.append(caption(t,"So Core is precise about its own losses: what narrows, what's dropped, and how much of it OCF requires.",start=2.7))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_inout(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"What's in Core today — and what's not","in when it lands a real fact Carta can hold; out when it wouldn't"))
    IN=[("Foundational","Issuer · Stakeholder · Valuation"),
        ("Structure","StockClass · StockPlan"),
        ("Issuances","Stock · Convertible · Warrant · EqComp"),
        ("Cancellations","Stock · Convertible · Warrant · EqComp"),
        ("Transfers","Stock · Warrant"),
        ("Conversions","ConvertibleConversion · EqComp Exercise"),
        ("EquityComp","Release · Repricing"),
        ("Adjust / events","StockClass shares · Stakeholder rel."),
        ("Vesting","VestingTerms")]
    OUT=[("Acceptances","Stock · Convertible · Warrant · EqComp"),
         ("Retractions","Stock · Convertible · Warrant · EqComp"),
         ("Transfers","Convertible · EquityComp"),
         ("Stock moves","Conversion · Consolidation · Reissuance · Repurchase"),
         ("Splits & pools","ClassSplit · PoolAdjust · ReturnToPool"),
         ("Vesting","VestingEvent · VestingAcceleration"),
         ("Adjustments","IssuerShares · ConversionRatio"),
         ("Events / misc","StatusChange · WarrantExercise · Financing · Document"),
         ("Templates","StockLegendTemplate")]
    def panel(px,header,co,groups,dash,st):
        h=96+len(groups)*48+22
        out.append(rrect(px,286,800,h,18,fill=PANEL,stroke=co,sw=2.5,opacity=appear(t,st,0.5),dash=dash))
        out.append(text(px+30,286+50,header,25,fill=co,weight="bold",opacity=appear(t,st,0.5),spacing="1"))
        for i,(lab,mem) in enumerate(groups):
            ro=appear(t,st+0.3+i*0.08,0.4); ly=286+100+i*48
            out.append(text(px+30,ly,lab,20,fill=co,weight="bold",opacity=ro))
            out.append(text(px+218,ly,mem,20,fill="#d7dbef",opacity=ro))
    panel(140,f'IN CORE · {CORE_COUNTS["strict"]} objects',OCF,IN,None,0.4)
    panel(980,f'NOT YET IN CORE · {CORE_COUNTS["out"]} objects',"#9aa2c8",OUT,"6 5",0.7)
    out.append(caption(t,"In = it lands at least one real fact Carta stores. Out (for now) = only ids, dates, or nothing Carta holds.",start=2.5))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_lossy_examples(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Lossy vs. lossless — and why",f'of the fields that land: {CORE_COUNTS["lossy"]} narrow (lossy) · the rest keep their value'))
    LOSSLESS=[("par_value → parValue","the exact number, kept"),
              ("StockClass.name → name","plain text, unchanged"),
              ("quantity → quantity","a number, safely widened"),
              ("class_type → shareClass type","enum → a bucket covering every value")]
    LOSSY=[("addresses → address","a list of addresses → just one"),
           ("contact_info → email","many contact methods → one"),
           ("stock_class_ids → shareClassId","many share classes → one"),
           ("conversion_rights → ratio + price","a rights structure, flattened")]
    def panel(px,header,co,fill,items,note,st):
        out.append(rrect(px,286,800,486,18,fill=fill,stroke=co,sw=2.5,opacity=appear(t,st,0.5)))
        out.append(text(px+34,286+52,header,26,fill=co,weight="bold",opacity=appear(t,st,0.5),spacing="1"))
        for i,(f,why) in enumerate(items):
            ro=appear(t,st+0.3+i*0.14,0.45); ly=286+114+i*84
            out.append(text(px+34,ly,f,24,fill=WHITE,family=MONO,opacity=ro))
            out.append(text(px+34,ly+34,why,21,fill=MUTE,opacity=ro))
        out.append(text(px+34,286+486-28,note,21,fill=co,italic=True,opacity=appear(t,st+1.2,0.5)))
    panel(140,"LOSSLESS · lands whole",OCF,"#0f2a1c",LOSSLESS,"the value survives — nothing dropped",0.5)
    panel(980,"LOSSY · narrows on the way out",AMBER,"#241a05",LOSSY,"a list / structure / relationship collapses",1.3)
    out.append(caption(t,"Lossless lands in strict Core. Lossy is why rich Core exists. No home at all is a gap.",start=2.6))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_close(t, dur):
    o=scene_opacity(t,dur); out=[background(brand=True)]
    cx=W/2
    out.append(octc_mark(cx, 250, 84, WHITE, appear(t,0.0,0.7)))
    out.append(text(cx, 470, "That's OCF Core.", 92, fill=WHITE, weight="bold", anchor="middle", opacity=appear(t,0.3,0.7)))
    out.append(line(cx-280, 518, cx+280, 518, "#ffffff", 4, appear(t,0.6,0.4)))
    out.append(multiline(cx, 596, wrap("The reliable, always-convertible heart of OCF — derived from the mappings, not declared by hand.", 56),
                         33, 48, fill="#d7dcf6", anchor="middle", opacity=appear(t,0.8,0.7)))
    # OCF -> Core -> Carta, clean white spaced lockup
    fo=appear(t,1.4,0.6)
    out.append(text(cx, 770, "OCF        →        CORE        →        CARTA", 34, fill="#eef1fb",
                    weight="bold", anchor="middle", opacity=fo, spacing="2"))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

# ============================================================================
# OCF ARCHITECTURE — deep-dive (how OCF itself is constructed)
# ============================================================================
# ---- JSON-schema code-card helpers (illustrate concepts through real schema)
def _codeline(x, y, raw, ro, size=22, hi=False, hicol=CORE_TXT):
    if hi:
        w = len(raw) * size * 0.6 + 24
        return (rrect(x-10, y-size+3, w, size+12, 6, fill=hicol, opacity=ro*0.14)
                + text(x, y, raw, size, fill=hicol, weight="bold", family=MONO, opacity=ro))
    q1 = raw.find('"'); q2 = raw.find('"', q1+1) if q1 >= 0 else -1
    if q1 >= 0 and q2 > 0 and raw[q2+1:q2+2] == ':':
        head = raw[:q2+1]
        return (text(x, y, head, size, fill="#9cc0ff", family=MONO, opacity=ro)
                + text(x + len(head)*size*0.6, y, raw[q2+1:], size, fill="#c9d2f5", family=MONO, opacity=ro))
    return text(x, y, raw, size, fill="#7f88b0", family=MONO, opacity=ro)

def _codecard(x, y, w, h, title, lines, op, hi=None, hicol=CORE_TXT, size=22, lh=33):
    out = [rrect(x, y, w, h, 16, fill="#0b0e26", stroke=BORDER, sw=2, opacity=op),
           rrect(x, y, w, 52, 16, fill="#171b3a", opacity=op),
           rrect(x, y+36, w, 16, 0, fill="#171b3a", opacity=op)]
    for i, co in enumerate(["#ff6b6b", "#ffb02e", "#34c46f"]):
        out.append(circle(x+28+i*26, y+26, 7, co, op))
    out.append(text(x+116, y+34, title, 21, fill=MUTE, family=MONO, opacity=op))
    for i, ln in enumerate(lines):
        out.append(_codeline(x+30, y+88+i*lh, ln, op, size=size, hi=(i == hi), hicol=hicol))
    return "".join(out)

def s_arch_stack(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Event-driven — in the schema","a transactions file is an ordered, append-only array of typed events"))
    lines=['{',
           '  "title": "File - Transactions",',
           '  "properties": {',
           '    "items": {',
           '      "type": "array",',
           '      "items": { "oneOf": [ /* 35 transaction types */ ] }',
           '    }',
           '  }',
           '}']
    out.append(_codecard(130,272,1080,452,"TransactionsFile.schema.json",lines,appear(t,0.4,0.5),hi=5,hicol=OCF,size=22,lh=34))
    rx=1268
    out.append(text(rx,300,"EACH ITEM IS A TYPED EVENT",22,fill=OCF,weight="bold",opacity=appear(t,1.5,0.5),spacing="1"))
    for i,c in enumerate(['"object_type": "TX_STOCK_ISSUANCE"','"object_type": "TX_STOCK_TRANSFER"',
                          '"object_type": "TX_STOCK_CONVERSION"','"object_type": "TX_STOCK_CANCELLATION"']):
        out.append(_codeline(rx,356+i*40,c,appear(t,1.6+i*0.1,0.5),size=20))
    out.append(multiline(rx,566,wrap("No mutable state is stored — replay the array to compute the cap table at any date.",31),24,34,fill=MUTE,opacity=appear(t,2.2,0.5)))
    out.append(caption(t,"OCF is event-driven at the schema level: a transactions file holds an array of 35 typed transaction shapes — the immutable, auditable event stack.",start=2.5))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_arch_ids(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Threaded by security_id","terminal transactions consume a security and emit new ones"))
    lines=['{',
           '  "$id": ".../transfer/StockTransfer.schema.json",',
           '  "properties": {',
           '    "object_type": { "const": "TX_STOCK_TRANSFER" },',
           '    "security_id":  { "type": "string" },',
           '    "resulting_security_ids": {',
           '      "type": "array", "items": { "type": "string" }',
           '    },',
           '    "balance_security_id": { "type": "string" }',
           '  },',
           '  "required": [ "security_id", "resulting_security_ids" ]',
           '}']
    out.append(_codecard(130,258,1080,560,"StockTransfer.schema.json",lines,appear(t,0.4,0.5),hi=4,hicol=CORE,size=20,lh=32))
    rx=1268
    out.append(text(rx,300,"THE ID FAMILY",22,fill=OCF,weight="bold",opacity=appear(t,1.5,0.5),spacing="2"))
    for i,(k,d) in enumerate([("id","unique per object"),("security_id","the certificate thread"),
                              ("custom_id","implementer's label"),("share_numbers_issued","when not fungible")]):
        y=352+i*76; rr=appear(t,1.6+i*0.1,0.5)
        out.append(text(rx,y,k,22,fill=CORE_TXT,weight="bold",family=MONO,opacity=rr))
        out.append(text(rx,y+28,d,20,fill=MUTE,opacity=rr))
    out.append(multiline(rx,692,wrap("security_id in → resulting_security_ids out: the whole stack is one linked chain.",31),22,32,fill=MUTE,opacity=appear(t,2.3,0.5)))
    out.append(caption(t,"Every transaction references a security_id; terminal ones (transfer, conversion, exercise…) emit resulting_security_ids — the thread you traverse.",start=2.6))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_arch_composition(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Built by composition — allOf","objects pull shared properties from primitives, then add their own"))
    lines=['{',
           '  "$id": ".../issuance/StockIssuance.schema.json",',
           '  "allOf": [',
           '    { "$ref": ".../primitives/objects/Object" },',
           '    { "$ref": ".../transactions/Transaction" },',
           '    { "$ref": ".../transactions/SecurityTransaction" },',
           '    { "$ref": ".../transactions/issuance/Issuance" }',
           '  ],',
           '  "properties": { "object_type": { "const": "TX_STOCK_ISSUANCE" } },',
           '  "additionalProperties": false',
           '}']
    out.append(_codecard(130,256,1080,566,"StockIssuance.schema.json",lines,appear(t,0.4,0.5),hi=2,hicol=OCF,size=20,lh=32))
    rx=1268
    out.append(text(rx,300,"EACH $ref ADDS",22,fill=OCF,weight="bold",opacity=appear(t,1.5,0.5),spacing="2"))
    for i,(k,d) in enumerate([("Object","the required  id"),("Transaction","date, comments"),
                              ("SecurityTransaction","security_id"),("Issuance","quantity, stakeholder_id")]):
        y=352+i*76; rr=appear(t,1.6+i*0.1,0.5)
        out.append(text(rx,y,k,21,fill=CORE_TXT,weight="bold",family=MONO,opacity=rr))
        out.append(text(rx,y+28,d,20,fill=MUTE,opacity=rr))
    out.append(multiline(rx,692,wrap("additionalProperties:false — final objects add nothing beyond the composed schema.",31),22,32,fill=MUTE,opacity=appear(t,2.3,0.5)))
    out.append(caption(t,"StockIssuance = Object + Transaction + SecurityTransaction + Issuance via allOf — composition, not copy-paste — with a required id and no custom fields.",start=2.6))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_arch_convert(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"Expressive by composition","conversions & vesting are assembled from small referenced pieces"))
    cr=['"ConvertibleConversionRight": {',
        '  "properties": {',
        '    "type": { "const": "..._CONVERSION_RIGHT" },',
        '    "conversion_mechanism": {',
        '      "$ref": ".../RatioConversionMechanism" },',
        '    "converts_to_stock_class_id": { "type": "string" }',
        '  }',
        '}']
    out.append(_codecard(96,300,832,452,"conversion_rights / ConvertibleConversionRight",cr,appear(t,0.4,0.5),hi=3,hicol=OCF,size=19,lh=31))
    out.append(text(116,792,"right (WHAT) → mechanism (HOW);  trigger (WHEN) is separate",21,fill=OCF_TXT,family=MONO,opacity=appear(t,1.0,0.5)))
    vs=['"VestingScheduleSegment": {',
        '  "properties": {',
        '    "occurrences": { "type": "integer" },',
        '    "period":      { "type": "integer" },',
        '    "period_type": { "$ref": ".../PeriodType" },',
        '    "cliff":       { "$ref": ".../VestingScheduleCliff" }',
        '  }',
        '}']
    out.append(_codecard(992,300,832,452,"vesting / VestingScheduleSegment",vs,appear(t,0.9,0.5),hi=5,hicol=CORE,size=19,lh=31))
    out.append(text(1012,792,"segments + cliffs compose into a VestingStatement",21,fill=CORE_TXT,family=MONO,opacity=appear(t,1.5,0.5)))
    out.append(caption(t,"3 conversion rights × 6 triggers × 8 mechanisms, plus vesting built from segments & cliffs — small $ref'd pieces mix to model attorney-drafted terms.",start=1.9))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

def s_arch_files(t, dur):
    o=scene_opacity(t,dur); out=[background()]
    out.append(heading(t,"One cap table — the manifest schema","a manifest references arrays of typed files"))
    lines=['{',
           '  "title": "File - OCF Manifest",',
           '  "properties": {',
           '    "issuer":              { "$ref": ".../Issuer" },',
           '    "stakeholders_files":  { "type": "array" },',
           '    "stock_classes_files": { "type": "array" },',
           '    "transactions_files":  { "type": "array" },',
           '    "valuations_files":    { "type": "array" },',
           '    "vesting_terms_files": { "type": "array" }',
           '  }',
           '}']
    out.append(_codecard(130,262,1080,540,"OCFManifestFile.schema.json",lines,appear(t,0.4,0.5),size=20,lh=33))
    rx=1268
    out.append(text(rx,300,"…+ 4 MORE FILE KINDS",22,fill=OCF,weight="bold",opacity=appear(t,1.5,0.5),spacing="1"))
    for i,f in enumerate(["stock_plans_files","stock_legend_templates_files","financings_files","documents_files"]):
        out.append(_codeline(rx,354+i*40,'"'+f+'":',appear(t,1.6+i*0.1,0.5),size=19))
    out.append(rrect(rx,540,520,150,16,fill="#1c1706",stroke=CORE,sw=2,opacity=appear(t,2.2,0.5)))
    out.append(multiline(rx+28,588,wrap("*.ocf.zip container · MD5 checksums · JSON Schema Draft 7",26),22,34,fill=CORE_TXT,opacity=appear(t,2.3,0.5)))
    out.append(caption(t,"Ten typed file kinds make a complete cap table; the manifest references them all, and MD5 checksums keep the .ocf.zip bundle intact.",start=2.5))
    return f'<g opacity="{o:.3f}">'+"".join(out)+'</g>'

# ---- timeline --------------------------------------------------------------
SCENES = [
    ("title",       s_title,       5.0),
    ("coalition",   s_coalition,   11.0),
    ("problem",     s_problem,     13.0),
    ("ocfstd",      s_ocf_standard,12.0),
    ("eventswhy",   s_events_why,  13.0),
    ("ocfevents",   s_ocf_events,  13.0),
    ("archstack",   s_arch_stack,   13.0),
    ("archids",     s_arch_ids,     14.0),
    ("archcompose", s_arch_composition, 13.0),
    ("archconvert", s_arch_convert, 14.0),
    ("archfiles",   s_arch_files,   12.0),
    ("why",         s_why,         13.0),
    ("analysis",    s_analysis,    12.0),
    ("captable",    s_captable,    9.0),
    ("ocf",         s_ocf,         10.0),
    ("carta",       s_carta,       9.0),
    ("architecture",s_architecture,13.0),
    ("core",        s_core,        12.0),
    ("rule",        s_rule,        11.0),
    ("mapfiles",    s_mapfiles,    13.0),
    ("process",     s_process,     12.0),
    ("stockclass",  s_stockclass,  13.0),
    ("transfer",    s_transfer,    14.0),
    ("stakeholder", s_stakeholder, 14.0),
    ("acceptance",  s_acceptance,  12.0),
    ("ocfgap",      s_ocfgap,      15.0),
    ("recap",       s_recap,       10.0),
    ("strictrich",  s_strict_rich, 14.0),
    ("inout",       s_inout,       13.0),
    ("losscounted", s_loss_counted,12.0),
    ("lossyex",     s_lossy_examples,14.0),
    ("close",       s_close,       7.0),
]

DEFS = f'''<defs>
  <filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
  <radialGradient id="vig" cx="50%" cy="42%" r="75%">
    <stop offset="52%" stop-color="{BG}" stop-opacity="0"/>
    <stop offset="100%" stop-color="{BG2}" stop-opacity="0.92"/>
  </radialGradient>
  <radialGradient id="brandvig" cx="50%" cy="44%" r="80%">
    <stop offset="0%" stop-color="{BRAND}" stop-opacity="0"/>
    <stop offset="100%" stop-color="{BRAND_DK}" stop-opacity="0.85"/>
  </radialGradient>
</defs>'''

def doc(inner):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
            f'viewBox="0 0 {W} {H}">{DEFS}{inner}</svg>')

def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "manifest"
    if mode == "manifest":
        tacc = 0
        for nm, fn, dur in SCENES:
            print(f"{nm:14s} start={tacc:6.1f}s  dur={dur:5.1f}s")
            tacc += dur
        print(f"{'TOTAL':14s} {tacc:6.1f}s")
        return
    outdir = sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    if mode in ("stills", "plates"):
        global TEXT_ON
        if mode == "plates":
            TEXT_ON = False  # keep every shape/icon/gradient, drop the text
        for nm, fn, dur in SCENES:
            svg = doc(fn(dur * 0.72, dur))  # representative: near-end, fully revealed
            open(os.path.join(outdir, f"{nm}.svg"), "w").write(svg)
            print("wrote", nm)
        return
    if mode == "all":
        fps = FPS
        if "--fps" in sys.argv: fps = int(sys.argv[sys.argv.index("--fps")+1])
        idx = 0
        for nm, fn, dur in SCENES:
            nfr = int(round(dur * fps))
            for f in range(nfr):
                t = f / fps
                svg = doc(fn(t, dur))
                open(os.path.join(outdir, f"f{idx:05d}.svg"), "w").write(svg)
                idx += 1
        print(f"wrote {idx} frames at {fps}fps -> {idx/fps:.1f}s")
        return

if __name__ == "__main__":
    main()
