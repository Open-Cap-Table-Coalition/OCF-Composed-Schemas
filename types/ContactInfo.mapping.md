---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfo.schema.json
ocf_object_type: null
ocf_title: Type - Contact Info
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Type - Contact Info → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  name:
    kind: select
    target: "#/$defs/PointOfContact/properties/userFullName"
    policy: legal_name
    source: "/legal_name"
  phone_numbers:
    kind: unmappable
    target: null
    reason: no-equivalent
  emails:
    kind: select
    target: "#/$defs/PointOfContact/properties/userEmail"
    policy: primary_then_first_email
    source: "/email_address"
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FContactInfo.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FContactInfo.mapping.md&title=%5BMapping+question%5D+ContactInfo) |
| `name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FContactInfo.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FContactInfo.mapping.md&title=%5BMapping+question%5D+ContactInfo%3A+name&property_path=name) |
| `phone_numbers` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FContactInfo.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FContactInfo.mapping.md&title=%5BMapping+question%5D+ContactInfo%3A+phone_numbers&property_path=phone_numbers) |
| `emails` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FContactInfo.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FContactInfo.mapping.md&title=%5BMapping+question%5D+ContactInfo%3A+emails&property_path=emails) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- `ContactInfo` maps to Carta `PointOfContact`: `name` selects `legal_name` → `userFullName`, and `emails` selects the primary, then first, address → `userEmail`.
- `phone_numbers` has no Carta target. June 22 makes `PointOfContact.issuerId` and `PointOfContact.type` required; neither is present in this OCF contact type and both remain explicit context/role requirements.
