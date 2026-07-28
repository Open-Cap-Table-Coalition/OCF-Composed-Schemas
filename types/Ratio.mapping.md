---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json
ocf_object_type: null
ocf_title: Type - Ratio
ocf_kind: type
required_fields:
  - numerator
  - denominator
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Type - Ratio → Carta

> Type representation of a ratio as two parts of a quotient, i.e. numerator and denominator numeric values

## OCF schema

Source: [`Ratio.schema.json`](./Ratio.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json",
  "title": "Type - Ratio",
  "description": "Type representation of a ratio as two parts of a quotient, i.e. numerator and denominator numeric values",
  "type": "object",
  "properties": {
    "numerator": {
      "description": "Numerator of the ratio, i.e. the ratio of A to B (A:B) can be expressed as a fraction (A/B), where A is the numerator",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "denominator": {
      "description": "Denominator of the ratio, i.e. the ratio of A to B (A:B) can be expressed as a fraction (A/B), where B is the denominator",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "numerator",
    "denominator"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Ratio.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  numerator:
    kind: unmappable
    target: null
    reason: no-equivalent
  denominator:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FRatio.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FRatio.mapping.md&title=%5BMapping+question%5D+Ratio) |
| `numerator` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FRatio.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FRatio.mapping.md&title=%5BMapping+question%5D+Ratio%3A+numerator&property_path=numerator) |
| `denominator` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FRatio.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FRatio.mapping.md&title=%5BMapping+question%5D+Ratio%3A+denominator&property_path=denominator) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no reusable ratio type, and OCF `Ratio` is used by unrelated consumers with different target semantics. Both numerator and denominator are therefore unmappable at the generic type level.
- The ratio-conversion consumer may map an evaluated quotient to preferred `conversionRatio`; split and SAFE/note consumers resolve separately in their own mappings.
