---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/PlanSecurityAcceptance.schema.json
ocf_object_type: TX_PLAN_SECURITY_ACCEPTANCE
ocf_title: Object - Plan Security Acceptance
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Acceptance → Carta

> An object that represents a plan security acceptance transaction, which is just a compatibility wrapper for an Equity Compensation Acceptance.

## OCF schema

Source: [`PlanSecurityAcceptance.schema.json`](./PlanSecurityAcceptance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/PlanSecurityAcceptance.schema.json",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/EquityCompensationAcceptance.schema.json"
    }
  ],
  "title": "Object - Plan Security Acceptance",
  "description": "An object that represents a plan security acceptance transaction, which is just a compatibility wrapper for an Equity Compensation Acceptance.",
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_ACCEPTANCE",
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_ACCEPTANCE` will be deprecated in v2.0.0"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/acceptance/PlanSecurityAcceptance.schema.json",
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
      TX_PLAN_SECURITY_ACCEPTANCE: null
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FPlanSecurityAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FPlanSecurityAcceptance.mapping.md&title=%5BMapping+question%5D+PlanSecurityAcceptance) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FPlanSecurityAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FPlanSecurityAcceptance.mapping.md&title=%5BMapping+question%5D+PlanSecurityAcceptance%3A+object_type&property_path=object_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket: n/a-object.** This is an OCF transaction object (`ocf_kind: object`), so the 3-bucket type policy does not apply; the object's own properties map directly onto the corresponding Carta object's fields where one exists.
- **No Carta home for the standalone acceptance *transaction* — Carta records some acceptance dates on grants.** OCF models a security's acceptance by the stakeholder as a first-class, dated, security-scoped *transaction* object. Carta's transaction surface has **no acceptance transaction** of any kind (no `*AcceptanceTransaction` $def; the only acceptance fields in the bundle are `stakeholderAcceptanceDate` on `OptionGrant`/`RestrictedStockAward`/`RestrictedStockUnit`, and `acceptanceDate` on `Interest`). Carta records *that* a supported grant was accepted as an attribute of the security/grant itself, not as a standalone event object with its own id and discriminator. The OCF wrapper therefore has no direct Carta transaction home, while its inherited payload is handled by `EquityCompensationAcceptance`.
- **`PlanSecurityAcceptance` is a deprecated compatibility wrapper.** Per the OCF schema description, it is "just a compatibility wrapper for an Equity Compensation Acceptance"; the legacy `TX_PLAN_SECURITY_ACCEPTANCE` discriminator is retained only to avoid a breaking change and "will be deprecated in v2.0.0". The wrapper adds no fields of its own beyond narrowing `object_type` to the single const `TX_PLAN_SECURITY_ACCEPTANCE`.
- **The sibling source schema declares exactly one own property: `object_type`.** Although the *composed* schema (via the `allOf` ref to `EquityCompensationAcceptance`, which itself composes `Object`, `Transaction`, `SecurityTransaction`, and the `Acceptance` primitive) carries `id`, `comments`, `date`, and `security_id`, those properties belong to and are mapped on the wrapped `EquityCompensationAcceptance` object. The validator counts the keys in *this* file's sibling `.schema.json` `properties` block, which is the single key `object_type` (N = 1). The shared `id`/`comments`/`date`/`security_id` fields are handled in [`EquityCompensationAcceptance.mapping.md`](./EquityCompensationAcceptance.mapping.md), and this wrapper inherits that file's routed mappings: `date` → `OptionGrant.stakeholderAcceptanceDate` or `RestrictedStockUnit.stakeholderAcceptanceDate` for supported families, and `security_id` → the corresponding transaction-item/security identity paths (with SAR retaining only the transaction-item identity). Because a plan security is a compatibility alias for equity compensation, the acceptance payload is preserved wherever Carta has a defensible home; the standalone wrapper/discriminator remains OCF-only.
- **`object_type` → `unmappable` / `ocf-internal`.** This is the OCF transaction discriminator, fixed here to the const `TX_PLAN_SECURITY_ACCEPTANCE` (recorded explicitly as `values: { TX_PLAN_SECURITY_ACCEPTANCE: null }`, matching the discriminator handling in the sibling `EquityCompensationAcceptance` and `StockAcceptance` mappings). Per the project convention `id`/`object_type`/`comments` are OCF-internal scaffolding (the polymorphic-type tag is not data Carta ingests). Even setting the scaffolding convention aside, there is no Carta enum or object that distinguishes acceptance-transaction subtypes — Carta has no acceptance transaction at all and types positionally per endpoint rather than via a discriminator — so `reason: ocf-internal` is the most accurate classification (it would equally be `no-equivalent` on the strength of the missing concept). Not `enum-remap`: there is no Carta acceptance-subtype enum to remap into.
- **Net result:** 1/1 source properties classified; the only own property is the deprecated discriminator constant and is OCF-internal. The inherited acceptance payload is handled by the wrapped mapping: supported option/RSU dates land on the grant/security acceptance-date fields, the corresponding security identity is preserved, and unsupported families retain only whatever identity path exists. Only the standalone acceptance *event wrapper* (its own id + discriminator) has no Carta counterpart.
