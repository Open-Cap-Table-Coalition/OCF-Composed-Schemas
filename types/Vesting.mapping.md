---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json
ocf_object_type: null
ocf_title: Type - Vesting
ocf_kind: type
required_fields:
  - date
  - amount
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Type - Vesting → Carta

> Describes an exact vesting date and amount

## OCF schema

Source: [`Vesting.schema.json`](./Vesting.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json",
  "title": "Type - Vesting",
  "description": "Describes an exact vesting date and amount",
  "type": "object",
  "properties": {
    "date": {
      "description": "Date the vesting occurred or will occur",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "amount": {
      "description": "Quantity of shares which vested or will vest",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "required": [
    "date",
    "amount"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Vesting.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | construct | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  date:
    kind: rename
    target: "#/$defs/OptionGrantVestingEvent/properties/vestDate"
  amount:
    kind: construct
    target: "#/$defs/OptionGrantVestingEvent/properties/quantity"
    construct:
      property: value
      normalization:
        integer_leading_zeros: strip
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FVesting.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FVesting.mapping.md&title=%5BMapping+question%5D+Vesting) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FVesting.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FVesting.mapping.md&title=%5BMapping+question%5D+Vesting%3A+date&property_path=date) |
| `amount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FVesting.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FVesting.mapping.md&title=%5BMapping+question%5D+Vesting%3A+amount&property_path=amount) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- The Carta vesting-event target depends on the parent: Option → `OptionGrantVestingEvent`, RSU → `RestrictedStockUnitVestingEvent`, and stock/RSA → `RestrictedStockAwardVestingEvent`. Warrant vesting has no target.
- `date` maps to `vestDate`; `amount` is constructed into the target quantity. The representative option target is resolved by the containing mapping.
