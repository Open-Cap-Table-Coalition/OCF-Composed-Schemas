---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json
ocf_object_type: null
ocf_title: Type - Monetary
ocf_kind: type
required_fields:
  - amount
  - currency
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Type - Monetary → Carta Money

> Type representation of an amount of money in a specified currency

## OCF schema

Source: [`Monetary.schema.json`](./Monetary.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json",
  "title": "Type - Monetary",
  "description": "Type representation of an amount of money in a specified currency",
  "type": "object",
  "properties": {
    "amount": {
      "description": "Numeric amount of money",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "currency": {
      "description": "ISO 4217 currency code",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CurrencyCode.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "amount",
    "currency"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Monetary.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  amount:
    kind: rename
    target: "#/$defs/Money/properties/amount"
  currency:
    kind: rename
    target: "#/$defs/Money/properties/currencyCode"
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FMonetary.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FMonetary.mapping.md&title=%5BMapping+question%5D+Monetary) |
| `amount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FMonetary.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FMonetary.mapping.md&title=%5BMapping+question%5D+Monetary%3A+amount&property_path=amount) |
| `currency` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FMonetary.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FMonetary.mapping.md&title=%5BMapping+question%5D+Monetary%3A+currency&property_path=currency) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- `amount` and `currency` map to `Money.amount` and `Money.currencyCode`. The value correspondence is direct; Carta wraps the currency code in its reusable ISO type.
