---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/split/StockClassSplit.schema.json
ocf_object_type: TX_STOCK_CLASS_SPLIT
ocf_title: Object - Stock Split Transaction
ocf_kind: object
required_fields:
  - split_ratio
  - id
  - object_type
  - date
  - stock_class_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Split Transaction → Carta

> Object describing a split of a stock class

## OCF schema

Source: [`StockClassSplit.schema.json`](./StockClassSplit.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/split/StockClassSplit.schema.json",
  "title": "Object - Stock Split Transaction",
  "description": "Object describing a split of a stock class",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/StockClassTransaction.schema.json"
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
      "const": "TX_STOCK_CLASS_SPLIT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stock_class_id": {
      "description": "Identifier of the StockClass object, a subject of this transaction",
      "type": "string"
    },
    "split_ratio": {
      "description": "Ratio of new shares to old shares. For 2-for-1 split the numerator of the ratio is 2 and the denominator is 1.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "split_ratio",
    "id",
    "object_type",
    "date",
    "stock_class_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/split/StockClassSplit.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
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
    reason: no-equivalent
    values:
      TX_STOCK_CLASS_SPLIT: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stock_class_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  split_ratio:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no stock-split (or any share-adjustment) transaction, so the whole object is unmappable.** A grep for `split` / `Split` across the pinned bundle (`target-schema/Carta.schema.json`) and the `/tmp/carta-index.json` def index returns only `OptionGrant.isoNsoSplit` (a boolean about the $100K ISO/NSO tax split — unrelated) and the prose word "split" inside the `PreferredShareClassDetails` description. A grep for `ratio` / `Ratio` returns only `ShareClassRightsAndPreferences.conversionRatio`. Carta's transaction surface is the closed `{Certificate,Convertible,Option,Phantom,Piu,Rsa,Rsu,Sar,Warrant}{Issuance,Cancellation,Exercise,…}Transaction` family — every member is an issuance, exercise, settlement, transfer, or cancellation of a single security. None models a recapitalization event that rewrites the share counts/par of an entire stock class.
- **A stock-class split is a class-level recapitalization, not a per-security transaction.** OCF's `StockClassSplit` composes `StockClassTransaction` (not `SecurityTransaction`): it carries a `stock_class_id` and a `split_ratio` and re-bases every outstanding security in that class (a 2-for-1 split doubles share counts and halves per-share price across the class). Carta records only the resulting ledger *state* (the post-split `ShareClass`, `Certificate`, and `ShareClassValuation` numbers), never the split *event* that produced it, so there is no object to attach this transaction to.
- **`conversionRatio` is not a home for `split_ratio`.** The only ratio-shaped field in Carta is `#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio` (a `Decimal`). That is a static *right* of a preferred class — the number of common shares each preferred share converts into — not a transaction-time recapitalization factor applied to a class. Re-routing `split_ratio` there would (a) overwrite an unrelated preferred-conversion term and (b) silently lose the split's event semantics and effective date. It is deliberately *not* mapped. (Note also a units mismatch: OCF's `split_ratio` is a structured `Ratio` of two `Numeric` parts — `numerator`/`denominator`, e.g. 2:1 — whereas Carta's `conversionRatio` is a single `Decimal`.)
- Per-field justification:
    - `object_type` (const `TX_STOCK_CLASS_SPLIT`): the discriminator for the stock-split concept itself. Because Carta has no split/adjustment transaction there is no target enum to remap onto — hence `no-equivalent` (not `ocf-internal`). The single OCF enum value `TX_STOCK_CLASS_SPLIT` is listed under `values:` and maps to `null`. (Contrast `id`/`comments`, which are scaffolding present on every OCF object and therefore `ocf-internal`.)
    - `date`: OCF records the calendar date the split took effect (`types/Date.schema.json`, an `Iso8601CompleteCalendarDate`-style value). Carta's transaction timestamps are `Iso8601CompleteCalendarDateTime` and live on the transaction types Carta actually has; with no split transaction there is no datetime field to carry it. `no-equivalent`. (Even where Carta *does* have an analogous transaction, note the date-vs-datetime granularity gap: OCF stores a DATE, Carta a DATETIME.)
    - `stock_class_id`: the foreign key to the `StockClass` being split. Carta does carry a `shareClassId` concept on objects like `ShareClassValuation` and `OptionPoolSummary`, so the *identifier concept* exists — but only on state objects, not on any split/adjustment transaction. With no split transaction to attach it to, there is nowhere to record "the class this split applies to." `no-equivalent`.
    - `split_ratio` (`types/Ratio.schema.json` → `numerator`/`denominator`, both `Numeric`): the new-shares-to-old-shares ratio. Carta has no transaction-level ratio/factor field, and its only `Ratio`-adjacent field (`ShareClassRightsAndPreferences.conversionRatio`) is an unrelated preferred-conversion right (see above). There is no faithful target, so it drops. `no-equivalent`. (Per the project's bucket policy, `Ratio` itself is an OCF *type*; on this OCF *object* its single referenced field is mapped directly here and is genuinely homeless.)
    - `id`, `comments`: OCF object scaffolding. `id` is OCF's own identifier (Carta assigns identifiers server-side); `comments` has no Carta slot. Both `ocf-internal`.
- Object-level routing: a `TX_STOCK_CLASS_SPLIT` is dropped entirely on import to Carta. Because Carta stores post-split ledger state rather than the recapitalization event, the closest faithful behavior is to feed Carta the already-split share counts and per-share prices (the snapshot *after* applying the OCF split), not to replay the split as a transaction.
- Consistency: the sibling class-level adjustment transactions that OCF models as their own events — `StockClassAuthorizedSharesAdjustment`, `StockClassConversionRatioAdjustment`, `IssuerAuthorizedSharesAdjustment`, `StockPlanPoolAdjustment` — share this same "Carta records state, not the adjustment event" situation and should reach the same all-unmappable conclusion for their event-specific fields.
