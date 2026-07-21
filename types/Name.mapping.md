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

fields:
  legal_name:
    kind: unmappable
    target: null
    reason: no-equivalent
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

- **Why this whole type is unmappable, not just the components.** Carta does not model a reusable "name" type — it inlines a single flat name string per entity (`Stakeholder.fullName`, `Issuer.legalName`, `Corporation.legalName`, `PointOfContact.userFullName`). Because there is no Carta `Name` type, there is **no well-posed single type-level target** for OCF's `Name`: which flat-string field receives the value depends on which OCF *object* nested the `Name`, so the mapping belongs at the object level, not here. (Contrast `types/Monetary.mapping.md`, where Carta *does* have a `Money` type and the type→type mapping is well-posed.)
- **Where OCF's `Name` is actually routed (at the object level).** OCF's `Name` type is `$ref`'d by `Stakeholder.name` and `ContactInfo.name`. Each is resolved in *that* object's/type's own mapping:
    - `Stakeholder.name` → `Stakeholder.fullName`: `legal_name` lands on Carta's `Stakeholder.fullName` ("The stakeholder's full legal name"); see `objects/Stakeholder.mapping.md`.
    - `ContactInfo.name` → `PointOfContact.userFullName`: a contact person is a Carta `PointOfContact`; see `types/ContactInfo.mapping.md`.
  So `legal_name` is `no-equivalent` at the type level — there is no single Carta field it maps to independent of context.
- `first_name` and `last_name` are, additionally, genuinely `no-equivalent` regardless of object context. Carta has **no** given-name/family-name decomposition anywhere in the bundle — a case-insensitive search of `target-schema/Carta.schema.json` for `firstName`, `lastName`, `givenName`, `familyName`, `forename`, `surname`, and `middleName` returns zero hits. Every name Carta stores (`Stakeholder.fullName`, `Issuer.legalName`, `Corporation.legalName`, `PointOfContact.userFullName`) is a single undivided string. Folding `first_name`/`last_name` into `fullName` would be a lossy concatenation with no canonical ordering or separator defined by either schema, so they are left unmapped rather than forced into the legal-name field (which already receives `legal_name`). The individual name components are dropped on transfer; only the full legal name survives.
- The flat-string fields Carta does store (`Stakeholder.fullName`, `Issuer.legalName`, `PointOfContact.userFullName`) are populated from `legal_name` by the *consuming object's* mapping listed above, not by a type-level target here. The first/last decomposition has no Carta home in any of those contexts.
