---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/ValuationBasedConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Valuation-Based Conversion Mechanism
ocf_kind: type
required_fields:
  - type
  - valuation_type
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Valuation-Based Conversion Mechanism → Carta

> Sets forth inputs and conversion mechanism based on valuations

## OCF schema

Source: [`ValuationBasedConversionMechanism.schema.json`](./ValuationBasedConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/ValuationBasedConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Valuation-Based Conversion Mechanism",
  "description": "Sets forth inputs and conversion mechanism based on valuations",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "VALUATION_BASED_CONVERSION"
    },
    "valuation_type": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ValuationBasedFormulaType.schema.json"
    },
    "valuation_amount": {
      "description": "If there is a specified valuation figure to use, what is it? Look to `valuation_type` to understand whether this represents, a max valuation (`CAP`), actual valuation at time of exercise (`ACTUAL`) or fixed valuation (`FIXED`).",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "capitalization_definition": {
      "description": "How is company capitalization defined for purposes of exercise calculations? If possible, include the legal language from the instrument.",
      "type": "string"
    },
    "capitalization_definition_rules": {
      "description": "The rules for which types of securities would be included in the capitalization definition.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinitionRules.schema.json"
    }
  },
  "oneOf": [
    {
      "properties": {
        "valuation_type": {
          "const": "CAP"
        }
      },
      "required": [
        "valuation_amount"
      ]
    },
    {
      "properties": {
        "valuation_type": {
          "const": "FIXED"
        }
      },
      "required": [
        "valuation_amount"
      ]
    },
    {
      "properties": {
        "valuation_type": {
          "const": "ACTUAL"
        }
      }
    }
  ],
  "required": [
    "type",
    "valuation_type",
    "type"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/ValuationBasedConversionMechanism.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: ocf-internal
  valuation_type:
    kind: unmappable
    target: null
    reason: no-equivalent
  valuation_amount:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/priceCap"
  capitalization_definition:
    kind: unmappable
    target: null
    reason: no-equivalent
  capitalization_definition_rules:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket (1) — structured OCF type with a single, unambiguous Carta home for its economic value.** `ValuationBasedConversionMechanism` is a convertible/SAFE conversion-mechanism variant that sets the conversion price off a *company valuation* figure: `valuation_amount` is the dollar valuation, and `valuation_type` says whether that figure is a max valuation (`CAP`), a fixed valuation (`FIXED`), or the actual valuation at exercise (`ACTUAL`). Carta models the convertible itself as a reusable object — `#/$defs/ConvertibleNote` (mirrored by the issuance event `#/$defs/ConvertibleIssuanceTransaction`) — and inlines a convertible's valuation/price cap as `priceCap` (`Money`) on the note and `valuationCap` (`Money`) on the issuance. So the type's one true economic input (`valuation_amount`) has a single clear home and this is bucket-1, not bucket-2/3: we map that field and mark `unmappable` only the genuinely-absent OCF concepts. This is the same routing already used by the complete `types/conversion_mechanisms/NoteConversionMechanism.mapping.md`, whose `conversion_valuation_cap` (`Monetary`) → `#/$defs/ConvertibleNote/properties/priceCap`; per the **consistency rule**, a convertible valuation cap must land in the same Carta place, so this mapping follows that precedent.
- `valuation_amount` → `#/$defs/ConvertibleNote/properties/priceCap` (Carta `Money`). Both are monetary amounts (OCF `Monetary` → Carta `Money`), so it is a structural rename — no scaling, only `{amount, currency}` → Carta `Money`. `#/$defs/ConvertibleIssuanceTransaction/properties/valuationCap` (also `Money`) is the equivalently-named field on the issuance transaction and is an acceptable alternate destination for the same value. **Lossy / semantically narrowing:** Carta's `priceCap`/`valuationCap` *is* a valuation/price cap, so the fit is exact only when `valuation_type = CAP`. For `valuation_type = FIXED` (a fixed agreed valuation) or `ACTUAL` (the actual valuation observed at exercise), the same numeric figure lands in Carta's `priceCap` slot but loses the qualifier that it is a *fixed* or *actual* — not a *capped* — valuation, because the qualifier (`valuation_type`) has no Carta home (see next bullet). An importer should only populate `priceCap` from `valuation_amount` when `valuation_type = CAP`; for `FIXED`/`ACTUAL` it should flag that Carta has no distinct field and that storing the value as `priceCap` would mislabel it. (Note `valuation_amount` is also optional in OCF — required only for `CAP`/`FIXED`, absent for `ACTUAL` — so it may simply be empty.)
- `valuation_type` → **unmappable / no-equivalent.** OCF's `ValuationBasedFormulaType` enumerates `FIXED`, `ACTUAL`, `CAP` — the *basis* on which `valuation_amount` is interpreted. Carta has no valuation-basis enum: a scan of `carta-enums.json` finds `Convertible*` interest/day-count/compounding enums and `ShareClass*`/`Federal*` enums but nothing enumerating "cap vs fixed vs actual valuation," and `ConvertibleNote`/`ConvertibleIssuanceTransaction` carry only the bare cap amount, never a tag describing what kind of valuation it is. There is therefore no enum to remap onto (an enum-remap target must resolve to a Carta enum, and none exists), so this is `no-equivalent` rather than enum-remap. It is genuine semantics Carta omits — not OCF scaffolding — hence `no-equivalent`, not `ocf-internal`.
- `type` → **unmappable / ocf-internal.** This is the OCF discriminator constant (`const: "VALUATION_BASED_CONVERSION"`) that selects which `ConversionMechanism` variant the object is — pure OCF scaffolding, not a data value. Carta encodes the underlying "this is a convertible" fact structurally (the object simply *is* a `ConvertibleNote`) and has no conversion-mechanism-type enum or field to store the variant tag. Treated as `ocf-internal` (the same class as `object_type`/discriminator fields, consistent with `objects/Issuer.mapping.md` and the sibling `NoteConversionMechanism.mapping.md`), rather than `no-equivalent`.
- `capitalization_definition` → **unmappable / no-equivalent.** Free-text (often verbatim legal language) describing how the company's capitalization is computed for the valuation/conversion calculation. Carta records the resulting numeric cap but has no field to store the *definition* of the capitalization base or its legal prose anywhere on `ConvertibleNote` / `ConvertibleIssuanceTransaction` or the wider bundle. (Same disposition as the sibling `NoteConversionMechanism` and `PercentCapitalizationConversionMechanism` mappings.)
- `capitalization_definition_rules` → **unmappable / no-equivalent.** The structured `CapitalizationDefinitionRules` type (the boolean inclusion/exclusion rules for the fully-diluted base: outstanding shares, options, unissued options, this security, other converting securities, option-pool top-ups, new money). Per the already-complete `types/CapitalizationDefinitionRules.mapping.md`, every one of those eight rule booleans is itself `unmappable` — Carta exposes aggregate share counts but not the inclusion-policy used to compute them — so this whole sub-object has no Carta home either and the reference is dropped.
- **Object-level routing of the dropped event-logic.** This OCF type is `$ref`'d (via `primitives/types/conversion_rights/ConversionRight.schema.json` and the `ConversionMechanism` primitive) by `types/conversion_rights/ConvertibleConversionRight.schema.json` and `types/conversion_rights/WarrantConversionRight.schema.json`. At the object level those conversion rights attach to Carta's `ConvertibleNote`/`ConvertibleIssuanceTransaction` (and `WarrantIssuanceTransaction`), where Carta records the convertible's cap/discount/interest *terms* and the *realized* outcome after a conversion event — but not OCF's conversion-trigger state machine or the valuation-basis logic. So beyond the cap amount, the mechanism's basis qualifier and capitalization-definition payload drop out of the Carta snapshot; see those conversion-right mappings for the full object-level disposition.
