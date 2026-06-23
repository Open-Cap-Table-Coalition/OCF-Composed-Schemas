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
last_generated: 2026-06-16
---

# Canonical - Equity Compensation Issuance Transaction → Carta

> Canonical (hypothetical OCF) representation of an equity-compensation issuance. `compensation_type` fans this one transaction out to Carta's Option / Rsu / Sar instrument families (`OptionGrant` / `RestrictedStockUnit`, and `SarIssuanceTransaction` for SARs — Carta has no SAR holding entity).

## Canonical schema

Source: [`EquityCompensationIssuance.schema.json`](./EquityCompensationIssuance.schema.json)

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# routing: discriminator (issuance-time) — compensation_type fans this one canonical
# transaction out to Carta's Option / Rsu / Sar instrument families.
# shared: fields common to every variant. A field whose Carta home differs by
# variant carries a per-variant target map { Option/Rsu/Sar: pointer|null } — so
# RSU/SAR name their own objects instead of borrowing the Option family. `null`
# means the field has no home in that variant (SAR has no Carta security object).
status: complete

discriminator:
  field: compensation_type
  exhaustive: true

shared:
  id:                        { kind: unmappable, target: null, reason: ocf-internal }
  comments:                  { kind: unmappable, target: null, reason: no-equivalent }
  object_type:               { kind: unmappable, target: null, reason: ocf-internal }
  date:
    kind: rename
    target:
      Option: "#/$defs/OptionIssuanceTransaction/properties/issueDatetime"
      Rsu:    "#/$defs/RsuIssuanceTransaction/properties/issueDatetime"
      Sar:    "#/$defs/SarIssuanceTransaction/properties/issueDatetime"
  security_id:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/securityId"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/securityId"
      Sar:    null # SAR has no first-class Carta security object
  custom_id:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/securityLabel"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/securityLabel"
      Sar:    null
  stakeholder_id:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/stakeholderId"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/stakeholderId"
      Sar:    null
  board_approval_date:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/boardApprovalDate"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/boardApprovalDate"
      Sar:    null
  stockholder_approval_date: { kind: unmappable, target: null, reason: no-equivalent }
  consideration_text:        { kind: unmappable, target: null, reason: no-equivalent }
  security_law_exemptions:   { kind: unmappable, target: null, reason: no-equivalent }
  stock_plan_id:
    kind: rename
    target:
      Option: "#/$defs/OptionIssuanceTransaction/properties/equityPlanId"
      Rsu:    "#/$defs/RsuIssuanceTransaction/properties/equityPlanId"
      Sar:    "#/$defs/SarIssuanceTransaction/properties/equityPlanId"
  stock_class_id:
    kind: rename
    target:
      Option: "#/$defs/OptionIssuanceTransaction/properties/shareClassId"
      Rsu:    "#/$defs/RsuIssuanceTransaction/properties/shareClassId"
      Sar:    "#/$defs/SarIssuanceTransaction/properties/shareClassId"
  quantity:
    kind: rename
    target:
      Option: "#/$defs/OptionIssuanceTransaction/properties/quantity"
      Rsu:    "#/$defs/RsuIssuanceTransaction/properties/quantity"
      Sar:    "#/$defs/SarIssuanceTransaction/properties/quantity"
  vesting_start_date:
    kind: rename
    target:
      Option: "#/$defs/Vesting/properties/startDate"
      Rsu:    "#/$defs/Vesting/properties/startDate"
      Sar:    null # SAR has no Carta security object, so no vesting schedule to anchor
  vesting_template_id:
    kind: rename
    target:
      Option: "#/$defs/OptionIssuanceTransaction/properties/vestingScheduleTemplateId"
      Rsu:    "#/$defs/RsuIssuanceTransaction/properties/vestingScheduleTemplateId"
      Sar:    "#/$defs/SarIssuanceTransaction/properties/vestingScheduleTemplateId"
  vestings:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/vestingEvents"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/vestingEvents"
      Sar:    null

variants:

  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets:
      - "#/$defs/OptionIssuanceTransaction"
      - "#/$defs/OptionGrant"
    fields:
      compensation_type:
        kind: enum-remap
        target: "#/$defs/OptionGrant/properties/stockOptionType"
        values: { OPTION_NSO: NSO, OPTION_ISO: ISO, OPTION: OTHER, RSU: null, CSAR: null, SSAR: null }
        routed_to: { RSU: Rsu, CSAR: Sar, SSAR: Sar } # not dropped — handled by these variants
      option_grant_type:
        kind: enum-remap
        target: "#/$defs/OptionGrant/properties/stockOptionType"
        values: { NSO: NSO, ISO: ISO, INTL: STOCK_OPTION_TYPE_INTL }
      exercise_price:               { kind: rename, target: "#/$defs/OptionIssuanceTransaction/properties/exercisePrice" }
      base_price:                   { kind: unmappable, target: null, reason: no-equivalent }
      early_exercisable:            { kind: rename, target: "#/$defs/OptionGrant/properties/earlyExercisable" }
      expiration_date:              { kind: rename, target: "#/$defs/OptionIssuanceTransaction/properties/expirationDatetime" }
      termination_exercise_windows: { kind: rename, target: "#/$defs/OptionGrant/properties/exercisePeriods" }

  Rsu:
    when: [RSU]
    primary_targets:
      - "#/$defs/RsuIssuanceTransaction"
      - "#/$defs/RestrictedStockUnit"
    fields:
      compensation_type:            { kind: unmappable, target: null, reason: no-equivalent }
      option_grant_type:            { kind: unmappable, target: null, reason: no-equivalent }
      exercise_price:               { kind: unmappable, target: null, reason: no-equivalent }
      base_price:                   { kind: unmappable, target: null, reason: no-equivalent }
      early_exercisable:            { kind: unmappable, target: null, reason: no-equivalent }
      expiration_date:              { kind: unmappable, target: null, reason: no-equivalent }
      termination_exercise_windows: { kind: unmappable, target: null, reason: no-equivalent }

  Sar:
    when: [CSAR, SSAR]
    primary_targets:
      - "#/$defs/SarIssuanceTransaction"
    fields:
      compensation_type:            { kind: unmappable, target: null, reason: no-equivalent }
      option_grant_type:            { kind: unmappable, target: null, reason: no-equivalent }
      exercise_price:               { kind: unmappable, target: null, reason: no-equivalent }
      base_price:                   { kind: rename, target: "#/$defs/SarIssuanceTransaction/properties/exercisePrice" }
      early_exercisable:            { kind: unmappable, target: null, reason: no-equivalent }
      expiration_date:              { kind: rename, target: "#/$defs/SarIssuanceTransaction/properties/expirationDatetime" }
      termination_exercise_windows: { kind: unmappable, target: null, reason: no-equivalent }

coverage:
  Option: 24/24
  Rsu: 24/24
  Sar: 24/24
```

## Notes / open questions

- **Polymorphic by `compensation_type`.** This one canonical transaction carries option grants, RSUs, and SARs; Carta splits them into dedicated families. Uses the `discriminator:` convention (see [`docs/polymorphic-transaction-routing.md`](../../../docs/polymorphic-transaction-routing.md)): `OPTION*` → `OptionIssuanceTransaction` + `OptionGrant`; `RSU` → `RsuIssuanceTransaction` + `RestrictedStockUnit`; `CSAR`/`SSAR` → `SarIssuanceTransaction`. The three `when:` sets partition all six `CompensationType` values (`exhaustive: true`).
- **`shared:` fields use per-variant target maps where the home diverges.** Transaction-level fields (`date`/`stock_plan_id`/`stock_class_id`/`quantity`/`vesting_template_id`) land on the resolved family's `*IssuanceTransaction`; security-level fields (`security_id`/`custom_id`/`stakeholder_id`/`board_approval_date`/`vestings`) land on `OptionGrant` vs `RestrictedStockUnit`. Each such field is a `target: { Option/Rsu/Sar: pointer|null }` map; the validator keeps the keys in sync with the variant set.
- **`vesting_start_date`.** Populates Carta's `Vesting.startDate` for Option/RSU; SAR has no Carta security object (hence no vesting schedule), so it is `null` for `Sar` — the template reference itself still maps via `vesting_template_id` → `SarIssuanceTransaction.vestingScheduleTemplateId`.
- **Per-variant divergence.** `exercise_price` is Option-only; canonical `base_price` → Carta `SarIssuanceTransaction.exercisePrice` (SAR-only); `early_exercisable` and `termination_exercise_windows` are Option-only; RSUs settle (no exercise price, no expiration). `option_grant_type` (deprecated) and `compensation_type` both target `stockOptionType`; precedence is importer logic.
- **SAR has no Carta security object.** Carta models SARs with only a `SarIssuanceTransaction` (no SAR security `$def`), so the security-level identity fields are `null` in the `Sar` column of their target maps.
- **Lossy by Carta's design.** CSAR vs SSAR collapse to one `SarIssuanceTransaction` (no settlement-mode field). `OPTION` (unspecified) → `OTHER`.
