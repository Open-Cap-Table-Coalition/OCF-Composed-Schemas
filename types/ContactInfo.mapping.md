---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfo.schema.json
ocf_object_type: null
ocf_title: Type - Contact Info
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
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

- Carta's nearest analogue to OCF's `ContactInfo` is `PointOfContact` — "A point of contact for an issuer. Examples include a Legal Admin or an Option Signatory." It is the only Carta type that models a named human contact with an email, and it carries exactly the two scalars OCF's `ContactInfo` needs a home for: `userFullName` and `userEmail`. (Carta also has `Stakeholder.fullName`/`Stakeholder.email`, but a Stakeholder *is* the holder of securities, not the "primary contact person for a stakeholder" that `ContactInfo` describes — so `PointOfContact` is the semantically correct target, not `Stakeholder`.)
- `name`: OCF's `Name` is a structured object (`legal_name` required, plus optional `first_name`/`last_name`). Carta does not model a reusable multi-component name type; `PointOfContact` flattens the contact's name into a single bare string, `userFullName` ("The point of contact full name."). The mapping is an explicit `select` using policy `legal_name` and source `/legal_name`; Carta has no slot for the decomposed `first_name`/`last_name` parts.
- `emails`: OCF carries an *array* of `Email` objects (each with `email_type` + `email_address`); Carta's `PointOfContact.userEmail` is a single bare email string with no type discriminator. The mapping is an explicit `select` using `primary_then_first_email` and source `/email_address`; the qualifier and additional addresses are intentionally lost.
- `phone_numbers`: unmappable, `no-equivalent`. Carta has no phone-number field anywhere in the bundled schema — not on `PointOfContact`, `Stakeholder`, or `Issuer` (all of which expose only an email). This matches the `types/Phone.mapping.md` finding that every OCF field referencing `Phone` (`Issuer.phone`, `ContactInfo.phone_numbers`, `ContactInfoWithoutName.phone_numbers`) is unmappable on the Carta side; phone data is dropped on transfer.
- `PointOfContact` also carries `issuerId` (the FK to its owning issuer) and a `type` enum (`PRIMARY_CONTACT`, `LEGAL_ADMIN`, …). Neither has an OCF `ContactInfo` source field: OCF attaches `ContactInfo` structurally (e.g. on `StockPlan`/`Issuer`-adjacent records) rather than carrying an issuer FK or a contact-role discriminator, so there is nothing to map *into* them from this type.
