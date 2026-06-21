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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 2/2

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
    kind: rename
    target: "#/$defs/Stakeholder/properties/email"
```

## Notes / open questions

- OCF models `Email` as a reusable two-field type (a classification + the address). Carta does not model email as a reusable type at all — it inlines email addresses as bare `string` properties on the entities that need them. There are exactly two such inline fields in the bundle: `Stakeholder.email` ("The stakeholder's email.") and `PointOfContact.userEmail` ("The point of contact email."). Both are plain `type: string`, `maxLength: 1000`.
- `email_address` → `#/$defs/Stakeholder/properties/email` (verified to resolve: `Stakeholder` is a top-level `$def` and `email` is a `type: string`, `maxLength: 1000` property on it). This is the representative inline target: `Stakeholder` is the primary email-carrying entity in the bundle, and the OCF fields that `$ref` this `Email` type land on stakeholder-like records (e.g. `Stakeholder.primary_contact` / `contact_info` via `ContactInfo` / `ContactInfoWithoutName`). When the email instead belongs to a point of contact, the same value lands on `PointOfContact.userEmail` (the only other email slot in the entire bundle, also `type: string`, `maxLength: 1000`); the two are interchangeable bare-string slots, so a single representative pointer is the honest mapping rather than a `split` across two structurally identical destinations. Human-judgment note: which physical Carta field receives the value is decided by the *parent* object's mapping (Stakeholder vs. PointOfContact), not by this leaf type; this pointer documents the canonical/most-common destination.
- `email_type` is genuinely `no-equivalent` (not `excluded-from-snapshot`, `out-of-scope`, or `ocf-internal`): OCF's `EmailType` enum (`PERSONAL` / `BUSINESS` / `OTHER`) classifies *what kind of* email address this is, and Carta simply has no concept of email classification anywhere in its data model — it is a real modeling gap on the target side, not a field that exists upstream but was trimmed from this snapshot, nor an out-of-scope endpoint, nor OCF housekeeping. Carta stores the address only — there is no companion "email type/kind" field, and no enum in the bundle expresses a PERSONAL/BUSINESS/OTHER classification (confirmed by inspecting all 47 Carta enums in `/tmp/carta-enums.json`). The closest candidate, `PointOfContact.type` (`$ref` → `PointOfContactType`), is the only `type` enum adjacent to an email, but its 16 members enumerate contact *roles* (`PRIMARY_CONTACT`, `LEGAL_ADMIN`, `OPTION_SIGNATORY`, `WARRANT_SIGNATORY`, …), i.e. *what function the person serves for the issuer*, not the personal-vs-business nature of the address itself. Remapping `PERSONAL`/`BUSINESS`/`OTHER` onto role values would be semantically false, so that target is deliberately rejected rather than used to dodge `unmappable`. The classification is dropped on transfer; only the address itself survives.
