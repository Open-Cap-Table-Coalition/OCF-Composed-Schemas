---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockPlan.schema.json
ocf_object_type: STOCK_PLAN
ocf_title: Object - Stock Plan
ocf_kind: object
required_fields:
  - plan_name
  - initial_shares_reserved
  - id
  - object_type
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Plan → Carta

> Object describing a plan which stock options are issued from

## OCF schema

Source: [`StockPlan.schema.json`](./StockPlan.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockPlan.schema.json",
  "title": "Object - Stock Plan",
  "description": "Object describing a plan which stock options are issued from",
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
      "const": "STOCK_PLAN"
    },
    "plan_name": {
      "description": "Name for the stock plan",
      "type": "string"
    },
    "board_approval_date": {
      "description": "Date on which board approved the plan",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "This optional field tracks when the stockholders approved this stock plan. This is intended for use by US companies that want to issue Incentive Stock Options (ISOs), as the issuing StockPlan must receive shareholder approval within a specified time frame in order to issue valid ISOs.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "initial_shares_reserved": {
      "description": "The initial number of shares reserved in the pool for this stock plan by the Board or equivalent body.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "default_cancellation_behavior": {
      "description": "If a security issued under this Stock Plan is cancelled, what happens to the reserved shares by default? NOTE: for any given security issued from the pool, the Plan's default cancellation behavior can be overridden by subsequent transactions cancelling the reserved stock, returning it to pool or marking it as capital stock. The event chain should always control - do not rely on this field and fail to traverse the events.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockPlanCancellationBehaviorType.schema.json"
    },
    "stock_class_id": {
      "description": "[DEPRECATED in favor of stock_class_ids] Identifier of the StockClass object this plan is composed of.",
      "type": "string",
      "deprecated": "true"
    },
    "stock_class_ids": {
      "description": "Identifiers of StockClass objects this plan is composed of",
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string"
      }
    }
  },
  "oneOf": [
    {
      "required": [
        "stock_class_id"
      ],
      "not": {
        "required": [
          "stock_class_ids"
        ]
      },
      "$comment": "Due to how the JSONSchema 'not' works, this means that, if stock_class_id is present, stock_class_ids cannot be present"
    },
    {
      "required": [
        "stock_class_ids"
      ],
      "not": {
        "required": [
          "stock_class_id"
        ]
      },
      "$comment": "Due to how the JSONSchema 'not' works, this means that, if stock_class_ids is present, stock_class_id cannot be present"
    }
  ],
  "additionalProperties": false,
  "required": [
    "plan_name",
    "initial_shares_reserved",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/StockPlan.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  id:
    kind: rename
    target: "#/$defs/OptionPoolSummary/properties/optionPoolId"
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      STOCK_PLAN: null
  plan_name:
    kind: rename
    target:
      - "#/$defs/OptionPoolSummary/properties/name"
      - "#/$defs/OptionGrant/properties/equityIncentivePlanName"
      - "#/$defs/RestrictedStockAward/properties/equityIncentivePlanName"
      - "#/$defs/RestrictedStockUnit/properties/equityIncentivePlanName"
  board_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stockholder_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  initial_shares_reserved:
    kind: rename
    target: "#/$defs/OptionPoolSummary/properties/authorizedShares"
  default_cancellation_behavior:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      RETIRE: null
      RETURN_TO_POOL: null
      HOLD_AS_CAPITAL_STOCK: null
      DEFINED_PER_PLAN_SECURITY: null
  stock_class_id:
    kind: rename
    target: "#/$defs/OptionPoolSummary/properties/shareClassId"
  stock_class_ids:
    kind: select
    target: "#/$defs/OptionPoolSummary/properties/shareClassId"
    policy: first_stock_class_id
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+object_type&property_path=object_type) |
| `plan_name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+plan_name&property_path=plan_name) |
| `board_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+board_approval_date&property_path=board_approval_date) |
| `stockholder_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+stockholder_approval_date&property_path=stockholder_approval_date) |
| `initial_shares_reserved` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+initial_shares_reserved&property_path=initial_shares_reserved) |
| `default_cancellation_behavior` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+default_cancellation_behavior&property_path=default_cancellation_behavior) |
| `stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+stock_class_id&property_path=stock_class_id) |
| `stock_class_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+stock_class_ids&property_path=stock_class_ids) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Target object.** OCF `StockPlan` is the equity-incentive pool that options/RSUs/RSAs are issued from. Carta models this concept as `OptionPoolSummary` ("Option pool summary."), the only Carta `$def` that carries the option-pool identity (`optionPoolId`), its name, its backing share class, and an authorized-shares count. The plan *name* itself is also denormalized onto every award as `OptionGrant.equityIncentivePlanName` / `RestrictedStockAward.equityIncentivePlanName` / `RestrictedStockUnit.equityIncentivePlanName` ("The name of the equity incentive plan (i.e., option plan) ..."), confirming that an OCF StockPlan = a Carta option pool. `StakeholderOptionPoolSummary` is the same concept narrowed to one stakeholder and has no `authorizedShares`/`name`-vs-plan distinction beyond `OptionPoolSummary`, so the full `OptionPoolSummary` is the correct object-level target.
- **`id` → `OptionPoolSummary.optionPoolId`.** The OCF plan identifier is the identity used by `stock_plan_id`; Carta exposes the same pool identity as `optionPoolId`.
- **`plan_name` → `OptionPoolSummary.name` and award names.** The pool name is also denormalized to `OptionGrant.equityIncentivePlanName`, `RestrictedStockAward.equityIncentivePlanName`, and `RestrictedStockUnit.equityIncentivePlanName`; all four targets carry the same OCF plan name.
- **`initial_shares_reserved` → `OptionPoolSummary.authorizedShares`** (lossy, semantically the closest available slot). OCF's field is explicitly the *initial* Board-reserved pool size (`Numeric` string). Carta's `authorizedShares` (`$ref: Decimal`, no description) is the pool's authorized share count, but the bundle does not document its temporal semantics (initial vs. current-after-amendments vs. as-of). OCF separately tracks pool changes through `StockPlanPoolAdjustment` transactions, so a faithful round-trip would set `authorizedShares` from the *initial* reservation only and let later adjustments move it; consumers wanting the current pool size must replay those events. There is no Carta field that preserves the "initial" qualifier, so this rename loses that distinction. `OptionPoolSummary` also exposes `fullyDilutedShares`, `outstandingEquityAwardDerivatives`, and `outstandingCommittedRestrictedStockAwards`, but those are computed roll-ups of issuances, not the reservation, and are not appropriate targets for the initial reserve.
- **`stock_class_id` (deprecated, singular) → `OptionPoolSummary.shareClassId`.** Direct rename; Carta's `shareClassId` is "the share class used by the option pool to issue equity," which is exactly OCF's "StockClass object this plan is composed of."
- **`stock_class_ids` (array) → `OptionPoolSummary.shareClassId`** (cardinality loss). OCF allows a pool to span *multiple* stock classes (array, `minItems: 1`); Carta's `OptionPoolSummary` models only a *single* `shareClassId` (there is no `shareClassIds` plural anywhere in the bundle — the only plural is the inverse `ShareClassSummary.optionPoolIds`, i.e. one share class → many pools). The OCF schema's `oneOf` guarantees that exactly one of `stock_class_id` / `stock_class_ids` is present, so for any given record only one of these two targets is exercised. When `stock_class_ids` holds more than one id, the explicit `first_stock_class_id` policy selects one and the remainder are dropped; this multi-class case has no faithful Carta representation.
- **`board_approval_date` / `stockholder_approval_date` → unmappable (no-equivalent).** `OptionPoolSummary` records no plan-governance dates. Its only temporal field is `terminatedDatetime` (`Iso8601CompleteCalendarDateTime`), which is the pool's *termination* timestamp — not a board-approval or stockholder-approval (ISO-qualification) date — so it is not a valid target for either. Carta carries board-approval data on individual securities (`OptionGrant.boardApprovalDate`, etc.), but those are per-grant approvals, not the plan-level approval OCF describes here, and there is no plan-level slot for stockholder approval anywhere in the bundle.
- **`default_cancellation_behavior` → unmappable (no-equivalent).** OCF stores a *plan-level default rule* (`StockPlanCancellationBehaviorType`: `RETIRE`, `RETURN_TO_POOL`, `HOLD_AS_CAPITAL_STOCK`, `DEFINED_PER_PLAN_SECURITY`) governing what happens to reserved shares when a plan security is cancelled. Carta has no pool-level cancellation-behavior field. Its `OptionPoolSummary` has no enum at all, and Carta's cancellation modeling is entirely *per-security and reason-oriented* (`OptionCancellationReason`, `RsaCancellationReason`, `RsuCancellationReason`, `SarCancellationReason`, etc., e.g. `OPTION_CANCELLATION_REASON_TERMINATION_FORFEITED`). Those enumerate *why* a specific award was cancelled, not the *default disposition of pool shares*, and OCF's own description warns that the event chain (per-security cancel/return/retire transactions) is authoritative over this default field — so there is no value-by-value remap onto any Carta enum. All four OCF values are therefore `null`.
- **`comments`, `object_type` → unmappable (ocf-internal).** `object_type` is OCF's `STOCK_PLAN` discriminator, which Carta encodes positionally by object type rather than as a field. `comments` has no Carta slot.
</content>
</invoke>
