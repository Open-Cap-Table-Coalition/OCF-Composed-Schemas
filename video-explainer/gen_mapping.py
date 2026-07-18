#!/usr/bin/env python3
"""OCF Core — *mapping* explainer: SVG frame/still generator (deck-focused).

Companion to gen.py (the Core video). Same design system and SVG primitives — imported
straight from gen.py — but a different story: how the mapping corpus works and, object by
object, which properties are LEFT BEHIND by the mapping (vs. what lands) and are therefore
candidates for OCF *community extensions*.

Data is synthesized from the committed, generated inventories (not recomputed here):
  - OCF -> Core losses:  core/core-gaps.md (a)                 [required flags]
  - what lands / Carta side: docs/core-bidirectional-flow.md   [mapped + cartalost]
Left-behind is collapsed across polymorphic variants (a field that lands in ANY variant is
NOT left behind), matching the published per-object table.

Modes mirror gen.py:  manifest | stills OUTDIR | plates OUTDIR | all OUTDIR [--fps N]
"""
import sys, os
import gen
from gen import *          # primitives, palette, icons, card/badge/heading/caption/octc_mark, doc, wrap …

# ============================================================================
# Authored per-object prose (role / family / polymorphism / takeaway) and the
# curated Carta-side concept labels (de-noised of Carta's denormalization slots).
# The mechanical field lists (ocf_left / ocf_mapped / carta_mapped) come from COMPUTED.
# ============================================================================
OBJECTS = [
  dict(name="Issuer", fam="Foundational", role="The company that owns the cap table",
       carta_left=["website"],
       take="Carta holds almost none of the issuer's formation & contact detail — nearly all the extension is OCF-side."),
  dict(name="Stakeholder", fam="Foundational", role="A person or institution on the cap table",
       carta_left=["stakeholder group / classification"],
       take="OCF carries richer identity (full name, address list, tax IDs); Carta adds only a grouping."),
  dict(name="StakeholderRelationshipChangeEvent", fam="Foundational",
       role="A change to a stakeholder's relationship",
       carta_left=["stakeholder group / classification"],
       take="Only the event date has no home; Carta's stakeholder grouping is the reverse candidate."),
  dict(name="StockClass", fam="Structure", role="A class of stock (Common, Preferred, …)",
       carta_left=["pari-passu ranking", "participation rights", "preferred-class rights detail"],
       take="votes_per_share is the emblematic OCF gap; Carta's preferred-class rights are the mirror image."),
  dict(name="StockClassAuthorizedSharesAdjustment", fam="Structure",
       role="Re-authorizing a class's share count",
       carta_left=["pari-passu ranking (via ShareClass)", "preferred-class rights detail"],
       take="Approval dates drop; the reverse detail rides on the ShareClass the adjustment targets."),
  dict(name="StockClassConversionRatioAdjustment", fam="Structure",
       role="Adjusting a class's conversion ratio",
       carta_left=["participation & preferred-class rights detail"],
       take="Almost symmetric — a date on one side, share-class rights on the other."),
  dict(name="StockPlan", fam="Structure", role="An equity incentive plan / option pool",
       carta_left=["pool rollup totals (Carta-derived)"],
       take="Carta's pool figures are computed rollups; OCF records the leaf events, not the container."),
  dict(name="Valuation", fam="Structure", role="A 409A / share valuation",
       carta_left=["common-vs-share-class valuation split"],
       take="OCF's valuation provenance (type, provider, dates) has no Carta home."),
  dict(name="Document", fam="Structure", role="An attached legal document",
       carta_left=["document name", "document URL"],
       take="A near-symmetric pair — each side holds a couple of fields the other omits."),
  dict(name="StockIssuance", fam="Stock", role="Issuing shares to a holder", poly="Default / RSA",
       carta_left=["certificate lineage (precededBy)", "holder residency (country / state)"],
       take="Legends, approvals & vesting drop; Carta adds certificate lineage and residency."),
  dict(name="StockTransfer", fam="Stock", role="Transferring shares (folds to cancel + issue)",
       poly="Default / RSA",
       carta_left=["certificate lineage (precededBy)", "termination vs. forfeiture distinction"],
       take="A clean composite; the reverse gaps are Carta's cancellation nuances."),
  dict(name="StockCancellation", fam="Stock", role="Cancelling a stock position", poly="Default / RSA",
       carta_left=["termination vs. forfeiture distinction"],
       take="Carta distinguishes why shares left (terminated vs. forfeited); OCF v1 doesn't."),
  dict(name="ConvertibleIssuance", fam="Convertible", role="Issuing a convertible (note / SAFE)",
       carta_left=["maturity date", "note blocks (grouping)", "holder residency"],
       take="Carta adds maturity, note blocks & residency; the note's interest terms are a deferred OCF→Carta mapping (coming, not a gap)."),
  dict(name="ConvertibleConversion", fam="Convertible", role="Converting a convertible",
       carta_left=["cash paid on conversion", "conversion trigger detail"],
       take="Conversion provenance (trigger, resulting securities) has no home; Carta adds cash & trigger."),
  dict(name="ConvertibleCancellation", fam="Convertible", role="Cancelling a convertible",
       carta_left=["— none of substance (rollup containers only)"],
       take="Effectively symmetric: only a balance reference drops, and Carta adds no real concept."),
  dict(name="WarrantIssuance", fam="Warrant", role="Issuing a warrant",
       carta_left=["holder residency", "warrant rollup containers (derived)"],
       take="Warrant exercise-triggers & quantity-source drop; the reverse is mostly derived rollups."),
  dict(name="WarrantTransfer", fam="Warrant", role="Transferring a warrant",
       carta_left=["resulting-security label", "warrant rollups (derived)"],
       take="Lineage arrays collapse; Carta adds a resulting-security label."),
  dict(name="WarrantCancellation", fam="Warrant", role="Cancelling a warrant",
       carta_left=["— none"],
       take="One-directional: security references drop, Carta holds nothing extra."),
  dict(name="EquityCompensationIssuance", fam="Equity comp", role="Granting equity comp",
       poly="Option / RSU / SAR",
       carta_left=["ISO / NSO split", "outstanding / vested / exercised quantities", "holder residency"],
       take="Nearly every field lands for some grant type; the opportunity is Carta's ISO/NSO split & rollups."),
  dict(name="EquityCompensationExercise", fam="Equity comp", role="Exercising equity comp",
       poly="Option / SAR",
       carta_left=["exercise method", "cash paid & tax withheld", "settled quantity", "resulting-security lineage"],
       take="Carta records the money/tax mechanics of an exercise; OCF v1 keeps only the core event."),
  dict(name="EquityCompensationRelease", fam="Equity comp", role="Releasing / settling an RSU",
       carta_left=["net-settlement & sale quantities", "tax withheld", "resulting certificate lineage"],
       take="RSU settlement mechanics are a rich Carta-side gap for OCF to consider."),
  dict(name="EquityCompensationCancellation", fam="Equity comp", role="Cancelling equity comp",
       poly="Option / RSU / SAR",
       carta_left=["termination vs. forfeiture distinction"],
       take="Same cancellation nuance as stock: Carta separates termination from forfeiture."),
  dict(name="EquityCompensationRepricing", fam="Equity comp", role="Repricing equity comp",
       poly="Option / SAR",
       carta_left=["— plan / grant linkage only (derived)"],
       take="Nearly symmetric — the event's date & security drop, Carta adds no new concept."),
  dict(name="VestingTerms", fam="Equity comp", role="A reusable vesting schedule",
       carta_left=["schedule name, description & type (template metadata)"],
       take="Nothing OCF-side is dropped; Carta's template metadata is the only extension."),
]

# ---- mechanical field lists (parsed from the generated inventories) --------
# ocf_left: (field, required?, loss)  — OCF-native, no Carta home (collapsed across variants)
# ocf_mapped / carta_mapped: the fields that DO land (shown dim, for a mapped-vs-left sense)
COMPUTED = {
  "Issuer": dict(
    ocf_left=[("country_of_formation",1,"nd"), ("formation_date",1,"nd"), ("address",0,"nd"), ("country_subdivision_name_of_formation",0,"nd"), ("country_subdivision_of_formation",0,"nd"), ("email",0,"nd"), ("initial_shares_authorized",0,"nd"), ("phone",0,"nd"), ("tax_ids",0,"nd")],
    ocf_mapped=["dba", "legal_name"],
    carta_mapped=["doingBusinessAsName", "legalName"]),
  "Stakeholder": dict(
    ocf_left=[("current_status",0,"nd"), ("tax_ids",0,"nd")],
    ocf_mapped=["addresses", "contact_info", "current_relationship", "current_relationships", "issuer_assigned_id", "name", "primary_contact", "stakeholder_type"],
    carta_mapped=["address", "email", "employeeId", "entityType", "fullName", "relationship"]),
  "StakeholderRelationshipChangeEvent": dict(
    ocf_left=[("date",1,"nd")],
    ocf_mapped=["relationship_ended", "relationship_started", "stakeholder_id"],
    carta_mapped=["id", "relationship"]),
  "StockClass": dict(
    ocf_left=[("votes_per_share",1,"nd"), ("board_approval_date",0,"nd"), ("stockholder_approval_date",0,"nd")],
    ocf_mapped=["class_type", "conversion_rights", "default_id_prefix", "initial_shares_authorized", "liquidation_preference_multiple", "name", "par_value", "participation_cap_multiple", "price_per_share", "seniority"],
    carta_mapped=["authorizedShareCount", "conversionRatio / conversionPrice", "multiplier", "name", "originalIssuePrice", "parValue", "participationCap", "prefix", "seniority", "type"]),
  "StockClassAuthorizedSharesAdjustment": dict(
    ocf_left=[("date",1,"nd"), ("board_approval_date",0,"nd"), ("stockholder_approval_date",0,"nd")],
    ocf_mapped=["new_shares_authorized", "stock_class_id"],
    carta_mapped=["authorizedShareCount", "id"]),
  "StockClassConversionRatioAdjustment": dict(
    ocf_left=[("date",0,"nd")],
    ocf_mapped=["new_ratio_conversion_mechanism", "stock_class_id"],
    carta_mapped=["conversionRatio / conversionPrice", "id"]),
  "StockPlan": dict(
    ocf_left=[("board_approval_date",0,"nd"), ("default_cancellation_behavior",0,"nd"), ("stockholder_approval_date",0,"nd")],
    ocf_mapped=["initial_shares_reserved", "plan_name", "stock_class_id", "stock_class_ids"],
    carta_mapped=["authorizedShares", "name", "shareClassId"]),
  "Valuation": dict(
    ocf_left=[("effective_date",1,"nd"), ("valuation_type",1,"nd"), ("board_approval_date",0,"nd"), ("provider",0,"nd"), ("stockholder_approval_date",0,"nd")],
    ocf_mapped=["price_per_share", "stock_class_id"],
    carta_mapped=["price", "shareClassId"]),
  "Document": dict(
    ocf_left=[("md5",0,"nd"), ("related_objects",0,"nd")],
    ocf_mapped=["path", "uri"],
    carta_mapped=["fileId"]),
  "StockIssuance": dict(
    ocf_left=[("stock_legend_ids",1,"nd"), ("consideration_text",0,"nd"), ("issuance_type",0,"nd"), ("share_numbers_issued",0,"nd"), ("stockholder_approval_date",0,"nd")],
    ocf_mapped=["board_approval_date", "cost_basis", "custom_id", "date", "quantity", "security_id", "security_law_exemptions", "share_price", "stakeholder_id", "stock_class_id", "stock_plan_id", "vesting_terms_id", "vestings"],
    carta_mapped=["acquisitionCost", "boardApprovalDate", "equityPlanId", "federalExemption", "issueDatetime", "pricePerShare", "quantity", "securityId", "securityLabel", "shareClassId", "stakeholderId", "vestingEvents", "vestingScheduleTemplateId"]),
  "StockTransfer": dict(
    ocf_left=[("security_id",1,"nd"), ("consideration_text",0,"nd")],
    ocf_mapped=["balance_security_id", "date", "quantity", "resulting_security_ids"],
    carta_mapped=["effectiveDatetime", "issueDatetime", "quantity", "securities"]),
  "StockCancellation": dict(
    ocf_left=[("security_id",1,"nd")],
    ocf_mapped=["balance_security_id", "date", "quantity", "reason_text"],
    carta_mapped=["effectiveDatetime", "quantity", "reason", "securities"]),
  "ConvertibleIssuance": dict(
    ocf_left=[("seniority",1,"nd"), ("board_approval_date",0,"nd"), ("consideration_text",0,"nd"), ("pro_rata",0,"nd"), ("stockholder_approval_date",0,"nd")],
    ocf_mapped=["conversion_triggers", "convertible_type", "custom_id", "date", "investment_amount", "security_id", "security_law_exemptions", "stakeholder_id"],
    carta_mapped=["conversionTrigger / discountPercentage / valuationCap", "federalExemption", "issueDatetime", "noteType", "principal", "securityId", "securityLabel", "stakeholderId"]),
  "ConvertibleConversion": dict(
    ocf_left=[("reason_text",1,"nd"), ("resulting_security_ids",1,"nd"), ("trigger_id",1,"nd"), ("balance_security_id",0,"nd"), ("capitalization_definition",0,"nd")],
    ocf_mapped=["date", "quantity_converted", "security_id"],
    carta_mapped=["canceledQuantity", "effectiveDatetime", "securityId"]),
  "ConvertibleCancellation": dict(
    ocf_left=[("balance_security_id",0,"nd")],
    ocf_mapped=["amount", "date", "reason_text", "security_id"],
    carta_mapped=["effectiveDatetime", "principal", "reason", "securityId"]),
  "WarrantIssuance": dict(
    ocf_left=[("exercise_triggers",1,"nd"), ("board_approval_date",0,"nd"), ("consideration_text",0,"nd"), ("quantity_source",0,"nd"), ("stockholder_approval_date",0,"nd"), ("vestings",0,"nd")],
    ocf_mapped=["custom_id", "date", "exercise_price", "purchase_price", "quantity", "security_id", "security_law_exemptions", "stakeholder_id", "vesting_terms_id", "warrant_expiration_date"],
    carta_mapped=["exercisePrice", "expirationDatetime", "federalExemption", "issueDatetime", "purchasePrice", "quantity", "securityId", "securityLabel", "stakeholderId", "vestingScheduleTemplateId"]),
  "WarrantTransfer": dict(
    ocf_left=[("balance_security_id",0,"nd"), ("consideration_text",0,"nd")],
    ocf_mapped=["date", "quantity", "resulting_security_ids", "security_id"],
    carta_mapped=["quantity", "resultingSecurityId", "securityId", "transferredDatetime"]),
  "WarrantCancellation": dict(
    ocf_left=[("security_id",1,"nd"), ("balance_security_id",0,"nd")],
    ocf_mapped=["date", "quantity", "reason_text"],
    carta_mapped=["effectiveDatetime", "quantity", "reason"]),
  "EquityCompensationIssuance": dict(
    ocf_left=[("consideration_text",0,"nd"), ("stockholder_approval_date",0,"nd")],
    ocf_mapped=["base_price", "board_approval_date", "compensation_type", "custom_id", "date", "early_exercisable", "exercise_price", "expiration_date", "option_grant_type", "quantity", "security_id", "security_law_exemptions", "stakeholder_id", "stock_class_id", "stock_plan_id", "termination_exercise_windows", "vesting_start_date", "vesting_template_id", "vestings"],
    carta_mapped=["boardApprovalDate", "earlyExercisable", "equityPlanId", "exercisePeriods", "exercisePrice", "expirationDatetime", "federalExemption", "issueDatetime", "quantity", "securityId", "securityLabel", "shareClassId", "stakeholderId", "stockOptionType", "vestingEvents", "vestingScheduleTemplateId", "vestingStartDate"]),
  "EquityCompensationExercise": dict(
    ocf_left=[("security_id",1,"nd"), ("consideration_text",0,"nd")],
    ocf_mapped=["date", "quantity", "resulting_security_ids"],
    carta_mapped=["quantity", "securities", "sharesAcquiredDatetime"]),
  "EquityCompensationRelease": dict(
    ocf_left=[("security_id",1,"nd"), ("consideration_text",0,"nd")],
    ocf_mapped=["date", "quantity", "release_price", "resulting_security_ids", "settlement_date"],
    carta_mapped=["securities", "settledQuantity", "settlementDate", "settlementDatetime", "settlementPrice"]),
  "EquityCompensationCancellation": dict(
    ocf_left=[("security_id",1,"nd"), ("balance_security_id",0,"nd")],
    ocf_mapped=["date", "quantity", "reason_text"],
    carta_mapped=["effectiveDatetime", "quantity", "reason"]),
  "EquityCompensationRepricing": dict(
    ocf_left=[("date",1,"nd"), ("security_id",1,"nd")],
    ocf_mapped=["new_exercise_price"],
    carta_mapped=["exercisePrice"]),
  "VestingTerms": dict(
    ocf_left=[],
    ocf_mapped=["statements"],
    carta_mapped=["periods"]),
}

TOT = len(OBJECTS)
ROW_H = 40
MAXLEFT = 6


# ============================================================================
# helpers
# ============================================================================
def _pack1(names, budget=44):
    """Fit names on ONE line within the panel; always show ≥1 (truncated if huge)."""
    if not names:
        return "—"
    shown, used = [], 0
    for n in names:
        add = (2 if shown else 0) + len(n)
        if shown and used + add > budget:
            break
        shown.append(n); used += add
    if len(shown) == 1 and len(shown[0]) > budget:
        shown[0] = shown[0][:budget - 1] + "…"
    ln = ", ".join(shown)
    hid = len(names) - len(shown)
    if hid > 0:
        ln += f", +{hid} more"
    return ln


def _ratio(x, y, w, mapped, left, accent, op):
    """A thin mapped(accent) vs left-behind(gold) proportion bar + counts."""
    tot = max(1, mapped + left)
    mw = w * mapped / tot
    out = [rrect(x, y, w, 12, 6, fill="#0e1330", opacity=op)]
    if mapped:
        out.append(rrect(x, y, max(10, mw), 12, 6, fill=accent, opacity=op))
    if left:
        out.append(rrect(x + mw, y, max(10, w - mw), 12, 6, fill=CORE, opacity=op))
    out.append(text(x, y + 40, f"{mapped} mapped", 21, fill=accent, weight="bold", opacity=op))
    out.append(text(x + w, y + 40, f"{left} left behind", 21, fill=CORE_TXT, weight="bold",
                    anchor="end", opacity=op))
    return out


def _panel(t, x, y, w, h, accent, accent_fill, title, sub, mapped, left_rows, start):
    """left_rows: list of (label, required?, mono?)."""
    op = appear(t, start, 0.5)
    nleft = len(left_rows)
    out = [rrect(x, y, w, h, 20, fill=PANEL, stroke=accent, sw=2.5, opacity=op)]
    out.append(rrect(x, y, w, 92, 20, fill=accent_fill, opacity=op))
    out.append(rrect(x, y + 72, w, 20, 0, fill=accent_fill, opacity=op))
    out.append(text(x + 32, y + 44, title, 31, fill=WHITE, weight="bold", opacity=op))
    out.append(text(x + 32, y + 76, sub, 19, fill=accent, opacity=op, spacing="0.5"))
    # ratio bar
    out += _ratio(x + 32, y + 112, w - 64, len(mapped), nleft, accent, op)
    # candidates (hero)
    out.append(text(x + 32, y + 186, "CANDIDATES FOR EXTENSION", 18, fill=CORE_TXT,
                    weight="bold", opacity=op, spacing="1.5"))
    if not left_rows:
        out.append(text(x + 44, y + 232, "— none · everything the mapping touches lands", 23,
                        fill=FAINT, italic=True, opacity=op))
    show = left_rows if nleft <= MAXLEFT else left_rows[:MAXLEFT - 1]
    for i, (lab, req, mono) in enumerate(show):
        ty = y + 222 + i * ROW_H; ro = appear(t, start + 0.25 + i * 0.05, 0.4)
        mx = 38 if mono else (40 if req else 48)          # keep the row inside the panel
        show_lab = lab if len(lab) <= mx else lab[:mx - 1] + "…"
        out.append(circle(x + 46, ty - 8, 7, CORE, ro))
        out.append(text(x + 68, ty, show_lab, 25, fill=(WHITE if req else "#d7ddf5"),
                        weight=("bold" if req else "normal"), family=(MONO if mono else FONT), opacity=ro))
        if req:
            out.append(text(x + w - 32, ty, "required", 18, fill=OCF_TXT, anchor="end", opacity=ro))
    if nleft > MAXLEFT:
        out.append(text(x + 68, y + 222 + (MAXLEFT - 1) * ROW_H, f"+{nleft - (MAXLEFT - 1)} more", 22,
                        fill=FAINT, italic=True, opacity=op))
    # mapped context (dim), bottom-anchored
    out.append(line(x + 32, y + h - 96, x + w - 32, y + h - 96, BORDER, 1.5, op * 0.8))
    out.append(text(x + 32, y + h - 66, f"ALSO MAPPED · {len(mapped)}", 17, fill=accent,
                    weight="bold", opacity=op * 0.9, spacing="1"))
    out.append(text(x + 32, y + h - 34, _pack1(mapped), 19, fill=FAINT, family=MONO, opacity=op * 0.9))
    return out, op


# ============================================================================
# Per-object slide
# ============================================================================
def s_obj(t, dur, d):
    o = scene_opacity(t, dur); out = [background()]
    idx = d["idx"]
    ocf_left = d["ocf_left"]
    carta_left = [c for c in d["carta_left"] if not c.strip().startswith("—")]
    ncand = len(ocf_left) + len(carta_left)
    # header
    out.append(text(150, 92, f"EXTENSION CANDIDATES · {idx}/{TOT} · {d['fam'].upper()}", 22,
                    fill=CORE, weight="bold", opacity=appear(t, 0, 0.4), spacing="3"))
    out.append(text(150, 160, d["name"], 50, fill=WHITE, weight="bold", opacity=appear(t, 0.08, 0.5)))
    out.append(text(150, 206, d["role"], 26, fill=MUTE, opacity=appear(t, 0.16, 0.5)))
    if d.get("poly"):
        out.append(text(150, 244, "polymorphic · " + d["poly"], 21, fill=FAINT,
                        italic=True, opacity=appear(t, 0.2, 0.5)))
    bo = appear(t, 0.1, 0.5)
    lbl = f"{ncand} CANDIDATE" + ("" if ncand == 1 else "S")
    out.append(rrect(1470, 128, 300, 54, 27, fill="#1c1706", stroke=CORE, sw=2.5, opacity=bo))
    out.append(text(1620, 164, lbl, 26, fill=CORE_TXT, weight="bold", anchor="middle", opacity=bo))

    py, ph = 300, 566
    lx, lw = 140, 730
    rx, rw = 1050, 730

    # LEFT — OCF-native, no Carta home (keep via extension)
    lrows = [(f, bool(req), True) for f, req, loss in ocf_left]
    lo, lop = _panel(t, lx, py, lw, ph, OCF, OCF_FILL, "OCF has it",
                     "OCF-NATIVE · CARTA CAN'T HOLD IT", d["ocf_mapped"], lrows, 0.35)
    out += lo
    # RIGHT — Carta detail OCF doesn't model (add via extension)
    rrows = [(c, False, False) for c in carta_left]
    ro_, rop = _panel(t, rx, py, rw, ph, CARTA, CARTA_FILL, "Carta has it",
                      "CARTA-ONLY · OCF DOESN'T MODEL IT", d["carta_mapped"], rrows, 0.5)
    out += ro_

    # community-extension target both sides feed
    hx, hy = 960, py + ph / 2
    ho = appear(t, 0.9, 0.5)
    out.append(arrow(lx + lw + 8, hy, hx - 60, hy, OCF, 3, appear(t, 1.0, 0.4)))
    out.append(arrow(rx - 8, hy, hx + 60, hy, CARTA, 3, appear(t, 1.05, 0.4)))
    out.append(circle(hx, hy, 54, CORE_FILL, ho, stroke=CORE, sw=3))
    out.append(rrect(hx - 22, hy - 7, 44, 14, 7, fill=CORE, opacity=ho))   # plus glyph = add/extend
    out.append(rrect(hx - 7, hy - 22, 14, 44, 7, fill=CORE, opacity=ho))
    out.append(text(hx, hy - 80, "candidates for", 19, fill=FAINT, anchor="middle", opacity=ho))
    out.append(text(hx, hy + 90, "COMMUNITY", 19, fill=CORE_TXT, weight="bold", anchor="middle", opacity=ho, spacing="1"))
    out.append(text(hx, hy + 114, "EXTENSION", 19, fill=CORE_TXT, weight="bold", anchor="middle", opacity=ho, spacing="1"))

    out.append(caption(t, d["take"], start=1.2))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def make_obj_scene(d):
    return lambda t, dur: s_obj(t, dur, d)


# ============================================================================
# §0 title / close
# ============================================================================
def s_title(t, dur):
    o = scene_opacity(t, dur); out = [background(brand=True)]
    cx = W / 2
    out.append(octc_mark(cx, 296, 108, WHITE, appear(t, 0.0, 0.7)))
    out.append(text(cx, 486, "OCF CORE", 92, fill=WHITE, weight="bold", anchor="middle",
                    opacity=appear(t, 0.3, 0.7), spacing="8"))
    out.append(text(cx, 556, "THE MAPPING", 38, fill="#d7dcf6", anchor="middle",
                    opacity=appear(t, 0.5, 0.7), spacing="12"))
    sw = ease_out((t - 0.7) / 0.7)
    out.append(line(cx - 250 * sw, 596, cx + 250 * sw, 596, "#ffffff", 4, appear(t, 0.7, 0.3)))
    out.append(multiline(cx, 668, wrap("How OCF folds to Carta — and the properties left behind, object by object, "
                                       "as candidate community extensions", 52),
                         32, 46, fill="#d7dcf6", anchor="middle", opacity=appear(t, 0.9, 0.7)))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def s_close(t, dur):
    o = scene_opacity(t, dur); out = [background(brand=True)]
    cx = W / 2
    out.append(octc_mark(cx, 248, 84, WHITE, appear(t, 0.0, 0.7)))
    out.append(text(cx, 452, "The candidates are on the table.", 66, fill=WHITE, weight="bold",
                    anchor="middle", opacity=appear(t, 0.3, 0.7)))
    out.append(line(cx - 300, 500, cx + 300, 500, "#ffffff", 4, appear(t, 0.6, 0.4)))
    out.append(multiline(cx, 576, wrap("Every property the mapping leaves behind — OCF-native or Carta-only — "
                                       "is a candidate OCF community extension.", 54),
                         32, 46, fill="#d7dcf6", anchor="middle", opacity=appear(t, 0.8, 0.7)))
    out.append(text(cx, 752, "OCF     +     CARTA     →     COMMUNITY EXTENSIONS", 30, fill="#eef1fb",
                    weight="bold", anchor="middle", opacity=appear(t, 1.4, 0.6), spacing="2"))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


# ============================================================================
# §1 philosophy
# ============================================================================
def s_derive(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "Derive, don't declare", "one hand-authored layer — everything else is a computed view"))
    stages = [("~100 .mapping.md", "hand-authored", OCF),
              ("Validate", "the corpus can't lie", CARTA),
              ("Project", "derive OCF Core", CORE),
              ("Report", "coverage & loss", "#8f8bff")]
    n = len(stages); bw = 356; gap = 66; total = n * bw + (n - 1) * gap; sx = (W - total) / 2; y = 392; bh = 176
    for i, (tt, sub, co) in enumerate(stages):
        ro = appear(t, 0.5 + i * 0.3, 0.5); x = sx + i * (bw + gap)
        out.append(rrect(x, y, bw, bh, 20, fill=PANEL, stroke=co, sw=2.5, opacity=ro))
        out.append(rrect(x, y, bw, 10, 4, fill=co, opacity=ro))
        out.append(text(x + bw / 2, y + 82, tt, 31, fill=WHITE, weight="bold", anchor="middle", opacity=ro))
        out.append(text(x + bw / 2, y + 124, sub, 23, fill=co, anchor="middle", opacity=ro))
        if i < n - 1:
            ax = x + bw + 8
            out.append(arrow(ax, y + bh / 2, ax + gap - 16, y + bh / 2, MUTE, 3, appear(t, 0.75 + i * 0.3, 0.4)))
    out.append(text(W / 2, y + bh + 96, "Change what's in Core? Sharpen a mapping and rebuild — never edit the output.",
                    28, fill=WHITE, weight="bold", anchor="middle", opacity=appear(t, 1.9, 0.6)))
    out.append(caption(t, "The mapping corpus is the one authored artifact; the Core standard, every loss report, "
                          "and this deck are computed from it.", start=2.2))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def s_rule(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "The rule applied to every field", "value-loss is fine; existence-loss is not"))
    cx = W / 2; x = cx - 620; y = 300; lh = 118
    rules = [(OCF, "check", "Lands cleanly in Carta.", "direct or type-widening → strict Core."),
             (CORE, "warn", "Narrows but still lands.", "list→one, enum→bucket → rich Core (lossy-home)."),
             (LOST, "cross", "No Carta home at all.", "dropped — and logged as an extension candidate.")]
    for i, (co, g, main, sub) in enumerate(rules):
        ro = appear(t, 0.6 + i * 0.4, 0.5); ry = y + i * lh
        out.append(rrect(x, ry, 1240, 96, 18, fill="#11161d", stroke=BORDER, sw=1.5, opacity=ro))
        gi = x + 58
        if g == "check": out.append(check(gi, ry + 48, 28, co, ro))
        elif g == "cross": out.append(cross(gi, ry + 48, 28, co, ro))
        else: out.append(warn(gi, ry + 48, 28, co, ro))
        out.append(text(x + 120, ry + 44, main, 34, fill=WHITE, weight="bold", opacity=ro))
        out.append(text(x + 120, ry + 80, sub, 25, fill=MUTE, opacity=ro))
    out.append(text(cx, 782, "An object joins Core only if at least one real payload field lands.", 32,
                    fill=CORE_TXT, anchor="middle", weight="bold", opacity=appear(t, 2.2, 0.6)))
    out.append(caption(t, "Coarsening a value keeps a field in; dropping a whole element, entity or relationship forces it out.",
                       start=2.6))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def s_strictrich(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "Two readings of one ledger", "strict keeps only what lands cleanly; rich also keeps lossy-home fields"))
    cxc, cyc = 610, 528
    oa = appear(t, 0.5, 0.6); ra = appear(t, 0.9, 0.6); sa = appear(t, 1.3, 0.6)
    out.append(f'<circle cx="{cxc}" cy="{cyc}" r="250" fill="{LOST}" opacity="{oa*0.10:.3f}" stroke="{LOST}" stroke-width="2"/>')
    out.append(f'<circle cx="{cxc}" cy="{cyc}" r="176" fill="{CORE}" opacity="{ra*0.16:.3f}" stroke="{CORE}" stroke-width="2.5"/>')
    out.append(f'<circle cx="{cxc}" cy="{cyc}" r="104" fill="{OCF}" opacity="{sa*0.30:.3f}" stroke="{OCF}" stroke-width="3"/>')
    out.append(text(cxc, cyc - 4, "STRICT", 34, fill=OCF_TXT, weight="bold", anchor="middle", opacity=sa))
    out.append(text(cxc, cyc + 32, "Core", 24, fill=OCF_TXT, anchor="middle", opacity=sa))
    out.append(text(cxc, cyc - 140, "RICH adds lossy-home", 21, fill=CORE_TXT, anchor="middle", opacity=ra))
    out.append(text(cxc, cyc - 216, "no Carta home", 21, fill=LOST, anchor="middle", opacity=oa))
    kx, ky = 1030, 340
    keys = [(OCF, "Strict Core", "lands cleanly in Carta — lossless", 1.5),
            (CORE, "Rich Core", "also keeps fields that land, but lossily", 1.8),
            (LOST, "No home", "Carta can't hold it — an extension candidate", 2.1)]
    for i, (co, h, sub, st) in enumerate(keys):
        ro = appear(t, st, 0.5); yy = ky + i * 116
        out.append(circle(kx + 14, yy, 11, co, ro))
        out.append(text(kx + 40, yy + 9, h, 30, fill=WHITE, weight="bold", opacity=ro))
        out.append(text(kx + 40, yy + 46, sub, 24, fill=MUTE, opacity=ro))
    out.append(text(kx, ky + 3 * 116 + 2, "strict ⊂ rich ⊂ OCF", 24, fill=FAINT, weight="bold", opacity=appear(t, 2.5, 0.5)))
    out.append(caption(t, "This deck reads the rich hub: what lands (even lossily) vs. what's left behind entirely.", start=2.7))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


# ============================================================================
# §2 convention
# ============================================================================
def s_convention(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "The convention — one small file per object", "plain YAML: each OCF field gets a kind and a target pointer"))
    fx, fy, fw = 140, 300, 860
    rows = [("name", "rename", "→ fullName", OCF),
            ("stakeholder_type", "enum-remap", "→ entityType", CARTA),
            ("addresses", "existence-loss", "→ address", AMBER),
            ("tax_ids", "unmappable", "— no home", LOST)]
    fh = 92 + len(rows) * 72 + 32; fo = appear(t, 0.4, 0.5)
    out.append(rrect(fx, fy, fw, fh, 16, fill=PANEL, stroke=BORDER, sw=2, opacity=fo))
    out.append(rrect(fx, fy, fw, 60, 16, fill="#1e2246", opacity=fo))
    out.append(rrect(fx, fy + 44, fw, 16, 0, fill="#1e2246", opacity=fo))
    out.append(circle(fx + 30, fy + 30, 8, CORE, fo))
    out.append(text(fx + 52, fy + 40, "Stakeholder.mapping.md", 26, fill=WHITE, weight="bold", family=MONO, opacity=fo))
    for i, (field, kind, tgt, co) in enumerate(rows):
        ro = appear(t, 0.8 + i * 0.18, 0.45); ly = fy + 92 + i * 72
        out.append(text(fx + 34, ly + 34, field, 25, fill="#cdd3f0", family=MONO, opacity=ro))
        pw = len(kind) * 13 + 54; px = fx + 400
        out.append(rrect(px, ly + 10, pw, 44, 22, fill="none", stroke=co, sw=2, opacity=ro))
        out.append(circle(px + 22, ly + 32, 6, co, ro))
        out.append(text(px + 38, ly + 40, kind, 22, fill=co, opacity=ro))
        out.append(text(px + pw + 26, ly + 40, tgt, 23, fill=MUTE, family=MONO, opacity=ro))
    rx = 1110
    out.append(text(rx, 338, "THE VERBS", 22, fill=FAINT, weight="bold", opacity=appear(t, 1.6, 0.5), spacing="3"))
    verbs = [("rename", "move the value verbatim"),
             ("enum-remap", "rewrite value-by-value (may coarsen)"),
             ("split / combine", "fan out / derive from several"),
             ("composite", "one event → an ordered set of Carta txns"),
             ("unmappable", "no home — record a typed reason")]
    for i, (k, desc) in enumerate(verbs):
        ro = appear(t, 1.8 + i * 0.12, 0.45); vy = 392 + i * 82
        out.append(text(rx, vy, k,27, fill=WHITE, weight="bold", family=MONO, opacity=ro))
        out.append(text(rx, vy + 32, desc, 22, fill=MUTE, opacity=ro))
    out.append(caption(t, "Nothing is silent: every source property either lands somewhere or is explicitly unmappable "
                          "with a typed reason. The mapping is the loss ledger.", start=2.6))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def _topcard(out, t, x, y, w, h, co, tag, start):
    ro = appear(t, start, 0.5)
    out.append(rrect(x, y, w, h, 20, fill=PANEL, stroke=co, sw=2.5, opacity=ro))
    out.append(rrect(x, y, w, 10, 4, fill=co, opacity=ro))
    out.append(text(x + 30, y + 52, tag, 24, fill=co, weight="bold", opacity=ro, spacing="1"))
    return ro


def s_buckets(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "Types: the three-bucket test", "where a reusable OCF type maps depends on Carta's shape"))
    cards = [(OCF, "1 · TYPE-TO-TYPE", "Carta has an analogous type.",
              ["Monetary → Money", "Address → StakeholderAddress"], "map field-for-field"),
             (CARTA, "2 · INLINED PER OBJECT", "No single home — Carta inlines it across many objects.",
              ["Email → Stakeholder.email,", "PointOfContact.userEmail"], "route per consuming object"),
             (LOST, "3 · ABSENT", "Carta lacks the concept entirely.",
              ["Phone · TaxID · Md5"], "unmappable everywhere")]
    cw = 524; gap = 40; total = 3 * cw + 2 * gap; sx = (W - total) / 2; y = 300; ch = 452
    for i, (co, tag, main, ex, foot) in enumerate(cards):
        x = sx + i * (cw + gap); ro = _topcard(out, t, x, y, cw, ch, co, tag, 0.5 + i * 0.3)
        for j, ln in enumerate(wrap(main, 30)):
            out.append(text(x + 30, y + 116 + j * 38, ln, 28, fill=WHITE, weight="bold", opacity=ro))
        for j, ln in enumerate(ex):
            out.append(text(x + 30, y + 250 + j * 38, ln, 22, fill=MUTE, family=MONO, opacity=ro))
        out.append(text(x + 30, y + ch - 34, foot, 23, fill=co, italic=True, opacity=ro))
    out.append(caption(t, "The discriminator is cardinality of homes: one unambiguous home → bucket 1; many unrelated homes → bucket 2.",
                       start=2.2))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def s_routing(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "Two shapes for the hard cases", "when one OCF object doesn't line up 1:1 with Carta"))
    # LEFT — polymorphic
    lx = 300; ly = 330; lo = appear(t, 0.5, 0.5)
    out.append(text(lx, ly - 12, "POLYMORPHIC", 26, fill=CARTA, weight="bold", opacity=lo, spacing="2"))
    out.append(circle(lx, ly + 150, 30, OCF, lo, stroke=BG, sw=3))
    out.append(text(lx, ly + 158, "1", 26, fill=BG, weight="bold", anchor="middle", opacity=lo))
    fams = ["Option", "RSU", "SAR"]
    for i, f in enumerate(fams):
        ro = appear(t, 0.8 + i * 0.15, 0.45); fy = ly + 60 + i * 90
        out.append(arrow(lx + 34, ly + 150, lx + 150, fy + 28, CARTA, 2.5, ro))
        out.append(rrect(lx + 156, fy, 260, 56, 12, fill=PANEL, stroke=CARTA, sw=2, opacity=ro))
        out.append(text(lx + 176, fy + 37, f, 24, fill=WHITE, opacity=ro))
    out.append(text(lx - 20, ly + 340, "a discriminator picks ONE family", 23, fill=CARTA_TXT, opacity=appear(t, 1.4, 0.5)))
    out.append(text(lx - 20, ly + 374, "(variants mutually exclusive)", 21, fill=MUTE, opacity=appear(t, 1.5, 0.5)))
    # RIGHT — composite
    rx = 1180; ro0 = appear(t, 1.7, 0.5)
    out.append(text(rx, ly - 12, "COMPOSITE", 26, fill=OCF, weight="bold", opacity=ro0, spacing="2"))
    out.append(circle(rx, ly + 150, 30, OCF, ro0, stroke=BG, sw=3))
    out.append(text(rx - 70, ly + 250, "StockTransfer", 24, fill=WHITE, weight="bold", anchor="middle", opacity=ro0))
    steps = [("cancel", "old shares"), ("issue", "new owner")]
    for i, (s, sub) in enumerate(steps):
        ro = appear(t, 2.0 + i * 0.2, 0.45); sy = ly + 90 + i * 96
        out.append(arrow(rx + 34, ly + 150, rx + 150, sy + 30, OCF, 2.5, ro))
        out.append(rrect(rx + 156, sy, 300, 62, 12, fill=PANEL, stroke=OCF, sw=2, opacity=ro))
        out.append(text(rx + 176, sy + 30, f"{i+1}. {s}", 24, fill=WHITE, weight="bold", opacity=ro))
        out.append(text(rx + 176, sy + 52, sub, 19, fill=MUTE, opacity=ro))
    out.append(text(rx - 20, ly + 340, "one event → an ORDERED set", 23, fill=OCF_TXT, opacity=appear(t, 2.5, 0.5)))
    out.append(text(rx - 20, ly + 374, "(all steps emitted)", 21, fill=MUTE, opacity=appear(t, 2.6, 0.5)))
    out.append(caption(t, "Polymorphic = pick one of several Carta families; composite = fold one event into an ordered set of Carta transactions.",
                       start=2.9))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


# ============================================================================
# §3 gaps
# ============================================================================
def s_losstypes(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "Four ways a property is left behind", "how the classifier types every field that falls out of Core"))
    cards = [(LOST, "NO DESTINATION", "Carta has no field for it at all.", "votes_per_share, tax_ids"),
             (AMBER, "EXISTENCE-LOSS", "A whole element/relationship would drop.", "addresses[] → one address"),
             (CARTA, "HEURISTIC", "Only a non-deterministic transform reaches it.", "reverse-edge lineage"),
             ("#8f8bff", "PARTIAL", "A lookup with no answer for some legal input.", "vesting period → (no value)")]
    cw = 400; gap = 30; total = 4 * cw + 3 * gap; sx = (W - total) / 2; y = 316; ch = 372
    for i, (co, tag, main, ex) in enumerate(cards):
        x = sx + i * (cw + gap); ro = _topcard(out, t, x, y, cw, ch, co, tag, 0.5 + i * 0.22)
        for j, ln in enumerate(wrap(main, 26)):
            out.append(text(x + 30, y + 120 + j * 38, ln, 26, fill=WHITE, weight="bold", opacity=ro))
        out.append(text(x + 30, y + ch - 74, "e.g.", 20, fill=co, weight="bold", opacity=ro))
        for j, ln in enumerate(wrap(ex, 30)):
            out.append(text(x + 30, y + ch - 42 + j * 30, ln, 21, fill=MUTE, family=MONO, opacity=ro))
    out.append(caption(t, "Only 'no-destination' and 'existence-loss' are true left-behind here; all are recorded straight off the mapping.",
                       start=1.9))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def s_ocfgaps(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "The marquee OCF gaps", "generally-applicable Carta concepts OCF v1 lacks — the biggest extension candidates"))
    gaps = [(CORE, "Phantom stock", "a whole instrument family OCF doesn't model"),
            (CORE, "Profits interests (PIU)", "issuance / cancellation + threshold detail"),
            (CARTA, "Option-exercise cash & tax", "money movement + tax-withholding line items"),
            (AMBER, "Vesting acceleration", "accelerated-vesting events"),
            (OCF, "Convertible interest terms", "rate / accrual / compounding (deferred mapping)")]
    cw = 540; gap = 40; y0 = 306; ch = 150
    pos = [(0, 0), (1, 0), (2, 0), (0, 1), (1, 1)]     # 3 on top, 2 on bottom
    row0 = (W - (3 * cw + 2 * gap)) / 2
    row1 = (W - (2 * cw + gap)) / 2
    for i, (co, title, sub) in enumerate(gaps):
        c, r = pos[i]; ro = appear(t, 0.5 + i * 0.22, 0.5)
        x = (row0 if r == 0 else row1) + c * (cw + gap); y = y0 + r * (ch + 40)
        out.append(rrect(x, y, cw, ch, 18, fill=PANEL, stroke=co, sw=2.5, opacity=ro))
        out.append(rrect(x, y, 10, ch, 4, fill=co, opacity=ro))
        out.append(text(x + 40, y + 62, title, 30, fill=WHITE, weight="bold", opacity=ro))
        for j, ln in enumerate(wrap(sub, 42)):
            out.append(text(x + 40, y + 100 + j * 32, ln, 22, fill=MUTE, opacity=ro))
    out.append(caption(t, "These are R5 'gaps to discuss' — never smuggled into Core, but exactly the candidates for OCF community extensions.",
                       start=1.9))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


# ============================================================================
# §4 matrix overview
# ============================================================================
def s_matrix(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "Every Core object — what lands vs. what's left behind",
                       "gold = extension candidates (OCF-side ▸ Carta-side)"))
    half = (len(OBJECTS) + 1) // 2
    y0 = 288; rh = 51
    cols = [(140, 0, half), (1000, half, len(OBJECTS))]
    for cx0, lo, hi in cols:
        out.append(text(cx0, y0 - 18, "OBJECT", 17, fill=FAINT, weight="bold", opacity=appear(t, 0.2, 0.4), spacing="1"))
        out.append(text(cx0 + 690, y0 - 18, "OCF", 17, fill=CORE_TXT, weight="bold", anchor="middle", opacity=appear(t, 0.2, 0.4)))
        out.append(text(cx0 + 760, y0 - 18, "CAR", 17, fill=CORE_TXT, weight="bold", anchor="middle", opacity=appear(t, 0.2, 0.4)))
        for k in range(lo, hi):
            d = OBJECTS[k]; row = k - lo; y = y0 + row * rh; ro = appear(t, 0.4 + (k) * 0.02, 0.4)
            nmap = len(d["ocf_mapped"]); nleft = len(d["ocf_left"])
            ncar = len([c for c in d["carta_left"] if not c.strip().startswith("—")])
            nm = d["name"]; nm = nm if len(nm) <= 30 else nm[:29] + "…"
            out.append(text(cx0, y + 20, nm, 20, fill="#d7ddf5", opacity=ro))
            bx, bw = cx0 + 500, 150; tot = max(1, nmap + nleft); mw = bw * nmap / tot
            out.append(rrect(bx, y + 6, bw, 12, 6, fill="#0e1330", opacity=ro))
            out.append(rrect(bx, y + 6, max(6, mw), 12, 6, fill=OCF, opacity=ro))
            if nleft:
                out.append(rrect(bx + mw, y + 6, max(6, bw - mw), 12, 6, fill=CORE, opacity=ro))
            out.append(text(cx0 + 690, y + 20, str(nleft), 22, fill=(CORE_TXT if nleft else FAINT),
                            weight="bold", anchor="middle", opacity=ro))
            out.append(text(cx0 + 760, y + 20, str(ncar), 22, fill=(CORE_TXT if ncar else FAINT),
                            weight="bold", anchor="middle", opacity=ro))
    out.append(caption(t, "Each bar: green = lands in Carta, gold = left behind. The next 24 slides walk these object by object.",
                       start=1.6))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


# ============================================================================
# §2.5 the schema mechanism — OCF is JSON Schema, Carta is a shape, and OCF
# Core is a validation toggle (additionalProperties) that admits extensions.
# ============================================================================
def _codeline(out, x, y, raw, ro, size=22, hi=False, hicol=CORE_TXT):
    if hi:
        out.append(rrect(x - 10, y - size + 4, 560, size + 12, 6, fill=hicol, opacity=ro * 0.14))
        out.append(text(x, y, raw, size, fill=hicol, family=MONO, weight="bold", opacity=ro)); return
    q1 = raw.find('"'); q2 = raw.find('"', q1 + 1) if q1 >= 0 else -1
    if q1 >= 0 and q2 > 0 and raw[q2 + 1:q2 + 2] == ':':
        head = raw[:q2 + 1]; rest = raw[q2 + 1:]
        out.append(text(x, y, head, size, fill="#9cc0ff", family=MONO, opacity=ro))
        out.append(text(x + len(head) * size * 0.6, y, rest, size, fill="#c9d2f5", family=MONO, opacity=ro))
    else:
        out.append(text(x, y, raw, size, fill="#7f88b0", family=MONO, opacity=ro))


def _codecard(out, t, x, y, w, h, title, lines, start, hi=None, hicol=CORE_TXT, size=22, lh=33):
    op = appear(t, start, 0.5)
    out.append(rrect(x, y, w, h, 16, fill="#0b0e26", stroke=BORDER, sw=2, opacity=op))
    out.append(rrect(x, y, w, 52, 16, fill="#171b3a", opacity=op))
    out.append(rrect(x, y + 36, w, 16, 0, fill="#171b3a", opacity=op))
    for i, co in enumerate(["#ff6b6b", "#ffb02e", "#34c46f"]):
        out.append(circle(x + 28 + i * 26, y + 26, 7, co, op))
    out.append(text(x + 116, y + 34, title, 21, fill=MUTE, family=MONO, opacity=op))
    for i, ln in enumerate(lines):
        _codeline(out, x + 30, y + 88 + i * lh, ln, appear(t, start + 0.2 + i * 0.02, 0.4),
                  size=size, hi=(i == hi), hicol=hicol)
    return op


def s_ocfschema(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "OCF objects are JSON Schema", "every object is a strict, closed shape — draft-07"))
    lines = ['{', '  "$schema": "json-schema.org/draft-07",', '  "title": "Object - Stock Class",',
             '  "type": "object",', '  "properties": {', '    "name":            { "type": "string" },',
             '    "class_type":      { "$ref": "StockClassType" },', '    "par_value":       { "$ref": "Numeric" },',
             '    "votes_per_share": { "$ref": "Numeric" },', '    ...', '  },',
             '  "required": [ "name", "class_type", ... ],', '  "additionalProperties": false', '}']
    _codecard(out, t, 130, 268, 1080, 620, "StockClass.schema.json", lines, 0.4, hi=12, hicol=LOST)
    rx = 1268; ro = appear(t, 1.6, 0.6)
    out.append(rrect(rx, 300, 520, 300, 18, fill="#2a0f16", stroke=LOST, sw=2.5, opacity=ro))
    out.append(text(rx + 34, 360, "additionalProperties", 26, fill=LOST, weight="bold", family=MONO, opacity=ro))
    out.append(text(rx + 34, 406, ": false", 26, fill=WHITE, weight="bold", family=MONO, opacity=ro))
    for j, ln in enumerate(wrap("A closed shape — any property not declared here fails validation.", 34)):
        out.append(text(rx + 34, 470 + j * 36, ln, 24, fill="#f0dada", opacity=ro))
    out.append(text(rx, 690, "OCF defines ~140 objects & types", 24, fill=MUTE, opacity=appear(t, 2.0, 0.5)))
    out.append(text(rx, 726, "exactly this way — strict by default.", 24, fill=MUTE, opacity=appear(t, 2.1, 0.5)))
    out.append(caption(t, "An OCF object is a JSON-Schema definition with a fixed property set and additionalProperties:false — nothing extra allowed.", start=2.4))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def s_cartaobj(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "A Carta object", "the same concept — Carta's own shape and field names"))
    lines = ['"ShareClass": {', '  "type": "object",', '  "properties": {', '    "id":                   { "type": "string" },',
             '    "name":                 { "type": "string" },', '    "prefix":               { "type": "string" },',
             '    "type":                 { "$ref": "ShareClassType" },', '    "authorizedShareCount": { "$ref": "Decimal" },',
             '    "parValue":             { "$ref": "Money" },', '    "seniority":            { "type": "integer" },',
             '    "pariPassu":            { ... },', '    "preferredShareClassDetails": { ... }', '  }', '}']
    _codecard(out, t, 130, 268, 1080, 620, "Carta.schema.json  ›  $defs/ShareClass", lines, 0.4, size=22)
    rx = 1268; ro = appear(t, 1.6, 0.6)
    out.append(rrect(rx, 300, 520, 340, 18, fill="#122a52", stroke=CARTA, sw=2.5, opacity=ro))
    out.append(text(rx + 34, 356, "Same concept,", 27, fill=CARTA_TXT, weight="bold", opacity=ro))
    out.append(text(rx + 34, 392, "different shape.", 27, fill=CARTA_TXT, weight="bold", opacity=ro))
    for j, ln in enumerate(wrap("Its own names (parValue, authorizedShareCount), fewer fields — no votes, no approval dates.", 33)):
        out.append(text(rx + 34, 452 + j * 34, ln, 23, fill="#cdd6f2", opacity=ro))
    out.append(text(rx, 706, "The mapping is what bridges", 24, fill=MUTE, opacity=appear(t, 2.0, 0.5)))
    out.append(text(rx, 742, "these two shapes, field by field.", 24, fill=MUTE, opacity=appear(t, 2.1, 0.5)))
    out.append(caption(t, "Carta models the same StockClass concept its own way — different field names, a different (smaller) property set.", start=2.4))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def s_extschema(t, dur):
    o = scene_opacity(t, dur); out = [background()]
    out.append(heading(t, "Extensions are named, not open-ended",
                       "a new OCF-Extended-… schema adds exactly the catalogued properties — still strict"))
    core = ['{', '  "$id": ".../OCFCore/StockClass",', '  "properties": {',
            '    "name":       { "type": "string" },', '    "class_type": { "$ref": "..." },',
            '    "par_value":  { "$ref": "Numeric" }', '  },', '  "additionalProperties": false', '}']
    _codecard(out, t, 96, 300, 800, 452, "core / strict subset", core, 0.4, hi=1, hicol=OCF, size=21, lh=32)
    out.append(text(116, 794, "votes_per_share  →  not in Core", 22, fill=MUTE, family=MONO, opacity=appear(t, 1.0, 0.5)))
    ext = ['{', '  "$id": ".../OCF-Extended-StockClass",', '  "allOf": [ { "$ref": ".../OCFCore/StockClass" } ],',
           '  "properties": {', '    "votes_per_share": { "$ref": "Numeric" },',
           '    "board_approval_date": { "$ref": "Date" },', '    "stockholder_approval_date": { "$ref": "Date" }',
           '  },', '  "additionalProperties": false', '}']
    _codecard(out, t, 1024, 300, 800, 452, "community extension", ext, 0.9, hi=1, hicol=CORE, size=20, lh=31)
    out.append(text(1044, 794, "only the catalogued extension props — nothing else", 21, fill=CORE_TXT, family=MONO, opacity=appear(t, 1.5, 0.5)))
    # "extends (allOf)" arrow between the cards
    cy = 500; to = appear(t, 1.15, 0.5)
    out.append(arrow(904, cy, 1016, cy, CORE, 3.5, to))
    out.append(text(960, cy - 22, "extends", 20, fill=CORE_TXT, weight="bold", anchor="middle", opacity=to))
    out.append(text(960, cy + 30, "allOf", 18, fill=FAINT, anchor="middle", family=MONO, opacity=to))
    out.append(caption(t, "We don't blanket-allow properties. Each extension is its own OCF-Extended-… schema that allOf-references Core and declares exactly the catalogued properties — additionalProperties stays false.", start=1.9))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


# ============================================================================
# Full worked examples — the whole object, what lands in Carta, and a
# hypothetical community-extension object carrying the dropped properties.
#   lands: (ocf_field, carta_field, lossy?)   dropped: OCF fields with no home
#   ext_extra: detail the extension would also restore from narrowed fields
# ============================================================================
EXAMPLES = [
  dict(name="Issuer", carta="Issuer", role="The company — almost nothing Carta can hold",
       lands=[("legal_name", "legalName", 0), ("dba", "doingBusinessAsName", 0)],
       dropped=["formation_date", "country_of_formation", "country_subdivision_of_formation",
                "country_subdivision_name_of_formation", "address", "email", "phone",
                "tax_ids", "initial_shares_authorized"],
       take="Carta keeps only the two names; a community extension would carry the entire formation & contact profile."),
  dict(name="Stakeholder", carta="Stakeholder", role="A person — most fields land, but detail narrows",
       lands=[("name", "fullName", 1), ("stakeholder_type", "entityType", 0),
              ("issuer_assigned_id", "employeeId", 0), ("current_relationship", "relationship", 0),
              ("current_relationships", "relationship", 1), ("addresses", "address", 1),
              ("primary_contact", "email", 1), ("contact_info", "email", 1)],
       dropped=["current_status", "tax_ids"],
       ext_extra=["structured name (parts)", "full address list", "all contact methods"],
       take="Most fields land, but name/addresses/contacts flatten to one — an extension restores the structured detail, plus tax IDs & status."),
  dict(name="StockClass", carta="ShareClass", role="A share class — economics land, governance drops",
       lands=[("name", "name", 0), ("class_type", "type", 0), ("default_id_prefix", "prefix", 0),
              ("initial_shares_authorized", "authorizedShareCount", 0), ("par_value", "parValue", 0),
              ("price_per_share", "originalIssuePrice", 0), ("seniority", "seniority", 0),
              ("conversion_rights", "conversionRatio", 1), ("liquidation_preference_multiple", "multiplier", 0),
              ("participation_cap_multiple", "participationCap", 0)],
       dropped=["votes_per_share", "board_approval_date", "stockholder_approval_date"],
       take="The economics fold cleanly; voting power and approval provenance have no Carta home — prime extension fields."),
]


def _fieldcol(out, items, x, y, w, rpc, ro, rh=42, fsize=23):
    """items: (label, dotcolor, mono) rendered in ceil(n/rpc) columns within width w."""
    n = len(items); ncol = max(1, (n + rpc - 1) // rpc); cw = w / ncol
    for i, (lab, dc, mono) in enumerate(items):
        c = i // rpc; r = i % rpc; ix = x + c * cw; iy = y + r * rh
        maxch = int(cw / (fsize * (0.6 if mono else 0.52))) - 3
        s = lab if len(lab) <= maxch else lab[:maxch - 1] + "…"
        out.append(circle(ix + 8, iy - 7, 6, dc, ro))
        out.append(text(ix + 26, iy, s, fsize, fill="#d7ddf5", family=(MONO if mono else FONT), opacity=ro))


def s_example(t, dur, d):
    o = scene_opacity(t, dur); out = [background()]
    out.append(text(150, 92, f"FULL EXAMPLE · {d['exidx']}/3", 22, fill=CORE, weight="bold",
                    opacity=appear(t, 0, 0.4), spacing="3"))
    out.append(text(150, 160, d["name"], 50, fill=WHITE, weight="bold", opacity=appear(t, 0.08, 0.5)))
    out.append(text(150, 206, d["role"], 26, fill=MUTE, opacity=appear(t, 0.16, 0.5)))
    # L — the full OCF object
    lx, ly, lw, lh = 90, 276, 600, 626; fo = appear(t, 0.3, 0.5)
    out.append(rrect(lx, ly, lw, lh, 20, fill=PANEL, stroke="#5b6299", sw=2, opacity=fo))
    out.append(rrect(lx, ly, lw, 96, 20, fill="#20233f", opacity=fo))
    out.append(rrect(lx, ly + 76, lw, 20, 0, fill="#20233f", opacity=fo))
    out.append(text(lx + 28, ly + 40, "THE FULL OCF OBJECT", 22, fill=WHITE, weight="bold", opacity=fo, spacing="1"))
    for j, (lab, co, tx) in enumerate([("lands", OCF, lx + 28), ("narrows", AMBER, lx + 150), ("dropped", CORE, lx + 300)]):
        out.append(circle(tx + 6, ly + 70, 6, co, fo)); out.append(text(tx + 22, ly + 76, lab, 17, fill=MUTE, opacity=fo))
    full = [(f, (AMBER if lossy else OCF), True) for f, _, lossy in d["lands"]] + [(f, CORE, True) for f in d["dropped"]]
    for i, (lab, dc, mono) in enumerate(full):
        ry = ly + 132 + i * 36; ro = appear(t, 0.5 + i * 0.03, 0.4)
        s = lab if len(lab) <= 44 else lab[:43] + "…"
        out.append(circle(lx + 32, ry - 7, 6, dc, ro))
        out.append(text(lx + 52, ry, s, 22, fill="#d7ddf5", family=MONO, opacity=ro))
    # M — lands in Carta
    mx, my, mw, mh = 770, 276, 1060, 288; mo = appear(t, 0.7, 0.5)
    out.append(rrect(mx, my, mw, mh, 18, fill=PANEL, stroke=CARTA, sw=2.5, opacity=mo))
    out.append(text(mx + 28, my + 48, "① LANDS IN CARTA", 25, fill=CARTA, weight="bold", opacity=mo, spacing="1"))
    out.append(text(mx + mw - 28, my + 48, d["carta"], 23, fill=CARTA_TXT, anchor="end", opacity=mo))
    litems = [(cf, (AMBER if lossy else OCF), False) for _, cf, lossy in d["lands"]]
    _fieldcol(out, litems, mx + 32, my + 100, mw - 64, 5, appear(t, 0.9, 0.5))
    # R — proposed extension
    rx, rY, rw, rh = 770, 598, 1060, 288; reo = appear(t, 1.1, 0.5)
    out.append(rrect(rx, rY, rw, rh, 18, fill="#1c1706", stroke=CORE, sw=2.5, opacity=reo))
    out.append(text(rx + 28, rY + 48, "② PROPOSED EXTENSION", 25, fill=CORE_TXT, weight="bold", opacity=reo, spacing="1"))
    out.append(text(rx + rw - 28, rY + 48, "OCF-Extended-" + d["name"], 22, fill=CORE_TXT, anchor="end", family=MONO, opacity=reo))
    ritems = [(f, CORE, True) for f in d["dropped"]] + [(e, CORE, False) for e in d.get("ext_extra", [])]
    _fieldcol(out, ritems, rx + 32, rY + 100, rw - 64, 5, appear(t, 1.3, 0.5))
    # fork arrows: full object → Carta (what survives) and → extension (the rest)
    out.append(arrow(lx + lw + 6, ly + 220, mx - 6, my + mh / 2, CARTA, 3, appear(t, 0.8, 0.4)))
    out.append(arrow(lx + lw + 6, ly + 430, rx - 6, rY + mh / 2, CORE, 3, appear(t, 1.2, 0.4)))
    out.append(text((lx + lw + mx) / 2, my + mh / 2 - 60, "folds", 19, fill=CARTA_TXT, anchor="middle", opacity=appear(t, 0.9, 0.4)))
    out.append(text((lx + lw + rx) / 2, rY + mh / 2 + 74, "extend", 19, fill=CORE_TXT, anchor="middle", opacity=appear(t, 1.3, 0.4)))
    out.append(caption(t, d["take"], start=1.6))
    return f'<g opacity="{o:.3f}">' + "".join(out) + '</g>'


def make_example_scene(d):
    return lambda t, dur: s_example(t, dur, d)


# ---- timeline --------------------------------------------------------------
_obj_scenes = []
for _i, _d in enumerate(OBJECTS, 1):
    _d.update(COMPUTED[_d["name"]])
    _d["idx"] = _i
    _obj_scenes.append((f"obj_{_d['name'].lower()}", make_obj_scene(_d), 11.0))

_example_scenes = []
for _i, _e in enumerate(EXAMPLES, 1):
    _e["exidx"] = _i
    _example_scenes.append((f"example_{_e['name'].lower()}", make_example_scene(_e), 13.0))

SCENES = [
    ("title",       s_title,       6.0),
    ("derive",      s_derive,      12.0),
    ("rule",        s_rule,        12.0),
    ("strictrich",  s_strictrich,  12.0),
    ("convention",  s_convention,  13.0),
    ("buckets",     s_buckets,     12.0),
    ("routing",     s_routing,     12.0),
    ("ocfschema",   s_ocfschema,   12.0),
    ("cartaobj",    s_cartaobj,    12.0),
    ("extschema",   s_extschema,   13.0),
    ("losstypes",   s_losstypes,   12.0),
    ("ocfgaps",     s_ocfgaps,     12.0),
    ("matrix",      s_matrix,      13.0),
] + _example_scenes + _obj_scenes + [
    ("close",       s_close,       7.0),
]


# ---- main (mirrors gen.py) -------------------------------------------------
def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "manifest"
    if mode == "manifest":
        tacc = 0
        for nm, fn, dur in SCENES:
            print(f"{nm:34s} start={tacc:6.1f}s  dur={dur:5.1f}s"); tacc += dur
        print(f"{'TOTAL':34s} {tacc:6.1f}s"); return
    outdir = sys.argv[2]; os.makedirs(outdir, exist_ok=True)
    if mode in ("stills", "plates"):
        if mode == "plates":
            gen.TEXT_ON = False
        for nm, fn, dur in SCENES:
            open(os.path.join(outdir, f"{nm}.svg"), "w").write(doc(fn(dur * 0.72, dur)))
            print("wrote", nm)
        return
    if mode == "all":
        fps = gen.FPS
        if "--fps" in sys.argv: fps = int(sys.argv[sys.argv.index("--fps") + 1])
        idx = 0
        for nm, fn, dur in SCENES:
            for f in range(int(round(dur * fps))):
                open(os.path.join(outdir, f"f{idx:05d}.svg"), "w").write(doc(fn(f / fps, dur)))
                idx += 1
        print(f"wrote {idx} frames at {fps}fps"); return


if __name__ == "__main__":
    main()
