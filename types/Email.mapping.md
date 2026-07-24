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
| `email_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FEmail.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FEmail.mapping.md&title=%5BMapping+question%5D+Email+%2F+email_type&property_path=email_type) |
| `email_address` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FEmail.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FEmail.mapping.md&title=%5BMapping+question%5D+Email+%2F+email_address&property_path=email_address) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Why this whole type is unmappable, not just one field.** Carta does not model email as a reusable type at all — it inlines email addresses as bare `string` properties on whichever entity needs one. There are exactly two such inline fields in the entire bundle: `Stakeholder.email` ("The stakeholder's email.") and `PointOfContact.userEmail` ("The point of contact email."), both plain `type: string`, `maxLength: 1000`. Because there is no Carta `Email` type, there is **no well-posed single type-level target** for OCF's `Email`: the real destination depends entirely on which OCF *object* nested the `Email`, so the mapping belongs at the object level, not here. (This is the "Carta inlines, no reusable type" case — contrast `types/Monetary.mapping.md`, where Carta *does* have a `Money` type and the type→type mapping is well-posed.)
- **Where OCF's `Email` is actually routed (at the object level).** OCF's `Email` type is `$ref`'d by `Issuer.email`, `ContactInfo.emails`, and `ContactInfoWithoutName.emails`. Each is resolved in *that* object's/type's own mapping:
    - `Issuer.email` → **dropped**: Carta's `Issuer` has no email field (`Issuer` carries only `id`/`legalName`/`doingBusinessAsName`/`website`); see `objects/Issuer.mapping.md`, where `email` is `unmappable`.
    - `ContactInfo.emails` / `ContactInfoWithoutName.emails` → `#/$defs/PointOfContact/properties/userEmail`: a contact person is a Carta `PointOfContact`; see `types/ContactInfo.mapping.md` / `types/ContactInfoWithoutName.mapping.md`.
  Note `Stakeholder` is **not** a consumer of the OCF `Email` type, so a `Stakeholder.email` target would have been arbitrary. `email_address` is therefore `no-equivalent` at the type level: there is no single Carta field it maps to independent of context.
- `email_type` is, additionally, genuinely `no-equivalent` (not `excluded-from-snapshot`, `out-of-scope`, or `ocf-internal`): OCF's `EmailType` enum (`PERSONAL` / `BUSINESS` / `OTHER`) classifies *what kind of* email address this is, and Carta simply has no concept of email classification anywhere in its data model — it is a real modeling gap on the target side, not a field that exists upstream but was trimmed from this snapshot, nor an out-of-scope endpoint, nor OCF housekeeping. Carta stores the address only — there is no companion "email type/kind" field, and no enum in the bundle expresses a PERSONAL/BUSINESS/OTHER classification (confirmed by inspecting all 47 Carta enums in `/tmp/carta-enums.json`). The closest candidate, `PointOfContact.type` (`$ref` → `PointOfContactType`), is the only `type` enum adjacent to an email, but its 16 members enumerate contact *roles* (`PRIMARY_CONTACT`, `LEGAL_ADMIN`, `OPTION_SIGNATORY`, `WARRANT_SIGNATORY`, …), i.e. *what function the person serves for the issuer*, not the personal-vs-business nature of the address itself. Remapping `PERSONAL`/`BUSINESS`/`OTHER` onto role values would be semantically false, so that target is deliberately rejected rather than used to dodge `unmappable`. The classification is dropped on transfer; only the address itself survives.
