---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountrySubdivisionCode.schema.json
ocf_object_type: null
ocf_title: Type - Country Subdivision Code
ocf_kind: type
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Country Subdivision Code → TBD

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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/0

fields:
```

## Notes / open questions

- 
