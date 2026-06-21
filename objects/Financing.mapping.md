---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Financing.schema.json
ocf_object_type: FINANCING
ocf_title: Object - Financing
ocf_kind: object
required_fields:
  - name
  - issuance_ids
  - date
  - id
  - object_type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Financing → Carta

> Object describing a financing

## OCF schema

Source: [`Financing.schema.json`](./Financing.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Financing.schema.json",
  "title": "Object - Financing",
  "description": "Object describing a financing",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    }
  ],
  "properties": {
    "id": {
      "description": "Identifier for the object",
      "type": "string"
    },
    "comments": {
      "description": "Unstructured text comments related to and stored for the object",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "object_type": {
      "const": "FINANCING"
    },
    "name": {
      "description": "Name for the financing",
      "type": "string"
    },
    "issuance_ids": {
      "description": "Array of issuance IDs associated with the financing",
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string"
      }
    },
    "date": {
      "description": "Date on which the financing event occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "name",
    "issuance_ids",
    "date",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/Financing.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 6/6

fields:
  id:
    kind: unmappable
    target: null
    reason: ocf-internal
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      FINANCING: null
  name:
    kind: unmappable
    target: null
    reason: no-equivalent
  issuance_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no financing / round / offering object, so OCF `Financing` has no destination at all.** OCF `Financing` is a grouping record that ties together a named financing event (a "round") with the set of securities issued in it — `name` + `date` + an array of `issuance_ids`. Carta's v1alpha1 bundle defines no analogous concept: there is no `Financing`, `Round`, `Offering`, `Raise`, or `Tranche` `$def`, and the tokens *financing*, *round*, *offering*, and *tranche* do not appear anywhere in the schema. The closest tokens are aggregate read-only `cashRaised` (`$ref: Money`) summary fields on `CapitalizationTableSummary`, `ShareClassSummary`, `NoteBlockSummary`, `WarrantBlockSummary`, and their Stakeholder-scoped variants — these are computed dollar roll-ups, not a financing-event entity, and carry no name, date, or issuance membership. So every real field below is `no-equivalent`, not lossy-but-mappable.
- `name`: no Carta field stores a round / financing name. Carta names securities and plans (`securityLabel`, `equityIncentivePlanName`, `shareClassName`, etc.), but nothing groups them under a financing-event name.
- `issuance_ids`: OCF models round membership *from the financing side* (the `Financing` holds the list of issuance object IDs created in it). Carta carries no inverse link either: none of the issuance transactions (`CertificateIssuanceTransaction`, `ConvertibleIssuanceTransaction`, `OptionIssuanceTransaction`, `WarrantIssuanceTransaction`, `RsaIssuanceTransaction`, …) nor the security objects (`Certificate`, `ConvertibleNote`, `OptionGrant`, …) carry a `roundId` / `financingId` / `financingName` back-reference. The FKs they do carry — `shareClassId`, `equityPlanId`, `noteBlockId`, `vestingScheduleTemplateId`, `precededBySecurityId` — group securities by share class / plan / note block / lineage, never by financing round. There is therefore nowhere to write the financing→issuance association, in either direction.
- `date`: no Carta financing-event date. Carta records dates only per individual security/transaction (`issueDate`, `issueDatetime`, `maturityDatetime`, etc., all `Iso8601CompleteCalendarDate`/`…DateTime`). There is no single Carta node representing "the date this financing closed," and synthesizing one (e.g., the min/max `issueDatetime` across the round's securities) is not constructible because the round-membership grouping itself is absent (see `issuance_ids`).
- `id`, `comments`, `object_type`: boilerplate OCF object scaffolding. `id` is OCF's identifier (Carta assigns its own server-side); `object_type` is the OCF `FINANCING` discriminator (Carta types positionally per endpoint and needs no discriminator); `comments` has no Carta slot. Marked `ocf-internal` per the Issuer/Document precedents.
