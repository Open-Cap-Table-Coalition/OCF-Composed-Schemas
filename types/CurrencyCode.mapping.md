---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CurrencyCode.schema.json
ocf_object_type: null
ocf_title: Type - Currency Code
ocf_kind: type
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Currency Code → TBD

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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/0

fields:
```

## Notes / open questions

- 
