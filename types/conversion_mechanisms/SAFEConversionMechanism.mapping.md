---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - SAFE
ocf_kind: type
required_fields:
  - conversion_mfn
  - type
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - SAFE → Carta

> Sets forth inputs and conversion mechanism of a SAFE (mirrors the flavors and inputs of the Y Combinator SAFE)

## OCF schema

Source: [`SAFEConversionMechanism.schema.json`](./SAFEConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json",
  "title": "Conversion Mechanism - SAFE",
  "description": "Sets forth inputs and conversion mechanism of a SAFE (mirrors the flavors and inputs of the Y Combinator SAFE)",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "SAFE_CONVERSION"
    },
    "conversion_discount": {
      "description": "What is the percentage discount available upon conversion, if applicable? (decimal representation - e.g. 0.125 for 12.5%)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json"
    },
    "conversion_valuation_cap": {
      "description": "What is the valuation cap (if applicable)?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "exit_multiple": {
      "description": "For cash proceeds calculation during a liquidity event.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json"
    },
    "conversion_mfn": {
      "description": "Is this an MFN flavored SAFE?",
      "type": "boolean"
    },
    "conversion_timing": {
      "description": "Should the conversion amount be based on pre or post money capitalization",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ConversionTimingType.schema.json"
    },
    "capitalization_definition": {
      "description": "How is company capitalization defined for purposes of conversion? If possible, include the legal language from the instrument.",
      "type": "string"
    },
    "capitalization_definition_rules": {
      "description": "The rules for which types of securities would be included in the capitalization definition.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinitionRules.schema.json"
    }
  },
  "required": [
    "conversion_mfn",
    "type",
    "type"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      SAFE_CONVERSION: null
  conversion_discount:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/discountPercentage"
  conversion_valuation_cap:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/priceCap"
  exit_multiple:
    kind: unmappable
    target: null
    reason: no-equivalent
  conversion_mfn:
    kind: unmappable
    target: null
    reason: no-equivalent
  conversion_timing:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      PRE_MONEY: null
      POST_MONEY: null
  capitalization_definition:
    kind: unmappable
    target: null
    reason: no-equivalent
  capitalization_definition_rules:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism+%2F+type&property_path=type) |
| `conversion_discount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism+%2F+conversion_discount&property_path=conversion_discount) |
| `conversion_valuation_cap` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism+%2F+conversion_valuation_cap&property_path=conversion_valuation_cap) |
| `exit_multiple` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism+%2F+exit_multiple&property_path=exit_multiple) |
| `conversion_mfn` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism+%2F+conversion_mfn&property_path=conversion_mfn) |
| `conversion_timing` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism+%2F+conversion_timing&property_path=conversion_timing) |
| `capitalization_definition` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism+%2F+capitalization_definition&property_path=capitalization_definition) |
| `capitalization_definition_rules` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism+%2F+capitalization_definition_rules&property_path=capitalization_definition_rules) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket 1 (single clear home).** `SAFEConversionMechanism` mirrors the Y-Combinator SAFE inputs and is one of OCF's conversion-mechanism variants `$ref`'d from `types/conversion_rights/ConvertibleConversionRight.schema.json` (via the shared `primitives/types/conversion_rights/ConversionRight.schema.json` / `ConversionMechanism` primitive). It carries a mix of (a) genuine *economic terms* of the convertible — the discount and the valuation cap — which DO have a single, unambiguous Carta home on the convertible objects, and (b) *event-logic / discriminator / definitional* fields (the mechanism `type` const, MFN flag, pre/post-money timing, exit multiple, and the capitalization-definition prose + rule booleans), which Carta does not model. Per the 3-bucket policy and the precedent siblings (`CustomConversionMechanism.mapping.md` explicitly notes that the SAFE/Note mechanisms' discount and valuation/price-cap terms DO have Carta homes), the type is bucket 1: map the economic fields to their Carta leaf properties and mark only the genuinely-absent event/structure fields `unmappable`.
- `conversion_discount` (`Percentage` — a fixed-point decimal in `[0,1]`, e.g. `0.125` for 12.5%) → `#/$defs/ConvertibleNote/properties/discountPercentage` (a Carta `Decimal`). This is the SAFE's price discount at conversion and Carta's convertible objects store exactly that. **Unit note:** OCF's `Percentage` is already a fraction in `[0,1]`; Carta's `discountPercentage` is a free `Decimal` whose convention (fraction vs. whole-number percent) is not pinned by the bundle. If Carta expects a whole-number percent (e.g. `12.5`) the value must be multiplied by 100 on transfer — confirm against Carta's ingestion convention before loading. `#/$defs/ConvertibleIssuanceTransaction/properties/discountPercentage` is the equivalent term-level field on the issuance transaction and is an acceptable alternate home if the convertible is being written as a transaction rather than as the `ConvertibleNote` holding.
- `conversion_valuation_cap` (`Monetary`) → `#/$defs/ConvertibleNote/properties/priceCap` (a Carta `Money`). The SAFE valuation cap is the price/valuation ceiling applied at conversion; on `ConvertibleNote` Carta names this `priceCap` (a `Money`). The OCF `Monetary` `{amount, currency}` maps onto Carta `Money` `{amount, currencyCode}` exactly as in `types/Monetary.mapping.md`. `#/$defs/ConvertibleIssuanceTransaction/properties/valuationCap` (also a `Money`) is the same term on the issuance transaction and is the alternate home when writing the issuance rather than the note holding. Note Carta exposes a single cap field, so the OCF distinction between a *valuation* cap and a *price* cap is flattened into `priceCap`/`valuationCap`.
- `type` (const `"SAFE_CONVERSION"`) → `unmappable` / `no-equivalent`. This is OCF's discriminator selecting which conversion-mechanism variant is present inside a `ConversionRight`. Carta has **no conversion-mechanism-type enum** anywhere in the bundle (`carta-enums.json` carries `Convertible*`/`Warrant*`/`Note*` enums but nothing enumerating mechanism kinds; `NoteType` = `DEBT`/`CONVERTIBLE_DEBT`/`CONVERTIBLE_EQUITY`/`SAFE`/`ASA` is an *instrument classification*, not a conversion-mechanism selector). With no Carta enum to remap to, this is `no-equivalent`, consistent with the sibling `CustomConversionMechanism.mapping.md` and `PercentCapitalizationConversionMechanism.mapping.md`. (`values: { SAFE_CONVERSION: null }` records that the single OCF value has no Carta target. It is not `ocf-internal` scaffolding like `object_type`/`id` — it carries real semantics Carta simply omits, hence `no-equivalent`.)
- `conversion_valuation_cap` and `conversion_discount` are the only two fields Carta represents; everything below is genuinely absent in the Carta bundle:
- `exit_multiple` (`Ratio` — numerator/denominator, "for cash proceeds calculation during a liquidity event") → `unmappable` / `no-equivalent`. This is the SAFE's liquidity-event cash-out multiple. Carta's convertible objects carry no exit/cash-out-multiple term — `ConvertibleNote` exposes `cashPaid` (a *realized* `Money` paid out, not a forward-looking multiple) and `changeInControlPercent` (a `Decimal` percent, semantically a change-of-control payout fraction, not a multiple-of-investment on a liquidity event). Coercing a ratio-multiple into `changeInControlPercent` would misrepresent the term, so it is left unmappable rather than force-fit. (Unlike `types/Ratio.mapping.md`, which is bucket 1 only because a *conversion* ratio has the clear home `ShareClassRightsAndPreferences.conversionRatio`; an exit/cash-proceeds multiple has no such Carta home.)
- `conversion_mfn` (`boolean`, "Is this an MFN flavored SAFE?") → `unmappable` / `no-equivalent`. Most-Favored-Nation is a SAFE side-letter/flavor flag; Carta has no MFN boolean on `ConvertibleNote`, `ConvertibleIssuanceTransaction`, or `NoteBlock`, and no enum value encodes it. The MFN flavor is dropped on transfer.
- `conversion_timing` (`ConversionTimingType` enum = `PRE_MONEY` | `POST_MONEY`, "should the conversion amount be based on pre or post money capitalization") → `unmappable` / `no-equivalent`. This would be `enum-remap` if Carta had a pre/post-money timing enum, but the bundle has none — I searched `carta-enums.json` and found no enum carrying `PRE_MONEY`/`POST_MONEY` or any pre/post-money discriminator. Carta records the *resulting* convertible terms but not the pre/post-money basis used to compute the conversion, so both enum values map to `null` and the field is `no-equivalent` (not an `enum-remap` with a real target).
- `capitalization_definition` (free-text legal language defining "company capitalization" for the conversion) → `unmappable` / `no-equivalent`. Carta has no free-text conversion-definition / notes field on any convertible object (the only `description` strings in the bundle are vesting-scoped: `PerformanceCondition.description`, `VestingScheduleTemplate.description`). The textual basis of the cap is dropped, exactly as in the sibling `NoteConversionMechanism`/`PercentCapitalizationConversionMechanism` mappings.
- `capitalization_definition_rules` (`CapitalizationDefinitionRules`) → `unmappable` / `no-equivalent`. Per the already-complete `types/CapitalizationDefinitionRules.mapping.md`, all eight fully-diluted inclusion/exclusion booleans (outstanding shares, options, unissued options, this security, other converting securities, option-pool top-ups, new money) are themselves unmappable — Carta exposes aggregate share counts but not the inclusion-policy used to compute the conversion denominator — so this nested rules sub-object has no Carta home either.
- Object-level disposition: when `ConvertibleConversionRight` (the OCF object that `$ref`s this mechanism) routes to Carta, the convertible's economics land on `#/$defs/ConvertibleNote` / `#/$defs/ConvertibleIssuanceTransaction` (where `discountPercentage` and `priceCap`/`valuationCap` carry the two mapped terms above). OCF's conversion-trigger state machine — the MFN flavor, pre/post-money basis, exit multiple, capitalization-definition prose and rule booleans, and the mechanism discriminator — has no slot in either Carta object and is dropped from the snapshot; Carta records the convertible's terms, not OCF's full conversion-mechanism logic.
