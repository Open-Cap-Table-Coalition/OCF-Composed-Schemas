---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/PlanSecurityExercise.schema.json
ocf_object_type: TX_PLAN_SECURITY_EXERCISE
ocf_title: Object - Plan Security Exercise
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Exercise → Carta

> Object for a plan security exercise (which is a compatibility wrapper for Equity Compensation Exercise)

## OCF schema

Source: [`PlanSecurityExercise.schema.json`](./PlanSecurityExercise.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/PlanSecurityExercise.schema.json",
  "title": "Object - Plan Security Exercise",
  "description": "Object for a plan security exercise (which is a compatibility wrapper for Equity Compensation Exercise)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/EquityCompensationExercise.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_EXERCISE"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/exercise/PlanSecurityExercise.schema.json",
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      TX_PLAN_SECURITY_EXERCISE: null
```

## Notes / open questions

- **This is a thin compatibility wrapper, not a distinct transaction.** `PlanSecurityExercise` exists only to preserve the legacy `TX_PLAN_SECURITY_EXERCISE` discriminator. Its sibling `.schema.json` `allOf`-composes `EquityCompensationExercise` and then re-declares exactly one property locally — `object_type`, narrowed from the shared `enum [TX_PLAN_SECURITY_EXERCISE, TX_EQUITY_COMPENSATION_EXERCISE]` down to the `const "TX_PLAN_SECURITY_EXERCISE"`. The validator counts source properties from the literal `properties` block of the sibling schema (it does not flatten `allOf`), so the only in-scope field here is `object_type` (N = 1). The substantive economic mapping for an equity-compensation exercise — `quantity`, `date`, `security_id`, `consideration_text`, `resulting_security_ids`, `id`, `comments` — lives in the inherited base and is handled in `EquityCompensationExercise.mapping.md`; this wrapper file deliberately maps only its own one field.
- **`object_type` is OCF-internal scaffolding, so it is `unmappable` / `ocf-internal`.** It is OCF's transaction discriminator constant. Carta does not type transactions with a discriminator property: it uses distinct named transaction types instead. An OCF equity-compensation / plan-security exercise corresponds at the object level to Carta's `#/$defs/OptionExerciseTransaction` (with `#/$defs/OptionExercise` / `#/$defs/OptionGrant` context), but that type carries no `object_type`/`type` field, and there is no Carta enum anywhere in the bundle whose members name transaction kinds (a scan of every enum `$def` for `TX_`, `TRANSACTION_TYPE`, or `OBJECT_TYPE` returns nothing). The Carta transaction type is selected positionally by the endpoint/type chosen, not by a value carried inside the payload. There is therefore no Carta field or enum member to remap the constant to.
- The `values:` block maps the sole OCF constant `TX_PLAN_SECURITY_EXERCISE` to `null` because there is no Carta discriminator value to remap it to. (Both OCF object types `TX_PLAN_SECURITY_EXERCISE` and `TX_EQUITY_COMPENSATION_EXERCISE` denote the *same* equity-compensation exercise event; OCF announced `TX_PLAN_SECURITY_EXERCISE` will be deprecated in v2.0.0. Carta collapses both onto the single `OptionExerciseTransaction` type regardless of which legacy OCF tag was used.)
- This object is `ocf_kind: object`, so the 3-bucket OCF-*type* policy does not apply (classification: `n/a-object`). An OCF transaction maps to its corresponding Carta transaction; here the wrapper contributes no economic fields of its own, only the discriminator, which is `ocf-internal` exactly as in the gold precedent `objects/transactions/consolidation/StockConsolidation.mapping.md`.
