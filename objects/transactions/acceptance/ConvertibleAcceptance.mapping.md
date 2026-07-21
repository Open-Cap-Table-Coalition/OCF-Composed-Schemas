---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/ConvertibleAcceptance.schema.json
ocf_object_type: TX_CONVERTIBLE_ACCEPTANCE
ocf_title: Object - Convertible Acceptance Transaction
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

# Object - Convertible Acceptance Transaction → Carta

> Object describing a convertible acceptance transaction

## OCF schema

Source: [`ConvertibleAcceptance.schema.json`](./ConvertibleAcceptance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/ConvertibleAcceptance.schema.json",
  "title": "Object - Convertible Acceptance Transaction",
  "description": "Object describing a convertible acceptance transaction",
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
      "const": "TX_CONVERTIBLE_ACCEPTANCE"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/acceptance/ConvertibleAcceptance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
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
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no convertible-acceptance transaction, so the whole object is unmappable.** OCF's `TX_CONVERTIBLE_ACCEPTANCE` is a standalone *event* recording that a stakeholder accepted/countersigned a previously-issued convertible. Carta's transaction set (grepping the pinned bundle for `…Transaction` `$def`s) covers issuance, cancellation, exercise, transfer, settlement, and conversion — but there is **no `*AcceptanceTransaction`** of any kind, and specifically nothing for convertibles. The OCF acceptance family (`TX_STOCK_ACCEPTANCE`, `TX_PLAN_SECURITY_ACCEPTANCE`, `TX_EQUITY_COMPENSATION_ACCEPTANCE`, `TX_WARRANT_ACCEPTANCE`, and this `TX_CONVERTIBLE_ACCEPTANCE`) has no counterpart in Carta's transaction model.
- **Where acceptance lives in Carta — and why `date` still can't land there.** Carta does model the *fact* of acceptance, but only as a passive attribute on the security/grant object, never as its own transaction: the bundle has exactly four such fields — `Interest.acceptanceDate` (`$ref: #/$defs/Iso8601CompleteCalendarDateTime`, a date-*time*), and `OptionGrant.stakeholderAcceptanceDate`, `RestrictedStockAward.stakeholderAcceptanceDate`, `RestrictedStockUnit.stakeholderAcceptanceDate` (each `$ref: #/$defs/Iso8601CompleteCalendarDate`, a plain calendar date — verified against the pinned bundle). Critically, **`ConvertibleNote` carries no acceptance field at all** (its properties are the convertible economics — `interestRate`, `priceCap`, `discountPercentage`, `conversionTrigger`, `maturityDatetime`, etc. — plus `id`/`securityId`/`issuerId`/`stakeholderId`/`securityLabel`/dates), and neither does `ConvertibleIssuanceTransaction`. So there is no convertible-side `acceptanceDate` slot for `date` to populate; the convertible objects that would be this transaction's natural home simply do not record acceptance. Note also that `Interest` is not a convertible — it is an equity/profits-interest object (it carries `exercisePrice`, `vestingSchedule`, `thresholdDetails`, `originalIssuePrice`), so its `acceptanceDate` is not a convertible slot either. Mapping `date` onto one of the non-convertible acceptance-date fields (an `Interest`/`OptionGrant`/RSA/RSU) would be semantically wrong (wrong security type) and is therefore not a valid target. (Contrast the sibling `EquityCompensationAcceptance`, where `date` *does* map to `OptionGrant.stakeholderAcceptanceDate` precisely because an equity-comp grant is a Carta security object that carries an acceptance field; the convertible has no such field, which is why this file is all-unmappable.)
- **`date` (no-equivalent).** The transaction date — when the convertible was accepted — would be the one substantive payload of this object, but per the point above Carta exposes no convertible acceptance-date field. Granularity is moot here since there is no target at all, but for the record the existing Carta acceptance fields are a mix: the grant-side ones (`OptionGrant`/RSA/RSU `stakeholderAcceptanceDate`) are plain calendar dates (`Iso8601CompleteCalendarDate`), matching OCF `date`'s `format: date`, while only `Interest.acceptanceDate` is a full `Iso8601CompleteCalendarDateTime`. Marked `no-equivalent` because the target field is absent for convertibles, not merely lossy.
- **`security_id` (no-equivalent).** This is the foreign key tying the acceptance to its convertible (the `security_id` minted by the originating `TX_CONVERTIBLE_ISSUANCE`). It is unmappable here as a direct consequence of there being no acceptance transaction in Carta to carry it: there is no Carta object whose `securityId`/`convertibleId` this would populate. (In a round-trip, the underlying convertible itself maps to `ConvertibleNote`/`ConvertibleIssuanceTransaction` via its issuance object; the *acceptance* of that convertible is what has no home.)
- **`id`, `object_type`, `comments` (ocf-internal).** Standard OCF object scaffolding, handled exactly as in the `Issuer` precedent. `id` is OCF's own object identifier (Carta assigns identifiers server-side); `object_type` is the fixed discriminator constant `TX_CONVERTIBLE_ACCEPTANCE` that OCF uses for positional typing and which Carta does not need; `comments` is free-text with no Carta slot.
- **Consistency.** This file mirrors its four sibling acceptance transactions: because Carta models no acceptance transaction for *any* security type, every acceptance object resolves to all-unmappable, with the security-specific `date`/`security_id` as `no-equivalent` and the `id`/`object_type`/`comments` scaffolding as `ocf-internal`.
