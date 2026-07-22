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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). This consolidation carries NO
# scalar security_id and NO discriminator — it folds many stock positions
# (security_ids) into one resulting_security_id. The stock family (Rsa vs.
# Founders/Default) is fixed at issuance, so it is resolved by joining the
# consolidated securities back to their StockIssuance and reading that
# issuance's issuance_type. No Carta consolidation transaction exists, so the
# transaction event (date/reason_text) is unmappable — but the consolidation
# lineage round-trips losslessly onto the resulting stock security's precededBy.
# See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  property: issuance_type
  from:
    via: security_ids
    mapping: ../issuance/StockIssuance.mapping.md
  enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockIssuanceType.schema.json"
  exhaustive: true

# shared: every source property. No Carta consolidation tx exists, so the event
# fields (date/reason_text) are unmappable; but the consolidation lineage
# (security_ids → resulting_security_id) round-trips onto the resulting stock
# security's precededBy.securities and carries a per-variant target map.
shared:
  id:                    { kind: unmappable, target: null, reason: ocf-internal }
  comments:              { kind: unmappable, target: null, reason: no-equivalent }
  object_type:           { kind: unmappable, target: null, reason: ocf-internal }
  date:                  { kind: unmappable, target: null, reason: no-equivalent }
  resulting_security_id:
    kind: computed                 # lineage: the consolidated-into security whose precededBy records the inputs
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"
  security_ids:
    kind: computed                 # lineage + via: the consolidated inputs become the resulting security precededBy
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"
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

 ```

## Notes / open questions

- **Join-dependent (downstream).** OCF `TX_STOCK_CONSOLIDATION` carries only the foreign keys — the array `security_ids` of the positions being folded together and the single `resulting_security_id` — and no discriminator of its own. The stock family is fixed at issuance, so an importer would resolve `issuance_type` by joining the consolidated securities back to their `StockIssuance` (the two-pass requirement, §2.2). Because this object has no scalar `security_id`, the join key (`route_by_property.from.via`) is the array `security_ids`. The `StockIssuanceType` enum partitions exactly into `Rsa` (`RSA`) and `Default` (`FOUNDERS_STOCK`).
- **Carta has no consolidation *transaction* in either family**, so `primary_targets` is `null` for both variants — the event itself (its `date`, its `reason_text`) has nowhere to land. OCF's consolidation is a balance-housekeeping merge of several lots into one with no economic effect; Carta's transaction set is purely issuance/exercise/settlement/cancellation/transfer per security family and models no consolidation *event*. The token "consolidat" does not appear in the bundle. The consolidation *lineage*, however, is not lost: Carta records the same many-to-one relationship as reverse lineage edges on the resulting stock security (see below).
- **Consolidation lineage round-trips losslessly (kind `computed`).** OCF puts the consolidated inputs (`security_ids`) and the consolidated-into balance (`resulting_security_id`) as foreign keys on the transaction; Carta records the same information as `precededBy.securities` (a `PrecededBySecurity` array) on the resulting *stock* security — `RestrictedStockAwardPrecededBy.securities` for `Rsa`, `CertificatePrecededBy.securities` for `Default`. An importer therefore writes every consolidated input id into the resulting security's `precededBy.securities`. N inputs → one output is exactly the many-to-one shape `precededBy.securities` expresses, so the lineage survives even though the event does not.
  - **`security_ids`** is also the join key (`route_by_property.from.via`); it routes the family *and* supplies the set of inputs that become the resulting security's `precededBy.securities`. It is `computed` (importer-derived placement onto the record the consolidation references), not a stored scalar Carta field.
  - **`resulting_security_id`** identifies the consolidated-into stock security (a Carta `Certificate` / `RestrictedStockAward`) — the record whose `precededBy.securities` the inputs are written onto. (Carta's tx-level `resultingSecurityId` field exists only on derivative-conversion events and means "the security *produced* by an exercise/settlement," not "the lot that absorbs consolidated positions," so the lineage lands on `precededBy`, not on that same-named field.)
- **`reason_text` has no home** — free-form human-readable justification, and Carta has neither a general per-transaction reason field nor a consolidation transaction to host one (`no-equivalent`). (Even where Carta exposes a `reason`, it is an enum, and free-text → enum is unmappable, not a rename.)
- **`date`** is an OCF calendar `Date` (`YYYY-MM-DD`); Carta's transaction timestamps are `Iso8601CompleteCalendarDateTime` on the concrete transaction objects. With no Carta consolidation transaction to carry it, it has nowhere to land (`no-equivalent`), independent of the date-vs-datetime granularity gap.
- **`id`, `object_type`** are OCF scaffolding. `id` is OCF's identifier (Carta assigns its own server-side IDs) and `object_type` is the discriminator constant `TX_STOCK_CONSOLIDATION`, which Carta does not need because it types transactions positionally per endpoint — both `ocf-internal`. `comments` has no Carta slot (`no-equivalent`).

