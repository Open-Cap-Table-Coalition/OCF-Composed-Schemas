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

- Bucket (1) type-to-type. OCF `ContactInfoWithoutName` and `ContactInfo` model the same
  concept — a contact person — and Carta has a single analogous reusable `$def`,
  `#/$defs/PointOfContact` (`A point of contact for an issuer.`). Per the consistency rule
  both OCF contact types map onto `PointOfContact`. This is the no-name variant, so there is
  no `name` field to carry to `PointOfContact.userFullName`; only `emails` and `phone_numbers`
  are present.
- `emails` (array of OCF `Email`) → `PointOfContact.userEmail`. Carta carries a single scalar
  `userEmail` string, whereas OCF allows an array of emails. This is lossy in cardinality: the
  mapping uses the explicit `primary_then_first_email` policy and source `/email_address`, so only
  one address survives. Carta has no reusable `Email` type — `userEmail` is the only contact-email
  field on `PointOfContact` — so this is the correct and only target.
- `phone_numbers` (array of OCF `Phone`) is `unmappable` / `no-equivalent`. Carta models no
  phone data anywhere in the bundled schema — `PointOfContact` exposes only `issuerId`,
  `userFullName`, `userEmail`, and `type` (a `PointOfContactType` enum); there is no phone
  property and no reusable `Phone`/telephone type. This is consistent with
  `types/Phone.mapping.md` (bucket 3, all fields unmappable): every OCF field that `$ref`s
  `Phone` (`Issuer.phone`, `ContactInfo.phone_numbers`, `ContactInfoWithoutName.phone_numbers`)
  is dropped on transfer to Carta.
- Where this type is used at the object level: OCF `ContactInfoWithoutName` is `$ref`d only by
  `objects/Stakeholder.schema.json` (the stakeholder's `primary_contact` when no contact name is
  supplied). At the object level Carta's stakeholder representation likewise has no phone field,
  so the routing above is the same regardless of nesting context.
- `PointOfContact.userFullName`, `PointOfContact.issuerId`, and `PointOfContact.type` have no
  OCF source on this type and are simply left unset by this mapping (no OCF field fans into them).
