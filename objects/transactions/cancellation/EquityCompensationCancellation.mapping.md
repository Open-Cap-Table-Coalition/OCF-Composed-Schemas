---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Cancellation Transaction
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

# Object - Equity Compensation Cancellation Transaction → Carta

> Object describing a cancellation of equity compensation

## OCF schema

Source: [`EquityCompensationCancellation.schema.json`](./EquityCompensationCancellation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json",
  "title": "Object - Equity Compensation Cancellation Transaction",
  "description": "Object describing a cancellation of equity compensation",
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
      "enum": [
        "TX_PLAN_SECURITY_CANCELLATION",
        "TX_EQUITY_COMPENSATION_CANCELLATION"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_CANCELLATION` will be deprecated in v2.0.0"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: "8/8"

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
      TX_PLAN_SECURITY_CANCELLATION: null
      TX_EQUITY_COMPENSATION_CANCELLATION: null
  date:
    kind: rename
    target: "#/$defs/OptionCancellationTransaction/properties/effectiveDatetime"
  security_id:
    kind: rename
    target: "#/$defs/OptionTransactionItem/properties/securityId"
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: computed
    target: "#/$defs/OptionCancellationTransaction/properties/reason"
  quantity:
    kind: rename
    target: "#/$defs/OptionCancellationTransaction/properties/quantity"
```

## Notes / open questions

- **Carta has a direct home for this transaction: `OptionCancellationTransaction`.** OCF equity compensation = Carta option grants (the transaction surface routes equity-comp / plan-security option issuance to `OptionIssuanceTransaction` + `OptionGrant`), and Carta models the cancellation/termination of such a grant as `OptionCancellationTransaction`, nested under `OptionTransactionItem.cancellations[]` (an array described as "all cancellation and termination transactions for the option grant, in chronological order," since "an option can accrue multiple cancellation events, e.g. TERMINATED followed by PTEP_ENDED"). `OptionTransactionItem` ("An option grant with its full transaction history. Groups all lifecycle events (issuance, exercises, cancellation) for a single option grant") is the grouping container that holds the cancellation array; the grant terms themselves live on `OptionGrant`, which carries no `cancellations[]` array. This is the single unambiguous Carta destination, so the substantive payload of the OCF transaction maps field-for-field.
- **`quantity` → `OptionCancellationTransaction.quantity`.** The number of equity-comp units cancelled. OCF `Numeric` → Carta `Decimal`; both are arbitrary-precision numeric strings, so the rename is value-preserving (type renamed, not the value). This is the core economic payload of the cancellation.
- **`date` → `OptionCancellationTransaction.effectiveDatetime`.** The date the cancellation occurred. **Granularity widening to flag:** OCF `date` is a calendar **date** (`types/Date.schema.json`), whereas Carta's `effectiveDatetime` is a full **datetime** (`Iso8601CompleteCalendarDateTime`). An importer must widen the OCF date to a datetime (e.g. by appending a time-of-day / midnight UTC); the reverse (Carta → OCF) is lossy as it truncates the time component. Carta also carries `terminationDatetime` and `forfeitureDatetime` on this transaction, but OCF supplies only a single transaction `date`, so `effectiveDatetime` is the correct one-to-one target; the other two datetimes have no OCF source field here and are left unset by this mapping.
- **`security_id` → `OptionTransactionItem.securityId`.** OCF's transaction-to-security foreign key — the stable per-security id that selects *which* grant is being cancelled. Note that `OptionCancellationTransaction` itself carries **no** security reference field (it exposes only `effectiveDatetime`, `reason`, `quantity`, `terminationDatetime`, `forfeitureDatetime`); the cancellation is nested *under* its grant via `OptionTransactionItem.cancellations[]`, so the security linkage in Carta is structural (the array containment) and the corresponding stable key lives on the parent `OptionTransactionItem.securityId` ("The identifier of the option grant" used to cross-reference transactions). Mapped there. This parallels the sibling cancellations exactly: `StockCancellation` → `#/$defs/CertificateTransactionItem/properties/securityId` and `ConvertibleCancellation` → `#/$defs/ConvertibleTransactionItem/properties/securityId`. Not value-identical (each system assigns its own ids), but it is the same role: the per-security reference used across Carta's option lifecycle (the same UUID also appears on `OptionGrant.securityId`; the transaction-item link is chosen as the closer, per-transaction-grouping analogue that actually contains the cancellation row).
- **`reason_text` → `OptionCancellationTransaction.reason` (`computed`).** OCF stores the cancellation reason as **free text** (`reason_text`, "Reason for the cancellation"); Carta stores it as the **enum** `OptionCancellationReason` (`OPTION_CANCELLATION_REASON_TERMINATED`, `_CANCELED`, `_TERMINATION_FORFEITED`, `_LIFETIME_ENDED`, `_PTEP_ENDED`). Because the source is unconstrained prose and the target is a closed vocabulary, this is **not** a clean `enum-remap` (there is no OCF enum to remap member-for-member) — it is `computed`: an importer must classify the free text into one of Carta's reason codes (e.g. text mentioning expiry at end of post-termination-exercise → `_PTEP_ENDED`; forfeiture of unvested shares on termination → `_TERMINATION_FORFEITED`; plain "canceled" → `_CANCELED`). The mapping is lossy in both directions: prose nuance is dropped going to Carta, and Carta's specific code loses the original wording going back. `reason_text` is OCF-required, so a value is always present to classify; when it does not match a more specific code, `_CANCELED` / `_TERMINATED` are the safe fallbacks.
- **`balance_security_id` → unmappable (`no-equivalent`).** OCF supports *partial* cancellations by pointing at a second security that holds the remaining (un-cancelled) balance. `OptionCancellationTransaction` has no such field — Carta records only the cancelled `quantity` on the original grant and has no slot for a balance-security pointer, so OCF's partial-cancellation balance linkage has no Carta home. This is a genuine domain gap, not OCF scaffolding.
- **`id`, `comments`, `object_type`: OCF scaffolding (`ocf-internal`).**
  - `id` is OCF's identifier for the cancellation transaction object; Carta assigns its own ids and `OptionCancellationTransaction` has no incoming-id field this could become.
  - `object_type` is OCF's transaction discriminator, not a domain value — Carta selects the transaction kind by which concrete `$def` it instantiates (`OptionCancellationTransaction`), so the discriminator string itself has no target. Both enum members map to `null`: `TX_EQUITY_COMPENSATION_CANCELLATION` and the v2.0.0-deprecated alias `TX_PLAN_SECURITY_CANCELLATION` denote the *same* transaction (the dual members exist purely "to avoid a breaking change… `TX_PLAN_SECURITY_CANCELLATION` will be deprecated in v2.0.0"). Do not confuse this discriminator with Carta's `OptionCancellationTransaction.reason`, which is fed by `reason_text`, not by `object_type`.
  - `comments` is free-text OCF metadata with no slot on the Carta transaction.
- This object is `ocf_kind: object`, so it is classified `n/a-object` per the bucket policy: its own properties map directly to the corresponding Carta object's fields (`OptionCancellationTransaction`, plus the parent `OptionTransactionItem` for the security key) rather than to a reusable type. Of the 8 source properties, 5 carry into Carta (`quantity`, `date`, `security_id`, `reason_text`, and `object_type` is captured *structurally* by instantiating `OptionCancellationTransaction`); the 3 unmappables are 2 pieces of OCF scaffolding (`id`, `comments`, `object_type` discriminator) and 1 genuine gap (`balance_security_id`, partial-cancellation balance pointer).
</content>
