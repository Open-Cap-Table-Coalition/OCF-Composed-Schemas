# OCF Core & the OCF↔Carta Gap

*For OCF and Carta maintainers evaluating an interoperable core.*

## 1. Purpose & method

This document is derived from the **110 complete, machine-validated field-level OCF→Carta
mappings** in this repo (the `.mapping.md` files under `objects/`, `types/`, `canonical/`),
checked against Carta's pinned `v1alpha1` bundle (`target-schema/Carta.schema.json`,
**139 `$def`s**). Every entity, field, and enum named below was verified to exist in that
bundle; no field is invented. For the decision procedure behind the mappings, see
[`type-mapping-policy.md`](./type-mapping-policy.md).

We define **OCF Core** as the *bidirectionally-faithful OCF↔Carta intersection*: the OCF
entities and fields that survive `OCF → Carta → OCF` up to two unavoidable, well-understood
representation shifts (date↔datetime truncation; `Numeric`/`Monetary` formatting). Anything
that needs free-text classification, array collapse, or a state-machine flattening to reach
Carta is **outside Core** — it is real OCF richness Carta cannot hold.

## 2. The gap landscape

Excluding pure OCF scaffolding (`id`/`object_type`/`comments`), the 110 mappings expand to
**458 field rows: 163 reach a real Carta target** (122 rename, 17 computed, 14 enum-remap,
10 split); **295 are `no-equivalent`**. The forward gap is dominated by **whole-entity drops**:
**64 of 110 OCF entities have zero substantive Carta home.** Carta models only **23
`*Transaction` defs** plus a state snapshot, so entire OCF transaction *families* have no host.

**OCF → Carta (what OCF carries that Carta drops):**

| Dropped OCF family | Carta home? | Why |
|---|---|---|
| Transfer (Stock, Convertible, EquityComp, PlanSecurity) | None | No `*TransferTransaction` except `WarrantTransferTransaction`; transfers surface only as a `_TRANSFERRED` cancellation reason |
| Retraction (all securities) | None | No retraction/reversal/correction event anywhere |
| Vesting events / acceleration (`VestingEvent`, `VestingAcceleration`) | None\* | Under-mapped: Carta *does* have realized `*VestingEvent` rows + `Acceleration{name,terms}` (see floor note) |
| Split / consolidation (`StockClassSplit`, `StockConsolidation`) | None | No share-adjustment transaction; `split_ratio` unmappable |
| Repricing (`EquityCompensationRepricing`) | None | No option-repricing event for underwater resets |
| Pool / authorized-share adjustments | None | No `StockPlanPoolAdjustment`, `…ReturnToPool`, `IssuerAuthorizedSharesAdjustment` host |
| Acceptance (Stock, Convertible, Warrant) | None | Only `EquityCompensationAcceptance` maps (→`OptionGrant.stakeholderAcceptanceDate`) |
| `Financing` | None | No financing/round/offering/tranche def; only computed `cashRaised` roll-ups |
| `StockLegendTemplate` | None | No `legend` storage; `stock_legend_ids` link dropped |
| `VestingTerms` + condition/trigger graph | None | No `VestingCondition`/`*Trigger` def; superseded by the canonical vesting layer |
| Conversion triggers / most mechanisms | None | No `ConversionTrigger` def; Carta stores flat economics only |
| Identity/contact types (`TaxID`, `Phone`, `Email`, `Name`, `ShareNumberRange`, `File`, `Md5`) | None | No tax-id, structured-phone, share-range, or file-hash storage |

> **\* These transaction-family "None"s are a floor, not the true gap.** Carta is a *snapshot*
> reached by reason-coded issuance/cancellation events with preceded-by lineage, so most of these
> are *reconstructable* (cancel+reissue, in-place mutation, or realized-event rows). The companion
> [`event-to-snapshot-reconstruction.md`](./event-to-snapshot-reconstruction.md) revises them to:
> **Strong** — Conversion, Transfer (stock/warrant/PIU/RSA), Split/Consolidation (certificate/RSA),
> authorized-share & pool adjustments, vesting start + date-based events; **Partial** — Repricing,
> Retraction (all five), vesting acceleration & milestone events, convertible/option-grant transfers,
> return-to-pool; **confirmed None** — issuer-level authorized-shares adjustment, stock/convertible/
> warrant acceptance, and split of options/warrants/RSUs. (`Financing`, `StockLegendTemplate`, the
> `VestingTerms` condition/trigger graph, conversion triggers, and the identity/contact types remain
> genuine structural absences.)

**Carta → OCF (what Carta needs/models that OCF lacks).** Of the 139 Carta `$def`s, **40 are
written by some mapping; 99 are never populated.** The domain-bearing Carta-only concepts:

| Carta concept(s) | What it is | OCF gap |
|---|---|---|
| `Phantom*`, `Piu*` families (verified defs) | Phantom/Cash-Bonus units, Profits Interest Units | **Genuinely Carta-only** — OCF's `CompensationType` has no phantom or PIU member |
| `Rsu*`/`RestrictedStockUnit`, `Sar*`, `Rsa*`/`RestrictedStockAward` | RSU, SAR, RSA promoted to dedicated first-class security types | **Altitude mismatch, not absence** — OCF *does* model all three, via discriminator flags on shared transactions: `RSU`/`CSAR`/`SSAR` → `EquityCompensationIssuance.compensation_type`; `RSA` → `StockIssuance.issuance_type` (OCF deliberately treats an RSA as actually-issued stock, not a contractual award). Carta promotes each to its own transaction+security family. |
| `OptionExercise` (+ `OptionExerciseTaxWithholdingLineItem`, `Jurisdiction`), `Exercise` | Richer exercise-request object: tax withholding per jurisdiction, money movement, state machine | OCF exercise has only `date`/`quantity`/`resulting_security_ids` |
| `ConvertibleNote` interest economics (`interestRate`, accrual/compounding/`dayCountBasis`, `changeInControlPercent`) | Full note interest terms | OCF→Carta writes only principal/discount/cap |
| `PreferredShareClassDetails`, `ShareClassRightsAndPreferences.{multiplier, participating, participationCap, originalIssuePrice}`, `DividendDetails` | Preferred dividend & liquidation economics | OCF→Carta writes only `conversionRatio`/`conversionPrice` |
| `PerformanceCondition`, `Acceleration`, `GrantReason`, `BoardApproval` | Performance/milestone vesting, accel terms, grant metadata | No OCF source in this corpus |
| Computed roll-ups: `CapitalizationTableSummary`, `*ShareClassSummary`, `NoteBlockSummary`, `OptionPoolSummary` aggregates | `fullyDilutedShares`, `outstandingShares`, `cashRaised` | Read-only Carta aggregates; no OCF source |
| `StakeholderGroup`, `Corporation` (verified defs) | Arbitrary stakeholder grouping; vestigial issuer duplicate | No OCF analogue |
| Every `*.id` (server UUID) | `Issuer.id`, `Certificate.id`, `OptionGrant.id`, … | Carta assigns ids server-side; OCF `id` is internal-only |

Asymmetric vocabularies compound this: Carta's `StakeholderEntityType` has 7 members vs OCF's
2 (`INSTITUTION`→`UNKNOWN`); `StockOptionType` exposes 19 intl tracks OCF cannot reach;
`NoteType` members `DEBT`/`ASA` have no OCF source.

## 3. OCF Core — the round-trip-faithful subset

**Inclusion criteria (an OCF entity is Core iff all four hold):**

- **C1 — Carta home exists.** Substantive fields land on a real `$def` (≥75% substantive
  coverage, *or* a clean object analog where every dropped field is governance/provenance
  metadata, not the economic payload).
- **C2 — Economic payload survives.** The defining quantities (amount/quantity/price/date and
  the security/stakeholder/class ids) all map.
- **C3 — Transforms are deterministic & reversible.** Allowed: `Numeric→Decimal`,
  `Monetary→Money`, rename, 1:1 `enum-remap`, and the date→datetime widen/truncate. **Not**
  allowed: free-text→enum classification, array→scalar collapse, trigger-graph flattening,
  seniority rebasing.
- **C4 — No structural orphaning.** Reliance on Carta's `*TransactionItem` containers for the
  `securityId` link is structural, not loss.

**Bidirectional-fidelity test (the gate):** for a Core field `f`, `OCF→Carta→OCF` must return
`f` up to (a) datetime truncation and (b) numeric/monetary formatting — i.e. *every* transform
on its path lies in C3's reversible set. Fields needing free-text inference, array collapse, or
sibling-set context are **Core-entity-but-Extended-field** (listed at the bottom of the table).

**Core entities and their round-tripping fields** (Carta targets verified in the bundle):

| OCF entity | Carta home | Core fields (→ target) |
|---|---|---|
| **Monetary** | `Money` | `amount`→`amount`, `currency`→`currencyCode` (exact) |
| **VestingSchedule / Template / Statement** (canonical) | `Vesting`, `VestingScheduleTemplate`, `VestingPeriod` | template ref + `order/occurrences/period/cliff/percentage` (100%) |
| **Termination Window** | `ExercisePeriods` | `reason`+`period`+`period_type`→`*Count`/`*Period` |
| **Stakeholder** | `Stakeholder` | `name`→`fullName`; `stakeholder_type`→`entityType`; `issuer_assigned_id`→`employeeId`; `current_relationship`→`relationship` |
| **StockClass** | `ShareClass` | `name`; `class_type`→`type`; `default_id_prefix`→`prefix`; `initial_shares_authorized`→`authorizedShareCount`; `par_value`→`parValue`; `price_per_share`/`liquidation_preference_multiple`/`participation_cap_multiple`→`rightsAndPreferences.*` |
| **Issuer** *(identity-anchor exception)* | `Issuer` | `legal_name`→`legalName`; `dba`→`doingBusinessAsName` |
| **Valuation** | `ShareClassValuation` | `price_per_share`→`price`; `stock_class_id`→`shareClassId` |
| **StockPlan** | `OptionPoolSummary` | `plan_name`→`name`; `initial_shares_reserved`→`authorizedShares`; `stock_class_id`→`shareClassId` |
| **StockIssuance** | `Certificate` + `CertificateIssuanceTransaction` | `date`→`issueDate` (exact date↔date); `security_id`→`securityId`; `custom_id`→`securityLabel`; `stakeholder_id`; `stock_class_id`→`shareClassId`; `share_price`→`pricePerShare`; `quantity`; `vesting_terms_id`→`vestingScheduleTemplateId` |
| **EquityCompensationIssuance** *(strongest, 85% — option grants)* | `OptionIssuanceTransaction` + `OptionGrant` | `date`→`issueDatetime`; ids; `board_approval_date`→`boardApprovalDate`; `stock_plan_id`→`equityPlanId`; `quantity`; `exercise_price`→`exercisePrice`; `early_exercisable`; `expiration_date`→`expirationDatetime`; `vestings`→`OptionGrantVestingEvent.*`; `termination_exercise_windows`→`ExercisePeriods.*`; `compensation_type`→`stockOptionType` (ISO/NSO/OTHER). **Option grants only**: `compensation_type` `RSU`/`CSAR`/`SSAR` instead select Carta's `Rsu*`/`Sar*` families — a routing gap the current mapping does not yet emit. |
| **WarrantIssuance** | `WarrantIssuanceTransaction` + `WarrantTransactionItem` | `date`→`issueDatetime`; ids; `quantity`; `exercise_price`→`exercisePrice`; `purchase_price`→`purchasePrice`; `warrant_expiration_date`→`expirationDatetime` |
| **ConvertibleIssuance** | `ConvertibleIssuanceTransaction` + `ConvertibleNote` (+ `NoteBlock`) | `date`→`issueDatetime`; ids; `investment_amount`→`principal`; `convertible_type`→`NoteBlock.noteType` (`SAFE`→`SAFE`, `NOTE`→`CONVERTIBLE_DEBT`, `CONVERTIBLE_SECURITY`→`CONVERTIBLE_EQUITY`) |
| **Stock / EquityComp / Convertible Cancellation** | `*CancellationTransaction` (+`*TransactionItem`) | `date`→`effectiveDatetime`; `quantity` (or `amount`→`principal`); `security_id`→`*TransactionItem.securityId` |
| **WarrantCancellation** | `WarrantCancellationTransaction` | `date`→`effectiveDatetime`; `quantity` (no `securityId` leaf — only via `WarrantTransactionItem`) |
| **EquityComp / Warrant Exercise** | `OptionExerciseTransaction` / `WarrantExerciseTransaction` | `date`→`sharesAcquiredDatetime`; `quantity`; `resulting_security_ids`→`resultingSecurityId` |
| **EquityCompensationAcceptance** | `OptionGrant` | `date`→`stakeholderAcceptanceDate`; `security_id`→`securityId` |
| **StockConversion** | `CertificateIssuanceTransaction` + `Certificate` | `security_id`→`precededBySecurityId`; `resulting_security_ids`→`securityId`; `quantity_converted`→`quantity` (preceded-by lineage) |
| **EquityCompensationRelease** (RSU settle) | `RsuSettlementTransaction` + `RestrictedStockUnitSettlement` | `date`→`settlementDatetime`; `release_price`→`settlementPrice`; `quantity`→`releaseQuantity`; `resulting_security_ids`→`resultingSecurityId` |
| **StockClassAuthorizedSharesAdjustment** *(count mutation only)* | `ShareClass` | `stock_class_id`→`id`; `new_shares_authorized`→`authorizedShareCount` |

*Issuer is admitted by the C1 identity-anchor exception (only 2/11 substantive fields map);
all 9 dropped fields — formation, tax-ids, contact, address, issuer-level authorized shares —
have no Issuer-level Carta home.*

**Core-entity-but-Extended-FIELD** (drop on export, even from Core entities): `board_approval_date`
/`stockholder_approval_date` (except `OptionGrant.boardApprovalDate`); `consideration_text`;
`reason_text`→`reason` (free-text→enum); `security_law_exemptions`→`Compliance.federalExemption`
(array→single enum); `balance_security_id`; inline `vestings` on Stock/Warrant issuance;
`seniority`/`conversion_rights` (sibling-set computed); `conversion_triggers`/`exercise_triggers`
(terms survive, graph dropped); `tax_ids`/phone/address detail. (Non-option `compensation_type`
`RSU`/`CSAR`/`SSAR` and `StockIssuance.issuance_type=RSA` are **instrument-routing discriminators**,
not dropped fields — they select Carta's `Rsu*`/`Sar*`/`Rsa*` families and belong in those mappings,
which the current option/`Certificate`-centric mappings do not yet emit.)

## 4. Transforms required even within Core

- **Date↔datetime.** Every OCF transaction `date` (`YYYY-MM-DD`) widens to Carta
  `Iso8601CompleteCalendarDateTime` — synthesize midnight UTC on export, truncate on import.
  Reversible only to date granularity. **Exceptions** that are exact date↔date:
  `StockIssuance.date`→`Certificate.issueDate`, `VestingSchedule.start_date`→`Vesting.startDate`,
  `board_approval_date`→`OptionGrant.boardApprovalDate`.
- **Country / subdivision encoding.** OCF `CountryCode` is ISO-3166 **alpha-2**; Carta's coded
  slots (`Jurisdiction.country`, `Compliance.countryOfResidency`) use `Iso3166Set1Alpha3Code`
  (**alpha-3**) — a deterministic 1:1 transcode. Subdivisions need the `CC-` prefix
  added/stripped, lossless **only when country context is present**. `StakeholderAddress`
  exposes only `country`.
- **Identity remap.** OCF `id`/`object_type` are internal; Carta assigns server-side ids and
  types records positionally. FKs (`security_id`, `stakeholder_id`) map by *role* onto Carta
  ids — same role, different value — often landing one level up on a `*TransactionItem.securityId`.
- **Numeric/Monetary formatting.** `Numeric→Decimal` and `Monetary→Money` are representation-only
  (leading-zero / scientific-notation normalization); `CurrencyCode`↔`Iso4217CurrencyAlphaCode`
  is a clean alpha-3 match wrapped as `{value}`.
- **Enum coarsening.** `stakeholder_type` `INSTITUTION`→`UNKNOWN`; `interest_accrual_period`
  `QUARTERLY`→`…_QUARTERLY_CALENDAR`; relationship `NON_US_EMPLOYEE`↔`INTERNATIONAL_EMPLOYEE`.
- **Container grouping.** OCF emits flat transactions; Carta requires grouping rows by
  `security_id` into `*TransactionItem` arrays — structural, but a mapping obligation.

## 5. Deliberately excluded (OCF richness Carta cannot hold)

- **Conversion-trigger state machine.** OCF's `AutomaticConversionOnDate/Condition`,
  `ElectiveConversion*`, `WarrantConversionRight`, and `Custom`/`PercentCapitalization`/
  `FixedAmount` mechanisms — **0% mappable**. Carta stores conversion *terms* (discount/cap/ratio)
  as flat scalars, never the trigger graph (`conversion_mfn`, `conversion_timing`, `exit_multiple`,
  `valuation_type`, `capitalization_definition_rules` all dropped).
- **OCF vesting-condition graph.** `VestingTerms`, `VestingCondition*`, `*Trigger` — all 0%.
  Carta's flat `VestingPeriod`/template is fed by the canonical OCF vesting layer instead.
- **Explicit vesting events on plain stock.** OCF carries `vestings` (an explicit `Vesting`
  event array) on *every* issuance, but Carta exposes a `vestingEvents` array only on its
  grant-style securities (`RestrictedStockAward`, `OptionGrant`, `RestrictedStockUnit`). Plain
  `Certificate` (and SAR, which has no Carta security object) carry only `vestingScheduleTemplateId`,
  so a founders/certificate issuance expressed via explicit `vestings` rather than a template ref
  loses its per-tranche detail on round-trip — `Certificate` is the only Carta security object
  without an events array. (One-line Carta fix to close it: add `vestingEvents` to `Certificate`.)
- **Whole event families.** Acceptance (except EquityComp), retraction, the non-Warrant
  transfer family, adjustment, split/consolidation, repricing, return-to-pool, and standalone
  vesting/acceleration events — Carta keeps current state, not OCF's transaction stream.
- **Convertible interest detail.** Multi-rate step schedules (`interest_rates[]` with per-segment
  start/end) collapse to a single `interestRate`; `pro_rata`, `seniority`, `cost_basis` dropped.
- **Contact / identity / file detail.** Structured `Name`, multiple `Phone`/`Email` (first only),
  `TaxID`, `ShareNumberRange`, `File`/`Md5`, full multi-component `Address` (only `country` survives).
- **Governance & provenance.** Stockholder-approval dates, `consideration_text`/`reason_text`
  free text, `balance_security_id`, `Financing`, `StockLegendTemplate`, and OCF object lineage
  via `ObjectReference`.

## 6. Conclusion

A faithful interoperable core is achievable but narrow. **OCF Core** is the security-lifecycle
spine — `Stakeholder`, `StockClass`, `StockPlan`, `Valuation`, identity-only `Issuer`, the
canonical vesting trio, the scalar substrate (`Monetary`, `Vesting`, `TerminationWindow`), and
the **Issuance / Cancellation / Exercise / Conversion / Release** transactions for stock,
options, warrants, and convertibles. These round-trip cleanly once four mechanical transforms
(date↔datetime, country alpha-2↔alpha-3, id remap, numeric/monetary formatting) are honored.
Everything else divides into two structural mismatches maintainers should treat as out of scope:
OCF's forward-looking **state machines** (conversion triggers, vesting conditions) that Carta
realizes as flat terms, and OCF's **event stream** (transfers, retractions, adjustments, splits)
that Carta collapses into current-state snapshots — while Carta, conversely, *promotes to dedicated
security types* several instruments OCF carries as discriminator flags (RSU/SAR via
`compensation_type`, RSA via `issuance_type`), and models Phantom/PIU units plus tax/dividend/
performance detail OCF does not express. The core is the contract worth standardizing; the rest
belongs in documented, direction-specific extensions.
