---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Email.schema.json
ocf_object_type: null
ocf_title: Type - Email
ocf_kind: type
required_fields:
  - email_type
  - email_address
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Email → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  email_type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      PERSONAL: null
      BUSINESS: null
      OTHER: null
  email_address:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FEmail.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FEmail.mapping.md&title=%5BMapping+question%5D+Email) |
| `email_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FEmail.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FEmail.mapping.md&title=%5BMapping+question%5D+Email%3A+email_type&property_path=email_type) |
| `email_address` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FEmail.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FEmail.mapping.md&title=%5BMapping+question%5D+Email%3A+email_address&property_path=email_address) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no reusable email type. Its inline email fields are bare strings, so object mappings select `email_address` where a single email is supported.
- `email_type` and the reusable `Email` shape have no independent Carta target; additional addresses and classification are dropped.
