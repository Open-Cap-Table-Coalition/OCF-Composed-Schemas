---
canonical_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/transactions/vesting/VestingEvent.schema.json
canonical_title: Canonical - Vesting Event Transaction
canonical_kind: transaction
required_fields:
  - id
  - object_type
  - date
  - security_id
  - event_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-26
---

# Canonical - Vesting Event Transaction → Carta

> Canonical (hypothetical OCF) representation of an event-firing witness. Records that a named vesting event has fired for a given security on a given date.

## Canonical schema

Source: [`VestingEvent.schema.json`](./VestingEvent.schema.json)

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 6/6

fields:
  id:
    kind: unmappable
    target: null
  object_type:
    kind: unmappable
    target: null
    values:
      TX_CANONICAL_VESTING_EVENT: null
  date:
    kind: rename
    target: "#/$defs/OptionGrantVestingEvent/properties/vestDate"
  security_id:
    kind: computed
    target: null
  event_id:
    kind: computed
    target: null
  realized_fraction:
    kind: computed
    target: "#/$defs/OptionGrantVestingEvent/properties/quantity"
```

## Notes / open questions

- Carta represents event firings as rows in the grant's `vestingEvents` array (`OptionGrant.vestingEvents`, `RestrictedStockUnit.vestingEvents`, `RestrictedStockAward.vestingEvents`). Each row is a `*VestingEvent` whose shape is similar across grant types; the mapping targets here use `OptionGrantVestingEvent` as the canonical Carta target, with `RestrictedStockUnitVestingEvent` and `RestrictedStockAwardVestingEvent` being structurally analogous.
- `date` → `vestDate`: rename. The firing date becomes the vest date.
- `security_id`: routing key, not a Carta field. The consumer uses this to find which grant's `vestingEvents` array receives the new row. Carta represents the scoping positionally (the row lives inside the grant), so the security identity is established by context rather than by a field on the event.
- `event_id`: also not a Carta field. The consumer uses it to find which statement(s) on the security's `VestingScheduleTemplate` are anchored to this event (via `VestingBaseEvent.event_id`). Once the matching statements are identified, the consumer produces the corresponding `*VestingEvent` row(s). Carta itself doesn't carry an event identifier — `*VestingEvent` rows are flat records that don't reference the spec-layer event they came from.
- `realized_fraction` → `quantity`: `kind: computed` because the Carta quantity is derived as `matching_statement.amount × realized_fraction`. If `realized_fraction` is absent, the firing is binary and `quantity = matching_statement.amount` (the full max). Carta also has `maxQuantity` (the upper bound) and `vestedQuantity` (= `quantity` when `vested=true`) which the consumer populates from the same inputs.
- Carta's `performanceCondition` boolean flag on `*VestingEvent` is derived from the spec, not from this transaction: it is `true` if the matching statement's `vesting_base.type` is `EVENT`. The producer sets it accordingly when generating the Carta row.
- Carta's `vested` boolean is set to `true` for events recorded via this transaction (the transaction itself attests to the firing).
- `id` and `object_type`: unmappable transaction-side scaffolding. Carta's `*VestingEvent.id` is a separate Carta-assigned identifier and does not correspond to the canonical transaction id.

### Carta features not produced from canonical

- `OptionGrantVestingEvent.{isoQuantity, nsoQuantity}` — ISO/NSO split details for option grants. Canonical does not represent this split (it's a Carta-specific concept driven by Carta's ISO/NSO splitting logic).
- `OptionGrantVestingEvent.targetQuantity` — Carta-specific target/payout tracking metadata.

### Worked example

For an EVENT-anchored statement on a security:

Canonical input:

```json
{
  "TxCanonicalVestingEvent": {
    "id": "tx-001",
    "object_type": "TX_CANONICAL_VESTING_EVENT",
    "date": "2026-03-15",
    "security_id": "sec-abc",
    "event_id": "ipo_milestone",
    "realized_fraction": { "numerator": 7, "denominator": 10 }
  }
}
```

Carta output (for a matching statement with `percentage: 1/1` against a grant of `quantity: 1000`):

```json
{
  "OptionGrantVestingEvent": {
    "vestDate": "2026-03-15",
    "quantity": 700,
    "maxQuantity": 1000,
    "vested": true,
    "performanceCondition": true,
    "vestedQuantity": 700
  }
}
```

The row is inserted into the grant's (security `sec-abc`'s) `vestingEvents` array. `quantity` = `1000 × 7/10` = `700`.
