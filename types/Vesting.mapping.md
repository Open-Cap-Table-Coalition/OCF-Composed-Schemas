---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json
ocf_object_type: null
ocf_title: Type - Vesting
ocf_kind: type
required_fields:
  - date
  - amount
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
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

- **Parent-context polymorphism.** OCF Vesting is generic; Carta has three nearly-identical vesting event types. The Carta target type for any specific OCF Vesting depends on the containing OCF object:

  | OCF parent | Carta target |
  |---|---|
  | `EquityCompensationIssuance` (option-class) | `OptionGrantVestingEvent` |
  | `EquityCompensationIssuance` (RSU-class) | `RestrictedStockUnitVestingEvent` |
  | `StockIssuance` | `RestrictedStockAwardVestingEvent` |
  | `WarrantIssuance` | unmappable — Carta has no warrant vesting event |

  Field names (`vestDate`, `quantity`) are identical across the three Carta event types, so the per-field mapping above holds regardless. The `target:` paths above reference `OptionGrantVestingEvent` as a representative; the actual selection happens in the containing OCF object's mapping. The `construct` block declares the destination member and the required Numeric lexical rule.
