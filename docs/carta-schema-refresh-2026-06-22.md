# Carta schema refresh: v1alpha1 (2026-06-22)

This checklist records the migration from the previously pinned Carta bundle, `v1alpha1 (2026-04-30)`, to the June 22, 2026 bundle. The source artifact is preserved by its SHA-256 in `target-schema/README.md` and `provenance.lock.json`.

## Impact inventory

- 99 definitions in the new bundle; 139 in the previous bundle.
- 40 definitions removed; no definitions added.
- 13 retained definitions changed semantically; 86 retained definitions are unchanged.
- Raw JSON diff: 1,162 removed lines, 182 added lines, 29 hunks (`git diff` defaults, i.e. the myers algorithm; `--diff-algorithm=minimal|patience|histogram` all report 1,102 / 122 across 30 hunks).
- Mapping surface: 102 mapping files and 463 target-pointer occurrences before migration.
- Directly affected mapping files: 41 (14 referenced removed definitions; 37 referenced changed retained definitions; 10 overlap).

## Removed definitions

`Acceleration`, `BoardApproval`, `CapitalizationTableSummary`, `Compliance`, `Corporation`, `Date`, `Document`, `FederalExemption`, `GrantReason`, `Interest`, `NoteBlockSummary`, `OptionGrantDocuments`, `OptionPoolSummary`, `PhantomCancellationReason`, `PhantomCancellationTransaction`, `PhantomIssuanceTransaction`, `PhantomTransactionItem`, `PiuCancellationReason`, `PiuCancellationTransaction`, `PiuIssuanceReason`, `PiuIssuanceTransaction`, `PiuTransactionItem`, `SarCancellationReason`, `SarCancellationTransaction`, `SarExerciseTransaction`, `SarIssuanceTransaction`, `SarTransactionItem`, `ShareClassSummary`, `ShareClassValuation`, `StakeholderCapitalizationTableSummary`, `StakeholderGroup`, `StakeholderNoteBlockSummary`, `StakeholderOptionPoolSummary`, `StakeholderShareClassSummary`, `StakeholderType`, `StakeholderWarrantBlockSummary`, `ThresholdDetails`, `ThresholdDetailsThresholdType`, `Vesting`, `WarrantBlockSummary`.

## Retained definitions with changes

- `Certificate`: requires `id`, `issuerId`, `stakeholderId`, `quantity`, `securityLabel`, and `issueDate`; adds `dividendAccrualStartDate` and `returnedInvestedCapital`.
- `ConvertibleNote`: requires `id`, `issuerId`, and `stakeholderId` in addition to its economic fields.
- `Issuer`: requires `id` and `legalName`.
- `OptionExercise`: requires issuer, grant, stakeholder, and quantity references.
- `OptionGrant`: removes `isoNsoSplit`; requires issuer/holder identity, quantity, label, plan name, and issue date.
- `OptionGrantVestingEvent`: removes the `isoQuantity` and `nsoQuantity` fields.
- `PointOfContact`: requires `issuerId` and `type`.
- `RestrictedStockAward`: requires issuer/holder identity, quantity, label, and issue date.
- `RestrictedStockUnit`: requires issuer/holder identity, quantity, label, plan name, and issue date.
- `ShareClass`: requires `id`, `issuerId`, name, prefix, seniority, and type.
- `Stakeholder`: requires `id`, `issuerId`, and `fullName`. Its `employeeId.title` text also changed (an upstream source link was dropped); no constraint changed, so no mapping was affected.
- `VestingPeriod`: constrains daily-through-annual vesting methods to `lengthUnit: MONTH`.
- `VestingScheduleTemplate`: requires `id`, `issuerId`, `name`, `periods`, and `vestingScheduleType`.

## Migration checklist

- [x] Replace `target-schema/Carta.schema.json` with the June 22 bundle.
- [x] Update schema provenance, version, copy date, and SHA-256.
- [x] Update every mapping frontmatter `target_version` to `v1alpha1 (2026-06-22)`.
- [x] Remove every target pointer to a definition removed from the bundle.
- [x] Mark removed summary/compliance/document targets `unmappable` with `reason: target-definition-removed`.
- [x] Mark the SAR transaction family explicitly unmappable where Carta removed its definitions.
- [x] Remove the `ShareClassValuation` fan-out while preserving live `ShareClass`, certificate, and award mappings.
- [x] Reconcile retained-definition required fields and changed fields in mapping notes/targets.
- [x] Record the `VestingPeriod` cadence constraint in the vesting mappings.
- [x] Regenerate the checked-in mapping explorer and inverse artifacts.
- [x] Run the deterministic refresh checker, mapping validator, artifact check, typecheck, lint, and tests.
- [x] Refresh the `core*/sample/` fixtures for the narrowed Core packages and rerun `core:validate-sample`.

## Deterministic acceptance checks

The migration is complete only when all of these pass from the repository root:

```text
npm run carta:refresh:check
npm run mapping:validate
npm run mapping:artifacts:check
npm run core:check
npm run core:validate-sample
```

The checker verifies the pinned SHA/version, all 102 mapping versions, zero dangling Carta JSON pointers, zero pointers to the removed-definition set, explicit `target-definition-removed` markers on the SAR/compliance/summary/document mappings, and the generated Explainer link. It is intentionally separate from the general mapping validator so this refresh cannot silently pass with an incomplete migration. All five commands now run in CI, so the migration can no longer depend on someone remembering to invoke them.

The last two matter specifically for a bundle refresh: narrowing the target bundle narrows the derived Core packages, and `core:check` only re-derives and diffs those packages. The hand-maintained fixtures under `core*/sample/` are outside that gate — `core:validate-sample` is the only check that covers them.
