---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Email.schema.json
ocf_object_type: null
ocf_title: Type - Email
ocf_kind: type
required_fields:
  - email_type
  - email_address
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Email → TBD

> Type representation of an email address

## OCF schema

Source: [`Email.schema.json`](./Email.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Email.schema.json",
  "title": "Type - Email",
  "description": "Type representation of an email address",
  "type": "object",
  "properties": {
    "email_type": {
      "description": "Type of e-mail address (e.g. personal or business)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/EmailType.schema.json"
    },
    "email_address": {
      "description": "A valid e-mail address",
      "type": "string",
      "format": "email"
    }
  },
  "additionalProperties": false,
  "required": [
    "email_type",
    "email_address"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Email.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  email_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      PERSONAL: TODO
      BUSINESS: TODO
      OTHER: TODO
  email_address:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
