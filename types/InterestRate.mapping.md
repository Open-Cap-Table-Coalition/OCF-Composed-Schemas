---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/InterestRate.schema.json
ocf_object_type: null
ocf_title: Type - Interest Rate
ocf_kind: type
required_fields:
  - rate
  - accrual_start_date
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Interest Rate → Carta

> Type representation of an interest rate, including accrual start and end dates

## OCF schema

Source: [`InterestRate.schema.json`](./InterestRate.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/InterestRate.schema.json",
  "title": "Type - Interest Rate",
  "description": "Type representation of an interest rate, including accrual start and end dates",
  "type": "object",
  "properties": {
    "rate": {
      "description": "Interest rate for the convertible (decimal representation - e.g. 0.125 for 12.5%)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json"
    },
    "accrual_start_date": {
      "description": "Commencement date for interest accruing at the specified rate",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "accrual_end_date": {
      "description": "Optional end date (inclusive) for interest accruing at the specified rate. If none specified, interest will accrue indefinitely or until accrual of next interest rate commences",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "rate",
    "accrual_start_date"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/InterestRate.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  rate:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/interestRate"
  accrual_start_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  accrual_end_date:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FInterestRate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FInterestRate.mapping.md&title=%5BMapping+question%5D+InterestRate) |
| `rate` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FInterestRate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FInterestRate.mapping.md&title=%5BMapping+question%5D+InterestRate%3A+rate&property_path=rate) |
| `accrual_start_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FInterestRate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FInterestRate.mapping.md&title=%5BMapping+question%5D+InterestRate%3A+accrual_start_date&property_path=accrual_start_date) |
| `accrual_end_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FInterestRate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FInterestRate.mapping.md&title=%5BMapping+question%5D+InterestRate%3A+accrual_end_date&property_path=accrual_end_date) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- `rate` maps to the convertible interest-rate field `ConvertibleNote.interestRate` when used in convertible terms.
- `accrual_start_date` and `accrual_end_date` have no Carta counterpart.
