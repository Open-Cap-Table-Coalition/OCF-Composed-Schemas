---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/PlanSecurityTransfer.schema.json
ocf_object_type: TX_PLAN_SECURITY_TRANSFER
ocf_title: Object - Plan Security Transfer
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Transfer → Carta

> Object describing plan security transfer transaction (a compatibility wrapper for equity compensation transfer event)

## OCF schema

Source: [`PlanSecurityTransfer.schema.json`](./PlanSecurityTransfer.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/PlanSecurityTransfer.schema.json",
  "title": "Object - Plan Security Transfer",
  "description": "Object describing plan security transfer transaction (a compatibility wrapper for equity compensation transfer event)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/EquityCompensationTransfer.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_TRANSFER"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/transfer/PlanSecurityTransfer.schema.json",
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
    reason: no-equivalent
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FPlanSecurityTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FPlanSecurityTransfer.mapping.md&title=%5BMapping+question%5D+PlanSecurityTransfer) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FPlanSecurityTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FPlanSecurityTransfer.mapping.md&title=%5BMapping+question%5D+PlanSecurityTransfer%3A+object_type&property_path=object_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket: n/a-object.** This is an OCF transaction object (`ocf_kind: object`), so it is never a bucket-2 type. It would normally map its own properties directly onto the corresponding Carta transaction object. Here the only property the sibling schema declares in its own `properties` block is `object_type` (the `const` discriminator `TX_PLAN_SECURITY_TRANSFER`); every other transaction field (`id`, `comments`, `date`, `security_id`, `consideration_text`, `balance_security_id`, `resulting_security_ids`, `quantity`) is contributed through the `allOf` `$ref` to `EquityCompensationTransfer.schema.json` and is therefore covered by that sibling's mapping, not this wrapper's. The validator counts source properties from this file's own `properties` block, so N = 1 and the only field to classify here is `object_type`.
- **Carta has no plan-security / equity-compensation transfer transaction.** Grepping the pinned bundle (`target-schema/Carta.schema.json`) for transfer transactions returns exactly one `$def` — `WarrantTransferTransaction` (`#/$defs/WarrantTransferTransaction`, with `transferredDatetime` / `quantity` / `resultingSecurityId` / `resultingSecurityLabel`). There is no `PlanSecurityTransferTransaction`, no `EquityCompensationTransferTransaction`, and no `OptionTransferTransaction`. Carta models the option / equity-compensation lifecycle with `OptionIssuanceTransaction`, `OptionExerciseTransaction`, and `OptionCancellationTransaction` (plus `OptionGrant`) — but it provides **no transfer event for option-type grants**. So this whole object has no Carta home, and its sole local field `object_type` is `unmappable` / `no-equivalent`.
- **Why `no-equivalent` and not `ocf-internal` for `object_type`.** On objects that *do* have a Carta home, `object_type` is OCF scaffolding (a discriminator Carta does not need, since Carta types its records positionally per endpoint) and would be marked `ocf-internal`. Here the discriminator names a transaction *category* — `TX_PLAN_SECURITY_TRANSFER` (an option/equity-comp transfer) — that Carta does not model at all, so the accurate reason is that the concept it discriminates has `no-equivalent` in Carta, not merely that Carta omits the discriminator field. (Contrast this with a warrant transfer, which *would* land on `WarrantTransferTransaction`; the absence is specific to option/equity-comp grants, not to transfers in general.)
- **Compatibility-wrapper relationship.** `PlanSecurityTransfer` is a thin `allOf` wrapper that narrows `EquityCompensationTransfer`'s two-value `object_type` enum (`TX_PLAN_SECURITY_TRANSFER`, `TX_EQUITY_COMPENSATION_TRANSFER`) down to the single `const` `TX_PLAN_SECURITY_TRANSFER`. Per OCF, `TX_PLAN_SECURITY_TRANSFER` is the legacy alias retained "to avoid a breaking change … will be deprecated in v2.0.0," with `TX_EQUITY_COMPENSATION_TRANSFER` as the going-forward type. Both discriminator values denote the same transfer event and route the same way (nowhere in Carta), so the consistency rule is satisfied: this wrapper and `EquityCompensationTransfer` reach the same conclusion for the plan-security/equity-comp transfer concept.
- **Sibling / referenced objects, for routing context.** Were Carta to model this, a plan-security transfer would reference the equity-compensation security it moves between stakeholders — Carta's nearest analogue is `OptionGrant` (`#/$defs/OptionGrant`) and the `OptionIssuanceTransaction` / `OptionExerciseTransaction` / `OptionCancellationTransaction` that act on it. None of those is a transfer, so even the closest-adjacent security objects do not give `object_type` (or this transaction as a whole) a destination. The transfer-specific fields the wrapper inherits from `EquityCompensationTransfer` — `balance_security_id` and `resulting_security_ids` (the new security IDs created when a grant is split across a partial transfer) — likewise have no Carta surface for option-type grants; `WarrantTransferTransaction` exposes the analogous `resultingSecurityId`, but only for warrants. Those inherited fields are classified in `EquityCompensationTransfer.mapping.md`, not here.
