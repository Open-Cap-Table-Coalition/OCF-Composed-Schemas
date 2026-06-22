---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/consolidation/StockConsolidation.schema.json
ocf_object_type: TX_STOCK_CONSOLIDATION
ocf_title: Object - Stock Consolidation Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - resulting_security_id
  - security_ids
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Consolidation Transaction → Carta

> Object describing a consolidation of stock positions

## OCF schema

Source: [`StockConsolidation.schema.json`](./StockConsolidation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/consolidation/StockConsolidation.schema.json",
  "title": "Object - Stock Consolidation Transaction",
  "description": "Object describing a consolidation of stock positions",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/consolidation/Consolidation.schema.json"
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
      "const": "TX_STOCK_CONSOLIDATION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "resulting_security_id": {
      "description": "Identifier for the security that holds the consolidated balance from this transaction",
      "type": "string"
    },
    "security_ids": {
      "title": "Consolidation Security IDs Array",
      "description": "Array of identifiers for the security (or securities) being consolidation as a result of the transaction",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "reason_text": {
      "title": "Reason for stock consolidation",
      "description": "Free-form human-readable reason for stock consolidation",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "resulting_security_id",
    "security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/consolidation/StockConsolidation.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_security (downstream join). This consolidation carries NO
# scalar security_id and NO discriminator — it folds many stock positions
# (security_ids) into one resulting_security_id. The stock family (Rsa vs.
# Founders/Default) is fixed at issuance, so it is resolved by joining the
# consolidated securities back to their StockIssuance and reading that
# issuance's issuance_type. No Carta consolidation transaction exists, so every
# variant is fully unmappable. See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_security:
  via: security_ids
  resolve: issuance_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockIssuanceType.schema.json"
  source_mapping: ../issuance/StockIssuance.mapping.md
  exhaustive: true

# shared: every source property. No Carta consolidation tx exists for either
# stock family, so every field is unmappable in all variants — none carries a
# per-variant target map.
shared:
  id:                    { kind: unmappable, target: null, reason: ocf-internal }
  comments:              { kind: unmappable, target: null, reason: no-equivalent }
  object_type:           { kind: unmappable, target: null, reason: ocf-internal }
  date:                  { kind: unmappable, target: null, reason: no-equivalent }
  resulting_security_id: { kind: unmappable, target: null, reason: no-equivalent }
  security_ids:          { kind: unmappable, target: null, reason: ocf-internal }
  reason_text:           { kind: unmappable, target: null, reason: no-equivalent }

variants:

  Rsa:
    when: [RSA]
    primary_targets: null
    fields: {}

  Default:
    when: [FOUNDERS_STOCK]
    primary_targets: null
    fields: {}

coverage:
  Rsa: 7/7
  Default: 7/7
```

## Notes / open questions

- **Join-dependent (downstream), and fully unmappable.** OCF `TX_STOCK_CONSOLIDATION` carries only the foreign keys — the array `security_ids` of the positions being folded together and the single `resulting_security_id` — and no discriminator of its own. The stock family is fixed at issuance, so an importer would resolve `issuance_type` by joining the consolidated securities back to their `StockIssuance` (the two-pass requirement, §2.2). Because this object has no scalar `security_id`, the join key (`route_by_security.via`) is the array `security_ids`. The `StockIssuanceType` enum partitions exactly into `Rsa` (`RSA`) and `Default` (`FOUNDERS_STOCK`).
- **Carta has no consolidation transaction in either family**, so `primary_targets` is `null` for both variants and no field maps anywhere. OCF's consolidation is a balance-housekeeping merge of several lots into one with no economic effect; Carta's transaction set is purely issuance/exercise/settlement/cancellation/transfer per security family and models nothing that consolidates multiple lots into one. The token "consolidat" does not appear in the bundle.
- **`resulting_security_id` is not mappable.** Carta does define a `resultingSecurityId` field, but only on derivative-conversion events (`OptionExerciseTransaction`, `RsuSettlementTransaction`, `SarExerciseTransaction`, `WarrantExerciseTransaction`, `WarrantTransferTransaction`), where it means "the security *produced* by an exercise/settlement/transfer," not "the lot that absorbs several consolidated stock positions." Mapping onto a same-named field on the wrong transaction would assert an event that did not occur, so it stays `no-equivalent`.
- **`security_ids`** is the join key (`route_by_security.via`); it routes the family and is `ocf-internal` rather than a stored Carta field. It is also a many-to-one source list, which Carta has no consolidation event to attach to (Carta transactions reference a single `securityId`/`resultingSecurityId`, never a set of consolidated inputs).
- **`reason_text` has no home** — free-form human-readable justification, and Carta has neither a general per-transaction reason field nor a consolidation transaction to host one (`no-equivalent`). (Even where Carta exposes a `reason`, it is an enum, and free-text → enum is unmappable, not a rename.)
- **`date`** is an OCF calendar `Date` (`YYYY-MM-DD`); Carta's transaction timestamps are `Iso8601CompleteCalendarDateTime` on the concrete transaction objects. With no Carta consolidation transaction to carry it, it has nowhere to land (`no-equivalent`), independent of the date-vs-datetime granularity gap.
- **`id`, `object_type`** are OCF scaffolding. `id` is OCF's identifier (Carta assigns its own server-side IDs) and `object_type` is the discriminator constant `TX_STOCK_CONSOLIDATION`, which Carta does not need because it types transactions positionally per endpoint — both `ocf-internal`. `comments` has no Carta slot (`no-equivalent`).

