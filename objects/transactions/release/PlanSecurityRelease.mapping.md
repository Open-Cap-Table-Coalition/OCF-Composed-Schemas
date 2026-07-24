---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/PlanSecurityRelease.schema.json
ocf_object_type: TX_PLAN_SECURITY_RELEASE
ocf_title: Object - Plan Security Release
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Release → Carta

> Object describing plan security release transaction (a compatibility wrapper for equity compensation release event

## OCF schema

Source: [`PlanSecurityRelease.schema.json`](./PlanSecurityRelease.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/PlanSecurityRelease.schema.json",
  "title": "Object - Plan Security Release",
  "description": "Object describing plan security release transaction (a compatibility wrapper for equity compensation release event",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/EquityCompensationRelease.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_RELEASE"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/release/PlanSecurityRelease.schema.json",
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
      TX_PLAN_SECURITY_RELEASE: null
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frelease%2FPlanSecurityRelease.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frelease%2FPlanSecurityRelease.mapping.md&title=%5BMapping+question%5D+PlanSecurityRelease) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frelease%2FPlanSecurityRelease.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frelease%2FPlanSecurityRelease.mapping.md&title=%5BMapping+question%5D+PlanSecurityRelease%3A+object_type&property_path=object_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **This is a thin compatibility wrapper, not a distinct transaction.** `PlanSecurityRelease` exists only to preserve the legacy `TX_PLAN_SECURITY_RELEASE` discriminator. Its sibling `.schema.json` `allOf`-composes `EquityCompensationRelease` and then re-declares exactly one property locally — `object_type`, narrowed from the shared `enum [TX_PLAN_SECURITY_RELEASE, TX_EQUITY_COMPENSATION_RELEASE]` down to the `const "TX_PLAN_SECURITY_RELEASE"`. The validator counts source properties from the literal `properties` block of the sibling schema (it does not flatten `allOf`), so the only in-scope field here is `object_type` (N = 1). The substantive economic mapping for an equity-compensation release — `date`, `security_id`, `settlement_date`, `release_price`, `quantity`, `consideration_text`, `resulting_security_ids`, plus the inherited `id`/`comments` — lives in the inherited base and is handled in `EquityCompensationRelease.mapping.md`; this wrapper file deliberately maps only its own one field. This is the release-side twin of the gold precedent `objects/transactions/issuance/PlanSecurityIssuance.mapping.md`.
- **`object_type` is OCF-internal scaffolding, so it is `unmappable` / `ocf-internal`.** It is OCF's transaction discriminator constant. Carta does not type transactions with a discriminator property: it uses distinct named transaction types instead. There is no Carta enum anywhere in the bundle whose members name transaction kinds — a scan of every enum `$def` and of the whole pinned bundle for `TX_`, `TRANSACTION_TYPE`, or `OBJECT_TYPE` returns nothing. The Carta transaction type is selected positionally by the endpoint/type chosen, not by a value carried inside the payload, so there is no Carta field or enum member to remap the constant to.
- **Carta has no release-transaction type at all.** OCF's release-transaction family (`Release.schema.json`) has no analogue in Carta's transaction surface. The complete Carta transaction set is the certificate / option / convertible / warrant / RSA / RSU / SAR / phantom / PIU issuance-cancellation-exercise-settlement-transfer types (`CertificateIssuanceTransaction`, `OptionIssuanceTransaction`, `ConvertibleIssuanceTransaction`, `WarrantIssuanceTransaction`, `RsaIssuanceTransaction`, `RsuIssuanceTransaction`, `RsuSettlementTransaction`, `SarIssuanceTransaction`, …) — there is no `ReleaseTransaction` and no `…ReleaseItem`. The string `release` appears in Carta only as RSU-grant/settlement *attributes* (`RestrictedStockUnit.releasedQuantity`/`releasePricePerShare`, `RestrictedStockUnitSettlement.releaseQuantity`), which describe how many units of an RSU grant have been released-to-shares — they are NOT a transaction-type discriminator and are NOT a target for this constant. The semantically closest Carta object-level home for an OCF equity-compensation release (the conversion of vested/held plan units into issued shares, with a settlement date, release price, quantity, and resulting security ids) is the RSU settlement surface — `#/$defs/RsuSettlementTransaction` (`settlementDatetime`, `settledQuantity`, `withheldQuantity`, `resultingSecurityId`) and `#/$defs/RestrictedStockUnitSettlement` (`settlementDate`, `releaseQuantity`, `settlementPrice`, `certificateId`) — but that object-level routing is a base-schema concern handled in `EquityCompensationRelease.mapping.md`, not in this discriminator-only wrapper. (Note also the date-vs-datetime granularity difference: OCF `date`/`settlement_date` are calendar DATES while the Carta settlement transaction uses `Iso8601CompleteCalendarDateTime`.)
- The `values:` block maps the sole OCF constant `TX_PLAN_SECURITY_RELEASE` to `null` because there is no Carta discriminator value to remap it to. Both OCF object types `TX_PLAN_SECURITY_RELEASE` and `TX_EQUITY_COMPENSATION_RELEASE` denote the *same* equity-compensation release event; OCF announced `TX_PLAN_SECURITY_RELEASE` will be deprecated in v2.0.0. Carta carries no transaction tag inside the payload regardless of which legacy OCF discriminator was used.
- This object is `ocf_kind: object`, so the 3-bucket OCF-*type* policy does not apply (classification: `n/a-object`). An OCF transaction maps to its corresponding Carta transaction; here the wrapper contributes no economic fields of its own, only the discriminator, which is `ocf-internal` exactly as in the gold precedents `objects/transactions/issuance/PlanSecurityIssuance.mapping.md` (the issuance-side twin of this file) and `objects/transactions/consolidation/StockConsolidation.mapping.md`.
</content>
</invoke>
