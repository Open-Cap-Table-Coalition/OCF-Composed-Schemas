---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Name.schema.json
ocf_object_type: null
ocf_title: Type - Name
ocf_kind: type
required_fields:
  - legal_name
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Name → Carta

> Type comprising of multiple name components

## OCF schema

Source: [`Name.schema.json`](./Name.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Name.schema.json",
  "title": "Type - Name",
  "description": "Type comprising of multiple name components",
  "type": "object",
  "properties": {
    "legal_name": {
      "description": "Legal full name for the individual/institution",
      "type": "string"
    },
    "first_name": {
      "description": "First/given name for the individual",
      "type": "string"
    },
    "last_name": {
      "description": "Last/family name for the individual",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "legal_name"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Name.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 3/3

fields:
  legal_name:
    kind: rename
    target: "#/$defs/Stakeholder/properties/fullName"
  first_name:
    kind: unmappable
    target: null
    reason: no-equivalent
  last_name:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- OCF `Name` is a reusable type. Its dominant consumer is `Stakeholder.name` (`$ref: Name`), and Carta's `Stakeholder` carries exactly one name field — `fullName`, described as "The stakeholder's full legal name." OCF's `legal_name` ("Legal full name for the individual/institution") is therefore a direct rename onto `#/$defs/Stakeholder/properties/fullName` (a `string`, `maxLength: 1000`, resolves in the pinned bundle). This is the representative inline target: Carta does not model a reusable "name" type, it inlines a flat name string per entity. The same flat-string pattern recurs as `Issuer.legalName`, `Corporation.legalName`, and `PointOfContact.userFullName`, but `Stakeholder.fullName` is the only one fed by the OCF `Name` type, so it is the correct anchor.
- `first_name` and `last_name` are genuinely `no-equivalent`. Carta has **no** given-name/family-name decomposition anywhere in the bundle — a case-insensitive search of `target-schema/Carta.schema.json` for `firstName`, `lastName`, `givenName`, `familyName`, `forename`, `surname`, and `middleName` returns zero hits. Every name Carta stores (`Stakeholder.fullName`, `Issuer.legalName`, `Corporation.legalName`, `PointOfContact.userFullName`) is a single undivided string. Folding `first_name`/`last_name` into `fullName` would be a lossy concatenation with no canonical ordering or separator defined by either schema, so they are left unmapped rather than forced into the legal-name field (which already receives `legal_name`). The individual name components are dropped on transfer; only the full legal name survives.
- No `combine` was used: `legal_name` already populates `fullName` on its own, and OCF treats `legal_name` (not the assembled first+last) as the authoritative full name, so combining would double-write the target.
