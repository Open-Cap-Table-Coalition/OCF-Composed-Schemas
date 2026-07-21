---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/WarrantCancellation.schema.json
ocf_object_type: TX_WARRANT_CANCELLATION
ocf_title: Object - Warrant Cancellation Transaction
ocf_kind: object
required_fields:
  - quantity
  - id
  - object_type
  - date
  - security_id
  - reason_text
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Warrant Cancellation Transaction → Carta

> Object describing a cancellation of a warrant security

## OCF schema

Source: [`WarrantCancellation.schema.json`](./WarrantCancellation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/WarrantCancellation.schema.json",
  "title": "Object - Warrant Cancellation Transaction",
  "description": "Object describing a cancellation of a warrant security",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/cancellation/Cancellation.schema.json"
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
      "const": "TX_WARRANT_CANCELLATION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial cancellations)",
      "type": "string"
    },
    "reason_text": {
      "description": "Reason for the cancellation",
      "type": "string"
    },
    "quantity": {
      "description": "Quantity of non-monetary security units cancelled",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "quantity",
    "id",
    "object_type",
    "date",
    "security_id",
    "reason_text"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/cancellation/WarrantCancellation.schema.json"
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
      TX_WARRANT_CANCELLATION: null
  date:
    kind: rename
    target: "#/$defs/WarrantCancellationTransaction/properties/effectiveDatetime"
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: computed
    target: "#/$defs/WarrantCancellationTransaction/properties/reason"
  quantity:
    kind: rename
    target: "#/$defs/WarrantCancellationTransaction/properties/quantity"
```

## Notes / open questions

- This is an OCF transaction object (`ocf_kind: object`), so it is `n/a-object`: its own properties map directly to fields of the corresponding Carta object, `#/$defs/WarrantCancellationTransaction` ("A cancellation transaction for a warrant."). That Carta object is intentionally minimal — it exposes only three properties: `effectiveDatetime`, `reason`, and `quantity` — so most of OCF's transaction scaffolding and reference bookkeeping has no home. This parallels the sibling `ConvertibleCancellation.mapping.md` precedent.
- `date` → `effectiveDatetime` (rename). Granularity differs: OCF `date` is a calendar **date** (`types/Date.schema.json`, `YYYY-MM-DD`), while Carta `effectiveDatetime` is `#/$defs/Iso8601CompleteCalendarDateTime` (a full date-time). Loading OCF into Carta requires widening the date to a datetime (e.g. midnight UTC on the OCF date); reading Carta back into OCF requires truncating to the date. This date↔datetime caveat applies to every OCF transaction.
- `quantity` → `quantity` (rename). OCF `quantity` is "Quantity of non-monetary security units cancelled" typed as `types/Numeric.schema.json` (a string-encoded decimal); Carta `quantity` is `#/$defs/Decimal`. Both are non-monetary unit counts, so the correspondence is clean. Note the *semantic* gap: for a **full** cancellation OCF's cancelled quantity equals the warrant's whole quantity; for a **partial** cancellation OCF's `quantity` is the cancelled delta, not the remaining/whole position. Carta's `quantity` is the quantity cancelled by this transaction, so the mapping is exact for both full and partial cancellations (it is the cancelled amount, not a balance).
- `reason_text` → `reason` (computed, lossy). OCF `reason_text` is **free text** ("Reason for the cancellation"); Carta `reason` is the closed 3-value enum `#/$defs/WarrantCancellationReason` = {`WARRANT_CANCELLATION_REASON_CANCELED`, `WARRANT_CANCELLATION_REASON_LIFETIME_ENDED`, `WARRANT_CANCELLATION_REASON_TRANSFERRED`}. Because the OCF property is not itself an enum, this is not a clean `enum-remap`; it requires classifying the free-text reason into one of Carta's three buckets (and the original prose is dropped). Default to `..._CANCELED` unless the text clearly indicates the warrant reached the end of its life/expired (→ `..._LIFETIME_ENDED`) or was moved to another holder (→ `..._TRANSFERRED`). In OCF a transfer is typically modelled with a dedicated `TX_WARRANT_TRANSFER` rather than a cancellation, so `..._TRANSFERRED` will rarely be derivable from a `TX_WARRANT_CANCELLATION` record; whether OCF data populates `reason_text` with enough signal to pick `..._LIFETIME_ENDED` vs `..._CANCELED` is a per-dataset question.
- `security_id` → unmappable / `no-equivalent`. Carta's `WarrantCancellationTransaction` carries no security/warrant reference field at all (no `securityId`, `warrantId`, etc. on the transaction object itself). The link between the cancellation event and the warrant it acts on is carried structurally in Carta by the parent container `#/$defs/WarrantTransactionItem`, whose `securityId` (+ `stakeholderId`, `securityLabel`) identifies the warrant and whose `cancellations` array holds these `WarrantCancellationTransaction` records. So the reference exists one level up, not as a property on the transaction, and OCF's explicit per-transaction `security_id` foreign key has nowhere to land on `WarrantCancellationTransaction` itself.
- `balance_security_id` → unmappable / `no-equivalent`. This OCF field names the new security that holds the remainder balance after a **partial** cancellation. Carta's cancellation transaction models neither partial-balance splitting nor a pointer to a successor security, so there is no field for it.
- `id`, `comments`, `object_type` → unmappable / `ocf-internal`. These are OCF object scaffolding: `id` is OCF's internal object identifier, `comments` is free-form annotation, and `object_type` is the discriminant const `TX_WARRANT_CANCELLATION` (Carta encodes the transaction kind by *which* `$def` is used, not by a stored value). The single `object_type` value `TX_WARRANT_CANCELLATION` maps to `null` for the same reason. This matches the `objects/Issuer.mapping.md` precedent for `id`/`comments`/`object_type` and the sibling `ConvertibleCancellation.mapping.md`.
- Net mapping to Carta's transaction fields: `effectiveDatetime` ← `date`, `quantity` ← `quantity`, `reason` ← `reason_text` (lossy). Every Carta `WarrantCancellationTransaction` field has an OCF source; the unmapped OCF fields are either internal scaffolding or reference/partial-balance data Carta does not record here.
