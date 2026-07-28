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
target_version: "v1alpha1 (2026-06-22)"
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
    kind: rename
    target: "#/$defs/ConvertibleTransactionItem/properties/securityId"
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&title=%5BMapping+question%5D+ConvertibleAcceptance) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&title=%5BMapping+question%5D+ConvertibleAcceptance%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&title=%5BMapping+question%5D+ConvertibleAcceptance%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&title=%5BMapping+question%5D+ConvertibleAcceptance%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&title=%5BMapping+question%5D+ConvertibleAcceptance%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FConvertibleAcceptance.mapping.md&title=%5BMapping+question%5D+ConvertibleAcceptance%3A+security_id&property_path=security_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Carta has no convertible-acceptance transaction or acceptance field.** OCF's `TX_CONVERTIBLE_ACCEPTANCE` is a standalone *event* recording that a stakeholder accepted/countersigned a previously-issued convertible. Carta's transaction set (grepping the pinned bundle for `…Transaction` `$def`s) covers issuance, cancellation, exercise, transfer, settlement, and conversion — but there is **no `*AcceptanceTransaction`** of any kind, and specifically nothing for convertibles. The event/date has no Carta home, but the accepted convertible's identity can be retained on its enclosing `ConvertibleTransactionItem.securityId`.
- **Where acceptance lives in Carta — and why `date` still can't land there.** Carta does model the *fact* of acceptance, but only as a passive attribute on the security/grant object, never as its own transaction: the June 22 bundle has exactly three such fields — `OptionGrant.stakeholderAcceptanceDate`, `RestrictedStockAward.stakeholderAcceptanceDate`, and `RestrictedStockUnit.stakeholderAcceptanceDate` (each `$ref: #/$defs/Iso8601CompleteCalendarDate`, a plain calendar date — verified against the pinned bundle). The April bundle also carried `Interest.acceptanceDate`, but `Interest` was removed. Critically, **`ConvertibleNote` carries no acceptance field at all** (its properties are the convertible economics — `interestRate`, `priceCap`, `discountPercentage`, `conversionTrigger`, `maturityDatetime`, etc. — plus `id`/`securityId`/`issuerId`/`stakeholderId`/`securityLabel`/dates), and neither does `ConvertibleIssuanceTransaction`. So there is no convertible-side `acceptanceDate` slot for `date` to populate; the convertible objects that would be this transaction's natural home simply do not record acceptance. Mapping `date` onto one of the non-convertible acceptance-date fields (an `OptionGrant`/RSA/RSU) would be semantically wrong (wrong security type) and is therefore not a valid target. (Contrast the sibling `EquityCompensationAcceptance`, where `date` *does* map to `OptionGrant.stakeholderAcceptanceDate` precisely because an equity-comp grant is a Carta security object that carries an acceptance field; the convertible has no such field, so only its `security_id` can be retained.)
- **`date` (no-equivalent).** The transaction date — when the convertible was accepted — would be the one substantive payload of this object, but per the point above Carta exposes no convertible acceptance-date field. Granularity is moot here since there is no target at all, but for the record the existing Carta acceptance fields are a mix: every retained acceptance field (`OptionGrant`/RSA/RSU `stakeholderAcceptanceDate`) is a plain calendar date (`Iso8601CompleteCalendarDate`), matching OCF `date`'s `format: date`. Marked `no-equivalent` because the target field is absent for convertibles, not merely lossy.
- **`security_id` → `ConvertibleTransactionItem.securityId` (rename).** This is the foreign key tying the acceptance to its convertible (the `security_id` minted by the originating `TX_CONVERTIBLE_ISSUANCE`). Carta's `ConvertibleTransactionItem` is the enclosing lifecycle aggregate and carries the identity for the note; it is the defensible place to preserve which convertible the OCF acceptance references, even though it cannot represent the acceptance event itself.
- **`id`, `object_type`, `comments` (ocf-internal).** Standard OCF object scaffolding, handled exactly as in the `Issuer` precedent. `id` is OCF's own object identifier (Carta assigns identifiers server-side); `object_type` is the fixed discriminator constant `TX_CONVERTIBLE_ACCEPTANCE` that OCF uses for positional typing and which Carta does not need; `comments` is free-text with no Carta slot.
- **Consistency.** Across the acceptance family, Carta never models the acceptance event as a transaction. Where a corresponding security/aggregate has an acceptance-date field, `date` is folded onto it; where it does not, `date` remains `no-equivalent`. The shared `security_id` reference is preserved on the corresponding Carta identity/container wherever one exists.
