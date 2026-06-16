---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Phone.schema.json
ocf_object_type: null
ocf_title: Type - Phone
ocf_kind: type
required_fields:
  - phone_type
  - phone_number
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Phone → Carta

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
status: complete
coverage: 2/2

fields:
  phone_type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      HOME: null
      MOBILE: null
      BUSINESS: null
      OTHER: null
  phone_number:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- Carta has no phone-number fields anywhere in the bundled schema. Stakeholder and Issuer carry only an `email`. OCF fields that reference `Phone` (e.g. `Issuer.phone`, `ContactInfo.phone_numbers`, `ContactInfoWithoutName.phone_numbers`) are all unmappable on the Carta side; phone data is dropped on transfer.
