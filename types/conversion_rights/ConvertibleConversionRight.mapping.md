---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json
ocf_object_type: null
ocf_title: Type - Convertible Conversion Rights
ocf_kind: type
required_fields:
  - conversion_mechanism
  - conversion_mechanism
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Convertible Conversion Rights → Carta

> Type representation of a conversion right from a convertible into another non-plan security

## OCF schema

Source: [`ConvertibleConversionRight.schema.json`](./ConvertibleConversionRight.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json",
  "title": "Type - Convertible Conversion Rights",
  "description": "Type representation of a conversion right from a convertible into another non-plan security",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_rights/ConversionRight.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "CONVERTIBLE_CONVERSION_RIGHT"
    },
    "conversion_mechanism": {
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/NoteConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json"
        }
      ]
    },
    "converts_to_future_round": {
      "description": "Is this stock class potentially convertible into a future, as-yet undetermined stock class (e.g. Founder Preferred)",
      "type": "boolean"
    },
    "converts_to_stock_class_id": {
      "description": "The identifier of the existing, known stock class this stock class can convert into",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "conversion_mechanism",
    "conversion_mechanism"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | union-map | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      CONVERTIBLE_CONVERSION_RIGHT: null
  conversion_mechanism:
    kind: union-map
    cases:
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json"
        mapping:
          kind: split
          target:
            - "#/$defs/ConvertibleNote/properties/discountPercentage"
            - "#/$defs/ConvertibleNote/properties/priceCap"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/discountPercentage"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/valuationCap"
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/NoteConversionMechanism.schema.json"
        mapping:
          kind: split
          target:
            - "#/$defs/ConvertibleNote/properties/discountPercentage"
            - "#/$defs/ConvertibleNote/properties/priceCap"
            - "#/$defs/ConvertibleNote/properties/interestRate"
            - "#/$defs/ConvertibleNote/properties/interestAccrualPeriod"
            - "#/$defs/ConvertibleNote/properties/interestCompoundingPeriod"
            - "#/$defs/ConvertibleNote/properties/dayCountBasis"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/discountPercentage"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/valuationCap"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/interestRate"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/interestAccrualPeriod"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/interestCompoundingPeriod"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/dayCountBasis"
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json"
        mapping:
          kind: unmappable
          target: null
          reason: no-equivalent
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json"
        mapping:
          kind: unmappable
          target: null
          reason: no-equivalent
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json"
        mapping:
          kind: unmappable
          target: null
          reason: no-equivalent
  converts_to_future_round:
    kind: unmappable
    target: null
    reason: no-equivalent
  converts_to_stock_class_id:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight%3A+type&property_path=type) |
| `conversion_mechanism` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight%3A+conversion_mechanism&property_path=conversion_mechanism) |
| `converts_to_future_round` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight%3A+converts_to_future_round&property_path=converts_to_future_round) |
| `converts_to_stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight%3A+converts_to_stock_class_id&property_path=converts_to_stock_class_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- The wrapper itself has no Carta conversion-right discriminator or future-round/target-class field. Its `conversion_mechanism` is a union: SAFE terms map discount and cap, Note terms additionally map interest terms, and unsupported mechanism variants remain unmappable.
- This union is resolved by the containing convertible issuance mapping; the Carta targets are `ConvertibleNote` and `ConvertibleIssuanceTransaction` term fields.
