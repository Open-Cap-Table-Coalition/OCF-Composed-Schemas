---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Phone.schema.json
ocf_object_type: null
ocf_title: Type - Phone
ocf_kind: type
required_fields:
  - phone_type
  - phone_number
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Phone → TBD

> Type representation of a phone number

## OCF schema

Source: [`Phone.schema.json`](./Phone.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Phone.schema.json",
  "title": "Type - Phone",
  "description": "Type representation of a phone number",
  "type": "object",
  "properties": {
    "phone_type": {
      "description": "Type of phone number (e.g. mobile, home or business)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/PhoneType.schema.json"
    },
    "phone_number": {
      "description": "A valid phone number string in ITU E.123 international notation (e.g. +123 123 456 7890). An extension number, if applicable, should be separated by words ''extension'' or ''ext.'' after the phone number (e.g. +123 123 456 7890 ext. 100).",
      "type": "string",
      "pattern": "^\\+\\d{1,3}\\s\\d{2,3}\\s\\d{2,3}\\s\\d{4}(\\s(ext.|extension)\\s\\d+)?$"
    }
  },
  "additionalProperties": false,
  "required": [
    "phone_type",
    "phone_number"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Phone.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  phone_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      HOME: TODO
      MOBILE: TODO
      BUSINESS: TODO
      OTHER: TODO
  phone_number:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
