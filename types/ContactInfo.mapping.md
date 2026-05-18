---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfo.schema.json
ocf_object_type: null
ocf_title: Type - Contact Info
ocf_kind: type
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Contact Info → TBD

> Type representation of a primary contact person for a stakeholder (e.g. a fund)

## OCF schema

Source: [`ContactInfo.schema.json`](./ContactInfo.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfo.schema.json",
  "title": "Type - Contact Info",
  "description": "Type representation of a primary contact person for a stakeholder (e.g. a fund)",
  "type": "object",
  "properties": {
    "name": {
      "description": "Contact's name",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Name.schema.json"
    },
    "phone_numbers": {
      "title": "Contact Info - Phone Number Array",
      "description": "Phone numbers to reach the contact at",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Phone.schema.json"
      }
    },
    "emails": {
      "title": "Contact Info - Email Address Array",
      "description": "Emails to reach the contact at",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Email.schema.json"
      }
    }
  },
  "additionalProperties": false,
  "anyOf": [
    {
      "required": [
        "name",
        "phone_numbers"
      ]
    },
    {
      "required": [
        "name",
        "emails"
      ]
    }
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/ContactInfo.schema.json",
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/3

fields:
  name:
    kind: TODO
    target: TODO
  phone_numbers:
    kind: TODO
    target: TODO
  emails:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
