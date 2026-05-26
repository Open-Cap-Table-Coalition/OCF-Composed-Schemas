---
canonical_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/transactions/issuance/EquityCompensationIssuance.schema.json
canonical_title: Canonical - Equity Compensation Issuance Transaction
canonical_kind: transaction
required_fields:
  - id
  - object_type
  - date
  - security_id
  - custom_id
  - stakeholder_id
  - compensation_type
  - quantity
  - expiration_date
  - security_law_exemptions
  - termination_exercise_windows
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-26
---

# Canonical - Equity Compensation Issuance Transaction → Carta

> Canonical (hypothetical OCF) representation of an equity-compensation issuance. Fans out by `compensation_type` to one of Carta's holding entities (`OptionGrant` / `RestrictedStockUnit`) or, for SAR-type compensation, to Carta's `SarIssuanceTransaction` (Carta has no holding-entity equivalent for SARs).

## Canonical schema

Source: [`EquityCompensationIssuance.schema.json`](./EquityCompensationIssuance.schema.json)

## Fan-out by compensation_type

The canonical transaction maps to different Carta targets depending on `compensation_type`:

| `compensation_type` | Carta target (holding) | Carta target (transaction) |
|---|---|---|
| `OPTION`, `OPTION_NSO`, `OPTION_ISO` | `OptionGrant` | `OptionIssuanceTransaction` |
| `RSU` | `RestrictedStockUnit` | `RsuIssuanceTransaction` |
| `CSAR`, `SSAR` | (none — Carta has no SAR holding entity) | `SarIssuanceTransaction` |

The mapping rules below target the holding entity where available (`OptionGrant`), with notes explaining the parallel paths for `RestrictedStockUnit` and `SarIssuanceTransaction`.

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 23/23

fields:
  id:
    kind: unmappable
    target: null
  comments:
    kind: unmappable
    target: null
  object_type:
    kind: unmappable
    target: null
    values:
      TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE: null
  date:
    kind: rename
    target: "#/$defs/OptionGrant/properties/issueDate"
  security_id:
    kind: rename
    target: "#/$defs/OptionGrant/properties/securityId"
  custom_id:
    kind: rename
    target: "#/$defs/OptionGrant/properties/securityLabel"
  stakeholder_id:
    kind: rename
    target: "#/$defs/OptionGrant/properties/stakeholderId"
  board_approval_date:
    kind: rename
    target: "#/$defs/OptionGrant/properties/boardApprovalDate"
  stockholder_approval_date:
    kind: unmappable
    target: null
  consideration_text:
    kind: unmappable
    target: null
  security_law_exemptions:
    kind: unmappable
    target: null
  stock_plan_id:
    kind: rename
    target: "#/$defs/OptionIssuanceTransaction/properties/equityPlanId"
  stock_class_id:
    kind: rename
    target: "#/$defs/OptionGrant/properties/shareClassId"
  compensation_type:
    kind: enum-remap
    target: "#/$defs/OptionGrant/properties/stockOptionType"
    values:
      OPTION_NSO: NSO
      OPTION_ISO: ISO
      OPTION: OTHER
      RSU: null
      CSAR: null
      SSAR: null
  option_grant_type:
    kind: unmappable
    target: null
  quantity:
    kind: rename
    target: "#/$defs/OptionGrant/properties/quantity"
  exercise_price:
    kind: rename
    target: "#/$defs/OptionGrant/properties/exercisePrice"
  base_price:
    kind: rename
    target: "#/$defs/SarIssuanceTransaction/properties/exercisePrice"
  early_exercisable:
    kind: rename
    target: "#/$defs/OptionGrant/properties/earlyExercisable"
  vesting_template_id:
    kind: rename
    target: "#/$defs/OptionGrant/properties/vestingScheduleTemplateId"
  vestings:
    kind: rename
    target: "#/$defs/OptionGrant/properties/vestingEvents"
  expiration_date:
    kind: rename
    target: "#/$defs/OptionGrant/properties/grantExpirationDate"
  termination_exercise_windows:
    kind: computed
    target: "#/$defs/OptionGrant/properties/exercisePeriods"
```

## Notes / open questions

### Per-target field mapping

For `OPTION` variants → Carta `OptionGrant`, the YAML targets above apply directly. For other targets:

- **RSU → `RestrictedStockUnit`:** The same field names appear on `RestrictedStockUnit` (`securityId`, `shareClassId`, `vestingScheduleTemplateId`, `stakeholderId`, `issueDate`, `vestingStartDate`, `boardApprovalDate`, `quantity`, `securityLabel`, `vestingEvents`). Exclusions: `RestrictedStockUnit` does not carry `exercisePrice` (RSUs don't have an exercise price), `earlyExercisable`, or `grantExpirationDate`. Those fields are dropped for RSU issuances. `RsuIssuanceTransaction.equityPlanId` carries `stock_plan_id` analogously to `OptionIssuanceTransaction`.
- **CSAR/SSAR → `SarIssuanceTransaction`:** Only the transaction shape exists; there's no SAR holding entity to populate. Field landing: `quantity` → `quantity`, `stock_plan_id` → `equityPlanId`, `stock_class_id` → `shareClassId`, `vesting_template_id` → `vestingScheduleTemplateId`, `expiration_date` → `expirationDatetime`, `base_price` → `exercisePrice` (Carta uses `exercisePrice` to carry the SAR base price). Most identity-level fields (`security_id`, `custom_id`, `stakeholder_id`, `board_approval_date`) have no Carta-side carrier on `SarIssuanceTransaction`.

### Field-level notes

- `compensation_type` → `stockOptionType` enum-remap applies only to `OPTION` variants. `RSU` / `CSAR` / `SSAR` targets are `null` in the values table because those compensation types route to different Carta target types (per the fan-out table) and don't use `stockOptionType`. Carta's `StockOptionType` enum carries many country-specific variants (`STOCK_OPTION_TYPE_EMI`, `STOCK_OPTION_TYPE_BSA`, etc.); canonical maps to the legacy `ISO`/`NSO`/`OTHER` values, since `compensation_type` doesn't distinguish jurisdictions.
- `custom_id` → `securityLabel`: the OCF/canonical custom ID is a human-readable label like `CN-1`. Carta's `securityLabel` has the same role.
- `stock_plan_id` → `OptionIssuanceTransaction.equityPlanId` (and parallel for RSU / SAR transaction targets). Carta's holding entities (`OptionGrant`, `RestrictedStockUnit`) carry only `equityIncentivePlanName` (the name, not the id), so the plan-id mapping lands on the issuance transaction targets, not on the holding entities.
- `exercise_price` → `OptionGrant.exercisePrice` for option variants. For SAR (`CSAR`/`SSAR`) issuances, canonical's `base_price` carries the SAR base price and lands on `SarIssuanceTransaction.exercisePrice` (Carta's SAR shape reuses the `exercisePrice` field name for the base price).
- `early_exercisable` → `OptionGrant.earlyExercisable`. RSU and SAR targets don't carry an early-exercisable flag.
- `expiration_date` → `OptionGrant.grantExpirationDate` (date) for options, or `SarIssuanceTransaction.expirationDatetime` (datetime) for SARs. RSUs have no expiration.
- `vesting_template_id` → `vestingScheduleTemplateId`: the canonical template-id reference passes straight through to Carta. The same field name appears on `OptionGrant`, `RestrictedStockUnit`, `OptionIssuanceTransaction`, `RsuIssuanceTransaction`, and `SarIssuanceTransaction`.
- `vestings` → `vestingEvents`: when canonical carries the materialized projection (the optional `vestings` array), each `{ date, amount }` entry corresponds to a Carta `OptionGrantVestingEvent` / `RestrictedStockUnitVestingEvent` row. Canonical's date → `vestDate`, amount → `quantity`. (See `canonical/transactions/vesting/VestingEvent.mapping.md` for the event-firing path that produces these rows from witness transactions instead.)
- `termination_exercise_windows` → `OptionGrant.exercisePeriods`: `kind: computed`. Each OCF `TerminationWindow` carries a `reason` enum and a period duration; Carta's `ExercisePeriods` is a flat object with separate `{count, period}` pairs per reason (`voluntaryTermination*`, `involuntaryTermination*`, `involuntaryTerminationCause*`, `deathExercise*`, `disabilityExercise*`, `retirementExercise*`). Each canonical termination window populates the matching `*Count` and `*Period` slot based on its reason. Applies only to option variants — RSU and SAR targets have no exercise-periods field.

### Unmappable

- `id` (transaction id), `comments`, `object_type`: standard OCF scaffolding with no Carta carrier.
- `stockholder_approval_date`: Carta has no stockholder-approval slot at the grant level (only `boardApprovalDate`).
- `consideration_text`: free-text consideration field has no Carta counterpart.
- `security_law_exemptions`: see [`types/SecurityExemption.mapping.md`](../../../types/SecurityExemption.mapping.md). OCF's `{description, jurisdiction}` free-text shape doesn't structurally correspond to Carta's `FederalExemption` enum.
- `option_grant_type`: a deprecated OCF field that canonical preserves for fidelity. Carta does not represent it; same information (qualified vs non-qualified) is in `compensation_type` → `stockOptionType`.

### Carta features not produced from canonical

These Carta fields/types have no canonical source:

- `OptionGrant.{outstandingQuantity, vestedQuantity, exercisedQuantity, canceledQuantity, forfeitedQuantity, expiredQuantity, returnedToPoolQuantity, returnedToTreasuryQuantity}` — derived/aggregate quantities computed by Carta from the underlying event/transaction stream
- `OptionGrant.{stakeholderAcceptanceDate, canceledDate, terminationDate, lastExercisableDate, disqualificationDate, lastModifiedDatetime}` — lifecycle dates set by subsequent transactions, not by issuance
- `OptionGrant.isoNsoSplit` — Carta-internal ISO/NSO splitting flag
- `OptionGrant.{exercises, vestingSchedule}` — populated by other transaction types (exercise transactions and vesting machinery), not by issuance
- `OptionGrant.equityIncentivePlanName` — Carta carries the plan's *name* here; canonical carries only the plan's *id* (mapped onto `OptionIssuanceTransaction.equityPlanId`). The name can be looked up from the plan record.
- `RestrictedStockUnit.{vestedQuantity, releasedQuantity, releasePricePerShare, netSettledQuantity, canceledDate}` — lifecycle and aggregate fields, set elsewhere
- Carta's `Vesting` object (`OptionGrant.vestingSchedule`) is sourced from the canonical vesting layer (see [`../../vesting/VestingScheduleTemplate.mapping.md`](../../vesting/VestingScheduleTemplate.mapping.md) and [`../vesting/VestingStart.mapping.md`](../vesting/VestingStart.mapping.md)).
