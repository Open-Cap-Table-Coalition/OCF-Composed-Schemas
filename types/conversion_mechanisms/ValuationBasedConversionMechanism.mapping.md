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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
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
    kind: unmappable
    target: null
    reason: no-equivalent
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+type&property_path=type) |
| `valuation_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+valuation_type&property_path=valuation_type) |
| `valuation_amount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+valuation_amount&property_path=valuation_amount) |
| `capitalization_definition` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+capitalization_definition&property_path=capitalization_definition) |
| `capitalization_definition_rules` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+capitalization_definition_rules&property_path=capitalization_definition_rules) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket (3) — no target in the effective consumer context.** `ValuationBasedConversionMechanism` is admitted by `WarrantConversionRight`, not by the concrete `ConvertibleConversionRight` union. The shared `ConversionRight` primitive is broader than either concrete subtype, so a raw primitive reference must not be treated as proof that the value belongs on a convertible. Carta's warrant family has no field for a valuation-based conversion formula or cap; routing `valuation_amount` to `ConvertibleNote.priceCap` would incorrectly materialize a warrant as a convertible. It is therefore explicitly `unmappable` in this reusable type mapping.
- **Context rule.** A future mapping may map this value to a convertible cap only after a concrete source context proves that the mechanism belongs to a convertible instrument and that `valuation_type = CAP`. The current OCF composed schema provides no such convertible consumer, so no target is claimed here.
- `valuation_amount` → **unmappable / no-equivalent in the effective warrant context.** The value is a warrant conversion-formula input. Carta's `ConvertibleNote.priceCap` and `ConvertibleIssuanceTransaction.valuationCap` are not valid homes merely because their scalar shapes are compatible. `valuation_type` is also unmappable, so no lossless or semantically safe cap route exists in this reusable type mapping.
- `valuation_type` → **unmappable / no-equivalent.** OCF's `ValuationBasedFormulaType` enumerates `FIXED`, `ACTUAL`, `CAP` — the *basis* on which `valuation_amount` is interpreted. Carta has no valuation-basis enum: a scan of `carta-enums.json` finds `Convertible*` interest/day-count/compounding enums and `ShareClass*`/`Federal*` enums but nothing enumerating "cap vs fixed vs actual valuation," and `ConvertibleNote`/`ConvertibleIssuanceTransaction` carry only the bare cap amount, never a tag describing what kind of valuation it is. There is therefore no enum to remap onto (an enum-remap target must resolve to a Carta enum, and none exists), so this is `no-equivalent` rather than enum-remap. It is genuine semantics Carta omits — not OCF scaffolding — hence `no-equivalent`, not `ocf-internal`.
- `type` → **unmappable / ocf-internal.** This is the OCF discriminator constant (`const: "VALUATION_BASED_CONVERSION"`) that selects which `ConversionMechanism` variant the object is — pure OCF scaffolding, not a data value. Carta encodes the underlying "this is a convertible" fact structurally (the object simply *is* a `ConvertibleNote`) and has no conversion-mechanism-type enum or field to store the variant tag. Treated as `ocf-internal` (the same class as `object_type`/discriminator fields, consistent with `objects/Issuer.mapping.md` and the sibling `NoteConversionMechanism.mapping.md`), rather than `no-equivalent`.
- `capitalization_definition` → **unmappable / no-equivalent.** Free-text (often verbatim legal language) describing how the company's capitalization is computed for the valuation/conversion calculation. Carta records the resulting numeric cap but has no field to store the *definition* of the capitalization base or its legal prose anywhere on `ConvertibleNote` / `ConvertibleIssuanceTransaction` or the wider bundle. (Same disposition as the sibling `NoteConversionMechanism` and `PercentCapitalizationConversionMechanism` mappings.)
- `capitalization_definition_rules` → **unmappable / no-equivalent.** The structured `CapitalizationDefinitionRules` type (the boolean inclusion/exclusion rules for the fully-diluted base: outstanding shares, options, unissued options, this security, other converting securities, option-pool top-ups, new money). Per the already-complete `types/CapitalizationDefinitionRules.mapping.md`, every one of those eight rule booleans is itself `unmappable` — Carta exposes aggregate share counts but not the inclusion-policy used to compute them — so this whole sub-object has no Carta home either and the reference is dropped.
- **Object-level routing of the dropped event-logic.** This OCF type is admitted by `types/conversion_rights/WarrantConversionRight.schema.json` (the shared `ConversionRight` primitive is broader, but the concrete convertible-right union excludes this mechanism). At the object level the warrant right attaches to Carta's `WarrantIssuanceTransaction`, which has no valuation-formula or cap field. The mechanism discriminator, valuation basis, amount, and capitalization-definition payload therefore drop out of the Carta snapshot.
