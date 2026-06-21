---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/EquityCompensationAcceptance.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Acceptance Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Equity Compensation Acceptance Transaction → Carta

> Object describing equity compensation acceptance transaction

## OCF schema

Source: [`EquityCompensationAcceptance.schema.json`](./EquityCompensationAcceptance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/EquityCompensationAcceptance.schema.json",
  "title": "Object - Equity Compensation Acceptance Transaction",
  "description": "Object describing equity compensation acceptance transaction",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/acceptance/Acceptance.schema.json"
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
        "TX_PLAN_SECURITY_ACCEPTANCE",
        "TX_EQUITY_COMPENSATION_ACCEPTANCE"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_ACCEPTANCE` will be deprecated in v2.0.0"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/acceptance/EquityCompensationAcceptance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 5/5

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
      TX_PLAN_SECURITY_ACCEPTANCE: null
      TX_EQUITY_COMPENSATION_ACCEPTANCE: null
  date:
    kind: rename
    target: "#/$defs/OptionGrant/properties/stakeholderAcceptanceDate"
  security_id:
    kind: rename
    target: "#/$defs/OptionGrant/properties/securityId"
```

## Notes / open questions

- **Carta has no acceptance *transaction*; it records acceptance as a date on the grant.** OCF models a stakeholder accepting their equity-comp grant as a standalone transaction object (`TX_EQUITY_COMPENSATION_ACCEPTANCE` / the deprecated `TX_PLAN_SECURITY_ACCEPTANCE`). Carta has no analogous transaction type — its transaction set covers issuance / exercise / cancellation but not acceptance. Instead, Carta folds "the stakeholder accepted" into the security object itself: `OptionGrant.stakeholderAcceptanceDate` (`Iso8601CompleteCalendarDate`). The mirror fields exist on the other equity-comp securities too (`RestrictedStockAward.stakeholderAcceptanceDate`, `RestrictedStockUnit.stakeholderAcceptanceDate`, and `Interest.acceptanceDate`), confirming this is Carta's modeling pattern for acceptance generally.
- **`date` → `OptionGrant.stakeholderAcceptanceDate`.** This is the substantive payload of the transaction: the date the holder accepted. OCF equity compensation = Carta option grants (the context's transaction surface maps equity-comp / plan-security option issuance to `OptionIssuanceTransaction` + `OptionGrant`), so `OptionGrant` is the single, unambiguous Carta home for an *equity-comp* acceptance, and `stakeholderAcceptanceDate` is the field. Marked `rename` rather than a transaction-field mapping because in Carta this is an update (set the date) on the existing grant identified by `security_id`, not the creation of a new transaction row.
  - Granularity note: both sides are calendar **dates** here (OCF `Date` and Carta `Iso8601CompleteCalendarDate`), so unlike the issuance/exercise transactions there is no date-vs-datetime widening to flag. (Carta's `Interest.acceptanceDate` is a *datetime*, but the equity-comp grant fields used here are plain dates.)
  - Carta scopes acceptance per equity-comp security type via distinct fields. An importer must route by what `security_id` resolves to: an option grant → `OptionGrant.stakeholderAcceptanceDate`; an RSA → `RestrictedStockAward.stakeholderAcceptanceDate`; an RSU → `RestrictedStockUnit.stakeholderAcceptanceDate`. This file documents the `OptionGrant` target because that is the canonical equity-comp grant; the value semantics are identical across the three.
- **`security_id` → `OptionGrant.securityId`.** OCF's transaction-to-security foreign key. In OCF the acceptance is a separate object that references the issued security by `security_id`; in Carta there is no separate object, so this key is what selects *which* grant's `stakeholderAcceptanceDate` to set. Carta's `OptionGrant.securityId` is the corresponding stable per-security identifier (it is the same key used across Carta's option transactions: `securityId` appears on `OptionGrant`, `OptionIssuanceTransaction`, `OptionExerciseTransaction`, etc.). Not value-identical (the two systems assign their own ids), but it is the same role: the per-security reference. Marked `rename`.
- **`id`, `comments`, `object_type`: OCF scaffolding (`ocf-internal`).**
  - `id` is OCF's identifier for the acceptance transaction object. Carta has no acceptance transaction object, so there is no row whose id this could become; Carta assigns its own ids to the objects it does have.
  - `object_type` is OCF's discriminator. Because Carta has no acceptance transaction, neither enum member (`TX_EQUITY_COMPENSATION_ACCEPTANCE`, nor the v2.0.0-deprecated alias `TX_PLAN_SECURITY_ACCEPTANCE`) corresponds to any Carta type — both map to `null`. The distinction between the two OCF members is purely an OCF backwards-compatibility artifact ("done to avoid a breaking change… `TX_PLAN_SECURITY_ACCEPTANCE` will be deprecated in v2.0.0") with no bearing on the target.
  - `comments` is free-text OCF metadata with no slot on the Carta grant.
- This object is `ocf_kind: object`, so it is classified `n/a-object` per the bucket policy: its own properties map directly to the corresponding Carta object's fields (`OptionGrant`) rather than to a reusable type. The two genuinely-absent fields (`id`, the acceptance discriminator) plus `comments` are the only unmappables, and each is OCF internal scaffolding rather than a lost domain value — the actual acceptance information (who/which-grant + when) is fully preserved via `security_id` + `date`.
</content>
</invoke>
