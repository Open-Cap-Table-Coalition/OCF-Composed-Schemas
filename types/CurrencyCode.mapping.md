---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CurrencyCode.schema.json
ocf_object_type: null
ocf_title: Type - Currency Code
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Currency Code → Carta

> Type representation of an ISO 4217 currency code

## OCF schema

Source: [`CurrencyCode.schema.json`](./CurrencyCode.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CurrencyCode.schema.json",
  "title": "Type - Currency Code",
  "description": "Type representation of an ISO 4217 currency code",
  "type": "string",
  "minLength": 3,
  "maxLength": 3,
  "pattern": "^[A-Z]{3}$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/CurrencyCode.schema.json",
  "properties": {},
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields: {}
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCurrencyCode.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCurrencyCode.mapping.md&title=%5BMapping+question%5D+CurrencyCode) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF's ISO 4217 alpha-3 scalar corresponds directly to Carta `Iso4217CurrencyAlphaCode.value`; only the wrapper shape differs.
- At object level, `Monetary.currency` maps to `Money.currencyCode`.
