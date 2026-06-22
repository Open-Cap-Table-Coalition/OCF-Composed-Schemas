# Event→Snapshot Reconstruction: Revising the "Dropped Family = None" Verdicts

*Companion to [`ocf-core-and-carta-gap-analysis.md`](./ocf-core-and-carta-gap-analysis.md).
For OCF and Carta maintainers. Every Carta field/enum named below was verified present in
`target-schema/Carta.schema.json`; negative claims ("no field exists") were verified by
exhaustive search.*

## 1. Premise: Carta is a snapshot, OCF is an event ledger

The gap analysis scored an OCF transaction family as **None** whenever Carta had no 1:1
transaction *type* of the same name. That test is too strict. **Carta is a current-state
snapshot** reached by a *sequence* of issuance and cancellation events; **OCF is the event
itself.** Carta exposes primitives to *replay* events onto its snapshot: cancellation **with a
reason** (`CertificateCancellationReason` has `…_TRANSFERRED`, `…_SHARE_CLASS_CONVERTED`;
`ConvertibleCancellationReason` has only `…_CANCELED`/`…_CONVERTED`), issuance **with a reason**
(`CertificateIssuanceReason._DEBT_CONVERTED`, `…_TRANSFERRED`), and **preceded-by lineage**
(`Certificate.precededBy` → `CertificatePrecededBy{reason, securities[]}`; `…precededBySecurityId`
on certificate, convertible and PIU issuances; `RestrictedStockAward.precededBy`).

So an OCF event with no namesake Carta type may still be *expressible* as the cancel+reissue (or
in-place mutation, or realized-event row) that **reaches the same end-state**. Several "None"s are
therefore **reconstructable**, lowering the true ceiling on the gap. The distinction this document
holds throughout: **"the end-state is reproducible" is not "the event/graph is preserved."**
Atomicity (one OCF id → many Carta rows), free-text (`consideration_text`, `reason_text`,
`comments[]` — **zero** matching fields in Carta), and audit/error semantics are lost even when
the snapshot is faithful.

## 2. The three reconstruction transforms

| # | Transform | Carta primitives it uses | What it can preserve |
|---|---|---|---|
| **A** | **Cancel + reissue with lineage** | `*CancellationTransaction{reason}` + `*IssuanceTransaction{issuanceReason, precededBySecurityId}` + `Certificate/RSA.precededBy{reason, securities[]}` | End-state; reason-coded *why*; backward (and, for warrants, forward) graph edge |
| **B** | **In-place snapshot mutation** | `ShareClass.authorizedShareCount`/`parValue`; `OptionPoolSummary.authorizedShares`; `ShareClassRightsAndPreferences.conversionRatio`/`conversionPrice`; `OptionGrant.exercisePrice`/`vestingStartDate`/`stakeholderAcceptanceDate` | End-state value of one field; subject identity |
| **C** | **Realized-event row** | `OptionGrant/RestrictedStockAward/RestrictedStockUnit.vestingEvents[]` → `*VestingEvent{vestDate, quantity, vested}`; `*.returnedToPoolQuantity` | Realized (quantity, date) fact; vested/returned state |

**Lineage asymmetry (governs every A-reconstruction):** only **`Certificate`** and
**`RestrictedStockAward`** carry a `precededBy{reason, securities[]}` object, and only
certificate/convertible/PIU **issuance transactions** carry `precededBySecurityId`. **`OptionGrant`
has no `precededBy`; `OptionIssuanceTransaction` has no `precededBySecurityId` and no
`issuanceReason`; `WarrantIssuanceTransaction` has no `precededBySecurityId`** (all verified
absent). So option- and backward-warrant reconstructions have structurally weaker lineage than
stock/RSA/PIU.

## 3. Family by family

### 3.1 Transfer — revised **STRONG** (stock/warrant/PIU/RSA), **PARTIAL** (convertible, option-grant)
Carta has a real transfer vocabulary: `…_TRANSFERRED` exists on `CertificateCancellation/Issuance/
PrecededByReason`, `WarrantCancellationReason`, `PiuCancellation/IssuanceReason`, and
`RestrictedStockAwardPrecededByReason`; `WarrantTransferTransaction` is purpose-built. Fidelity
caps at STRONG (never FULL): `consideration_text` has **no home anywhere** (zero `consideration`
fields); one atomic OCF event becomes a cancel + 1..n issue rows (id and `comments[]` lost).

| OCF txn | Carta reconstruction (A) | Fidelity | Key loss |
|---|---|---|---|
| `TX_STOCK_TRANSFER` | `CertificateCancellation(reason=_TRANSFERRED)` + `CertificateIssuance(reason=_TRANSFERRED, precededBySecurityId)`; new `Certificate.precededBy{_TRANSFERRED}` | STRONG | consideration; atomicity; multi-successor (`precededBy.securities[]` is many→one) |
| `TX_WARRANT_TRANSFER` | `WarrantTransferTransaction{resultingSecurityId, transferredDatetime}` (or cancel `_TRANSFERRED` + new issuance) | STRONG | **backward** lineage (no `precededBySecurityId`/`precededBy` on warrants); single `resultingSecurityId` |
| `TX_CONVERTIBLE_TRANSFER` | `ConvertibleCancellation(reason=_CANCELED)` + `ConvertibleIssuance(precededBySecurityId)` | PARTIAL | **no `_TRANSFERRED` cancel reason** → transfer only *inferable* from the issuance pointer; `ConvertibleNote` has no `precededBy` |
| `TX_EQUITY_COMPENSATION_TRANSFER` | RSA sub-case: `RSA.precededBy{_TRANSFERRED}` (STRONG). Option sub-case: `OptionCancellation(_CANCELED)` + new `OptionIssuance` — **no reason, no precededBy** | PARTIAL | option/RSU/SAR: **all** transfer lineage and reason; fidelity swings STRONG↔none by subtype |
| `TX_PLAN_SECURITY_TRANSFER` | Deprecated alias of the above; identical reconstruction | PARTIAL | same as EquityCompensationTransfer |

**Confirm:** transfers as cancel+reissue vs. in-place holder reassignment (no reassignment field
found); whether `resulting_security_ids` >1 (one→many holders) is representable given
`precededBy.securities[]` is many→one; whether an option-side `precededBy`/`issuanceReason` is planned.

### 3.2 Conversion — revised **STRONG**
Both transactions are template-A: a cancel and a matching issuance both carrying a conversion
reason, wired by `precededBySecurityId` and `Certificate.precededBy`.

| OCF txn | Carta reconstruction (A) | Fidelity | Key loss |
|---|---|---|---|
| `TX_CONVERTIBLE_CONVERSION` | `ConvertibleCancellation(reason=_CONVERTED)` + `CertificateIssuance(reason=_DEBT_CONVERTED, precededBySecurityId)`; `Certificate.precededBy{_DEBT_CONVERTED}` | STRONG | `trigger_id` (no trigger entity; `conversionTrigger` is a `Money` threshold); `capitalization_definition` (no Carta type); **unit shift** — source is principal (`Money`), target is share count |
| `TX_STOCK_CONVERSION` | `CertificateCancellation(reason=_SHARE_CLASS_CONVERTED)` + `CertificateIssuance(reason=_SHARE_CLASS_CONVERTED, precededBySecurityId)`; partial remainder via `…_BALANCE_REISSUED` | STRONG | atomicity; conversion ratio lives only as snapshot state (`ShareClassRightsAndPreferences.conversionRatio`), not on the event |

**Confirm:** explicit cancel+issue vs. internal flip via `ConvertibleNote.conversionDatetime`; how
a partial remainder is chained (keep note open vs. `BALANCE_REISSUED`); how multiple
`resulting_security_ids` share one `precededBySecurityId`.

### 3.3 Split / Consolidation — revised **STRONG** (certificate/RSA end-state), none-to-partial (derivatives)
`…_BALANCE_REISSUED` (a *precededBy* reason, not a cancel reason) is the lineage marker Carta
provides. Consolidation fits best because `CertificatePrecededBy.securities` is an **array**,
capturing OCF's N→1 fan-in natively.

| OCF txn | Carta reconstruction | Fidelity | Key loss |
|---|---|---|---|
| `TX_STOCK_CLASS_SPLIT` | Per-position `CertificateCancellation(_CANCELED)` + `CertificateIssuance` at `qty×ratio`, new `Certificate.precededBy{_BALANCE_REISSUED}` (A); + in-place `ShareClass.authorizedShareCount` (B) | STRONG | **`split_ratio` has no field** (survives only as a quantity multiple); atomicity (one event → N pairs, no grouping object); options/warrants/RSUs in the class have no lineage and **no strike/quantity-adjustment event** |
| `TX_STOCK_CONSOLIDATION` | For each `security_ids[]`: `CertificateCancellation(_CANCELED)`; one `CertificateIssuance(qty=Σ)` with `precededBy.securities[]` = full predecessor set (A) | STRONG | `reason_text`; atomicity; **cancel-side** reason is generic `_CANCELED` (no `BALANCE_REISSUED` on the cancel enum); non-cert/RSA types lack `securities[]` |

**Confirm (headline):** does Carta cancel+reissue with `BALANCE_REISSUED`, or **rescale balances
in place**? If in-place, the cancel+reissue reconstruction over-states history. Can per-holder
pairs be grouped as one corporate action; are option/warrant strike adjustments represented
anywhere (none found)?

### 3.4 Repricing — revised **PARTIAL** (end-state only)
Best path is **B**: write `OptionGrant.exercisePrice` (`Money`) = `new_exercise_price` in place.
This preserves grant identity, quantity, and in-flight vesting — which is why it **beats**
cancel+reissue (refuted: `OptionCancellationReason` has **no `_REPRICED`**; `OptionIssuanceTransaction`
has no `precededBySecurityId` and cannot set `vestedQuantity`/`vestingStartDate`, so a reissue
silently resets vesting and changes the end-state).

| OCF txn | Carta reconstruction (B) | Fidelity | Key loss |
|---|---|---|---|
| `TX_EQUITY_COMPENSATION_REPRICING` | in-place write `OptionGrant.exercisePrice = new_exercise_price` | PARTIAL | **the event** — no repricing/amendment tx type, no `_REPRICED` reason, no old→new price lineage; overwrite destroys the prior strike (no replay) |

**Confirm (gates even PARTIAL):** is `exercisePrice` writable post-issuance or strictly derived
from the immutable issuance transaction (if derived, fidelity collapses toward none)?

### 3.5 Authorized-share / pool adjustments — revised mostly **STRONG** (B), one **None**
Four of five are clean in-place mutations; the common loss is the **event/history**, the effective
**date**, and `board_approval_date`/`stockholder_approval_date` (those approval fields exist on
*grant* objects, not on `ShareClass`/`OptionPoolSummary`).

| OCF txn | Carta reconstruction | Fidelity | Key loss |
|---|---|---|---|
| `TX_STOCK_CLASS_AUTHORIZED_SHARES_ADJUSTMENT` | `ShareClass.authorizedShareCount = new_shares_authorized` (B) | STRONG | event/date/approval dates; history collapses to one value |
| `TX_STOCK_PLAN_POOL_ADJUSTMENT` | `OptionPoolSummary.authorizedShares = shares_reserved` (B); **no first-class `StockPlan` object** — only the derived summary | STRONG | date/approval dates; ISO stockholder-approval window |
| `TX_STOCK_PLAN_RETURN_TO_POOL` | `OptionGrant/Certificate.returnedToPoolQuantity` rollup (C) + prior `OptionCancellation`/`RsaCancellation` | PARTIAL | **destination-pool routing** (rollup has no destination pointer; plan rollover unrepresentable); `reason_text`; return date |
| `TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT` | `ShareClassRightsAndPreferences.conversionRatio` + `conversionPrice` (B) | STRONG | down-round event/trigger/prior ratio; `RatioConversionMechanism.rounding_type` (no rounding field) |
| `TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT` | **none** — `Issuer`/`Corporation`/`CapitalizationTableSummary` carry no authorized total (verified) | NONE | only a derived `Σ ShareClass.authorizedShareCount` approximates it; the standalone OCF figure is unhoused |

**Confirm:** is `OptionPoolSummary.authorizedShares` == board-reserved `shares_reserved` (not
net-of-grants); can `returnedToPoolQuantity` route to a non-issuing pool; any issuer-level
authorized total or class/pool change-log outside this slice.

### 3.6 Vesting events / acceleration / start — revised **STRONG** (start, date-based event), **PARTIAL** (milestone event, acceleration)

| OCF txn | Carta reconstruction | Fidelity | Key loss |
|---|---|---|---|
| `TX_VESTING_START` | `grant.vestingStartDate = date` (B) on OptionGrant/RSA/RSU | STRONG | `vesting_condition_id` (no condition-id field); event identity; multi-start grants degrade (scalar field) |
| `TX_VESTING_EVENT` | append `*VestingEvent{vestDate, quantity, vested=true}` (C); the row carries a boolean `performanceCondition` flag for milestone vests | STRONG (date) / PARTIAL (milestone) | `vesting_condition_id` (name-only); OCF id/atomicity; `comments[]`; **milestone ACHIEVED *status* is template-only** — `PerformanceConditionStatus` lives on `VestingPeriod.performanceCondition`, reachable only via `VestingScheduleTemplate.periods`, which no realized grant references; the realized row preserves only the boolean, not the status |
| `TX_VESTING_ACCELERATION` | extra `*VestingEvent{quantity, vested=true}` row for the end-state (C) | PARTIAL | **no accelerated-vs-scheduled flag**; `reason_text` has no realized home (`Acceleration{name,terms}` is reachable only via the draft-only `Vesting`, not a realized grant) |

**Confirm:** are `*VestingEvent` rows and `vestingStartDate` **ingestable on import** vs.
API-derived-only; how Carta correlates an OCF condition id to a `VestingPeriod`/`PerformanceCondition`
(name-only); is milestone ACHIEVED status recoverable on a realized grant (only the boolean flag,
not `PerformanceConditionStatus`, appears on the event row); any realized accelerated-vesting marker.

### 3.7 Retraction — revised **PARTIAL** (end-state only), all five transactions
Every retraction asserts the issuance was **entered in error / never validly effective.** Carta
has **no error/void/reversal primitive** (zero matches for void/rescind/retract/reverse/annul/
error). The only path is a `*CancellationTransaction(reason=_CANCELED)` on the same security —
which positively **asserts a real cancellation** (the opposite of "never happened") and leaves a
phantom canceled row. Lineage is irrelevant (no successor). Uniform PARTIAL:

| OCF txn | Carta reconstruction | Fidelity | Key loss |
|---|---|---|---|
| `TX_STOCK_RETRACTION` | `CertificateCancellation(_CANCELED, qty=full)` | PARTIAL | error semantics; `reason_text` (no free-text field); snapshot purity (cert persists as canceled) |
| `TX_CONVERTIBLE_RETRACTION` | `ConvertibleCancellation(_CANCELED)` | PARTIAL | same; poorest reason granularity (`_CANCELED`/`_CONVERTED` only) |
| `TX_WARRANT_RETRACTION` | `WarrantCancellation(_CANCELED)` | PARTIAL | same |
| `TX_EQUITY_COMPENSATION_RETRACTION` | per-instrument `Option/Rsu/Sar/Phantom/Piu/RsaCancellation(_CANCELED)` | PARTIAL | same; OCF object carries no instrument-type discriminator |
| `TX_PLAN_SECURITY_RETRACTION` | deprecated alias; identical | PARTIAL | same |

**Confirm:** whether Carta supports **out-of-band record deletion/voiding** (an admin "remove
transaction" outside the schema) that would truly delete the erroneous issuance — if so, fidelity
could rise toward FULL. The public schema exposes no such mechanism.

### 3.8 Acceptance — **split**: equity-comp **FULL** (B); stock/convertible/warrant **None**
Carta has no acceptance transaction type and no `Acceptance` object; acceptance is a snapshot
**date field**, so the only path is **B**.

| OCF txn | Carta reconstruction | Fidelity | Key loss |
|---|---|---|---|
| `TX_EQUITY_COMPENSATION_ACCEPTANCE` | `OptionGrant/RestrictedStockAward/RestrictedStockUnit.stakeholderAcceptanceDate = date` (B) | FULL | tx id, `comments[]`, audit row, correction semantics; **SAR/Phantom have no acceptance field** |
| `TX_PLAN_SECURITY_ACCEPTANCE` | deprecated alias; identical | FULL | same |
| `TX_STOCK_ACCEPTANCE` | **none** — no acceptance field on `Certificate`/`CertificateIssuanceTransaction` | NONE | **missing attribute**, not an event-vs-snapshot artifact |
| `TX_CONVERTIBLE_ACCEPTANCE` | **none** — no field on `ConvertibleNote`/issuance (`Interest.acceptanceDate` is the LLC-units object, not this) | NONE | missing attribute |
| `TX_WARRANT_ACCEPTANCE` | **none** — no per-warrant snapshot object; only block summaries | NONE | missing attribute + no row to annotate |

**Confirm:** is `stakeholderAcceptanceDate` writable independent of (re)issuing the grant; is
SAR/Phantom acceptance intentionally unsupported; does stock/convertible/warrant acceptance live
in a documents/e-signature subsystem outside this data API.

## 4. Revised gap table — the new, lower ceiling

The gap analysis scored every family below as **None**. Their true status:

| Previously-"None" family | Best transform | True status | Note |
|---|---|---|---|
| Conversion | A | **Strong** | end-state + lineage; loses trigger/cap-definition/atomicity |
| Transfer (stock/warrant/PIU/RSA) | A | **Strong** | reason-coded; loses consideration/atomicity |
| Transfer (convertible) | A | **Partial** | no `_TRANSFERRED` cancel reason |
| Transfer (option grant) | A | **Partial** | no option-side reason/lineage |
| Split / Consolidation (certificate/RSA) | A+B | **Strong** | loses split_ratio/atomicity; in-place vs cancel+reissue unconfirmed |
| Split / Consolidation (option/warrant/RSU) | — | **None-confirmed** | no lineage on those issuance types |
| Authorized-share & pool adjustments (4 of 5) | B / C | **Strong** (return-to-pool **Partial**) | loses event/date/approval history |
| Issuer authorized-shares adjustment | — | **None-confirmed** | no issuer-level authorized total |
| Repricing | B | **Partial** | end-state only; gated on `exercisePrice` writability |
| Vesting start, date-based vesting event | B / C | **Strong** | loses condition-id/atomicity |
| Milestone vesting event | C | **Partial** | only a boolean flag survives; ACHIEVED status is template-only |
| Vesting acceleration | C | **Partial** | no accelerated-vs-scheduled flag |
| Retraction (all five) | A (cancel only) | **Partial** | end-state only; no error/void primitive |
| Acceptance (equity-comp/plan-security) | B | **Full** | except SAR/Phantom |
| Acceptance (stock/convertible/warrant) | — | **None-confirmed** | genuine missing attribute |

## 5. What genuinely stays None

Reconstruction does **not** rescue these — they are missing *attributes* or *semantics*, not
event-vs-snapshot artifacts:

- **Issuer authorized-shares adjustment** — no issuer/charter-level authorized total in
  `Issuer`/`Corporation`/`CapitalizationTableSummary`; only a derived class sum approximates it.
- **Stock / Convertible / Warrant acceptance** — no acceptance field on `Certificate`,
  `ConvertibleNote`, or any warrant object; warrants lack a per-grant snapshot row.
- **Split/consolidation of options, warrants, RSUs, convertibles, PIUs** — those issuance types
  have no `precededBy`/`securities[]`, so the predecessor set cannot be captured.
- **Retraction error semantics (all five)** — no void/reversal primitive; a cancellation asserts
  a real event and leaves a phantom row; `reason_text` has no home.
- **Cross-cutting, every reconstruction:** `consideration_text`, `reason_text`, `comments[]` (no
  free-text fields); event **atomicity** and the single OCF `id` (one event → many rows, no
  grouping object); `split_ratio`; conversion `trigger_id`/`capitalization_definition`;
  `vesting_condition_id`; rounding policy.

## 6. Open questions for the Carta team (consolidated needs-confirmation)

1. **Authoring model (headline — gates Transfer, Conversion, Split):** are these entered as
   cancel+reissue (`_TRANSFERRED`/`_SHARE_CLASS_CONVERTED`/`_BALANCE_REISSUED`), or does Carta
   **rescale/flip in place**? In-place modeling makes the cancel+reissue reconstruction over-state
   history.
2. **Multi-successor cardinality:** is `resulting_security_ids` with >1 id representable, given
   `precededBy.securities[]` is many→one and `WarrantTransferTransaction.resultingSecurityId` is
   scalar?
3. **Option-side lineage:** is a `precededBy`/`issuanceReason` planned for `OptionGrant`/
   `OptionIssuanceTransaction` to close the option transfer/split/repricing gap?
4. **Writability on import (gates Repricing, Vesting, Acceptance):** are `OptionGrant.exercisePrice`,
   `vestingStartDate`, `stakeholderAcceptanceDate`, and the `*VestingEvent` rows **ingestable**, or
   strictly derived/read-only?
5. **Convertible transfer:** reuse `_CONVERTED`/`_CANCELED` on the cancel leg, or is `_TRANSFERRED`
   planned? Is `precededBySecurityId` alone an adequate transfer record?
6. **Return-to-pool routing:** can `returnedToPoolQuantity` route to a **non-issuing** pool (plan
   rollover)? Is `OptionPoolSummary.authorizedShares` board-reserved or net-of-grants?
7. **History/audit:** any class/pool authorized-shares change-log, or an issuer-level authorized
   total, outside this index slice? Anywhere to store `board_approval_date`/
   `stockholder_approval_date` for class/pool adjustments?
8. **Vesting correlation:** how does Carta map an OCF `vesting_condition_id` to a `VestingPeriod`/
   `PerformanceCondition` (name-only)? Is milestone ACHIEVED status recoverable on a realized grant?
   Any accelerated-vesting marker? Multiple vesting starts per grant?
9. **Out-of-band deletion:** can a Carta admin hard-delete/void an erroneous issuance (outside the
   public schema)? This would move Retraction from PARTIAL toward FULL.
10. **Off-API subsystems:** are stock/convertible/warrant acceptance and stock-legend/document data
    captured in a Carta documents/e-signature subsystem not present in this data API?
