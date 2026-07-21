---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/PlanSecurityCancellation.schema.json
ocf_object_type: TX_PLAN_SECURITY_CANCELLATION
ocf_title: Object - Plan Security Cancellation
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Cancellation → Carta

> Object describing a plan security cancellation (which is a compatibility wrapper for Equity Compensation Cancellation)

## OCF schema

Source: [`PlanSecurityCancellation.schema.json`](./PlanSecurityCancellation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/PlanSecurityCancellation.schema.json",
  "title": "Object - Plan Security Cancellation",
  "description": "Object describing a plan security cancellation (which is a compatibility wrapper for Equity Compensation Cancellation)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_CANCELLATION"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/cancellation/PlanSecurityCancellation.schema.json",
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: "1/1"

fields:
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
```

## Notes / open questions

- **Bucket: n/a-object.** This is an OCF transaction object (`ocf_kind: object`), so the 3-bucket OCF-*type* policy does not apply; the object's own properties map directly onto the corresponding Carta object's fields where one exists. The Carta home for an equity-comp cancellation is `#/$defs/OptionCancellationTransaction` (the context's transaction surface maps equity-comp / plan-security option cancellation to `OptionCancellationTransaction`).
- **`PlanSecurityCancellation` is a deprecated compatibility wrapper.** Per the OCF schema description it is "a compatibility wrapper for Equity Compensation Cancellation." The legacy `TX_PLAN_SECURITY_CANCELLATION` discriminator is retained only to avoid a breaking change and "will be deprecated in v2.0.0" (see the `object_type` description on the wrapped `EquityCompensationCancellation`). The wrapper adds no fields of its own beyond narrowing `object_type` to the single const `TX_PLAN_SECURITY_CANCELLATION`.
- **The sibling source schema declares exactly one own property: `object_type` (N = 1).** Although the *composed* schema — via the `allOf` ref to `EquityCompensationCancellation`, which itself composes `Object`, `Transaction`, `SecurityTransaction`, and the `Cancellation` primitive — carries `id`, `comments`, `date`, `security_id`, `balance_security_id`, `reason_text`, and `quantity`, those properties belong to and are mapped on the wrapped `EquityCompensationCancellation` object. The validator counts the keys in *this* file's sibling `.schema.json` `properties` block, which is the single key `object_type`. The shared substantive fields are handled in `EquityCompensationCancellation.mapping.md`, where they route to `#/$defs/OptionCancellationTransaction` as follows: `quantity` → `OptionCancellationTransaction.quantity` (Carta `Decimal`); `date` → `OptionCancellationTransaction.effectiveDatetime` (Carta `Iso8601CompleteCalendarDateTime`, with a date→datetime widening); `reason_text` → the `OptionCancellationTransaction.reason` enum (a lossy free-text → `OptionCancellationReason` enum-remap). OCF's `security_id` selects which Carta grant the cancellation applies to — it routes to `#/$defs/OptionGrant/properties/securityId` (the cancellation is nested under `OptionGrant.cancellations[]`, so the linkage is structural; Carta's `OptionCancellationTransaction` carries no `securityId` field of its own — see below), and `balance_security_id` (the partial-cancellation remainder security) has no Carta equivalent.
- **`object_type` → `unmappable` / `ocf-internal`.** This is the OCF transaction discriminator, fixed here to the const `TX_PLAN_SECURITY_CANCELLATION`. Per the project convention `id`/`object_type`/`comments` are OCF-internal scaffolding (the polymorphic-type tag is not data Carta ingests). Even setting that convention aside, Carta has no enum or object that distinguishes *cancellation-transaction subtypes* by security category — `OptionCancellationReason` enumerates *why* a grant was canceled (terminated / canceled / forfeited / lifetime-ended / PTEP-ended), not *which kind of transaction* this is — so there is no Carta target for the discriminator and `reason: ocf-internal` is the most accurate classification (it would equally be `no-equivalent` on the strength of the missing concept).
- **Note on `securityId`:** Carta's `#/$defs/OptionCancellationTransaction` exposes only `effectiveDatetime`, `reason`, `quantity`, `terminationDatetime`, and `forfeitureDatetime` — it has **no** `securityId` field; the grant linkage is carried on the surrounding `OptionGrant`/transaction container rather than on the cancellation row itself. This is documented here only to explain why the wrapped object's `security_id` does not land on the cancellation transaction directly; it does not affect this wrapper file, whose sole property is the discriminator constant.
- **Net result:** 1/1 source property classified. The only property unique to this wrapper is the deprecated discriminator constant `TX_PLAN_SECURITY_CANCELLATION`, which is OCF-internal scaffolding. The actual cancellation payload (quantity, date, reason) is preserved on the wrapped `EquityCompensationCancellation` → `OptionCancellationTransaction` mapping; nothing of value is lost at the wrapper level.
