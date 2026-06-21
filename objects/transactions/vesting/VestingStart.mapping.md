---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingStart.schema.json
ocf_object_type: TX_VESTING_START
ocf_title: Object - Vesting Start Transaction
ocf_kind: object
required_fields:
  - vesting_condition_id
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Vesting Start Transaction → Carta

> Object describing the transaction of vesting schedule start / commencement associated with a security

## OCF schema

Source: [`VestingStart.schema.json`](./VestingStart.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingStart.schema.json",
  "title": "Object - Vesting Start Transaction",
  "description": "Object describing the transaction of vesting schedule start / commencement associated with a security",
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
      "const": "TX_VESTING_START"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "vesting_condition_id": {
      "description": "Reference to the `id` of a VestingCondition in this security's VestingTerms. This condition should have a trigger type of `VESTING_START_DATE`.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "vesting_condition_id",
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/vesting/VestingStart.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 6/6

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
      TX_VESTING_START: null
  date:
    kind: split
    target:
      - "#/$defs/OptionGrant/properties/vestingStartDate"
      - "#/$defs/RestrictedStockAward/properties/vestingStartDate"
      - "#/$defs/RestrictedStockUnit/properties/vestingStartDate"
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  vesting_condition_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket: n/a-object (OCF transaction object).** This is an `ocf_kind: object` transaction, so it is not subject to the 3-bucket OCF-*type* policy. It would normally map its own properties onto the fields of the corresponding Carta transaction object — but **Carta has no vesting-start (or any vesting) transaction type**. Grepping the pinned bundle (`target-schema/Carta.schema.json`) and `/tmp/carta-index.json` for transaction defs returns the `Certificate*`, `Option*`, `Convertible*`, `Warrant*`, `Rsa*`, `Rsu*`, `Sar*`, `Phantom*`, `Piu*` families only — there is no `VestingStartTransaction` / `VestingTransaction` anywhere. So there is no host transaction object to receive `security_id` or the OCF vesting-condition reference.
- **The vesting-start *date itself* does have a Carta home, so it is mapped (anti-laziness).** Although Carta has no vesting transaction, it does record the date a security's vesting *commences* — but as a point-in-time **leaf field, `vestingStartDate`, on the grant/award object** rather than as a transaction. Three Carta grant objects carry it, each typed `Iso8601CompleteCalendarDate`:
    - `#/$defs/OptionGrant/properties/vestingStartDate`
    - `#/$defs/RestrictedStockAward/properties/vestingStartDate`
    - `#/$defs/RestrictedStockUnit/properties/vestingStartDate`

  OCF's `TX_VESTING_START.date` ("Date on which the transaction occurred", i.e. the vesting-commencement date) is exactly this value. Because Carta has **no single unifying home** — the same date lives on whichever of the three grant objects the security happens to be — `date` is a **`split`**: on import, the importer writes the OCF `date` to `vestingStartDate` on whichever grant object the `security_id` resolves to (an option grant → `OptionGrant`, an RSA → `RestrictedStockAward`, an RSU → `RestrictedStockUnit`). It is the *same scalar value* fanned across the alternative destinations, selected by security type, not a value decomposed into parts.
- **`date` granularity.** OCF `date` is `types/Date.schema.json` (an `Iso8601CompleteCalendarDate`-style calendar DATE). Carta's `vestingStartDate` is also `#/$defs/Iso8601CompleteCalendarDate` (a calendar date, **not** a datetime), so there is no date-vs-datetime granularity gap here — the values are directly compatible. (Contrast Carta's transaction *event* timestamps, which are `Iso8601CompleteCalendarDateTime`; `vestingStartDate` is a grant attribute, not an event timestamp.)
- **`security_id`** (required). OCF's foreign key to the security (stock, plan security, warrant, or convertible) whose vesting begins. This key is *not* mapped as a field, but it is **not dead**: it is the selector that tells the importer which of the three `vestingStartDate` targets (and which specific grant record) the `date` should land on. Carta does carry a `securityId` on its grant objects (`OptionGrant.securityId`, `RestrictedStockAward.securityId`, `RestrictedStockUnit.securityId`), so the identifier concept exists — but there is no vesting-start *transaction* on which to record "the security whose vesting started," and re-stating the grant's own `securityId` from this transaction would be redundant with the grant it already points at. So as a transaction field it has `no-equivalent`; its role is consumed by the `date` split's destination-selection, documented here rather than mapped to a column.
- **`vesting_condition_id`** (required). OCF reference to the `id` of a `VestingCondition` (trigger type `VESTING_START_DATE`) inside the security's `VestingTerms`. Carta does not model OCF's vesting-condition graph at all: `VestingTerms.mapping.md` (complete, sibling) already establishes that OCF's vesting machinery — `allocation_type`, `vesting_conditions`, the condition/trigger graph — has **no Carta counterpart** (Carta represents vesting as opaque `vestingScheduleTemplateId` + materialized `vestingEvents`, not as referenceable condition nodes). There is therefore no Carta node to reference, and nothing to remap this id onto. `no-equivalent`.
- **`object_type`** (const `TX_VESTING_START`). OCF scaffolding discriminator. Because Carta has no vesting transaction there is no record type to discriminate to; the single OCF enum value `TX_VESTING_START` maps to `null`. Classified `ocf-internal` (object-type discriminator), consistent with the `Issuer` / `EquityCompensationTransfer` precedents. (Contrast the all-unmappable retraction files, which classify `object_type` as `no-equivalent`; here `ocf-internal` is used because the *date payload* of the transaction does have a Carta destination — the transaction is partially representable, so its discriminator is scaffolding rather than a wholly-absent concept.)
- **`id`, `comments`.** OCF object scaffolding: `id` is OCF's own identifier (Carta assigns identifiers server-side) and `comments` has no Carta slot. Both `ocf-internal`.
- **Net:** 1 of 6 fields maps (the vesting-start `date`, fanned across the three grant objects' `vestingStartDate`); the rest are OCF scaffolding (`id`, `comments`, `object_type`) or vesting-graph references Carta does not model (`vesting_condition_id`, and `security_id` as a standalone field). The correct downstream behavior on import is **not** to emit a transaction (Carta has none), but to set `vestingStartDate` on the grant/award identified by `security_id`. Coverage counts `security_id` and `vesting_condition_id` as non-TODO `unmappable` entries (every property is covered), so coverage is 6/6 with one substantive mapping.
- **Consistency:** the sibling vesting transactions differ in payload. `VestingEvent` (`TX_VESTING_EVENT`) records a non-schedule-driven vesting *occurrence* whose nearest Carta surface is the materialized `OptionGrantVestingEvent` / `RestrictedStock*VestingEvent` rows (a different target than `vestingStartDate`), and `VestingAcceleration` (`TX_VESTING_ACCELERATION`) records an off-schedule quantity with no Carta acceleration target; those files should be completed on their own terms. Only `VestingStart` lands on `vestingStartDate`.
