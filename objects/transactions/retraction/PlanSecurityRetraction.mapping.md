---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/PlanSecurityRetraction.schema.json
ocf_object_type: TX_PLAN_SECURITY_RETRACTION
ocf_title: Object - Plan Security Retraction
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Retraction → Carta

> Object describing plan security retraction transaction (a compatibility wrapper for equity compensation retraction event)

## OCF schema

Source: [`PlanSecurityRetraction.schema.json`](./PlanSecurityRetraction.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/PlanSecurityRetraction.schema.json",
  "title": "Object - Plan Security Retraction",
  "description": "Object describing plan security retraction transaction (a compatibility wrapper for equity compensation retraction event)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/EquityCompensationRetraction.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_RETRACTION"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/retraction/PlanSecurityRetraction.schema.json",
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
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FPlanSecurityRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FPlanSecurityRetraction.mapping.md&title=%5BMapping+question%5D+PlanSecurityRetraction) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FPlanSecurityRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FPlanSecurityRetraction.mapping.md&title=%5BMapping+question%5D+PlanSecurityRetraction+%2F+object_type&property_path=object_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket: n/a-object.** This is an OCF transaction object (`ocf_kind: object`), so it is never a bucket-2 type. It would normally map its own properties directly onto the corresponding Carta transaction object. Here the only property the sibling schema declares in its own `properties` block is `object_type` (the `const` discriminator `TX_PLAN_SECURITY_RETRACTION`); every other transaction field (`id`, `comments`, `date`, `security_id`, `reason_text`) is contributed through the `allOf` `$ref` to `EquityCompensationRetraction.schema.json` and is therefore covered by that sibling's mapping, not this wrapper's. The validator counts source properties from this file's own `properties` block, so N = 1 and the only field to classify here is `object_type`.
- **Carta has no retraction transaction at all.** Grepping the pinned bundle (`target-schema/Carta.schema.json`) for `retraction`/`Retract` returns nothing: there is no `PlanSecurityRetractionTransaction`, no `EquityCompensationRetractionTransaction`, and no generic retraction/un-do transaction `$def`. OCF retractions model the withdrawal/voiding of a previously-recorded transaction (here, the retraction of a plan-security / equity-compensation event). Carta's transaction set is smaller than OCF's and contains issuance / exercise / cancellation / transfer / settlement transactions but no "retraction" concept — a retracted transaction in Carta would simply be deleted or corrected server-side rather than recorded as its own immutable event. So the whole object has no Carta home; the transaction-level fields (`date`, `security_id`, `reason_text`) that the parent `EquityCompensationRetraction` contributes are `no-equivalent` in *that* sibling's mapping, and the only field this wrapper itself declares (`object_type`) is `ocf-internal`.
- **`object_type` is `ocf-internal`, per the gold precedent.** Following `objects/Issuer.mapping.md` and `objects/Document.mapping.md`, `object_type` is OCF object scaffolding — a discriminator Carta does not need because Carta types its records positionally per endpoint — and is classified `ocf-internal`. The `ocf-internal` reason describes the *field*: it is an OCF discriminator with no Carta counterpart, independent of whether the transaction category it names happens to have a Carta home. (That the category itself is also absent in Carta is captured separately, above, for the parent's transaction fields.) This also satisfies the consistency rule: the parent `EquityCompensationRetraction` marks its `object_type` `ocf-internal`, and this wrapper merely narrows that field's two-value enum to one `const`, so it must reach the same `ocf-internal` verdict rather than diverging to `no-equivalent`.
- **Compatibility-wrapper relationship.** `PlanSecurityRetraction` is a thin `allOf` wrapper that narrows `EquityCompensationRetraction`'s two-value `object_type` enum (`TX_PLAN_SECURITY_RETRACTION`, `TX_EQUITY_COMPENSATION_RETRACTION`) down to the single `const` `TX_PLAN_SECURITY_RETRACTION`. Per OCF, `TX_PLAN_SECURITY_RETRACTION` is the legacy alias retained "to avoid a breaking change … will be deprecated in v2.0.0," with `TX_EQUITY_COMPENSATION_RETRACTION` as the going-forward type. Both discriminator values denote the same retraction event and route the same way (nowhere in Carta), so the consistency rule is satisfied: this wrapper and `EquityCompensationRetraction` reach the same conclusion for the retraction concept.
- **Sibling / referenced objects, for routing context.** Were Carta to model this, a plan-security retraction would reference the equity-compensation security it retracts — Carta's nearest analogues are `OptionGrant` (`#/$defs/OptionGrant`) plus the `OptionIssuanceTransaction` / `OptionExerciseTransaction` / `OptionCancellationTransaction` it would have voided. Carta provides cancellation but not retraction, so even the closest-adjacent security objects do not give `object_type` (or this transaction as a whole) a destination.
