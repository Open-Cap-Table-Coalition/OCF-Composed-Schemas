╭ Carta inverse coverage report ─────╮
│ source_documents: 95               │
│ green_carta_documents: 94          │
│ compatibility_wrappers_excluded: 7 │
╰────────────────────────────────────╯

Evidence legend
  [object] direct OCF object route; [type] reusable mapping detail used by that route, not a separate source record.
  inverse semantics are orthogonal: record-construction (default), reference-only, state-projection, aggregate-projection, or event-reconstruction.
  PlanSecurity* compatibility wrappers are excluded from this output; their economic mapping is represented by the corresponding EquityCompensation* object (7 wrapper documents).

Simple story
  1. Carta defines 139 total definitions.
  2. 53 are non-object definitions:
       47 scalar enum definitions (field vocabularies) + 6 curated scalar support types; neither is a standalone mapping target.
  3. 86 are object-shaped definitions.
  4. Of those 86:
       55 are support definitions, not standalone objects (54 nested objects + 1 object-shaped value type).
       31 are standalone mapping candidates.
  5. 61 support definitions are excluded from standalone mapping: 55 object-shaped support definitions + 6 scalar support types.
  6. 18 standalone candidates have OCF mapping evidence:
       18 direct executable, 0 deferred.
       6 definitions also carry reusable type-only evidence across 28 slots; that evidence does not create a standalone target.
       Completeness: 8 fully mapped, 10 partially mapped.
  7. 13 standalone candidates have no mapping evidence yet; their inventory role says whether that is expected or actionable:
       8 report/read-model roll-ups, 2 alternate shapes,
       1 CARTA-specific families without OCF sources, 1 workflow/data gaps,
       1 actionable gaps, 0 requiring review.
  Check: 139 = 53 non-object + 86 object-shaped; 53 = 47 scalar enum + 6 scalar support; 31 = 18 + 13; 86 = 31 + 55.

Supporting CARTA definitions excluded from standalone mapping targets (61)
  54 nested object definitions (53 Carta + 1 OCF) + 7 value-type support definitions.
  These 61 definitions are packaging/support types, not standalone mapping targets; their mapping/type evidence remains valid.

  Value-type support definitions (7)
    - #/$defs/Date
      through: type correspondence: Iso8601CompleteCalendarDate, Iso8601CompleteCalendarDateTime
      note: Partial-date value helper; OCF Date maps to the Iso8601 date wrappers.
    - #/$defs/Decimal
      through: owning Carta object properties; not a standalone entity
      note: Reusable scalar value wrapper, not a standalone Carta entity.
    - #/$defs/Iso3166Set1Alpha3Code
      through: owning Carta object properties; not a standalone entity
      note: Reusable scalar value wrapper, not a standalone Carta entity.
    - #/$defs/Iso3166Set2Code
      through: owning Carta object properties; not a standalone entity
      note: Reusable scalar value wrapper, not a standalone Carta entity.
    - #/$defs/Iso4217CurrencyAlphaCode
      through: owning Carta object properties; not a standalone entity
      note: Reusable scalar value wrapper, not a standalone Carta entity.
    - #/$defs/Iso8601CompleteCalendarDate
      through: owning Carta object properties; not a standalone entity
      note: Reusable calendar-date wrapper, populated through owning object properties.
    - #/$defs/Iso8601CompleteCalendarDateTime
      through: owning Carta object properties; not a standalone entity
      note: Reusable datetime wrapper, populated through owning object properties.

  Nested objects with mapped parent coverage (38)
    - #/$defs/CertificateCancellationTransaction — namespace: carta; parent(s): CertificateTransactionItem
    - #/$defs/CertificateIssuanceTransaction — namespace: carta; parent(s): CertificateTransactionItem
    - #/$defs/CertificatePrecededBy — namespace: carta; parent(s): Certificate
    - #/$defs/ConvertibleCancellationTransaction — namespace: carta; parent(s): ConvertibleTransactionItem
    - #/$defs/ConvertibleIssuanceTransaction — namespace: carta; parent(s): ConvertibleTransactionItem
    - #/$defs/DividendDetails — namespace: carta; parent(s): ShareClassDividendDetails
    - #/$defs/Exercise — namespace: carta; parent(s): OptionGrant
    - #/$defs/ExercisePeriods — namespace: carta; parent(s): OptionGrant
    - #/$defs/Money — namespace: carta; parent(s): Certificate, CertificateIssuanceTransaction,
      ConvertibleCancellationTransaction, ConvertibleIssuanceTransaction, ConvertibleNote, OptionGrant,
      OptionIssuanceTransaction, RestrictedStockAward, RestrictedStockUnit, RestrictedStockUnitSettlement,
      RsaIssuanceTransaction, SarExerciseTransaction, SarIssuanceTransaction, ShareClass,
      ShareClassRightsAndPreferences, ShareClassValuation, WarrantIssuanceTransaction
    - #/$defs/NoteBlock — namespace: carta; parent(s): ConvertibleNote
    - #/$defs/OptionCancellationTransaction — namespace: carta; parent(s): OptionTransactionItem
    - #/$defs/OptionExerciseTransaction — namespace: carta; parent(s): OptionTransactionItem
    - #/$defs/OptionGrantVestingEvent — namespace: carta; parent(s): OptionGrant
    - #/$defs/OptionIssuanceTransaction — namespace: carta; parent(s): OptionTransactionItem
    - #/$defs/PerformanceCondition — namespace: carta; parent(s): VestingPeriod
    - #/$defs/PrecededBySecurity — namespace: carta; parent(s): CertificatePrecededBy,
      RestrictedStockAwardPrecededBy
    - #/$defs/PreferredShareClassDetails — namespace: carta; parent(s): ShareClass
    - #/$defs/RestrictedStockAwardPrecededBy — namespace: carta; parent(s): RestrictedStockAward
    - #/$defs/RestrictedStockAwardVestingEvent — namespace: carta; parent(s): RestrictedStockAward
    - #/$defs/RestrictedStockUnitSettlement — namespace: carta; parent(s): RestrictedStockUnit
    - #/$defs/RestrictedStockUnitVestingEvent — namespace: carta; parent(s): RestrictedStockUnit
    - #/$defs/RsaCancellationTransaction — namespace: carta; parent(s): RsaTransactionItem
    - #/$defs/RsaIssuanceTransaction — namespace: carta; parent(s): RsaTransactionItem
    - #/$defs/RsuCancellationTransaction — namespace: carta; parent(s): RsuTransactionItem
    - #/$defs/RsuIssuanceTransaction — namespace: carta; parent(s): RsuTransactionItem
    - #/$defs/RsuSettlementTransaction — namespace: carta; parent(s): RsuTransactionItem
    - #/$defs/SarCancellationTransaction — namespace: carta; parent(s): SarTransactionItem
    - #/$defs/SarExerciseTransaction — namespace: carta; parent(s): SarTransactionItem
    - #/$defs/SarIssuanceTransaction — namespace: carta; parent(s): SarTransactionItem
    - #/$defs/ShareClassDividendDetails — namespace: carta; parent(s): PreferredShareClassDetails
    - #/$defs/ShareClassRightsAndPreferences — namespace: carta; parent(s): PreferredShareClassDetails
    - #/$defs/StakeholderAddress — namespace: carta; parent(s): Stakeholder
    - #/$defs/VestingPeriod — namespace: carta; parent(s): VestingScheduleTemplate
    - #/$defs/VestingSchedule — namespace: carta; parent(s): OptionGrant, RestrictedStockAward,
      RestrictedStockUnit
    - #/$defs/WarrantCancellationTransaction — namespace: carta; parent(s): WarrantTransactionItem
    - #/$defs/WarrantExerciseTransaction — namespace: carta; parent(s): WarrantTransactionItem
    - #/$defs/WarrantIssuanceTransaction — namespace: carta; parent(s): WarrantTransactionItem
    - #/$defs/WarrantTransferTransaction — namespace: carta; parent(s): WarrantTransactionItem

  Nested objects without mapped parent coverage (16)
    - #/$defs/Acceleration — namespace: carta; parent(s): Vesting
    - #/$defs/Document — namespace: carta; parent(s): OptionGrantDocuments
    - #/$defs/Jurisdiction — namespace: carta; parent(s): OptionExerciseTaxWithholdingLineItem
    - #/$defs/OptionExerciseMoneyMovement — namespace: carta; parent(s): OptionExercise
    - #/$defs/OptionExerciseTaxWithholdingLineItem — namespace: carta; parent(s): OptionExercise
    - #/$defs/PhantomCancellationTransaction — namespace: carta; parent(s): PhantomTransactionItem
    - #/$defs/PhantomIssuanceTransaction — namespace: carta; parent(s): PhantomTransactionItem
    - #/$defs/PiuCancellationTransaction — namespace: carta; parent(s): PiuTransactionItem
    - #/$defs/PiuIssuanceTransaction — namespace: carta; parent(s): PiuTransactionItem
    - #/$defs/PointOfContact — namespace: ocf; parent(s): —
    - #/$defs/StakeholderCapitalizationTableSummary — namespace: carta; parent(s): StakeholderGroup
    - #/$defs/StakeholderNoteBlockSummary — namespace: carta; parent(s): StakeholderGroup
    - #/$defs/StakeholderOptionPoolSummary — namespace: carta; parent(s): StakeholderGroup
    - #/$defs/StakeholderShareClassSummary — namespace: carta; parent(s): StakeholderGroup
    - #/$defs/StakeholderWarrantBlockSummary — namespace: carta; parent(s): StakeholderGroup
    - #/$defs/ThresholdDetails — namespace: carta; parent(s): Interest

Standalone Carta targets with mapping evidence (18)
╭ Carta object: Certificate ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: Certificate                                                                                                                                                                                                                    │
│ id: "#/$defs/Certificate"                                                                                                                                                                                                            │
│ inverse_role: direct                                                                                                                                                                                                                 │
│ status: PARTIAL                                                                                                                                                                                                                      │
│ mapping_evidence: 30 (direct object: 30, reusable type detail: 0)                                                                                                                                                                    │
│ unmapped_properties: 4                                                                                                                                                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ resulting Carta object flavors (1)                                                                                                                                                                                                   │
│ └── StockIssuance.Default → Certificate                                                                                                                                                                                              │
│     ├── when: StockIssuance.issuance_type = [FOUNDERS_STOCK]                                                                                                                                                                         │
│     └── properties: issueDate, pricePerShare, quantity, securityId, securityLabel, shareClassId, stakeholderId, vestingScheduleTemplateId                                                                                            │
│                                                                                                                                                                                                                                      │
│ conditional property flows (2 discriminators)                                                                                                                                                                                        │
│ ├── StockClass :: class_type                                                                                                                                                                                                         │
│ │   └── Common [COMMON] or Preferred [PREFERRED] → shareClassName                                                                                                                                                                    │
│ └── EquityCompensationExercise :: security_id → compensation_type (lookup)                                                                                                                                                           │
│     └── Option [OPTION, OPTION_NSO, OPTION_ISO] or Sar [CSAR, SSAR] → precededBy, securityId                                                                                                                                         │
│                                                                                                                                                                                                                                      │
│ aggregate mapping ledger                                                                                                                                                                                                             │
│ parent properties (16)                                                                                                                                                                                                               │
│   ├─ + canceledDate                                                                                                                                                                                                                  │
│   │  └─ ← StockCancellation [Default].date (rename)                                                                                                                                                                                  │
│   ├─ + canceledQuantity                                                                                                                                                                                                              │
│   │  └─ ← StockCancellation [Default].quantity (rename)                                                                                                                                                                              │
│   ├─ + id                                                                                                                                                                                                                            │
│   │  ├─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   │  └─ ? open question: For the `FOUNDERS_STOCK`/Default route, should OCF `StockIssuance.id` populate Carta `Certificate.id`, or is Carta's object `id` server-generated while `secur… [asked by @johnscrudato; StockIssuance:374] │
│   ├─ + issueDate                                                                                                                                                                                                                     │
│   │  └─ ← StockIssuance [Default].date (rename)                                                                                                                                                                                      │
│   ├─ + issuerId                                                                                                                                                                                                                      │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + lastModifiedDatetime                                                                                                                                                                                                          │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + pricePerShare                                                                                                                                                                                                                 │
│   │  └─ ← StockIssuance [Default].share_price (rename)                                                                                                                                                                               │
│   ├─ + quantity                                                                                                                                                                                                                      │
│   │  └─ ← StockIssuance [Default].quantity (rename)                                                                                                                                                                                  │
│   ├─ + returnedToPoolQuantity                                                                                                                                                                                                        │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + returnedToTreasuryQuantity                                                                                                                                                                                                    │
│   │  └─ ← StockRepurchase [Default].quantity (computed)                                                                                                                                                                              │
│   ├─ + securityId                                                                                                                                                                                                                    │
│   │  ├─ ← StockCancellation [Default].balance_security_id (computed)                                                                                                                                                                 │
│   │  ├─ ← StockCancellation [Default].security_id (rename)                                                                                                                                                                           │
│   │  ├─ ← StockConsolidation [Default].resulting_security_id (computed)                                                                                                                                                              │
│   │  ├─ ← StockConversion [Default].balance_security_id (computed)                                                                                                                                                                   │
│   │  ├─ ← StockConversion [Default].resulting_security_ids (computed)                                                                                                                                                                │
│   │  ├─ ← EquityCompensationExercise [shared].resulting_security_ids (computed)                                                                                                                                                      │
│   │  ├─ ← StockIssuance [Default].security_id (rename)                                                                                                                                                                               │
│   │  ├─ ← StockReissuance [Default].resulting_security_ids (computed)                                                                                                                                                                │
│   │  ├─ ← StockRepurchase [Default].balance_security_id (computed)                                                                                                                                                                   │
│   │  ├─ ← StockTransfer [Default].balance_security_id (computed)                                                                                                                                                                     │
│   │  └─ ← StockTransfer [Default].resulting_security_ids (computed)                                                                                                                                                                  │
│   ├─ + securityLabel                                                                                                                                                                                                                 │
│   │  └─ ← StockIssuance [Default].custom_id (rename)                                                                                                                                                                                 │
│   ├─ + shareClassId                                                                                                                                                                                                                  │
│   │  └─ ← StockIssuance [Default].stock_class_id (rename)                                                                                                                                                                            │
│   ├─ + shareClassName                                                                                                                                                                                                                │
│   │  └─ ← StockClass [shared].name (rename)                                                                                                                                                                                          │
│   ├─ + stakeholderId                                                                                                                                                                                                                 │
│   │  └─ ← StockIssuance [Default].stakeholder_id (rename)                                                                                                                                                                            │
│   └─ + vestingScheduleTemplateId                                                                                                                                                                                                     │
│      └─ ← StockIssuance [Default].vesting_terms_id (rename)                                                                                                                                                                          │
│                                                                                                                                                                                                                                      │
│ contains (1 nested variants)                                                                                                                                                                                                         │
│   └─ precededBy : CertificatePrecededBy                                                                                                                                                                                              │
│      ├─ ← StockCancellation [Default] (contains → CertificatePrecededBy) (structural)                                                                                                                                                │
│      ├─ ← StockConsolidation [Default] (contains → CertificatePrecededBy) (structural)                                                                                                                                               │
│      ├─ ← StockConversion [Default] (contains → CertificatePrecededBy) (structural)                                                                                                                                                  │
│      ├─ ← EquityCompensationExercise [shared] (contains → CertificatePrecededBy) (structural)                                                                                                                                        │
│      ├─ ← StockReissuance [Default] (contains → CertificatePrecededBy) (structural)                                                                                                                                                  │
│      ├─ ← StockRepurchase [Default] (contains → CertificatePrecededBy) (structural)                                                                                                                                                  │
│      ├─ ← StockTransfer [Default] (contains → CertificatePrecededBy) (structural)                                                                                                                                                    │
│      ├─ + reason                                                                                                                                                                                                                     │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      └─ + securities                                                                                                                                                                                                                 │
│         ├─ ← StockCancellation [Default].balance_security_id (computed)                                                                                                                                                              │
│         ├─ ← StockConsolidation [Default].resulting_security_id (computed)                                                                                                                                                           │
│         ├─ ← StockConsolidation [Default].security_ids (computed)                                                                                                                                                                    │
│         ├─ ← StockConversion [Default].balance_security_id (computed)                                                                                                                                                                │
│         ├─ ← StockConversion [Default].resulting_security_ids (computed)                                                                                                                                                             │
│         ├─ ← EquityCompensationExercise [shared].resulting_security_ids (computed)                                                                                                                                                   │
│         ├─ ← StockReissuance [Default].resulting_security_ids (computed)                                                                                                                                                             │
│         ├─ ← StockRepurchase [Default].balance_security_id (computed)                                                                                                                                                                │
│         ├─ ← StockTransfer [Default].balance_security_id (computed)                                                                                                                                                                  │
│         └─ ← StockTransfer [Default].resulting_security_ids (computed)                                                                                                                                                               │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: CertificateTransactionItem ────────────────────────────────────────────────────────────────╮
│ name: CertificateTransactionItem                                                                         │
│ id: "#/$defs/CertificateTransactionItem"                                                                 │
│ inverse_role: direct                                                                                     │
│ status: MAPPED                                                                                           │
│ mapping_evidence: 8 (direct object: 8, reusable type detail: 0)                                          │
│ unmapped_properties: 0                                                                                   │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (3)                                                                                    │
│   ├─ + securityId                                                                                        │
│   │  ├─ ← StockCancellation [Default].security_id (rename)                                               │
│   │  └─ ← StockIssuance [Default].security_id (rename)                                                   │
│   ├─ + securityLabel                                                                                     │
│   │  └─ ← StockIssuance [Default].custom_id (rename)                                                     │
│   └─ + stakeholderId                                                                                     │
│      └─ ← StockIssuance [Default].stakeholder_id (rename)                                                │
│                                                                                                          │
│ contains (2 nested variants)                                                                             │
│   ├─ cancellations[] : CertificateCancellationTransaction                                                │
│   │  ├─ ← StockCancellation [Default] (contains items → CertificateCancellationTransaction) (structural) │
│   │  ├─ + effectiveDatetime                                                                              │
│   │  │  └─ ← StockCancellation [Default].date (rename)                                                   │
│   │  ├─ + forfeitureDatetime                                                                             │
│   │  │  └─ ✗ no mapped OCF source                                                                        │
│   │  ├─ + quantity                                                                                       │
│   │  │  └─ ← StockCancellation [Default].quantity (rename)                                               │
│   │  ├─ + reason                                                                                         │
│   │  │  └─ ← StockCancellation [Default].reason_text (computed)                                          │
│   │  └─ + terminationDatetime                                                                            │
│   │     └─ ✗ no mapped OCF source                                                                        │
│   └─ issuance : CertificateIssuanceTransaction                                                           │
│      ├─ ← StockIssuance [Default] (contains → CertificateIssuanceTransaction) (structural)               │
│      ├─ + acquisitionCost                                                                                │
│      │  └─ ← StockIssuance [Default].cost_basis (rename)                                                 │
│      ├─ + equityPlanId                                                                                   │
│      │  └─ ← StockIssuance [Default].stock_plan_id (rename)                                              │
│      ├─ + issuanceReason                                                                                 │
│      │  └─ ✗ no mapped OCF source                                                                        │
│      ├─ + issueDatetime                                                                                  │
│      │  └─ ← StockIssuance [Default].date (rename)                                                       │
│      ├─ + precededBySecurityId                                                                           │
│      │  └─ ✗ no mapped OCF source                                                                        │
│      ├─ + quantity                                                                                       │
│      │  └─ ← StockIssuance [Default].quantity (rename)                                                   │
│      ├─ + shareClassId                                                                                   │
│      │  └─ ← StockIssuance [Default].stock_class_id (rename)                                             │
│      └─ + vestingScheduleTemplateId                                                                      │
│         └─ ← StockIssuance [Default].vesting_terms_id (rename)                                           │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: Compliance ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: Compliance                                                                                                                                                                                                                     │
│ id: "#/$defs/Compliance"                                                                                                                                                                                                             │
│ inverse_role: direct                                                                                                                                                                                                                 │
│ status: PARTIAL                                                                                                                                                                                                                      │
│ mapping_evidence: 5 (direct object: 4, reusable type detail: 1)                                                                                                                                                                      │
│ unmapped_properties: 2                                                                                                                                                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ conditional property flows (2 discriminators)                                                                                                                                                                                        │
│ ├── EquityCompensationIssuance :: compensation_type                                                                                                                                                                                  │
│ │   └── Option [OPTION, OPTION_NSO, OPTION_ISO] or Rsu [RSU] or Sar [CSAR, SSAR] → federalExemption                                                                                                                                  │
│ └── StockIssuance :: issuance_type                                                                                                                                                                                                   │
│     └── Rsa [RSA] or Default [FOUNDERS_STOCK] → federalExemption                                                                                                                                                                     │
│                                                                                                                                                                                                                                      │
│ aggregate mapping ledger                                                                                                                                                                                                             │
│ parent properties (3)                                                                                                                                                                                                                │
│   ├─ + countryOfResidency                                                                                                                                                                                                            │
│   │  ├─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   │  └─ ? open question: Should an OCF stakeholder address country also populate Carta `Compliance.countryOfResidency`? Investigate whether a two-hop stakeholder linkage is required and… [asked by @johnscrudato; Stakeholder:261] │
│   ├─ + federalExemption                                                                                                                                                                                                              │
│   │  ├─ ← ConvertibleIssuance.security_law_exemptions (computed)                                                                                                                                                                     │
│   │  │  └─ ← type SecurityExemption.description (computed)                                                                                                                                                                           │
│   │  ├─ ← EquityCompensationIssuance [shared].security_law_exemptions (computed)                                                                                                                                                     │
│   │  │  └─ ← type SecurityExemption.description (computed)                                                                                                                                                                           │
│   │  ├─ ← StockIssuance [shared].security_law_exemptions (computed)                                                                                                                                                                  │
│   │  │  └─ ← type SecurityExemption.description (computed)                                                                                                                                                                           │
│   │  └─ ← WarrantIssuance.security_law_exemptions (computed)                                                                                                                                                                         │
│   │     └─ ← type SecurityExemption.description (computed)                                                                                                                                                                           │
│   └─ + stateOfResidency                                                                                                                                                                                                              │
│      ├─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│      └─ ? open question: Should an OCF stakeholder address subdivision also populate Carta `Compliance.stateOfResidency`? Investigate whether a two-hop stakeholder linkage is required a… [asked by @johnscrudato; Stakeholder:266] │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: ConvertibleNote ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: ConvertibleNote                                                                                                                                                                                                                │
│ id: "#/$defs/ConvertibleNote"                                                                                                                                                                                                        │
│ inverse_role: direct                                                                                                                                                                                                                 │
│ status: PARTIAL                                                                                                                                                                                                                      │
│ mapping_evidence: 32 (direct object: 17, reusable type detail: 15)                                                                                                                                                                   │
│ unmapped_properties: 5                                                                                                                                                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (20)                                                                                                                                                                                                               │
│   ├─ + canceledDatetime                                                                                                                                                                                                              │
│   │  └─ ← ConvertibleCancellation.date (rename)                                                                                                                                                                                      │
│   ├─ + canceledQuantity                                                                                                                                                                                                              │
│   │  └─ ← ConvertibleConversion.quantity_converted (rename)                                                                                                                                                                          │
│   ├─ + cashPaid                                                                                                                                                                                                                      │
│   │  └─ ← ConvertibleIssuance.investment_amount (rename)                                                                                                                                                                             │
│   ├─ + changeInControlPercent                                                                                                                                                                                                        │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + conversionDatetime                                                                                                                                                                                                            │
│   │  └─ ← ConvertibleConversion.date (rename)                                                                                                                                                                                        │
│   ├─ + conversionTrigger                                                                                                                                                                                                             │
│   │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                             │
│   │     └─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                           │
│   ├─ + dayCountBasis                                                                                                                                                                                                                 │
│   │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                             │
│   │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                           │
│   │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                        │
│   │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                      │
│   │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                         │
│   │           └─ ← type NoteConversionMechanism.day_count_convention (enum-remap)                                                                                                                                                    │
│   │              └─ ↳ active when type = CONVERTIBLE_NOTE_CONVERSION                                                                                                                                                                 │
│   ├─ + discountPercentage                                                                                                                                                                                                            │
│   │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                             │
│   │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                           │
│   │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                        │
│   │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                      │
│   │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                         │
│   │           ├─ ← type NoteConversionMechanism.conversion_discount (rename)                                                                                                                                                         │
│   │           │  └─ ↳ active when type = CONVERTIBLE_NOTE_CONVERSION                                                                                                                                                                 │
│   │           └─ ← type SAFEConversionMechanism.conversion_discount (rename)                                                                                                                                                         │
│   │              └─ ↳ active when type = SAFE_CONVERSION                                                                                                                                                                             │
│   ├─ + id                                                                                                                                                                                                                            │
│   │  ├─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   │  └─ ? open question: Should OCF `ConvertibleIssuance.id` populate Carta `ConvertibleNote.id`, or is Carta's object `id` server-generated while `security_id` should remain ma… [asked by @johnscrudato; ConvertibleIssuance:339] │
│   ├─ + interest                                                                                                                                                                                                                      │
│   │  ├─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   │  └─ ? open question: Should an external accrued-interest calculation populate Carta `ConvertibleNote.interest`, or is the intended mapping limited to the rate terms (`intere… [asked by @johnscrudato; ConvertibleIssuance:328] │
│   ├─ + interestAccrualPeriod                                                                                                                                                                                                         │
│   │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                             │
│   │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                           │
│   │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                        │
│   │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                      │
│   │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                         │
│   │           └─ ← type NoteConversionMechanism.interest_accrual_period (enum-remap)                                                                                                                                                 │
│   │              └─ ↳ active when type = CONVERTIBLE_NOTE_CONVERSION                                                                                                                                                                 │
│   ├─ + interestCompoundingPeriod                                                                                                                                                                                                     │
│   │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                             │
│   │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                           │
│   │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                        │
│   │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                      │
│   │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                         │
│   │           └─ ← type NoteConversionMechanism.compounding_type (enum-remap)                                                                                                                                                        │
│   │              └─ ↳ active when type = CONVERTIBLE_NOTE_CONVERSION                                                                                                                                                                 │
│   ├─ + interestRate                                                                                                                                                                                                                  │
│   │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                             │
│   │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                           │
│   │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                        │
│   │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                      │
│   │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                         │
│   │           └─ ← type NoteConversionMechanism.interest_rates (select)                                                                                                                                                              │
│   │              ├─ ↳ active when type = CONVERTIBLE_NOTE_CONVERSION                                                                                                                                                                 │
│   │              └─ ← type InterestRate.rate (rename)                                                                                                                                                                                │
│   ├─ + issueDatetime                                                                                                                                                                                                                 │
│   │  └─ ← ConvertibleIssuance.date (rename)                                                                                                                                                                                          │
│   ├─ + issuerId                                                                                                                                                                                                                      │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + maturityDatetime                                                                                                                                                                                                              │
│   │  ├─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   │  └─ ? open question: `conversion_triggers[].trigger_date` / `conversion_triggers[].end_date`: When the source metadata explicitly identifies a trigger or date-window boundar… [asked by @johnscrudato; ConvertibleIssuance:318] │
│   ├─ + priceCap                                                                                                                                                                                                                      │
│   │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                             │
│   │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                           │
│   │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                        │
│   │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                      │
│   │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                         │
│   │           ├─ ← type NoteConversionMechanism.conversion_valuation_cap (rename)                                                                                                                                                    │
│   │           │  └─ ↳ active when type = CONVERTIBLE_NOTE_CONVERSION                                                                                                                                                                 │
│   │           └─ ← type SAFEConversionMechanism.conversion_valuation_cap (rename)                                                                                                                                                    │
│   │              └─ ↳ active when type = SAFE_CONVERSION                                                                                                                                                                             │
│   ├─ + securityId                                                                                                                                                                                                                    │
│   │  ├─ ← ConvertibleConversion.security_id (rename)                                                                                                                                                                                 │
│   │  └─ ← ConvertibleIssuance.security_id (rename)                                                                                                                                                                                   │
│   ├─ + securityLabel                                                                                                                                                                                                                 │
│   │  └─ ← ConvertibleIssuance.custom_id (rename)                                                                                                                                                                                     │
│   └─ + stakeholderId                                                                                                                                                                                                                 │
│      └─ ← ConvertibleIssuance.stakeholder_id (rename)                                                                                                                                                                                │
│                                                                                                                                                                                                                                      │
│ contains (1 nested variants)                                                                                                                                                                                                         │
│   └─ noteBlock : NoteBlock                                                                                                                                                                                                           │
│      ├─ ← ConvertibleIssuance (contains → NoteBlock) (structural)                                                                                                                                                                    │
│      ├─ + id                                                                                                                                                                                                                         │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      ├─ + name                                                                                                                                                                                                                       │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      ├─ + noteType                                                                                                                                                                                                                   │
│      │  └─ ← ConvertibleIssuance.convertible_type (enum-remap)                                                                                                                                                                       │
│      ├─ + prefix                                                                                                                                                                                                                     │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      └─ + status                                                                                                                                                                                                                     │
│         └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: ConvertibleTransactionItem ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: ConvertibleTransactionItem                                                                                                                                                                                                       │
│ id: "#/$defs/ConvertibleTransactionItem"                                                                                                                                                                                               │
│ inverse_role: direct                                                                                                                                                                                                                   │
│ status: MAPPED                                                                                                                                                                                                                         │
│ mapping_evidence: 8 (direct object: 8, reusable type detail: 0)                                                                                                                                                                        │
│ unmapped_properties: 0                                                                                                                                                                                                                 │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (3)                                                                                                                                                                                                                  │
│   ├─ + securityId                                                                                                                                                                                                                      │
│   │  ├─ ← ConvertibleCancellation.security_id (rename)                                                                                                                                                                                 │
│   │  ├─ ← ConvertibleConversion.security_id (rename)                                                                                                                                                                                   │
│   │  └─ ← ConvertibleIssuance.security_id (rename)                                                                                                                                                                                     │
│   ├─ + securityLabel                                                                                                                                                                                                                   │
│   │  └─ ← ConvertibleIssuance.custom_id (rename)                                                                                                                                                                                       │
│   └─ + stakeholderId                                                                                                                                                                                                                   │
│      └─ ← ConvertibleIssuance.stakeholder_id (rename)                                                                                                                                                                                  │
│                                                                                                                                                                                                                                        │
│ contains (2 nested variants)                                                                                                                                                                                                           │
│   ├─ cancellations[] : ConvertibleCancellationTransaction                                                                                                                                                                              │
│   │  ├─ ← ConvertibleCancellation (contains items → ConvertibleCancellationTransaction) (structural)                                                                                                                                   │
│   │  ├─ ← ConvertibleConversion (contains items → ConvertibleCancellationTransaction) (structural)                                                                                                                                     │
│   │  ├─ + effectiveDatetime                                                                                                                                                                                                            │
│   │  │  ├─ ← ConvertibleCancellation.date (rename)                                                                                                                                                                                     │
│   │  │  └─ ← ConvertibleConversion.date (rename)                                                                                                                                                                                       │
│   │  ├─ + principal                                                                                                                                                                                                                    │
│   │  │  └─ ← ConvertibleCancellation.amount (rename)                                                                                                                                                                                   │
│   │  └─ + reason                                                                                                                                                                                                                       │
│   │     └─ ← ConvertibleCancellation.reason_text (computed)                                                                                                                                                                            │
│   └─ issuance : ConvertibleIssuanceTransaction                                                                                                                                                                                         │
│      ├─ ← ConvertibleIssuance (contains → ConvertibleIssuanceTransaction) (structural)                                                                                                                                                 │
│      ├─ + conversionTrigger                                                                                                                                                                                                            │
│      │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                            │
│      │     └─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                          │
│      ├─ + dayCountBasis                                                                                                                                                                                                                │
│      │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                            │
│      │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                          │
│      │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                       │
│      │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                     │
│      │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                        │
│      ├─ + discountPercentage                                                                                                                                                                                                           │
│      │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                            │
│      │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                          │
│      │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                       │
│      │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                     │
│      │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                        │
│      ├─ + interestAccrualPeriod                                                                                                                                                                                                        │
│      │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                            │
│      │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                          │
│      │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                       │
│      │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                     │
│      │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                        │
│      ├─ + interestCompoundingPeriod                                                                                                                                                                                                    │
│      │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                            │
│      │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                          │
│      │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                       │
│      │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                     │
│      │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                        │
│      ├─ + interestRate                                                                                                                                                                                                                 │
│      │  └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                            │
│      │     ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                          │
│      │     └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                       │
│      │        ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                     │
│      │        └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                        │
│      ├─ + issueDatetime                                                                                                                                                                                                                │
│      │  └─ ← ConvertibleIssuance.date (rename)                                                                                                                                                                                         │
│      ├─ + maturityDatetime                                                                                                                                                                                                             │
│      │  ├─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│      │  └─ ? open question: `conversion_triggers[].trigger_date` / `conversion_triggers[].end_date`: If the source metadata explicitly identifies a maturity event, should the same… [asked by @johnscrudato; ConvertibleIssuance:323] │
│      ├─ + noteBlockId                                                                                                                                                                                                                  │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│      ├─ + precededBySecurityId                                                                                                                                                                                                         │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│      ├─ + principal                                                                                                                                                                                                                    │
│      │  └─ ← ConvertibleIssuance.investment_amount (rename)                                                                                                                                                                            │
│      └─ + valuationCap                                                                                                                                                                                                                 │
│         └─ ← ConvertibleIssuance.conversion_triggers (sequential_transform)                                                                                                                                                            │
│            ├─ ↳ selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                          │
│            └─ ← type ConvertibleConversionRight.conversion_mechanism (union-map)                                                                                                                                                       │
│               ├─ ↳ active when type = CONVERTIBLE_CONVERSION_RIGHT                                                                                                                                                                     │
│               └─ ↳ dispatches exactly one conversion_mechanism.type branch (mutually exclusive)                                                                                                                                        │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: Issuer ───────────────────────────────────────────╮
│ name: Issuer                                                    │
│ id: "#/$defs/Issuer"                                            │
│ inverse_role: direct                                            │
│ status: PARTIAL                                                 │
│ mapping_evidence: 3 (direct object: 3, reusable type detail: 0) │
│ unmapped_properties: 1                                          │
├─────────────────────────────────────────────────────────────────┤
│ parent properties (4)                                           │
│   ├─ + doingBusinessAsName                                      │
│   │  └─ ← Issuer.dba (rename)                                   │
│   ├─ + id                                                       │
│   │  └─ ← Issuer.id (rename)                                    │
│   ├─ + legalName                                                │
│   │  └─ ← Issuer.legal_name (rename)                            │
│   └─ + website                                                  │
│      └─ ✗ no mapped OCF source                                  │
╰─────────────────────────────────────────────────────────────────╯

╭ Carta object: OptionGrant ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: OptionGrant                                                                                                                                                                                                                    │
│ id: "#/$defs/OptionGrant"                                                                                                                                                                                                            │
│ inverse_role: direct                                                                                                                                                                                                                 │
│ status: PARTIAL                                                                                                                                                                                                                      │
│ mapping_evidence: 31 (direct object: 31, reusable type detail: 0)                                                                                                                                                                    │
│ unmapped_properties: 12                                                                                                                                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (33)                                                                                                                                                                                                               │
│   ├─ + boardApprovalDate                                                                                                                                                                                                             │
│   │  └─ ← EquityCompensationIssuance [Option].board_approval_date (rename)                                                                                                                                                           │
│   ├─ + canceledDate                                                                                                                                                                                                                  │
│   │  └─ ← EquityCompensationCancellation [Option].date (rename)                                                                                                                                                                      │
│   ├─ + canceledQuantity                                                                                                                                                                                                              │
│   │  └─ ← EquityCompensationCancellation [Option].quantity (rename)                                                                                                                                                                  │
│   ├─ + disqualificationDate                                                                                                                                                                                                          │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + earlyExercisable                                                                                                                                                                                                              │
│   │  └─ ← EquityCompensationIssuance [Option].early_exercisable (rename)                                                                                                                                                             │
│   ├─ + equityIncentivePlanName                                                                                                                                                                                                       │
│   │  └─ ← StockPlan.plan_name (rename; inverse: state-projection)                                                                                                                                                                    │
│   │     └─ ↳ inverse semantics: state-projection — Current/denormalized plan-name state; it carries no plan-history semantics.                                                                                                       │
│   ├─ + exercisedQuantity                                                                                                                                                                                                             │
│   │  └─ ← EquityCompensationExercise [Option].quantity (rename)                                                                                                                                                                      │
│   ├─ + exercisePeriods                                                                                                                                                                                                               │
│   │  └─ ← EquityCompensationIssuance [Option].termination_exercise_windows (select)                                                                                                                                                  │
│   ├─ + exercisePrice                                                                                                                                                                                                                 │
│   │  └─ ← EquityCompensationRepricing [Option].new_exercise_price (rename)                                                                                                                                                           │
│   ├─ + expiredQuantity                                                                                                                                                                                                               │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + forfeitedQuantity                                                                                                                                                                                                             │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + grantExpirationDate                                                                                                                                                                                                           │
│   │  └─ ← EquityCompensationIssuance [Option].expiration_date (rename)                                                                                                                                                               │
│   │     └─ ↳ dispatches exactly one expiration_date.type branch (mutually exclusive)                                                                                                                                                 │
│   ├─ + id                                                                                                                                                                                                                            │
│   │  ├─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   │  └─ ? open question: For an `OPTION` route, should OCF `EquityCompensationIssuance.id` populate Carta `OptionGrant.id`, or is Carta's object `id` server-generated whi… [asked by @johnscrudato; EquityCompensationIssuance:452] │
│   ├─ + isoNsoSplit                                                                                                                                                                                                                   │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + issueDate                                                                                                                                                                                                                     │
│   │  └─ ← EquityCompensationIssuance [Option].date (rename)                                                                                                                                                                          │
│   ├─ + issuerId                                                                                                                                                                                                                      │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + lastExercisableDate                                                                                                                                                                                                           │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + lastModifiedDatetime                                                                                                                                                                                                          │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + outstandingQuantity                                                                                                                                                                                                           │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + quantity                                                                                                                                                                                                                      │
│   │  └─ ← EquityCompensationIssuance [Option].quantity (rename)                                                                                                                                                                      │
│   ├─ + returnedToPoolQuantity                                                                                                                                                                                                        │
│   │  └─ ← StockPlanReturnToPool [Option].quantity (rename; inverse: aggregate-projection)                                                                                                                                            │
│   │     └─ ↳ inverse semantics: aggregate-projection — Repeated return events are summed into a per-security total and cannot be split back deterministically.                                                                       │
│   ├─ + returnedToTreasuryQuantity                                                                                                                                                                                                    │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + securityId                                                                                                                                                                                                                    │
│   │  ├─ ← EquityCompensationCancellation [Option].security_id (rename)                                                                                                                                                               │
│   │  ├─ ← EquityCompensationExercise [Option].security_id (rename)                                                                                                                                                                   │
│   │  ├─ ← EquityCompensationIssuance [Option].security_id (rename)                                                                                                                                                                   │
│   │  └─ ← StockPlanReturnToPool [Option].security_id (rename; inverse: reference-only)                                                                                                                                               │
│   │     └─ ↳ inverse semantics: reference-only — Identifies the existing cancelled security; it does not reconstruct a return event.                                                                                                 │
│   ├─ + securityLabel                                                                                                                                                                                                                 │
│   │  └─ ← EquityCompensationIssuance [Option].custom_id (rename)                                                                                                                                                                     │
│   ├─ + shareClassId                                                                                                                                                                                                                  │
│   │  └─ ← EquityCompensationIssuance [Option].stock_class_id (rename)                                                                                                                                                                │
│   ├─ + stakeholderAcceptanceDate                                                                                                                                                                                                     │
│   │  └─ ← EquityCompensationAcceptance [Option].date (rename)                                                                                                                                                                        │
│   ├─ + stakeholderId                                                                                                                                                                                                                 │
│   │  └─ ← EquityCompensationIssuance [Option].stakeholder_id (rename)                                                                                                                                                                │
│   ├─ + stockOptionType                                                                                                                                                                                                               │
│   │  ├─ ← EquityCompensationIssuance [Option].compensation_type (enum-remap)                                                                                                                                                         │
│   │  └─ ← EquityCompensationIssuance [Option].option_grant_type (enum-remap)                                                                                                                                                         │
│   ├─ + terminationDate                                                                                                                                                                                                               │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + vestedQuantity                                                                                                                                                                                                                │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + vestingEvents                                                                                                                                                                                                                 │
│   │  └─ ← EquityCompensationIssuance [Option].vestings (rename)                                                                                                                                                                      │
│   ├─ + vestingScheduleTemplateId                                                                                                                                                                                                     │
│   │  └─ ← EquityCompensationIssuance [Option].vesting_template_id (rename)                                                                                                                                                           │
│   └─ + vestingStartDate                                                                                                                                                                                                              │
│      └─ ← EquityCompensationIssuance [Option].vesting_start_date (rename)                                                                                                                                                            │
│                                                                                                                                                                                                                                      │
│ contains (2 nested variants)                                                                                                                                                                                                         │
│   ├─ exercises[] : Exercise                                                                                                                                                                                                          │
│   │  ├─ ← EquityCompensationExercise [Option] (contains items → Exercise) (structural)                                                                                                                                               │
│   │  ├─ + certificateId                                                                                                                                                                                                              │
│   │  │  └─ ← EquityCompensationExercise [Option].resulting_security_ids (computed)                                                                                                                                                   │
│   │  ├─ + exerciseDate                                                                                                                                                                                                               │
│   │  │  └─ ← EquityCompensationExercise [Option].date (rename)                                                                                                                                                                       │
│   │  ├─ + exerciseId                                                                                                                                                                                                                 │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   │  ├─ + exerciseType                                                                                                                                                                                                               │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   │  ├─ + fairMarketValueAsOfDate                                                                                                                                                                                                    │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   │  ├─ + qualified                                                                                                                                                                                                                  │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   │  ├─ + quantity                                                                                                                                                                                                                   │
│   │  │  └─ ← EquityCompensationExercise [Option].quantity (rename)                                                                                                                                                                   │
│   │  └─ + status                                                                                                                                                                                                                     │
│   │     └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   └─ vestingSchedule : VestingSchedule                                                                                                                                                                                               │
│      ├─ ← EquityCompensationIssuance [Option] (contains → VestingSchedule) (structural)                                                                                                                                              │
│      ├─ + endDate                                                                                                                                                                                                                    │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      ├─ + lastModifiedDate                                                                                                                                                                                                           │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      ├─ + name                                                                                                                                                                                                                       │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      └─ + startDate                                                                                                                                                                                                                  │
│         └─ ← EquityCompensationIssuance [shared].vesting_start_date (rename)                                                                                                                                                         │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: OptionTransactionItem ─────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: OptionTransactionItem                                                                                                          │
│ id: "#/$defs/OptionTransactionItem"                                                                                                  │
│ inverse_role: direct                                                                                                                 │
│ status: MAPPED                                                                                                                       │
│ mapping_evidence: 13 (direct object: 13, reusable type detail: 0)                                                                    │
│ unmapped_properties: 0                                                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (3)                                                                                                                │
│   ├─ + securityId                                                                                                                    │
│   │  ├─ ← EquityCompensationCancellation [Option].security_id (rename)                                                               │
│   │  ├─ ← EquityCompensationExercise [Option].security_id (rename)                                                                   │
│   │  ├─ ← EquityCompensationIssuance [Option].security_id (rename)                                                                   │
│   │  └─ ← StockPlanReturnToPool [Option].security_id (rename; inverse: reference-only)                                               │
│   │     └─ ↳ inverse semantics: reference-only — Identifies the existing cancelled security; it does not reconstruct a return event. │
│   ├─ + securityLabel                                                                                                                 │
│   │  └─ ← EquityCompensationIssuance [Option].custom_id (rename)                                                                     │
│   └─ + stakeholderId                                                                                                                 │
│      └─ ← EquityCompensationIssuance [Option].stakeholder_id (rename)                                                                │
│                                                                                                                                      │
│ contains (3 nested variants)                                                                                                         │
│   ├─ cancellations[] : OptionCancellationTransaction                                                                                 │
│   │  ├─ ← EquityCompensationCancellation [Option] (contains items → OptionCancellationTransaction) (structural)                      │
│   │  ├─ + effectiveDatetime                                                                                                          │
│   │  │  └─ ← EquityCompensationCancellation [Option].date (rename)                                                                   │
│   │  ├─ + forfeitureDatetime                                                                                                         │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + quantity                                                                                                                   │
│   │  │  └─ ← EquityCompensationCancellation [Option].quantity (rename)                                                               │
│   │  ├─ + reason                                                                                                                     │
│   │  │  └─ ← EquityCompensationCancellation [Option].reason_text (computed)                                                          │
│   │  └─ + terminationDatetime                                                                                                        │
│   │     └─ ✗ no mapped OCF source                                                                                                    │
│   ├─ exercises[] : OptionExerciseTransaction                                                                                         │
│   │  ├─ ← EquityCompensationExercise [Option] (contains items → OptionExerciseTransaction) (structural)                              │
│   │  ├─ + exerciseMethod                                                                                                             │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + id                                                                                                                         │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + quantity                                                                                                                   │
│   │  │  └─ ← EquityCompensationExercise [Option].quantity (rename)                                                                   │
│   │  ├─ + recordType                                                                                                                 │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + resultingSecurityId                                                                                                        │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + resultingSecurityLabel                                                                                                     │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + resultingSecurityType                                                                                                      │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  └─ + sharesAcquiredDatetime                                                                                                     │
│   │     └─ ← EquityCompensationExercise [Option].date (rename)                                                                       │
│   └─ issuance : OptionIssuanceTransaction                                                                                            │
│      ├─ ← EquityCompensationIssuance [Option] (contains → OptionIssuanceTransaction) (structural)                                    │
│      ├─ + equityPlanId                                                                                                               │
│      │  └─ ← EquityCompensationIssuance [Option].stock_plan_id (rename)                                                              │
│      ├─ + exercisePrice                                                                                                              │
│      │  └─ ← EquityCompensationIssuance [Option].exercise_price (rename)                                                             │
│      ├─ + expirationDatetime                                                                                                         │
│      │  └─ ← EquityCompensationIssuance [Option].expiration_date (rename)                                                            │
│      │     └─ ↳ dispatches exactly one expiration_date.type branch (mutually exclusive)                                              │
│      ├─ + issueDatetime                                                                                                              │
│      │  └─ ← EquityCompensationIssuance [Option].date (rename)                                                                       │
│      ├─ + quantity                                                                                                                   │
│      │  └─ ← EquityCompensationIssuance [Option].quantity (rename)                                                                   │
│      ├─ + shareClassId                                                                                                               │
│      │  └─ ← EquityCompensationIssuance [Option].stock_class_id (rename)                                                             │
│      ├─ + stockOptionType                                                                                                            │
│      │  └─ ✗ no mapped OCF source                                                                                                    │
│      └─ + vestingScheduleTemplateId                                                                                                  │
│         └─ ← EquityCompensationIssuance [Option].vesting_template_id (rename)                                                        │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: RestrictedStockAward ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: RestrictedStockAward                                                                                                                                                                                                           │
│ id: "#/$defs/RestrictedStockAward"                                                                                                                                                                                                   │
│ inverse_role: direct                                                                                                                                                                                                                 │
│ status: PARTIAL                                                                                                                                                                                                                      │
│ mapping_evidence: 33 (direct object: 33, reusable type detail: 0)                                                                                                                                                                    │
│ unmapped_properties: 8                                                                                                                                                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ resulting Carta object flavors (2)                                                                                                                                                                                                   │
│ ├── StockAcceptance.Rsa → RestrictedStockAward                                                                                                                                                                                       │
│ │   ├── when: StockAcceptance.security_id → issuance_type (lookup) = [RSA]                                                                                                                                                           │
│ │   └── properties: stakeholderAcceptanceDate                                                                                                                                                                                        │
│ └── StockIssuance.Rsa → RestrictedStockAward                                                                                                                                                                                         │
│     ├── when: StockIssuance.issuance_type = [RSA]                                                                                                                                                                                    │
│     └── properties: boardApprovalDate, issueDate, pricePerShare, quantity, securityId, securityLabel, shareClassId, stakeholderId, vestingEvents, vestingScheduleTemplateId                                                          │
│                                                                                                                                                                                                                                      │
│ conditional property flows (1 discriminators)                                                                                                                                                                                        │
│ └── StockClass :: class_type                                                                                                                                                                                                         │
│     └── Common [COMMON] or Preferred [PREFERRED] → shareClassName                                                                                                                                                                    │
│                                                                                                                                                                                                                                      │
│ aggregate mapping ledger                                                                                                                                                                                                             │
│ parent properties (24)                                                                                                                                                                                                               │
│   ├─ + boardApprovalDate                                                                                                                                                                                                             │
│   │  └─ ← StockIssuance [Rsa].board_approval_date (rename)                                                                                                                                                                           │
│   ├─ + canceledDate                                                                                                                                                                                                                  │
│   │  └─ ← StockCancellation [Rsa].date (rename)                                                                                                                                                                                      │
│   ├─ + canceledQuantity                                                                                                                                                                                                              │
│   │  └─ ← StockCancellation [Rsa].quantity (rename)                                                                                                                                                                                  │
│   ├─ + equityIncentivePlanName                                                                                                                                                                                                       │
│   │  └─ ← StockPlan.plan_name (rename; inverse: state-projection)                                                                                                                                                                    │
│   │     └─ ↳ inverse semantics: state-projection — Current/denormalized plan-name state; it carries no plan-history semantics.                                                                                                       │
│   ├─ + id                                                                                                                                                                                                                            │
│   │  ├─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   │  └─ ? open question: For the `RSA` route, should OCF `StockIssuance.id` populate Carta `RestrictedStockAward.id`, or is Carta's object `id` server-generated while `security_id` sh… [asked by @johnscrudato; StockIssuance:379] │
│   ├─ + issueDate                                                                                                                                                                                                                     │
│   │  └─ ← StockIssuance [Rsa].date (rename)                                                                                                                                                                                          │
│   ├─ + issuerId                                                                                                                                                                                                                      │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + lastModifiedDatetime                                                                                                                                                                                                          │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + pricePerShare                                                                                                                                                                                                                 │
│   │  └─ ← StockIssuance [Rsa].share_price (rename)                                                                                                                                                                                   │
│   ├─ + quantity                                                                                                                                                                                                                      │
│   │  └─ ← StockIssuance [Rsa].quantity (rename)                                                                                                                                                                                      │
│   ├─ + returnedToPoolQuantity                                                                                                                                                                                                        │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + returnedToTreasuryQuantity                                                                                                                                                                                                    │
│   │  └─ ← StockRepurchase [Rsa].quantity (computed)                                                                                                                                                                                  │
│   ├─ + securityId                                                                                                                                                                                                                    │
│   │  ├─ ← StockCancellation [Rsa].balance_security_id (computed)                                                                                                                                                                     │
│   │  ├─ ← StockCancellation [Rsa].security_id (rename)                                                                                                                                                                               │
│   │  ├─ ← StockConsolidation [Rsa].resulting_security_id (computed)                                                                                                                                                                  │
│   │  ├─ ← StockConversion [Rsa].balance_security_id (computed)                                                                                                                                                                       │
│   │  ├─ ← StockConversion [Rsa].resulting_security_ids (computed)                                                                                                                                                                    │
│   │  ├─ ← StockIssuance [Rsa].security_id (rename)                                                                                                                                                                                   │
│   │  ├─ ← StockReissuance [Rsa].resulting_security_ids (computed)                                                                                                                                                                    │
│   │  ├─ ← StockRepurchase [Rsa].balance_security_id (computed)                                                                                                                                                                       │
│   │  ├─ ← StockTransfer [Rsa].balance_security_id (computed)                                                                                                                                                                         │
│   │  └─ ← StockTransfer [Rsa].resulting_security_ids (computed)                                                                                                                                                                      │
│   ├─ + securityLabel                                                                                                                                                                                                                 │
│   │  └─ ← StockIssuance [Rsa].custom_id (rename)                                                                                                                                                                                     │
│   ├─ + shareClassId                                                                                                                                                                                                                  │
│   │  └─ ← StockIssuance [Rsa].stock_class_id (rename)                                                                                                                                                                                │
│   ├─ + shareClassName                                                                                                                                                                                                                │
│   │  └─ ← StockClass [shared].name (rename)                                                                                                                                                                                          │
│   ├─ + stakeholderAcceptanceDate                                                                                                                                                                                                     │
│   │  └─ ← StockAcceptance [Rsa].date (rename)                                                                                                                                                                                        │
│   ├─ + stakeholderId                                                                                                                                                                                                                 │
│   │  └─ ← StockIssuance [Rsa].stakeholder_id (rename)                                                                                                                                                                                │
│   ├─ + terminationDate                                                                                                                                                                                                               │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + vestedQuantity                                                                                                                                                                                                                │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + vestingEvents                                                                                                                                                                                                                 │
│   │  └─ ← StockIssuance [Rsa].vestings (rename)                                                                                                                                                                                      │
│   ├─ + vestingSchedule                                                                                                                                                                                                               │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + vestingScheduleTemplateId                                                                                                                                                                                                     │
│   │  └─ ← StockIssuance [Rsa].vesting_terms_id (rename)                                                                                                                                                                              │
│   └─ + vestingStartDate                                                                                                                                                                                                              │
│      └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│                                                                                                                                                                                                                                      │
│ contains (1 nested variants)                                                                                                                                                                                                         │
│   └─ precededBy : RestrictedStockAwardPrecededBy                                                                                                                                                                                     │
│      ├─ ← StockCancellation [Rsa] (contains → RestrictedStockAwardPrecededBy) (structural)                                                                                                                                           │
│      ├─ ← StockConsolidation [Rsa] (contains → RestrictedStockAwardPrecededBy) (structural)                                                                                                                                          │
│      ├─ ← StockConversion [Rsa] (contains → RestrictedStockAwardPrecededBy) (structural)                                                                                                                                             │
│      ├─ ← StockReissuance [Rsa] (contains → RestrictedStockAwardPrecededBy) (structural)                                                                                                                                             │
│      ├─ ← StockRepurchase [Rsa] (contains → RestrictedStockAwardPrecededBy) (structural)                                                                                                                                             │
│      ├─ ← StockTransfer [Rsa] (contains → RestrictedStockAwardPrecededBy) (structural)                                                                                                                                               │
│      ├─ + reason                                                                                                                                                                                                                     │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      └─ + securities                                                                                                                                                                                                                 │
│         ├─ ← StockCancellation [Rsa].balance_security_id (computed)                                                                                                                                                                  │
│         ├─ ← StockConsolidation [Rsa].resulting_security_id (computed)                                                                                                                                                               │
│         ├─ ← StockConsolidation [Rsa].security_ids (computed)                                                                                                                                                                        │
│         ├─ ← StockConversion [Rsa].balance_security_id (computed)                                                                                                                                                                    │
│         ├─ ← StockConversion [Rsa].resulting_security_ids (computed)                                                                                                                                                                 │
│         ├─ ← StockReissuance [Rsa].resulting_security_ids (computed)                                                                                                                                                                 │
│         ├─ ← StockRepurchase [Rsa].balance_security_id (computed)                                                                                                                                                                    │
│         ├─ ← StockTransfer [Rsa].balance_security_id (computed)                                                                                                                                                                      │
│         └─ ← StockTransfer [Rsa].resulting_security_ids (computed)                                                                                                                                                                   │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: RestrictedStockUnit ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: RestrictedStockUnit                                                                                                                                                                                                            │
│ id: "#/$defs/RestrictedStockUnit"                                                                                                                                                                                                    │
│ inverse_role: direct                                                                                                                                                                                                                 │
│ status: PARTIAL                                                                                                                                                                                                                      │
│ mapping_evidence: 25 (direct object: 25, reusable type detail: 0)                                                                                                                                                                    │
│ unmapped_properties: 9                                                                                                                                                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (26)                                                                                                                                                                                                               │
│   ├─ + boardApprovalDate                                                                                                                                                                                                             │
│   │  └─ ← EquityCompensationIssuance [Rsu].board_approval_date (rename)                                                                                                                                                              │
│   ├─ + canceledDate                                                                                                                                                                                                                  │
│   │  └─ ← EquityCompensationCancellation [Rsu].date (rename)                                                                                                                                                                         │
│   ├─ + canceledQuantity                                                                                                                                                                                                              │
│   │  └─ ← EquityCompensationCancellation [Rsu].quantity (rename)                                                                                                                                                                     │
│   ├─ + equityIncentivePlanName                                                                                                                                                                                                       │
│   │  └─ ← StockPlan.plan_name (rename; inverse: state-projection)                                                                                                                                                                    │
│   │     └─ ↳ inverse semantics: state-projection — Current/denormalized plan-name state; it carries no plan-history semantics.                                                                                                       │
│   ├─ + expiredQuantity                                                                                                                                                                                                               │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + forfeitedQuantity                                                                                                                                                                                                             │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + id                                                                                                                                                                                                                            │
│   │  ├─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   │  └─ ? open question: For the `RSU` route, should OCF `EquityCompensationIssuance.id` populate Carta `RestrictedStockUnit.id`, or is Carta's object `id` server-generat… [asked by @johnscrudato; EquityCompensationIssuance:457] │
│   ├─ + issueDate                                                                                                                                                                                                                     │
│   │  └─ ← EquityCompensationIssuance [Rsu].date (rename)                                                                                                                                                                             │
│   ├─ + issuerId                                                                                                                                                                                                                      │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + lastModifiedDatetime                                                                                                                                                                                                          │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + netSettledQuantity                                                                                                                                                                                                            │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + quantity                                                                                                                                                                                                                      │
│   │  └─ ← EquityCompensationIssuance [Rsu].quantity (rename)                                                                                                                                                                         │
│   ├─ + releasedQuantity                                                                                                                                                                                                              │
│   │  └─ ← EquityCompensationRelease [Rsu].quantity (rename)                                                                                                                                                                          │
│   ├─ + releasePricePerShare                                                                                                                                                                                                          │
│   │  └─ ← EquityCompensationRelease [Rsu].release_price (rename)                                                                                                                                                                     │
│   ├─ + returnedToPoolQuantity                                                                                                                                                                                                        │
│   │  └─ ← StockPlanReturnToPool [Rsu].quantity (rename; inverse: aggregate-projection)                                                                                                                                               │
│   │     └─ ↳ inverse semantics: aggregate-projection — Repeated return events are summed into a per-security total and cannot be split back deterministically.                                                                       │
│   ├─ + returnedToTreasuryQuantity                                                                                                                                                                                                    │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + securityId                                                                                                                                                                                                                    │
│   │  ├─ ← EquityCompensationCancellation [Rsu].security_id (rename)                                                                                                                                                                  │
│   │  ├─ ← EquityCompensationIssuance [Rsu].security_id (rename)                                                                                                                                                                      │
│   │  ├─ ← EquityCompensationRelease [Rsu].security_id (rename)                                                                                                                                                                       │
│   │  └─ ← StockPlanReturnToPool [Rsu].security_id (rename; inverse: reference-only)                                                                                                                                                  │
│   │     └─ ↳ inverse semantics: reference-only — Identifies the existing cancelled security; it does not reconstruct a return event.                                                                                                 │
│   ├─ + securityLabel                                                                                                                                                                                                                 │
│   │  └─ ← EquityCompensationIssuance [Rsu].custom_id (rename)                                                                                                                                                                        │
│   ├─ + shareClassId                                                                                                                                                                                                                  │
│   │  └─ ← EquityCompensationIssuance [Rsu].stock_class_id (rename)                                                                                                                                                                   │
│   ├─ + stakeholderAcceptanceDate                                                                                                                                                                                                     │
│   │  └─ ← EquityCompensationAcceptance [Rsu].date (rename)                                                                                                                                                                           │
│   ├─ + stakeholderId                                                                                                                                                                                                                 │
│   │  └─ ← EquityCompensationIssuance [Rsu].stakeholder_id (rename)                                                                                                                                                                   │
│   ├─ + terminationDate                                                                                                                                                                                                               │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + vestedQuantity                                                                                                                                                                                                                │
│   │  └─ ✗ no mapped OCF source                                                                                                                                                                                                       │
│   ├─ + vestingEvents                                                                                                                                                                                                                 │
│   │  └─ ← EquityCompensationIssuance [Rsu].vestings (rename)                                                                                                                                                                         │
│   ├─ + vestingScheduleTemplateId                                                                                                                                                                                                     │
│   │  └─ ← EquityCompensationIssuance [Rsu].vesting_template_id (rename)                                                                                                                                                              │
│   └─ + vestingStartDate                                                                                                                                                                                                              │
│      └─ ← EquityCompensationIssuance [Rsu].vesting_start_date (rename)                                                                                                                                                               │
│                                                                                                                                                                                                                                      │
│ contains (2 nested variants)                                                                                                                                                                                                         │
│   ├─ settlements[] : RestrictedStockUnitSettlement                                                                                                                                                                                   │
│   │  ├─ ← EquityCompensationRelease [Rsu] (contains items → RestrictedStockUnitSettlement) (structural)                                                                                                                              │
│   │  ├─ + certificateId                                                                                                                                                                                                              │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   │  ├─ + certificateLabel                                                                                                                                                                                                           │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   │  ├─ + netSettlementQuantity                                                                                                                                                                                                      │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   │  ├─ + releaseQuantity                                                                                                                                                                                                            │
│   │  │  └─ ← EquityCompensationRelease [Rsu].quantity (rename)                                                                                                                                                                       │
│   │  ├─ + saleQuantity                                                                                                                                                                                                               │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   │  ├─ + settlementDate                                                                                                                                                                                                             │
│   │  │  └─ ← EquityCompensationRelease [Rsu].settlement_date (rename)                                                                                                                                                                │
│   │  ├─ + settlementPrice                                                                                                                                                                                                            │
│   │  │  └─ ← EquityCompensationRelease [Rsu].release_price (rename)                                                                                                                                                                  │
│   │  └─ + withholdingQuantity                                                                                                                                                                                                        │
│   │     └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│   └─ vestingSchedule : VestingSchedule                                                                                                                                                                                               │
│      ├─ ← EquityCompensationIssuance [Rsu] (contains → VestingSchedule) (structural)                                                                                                                                                 │
│      ├─ + endDate                                                                                                                                                                                                                    │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      ├─ + lastModifiedDate                                                                                                                                                                                                           │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      ├─ + name                                                                                                                                                                                                                       │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                    │
│      └─ + startDate                                                                                                                                                                                                                  │
│         └─ ← EquityCompensationIssuance [shared].vesting_start_date (rename)                                                                                                                                                         │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: RsaTransactionItem ────────────────────────────────────────────────────────────╮
│ name: RsaTransactionItem                                                                     │
│ id: "#/$defs/RsaTransactionItem"                                                             │
│ inverse_role: direct                                                                         │
│ status: MAPPED                                                                               │
│ mapping_evidence: 8 (direct object: 8, reusable type detail: 0)                              │
│ unmapped_properties: 0                                                                       │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (3)                                                                        │
│   ├─ + securityId                                                                            │
│   │  ├─ ← StockCancellation [Rsa].security_id (rename)                                       │
│   │  └─ ← StockIssuance [Rsa].security_id (rename)                                           │
│   ├─ + securityLabel                                                                         │
│   │  └─ ← StockIssuance [Rsa].custom_id (rename)                                             │
│   └─ + stakeholderId                                                                         │
│      └─ ← StockIssuance [Rsa].stakeholder_id (rename)                                        │
│                                                                                              │
│ contains (2 nested variants)                                                                 │
│   ├─ cancellations[] : RsaCancellationTransaction                                            │
│   │  ├─ ← StockCancellation [Rsa] (contains items → RsaCancellationTransaction) (structural) │
│   │  ├─ + effectiveDatetime                                                                  │
│   │  │  └─ ← StockCancellation [Rsa].date (rename)                                           │
│   │  ├─ + forfeitureDatetime                                                                 │
│   │  │  └─ ✗ no mapped OCF source                                                            │
│   │  ├─ + quantity                                                                           │
│   │  │  └─ ← StockCancellation [Rsa].quantity (rename)                                       │
│   │  ├─ + reason                                                                             │
│   │  │  └─ ← StockCancellation [Rsa].reason_text (computed)                                  │
│   │  └─ + terminationDatetime                                                                │
│   │     └─ ✗ no mapped OCF source                                                            │
│   └─ issuance : RsaIssuanceTransaction                                                       │
│      ├─ ← StockIssuance [Rsa] (contains → RsaIssuanceTransaction) (structural)               │
│      ├─ + acquisitionCost                                                                    │
│      │  └─ ← StockIssuance [Rsa].cost_basis (rename)                                         │
│      ├─ + equityPlanId                                                                       │
│      │  └─ ← StockIssuance [Rsa].stock_plan_id (rename)                                      │
│      ├─ + issueDatetime                                                                      │
│      │  └─ ← StockIssuance [Rsa].date (rename)                                               │
│      ├─ + quantity                                                                           │
│      │  └─ ← StockIssuance [Rsa].quantity (rename)                                           │
│      ├─ + shareClassId                                                                       │
│      │  └─ ← StockIssuance [Rsa].stock_class_id (rename)                                     │
│      └─ + vestingScheduleTemplateId                                                          │
│         └─ ← StockIssuance [Rsa].vesting_terms_id (rename)                                   │
╰──────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: RsuTransactionItem ────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: RsuTransactionItem                                                                                                             │
│ id: "#/$defs/RsuTransactionItem"                                                                                                     │
│ inverse_role: direct                                                                                                                 │
│ status: MAPPED                                                                                                                       │
│ mapping_evidence: 13 (direct object: 13, reusable type detail: 0)                                                                    │
│ unmapped_properties: 0                                                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (3)                                                                                                                │
│   ├─ + securityId                                                                                                                    │
│   │  ├─ ← EquityCompensationCancellation [Rsu].security_id (rename)                                                                  │
│   │  ├─ ← EquityCompensationIssuance [Rsu].security_id (rename)                                                                      │
│   │  ├─ ← EquityCompensationRelease [Rsu].security_id (rename)                                                                       │
│   │  └─ ← StockPlanReturnToPool [Rsu].security_id (rename; inverse: reference-only)                                                  │
│   │     └─ ↳ inverse semantics: reference-only — Identifies the existing cancelled security; it does not reconstruct a return event. │
│   ├─ + securityLabel                                                                                                                 │
│   │  └─ ← EquityCompensationIssuance [Rsu].custom_id (rename)                                                                        │
│   └─ + stakeholderId                                                                                                                 │
│      └─ ← EquityCompensationIssuance [Rsu].stakeholder_id (rename)                                                                   │
│                                                                                                                                      │
│ contains (3 nested variants)                                                                                                         │
│   ├─ cancellations[] : RsuCancellationTransaction                                                                                    │
│   │  ├─ ← EquityCompensationCancellation [Rsu] (contains items → RsuCancellationTransaction) (structural)                            │
│   │  ├─ + effectiveDatetime                                                                                                          │
│   │  │  └─ ← EquityCompensationCancellation [Rsu].date (rename)                                                                      │
│   │  ├─ + forfeitureDatetime                                                                                                         │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + quantity                                                                                                                   │
│   │  │  └─ ← EquityCompensationCancellation [Rsu].quantity (rename)                                                                  │
│   │  ├─ + reason                                                                                                                     │
│   │  │  └─ ← EquityCompensationCancellation [Rsu].reason_text (computed)                                                             │
│   │  └─ + terminationDatetime                                                                                                        │
│   │     └─ ✗ no mapped OCF source                                                                                                    │
│   ├─ issuance : RsuIssuanceTransaction                                                                                               │
│   │  ├─ ← EquityCompensationIssuance [Rsu] (contains → RsuIssuanceTransaction) (structural)                                          │
│   │  ├─ + equityPlanId                                                                                                               │
│   │  │  └─ ← EquityCompensationIssuance [Rsu].stock_plan_id (rename)                                                                 │
│   │  ├─ + issueDatetime                                                                                                              │
│   │  │  └─ ← EquityCompensationIssuance [Rsu].date (rename)                                                                          │
│   │  ├─ + quantity                                                                                                                   │
│   │  │  └─ ← EquityCompensationIssuance [Rsu].quantity (rename)                                                                      │
│   │  ├─ + shareClassId                                                                                                               │
│   │  │  └─ ← EquityCompensationIssuance [Rsu].stock_class_id (rename)                                                                │
│   │  └─ + vestingScheduleTemplateId                                                                                                  │
│   │     └─ ← EquityCompensationIssuance [Rsu].vesting_template_id (rename)                                                           │
│   └─ settlements[] : RsuSettlementTransaction                                                                                        │
│      ├─ ← EquityCompensationRelease [Rsu] (contains items → RsuSettlementTransaction) (structural)                                   │
│      ├─ + id                                                                                                                         │
│      │  └─ ✗ no mapped OCF source                                                                                                    │
│      ├─ + resultingSecurityId                                                                                                        │
│      │  └─ ✗ no mapped OCF source                                                                                                    │
│      ├─ + resultingSecurityLabel                                                                                                     │
│      │  └─ ✗ no mapped OCF source                                                                                                    │
│      ├─ + resultingSecurityType                                                                                                      │
│      │  └─ ✗ no mapped OCF source                                                                                                    │
│      ├─ + settledQuantity                                                                                                            │
│      │  └─ ← EquityCompensationRelease [Rsu].quantity (rename)                                                                       │
│      ├─ + settlementDatetime                                                                                                         │
│      │  └─ ← EquityCompensationRelease [Rsu].date (rename)                                                                           │
│      └─ + withheldQuantity                                                                                                           │
│         └─ ✗ no mapped OCF source                                                                                                    │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: SarTransactionItem ────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: SarTransactionItem                                                                                                             │
│ id: "#/$defs/SarTransactionItem"                                                                                                     │
│ inverse_role: direct                                                                                                                 │
│ status: MAPPED                                                                                                                       │
│ mapping_evidence: 13 (direct object: 13, reusable type detail: 0)                                                                    │
│ unmapped_properties: 0                                                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (3)                                                                                                                │
│   ├─ + securityId                                                                                                                    │
│   │  ├─ ← EquityCompensationCancellation [Sar].security_id (rename)                                                                  │
│   │  ├─ ← EquityCompensationExercise [Sar].security_id (rename)                                                                      │
│   │  ├─ ← EquityCompensationIssuance [Sar].security_id (rename)                                                                      │
│   │  └─ ← StockPlanReturnToPool [Sar].security_id (rename; inverse: reference-only)                                                  │
│   │     └─ ↳ inverse semantics: reference-only — Identifies the existing cancelled security; it does not reconstruct a return event. │
│   ├─ + securityLabel                                                                                                                 │
│   │  └─ ← EquityCompensationIssuance [Sar].custom_id (rename)                                                                        │
│   └─ + stakeholderId                                                                                                                 │
│      └─ ← EquityCompensationIssuance [Sar].stakeholder_id (rename)                                                                   │
│                                                                                                                                      │
│ contains (3 nested variants)                                                                                                         │
│   ├─ cancellations[] : SarCancellationTransaction                                                                                    │
│   │  ├─ ← EquityCompensationCancellation [Sar] (contains items → SarCancellationTransaction) (structural)                            │
│   │  ├─ + effectiveDatetime                                                                                                          │
│   │  │  └─ ← EquityCompensationCancellation [Sar].date (rename)                                                                      │
│   │  ├─ + forfeitureDatetime                                                                                                         │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + quantity                                                                                                                   │
│   │  │  └─ ← EquityCompensationCancellation [Sar].quantity (rename)                                                                  │
│   │  ├─ + reason                                                                                                                     │
│   │  │  └─ ← EquityCompensationCancellation [Sar].reason_text (computed)                                                             │
│   │  └─ + terminationDatetime                                                                                                        │
│   │     └─ ✗ no mapped OCF source                                                                                                    │
│   ├─ exercises[] : SarExerciseTransaction                                                                                            │
│   │  ├─ ← EquityCompensationExercise [Sar] (contains items → SarExerciseTransaction) (structural)                                    │
│   │  ├─ + cashAcquired                                                                                                               │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + quantity                                                                                                                   │
│   │  │  └─ ← EquityCompensationExercise [Sar].quantity (rename)                                                                      │
│   │  ├─ + resultingSecurityId                                                                                                        │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + resultingSecurityLabel                                                                                                     │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + resultingSecurityType                                                                                                      │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + settledQuantity                                                                                                            │
│   │  │  └─ ✗ no mapped OCF source                                                                                                    │
│   │  ├─ + sharesAcquiredDatetime                                                                                                     │
│   │  │  └─ ← EquityCompensationExercise [Sar].date (rename)                                                                          │
│   │  └─ + withheldQuantity                                                                                                           │
│   │     └─ ✗ no mapped OCF source                                                                                                    │
│   └─ issuance : SarIssuanceTransaction                                                                                               │
│      ├─ ← EquityCompensationIssuance [Sar] (contains → SarIssuanceTransaction) (structural)                                          │
│      ├─ + equityPlanId                                                                                                               │
│      │  └─ ← EquityCompensationIssuance [Sar].stock_plan_id (rename)                                                                 │
│      ├─ + exercisePrice                                                                                                              │
│      │  └─ ← EquityCompensationIssuance [Sar].base_price (rename)                                                                    │
│      ├─ + expirationDatetime                                                                                                         │
│      │  └─ ← EquityCompensationIssuance [Sar].expiration_date (rename)                                                               │
│      │     └─ ↳ dispatches exactly one expiration_date.type branch (mutually exclusive)                                              │
│      ├─ + issueDatetime                                                                                                              │
│      │  └─ ← EquityCompensationIssuance [Sar].date (rename)                                                                          │
│      ├─ + quantity                                                                                                                   │
│      │  └─ ← EquityCompensationIssuance [Sar].quantity (rename)                                                                      │
│      ├─ + shareClassId                                                                                                               │
│      │  └─ ← EquityCompensationIssuance [Sar].stock_class_id (rename)                                                                │
│      └─ + vestingScheduleTemplateId                                                                                                  │
│         └─ ← EquityCompensationIssuance [Sar].vesting_template_id (rename)                                                           │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: ShareClass ────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: ShareClass                                                                                                             │
│ id: "#/$defs/ShareClass"                                                                                                     │
│ inverse_role: direct                                                                                                         │
│ status: PARTIAL                                                                                                              │
│ mapping_evidence: 13 (direct object: 13, reusable type detail: 0)                                                            │
│ unmapped_properties: 1                                                                                                       │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ resulting Carta object flavors (2)                                                                                           │
│ ├── StockClass.Common → ShareClass                                                                                           │
│ │   ├── when: StockClass.class_type = [COMMON]                                                                               │
│ │   └── properties: authorizedShareCount, id, name, pariPassu, parValue, prefix, seniority, type                             │
│ └── StockClass.Preferred → ShareClass                                                                                        │
│     ├── when: StockClass.class_type = [PREFERRED]                                                                            │
│     └── properties: authorizedShareCount, id, name, pariPassu, parValue, preferredShareClassDetails, prefix, seniority, type │
│                                                                                                                              │
│ aggregate mapping ledger                                                                                                     │
│ parent properties (9)                                                                                                        │
│   ├─ + authorizedShareCount                                                                                                  │
│   │  ├─ ← StockClass [shared].initial_shares_authorized (union-map)                                                          │
│   │  │  └─ ↳ dispatches exactly one initial_shares_authorized.type branch (mutually exclusive)                               │
│   │  └─ ← StockClassAuthorizedSharesAdjustment.new_shares_authorized (rename)                                                │
│   ├─ + id                                                                                                                    │
│   │  ├─ ← StockClass [shared].id (rename)                                                                                    │
│   │  ├─ ← StockClassAuthorizedSharesAdjustment.stock_class_id (rename)                                                       │
│   │  └─ ← StockClassConversionRatioAdjustment.stock_class_id (rename)                                                        │
│   ├─ + issuerId                                                                                                              │
│   │  └─ ✗ no mapped OCF source                                                                                               │
│   ├─ + name                                                                                                                  │
│   │  └─ ← StockClass [shared].name (rename)                                                                                  │
│   ├─ + pariPassu                                                                                                             │
│   │  └─ ← StockClass [shared].seniority (computed)                                                                           │
│   ├─ + parValue                                                                                                              │
│   │  └─ ← StockClass [shared].par_value (rename)                                                                             │
│   ├─ + prefix                                                                                                                │
│   │  └─ ← StockClass [shared].default_id_prefix (rename)                                                                     │
│   ├─ + seniority                                                                                                             │
│   │  └─ ← StockClass [shared].seniority (computed)                                                                           │
│   └─ + type                                                                                                                  │
│      └─ ← StockClass [shared].class_type (computed)                                                                          │
│                                                                                                                              │
│ contains (1 nested variants)                                                                                                 │
│   └─ preferredShareClassDetails : PreferredShareClassDetails                                                                 │
│      ├─ ← StockClass [Preferred] (contains → PreferredShareClassDetails) (structural)                                        │
│      ├─ + dividendDetails                                                                                                    │
│      │  └─ ✗ no mapped OCF source                                                                                            │
│      └─ + rightsAndPreferences                                                                                               │
│         └─ ← StockClass [Preferred] (contains → ShareClassRightsAndPreferences) (structural)                                 │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: ShareClassValuation ────────────────────────────────────────╮
│ name: ShareClassValuation                                                 │
│ id: "#/$defs/ShareClassValuation"                                         │
│ inverse_role: direct                                                      │
│ status: MAPPED                                                            │
│ mapping_evidence: 4 (direct object: 4, reusable type detail: 0)           │
│ unmapped_properties: 0                                                    │
├───────────────────────────────────────────────────────────────────────────┤
│ conditional property flows (1 discriminators)                             │
│ └── StockClass :: class_type                                              │
│     └── Common [COMMON] or Preferred [PREFERRED] → common, shareClassName │
│                                                                           │
│ aggregate mapping ledger                                                  │
│ parent properties (4)                                                     │
│   ├─ + common                                                             │
│   │  └─ ← StockClass [shared].class_type (computed)                       │
│   ├─ + price                                                              │
│   │  └─ ← Valuation.price_per_share (rename)                              │
│   ├─ + shareClassId                                                       │
│   │  └─ ← Valuation.stock_class_id (rename)                               │
│   └─ + shareClassName                                                     │
│      └─ ← StockClass [shared].name (rename)                               │
╰───────────────────────────────────────────────────────────────────────────╯

╭ Carta object: Stakeholder ─────────────────────────────────────────────────────╮
│ name: Stakeholder                                                              │
│ id: "#/$defs/Stakeholder"                                                      │
│ inverse_role: direct                                                           │
│ status: PARTIAL                                                                │
│ mapping_evidence: 13 (direct object: 13, reusable type detail: 0)              │
│ unmapped_properties: 2                                                         │
├────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (9)                                                          │
│   ├─ + address                                                                 │
│   │  └─ ← Stakeholder.addresses (select)                                       │
│   ├─ + email                                                                   │
│   │  ├─ ← Stakeholder.contact_info (combine)                                   │
│   │  └─ ← Stakeholder.primary_contact (combine)                                │
│   ├─ + employeeId                                                              │
│   │  └─ ← Stakeholder.issuer_assigned_id (rename)                              │
│   ├─ + entityType                                                              │
│   │  └─ ← Stakeholder.stakeholder_type (enum-remap)                            │
│   ├─ + fullName                                                                │
│   │  └─ ← Stakeholder.name (select)                                            │
│   ├─ + group                                                                   │
│   │  └─ ✗ no mapped OCF source                                                 │
│   ├─ + id                                                                      │
│   │  ├─ ← Stakeholder.id (rename)                                              │
│   │  ├─ ← StakeholderRelationshipChangeEvent.stakeholder_id (rename)           │
│   │  └─ ← StakeholderStatusChangeEvent.stakeholder_id (rename)                 │
│   ├─ + issuerId                                                                │
│   │  └─ ✗ no mapped OCF source                                                 │
│   └─ + relationship                                                            │
│      ├─ ← Stakeholder.current_relationship (enum-remap)                        │
│      ├─ ← Stakeholder.current_relationships (enum-remap)                       │
│      ├─ ← StakeholderRelationshipChangeEvent.relationship_ended (enum-remap)   │
│      └─ ← StakeholderRelationshipChangeEvent.relationship_started (enum-remap) │
╰────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: VestingScheduleTemplate ──────────────────────────╮
│ name: VestingScheduleTemplate                                   │
│ id: "#/$defs/VestingScheduleTemplate"                           │
│ inverse_role: direct                                            │
│ status: PARTIAL                                                 │
│ mapping_evidence: 2 (direct object: 2, reusable type detail: 0) │
│ unmapped_properties: 5                                          │
├─────────────────────────────────────────────────────────────────┤
│ parent properties (7)                                           │
│   ├─ + description                                              │
│   │  └─ ✗ no mapped OCF source                                  │
│   ├─ + id                                                       │
│   │  └─ ← VestingTerms.id (rename)                              │
│   ├─ + issuerId                                                 │
│   │  └─ ✗ no mapped OCF source                                  │
│   ├─ + name                                                     │
│   │  └─ ✗ no mapped OCF source                                  │
│   ├─ + periods                                                  │
│   │  └─ ← VestingTerms.statements (rename)                      │
│   ├─ + uuid                                                     │
│   │  └─ ✗ no mapped OCF source                                  │
│   └─ + vestingScheduleType                                      │
│      └─ ✗ no mapped OCF source                                  │
╰─────────────────────────────────────────────────────────────────╯

╭ Carta object: WarrantTransactionItem ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: WarrantTransactionItem                                                                                                                                                                                                           │
│ id: "#/$defs/WarrantTransactionItem"                                                                                                                                                                                                   │
│ inverse_role: direct                                                                                                                                                                                                                   │
│ status: MAPPED                                                                                                                                                                                                                         │
│ mapping_evidence: 10 (direct object: 10, reusable type detail: 0)                                                                                                                                                                      │
│ unmapped_properties: 0                                                                                                                                                                                                                 │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ parent properties (3)                                                                                                                                                                                                                  │
│   ├─ + securityId                                                                                                                                                                                                                      │
│   │  ├─ ← WarrantCancellation.security_id (rename)                                                                                                                                                                                     │
│   │  ├─ ← WarrantExercise.security_id (rename)                                                                                                                                                                                         │
│   │  ├─ ← WarrantIssuance.security_id (rename)                                                                                                                                                                                         │
│   │  └─ ← WarrantTransfer.security_id (rename)                                                                                                                                                                                         │
│   ├─ + securityLabel                                                                                                                                                                                                                   │
│   │  └─ ← WarrantIssuance.custom_id (rename)                                                                                                                                                                                           │
│   └─ + stakeholderId                                                                                                                                                                                                                   │
│      └─ ← WarrantIssuance.stakeholder_id (rename)                                                                                                                                                                                      │
│                                                                                                                                                                                                                                        │
│ contains (4 nested variants)                                                                                                                                                                                                           │
│   ├─ cancellations[] : WarrantCancellationTransaction                                                                                                                                                                                  │
│   │  ├─ ← WarrantCancellation (contains items → WarrantCancellationTransaction) (structural)                                                                                                                                           │
│   │  ├─ + effectiveDatetime                                                                                                                                                                                                            │
│   │  │  └─ ← WarrantCancellation.date (rename)                                                                                                                                                                                         │
│   │  ├─ + quantity                                                                                                                                                                                                                     │
│   │  │  └─ ← WarrantCancellation.quantity (rename)                                                                                                                                                                                     │
│   │  └─ + reason                                                                                                                                                                                                                       │
│   │     └─ ← WarrantCancellation.reason_text (computed)                                                                                                                                                                                │
│   ├─ exercises[] : WarrantExerciseTransaction                                                                                                                                                                                          │
│   │  ├─ ← WarrantExercise (contains items → WarrantExerciseTransaction) (structural)                                                                                                                                                   │
│   │  ├─ + quantity                                                                                                                                                                                                                     │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│   │  ├─ + resultingSecurityId                                                                                                                                                                                                          │
│   │  │  ├─ ← WarrantExercise.resulting_security_ids (select)                                                                                                                                                                           │
│   │  │  └─ ? open question: Given that OCF allows one warrant exercise to produce multiple resulting securities while Carta `WarrantExerciseTransaction.resultingSecurityId` is scalar,… [asked by @johnscrudato; WarrantExercise:179] │
│   │  ├─ + resultingSecurityLabel                                                                                                                                                                                                       │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│   │  ├─ + resultingSecurityType                                                                                                                                                                                                        │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│   │  ├─ + settledQuantity                                                                                                                                                                                                              │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│   │  ├─ + sharesAcquiredDatetime                                                                                                                                                                                                       │
│   │  │  └─ ← WarrantExercise.date (rename)                                                                                                                                                                                             │
│   │  └─ + withheldQuantity                                                                                                                                                                                                             │
│   │     └─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│   ├─ issuance : WarrantIssuanceTransaction                                                                                                                                                                                             │
│   │  ├─ ← WarrantIssuance (contains → WarrantIssuanceTransaction) (structural)                                                                                                                                                         │
│   │  ├─ + exercisePrice                                                                                                                                                                                                                │
│   │  │  └─ ← WarrantIssuance.exercise_price (rename)                                                                                                                                                                                   │
│   │  ├─ + expirationDatetime                                                                                                                                                                                                           │
│   │  │  └─ ← WarrantIssuance.warrant_expiration_date (rename)                                                                                                                                                                          │
│   │  ├─ + issueDatetime                                                                                                                                                                                                                │
│   │  │  └─ ← WarrantIssuance.date (rename)                                                                                                                                                                                             │
│   │  ├─ + purchasePrice                                                                                                                                                                                                                │
│   │  │  └─ ← WarrantIssuance.purchase_price (rename)                                                                                                                                                                                   │
│   │  ├─ + quantity                                                                                                                                                                                                                     │
│   │  │  └─ ← WarrantIssuance.quantity (rename)                                                                                                                                                                                         │
│   │  ├─ + shareClassId                                                                                                                                                                                                                 │
│   │  │  └─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│   │  └─ + vestingScheduleTemplateId                                                                                                                                                                                                    │
│   │     └─ ← WarrantIssuance.vesting_terms_id (rename)                                                                                                                                                                                 │
│   └─ transfers[] : WarrantTransferTransaction                                                                                                                                                                                          │
│      ├─ ← WarrantTransfer (contains items → WarrantTransferTransaction) (structural)                                                                                                                                                   │
│      ├─ + quantity                                                                                                                                                                                                                     │
│      │  └─ ← WarrantTransfer.quantity (rename)                                                                                                                                                                                         │
│      ├─ + resultingSecurityId                                                                                                                                                                                                          │
│      │  └─ ← WarrantTransfer.resulting_security_ids (select)                                                                                                                                                                           │
│      ├─ + resultingSecurityLabel                                                                                                                                                                                                       │
│      │  └─ ✗ no mapped OCF source                                                                                                                                                                                                      │
│      └─ + transferredDatetime                                                                                                                                                                                                          │
│         └─ ← WarrantTransfer.date (rename)                                                                                                                                                                                             │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

Standalone candidates requiring inventory detail (13)
╭ Carta object: CapitalizationTableSummary ──────────────────────────────────────────╮
│ name: CapitalizationTableSummary                                                   │
│ id: "#/$defs/CapitalizationTableSummary"                                           │
│ inverse_role: report-rollup                                                        │
│ status: NO MAPPINGS                                                                │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)                    │
│ reason: Carta read-model aggregate; OCF records the underlying leaf facts instead. │
├────────────────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: Corporation ──────────────────────────────────────────────╮
│ name: Corporation                                                       │
│ id: "#/$defs/Corporation"                                               │
│ inverse_role: alternate                                                 │
│ status: NO MAPPINGS                                                     │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)         │
│ reason: Unused alternate issuer shape; OCF Issuer maps to Carta Issuer. │
├─────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                         │
╰─────────────────────────────────────────────────────────────────────────╯

╭ Carta object: Interest ──────────────────────────────────────────────────╮
│ name: Interest                                                           │
│ id: "#/$defs/Interest"                                                   │
│ inverse_role: vendor-family                                              │
│ status: NO MAPPINGS                                                      │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)          │
│ reason: Carta profits-interest security family has no OCF source object. │
├──────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                          │
╰──────────────────────────────────────────────────────────────────────────╯

╭ Carta object: NoteBlockSummary ────────────────────────────────────────────────────╮
│ name: NoteBlockSummary                                                             │
│ id: "#/$defs/NoteBlockSummary"                                                     │
│ inverse_role: report-rollup                                                        │
│ status: NO MAPPINGS                                                                │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)                    │
│ reason: Carta read-model aggregate; OCF records the underlying leaf facts instead. │
├────────────────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: OptionExercise ──────────────────────────────────────────────────────────────╮
│ name: OptionExercise                                                                       │
│ id: "#/$defs/OptionExercise"                                                               │
│ inverse_role: workflow-gap                                                                 │
│ status: NO MAPPINGS                                                                        │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)                            │
│ reason: Carta exercise-request workflow object; OCF maps the realized transaction instead. │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                                            │
╰────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: OptionGrantDocuments ───────────────────────────────────────╮
│ name: OptionGrantDocuments                                                │
│ id: "#/$defs/OptionGrantDocuments"                                        │
│ inverse_role: gap                                                         │
│ status: NO MAPPINGS                                                       │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)           │
│ reason: Carta grant-document relationship has no OCF source relationship. │
├───────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                           │
╰───────────────────────────────────────────────────────────────────────────╯

╭ Carta object: OptionPoolSummary ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name: OptionPoolSummary                                                                                                                            │
│ id: "#/$defs/OptionPoolSummary"                                                                                                                    │
│ inverse_role: report-rollup                                                                                                                        │
│ status: PARTIAL                                                                                                                                    │
│ mapping_evidence: 6 (direct object: 6, reusable type detail: 0)                                                                                    │
│ unmapped_properties: 4                                                                                                                             │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ conditional property flows (1 discriminators)                                                                                                      │
│ └── StockPlanReturnToPool :: security_id → compensation_type (lookup)                                                                              │
│     └── Option [OPTION, OPTION_NSO, OPTION_ISO] or Rsu [RSU] or Sar [CSAR, SSAR] → optionPoolId                                                    │
│                                                                                                                                                    │
│ aggregate mapping ledger                                                                                                                           │
│ parent properties (8)                                                                                                                              │
│   ├─ + authorizedShares                                                                                                                            │
│   │  └─ ← StockPlan.initial_shares_reserved (rename; inverse: state-projection)                                                                    │
│   │     └─ ↳ inverse semantics: state-projection — Summary authorization state; it cannot recover the initial value versus later pool adjustments. │
│   ├─ + fullyDilutedShares                                                                                                                          │
│   │  └─ ✗ no mapped OCF source                                                                                                                     │
│   ├─ + name                                                                                                                                        │
│   │  └─ ← StockPlan.plan_name (rename; inverse: state-projection)                                                                                  │
│   │     └─ ↳ inverse semantics: state-projection — Current/denormalized plan-name state; it carries no plan-history semantics.                     │
│   ├─ + optionPoolId                                                                                                                                │
│   │  ├─ ← StockPlan.id (rename; inverse: reference-only)                                                                                           │
│   │  │  └─ ↳ inverse semantics: reference-only — Pool identity/reference; the summary is not an inverse source record.                             │
│   │  └─ ← StockPlanReturnToPool [shared].stock_plan_id (rename; inverse: reference-only)                                                           │
│   │     └─ ↳ inverse semantics: reference-only — Carries the destination pool relationship only; it is not a Carta pool-ledger record.             │
│   ├─ + outstandingCommittedRestrictedStockAwards                                                                                                   │
│   │  └─ ✗ no mapped OCF source                                                                                                                     │
│   ├─ + outstandingEquityAwardDerivatives                                                                                                           │
│   │  └─ ✗ no mapped OCF source                                                                                                                     │
│   ├─ + shareClassId                                                                                                                                │
│   │  ├─ ← StockPlan.stock_class_id (rename; inverse: reference-only)                                                                               │
│   │  │  └─ ↳ inverse semantics: reference-only — Identifies the backing share class; it does not construct pool-authorization history.             │
│   │  └─ ← StockPlan.stock_class_ids (select; inverse: reference-only)                                                                              │
│   │     └─ ↳ inverse semantics: reference-only — Only the selected share-class reference survives; the full OCF relationship cannot be recovered.  │
│   └─ + terminatedDatetime                                                                                                                          │
│      └─ ✗ no mapped OCF source                                                                                                                     │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: PhantomTransactionItem ──────────────────────────────────────────────╮
│ name: PhantomTransactionItem                                                       │
│ id: "#/$defs/PhantomTransactionItem"                                               │
│ inverse_role: report-rollup                                                        │
│ status: NO MAPPINGS                                                                │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)                    │
│ reason: Carta read-model aggregate; OCF records the underlying leaf facts instead. │
├────────────────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: PiuTransactionItem ──────────────────────────────────────────────────╮
│ name: PiuTransactionItem                                                           │
│ id: "#/$defs/PiuTransactionItem"                                                   │
│ inverse_role: report-rollup                                                        │
│ status: NO MAPPINGS                                                                │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)                    │
│ reason: Carta read-model aggregate; OCF records the underlying leaf facts instead. │
├────────────────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: ShareClassSummary ───────────────────────────────────────────────────╮
│ name: ShareClassSummary                                                            │
│ id: "#/$defs/ShareClassSummary"                                                    │
│ inverse_role: report-rollup                                                        │
│ status: NO MAPPINGS                                                                │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)                    │
│ reason: Carta read-model aggregate; OCF records the underlying leaf facts instead. │
├────────────────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: StakeholderGroup ────────────────────────────────────────────────────╮
│ name: StakeholderGroup                                                             │
│ id: "#/$defs/StakeholderGroup"                                                     │
│ inverse_role: report-rollup                                                        │
│ status: NO MAPPINGS                                                                │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)                    │
│ reason: Carta read-model aggregate; OCF records the underlying leaf facts instead. │
├────────────────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: Vesting ───────────────────────────────────────────────────────────────────────╮
│ name: Vesting                                                                                │
│ id: "#/$defs/Vesting"                                                                        │
│ inverse_role: alternate                                                                      │
│ status: NO MAPPINGS                                                                          │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)                              │
│ reason: Unreachable option-grant vesting shape; mapped OCF vesting uses schedule/event defs. │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                                              │
╰──────────────────────────────────────────────────────────────────────────────────────────────╯

╭ Carta object: WarrantBlockSummary ─────────────────────────────────────────────────╮
│ name: WarrantBlockSummary                                                          │
│ id: "#/$defs/WarrantBlockSummary"                                                  │
│ inverse_role: report-rollup                                                        │
│ status: NO MAPPINGS                                                                │
│ mapping_evidence: 0 (direct object: 0, reusable type detail: 0)                    │
│ reason: Carta read-model aggregate; OCF records the underlying leaf facts instead. │
├────────────────────────────────────────────────────────────────────────────────────┤
│ (empty mapping)                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────╯
