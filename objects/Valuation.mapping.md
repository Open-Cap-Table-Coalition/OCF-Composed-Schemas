---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Valuation.schema.json
ocf_object_type: VALUATION
ocf_title: Object - Valuation
ocf_kind: object
required_fields:
  - price_per_share
  - effective_date
  - valuation_type
  - stock_class_id
  - id
  - object_type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Valuation → Carta

> Object describing a valuation used in the cap table

## OCF schema

Source: [`Valuation.schema.json`](./Valuation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Valuation.schema.json",
  "title": "Object - Valuation",
  "description": "Object describing a valuation used in the cap table",
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
      "const": "VALUATION"
    },
    "provider": {
      "description": "Entity which provided the valuation",
      "type": "string"
    },
    "board_approval_date": {
      "description": "Date on which board approved the valuation. This is essential for 409A valuations, in particular, which require the Board to approve the valuation.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "This optional field tracks when the stockholders approved the valuation.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "price_per_share": {
      "description": "Valued price per share",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "effective_date": {
      "description": "Date on which this valuation is first valid",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stock_class_id": {
      "description": "Identifier of the stock class for this valuation",
      "type": "string"
    },
    "valuation_type": {
      "description": "Seam for supporting different types of valuations in future versions",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ValuationType.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "price_per_share",
    "effective_date",
    "valuation_type",
    "stock_class_id",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/Valuation.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 10/10

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
      VALUATION: null
  provider:
    kind: unmappable
    target: null
    reason: no-equivalent
  board_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stockholder_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  price_per_share:
    kind: rename
    target: "#/$defs/ShareClassValuation/properties/price"
  effective_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stock_class_id:
    kind: rename
    target: "#/$defs/ShareClassValuation/properties/shareClassId"
  valuation_type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      409A: null
```

## Notes / open questions

- Carta models this concept as its own reusable `$def`, `ShareClassValuation` ("The fair market valuation price for a share class."), so OCF `Valuation` maps to it object-to-object. `ShareClassValuation` carries only four fields: `shareClassId`, `shareClassName`, `common` (true if common, false if preferred), and `price` (`$ref: Money`). It is the one Carta structure that captures a per-share-class FMV price.
- `price_per_share` (OCF `Monetary`) → `ShareClassValuation.price` (Carta `Money`). This is the substantive payload of the object. The OCF `Monetary` sub-fields route through the `Monetary → Money` type mapping (`amount → Money.amount`, `currency → Money.currencyCode`).
- `stock_class_id` → `ShareClassValuation.shareClassId`. Both are the foreign key to the (share/stock) class the valuation applies to. Note the OCF/Carta naming difference ("stock class" vs. "share class") is purely terminological; this is the same identifier role used throughout both schemas.
- `ShareClassValuation.shareClassName` and `ShareClassValuation.common` have no OCF `Valuation` counterpart. OCF carries only the `stock_class_id` foreign key, not a denormalized class name, and OCF does not flag common-vs-preferred on the valuation object — that lives on the referenced `StockClass`. These two Carta fields are therefore left unmapped (no OCF source).
- The following OCF fields have no counterpart on Carta's `ShareClassValuation` (which records only price + the share-class identity), and nothing valuation-adjacent in the bundle stores them, so they are `no-equivalent`:
    - `effective_date` (OCF `Date`): Carta's `ShareClassValuation` records no date at all — neither an as-of/effective date nor a board-approval date. The only `valuation`/`evaluation` date tokens in the bundle are `PerformanceCondition.evaluationDate` (a vesting-condition test date) and `ConvertibleIssuanceTransaction.valuationCap` (a convertible's cap amount, not a date) — both unrelated to a 409A FMV. So a `ShareClassValuation` price carries no temporal qualifier in Carta.
    - `board_approval_date`, `stockholder_approval_date` (OCF `Date`): OCF tracks the governance/approval dates that 409A valuations in particular require; Carta's `ShareClassValuation` has no approval-tracking fields.
    - `provider`: OCF records the entity that produced the valuation (e.g., the 409A firm); Carta's `ShareClassValuation` has no provider/source field.
    - `valuation_type` (OCF enum `ValuationType`): the OCF enum currently has a single member, `409A`, and is described as a "seam for supporting different types of valuations in future versions." Carta has no valuation-type discriminator on `ShareClassValuation` (and no enum for valuation kinds anywhere in the bundle) — every `ShareClassValuation` is implicitly an FMV price with no typed category — so there is no Carta enum to remap onto. `409A → null`.
- `id`, `comments`, `object_type`: OCF object scaffolding. `id` is OCF's own identifier (Carta assigns its own server-side); `object_type` is the OCF discriminator (`const: "VALUATION"`) that Carta does not need (it types positionally per endpoint, so `VALUATION → null`); `comments` has no Carta slot. All three are `ocf-internal`.
