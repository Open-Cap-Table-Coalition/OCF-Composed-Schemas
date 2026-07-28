# Carta Cap Table Data Schema - A Reader's Guide

**Guide version**: 2026-07-06

**Author:** Ray Shan, Carta

**Data schema version:** 2026-06-22

**Bundle:** data-schemas/carta-cap-table-schema-2026-06-22.json

## 1. What this is

This guide explains the **Carta Cap Table Data Schema** - what it describes, how the pieces fit together, and where it leaves room for extension. The accompanying JSON Schema bundle (carta-cap-table-schema-2026-06-22.json) is a JSON Schema 2020-12 document with 99 type definitions under \$defs/. Partners use it to validate cap-table records against the schema.

This schema is Carta's proposed foundation for **OCF Core v2**, the next version of the Open Cap Format. Today's OCF is **OCF Core v1**, the current transaction-ledger standard; where this guide contrasts with OCF, it means v1. Specialist modeling layered on top of Core is **OCF Extended**, and the extension points flagged throughout are where it attaches.

Note the scope of that check. JSON Schema validates structure and shape. Cross-field and cross-file rules (a period's slices summing to 100, cliffPercentage within range, decimal normalization, referential integrity across files) are semantic checks outside the bundle, not constraints JSON Schema enforces on its own. So "schema-valid" means structurally valid, not fully cap-table-valid.

The bundle describes the **facts** of a cap table - stakeholders, share classes, securities, and the transactions behind them - as types you validate records against. It's the data layer, independent of how Carta's API delivers it.

A few orientation notes before you dive in:

- **Carta's primary model is the snapshot.** Each security (an option grant, a share certificate, a convertible note) exists as a record describing its current state - quantity outstanding, vested quantity, terms, dates. Transactions are a parallel view that record the events that produced those snapshots. Both views ship in the bundle.

- **Opinionated about identity, permissive about the rest.** Each main entity requires the fields a record genuinely can't be without - its id, the issuer/holder linkage (issuerId, stakeholderId), and the core terms (issue date, quantity, name/type) - while the long tail of lifecycle and detail fields stays optional, because the snapshot model populates records progressively. Treat the schema as a floor: it enforces identity and the core economics, and an otherwise sparsely-populated record passes as long as it carries those and contradicts nothing.

- **Naming convention:** \$defs keys are PascalCase (OptionGrant, Stakeholder); property names are camelCase (stakeholderId, vestingScheduleTemplateId). This follows the dominant JSON Schema convention (OpenAPI, Schema.org).

- **Field boxes list salient fields, not every field.** Each entity below shows a Fields: box with the fields worth knowing first. The bundle's \$defs/\<Type\> is authoritative for the complete property set.

- **The guide uses Meetly as a worked example.** Meetly is Carta's sample issuer; its sample data ships in carta-api-sample-data/ and covers options, RSUs, RSAs, certificates, convertibles, and the corresponding transaction streams. Every code snippet below is trimmed from real Meetly data.

## 2. Cap tables and the shape of the schema

A **cap table** (capitalization table) is the authoritative record of who owns what in a privately held company: for every share, option, warrant, or convertible the company has issued - who holds it, when it was issued, what it converts into, and on what terms.

Carta's schema organizes that record as a set of peer-level **containers** - categories of equity, plan governance, debt instruments - with securities issued from each, plus a parallel **transaction ledger** recording the events behind them. Stakeholders hold securities across all containers.

```
─────────────────────────────────────────────────────────────────────
ISSUER (the company; one per cap table)
STAKEHOLDER (individuals & entities that hold equity)
SHARE CLASS (corporate equity categories)
└─ Certificate, RestrictedStockAward (direct)
[EQUITY INCENTIVE PLAN] [logical] (plan governance)
└─ OptionGrant, RestrictedStockUnit, RestrictedStockAward (plan-issued)
NOTE BLOCK (convertible round container)
└─ ConvertibleNote
[WARRANT BLOCK] [logical] (warrant series container)
└─ Warrant (ledger only)
VESTING SCHEDULE TEMPLATE (reusable rules library)
TRANSACTIONS (event ledger across all securities)
─────────────────────────────────────────────────────────────────────
```

**Diagram key:** \[logical\] = a concept tracked by reference (an ID or name on other records), not a standalone entity - see §4.2; (ledger only) = present as transactions, with no snapshot record; (direct) = issued straight from a share class, no plan involved.

The structural vocabulary you need to read the diagram and the tour:

- **Issuer** - the company. One per cap table.

- **Stakeholder** - anyone who holds equity: employees, founders, investors, advisors, entities.

- **Share Class** - a named category of corporate equity (e.g., "Common", "Series A Preferred"), each with its own rights.

- **Security** - a unit of ownership held by a stakeholder: a **Certificate** (issued shares), an **Option Grant**, a **Restricted Stock Unit (RSU)** or **Restricted Stock Award (RSA)**, a **Convertible Note / SAFE**, or a **Warrant**.

- **Transaction** - an event that creates, modifies, or ends a security: issuance, cancellation, exercise, settlement, transfer, conversion.

Two containers - Equity Incentive Plan and Warrant Block - are tagged \[logical\]: the records that belong to them carry the container's ID or name, and the container itself is a natural extension point on top of the foundation (§4.2).

Appendix B is a full glossary of the financial terms - vesting, cliff, dilution, liquidation preference, ISO/NSO, and the rest. This guide describes the data; the math of dilution, liquidation waterfalls, and 409A valuation is out of scope.

## 3. A guided tour through Meetly

### 3.1 Meet Meetly

Meetly is Carta's sample issuer - a deliberately diverse cap table containing share classes, option grants, RSUs, RSAs, share certificates, convertible notes, and the full transaction ledger backing them. Every snippet in this guide is real Meetly data, trimmed for readability. The sample files live in carta-api-sample-data/.

Meetly's issuer record:

```
{
"id": "7",
"legalName": "Meetly",
"doingBusinessAsName": ""
}
```

Short by design - see §3.2.

### 3.2 Issuer

```
$defs: Issuer
Fields: id, legalName, doingBusinessAsName
```

The cap-table schema models the issuer as an **identifier**, not a full company profile. Attributes you might expect - jurisdiction of incorporation, tax ID, registration date, federal exemption status - live in Carta's corporate-management surface rather than in the cap-table data. What the cap table needs is a stable handle to hang every share class, security, and transaction off of, and that's what Issuer provides.

### 3.3 Stakeholder

```
$defs: Stakeholder
Fields: id, issuerId, fullName, email, employeeId,
relationship, entityType, address
```

A stakeholder is anyone who holds equity - employees, founders, investors, advisors, entities. relationship captures their role; entityType classifies individual vs. entity.

Meetly's first employee:

```
{
"id": "4901",
"issuerId": "7",
"fullName": "Jeremy Mac",
"email": "jeremy@krakatoavc.com",
"employeeId": "",
"relationship": "EMPLOYEE",
"entityType": "ENTITY_TYPE_UNSPECIFIED"
}
```

Stakeholders also carry a StakeholderAddress sub-record (the address field) and a StakeholderRelationship enum value (the relationship field, e.g. EMPLOYEE, FOUNDER, ADVISOR).

entityType values:

- INDIVIDUAL

- CORPORATION

- LIMITED_LIABILITY_CORPORATION

- ESTATE_OR_TRUST

- PARTNERSHIP

- DISREGARDED_ENTITY

- UNKNOWN

The API also emits ENTITY_TYPE_UNSPECIFIED when a holder hasn't been categorized (it's the value in the sample above). That default is **not** part of the validated enum - a record carrying it won't validate against the bundle. Read it as "uncategorized," and map it to UNKNOWN when you need a schema-valid value.

### 3.4 Share Class

```
$defs: ShareClass
Fields: id, issuerId, name, prefix, type, authorizedShareCount,
parValue, seniority, pariPassu, preferredShareClassDetails
```

A share class is a category of corporate equity, defined once and issued many times. Each class has its own name (e.g., "Common", "Series Seed Preferred"), its own seniority in the liquidation waterfall, and - if preferred - its own economic rights and preferences (original issue price, conversion price and ratio, liquidation multiplier, participation).

Meetly's Common Stock:

```
{
"id": "9",
"issuerId": "7",
"name": "Common",
"prefix": "CS",
"type": "COMMON",
"authorizedShareCount": { "value": "80000000000.00000000000000000000" },
"parValue": {
"currencyCode": { "value": "USD" },
"amount": { "value": "0.000100000000" }
},
"seniority": 6,
"pariPassu": true
}
```

Preferred classes additionally carry preferredShareClassDetails, which bundles two sub-objects: rightsAndPreferences (a ShareClassRightsAndPreferences - original issue price, conversion price and ratio, liquidation multiplier, and participation via a participating flag with an optional participationCap) and dividendDetails (a ShareClassDividendDetails - dividend type plus accrual period, accrual type, interest type, and yield). Voting rights and the anti-dilution formula are not modeled in this bundle; they're a natural extension point.

Two security types are issued **directly from a share class** (no plan needed):

- **Certificate** - a share certificate, typically issued to investors, founders, and as the destination of RSU settlements, option exercises, and convertible conversions.

- **RestrictedStockAward** - restricted shares, sometimes issued directly from a class (founder shares) or under an equity plan (early employees).

#### 3.4.1 Certificate

```
$defs: Certificate
Fields: id, issuerId, stakeholderId, shareClassId, shareClassName,
securityId, securityLabel, issueDate, quantity, pricePerShare, dividendAccrualStartDate,
canceledDate, canceledQuantity, returnedToPoolQuantity, returnedToTreasuryQuantity, returnedInvestedCapital,
precededBy, vestingScheduleTemplateId, lastModifiedDatetime
```

Meetly's first Series Seed Preferred certificate:

```
{
"id": "34",
"stakeholderId": "4903",
"shareClassName": "Series Seed Preferred",
"issueDate": { "value": "2013-04-10" },
"quantity": { "value": "150000.00000000000000000000" },
"pricePerShare": { "currencyCode": { "value": "USD" }, "amount": { "value": "0.2650000000000000000000000000" } },
"securityLabel": "PS-2"
}
```

Note the pricePerShare - for primary issuance this is what the stakeholder paid; for secondary transfers it reflects the transferred price. canceledQuantity and returnedToPoolQuantity track downstream lifecycle. dividendAccrualStartDate records when dividends begin accruing on the shares, and returnedInvestedCapital records how much invested capital has been returned to the holder on repurchase or redemption. (Carta's API also emits an unreturnedInvestedCapital, but the standard excludes it as a derived value: it is pricePerShare × quantity minus returnedInvestedCapital, recomputable from the record itself. See the facts-vs-derived tiers in the Design Doc.)

The standard carries both the shareClassId → ShareClass.id foreign key and a denormalized shareClassName. Prefer the id for joins; the name is a convenience copy of ShareClass.name that drifts on rename. The Meetly record above (from a List endpoint) populates only the name - see §4.3.

**On the name "Certificate."** Carta calls an issued block of shares a *certificate*, which carries forward the era of paper stock certificates. Most shares today are **uncertificated** - held in book-entry (electronic) form with no physical document - so the generic, vendor-neutral term for this record is a **stock issuance** or **share issuance** (the issuance event), and the resulting holding is a **position**, **share lot**, or **book-entry holding**. Read Carta's Certificate as "a block of issued shares held by one stakeholder," whether or not a paper certificate was ever printed. The securityLabel (e.g., PS-2) is the human-facing identifier for that block.

#### 3.4.2 RestrictedStockAward (direct)

RSAs carry the same shape whether issued directly from a share class (founder shares are the canonical example) or under an equity plan - see §3.5.3 for the full reference. The share class is identified by shareClassId → ShareClass.id, with a denormalized shareClassName alongside it (Meetly's RSA records populate only the name - prefer the id, see §4.3). A plan-issued RSA additionally carries equityIncentivePlanName, which is empty for direct issuances.

### 3.5 \[Equity Incentive Plan & Option Pool\] - plan governance (logical)

```
[logical container - string on snapshots, FK on the ledger]
Reference shape: equityIncentivePlanName is a string on each snapshot;
equityPlanId is an FK on each issuance transaction.
```

An **equity incentive plan** is the legal container governing how a company issues equity-based compensation: board approval, plan term, share reserve, default cancellation behavior, and so on. An **option pool** is the carve-out within a plan that's reserved for future option issuance.

The plan is captured as a freeform name string on each grant (equityIncentivePlanName), and equityPlanId is preserved as a foreign key on the ledger side (OptionIssuanceTransaction.equityPlanId, RsuIssuanceTransaction.equityPlanId, etc.). On the snapshot side, grants belonging to the same plan are related by matching the plan name string. §4.2 covers the implications.

**What an industry standard should model for the plan/pool.** Carta's data model already tracks all of this; the Issuer API simply doesn't expose it as an entity - a Carta quirk, not a gap in the standard. None of these fields are in the 2026-06-22 bundle: the Required column marks what an extension that adds a first-class plan entity should require, not a conformance requirement of this standard.

| **Attribute** | **Purpose** | **Required** |
|----|----|----|
| id | Stable identifier; **join key** (see below) | ✓ |
| name | Plan name (e.g. "2021 Stock Plan") | ✓ |
| shareClassId | The class the plan issues against (usually common) | ✓ |
| authorizedShareCount | The option-pool size authorized under the plan | ✓ |
| boardApprovalDate | Board approval date | ✓ |
| shareholderApprovalDate | Shareholder approval date (gates ISO eligibility) | \- |
| effectiveDate | When the plan/amendment takes effect | ✓ |
| grantExpirationTerm | Maximum life of a grant, in years | ✓ |
| exercisePeriods | Default post-termination exercise windows - the same ExercisePeriods object grants carry (period unit ∈ EXERCISE_PERIOD_DAY / EXERCISE_PERIOD_MONTH / EXERCISE_PERIOD_YEAR) | ✓ |
| status | Lifecycle: DRAFT / EXECUTED / INACTIVE | ✓ |
| amendments\[\] | Ordered pool changes, each with its own authorizedShareCount + approval/effective dates | ✓ |
| repurchaseWindow | Default repurchase period for unvested / early-exercised shares | \- |
| pourOverFromPlanId | Predecessor plan whose returned shares roll into this one | \- |

**Join key:** id ↔ equityPlanId, which already exists on all seven issuance transactions (OptionIssuanceTransaction, RsuIssuanceTransaction, …). Grant *snapshots* carry only equityIncentivePlanName (a string), so a snapshot-to-plan join is name-based until a grant-level equityPlanId is added.

*Calculated view (not a stored field):* available pool = authorizedShareCount − issued, where issued is the sum of outstanding grants tied to the plan.

Three security types are plan-issued (or commonly plan-issued):

#### 3.5.1 OptionGrant

```
$defs: OptionGrant
Fields: id, issuerId, stakeholderId, equityIncentivePlanName, shareClassId,
securityId, securityLabel, vestingScheduleTemplateId, vestingSchedule,
vestingEvents, vestingStartDate, exercises, exercisePeriods, exercisePrice,
stockOptionType, earlyExercisable,
quantity, outstandingQuantity, vestedQuantity, exercisedQuantity,
canceledDate, canceledQuantity, forfeitedQuantity, expiredQuantity,
returnedToPoolQuantity, returnedToTreasuryQuantity,
boardApprovalDate, issueDate, stakeholderAcceptanceDate,
grantExpirationDate, lastExercisableDate, terminationDate,
disqualificationDate, lastModifiedDatetime
```

Option grants are the densest equity object in the schema - they carry plan reference, vesting, exercise terms, quantity tracking across the lifecycle, and tax classification. Meetly's grant 2502 (truncated):

```
{
"id": "2502",
"stakeholderId": "4916",
"equityIncentivePlanName": "Equity Incentive Plan 2023",
"issueDate": { "value": "2013-06-30" },
"vestingStartDate": { "value": "2013-06-30" },
"grantExpirationDate": { "value": "2023-06-30" },
"stockOptionType": "ISO",
"quantity": { "value": "150000.00000000000000000000" },
"vestedQuantity": { "value": "150000.00000000000000000000" },
"exercisedQuantity": { "value": "150000.00000000000000000000" },
"exercisePrice": {
"currencyCode": { "value": "USD" },
"amount": { "value": "0.200000000000" }
},
"securityLabel": "ES-1",
"vestingScheduleTemplateId": null,
"vestingSchedule": { "name": "1/48, 1Y cliff",
"startDate": { "value": "2013-06-30" },
"endDate": { "value": "2017-06-30" } },
"exercisePeriods": {
"voluntaryTerminationCount": 180,
"voluntaryTerminationPeriod": "EXERCISE_PERIOD_DAY",
"involuntaryTerminationCount": 90,
"deathExerciseCount": 12,
"deathExercisePeriod": "EXERCISE_PERIOD_MONTH"
/* ... etc. */
}
}
```

A few fields worth pointing out:

- **Two independent axes track the grant.** *Disposition* - outstandingQuantity is what's still live, against the parts that have left via exercisedQuantity, canceledQuantity, forfeitedQuantity, expiredQuantity, returnedToPoolQuantity, returnedToTreasuryQuantity. *Vesting* - vestedQuantity is how much has vested, independent of disposition (a grant can be fully vested *and* fully exercised). So vestedQuantity is not part of the disposition tally - don't add it in. (Treat the quantity fields as reported values, not a guaranteed arithmetic identity; sample records can carry surprising values.)

- **stockOptionType** carries the tax classification - ISO, NSO, or an international variant. Both the short form (ISO) and the prefixed form (STOCK_OPTION_TYPE_ISO) validate, since Carta uses each in different endpoints. A grant can also split across ISO and NSO treatment under the [<u>\$100K ISO limit</u>](https://support.carta.com/s/article/100k-rule), but that split is a derived calculation the standard leaves to the projection layer, not a carried field (see the §3.8 schema note).

- **exercisePeriods** captures the post-termination exercise windows per termination reason (voluntary, involuntary with cause, death, disability, retirement). These default per plan, can be overridden per grant.

- **Three vesting fields, three roles.** vestingScheduleTemplateId points to the reusable rule set in the template library (§3.8). vestingSchedule is *header metadata only* - the applied schedule's name, startDate, endDate, lastModifiedDate - **not** the tranches. vestingEvents\[\] is the tranche-by-tranche record (one entry per vest date, with its quantity and vested status). So: template = the rules, vestingSchedule = a labeled header, vestingEvents = the computed tranches. vestingSchedule.startDate equals the grant's top-level vestingStartDate - one anchor surfaced twice (equal on all 149 Meetly grants). See §3.8.

#### 3.5.2 RestrictedStockUnit

```
$defs: RestrictedStockUnit
Fields: id, issuerId, stakeholderId, equityIncentivePlanName, shareClassId,
securityId, securityLabel, vestingScheduleTemplateId, vestingSchedule,
vestingEvents, vestingStartDate, settlements, releasedQuantity, netSettledQuantity,
releasePricePerShare, quantity, vestedQuantity, canceledDate, canceledQuantity,
forfeitedQuantity, expiredQuantity, returnedToPoolQuantity, returnedToTreasuryQuantity,
issueDate, boardApprovalDate, stakeholderAcceptanceDate, terminationDate,
lastModifiedDatetime
```

RSUs are promises to deliver shares once vesting completes. They share a lot of shape with OptionGrant (vesting fields, quantity tracking) but lack the exercise machinery - there's nothing to "exercise" because there's no strike price. Instead they have **settlements**: events that convert vested units into delivered shares. Meetly's first RSU (truncated):

```
{
"id": "8550",
"stakeholderId": "6113",
"equityIncentivePlanName": "Equity Incentive Plan 2023",
"issueDate": { "value": "2015-06-01" },
"quantity": { "value": "1500.00000000000000000000" },
"vestedQuantity": { "value": "1500.00000000000000000000" },
"releasedQuantity": { "value": "0" },
"netSettledQuantity": { "value": "0" },
"securityLabel": "ES-136",
"vestingSchedule": { "name": "1/48, 1Y cliff" }
}
```

Settlements that convert RSUs into Certificates are tracked via RsuSettlementTransaction on the ledger side.

#### 3.5.3 RestrictedStockAward

RSAs are issued shares subject to forfeiture until vesting completes. Same general shape as OptionGrant minus the exercise machinery. Like RSUs, they have vesting events; unlike RSUs, the shares are *already issued* - you hold them from day one, but the company can repurchase unvested shares if you leave early. Forfeiture is captured via returnedToTreasuryQuantity.

RSAs can be issued directly from a share class (founder shares, see §3.4.2) or under an equity plan (early employees). The schema is the same; the equityIncentivePlanName field distinguishes them.

### 3.6 Note Block

```
$defs: NoteBlock
Fields: id, name, prefix, noteType, status
```

A **note block** is the legal container for a series of convertible notes - a single financing round under one document (a SAFE round, a convertible note round). Meetly's first note block:

```
{
"id": "1",
"name": "2013 SAFE",
"prefix": "SAFE",
"noteType": "SAFE",
"status": "EXECUTED"
}
```

The noteType classifies the instrument. NoteType values:

- SAFE - Simple Agreement for Future Equity: converts to equity, not debt; typically no interest or maturity.

- ASA - Advance Subscription Agreement, the UK equivalent of a SAFE.

- CONVERTIBLE_DEBT - a convertible note: debt that converts to equity, carrying interest and a maturity date.

- CONVERTIBLE_EQUITY - a convertible equity instrument that converts without being debt.

- DEBT - a straight debt instrument with no conversion feature.

status tracks lifecycle (DRAFT, EXECUTED, INACTIVE).

#### 3.6.1 ConvertibleNote

```
$defs: ConvertibleNote
Fields: id, issuerId, stakeholderId, securityLabel, noteBlock,
cashPaid, interestRate, interest, interestAccrualPeriod,
interestCompoundingPeriod, dayCountBasis, priceCap, discountPercentage,
changeInControlPercent, conversionTrigger, conversionDatetime,
issueDatetime, maturityDatetime, canceledDatetime, canceledQuantity
```

A convertible note is a debt instrument that converts into equity on a future event - typically a priced round, change of control, or maturity. A SAFE (Simple Agreement for Future Equity) is the same convert-later idea without the debt - no repayment obligation, and often no interest or maturity. Carta models both as ConvertibleNote, distinguished by the note block's noteType; a SAFE-typed record can still populate note-like fields (interest, maturity) when the instrument carries them. The conversion math is governed by priceCap (valuation ceiling), discountPercentage (conversion discount vs. round price), and changeInControlPercent (multiplier on CIC). Note-style convertibles also populate interest terms - interestRate, interestAccrualPeriod, interestCompoundingPeriod, and the [<u>day-count basis</u>](https://support.carta.com/s/article/day-count-basis) used to accrue it.

Meetly's first SAFE:

```
{
"id": "5",
"stakeholderId": "5375",
"securityLabel": "SAFE-1",
"issueDatetime": { "value": "2013-07-02T07:00:00.000Z" },
"cashPaid": { "currencyCode": { "value": "USD" }, "amount": { "value": "500000.00000000" } },
"priceCap": { "currencyCode": { "value": "USD" }, "amount": { "value": "6000000.00000000" } },
"discountPercentage": { "value": "20.00000000" },
"interestRate": { "value": "6.00000000" },
"interestAccrualPeriod": "INTEREST_ACCRUAL_PERIOD_ANNUALLY",
"interestCompoundingPeriod": "SIMPLE",
"dayCountBasis": "COUNT_ACTUAL_365",
"changeInControlPercent": { "value": "100.00000000" },
"noteBlock": {
"id": "1", "name": "2013 SAFE", "noteType": "SAFE", "status": "EXECUTED"
},
"conversionDatetime": { "value": "2023-11-01T07:00:00.000Z" },
"canceledDatetime": { "value": "2023-11-01T07:00:00.000Z" }
}
```

Note that the **noteBlock is embedded inline** as a property - same shape as the standalone NoteBlock entity but materialized on the note rather than referenced by FK. The corresponding ConvertibleIssuanceTransaction uses the FK form (noteBlockId).

Conversion lineage to a resulting Certificate is captured via CertificatePrecededBy on the certificate side (see §4.1).

### 3.7 \[Warrant Block\] - warrant container (logical)

```
[logical container - not represented in this bundle]
Warrants appear only as transactions; the grouping block has no field or entity here.
```

A **warrant block** is the container for a series of warrants issued under common terms - typically as compensation, debt-deal sweeteners, or anti-dilution protection. This bundle carries the warrants only as transactions (§3.7.1); the block that groups them isn't represented as a field or entity, so consolidating warrants into a block is an extension point. §4.2 covers the implications.

**What an industry standard should model for the warrant block.** Like the plan/pool above, this entity is not in the 2026-06-22 bundle, and its Required column applies only to an extension that adds it. To match the exposed NoteBlock, both its shape *and* its joinability, the block stays thin and the economics live on the warrant:

| **Attribute** | **Purpose** | **Required** |
|----|----|----|
| id | Stable identifier; **join key** (see below) | ✓ |
| name / prefix | Series name and short label | ✓ |
| status | Lifecycle: DRAFT / EXECUTED / INACTIVE (the same enum as NoteBlock) | ✓ |

Economics live on the **Warrant** security, exactly as ConvertibleNote (not NoteBlock) carries price cap and discount: shareClassId, exercisePrice, quantity, issueDate, expirationDatetime, stakeholderId, plus the block embedded inline.

**Join key:** id ↔ warrantBlockId. Neither the FK nor the inline embed exists yet (warrants are ledger-only). NoteBlock shows the pattern to match: noteBlockId on the issuance transaction, plus the block embedded on the security. *Extension point: add warrantBlockId on warrant issuance and an inline warrant.warrantBlock.*

*Extension points:* block-level expiration/term; warrant coverage (e.g. % coverage tied to a financing) and a link to the originating note.

#### 3.7.1 Warrant - ledger only

Warrants live entirely on the ledger: WarrantIssuanceTransaction, WarrantExerciseTransaction, WarrantTransferTransaction, WarrantCancellationTransaction. A warrant's current state is the result of replaying those events.

### 3.8 Vesting Schedule Template

```
$defs: VestingScheduleTemplate
Fields: id, uuid, issuerId, name, description, vestingScheduleType, periods
```

A **vesting schedule template** is the reusable rule set that drives how a grant vests. It's referenced from grants via vestingScheduleTemplateId. Templates define the periods (cliff duration, tranche duration, vesting method, occurrence policy), not the concrete dates - those get applied when the template is instantiated on a specific grant.

Meetly's simplest template:

```
{
"id": "2",
"issuerId": "7",
"name": "1/48, No Cliff",
"description": "Shares vest monthly for the next 48 months on the same day as the start date.",
"vestingScheduleType": "DATE",
"uuid": "8da79696-ebd0-4195-8fb9-26186531a2c4",
"periods": [
{
"order": 1,
"percentage": { "value": "100" },
"vestingMethod": "MONTHLY",
"vestingOccurs": "SAME_DAY_AS_START_DATE",
"length": 48,
"lengthUnit": "MONTH",
"cliffLength": 0,
"cliffLengthUnit": "MONTH",
"milestoneName": ""
}
]
}
```

The periods\[\] array carries VestingPeriod records - the rule definitions. A template can have multiple periods (e.g., a 1-year cliff + 3 years monthly vesting + a final performance-gated period); each period contributes a slice of the total.

**Period field enums:**

- vestingMethod - the cadence at which tranches vest: DAILY, WEEKLY, MONTHLY, BI_MONTHLY, QUARTERLY, SEMI_ANNUALLY, ANNUALLY.

- vestingOccurs - which calendar day inside each interval the tranche lands on: SAME_DAY_AS_START_DATE, FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH, SAME_DAY_AS_START_DATE_MINUS_ONE.

- lengthUnit / cliffLengthUnit - the unit for length / cliffLength, the period's and cliff's total duration: DAY, MONTH, YEAR.

- vestingScheduleType (on the template) - DATE (time-based), MILESTONE (event-based), HYBRID (both).

**When vestingMethod is populated.** It's set only when the template is a single time-based period (the common case - e.g. "1/48, monthly"). A multi-period template expresses each tranche as its own period and leaves vestingMethod unset on every period (it surfaces as the VESTING_METHOD_UNSPECIFIED zero-value); the cadence is then implied by each period's length / lengthUnit.

**Date semantics: cadence, anchoring, chaining.**

- **The cadence divides the length; a leftover truncates.** The cadence sets the interval (quarterly vests every 3 months). A length that isn't a whole multiple of that interval drops the leftover rather than emitting a partial final tranche: 50 months at a quarterly cadence yields 16 tranches covering 48 months, and the trailing 2 months vest nothing. The standard accepts non-multiple lengths, since Carta permits them, though producers should prefer a whole-multiple length to avoid silently dropping time.

- **Length unit and cadence don't mix.** A populated vestingMethod always pairs with lengthUnit: MONTH, and the bundle enforces this with a conditional rule. Express day- or year-granular vesting, or any method-less schedule, as multi-period tranches, each carrying its own length / lengthUnit and no vestingMethod. (Carta never emits a non-month length alongside a vestingMethod, so this rules out nothing real.)

- **SAME_DAY_AS_START_DATE anchors to the grant's vestingStartDate, with month-end clamping.** Every tranche lands on the grant start's day-of-month; when a month is too short (start on the 31st, then February), the date clamps to the last day of that month and returns to the 31st the next month, so the clamp doesn't propagate. Because the anchor is the original grant start, not each period's own start, a schedule written as several chained periods produces the same dates as the same schedule written as one period, so multi-period and single-period schedules agree with no extra reconciliation.

- **SAME_DAY_AS_START_DATE_MINUS_ONE clamps first, then subtracts a day.** It computes the same month-end-clamped anniversary as SAME_DAY_AS_START_DATE, then steps back one day. A Jan-31 start, monthly: February clamps to the 28th (or 29th), then −1 is the 27th (or 28th); March is the 31st with no clamp, then −1 is the 30th; April clamps to the 30th, then −1 is the 29th. (FIRST_DAY_OF_MONTH / LAST_DAY_OF_MONTH snap to the first/last of the month instead.)

**Vesting start before the issue date.** Because the schedule anchors purely on vestingStartDate, a grant whose vesting start precedes its issueDate comes out already partially vested, each historical tranche on its own calendar date, not bunched onto the issue date. Meetly grant ES-8 shows it: vesting start 2012-01-02, issued 2013-01-31, the one-year cliff dated 2013-01-02 (pre-issuance) and already vested. This does **not** corrupt ISO accounting: the ISO \$100k-per-year limit buckets by the *exercisability* date, which is never earlier than the issue date, so a pre-issuance vest date still counts in the issue year. The ISO/NSO split itself is a derived classification the standard doesn't carry (it needs grant-date fair-market value and a cross-grant rollup, see the per-security tranche-event schema note below); a consumer computing it must apply that same issue-date floor to the exercisability date.

**Cliff and immediate slices.** Three percentage fields split a period's allocation. immediatePercentage vests at the grant vestingStartDate itself (day 0); cliffPercentage is an explicit lump that vests on the cliff date (cliffLength after start); percentage (the remainder) vests over the rest of the period via vestingMethod. These are stored fields, not ratios derived from elapsed time - the "1/48, 1Y cliff" template stores cliffPercentage: 25 / percentage: 75 directly. A period may carry both an immediate slice and a cliff (their sum must be ≤ 100): the immediate slice vests at the start date, the cliff slice at the cliff date.

- *The cliff and immediate slices come straight from their percentages; the remainder is distributed by tranche count.* The cliff and immediate amounts are each their stored percentage of the grant quantity, rounded down to whole shares. The remaining percentage is a display value: its tranches are distributed evenly across the period count rather than by multiplying that stored percentage through, so for the remainder trust the period count over the stated percentage.

- *The cliff percentage is a free input, independent of the cliff's position.* cliffLength / cliffLengthUnit set only the cliff *date*; cliffPercentage independently sets the *amount* (any value above 0, up to and including 100, with immediatePercentage + cliffPercentage ≤ 100). The two aren't linked, so a 25% cliff at month 12 of a 36-month schedule is valid even though 12 of 36 months is one-third, not a quarter. A cliffPercentage: 33.33 is applied as exactly 33.33%: on 3,000,000 shares the cliff vests 999,900 (33.33% rounded down to whole shares), faithful to the stated 33.33%, not rounded toward one-third (1,000,000). The percentage is carried as an exact decimal, never a fraction; the schedule's remaining tranches still true up to the exact grant total, so only the cliff slice itself reflects the literal decimal. *Interchange note: carry the percentage decimal verbatim as a string and apply it to the quantity to reproduce the cliff exactly. A fraction-based encoding would only mirror the stored decimal (e.g. 3333/10000), not recover a "true" one-third Carta never held.*

- *Reusable templates and repeating-decimal cliffs.* Because the cliff amount is the percentage applied to the grant quantity, and one template is reused across grant sizes, a cliff that is a repeating decimal (a 1-year cliff on a 3-year monthly schedule is 1/3) must be expressed with enough significant digits, not a short round: fill it to the standard's 10-digit bound (cliffPercentage: 33.3333333333), not 33.33. cliffPercentage is a free value the template author sets, not one Carta derives from the cliff's position, so supplying the precision is the author's job. The precision governs only how closely the *cliff event* tracks the intended fraction: 33.33 runs ~100 shares low on a 3,000,000-share grant, 33.333333 (six places) stays within ~1 share into the hundreds of millions, and the standard's 10-digit bound (§4.4) holds into the trillions. The *grant total* always trues up to the exact amount regardless, via the post-cliff tranches, so precision is about cliff-event fidelity, never total correctness.

**Milestone and performance vesting.** A period can vest on a condition instead of, or in addition to, a date. The structured gate is PerformanceCondition, carrying type, status, payoutPercentage (with minPayoutPercentage / maxPayoutPercentage for sliding payout curves), evaluationDate, and vestsPostTermination. The period's milestoneName is just a human label, not an independent gate; on a materialized vesting event, performanceCondition is a boolean flag meaning *a condition exists* (not that it has been met). The structured condition is optional - a milestone may be a bare named placeholder (milestoneName set, performanceCondition empty, as in Meetly's templates) or carry a full PerformanceCondition.

- **type** - PERFORMANCE_NON_MARKET (operational/business goals, e.g. a revenue or EBITDA target), MARKET (stock-price / TSR), EVENT_NON_MARKET (a liquidity event, e.g. an IPO).

- **status** - NOT_EVALUATED (pending), ACHIEVED, NOT_ACHIEVED; derived from whether an evaluation has occurred, not stored.

- **vestingScheduleType** - MILESTONE when every period is condition-gated, HYBRID when date and condition periods are mixed.

- **Payout range** - payoutPercentage, bounded by minPayoutPercentage / maxPayoutPercentage, scales the award by achievement level, so a vesting event can carry a maxQuantity above its targetQuantity (e.g. target 12,000, max 18,000 - up to 150%). vestsPostTermination flags whether the condition can still vest after the holder leaves; evaluationDate records when it was assessed.

**A milestone gates only its own slice - it doesn't re-anchor later vesting.** Date-based tranches and condition-based milestones are independent: each date tranche is scheduled off the grant start plus the cumulative lengths of the *date* tranches only, so a milestone (which has no length) never shifts a later date tranche out. length / lengthUnit apply only to date tranches. A hybrid tranche (date-scheduled and also condition-gated) is itself a date tranche, so its length counts toward that cumulative offset and positions later date tranches after it, exactly like a plain date tranche; its condition still gates only its own slice. The distinction that matters: a period's *length* positions later date tranches (hybrids included), while a period's *condition* never moves them. Two pending-event shapes result:

- **Pure milestone** (e.g. an IPO gate): vested: false, performanceCondition: true, and **no vestDate** until achieved. It may carry a payout range (targetQuantity vs a larger maxQuantity).

- **Double-trigger / hybrid** (a date-scheduled tranche that is also condition-gated): vested: false, performanceCondition: true, but **with a real vestDate** (the time schedule); the condition is the second trigger.

*Interchange recommendation:* represent an unscheduled milestone target as an **absent vestDate** (or an explicit pending marker), never a sentinel date - a literal far-future date would read as a real vest date to a naive consumer.

**What a populated condition looks like (illustrative).** The condition object lives on the template, one level down the tree at VestingScheduleTemplate \> periods\[\] \> performanceCondition, not on the grant and not on the materialized vesting event. Meetly's milestones are bare milestoneName placeholders with an empty condition object, so the following is synthetic: a HYBRID template period gated on a fully populated PerformanceCondition, an FY2024 EBITDA target that pays out on a sliding 0-150% curve, evaluated as achieved at 120%:

```
{
"order": 2,
"percentage": { "value": "25" },
"milestoneName": "2024 EBITDA Target",
"length": 0,
"performanceCondition": {
"name": "2024 EBITDA Target",
"description": "FY2024 EBITDA of $10M; sliding 0-150% of target between $8M and $12M.",
"type": "PERFORMANCE_CONDITION_TYPE_PERFORMANCE_NON_MARKET",
"minPayoutPercentage": { "value": "0" },
"maxPayoutPercentage": { "value": "150" },
"vestsPostTermination": false,
"evaluationDate": { "value": "2025-02-15" },
"payoutPercentage": { "value": "120" },
"status": "PERFORMANCjE_CONDITION_STATUS_ACHIEVED"
}
}
```

The time-cadence fields (vestingMethod / vestingOccurs / lengthUnit) are unset on a milestone period, surfacing as their \*\_UNSPECIFIED zero-values (per the enum note above), so they're omitted here. While pending, the condition carries status: PERFORMANCE_CONDITION_STATUS_NOT_EVALUATED with no evaluationDate or payoutPercentage. Swap type for the other cases: PERFORMANCE_CONDITION_TYPE_EVENT_NON_MARKET (an IPO or other liquidity event, forced to a 0/100 payout) or PERFORMANCE_CONDITION_TYPE_MARKET (a stock-price / TSR target). Note the condition enums carry the PERFORMANCE_CONDITION\_\* proto prefix, unlike the short vesting enums (MILESTONE, MONTHLY) above.

The materialized events this produces on the grant's vestingEvents\[\] - one achieved, two pending:

```
[
{
"id": "evt-ebitda-2024",
"vestDate": { "value": "2025-02-15" },
"performanceCondition": true,
"vested": true,
"targetQuantity": { "value": "25000" },
"maxQuantity": { "value": "37500" },
"vestedQuantity": { "value": "30000" }
},
{
"id": "evt-ipo-gate",
"performanceCondition": true,
"vested": false,
"targetQuantity": { "value": "25000" },
"maxQuantity": { "value": "25000" }
},
{
"id": "evt-double-trigger-2025-06-30",
"vestDate": { "value": "2025-06-30" },
"performanceCondition": true,
"vested": false,
"targetQuantity": { "value": "25000" },
"maxQuantity": { "value": "25000" }
}
]
```

Reading them: the first is an achieved performance tranche, its 120% payout landing vestedQuantity at 30,000 (120% of the 25,000 target, under the 37,500 max); its vestDate equals the condition's evaluationDate because a pure milestone vests on the day it's recognized. The second is a pending pure milestone (an IPO gate), no vestDate until achieved. The third is a pending double-trigger: a date-scheduled tranche (vestDate 2025-06-30) that also carries a condition, so it stays vested: false until the date passes *and* the condition is met.

**The exact achievement date is evaluationDate on the condition, not the event's vestDate.** Carta defines a condition's achievement date as its evaluation (recognition) date, so evaluationDate is the authoritative "when did it fire." For a pure milestone the tranche's vestDate coincides with it (above); for a double-trigger the vestDate is the time-schedule date, distinct from the condition's evaluationDate. The materialized event carries only the boolean performanceCondition flag plus vested / vestDate, so read the achievement date, status, and payout from the PerformanceCondition on the period, not from the event.

**Partial payouts: trust the materialized quantity.** When a condition pays out partially, the vested count is the payout percentage applied to the tranche, then rounded to whole shares. The standard carries the resulting vestedQuantity / targetQuantity / maxQuantity but not the rounding selector Carta applies, so treat those materialized quantities as authoritative rather than recomputing them from payoutPercentage (which can differ by a share at the rounding boundary). This is the one vesting quantity that isn't fully reproducible from the other fields; time-based tranches follow the deterministic cumulative true-up below.

**How the template relates to applied vesting on a grant**:

- The template lives in this top-level library and is referenced by vestingScheduleTemplateId on each grant.

- The **applied vesting schedule** lives *on the grant itself* as the vestingSchedule property (name, startDate, endDate, lastModifiedDate).

- The **per-tranche events** also live on the grant as vestingEvents\[\] - one entry per concrete tranche, with vestDate, vestedQuantity, and a vested: true/false flag.

The first two entries of grant 2502's vestingEvents\[\] (37 tranches total):

```
[
{
"id": "VRs8Df1Tq5jFU3",
"vestDate": { "value": "2014-06-30" },
"quantity": { "value": "37500.00000000000000000000" },
"performanceCondition": false,
"vested": true,
"vestedQuantity": { "value": "37500.00000000000000000000" }
},
{
"id": "snZ7xG4FvAdRQa",
"vestDate": { "value": "2014-07-30" },
"quantity": { "value": "3125.00000000000000000000" },
"performanceCondition": false,
"vested": true,
"vestedQuantity": { "value": "3125.00000000000000000000" }
}
/* ... 35 more monthly tranches ... */
]
```

This is a 4-year monthly schedule with a 1-year cliff: the cliff tranche vests 37,500 (12/48 of 150,000) on the cliff date, then 36 monthly tranches of 3,125 (112,500 ÷ 36) follow. vested: true flags each tranche that has already vested as of the snapshot; on a partially-vested grant, future tranches carry vested: false. Each event also carries maxQuantity / targetQuantity (trimmed here).

**Quantities, precision, and rounding.** Quantities and money amounts are carried as the Decimal type, a numeric value stored as a *string* (e.g., "37500.00000000000000000000"); the long zero tail is padding, not significant digits. See §4.4 for the decimal-string rationale and the precision, fixed-point, and fractional-share conventions the standard adopts.

Equity vests in **whole shares**, so when a tranche count doesn't divide evenly the fractional remainder must be assigned somewhere. The standard uses **cumulative true-up**: each tranche rounds down to whole shares while carrying the running remainder forward, so the cumulative vested amount stays within one share of the straight-line ideal at every date and the tranches sum exactly to the grant total. Fractional shares aren't used for these securities, and there's no "rounding policy" field: the rule is materialized directly in the vestingEvents\[\] quantities.

Meetly grant 2503 shows it: 100,000 shares, a 25,000-share one-year cliff, then 36 monthly tranches of 75,000 ÷ 36 = 2,083.33. Carta vests 2,083 most months and 2,084 every third month - the third month of each quarter is where the three accumulated thirds-of-a-share complete a whole one - so the tranches sum to exactly 75,000:

```
cliff (month 12): 25,000
months 13–15: 2,083 + 2,083 + 2,084 = 6,250
months 16–18: 2,083 + 2,083 + 2,084 = 6,250
... 12 quarters, each summing to 6,250 ...
total: 25,000 + 75,000 = 100,000
```

**Allocation sums to 100%.** percentage is stated separately from the immediate and cliff slices, so across a template immediatePercentage + cliffPercentage + Σ percentage = 100. A single-period template can't under-allocate, since the remainder is whatever isn't already taken; a multi-period template must have its tranche and milestone percentages sum to exactly 100. The running true-up total is cumulative across the *whole* schedule, not reset per period.

**Two ways to express the same split.** Uniform vesting carried parametrically (a cadence plus a period count) lets a consumer derive an even split exactly: three even tranches of 99 shares come out 33 / 33 / 33. The same schedule written as *enumerated* per-tranche percentages instead follows those rounded decimals, so 33.33 / 33.33 / 33.34 yields 32 / 33 / 34 (the running remainder still keeps the tranches summing to the grant total). *Interchange recommendation: carry uniform vesting parametrically, the way Carta does, so a consumer derives the exact split rather than inheriting rounded enumerated percentages.*

**Schema note - per-security tranche-event types.** Carta defines a separate tranche-event type per security. They share the core fields (vestDate, quantity, vestedQuantity, vested, performanceCondition, maxQuantity, targetQuantity):

- OptionGrantVestingEvent - on OptionGrant.vestingEvents\[\]

- RestrictedStockUnitVestingEvent - on RSU.vestingEvents\[\]

- RestrictedStockAwardVestingEvent - on RSA.vestingEvents\[\]

**Schema note - the ISO/NSO \$100k split is excluded as a projection.** Carta's API carries a per-tranche ISO/NSO split (isoQuantity / nsoQuantity on each option vesting event, plus an isoNsoSplit flag on the grant). The standard does **not** include it. The split is a derived tax classification under the [<u>\$100K ISO limit</u>](https://support.carta.com/s/article/100k-rule): it needs grant-date fair-market value (out of scope) and a per-employee, per-calendar-year rollup across all of a holder's ISO grants, so it can't be computed from one grant alone. That makes it a projection, not a cap-table fact, the same reason the standard ships facts and leaves rollups to consumers. stockOptionType (the grant's intrinsic ISO/NSO classification) stays. An ecosystem extension, or an OCF-hosted reference implementation, can compute the split from the facts plus valuation.

**Schema note - acceleration is an extension point.** Acceleration provisions - single- vs. double-trigger change-in-control, full vs. partial, executive carve-outs - aren't modeled on the security snapshots in this bundle; OptionGrant, RSU, and RSA carry no acceleration field. (Carta's broader data model defines an Acceleration shape of name + terms at the draft-grant stage.) This is a natural place for an ecosystem extension to add structure on top of the vesting model.

**Schema note - two-tier liquidity-event vesting is not acceleration.** A private-company RSU that vests on a service schedule but releases nothing until a liquidity event is modeled directly, as a double-trigger HYBRID schedule: date-scheduled tranches each carrying an EVENT_NON_MARKET condition (see "Milestone and performance vesting" above). The tranche dates accrue service, but each tranche stays vested: false - and the grant's vestedQuantity / releasedQuantity stay 0 - until the event is recorded, even after every date has passed; if the event never occurs, nothing ever vests or releases. There is no separate "service-vested" quantity - service progress is implicit in the elapsed tranche dates.

### 3.9 Transactions

```
$defs: 16 transaction types + 6 item wrappers, across 6 security families
```

Transactions are the event-ledger view of the same data the snapshots describe. Every fact security has at least an issuance transaction; most have a cancellation; some have type-specific events (option exercise, RSU settlement, warrant transfer, share class conversion). The full grid:

```
Security family Transactions in the bundle
────────────────── ────────────────────────────────────────────────
Option OptionIssuanceTransaction
OptionCancellationTransaction
OptionExerciseTransaction
RSU RsuIssuanceTransaction
RsuCancellationTransaction
RsuSettlementTransaction
RSA RsaIssuanceTransaction
RsaCancellationTransaction
Certificate CertificateIssuanceTransaction
CertificateCancellationTransaction
Convertible ConvertibleIssuanceTransaction
ConvertibleCancellationTransaction
Warrant WarrantIssuanceTransaction
WarrantExerciseTransaction
WarrantTransferTransaction
WarrantCancellationTransaction
```

Meetly's first option-grant issuance, as a ledger entry:

```
{
"issueDatetime": { "value": "2013-06-30T07:00:00.000Z" },
"quantity": { "value": "150000.00000000000000000000" },
"stockOptionType": "STOCK_OPTION_TYPE_ISO",
"exercisePrice": {
"currencyCode": { "value": "USD" },
"amount": { "value": "0.200000000000" }
},
"equityPlanId": "ca74bab0-cbf9-46f2-b5aa-ff7ddf099f75",
"shareClassId": "72ac0165-47f4-491c-aa77-6162a079a71e",
"vestingScheduleTemplateId": "fe381020-cbc1-42e7-819b-df7e49e78a66",
"expirationDatetime": { "value": "2023-06-30T07:00:00.000Z" }
}
```

Note that **the ledger carries equityPlanId (a real FK)** even though the snapshot side (OptionGrant) carries only equityIncentivePlanName (a denormalized string). This snapshot/ledger asymmetry is the most impactful structural quirk in the schema - see §4.2.

Transactions are exposed via parallel list endpoints (Issuer-Transactions-Options.json, Issuer-Transactions-RSUs.json, etc.). Each list contains heterogeneous transaction items wrapped in \*TransactionItem (a oneof-style wrapper per security family).

**Schema note - vesting outcomes are reported state, not ledger events.** The grid above has no vesting-event transaction. Vesting and performance-condition outcomes are carried as reported snapshot state rather than write-side events: the grant's vestingEvents\[\] record each tranche's vestDate, vested, and vestedQuantity as it materializes, and the condition carries status / evaluationDate / payoutPercentage (§3.8). So the date a milestone vested is recoverable as a fact - a pure-milestone tranche has no vestDate until achieved, then it populates - but the standard records the current evaluated outcome, not an append-only history of evaluations. A write-side vesting-event ledger (condition-achievement, vesting-start, or vesting-acceleration recorded as transactions) is a natural extension point on top of this model.

**Schema note - per-security sub-typing.** Each security family carries its own parallel supporting types. The enum values are security-specific - an option's cancellation reasons differ from a convertible's - so they aren't interchangeable:

- \*TransactionItem (6 types) - oneof wrappers per security family.

- \*CancellationReason (6 enums) - security-specific reasons (e.g., OPTION_CANCELLATION_REASON_TERMINATED, CONVERTIBLE_CANCELLATION_REASON_CONVERTED).

- CertificateIssuanceReason - only certificates expose an issuance reason (e.g., CERTIFICATE_ISSUANCE_REASON_RSU_SETTLED, CERTIFICATE_ISSUANCE_REASON_DEBT_CONVERTED).

**Schema note - three views of an option exercise.** An option exercise is the only event that ships as both a ledger entry and a snapshot, so it appears in three shapes - the ledger transaction, the standalone snapshot, and the array nested on the grant. They overlap but have non-identical field sets and status/type enum vocabularies:

```
Shape Status enum Type/Method enum
────────────────────────── ────────────────── ────────────────────────
OptionExerciseTransaction - OptionExerciseMethod
OptionExercise (snapshot) OptionExerciseState OptionExerciseType
Exercise (on OptionGrant[]) ExerciseStatus ExerciseType
```

ExerciseType and OptionExerciseType have **identical values** (CASH_EXERCISE, CASHLESS_EXERCISE, NET_EXERCISE, BLENDED) but are separate schemas. ExerciseStatus and OptionExerciseState have overlapping but non-identical values (the state machines differ).

For Meetly's grant 2502, here's the snapshot view of an exercise:

```
{
"id": "NO_ID",
"stakeholderId": "4916",
"optionGrantId": "2502",
"certificateId": "12332",
"quantity": { "value": "2000000.00000000000000000000" },
"exerciseTime": { "value": "2013-01-31T08:00:00.000Z" },
"state": "COMPLETE",
"exerciseType": "CASH_EXERCISE",
"recordType": "ISO",
"moneyMovement": { "completionDate": { "value": "2013-01-31T08:00:00.000Z" } }
}
```

The certificateId field points to the share certificate created when the exercise completed - a piece of the conversion lineage discussed in §4.1. (Read this snippet for shape, not arithmetic: it's raw sample data, and the quantity of 2,000,000 doesn't tie to grant 2502's own 150,000 - Meetly's sample set carries some internally inconsistent figures.)

## 4. Cross-cutting concerns

### 4.1 Conversion lineage

Several transitions move equity from one container to another:

- **ConvertibleNote → Certificate** (priced round): the convertible is canceled (canceledDatetime, conversionDatetime set), a new Certificate is issued. The new certificate's precededBy (a CertificatePrecededBy) carries reason: CERTIFICATE_PRECEDED_BY_REASON_DEBT_CONVERTED and the prior security in securities. (In Meetly, this lineage is recorded mostly on the transaction records rather than populated on the certificate snapshots.)

- **OptionGrant → Certificate** (exercise): exercising vested options creates a Certificate. The exercise record (any of the three shapes - see §3.9) carries certificateId.

- **RSU → Certificate** (settlement): vested RSUs settle into Certificates via RsuSettlementTransaction. The resulting certificate is similarly linkable.

- **Warrant → Certificate** (exercise): a WarrantExerciseTransaction produces a Certificate.

- **ShareClass → ShareClass** (conversion): preferred-to-common conversions on a priced round or liquidation event. Tracked via the conversion-mechanism fields on ShareClassRightsAndPreferences.

The PrecededBySecurity and \*PrecededBy types capture the explicit lineage edges. The transactions that produce the new security carry FKs in either direction.

### 4.2 Concepts represented by reference, not as a fact entity

Several concepts are represented by reference - an ID or a name on the records that belong to them - rather than as their own fact entity. Each is a deliberate foundation boundary: the schema records the reference, and an ecosystem extension can add a first-class entity on top.

- **Equity Incentive Plan & Option Pool** - the legal container for issued employee compensation. Tracked as the freeform equityIncentivePlanName on every grant, plus equityPlanId as a foreign key on issuance transactions. To group "all securities under plan X," replay the ledger by equityPlanId (stable) or match the plan name across snapshots (editable). Plan-level governance - board approval, plan term, share reserve, default cancellation behavior - lives in Carta's plan-administration surface.

- **Warrant Block** - the container for a series of warrants. The warrants appear in the bundle only as transactions; the grouping block itself has no field or entity here.

- **Financing round** - a priced round is expressed through the share class it creates (e.g., "Series A Preferred") and the convertibles that convert into it. Share classes work well as a proxy for rounds; grouping a round's instruments into one entity is a natural extension on top of the share-class structure.

The pattern is consistent: Carta ships the facts and the references between them; extensions can layer richer plan, warrant-block, and financing-round entities on top of that foundation.

### 4.3 Reference by ID, not by name

Stable IDs are the schema's join keys. A denormalized name copied onto a record drifts the moment the referenced entity is renamed, so prefer the id for joins and read any embedded name as a convenience label. The standard keeps both - the id and the name - for backward compatibility with what Carta's API emits.

- **Share-class reference on Certificate and RestrictedStockAward.** Both carry shareClassId → ShareClass.id (the join key) and a denormalized shareClassName (a copy of ShareClass.name). Carta's List endpoints currently populate only the name, so the export-side step is to also populate shareClassId. (OptionGrant and RestrictedStockUnit reference the class by shareClassId alone.)

- **Plan reference on grant snapshots.** OptionGrant, RSU, and RSA carry equityIncentivePlanName (a string) but no plan id, while the issuance transactions carry the equityPlanId FK (§3.5, §4.2). Adding that same FK on the snapshots - alongside the name - is the normalized form, so plan grouping doesn't hinge on matching an editable name.

The rule: reference an entity by its id, and keep the name as a convenience label.

### 4.4 Decimal precision and fractional shares

Every numeric - share quantities, prices, percentages, money - is a **decimal string**, never a float and never a fraction. This section states the precision and fractional-share conventions.

**Decimals as strings.** One Decimal type ({ "value": "123.45" }) carries all numerics; Money is a Decimal amount plus an ISO-4217 currencyCode. Strings avoid the binary floating-point drift that corrupts share counts and dollar amounts. Carta pads with trailing zeros, so a value often arrives with a long zero tail (Meetly's pricePerShare is "0.2650000000000000000000000000"); those trailing zeros are not significant digits.

**Precision the standard targets.** Producers should emit **fixed-point** decimal strings (no scientific notation), normalized to at most **10 fractional digits** - aligning with OCF's Numeric and Percentage types (both capped at 10 decimal places) and comfortably exceeding FINRA's 6-decimal rule for fractional-share trade reporting. Ten places covers every real cap-table value: whole and fractional share counts, sub-penny prices, and ownership percentages. No instrument carries that many significant digits, so a producer trims the trailing-zero tail and emits at most 10 fractional digits on export. Significant digits are preserved (only trailing zeros are dropped): a repeating-decimal cliff like a 1-year cliff on a 3-year monthly schedule (1/3) is carried with its digits filled - cliffPercentage: 33.3333333333, not 33.33 - so a reusable template stays accurate across grant sizes (§3.8). *(The current Carta wire Decimal is looser - it permits scientific notation and a long padded scale - so this is a producer-side normalization convention, not a constraint the bundle's Decimal pattern enforces; tightening the pattern would reject Carta's own padded values.)*

**A ceiling, not a fixed scale.** Ten places is a *maximum*, not a required width. A producer may emit fewer (a 1/3 cliff written as 33.333333) or up to ten; a conforming consumer accepts anything up to ten and rounds to its own internal scale on ingest. Heterogeneous precision across systems is therefore fine: one system emitting 33.333333 and another 33.3333333333 both conform, and both ingest. Carta ingests any conforming value losslessly. This matches OCF, whose Numeric / Percentage are likewise defined as "up to 10 decimal places."

**Percentage scale.** This standard follows Carta's **0–100** convention (a 33.33% cliff is 33.33); OCF expresses the same percentage as a **0.0–1.0** fraction (0.3333). Crossing the OCF boundary is a ×100 / ÷100 step the consumer applies.

**Fractional shares.** Share quantities are decimals, but most issuers hold **whole shares**; fractional shares are supported as an issuer-level option and, where enabled, are truncated to a fixed scale. The standard follows the public-market precedent: even where fractional shares exist, they are recorded as **decimals, never numerator/denominator ratios** - FINRA's fractional-share reporting mandates decimal format (a 1/3 share is reported as 0.333333) and rejects fractions. So share quantities, and the percentage splits that allocate them, are decimals throughout; an exact-fraction tranche model is available only as a community extension (§3.8).

**Rounding.** Vesting has no rounding-policy field: for time-based tranches, equity vests in whole shares via the cumulative floor-and-true-up rule baked directly into the materialized vestingEvents\[\] quantities (§3.8). One case isn't fully reproducible from the other fields: when a performance condition pays out partially, the payout percentage applied to the tranche is rounded to whole shares by a selector the standard doesn't expose, so treat that tranche's materialized vestedQuantity as authoritative rather than recomputing it (§3.8). OCF instead carries an explicit RoundingType (CEILING / FLOOR / NORMAL) on its conversion mechanisms; the Carta foundation documents the fixed behavior rather than exposing a selector. The same split shows in conversions: OCF offers a Ratio { numerator, denominator } for conversion mechanisms and stock splits, while Carta carries conversion ratios and prices as decimals - so even there the foundation stays decimal-based.

## Appendix A: Catalog of all 99 schemas

Grouped by section of the guide. The bundle's \$defs/ is the source of truth - query it directly for the authoritative list.

**Core identity & stakeholder (8)** Issuer, Stakeholder, StakeholderAddress, StakeholderRelationship, StakeholderEntityType (enum), PointOfContact, PointOfContactType (enum), Jurisdiction (tax withholding)

**Share class & dividends (10)** ShareClass, ShareClassRightsAndPreferences, PreferredShareClassDetails, ShareClassDividendDetails, DividendDetails, ShareClassType (enum), DividendType (enum), DividendAccrualPeriod (enum), DividendAccrualType (enum), DividendInterestType (enum)

**Securities - snapshots (5)** Certificate, OptionGrant, RestrictedStockUnit, RestrictedStockAward, ConvertibleNote

**Securities - supporting (7)** StockOptionType (enum), RestrictedStockUnitSettlement, PrecededBySecurity, CertificatePrecededBy, CertificatePrecededByReason (enum), RestrictedStockAwardPrecededBy, RestrictedStockAwardPrecededByReason (enum)

**Per-security tranche events (3)** OptionGrantVestingEvent, RestrictedStockUnitVestingEvent, RestrictedStockAwardVestingEvent

**Exercise - three near-duplicate shapes plus supporting (11)** OptionExercise (snapshot), Exercise (nested-on-grant), ExercisePeriod, ExercisePeriods, ExerciseStatus (enum), ExerciseType (enum), OptionExerciseState (enum), OptionExerciseType (enum), OptionExerciseMethod (enum), OptionExerciseMoneyMovement, OptionExerciseTaxWithholdingLineItem

**Vesting (10)** VestingScheduleTemplate, VestingSchedule, VestingPeriod, VestingMethod (enum), VestingOccurs (enum), VestingScheduleType (enum), PerformanceCondition, PerformanceConditionStatus (enum), PerformanceConditionType (enum), PeriodUnit (enum)

**Note blocks & convertibles (9)** NoteBlock, NoteBlockStatus (enum), NoteType (enum), ConvertibleDayCountBasis (enum), ConvertibleInterestAccrualPeriod (enum), ConvertibleInterestCompoundingPeriod (enum), DayCountBasis (enum), InterestAccrualPeriod (enum), InterestCompoundingPeriod (enum)

**Cancellation reason enums (6)** OptionCancellationReason, RsuCancellationReason, RsaCancellationReason, CertificateCancellationReason, ConvertibleCancellationReason, WarrantCancellationReason

**Issuance reason enums (1)** CertificateIssuanceReason

**Transactions (16)** Option: OptionIssuanceTransaction, OptionCancellationTransaction, OptionExerciseTransaction. RSU: RsuIssuanceTransaction, RsuCancellationTransaction, RsuSettlementTransaction. RSA: RsaIssuanceTransaction, RsaCancellationTransaction. Certificate: CertificateIssuanceTransaction, CertificateCancellationTransaction. Convertible: ConvertibleIssuanceTransaction, ConvertibleCancellationTransaction. Warrant: WarrantIssuanceTransaction, WarrantExerciseTransaction, WarrantTransferTransaction, WarrantCancellationTransaction.

**Transaction items - oneof wrappers (6)** OptionTransactionItem, RsuTransactionItem, RsaTransactionItem, CertificateTransactionItem, ConvertibleTransactionItem, WarrantTransactionItem

**Primitives (7)** Money, Decimal, Iso8601CompleteCalendarDate, Iso8601CompleteCalendarDateTime, Iso3166Set1Alpha3Code (country alpha-3), Iso3166Set2Code (country/region 2), Iso4217CurrencyAlphaCode (currency code)

## Appendix B: Glossary

- **Cap table** - the authoritative record of who owns what in a privately held company.

- **Cliff** - a vesting boundary: no equity vests until the cliff date, at which point the cliff portion vests in a single step, and continuous vesting begins thereafter. Typically 1 year.

- **Convertible note** - a debt instrument that converts to equity on a future event (priced round, change of control, maturity).

- **Convertible (in this schema)** - Carta's ConvertibleNote type covers both convertible notes and SAFEs, distinguished by the note block's noteType.

- **Dilution** - the reduction in an existing holder's ownership percentage when new shares are issued.

- **ISO / NSO** - Incentive Stock Option vs. Non-qualified Stock Option. Tax classification - ISOs have favorable tax treatment under U.S. tax law, subject to limits.

- **Liquidation preference** - preferred stock's right to receive a payout (typically 1×–2× original investment) before common stock in a liquidity event.

- **Option Pool** - shares reserved within a company's authorized share count for future employee option grants.

- **Par value** - a nominal accounting value assigned to a share class; in venture-backed companies, typically \$0.0001 or similar.

- **Pari passu** - Latin for "on equal footing"; a share class that pays out alongside other classes of the same seniority rather than in sequence.

- **RSU / RSA** - Restricted Stock Unit (a promise to deliver shares) vs. Restricted Stock Award (shares issued upfront, subject to forfeiture).

- **SAFE** - Simple Agreement for Future Equity. A convert-later contract that, unlike a convertible note, is not debt - typically without interest or maturity, popularized by Y Combinator. Carta models it as a noteType on ConvertibleNote, so a SAFE record may still carry interest/maturity fields when the instrument has them.

- **Settlement** - converting vested RSUs into delivered shares.

- **Strike price / Exercise price** - the per-share price an option holder pays to exercise.

- **Vesting** - earning equity over time, contingent on continued service or performance.

- **Warrant** - the right to purchase shares at a fixed price, typically issued to investors, lenders, or service providers (not employees).

*This guide describes the 2026-06-22 bundle; schema changes upstream will require regenerating it.*
