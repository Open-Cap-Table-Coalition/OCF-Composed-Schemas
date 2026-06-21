---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/EquityCompensationIssuance.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Issuance Transaction
ocf_kind: object
required_fields:
  - compensation_type
  - quantity
  - expiration_date
  - termination_exercise_windows
  - id
  - object_type
  - date
  - security_id
  - security_law_exemptions
  - stakeholder_id
  - custom_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Equity Compensation Issuance Transaction → Carta

> Object describing securities issuance transaction by the issuer and held by a stakeholder as a form of compensation (as noted elsewhere, RSAs are not included here intentionally and should be modelled using Stock Issuances).

## OCF schema

Source: [`EquityCompensationIssuance.schema.json`](./EquityCompensationIssuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/EquityCompensationIssuance.schema.json",
  "title": "Object - Equity Compensation Issuance Transaction",
  "description": "Object describing securities issuance transaction by the issuer and held by a stakeholder as a form of compensation (as noted elsewhere, RSAs are not included here intentionally and should be modelled using Stock Issuances).",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/SecurityTransaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/issuance/Issuance.schema.json"
    }
  ],
  "properties": {
    "id": {
      "description": "Identifier for the object",
      "type": "string"
    },
    "comments": {
      "description": "Unstructured text comments related to and stored for the object",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "object_type": {
      "enum": [
        "TX_PLAN_SECURITY_ISSUANCE",
        "TX_EQUITY_COMPENSATION_ISSUANCE"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_ISSUANCE` will be deprecated in v2.0.0"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "custom_id": {
      "description": "A custom ID for this security (e.g. CN-1.)",
      "type": "string"
    },
    "stakeholder_id": {
      "description": "Identifier for the stakeholder that holds legal title to this security",
      "type": "string"
    },
    "board_approval_date": {
      "description": "Date of board approval for the security",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "Date on which the stockholders approved the security",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security issuance",
      "type": "string"
    },
    "security_law_exemptions": {
      "title": "Security Issuance - Security Exemption Array",
      "description": "List of security law exemptions (and applicable jurisdictions) for this security",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/SecurityExemption.schema.json"
      }
    },
    "stock_plan_id": {
      "description": "If the equity compensation was issued from a plan (don't forget, plan-less options are a thing), what is the plan id.",
      "type": "string"
    },
    "stock_class_id": {
      "description": "The stock class options will exercise into. Especially important for plan-less options and any issuances from a plan that supports multiple share classes.",
      "type": "string"
    },
    "compensation_type": {
      "description": "If the plan security is compensation, what kind?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/CompensationType.schema.json"
    },
    "option_grant_type": {
      "description": "If the plan security is an option, what kind?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/OptionType.schema.json",
      "$comment": "DEPRECATION WARNING - This field is being retained for compatibility, but these variations have been incorporated into CompensationType.schema.json enum options"
    },
    "quantity": {
      "description": "How many shares are subject to this plan security?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "exercise_price": {
      "description": "If this is an option, what is the exercise price of the option?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "base_price": {
      "description": "If this is a stock appreciation right, what is the base price used to calculate the appreciation of the SAR?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "early_exercisable": {
      "type": "boolean",
      "description": "Is this Equity Compensation exercisable prior to completion of vesting? If so, it's assumed the vesting schedule will remain in effect but, instead of vesting a right to exercise, it becomes the schedule determining when a right to repurchase the resulting stock lapses.",
      "$comment": "REQUIRED in v2"
    },
    "vesting_terms_id": {
      "description": "Identifier of the VestingTerms to which this security is subject. If neither `vesting_terms_id` or `vestings` are present then the security is fully vested on issuance.",
      "type": "string"
    },
    "vestings": {
      "title": "Equity Compensation Issuance - Vestings Array",
      "description": "List of exact vesting dates and amounts for this security. When `vestings` array is present then `vesting_terms_id` may be ignored.",
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json"
      }
    },
    "expiration_date": {
      "description": "Expiration date of the plan security",
      "oneOf": [
        {
          "type": "null"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
        }
      ]
    },
    "termination_exercise_windows": {
      "title": "Plan Security - Termination Window Array",
      "description": "Exercise periods applicable to plan security after a termination for a given, enumerated reason",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TerminationWindow.schema.json"
      }
    }
  },
  "anyOf": [
    {
      "properties": {
        "compensation_type": {
          "const": "OPTION"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Options require exercise price.",
      "required": [
        "exercise_price"
      ]
    },
    {
      "properties": {
        "compensation_type": {
          "const": "OPTION_NSO"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Options require exercise price.",
      "required": [
        "exercise_price"
      ]
    },
    {
      "properties": {
        "compensation_type": {
          "const": "OPTION_ISO"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Options require exercise price.",
      "required": [
        "exercise_price"
      ]
    },
    {
      "properties": {
        "compensation_type": {
          "const": "RSU"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. RSUs usually don't have exercise prices."
    },
    {
      "properties": {
        "compensation_type": {
          "const": "CSAR"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Stock appreciation rights have grant prices.",
      "required": [
        "base_price"
      ]
    },
    {
      "properties": {
        "compensation_type": {
          "const": "SSAR"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Stock appreciation rights have grant prices.",
      "required": [
        "base_price"
      ]
    }
  ],
  "additionalProperties": false,
  "required": [
    "compensation_type",
    "quantity",
    "expiration_date",
    "termination_exercise_windows",
    "id",
    "object_type",
    "date",
    "security_id",
    "security_law_exemptions",
    "stakeholder_id",
    "custom_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/issuance/EquityCompensationIssuance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 23/23

fields:
  id:
    kind: unmappable
    target: null
    reason: ocf-internal
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      TX_PLAN_SECURITY_ISSUANCE: null
      TX_EQUITY_COMPENSATION_ISSUANCE: null
  date:
    kind: rename
    target: "#/$defs/OptionIssuanceTransaction/properties/issueDatetime"
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
    reason: no-equivalent
  consideration_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_law_exemptions:
    kind: computed
    target: "#/$defs/Compliance/properties/federalExemption"
  stock_plan_id:
    kind: rename
    target: "#/$defs/OptionIssuanceTransaction/properties/equityPlanId"
  stock_class_id:
    kind: rename
    target: "#/$defs/OptionIssuanceTransaction/properties/shareClassId"
  compensation_type:
    kind: enum-remap
    target: "#/$defs/OptionIssuanceTransaction/properties/stockOptionType"
    values:
      OPTION_NSO: NSO
      OPTION_ISO: ISO
      OPTION: OTHER
      RSU: null
      CSAR: null
      SSAR: null
  option_grant_type:
    kind: enum-remap
    target: "#/$defs/OptionIssuanceTransaction/properties/stockOptionType"
    values:
      NSO: NSO
      ISO: ISO
      INTL: STOCK_OPTION_TYPE_INTL
  quantity:
    kind: rename
    target: "#/$defs/OptionIssuanceTransaction/properties/quantity"
  exercise_price:
    kind: rename
    target: "#/$defs/OptionIssuanceTransaction/properties/exercisePrice"
  base_price:
    kind: unmappable
    target: null
    reason: no-equivalent
  early_exercisable:
    kind: rename
    target: "#/$defs/OptionGrant/properties/earlyExercisable"
  vesting_terms_id:
    kind: rename
    target: "#/$defs/OptionIssuanceTransaction/properties/vestingScheduleTemplateId"
  vestings:
    kind: split
    target:
      - "#/$defs/OptionGrantVestingEvent/properties/vestDate"
      - "#/$defs/OptionGrantVestingEvent/properties/quantity"
  expiration_date:
    kind: rename
    target: "#/$defs/OptionIssuanceTransaction/properties/expirationDatetime"
  termination_exercise_windows:
    kind: split
    target:
      - "#/$defs/ExercisePeriods/properties/voluntaryTerminationCount"
      - "#/$defs/ExercisePeriods/properties/voluntaryTerminationPeriod"
      - "#/$defs/ExercisePeriods/properties/retirementExerciseCount"
      - "#/$defs/ExercisePeriods/properties/retirementExercisePeriod"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationCount"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationPeriod"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationCauseCount"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationCausePeriod"
      - "#/$defs/ExercisePeriods/properties/deathExerciseCount"
      - "#/$defs/ExercisePeriods/properties/deathExercisePeriod"
      - "#/$defs/ExercisePeriods/properties/disabilityExerciseCount"
      - "#/$defs/ExercisePeriods/properties/disabilityExercisePeriod"
```

## Notes / open questions

- **Carta home = `OptionIssuanceTransaction` (+ the `OptionGrant` security it creates).** OCF's `EquityCompensationIssuance` (and its v1 alias `PlanSecurityIssuance`) records the grant of a plan/equity-compensation security. Carta models this as `#/$defs/OptionIssuanceTransaction` ("The issuance transaction for an option grant. Represents the initial grant of options.") together with the `#/$defs/OptionGrant` security object it produces, per the transaction/security surface. Because OCF folds the *transaction* and the *resulting security's static attributes* into one object, fields fan out across both Carta defs: economic/issuance terms land on `OptionIssuanceTransaction`, while grant-identity attributes (security id/label, stakeholder, board-approval date, early-exercise flag, post-termination windows) land on `OptionGrant`. Both are reachable from the same issuance event, so this is a single-home object mapping (bucket n/a-object), not a split across unrelated objects.
- **Option-centric model — non-option compensation types are lossy.** Carta's issuance/security pair is built around *options*. OCF's `compensation_type` spans `OPTION`, `OPTION_ISO`, `OPTION_NSO`, `RSU`, `CSAR`, `SSAR`. Only the three OPTION variants map cleanly onto Carta's `OptionIssuanceTransaction.stockOptionType` (`#/$defs/StockOptionType` enum): `OPTION_ISO`→`ISO`, `OPTION_NSO`→`NSO`, `OPTION`→`OTHER`. The non-option types (`RSU`, `CSAR`, `SSAR`) have **no member** in `StockOptionType` and, in Carta's model, are entirely separate transaction/security families (`RsuIssuanceTransaction`/`RestrictedStockUnit`, `SarIssuanceTransaction`/`Sar`) — so an OCF instance carrying those values does not belong on `OptionIssuanceTransaction` at all and those enum values route to `null`. A faithful serializer must branch on `compensation_type` and choose the corresponding Carta transaction; this mapping documents the option branch, which is the canonical use of `OptionIssuanceTransaction`.
- `option_grant_type` → `stockOptionType` (enum-remap): a **deprecated** OCF field (the `$comment` says its variations have been folded into `CompensationType`) carrying `OptionType` (`NSO`/`ISO`/`INTL`). It targets the same Carta enum as `compensation_type`: `NSO`→`NSO`, `ISO`→`ISO`, `INTL`→`STOCK_OPTION_TYPE_INTL` (Carta does have an explicit `STOCK_OPTION_TYPE_INTL` member, so `INTL` maps better here than via `compensation_type`). When both OCF fields are present they describe the same option and must agree; a serializer should populate `stockOptionType` once (preferring the non-deprecated `compensation_type`, falling back to `option_grant_type` for the `INTL` distinction).
- `date` → `issueDatetime`, `expiration_date` → `expirationDatetime`: standard OCF-date → Carta-datetime granularity widening. OCF `date`/`expiration_date` are calendar **dates** (`types/Date.schema.json`, `YYYY-MM-DD`); the Carta targets are `#/$defs/Iso8601CompleteCalendarDateTime` full **datetimes**, so a serializer widens (append midnight) and the reverse truncates. `expiration_date` is additionally a `oneOf [null, Date]` in OCF (an option may have no expiry); Carta's `expirationDatetime` is simply absent in that case.
- `quantity` → `quantity` and `exercise_price` → `exercisePrice`: clean renames with representation changes only — OCF `Numeric` (stringified decimal) → Carta `#/$defs/Decimal`, and OCF `Monetary` (`{amount, currency}`) → Carta `#/$defs/Money`. `exercise_price` is required by OCF only for OPTION/OPTION_ISO/OPTION_NSO (per the schema `anyOf`), matching Carta's option-centric `exercisePrice`.
- `security_id` → `OptionGrant.securityId`, `custom_id` → `OptionGrant.securityLabel`, `stakeholder_id` → `OptionGrant.stakeholderId`: identity attributes of the resulting grant. OCF's `security_id` is the stable cross-reference other transactions use; Carta's `OptionGrant.securityId` is documented as the cross-reference UUID for the List Transactions API — same role. `custom_id` (e.g. "CN-1") → `securityLabel` ("The label representing this security"). `stakeholder_id` is a straight reference rename.
- `board_approval_date` → `OptionGrant.boardApprovalDate`: direct semantic match (date the board approved the grant), again date→`Iso8601CompleteCalendarDate` (Carta uses a calendar **date** here, so no granularity change). The related `stakeholderAcceptanceDate`/`vestingStartDate`/`grantExpirationDate` on `OptionGrant` have no OCF source field on this object.
- `stock_plan_id` → `OptionIssuanceTransaction.equityPlanId`, `stock_class_id` → `OptionIssuanceTransaction.shareClassId`: both straight reference renames. OCF notes plan-less options exist (`stock_plan_id` optional); Carta's `equityPlanId` is correspondingly optional, and `shareClassId` "may be absent if the plan has no associated share class."
- `vesting_terms_id` → `OptionIssuanceTransaction.vestingScheduleTemplateId`: OCF references a reusable `VestingTerms` object by id; Carta references a reusable vesting-schedule **template** by id — the same "named, shareable vesting schedule" concept, so a reference rename. (Carta also exposes `OptionGrant.vestingSchedule`/`vestingEvents` for the *materialized* schedule; see `vestings` below.)
- `vestings` → split into `OptionGrantVestingEvent.vestDate` + `OptionGrantVestingEvent.quantity`: OCF's `vestings` is an inline array of exact `{date, amount}` vesting events (`types/Vesting.schema.json`) used when no `vesting_terms_id` is given. Carta's analogue is `OptionGrant.vestingEvents` — an array whose item is `#/$defs/OptionGrantVestingEvent`, with `vestDate` (`Iso8601CompleteCalendarDate`) and `quantity` (`Decimal`). These are an exact structural match for OCF's per-event `{date, amount}` (date→`vestDate`, OCF `Numeric` amount→`quantity` `Decimal`), so each OCF element fans out to that pair; the split target addresses the item leaves on `OptionGrantVestingEvent` directly (the pointer cannot descend through `vestingEvents/items` because `items` is a `$ref` the validator's pointer resolver does not traverse mid-path). The match is lossy only on Carta's extra projection fields (`vested`, `isoQuantity`/`nsoQuantity`, `performanceCondition`, `vestedQuantity`, …), which OCF does not carry and which are left unpopulated. (When `vesting_terms_id`/`vestingScheduleTemplateId` is used instead, the schedule is conveyed by reference rather than enumerated inline — see above.)
- `termination_exercise_windows` → split across the reason-specific `ExercisePeriods` count/period pairs: OCF carries an **array** of `TerminationWindow` (`{reason, period, period_type}`) keyed by termination reason (`enums/TerminationWindowType.schema.json`: `VOLUNTARY_OTHER`, `VOLUNTARY_GOOD_CAUSE`, `VOLUNTARY_RETIREMENT`, `INVOLUNTARY_OTHER`, `INVOLUNTARY_DEATH`, `INVOLUNTARY_DISABILITY`, `INVOLUNTARY_WITH_CAUSE`). Carta models the same concept on `#/$defs/OptionGrant.exercisePeriods` → `#/$defs/ExercisePeriods`, but **un-nested into a fixed set of reason-specific count/period field pairs**. Each OCF array element fans out: its `period` → the matching `*Count` (integer) and its `period_type` → the matching `*Period` (`#/$defs/ExercisePeriod` enum: DAY/MONTH/YEAR), with `reason` selecting *which* Carta pair. The split target therefore enumerates every Carta pair that has an OCF reason routing into it, and the routing is: `VOLUNTARY_OTHER`/`VOLUNTARY_GOOD_CAUSE` → `voluntaryTermination{Count,Period}` (Carta has a single voluntary bucket, so both OCF voluntary-non-retirement reasons collapse onto it — `VOLUNTARY_GOOD_CAUSE` is lossy here); `VOLUNTARY_RETIREMENT` → `retirementExercise{Count,Period}`; `INVOLUNTARY_OTHER` → `involuntaryTermination{Count,Period}`; `INVOLUNTARY_WITH_CAUSE` → `involuntaryTerminationCause{Count,Period}`; `INVOLUNTARY_DEATH` → `deathExercise{Count,Period}`; `INVOLUNTARY_DISABILITY` → `disabilityExercise{Count,Period}`. Note OCF's `PeriodType` (DAYS/MONTHS/YEARS) must be singularized to Carta's `EXERCISE_PERIOD_DAY/MONTH/YEAR`. (Carta's `ExercisePeriods` has no further pairs beyond these six, so no OCF reason is dropped; the only loss is the two voluntary reasons sharing one Carta bucket.)
- `security_law_exemptions` → **computed** into `#/$defs/Compliance/properties/federalExemption` (`FederalExemption` enum) — consistent with the `ConvertibleIssuance` precedent. OCF carries an **array** of `SecurityExemption` `{description (free text), jurisdiction (free text)}`; the source is an object-array, not an enum, so this cannot be a plain `enum-remap` (and the validator rejects a `values:` map on a non-enum source). Carta has no per-issuance exemption array and no free-text exemption field; the nearest structured home is the stakeholder-level `Compliance.federalExemption` enum (RULE_701 / SECTION_4_A_2 / REG_D_506_B / …). A serializer must therefore *compute* a single `FederalExemption` member by parsing the free-text `description` (and using `jurisdiction` to disambiguate US vs `NON_US`). This is lossy on several axes — array → single enum, free text → constrained enum, and Carta's field is per-stakeholder/`Compliance` rather than per-issuance — so it is recorded as the structured home with the inference left to the implementer.
- `stockholder_approval_date` → unmappable / `no-equivalent`: OCF records the date stockholders (as distinct from the board) approved the security. Carta's `OptionGrant` has `boardApprovalDate` but **no** separate stockholder-approval date field, so there is no leaf to receive it.
- `consideration_text` → unmappable / `no-equivalent`: free-text description of consideration for the issuance; Carta has no consideration field on the option issuance transaction or grant.
- `base_price` → unmappable / `no-equivalent`: OCF's SAR base/grant price (`Monetary`), required only for `CSAR`/`SSAR`. SARs are not modelled by `OptionIssuanceTransaction`/`OptionGrant` (they are a separate Carta `Sar`/`SarIssuanceTransaction` family, where the base price would live), so on the option home there is no field for it — consistent with `RSU`/`CSAR`/`SSAR` routing to `null` under `compensation_type`.
- `id`, `comments`, `object_type` → unmappable / `ocf-internal`: standard OCF scaffolding. `id` identifies the OCF transaction object (Carta assigns its own ids; note `OptionGrant.id`/`securityId` are Carta-side identifiers, not destinations for OCF `id`). `comments` has no Carta slot. `object_type` is OCF's discriminator enum — `TX_PLAN_SECURITY_ISSUANCE` (the deprecated-in-v2 v1 alias) and `TX_EQUITY_COMPENSATION_ISSUANCE` both denote the same issuance concept that Carta types positionally as `OptionIssuanceTransaction`; there is no per-record type discriminator to remap onto, so both values route to `null`.
- **Unused Carta fields:** on `OptionIssuanceTransaction` none remain unused (all eight are populated). On `OptionGrant`, `vestingEvents` (per-event `vestDate`/`quantity`) is populated from OCF `vestings` and `exercisePeriods` from `termination_exercise_windows` (see those rows); the read-back/derived quantities (`outstandingQuantity`, `vestedQuantity`, `exercisedQuantity`, `canceledQuantity`, `forfeitedQuantity`, `expiredQuantity`, `returnedToPool/TreasuryQuantity`), lifecycle dates (`stakeholderAcceptanceDate`, `canceledDate`, `grantExpirationDate`, `lastExercisableDate`, `disqualificationDate`, `terminationDate`, `vestingStartDate`, `lastModifiedDatetime`), `isoNsoSplit`, `equityIncentivePlanName`, `issuerId`, and the `vestingSchedule`/`exercises` projections have no source field on this OCF issuance object and are left unpopulated.
