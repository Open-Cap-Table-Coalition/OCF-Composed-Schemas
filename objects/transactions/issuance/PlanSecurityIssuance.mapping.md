---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/PlanSecurityIssuance.schema.json
ocf_object_type: TX_PLAN_SECURITY_ISSUANCE
ocf_title: Object - Plan Security Issuance
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Issuance → Carta

> A Plan Security Issuance is a transaction to issue plan securities (it's a compatibility wrapper for Equity Compensation Issuances)

## OCF schema

Source: [`PlanSecurityIssuance.schema.json`](./PlanSecurityIssuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/PlanSecurityIssuance.schema.json",
  "title": "Object - Plan Security Issuance",
  "description": "A Plan Security Issuance is a transaction to issue plan securities (it's a compatibility wrapper for Equity Compensation Issuances)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/EquityCompensationIssuance.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_ISSUANCE"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/issuance/PlanSecurityIssuance.schema.json",
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      TX_PLAN_SECURITY_ISSUANCE: null
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FPlanSecurityIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FPlanSecurityIssuance.mapping.md&title=%5BMapping+question%5D+PlanSecurityIssuance) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FPlanSecurityIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FPlanSecurityIssuance.mapping.md&title=%5BMapping+question%5D+PlanSecurityIssuance+%2F+object_type&property_path=object_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **This is a thin compatibility wrapper, not a distinct transaction.** `PlanSecurityIssuance` exists only to preserve the legacy `TX_PLAN_SECURITY_ISSUANCE` discriminator. Its sibling `.schema.json` `allOf`-composes `EquityCompensationIssuance` and then re-declares exactly one property locally — `object_type`, narrowed from the shared `enum [TX_PLAN_SECURITY_ISSUANCE, TX_EQUITY_COMPENSATION_ISSUANCE]` down to the `const "TX_PLAN_SECURITY_ISSUANCE"`. The validator counts source properties from the literal `properties` block of the sibling schema (it does not flatten `allOf`), so the only in-scope field here is `object_type` (N = 1). The substantive economic mapping for an equity-compensation issuance — `compensation_type`, `option_grant_type`, `quantity`, `exercise_price`, `base_price`, `early_exercisable`, `vesting_terms_id`, `vestings`, `expiration_date`, `termination_exercise_windows`, `security_law_exemptions`, `stock_plan_id`, `stock_class_id`, `date`, `security_id`, `stakeholder_id`, etc. — lives in the inherited base and is handled in `EquityCompensationIssuance.mapping.md`; this wrapper file deliberately maps only its own one field.
- **`object_type` is OCF-internal scaffolding, so it is `unmappable` / `ocf-internal`.** It is OCF's transaction discriminator constant. Carta does not type transactions with a discriminator property: it uses distinct named transaction types instead. An OCF equity-compensation / plan-security option issuance corresponds at the object level to Carta's `#/$defs/OptionIssuanceTransaction` (with `#/$defs/OptionGrant` context), but that type carries no `object_type`/`type` field (its properties are `issueDatetime`, `quantity`, `stockOptionType`, `exercisePrice`, `equityPlanId`, `shareClassId`, `expirationDatetime`, `vestingScheduleTemplateId`), and there is no Carta enum anywhere in the bundle whose members name transaction kinds (a scan of every enum `$def` for `TX_`, `TRANSACTION_TYPE`, or `OBJECT_TYPE` returns nothing). The Carta transaction type is selected positionally by the endpoint/type chosen, not by a value carried inside the payload. There is therefore no Carta field or enum member to remap the constant to.
- The `values:` block maps the sole OCF constant `TX_PLAN_SECURITY_ISSUANCE` to `null` because there is no Carta discriminator value to remap it to. (Both OCF object types `TX_PLAN_SECURITY_ISSUANCE` and `TX_EQUITY_COMPENSATION_ISSUANCE` denote the *same* equity-compensation issuance event; OCF announced `TX_PLAN_SECURITY_ISSUANCE` will be deprecated in v2.0.0. Carta collapses both onto the single `OptionIssuanceTransaction` type regardless of which legacy OCF tag was used. Note RSU/SAR compensation types in the underlying equity-compensation issuance route at the object level to Carta's distinct `RsuIssuanceTransaction` / `SarIssuanceTransaction`, but that compensation-type routing is a base-schema concern handled in `EquityCompensationIssuance.mapping.md`, not in this discriminator-only wrapper.)
- This object is `ocf_kind: object`, so the 3-bucket OCF-*type* policy does not apply (classification: `n/a-object`). An OCF transaction maps to its corresponding Carta transaction; here the wrapper contributes no economic fields of its own, only the discriminator, which is `ocf-internal` exactly as in the gold precedents `objects/transactions/exercise/PlanSecurityExercise.mapping.md` (the issuance-side twin of this file) and `objects/transactions/consolidation/StockConsolidation.mapping.md`.
