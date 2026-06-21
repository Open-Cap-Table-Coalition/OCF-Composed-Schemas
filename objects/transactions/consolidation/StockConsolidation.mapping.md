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
status: complete
coverage: 7/7

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
      TX_STOCK_CONSOLIDATION: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  resulting_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no stock-consolidation transaction, so the whole object is unmappable.** OCF's `TX_STOCK_CONSOLIDATION` records the merging of several existing stock positions (`security_ids`) into one new resulting position (`resulting_security_id`) — a balance-housekeeping event with no economic effect on the cap table. Carta's transaction set is purely issuance/exercise/settlement/cancellation/transfer per security family (`CertificateIssuanceTransaction`, `Option*`, `Convertible*`, `Warrant*`, `Rsa*`, `Rsu*`, `Sar*`, `Phantom*`, `Piu*`); none of them models consolidating multiple lots into one. The token "consolidat" does not appear anywhere in the bundle. There is therefore no corresponding Carta object onto which to map this transaction's substantive fields.
- `resulting_security_id` looks superficially mappable because Carta does define a `resultingSecurityId` field — but only on derivative-conversion events: `OptionExerciseTransaction`, `RsuSettlementTransaction`, `SarExerciseTransaction`, `WarrantExerciseTransaction`, and `WarrantTransferTransaction`. In every case it means "the security *produced* when a derivative is exercised/settled/transferred," not "the lot that absorbs several consolidated stock positions." Routing OCF's consolidation result onto one of those unrelated transaction types would assert an exercise/transfer that did not occur, so it is left `no-equivalent` rather than mapped to a same-named field on the wrong object. (This object is `ocf_kind: object`, so the 3-bucket type policy does not apply; an OCF transaction maps to its *corresponding* Carta transaction, and here there is none.)
- `security_ids` (the array of source positions being consolidated, `minItems: 1`, unique) has no home for the same reason: Carta has no consolidation event to attach a many-to-one source list to. Carta's transactions reference a single `securityId`/`resultingSecurityId`, never a set of consolidated inputs.
- `date` — OCF records the transaction date as a calendar `Date` (`types/Date.schema.json`, `YYYY-MM-DD`). Carta's transaction timestamps are `Iso8601CompleteCalendarDateTime` (date *plus* time) and live on the concrete transaction objects (`*Datetime` fields). With no Carta consolidation transaction to carry it, the date has nowhere to land; note also the date-vs-datetime granularity gap that would apply even if a target existed.
- `reason_text` — free-form human-readable justification for the consolidation. Carta has no general per-transaction reason/comment field, and there is no consolidation transaction to host one, so this is `no-equivalent`.
- `id`, `comments`, `object_type` — OCF object scaffolding. `id` is OCF's identifier (Carta assigns its own server-side IDs); `object_type` is OCF's discriminator constant (`TX_STOCK_CONSOLIDATION`), which Carta does not need because it types transactions positionally per endpoint; `comments` has no Carta slot. All three are `ocf-internal`. The `object_type` `values:` block maps the sole constant to `null` because there is no Carta discriminator value to remap to.

