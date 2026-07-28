---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfoWithoutName.schema.json
ocf_object_type: null
ocf_title: Type - Contact Info Without Name
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Contact Info Without Name → Carta

> Type representation of the contact info for an individual stakeholder

## OCF schema

Source: [`ContactInfoWithoutName.schema.json`](./ContactInfoWithoutName.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfoWithoutName.schema.json",
  "title": "Type - Contact Info Without Name",
  "description": "Type representation of the contact info for an individual stakeholder",
  "type": "object",
  "properties": {
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
        "phone_numbers"
      ]
    },
    {
      "required": [
        "emails"
      ]
    }
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/ContactInfoWithoutName.schema.json",
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FContactInfoWithoutName.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FContactInfoWithoutName.mapping.md&title=%5BMapping+question%5D+ContactInfoWithoutName) |
| `phone_numbers` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FContactInfoWithoutName.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FContactInfoWithoutName.mapping.md&title=%5BMapping+question%5D+ContactInfoWithoutName%3A+phone_numbers&property_path=phone_numbers) |
| `emails` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FContactInfoWithoutName.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FContactInfoWithoutName.mapping.md&title=%5BMapping+question%5D+ContactInfoWithoutName%3A+emails&property_path=emails) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- `emails` selects the primary, then first, email address into `PointOfContact.userEmail`; there is no name source in this variant.
- `phone_numbers` has no Carta target. Carta-only issuer and contact-role fields remain unset.
