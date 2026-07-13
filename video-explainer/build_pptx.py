import glob
from pptx import Presentation
from pptx.util import Inches

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank = prs.slide_layouts[6]  # truly blank
pngs = sorted(glob.glob("slides/*.png"))
for p in pngs:
    slide = prs.slides.add_slide(blank)
    slide.shapes.add_picture(p, 0, 0, width=prs.slide_width, height=prs.slide_height)
prs.save("ocf-core-explainer.pptx")
print(f"wrote ocf-core-explainer.pptx with {len(pngs)} slides")
