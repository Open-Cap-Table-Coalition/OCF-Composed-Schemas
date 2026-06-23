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
last_generated: 2026-06-16
---

# Canonical - Vesting Event Transaction → Carta

> Witnesses that a named vesting event fired for a security on a date. Each firing becomes a row in the grant's Carta `vestingEvents` array. Satisfies any VestingStatement whose `event_condition.event_id` matches.

## Canonical schema

Source: [`VestingEvent.schema.json`](./VestingEvent.schema.json)

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
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      TX_CANONICAL_VESTING_EVENT: null
  date:
    kind: rename
    target: "#/$defs/OptionGrantVestingEvent/properties/vestDate"
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  event_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- Carta represents event firings as rows in the grant's `vestingEvents` array (`OptionGrant.vestingEvents`, `RestrictedStockUnit.vestingEvents`, `RestrictedStockAward.vestingEvents`). The targets here use `OptionGrantVestingEvent`; `RestrictedStockUnitVestingEvent` and `RestrictedStockAwardVestingEvent` are structurally analogous.
- `security_id` and `event_id`: routing keys, not Carta fields. `security_id` selects which grant's `vestingEvents` array receives the row; `event_id` selects which template statement(s) the firing satisfies. Carta scopes the row positionally (inside the grant) and its `*VestingEvent` rows don't reference the spec-layer event, so neither has a Carta carrier — hence `unmappable` / `no-equivalent`.
- `id` and `object_type`: OCF transaction scaffolding. Carta's `*VestingEvent.id` is a separate Carta-assigned identifier and does not correspond to the canonical transaction id.
- Carta's `performanceCondition` flag and `vested` boolean on a `*VestingEvent` row are derived by the producer (true for firings that satisfy an `event_condition`), not carried on this transaction.

## Carta features not produced from canonical

- `OptionGrantVestingEvent.{isoQuantity, nsoQuantity}` — ISO/NSO split, a Carta-specific concern.
- `OptionGrantVestingEvent.targetQuantity` — Carta-specific target/payout metadata.
