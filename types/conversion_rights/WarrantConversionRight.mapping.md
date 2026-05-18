---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/WarrantConversionRight.schema.json
ocf_object_type: null
ocf_title: Type - Warrant Conversion Rights
ocf_kind: type
required_fields:
  - conversion_mechanism
  - conversion_mechanism
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Warrant Conversion Rights → TBD

> Type representation of a conversion right from a convertible into another non-plan security

## OCF schema

Source: [`WarrantConversionRight.schema.json`](./WarrantConversionRight.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/WarrantConversionRight.schema.json",
  "title": "Type - Warrant Conversion Rights",
  "description": "Type representation of a conversion right from a convertible into another non-plan security",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_rights/ConversionRight.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "WARRANT_CONVERSION_RIGHT"
    },
    "conversion_mechanism": {
      "description": "What conversion mechanism applies to calculate the number of resulting stock class shares?",
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/ValuationBasedConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SharePriceBasedConversionMechanism.schema.json"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_rights/WarrantConversionRight.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/4

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      WARRANT_CONVERSION_RIGHT: TODO
  conversion_mechanism:
    kind: TODO
    target: TODO
  converts_to_future_round:
    kind: TODO
    target: TODO
  converts_to_stock_class_id:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
