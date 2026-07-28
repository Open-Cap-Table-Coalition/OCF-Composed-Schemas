---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/WarrantAcceptance.schema.json
ocf_object_type: TX_WARRANT_ACCEPTANCE
ocf_title: Object - Warrant Acceptance Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Warrant Acceptance Transaction → Carta

> Object describing a warrant acceptance transaction

## OCF schema

Source: [`WarrantAcceptance.schema.json`](./WarrantAcceptance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/WarrantAcceptance.schema.json",
  "title": "Object - Warrant Acceptance Transaction",
  "description": "Object describing a warrant acceptance transaction",
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
      "const": "TX_WARRANT_ACCEPTANCE"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/acceptance/WarrantAcceptance.schema.json"
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
    values:
      TX_WARRANT_ACCEPTANCE: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: rename
    target: "#/$defs/WarrantTransactionItem/properties/securityId"
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&title=%5BMapping+question%5D+WarrantAcceptance) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&title=%5BMapping+question%5D+WarrantAcceptance%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&title=%5BMapping+question%5D+WarrantAcceptance%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&title=%5BMapping+question%5D+WarrantAcceptance%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&title=%5BMapping+question%5D+WarrantAcceptance%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FWarrantAcceptance.mapping.md&title=%5BMapping+question%5D+WarrantAcceptance%3A+security_id&property_path=security_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Object-level routing: Carta has no warrant-acceptance transaction or acceptance field.** OCF models stakeholder acceptance of a warrant as its own first-class transaction object (`TX_WARRANT_ACCEPTANCE`), referencing the accepted warrant by `security_id`. Carta's warrant model is `WarrantIssuanceTransaction` / `WarrantExerciseTransaction` / `WarrantCancellationTransaction` / `WarrantTransferTransaction` (plus the `WarrantTransactionItem` bundle and `WarrantBlockSummary`) — there is **no** `WarrantAcceptanceTransaction` and no acceptance date in the warrant lifecycle. The event/date is therefore lost, but its security reference can still be retained on the enclosing `WarrantTransactionItem.securityId`.
- **Why `date` is `no-equivalent` (and not routable to an acceptance-date field).** Carta *does* carry acceptance dates, but only on equity-comp and stock securities — `OptionGrant.stakeholderAcceptanceDate`, `RestrictedStockAward.stakeholderAcceptanceDate`, `RestrictedStockUnit.stakeholderAcceptanceDate` (all `Iso8601CompleteCalendarDate`), plus `Interest.acceptanceDate` (`Iso8601CompleteCalendarDateTime`). None of these is a warrant security/transaction, and there is no warrant analogue (`WarrantIssuanceTransaction` exposes only `issueDatetime` / `expirationDatetime`, never an acceptance date). So OCF's warrant-acceptance `date` has nowhere to land.
- **`security_id` → `WarrantTransactionItem.securityId` (rename).** The warrant transaction item is Carta's enclosing identity/container for the warrant lifecycle. It cannot carry the acceptance event or date, but it is the defensible home for the OCF foreign key that identifies which warrant the acceptance concerns.
- `id`, `comments`, `object_type`: OCF object scaffolding (`ocf-internal`). `id` is OCF's own identifier (Carta assigns server-side ids); `object_type` is OCF's discriminator constant (`TX_WARRANT_ACCEPTANCE`) — Carta types transactions positionally by endpoint/def rather than via a stored discriminator, so the single const value remaps to `null`; `comments` is free-text OCF metadata with no Carta slot.
- Net result: **1 of 5 fields maps.** The warrant identity survives on `WarrantTransactionItem.securityId`; the acceptance date and standalone acceptance event do not. This is the closest faithful representation available in the pinned Carta bundle.
