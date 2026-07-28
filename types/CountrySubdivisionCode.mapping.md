---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountrySubdivisionCode.schema.json
ocf_object_type: null
ocf_title: Type - Country Subdivision Code
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Country Subdivision Code → Carta

> State, province, or equivalent identifier required for an address in this country

## OCF schema

Source: [`CountrySubdivisionCode.schema.json`](./CountrySubdivisionCode.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountrySubdivisionCode.schema.json",
  "title": "Type - Country Subdivision Code",
  "description": "State, province, or equivalent identifier required for an address in this country",
  "type": "string",
  "minLength": 1,
  "maxLength": 3,
  "pattern": "^[A-Z0-9]{1,}$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/CountrySubdivisionCode.schema.json",
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCountrySubdivisionCode.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCountrySubdivisionCode.mapping.md&title=%5BMapping+question%5D+CountrySubdivisionCode) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF's subdivision scalar corresponds to Carta `Iso3166Set2Code`, but Carta wraps the value and requires the full `CC-SUB` form. A converter must use the sibling country to add/remove the prefix.
- This is a type-level correspondence only; consuming mappings decide whether the value belongs on residency/jurisdiction state or has no target.
