---
canonical_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/transactions/vesting/VestingStart.schema.json
canonical_title: Canonical - Vesting Start Transaction
canonical_kind: transaction
required_fields:
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-26
---

# Canonical - Vesting Start Transaction → Carta

> Canonical (hypothetical OCF) representation of a vesting-start transaction. Supplies the per-grant date anchor used by DATE-anchored `VestingStatement`s in the security's template.

## Canonical schema

Source: [`VestingStart.schema.json`](./VestingStart.schema.json)

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 4/4

fields:
  id:
    kind: unmappable
    target: null
  object_type:
    kind: unmappable
    target: null
    values:
      TX_CANONICAL_VESTING_START: null
  date:
    kind: rename
    target: "#/$defs/Vesting/properties/startDate"
  security_id:
    kind: computed
    target: null
```

## Notes / open questions

- `date` → `Vesting.startDate`: clean rename. The canonical anchor date populates Carta's `Vesting.startDate` on the grant identified by `security_id`. The Carta `Vesting` object lives on the grant (e.g., `OptionGrant.vestingSchedule` / `RestrictedStockUnit.vestingSchedule`); the path `#/$defs/Vesting/properties/startDate` is the type-level target.
- `security_id`: `kind: computed` because the value isn't a Carta field — it's the routing key the consumer uses to find which Carta grant's `Vesting.startDate` to populate. Carta represents this scoping positionally (the `Vesting` object is nested under the grant, so the grant's identity is already established by context). No Carta field carries the security id at the `Vesting` level.
- `id` (the transaction's own identifier): unmappable. Carta does not represent vesting-start as a separate transaction; the anchor date is a field on the grant. The OCF/canonical transaction id has no Carta counterpart.
- `object_type`: unmappable boilerplate; same reason as `id`.
- One `TX_CANONICAL_VESTING_START` per security. Carta consumers receive the data as `OptionGrant.vestingStartDate` (or equivalent on `RestrictedStockUnit` / `RestrictedStockAward`) and Carta's `Vesting.startDate`.

### Carta features not produced from canonical

- `Acceleration` on Carta's `Vesting` — out of scope (canonical does not model acceleration).
