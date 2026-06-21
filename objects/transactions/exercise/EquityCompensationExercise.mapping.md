---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/EquityCompensationExercise.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Exercise Transaction
ocf_kind: object
required_fields:
  - quantity
  - id
  - object_type
  - date
  - security_id
  - resulting_security_ids
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Equity Compensation Exercise Transaction → Carta

> Object describing equity compensation exercise transaction

## OCF schema

Source: [`EquityCompensationExercise.schema.json`](./EquityCompensationExercise.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/EquityCompensationExercise.schema.json",
  "title": "Object - Equity Compensation Exercise Transaction",
  "description": "Object describing equity compensation exercise transaction",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/SecurityTransaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/exercise/Exercise.schema.json"
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
      "enum": [
        "TX_PLAN_SECURITY_EXERCISE",
        "TX_EQUITY_COMPENSATION_EXERCISE"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_EXERCISE` will be deprecated in v2.0.0"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security exercise",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Exercise - Resulting Security ID Array",
      "description": "Identifier for the security (or securities) that resulted from the exercise",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "quantity": {
      "description": "Quantity of shares exercised",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "quantity",
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/exercise/EquityCompensationExercise.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 8/8

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
      TX_PLAN_SECURITY_EXERCISE: null
      TX_EQUITY_COMPENSATION_EXERCISE: null
  date:
    kind: rename
    target: "#/$defs/OptionExerciseTransaction/properties/sharesAcquiredDatetime"
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  consideration_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  resulting_security_ids:
    kind: rename
    target: "#/$defs/OptionExerciseTransaction/properties/resultingSecurityId"
  quantity:
    kind: rename
    target: "#/$defs/OptionExerciseTransaction/properties/quantity"
```

## Notes / open questions

- **Carta home = `OptionExerciseTransaction`.** OCF's `EquityCompensationExercise` (and its v1 alias `PlanSecurityExercise`) records the exercise of a plan/equity-compensation security — i.e. the conversion of vested options into shares. Carta models exactly this as `#/$defs/OptionExerciseTransaction` ("An exercise transaction for an option grant. Represents the conversion of options into shares."), which is the destination per the transaction surface. Carta's `OptionExerciseTransaction` carries only 8 fields: `id`, `sharesAcquiredDatetime`, `quantity`, `exerciseMethod` (enum), `recordType` (StockOptionType enum), `resultingSecurityId`, `resultingSecurityType`, `resultingSecurityLabel`.
- `date` → `sharesAcquiredDatetime`: OCF's `date` is the date on which the exercise occurred (`types/Date.schema.json`, a calendar **date**, `YYYY-MM-DD`). Carta's `sharesAcquiredDatetime` is `#/$defs/Iso8601CompleteCalendarDateTime` — a full **datetime**. This is the standard OCF-date → Carta-datetime granularity mismatch: OCF carries no time-of-day, so a serializer must widen the date to a datetime (e.g. append midnight UTC); the reverse direction truncates. The semantic event ("shares acquired on exercise") is the same.
- `quantity` → `quantity`: OCF `quantity` is `types/Numeric.schema.json` (a stringified decimal, "Quantity of shares exercised"); Carta `quantity` is `#/$defs/Decimal`. Same concept (shares exercised), straight rename with a numeric-string ↔ Decimal representation change only.
- `resulting_security_ids` → `resultingSecurityId`: **cardinality narrowing.** OCF allows an *array* of resulting security IDs (one exercise can spawn multiple resulting securities), whereas Carta's `OptionExerciseTransaction.resultingSecurityId` is a single string. The common case (one option exercise → one resulting share certificate) round-trips cleanly; an OCF exercise that lists multiple `resulting_security_ids` cannot be represented without loss / splitting into multiple Carta records. Carta additionally exposes `resultingSecurityType` and `resultingSecurityLabel` describing that single resulting security (e.g. "certificate" / "CS-42"), which have no OCF counterpart on this object.
- `security_id` → unmappable / `no-equivalent`: OCF's `security_id` points back to the *source* security being exercised (the plan/option security). Carta's `OptionExerciseTransaction` has **no field that references the source option grant** — its only `id` field is documented as "the identifier of the **exercise request** that initiated the exercise," not the grant's security id, and `resultingSecurityId` describes the *output* security, not the source. In Carta's model the linkage to the source grant is structural/positional: an exercise is carried under the grant it belongs to (`OptionGrant.securityId` identifies the grant, and `OptionGrant.exercises` is the array of that grant's exercises — note that array is typed as Carta's `Exercise` object, a separate richer shape than `OptionExerciseTransaction`, not this transaction). The source-security reference is therefore held by the parent container, not by any property on the exercise transaction itself. There is no leaf property on `OptionExerciseTransaction` to receive `security_id`; it is reconstructed at the object-graph level, not field-mapped.
- `consideration_text` → unmappable / `no-equivalent`: OCF stores free-text describing the consideration provided for the exercise. Carta has no free-text consideration field on the exercise transaction. The nearest structured Carta concept is `exerciseMethod` (`OptionExerciseMethod` enum: CASH / CASHLESS / PUBLIC_NET / BLENDED / PUBLIC_CASHLESS) — but that is a constrained enum describing *how the exercise was funded*, not a free-text description of consideration, so OCF's unstructured `consideration_text` cannot be losslessly remapped onto it. Conversely Carta's `exerciseMethod` has no OCF counterpart on this object.
- `object_type` → unmappable / `ocf-internal`: OCF's discriminator enum (`TX_PLAN_SECURITY_EXERCISE`, the v1 alias kept for backward compatibility and deprecated in v2.0.0, and `TX_EQUITY_COMPENSATION_EXERCISE`). Both values denote the same exercise concept, which Carta types positionally as `OptionExerciseTransaction` — there is no per-record type discriminator to remap onto, so both enum values route to `null`. (Carta's `recordType` on this object is a `StockOptionType` — ISO/NSO/etc. — describing the option's tax character, which is unrelated to OCF's `object_type` discriminator and has no OCF source field here.)
- `id`, `comments` → unmappable / `ocf-internal`: standard OCF object scaffolding. OCF's `id` identifies the OCF transaction object and Carta assigns its own server-side identifiers; note that Carta's same-named `OptionExerciseTransaction.id` is semantically *different* ("identifier of the exercise request"), so mapping OCF `id` onto it would be wrong. `comments` has no Carta slot.
- **Unused Carta fields:** `exerciseMethod`, `recordType`, `resultingSecurityType`, and `resultingSecurityLabel` have no source field on this OCF object and are left unpopulated.
