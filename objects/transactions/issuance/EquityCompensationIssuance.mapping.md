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
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-06-29
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
  "description": "Version dispatcher for the equity-compensation issuance transaction. The stable public `$id` accepts either the current shape (v1, which references vesting via `vesting_terms_id`) or the forward-looking shape (v2, which references a v2 vesting template via `vesting_template_id` and carries the per-grant `vesting_start_date`) during the transition window.",
  "x-ocf-stability": "alpha",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Identifier for this transaction."
    },
    "comments": {
      "type": "array",
      "description": "Unstructured text comments related to and stored for the object.",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json",
      "description": "Date on which the issuance transaction occurred. Distinct from the vesting commencement date, which is carried separately as `vesting_start_date`."
    },
    "security_id": {
      "type": "string",
      "description": "Identifier for the security created by this issuance. Other transactions (vesting event, exercise, cancellation, etc.) reference this id."
    },
    "custom_id": {
      "type": "string",
      "description": "Human-readable identifier for the security (e.g. 'CN-1')."
    },
    "stakeholder_id": {
      "type": "string",
      "description": "Identifier of the stakeholder holding legal title to the security."
    },
    "board_approval_date": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json",
      "description": "Date of board approval for the security, when applicable."
    },
    "stockholder_approval_date": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json",
      "description": "Date of stockholder approval for the security, when applicable."
    },
    "consideration_text": {
      "type": "string",
      "description": "Unstructured text description of consideration provided in exchange for the issuance."
    },
    "security_law_exemptions": {
      "type": "array",
      "description": "Security law exemptions (and applicable jurisdictions) for this security.",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/SecurityExemption.schema.json"
      }
    },
    "stock_plan_id": {
      "type": "string",
      "description": "If the security was issued from a stock plan, the plan's id. Plan-less options are valid and omit this field."
    },
    "stock_class_id": {
      "type": "string",
      "description": "The stock class the security exercises/settles into. Important for plan-less options and plans that support multiple share classes."
    },
    "compensation_type": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/CompensationType.schema.json",
      "description": "The kind of equity compensation. Determines which type-specific fields are required."
    },
    "option_grant_type": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/OptionType.schema.json",
      "description": "If the security is an option, what kind. Retained from v1 for compatibility; in the new model this has been incorporated into CompensationType."
    },
    "quantity": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json",
      "description": "Number of shares subject to this security."
    },
    "exercise_price": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json",
      "description": "Required for option compensation types. The price per share at which the option can be exercised."
    },
    "base_price": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json",
      "description": "Required for stock appreciation right compensation types (CSAR, SSAR). The base price used to calculate appreciation."
    },
    "early_exercisable": {
      "type": "boolean",
      "description": "If true, the security is exercisable prior to completion of vesting; the schedule then governs a right-of-repurchase lapse rather than the right-to-exercise."
    },
    "vesting_start_date": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json",
      "description": "The per-grant vesting commencement date — the anchor every statement of the referenced template grids from. Required whenever `vesting_template_id` is present and always supplied with the grant: when the real commencement date is not yet known (a contingent start), a far-future placeholder date (e.g. 9999-12-31) is supplied rather than omitting the field or modeling the start as an event. Lives on the issuance, not the template, because the template is reusable across grants."
    },
    "vesting_template_id": {
      "type": "string",
      "description": "Identifier of the v2 vesting template the security is subject to. If neither `vesting_template_id` nor `vestings` is present, the security is fully vested at issuance. The template's statements anchor to `vesting_start_date` (carried on this same transaction); a statement may additionally carry an `event_condition` whose firing is recorded by a v2 vesting-event transaction."
    },
    "vestings": {
      "title": "Equity Compensation Issuance - Vestings Array",
      "type": "array",
      "description": "Optional materialized projection of exact vesting dates and amounts. A grant may be described by the declarative template (`vesting_template_id`), by this imperative event list, or by both; when both are present an external tool confirms they agree.",
      "minItems": 1,
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json"
      }
    },
    "expiration_date": {
      "description": "Expiration date of the security, or null if it does not expire.",
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
      "type": "array",
      "description": "Exercise periods applicable after a termination, by reason.",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TerminationWindow.schema.json"
      }
    }
  },
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "custom_id",
    "stakeholder_id",
    "compensation_type",
    "quantity",
    "expiration_date",
    "security_law_exemptions",
    "termination_exercise_windows"
  ],
  "dependencies": {
    "vesting_template_id": [
      "vesting_start_date"
    ]
  },
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/issuance/versions.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: discriminator (issuance-time) — compensation_type fans this one OCF
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
  security_law_exemptions:
    kind: computed                 # federal exemption classified onto stakeholder-level Compliance
    target: "#/$defs/Compliance/properties/federalExemption"
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
    note: >-
      SAR has no Carta security object, so OCF's explicit vesting events have no home for the
      Sar variant — the template ref still maps via vesting_template_id →
      SarIssuanceTransaction.vestingScheduleTemplateId. Option/RSU keep both.

  vesting_start_date:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/vestingStartDate"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/vestingStartDate"
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
        routed_to: { RSU: Rsu, CSAR: Sar, SSAR: Sar } # not dropped — handled by these variants (verified round-trip)
      option_grant_type:
        kind: enum-remap
        target: "#/$defs/OptionGrant/properties/stockOptionType"
        values: { NSO: NSO, ISO: ISO, INTL: STOCK_OPTION_TYPE_INTL }
      exercise_price:               { kind: rename, target: "#/$defs/OptionIssuanceTransaction/properties/exercisePrice" }
      base_price:                   { kind: unmappable, target: null, reason: no-equivalent }
      early_exercisable:            { kind: rename, target: "#/$defs/OptionGrant/properties/earlyExercisable" }
      expiration_date:              { kind: rename, target: "#/$defs/OptionIssuanceTransaction/properties/expirationDatetime" }
      termination_exercise_windows: { kind: select, target: "#/$defs/OptionGrant/properties/exercisePeriods", policy: first_termination_window }

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

 ```

## Notes / open questions

- **Polymorphic by `compensation_type`.** OCF carries option grants, RSUs, and SARs in this
  one transaction; Carta splits them into dedicated families. This mapping uses the
  `discriminator:` convention (see [`docs/polymorphic-transaction-routing.md`](../../../docs/polymorphic-transaction-routing.md)):
  `OPTION*` → `OptionIssuanceTransaction` + `OptionGrant`; `RSU` → `RsuIssuanceTransaction` +
  `RestrictedStockUnit`; `CSAR`/`SSAR` → `SarIssuanceTransaction`. The three `when:` sets
  partition all six `CompensationType` values (`exhaustive: true`).
- **`shared:` fields use per-variant target maps where the home diverges.** Transaction-level
  fields (`date`/`stock_plan_id`/`stock_class_id`/`quantity`/`vesting_template_id`) each land on the
  resolved family's `*IssuanceTransaction`; security-level identity fields
  (`security_id`/`custom_id`/`stakeholder_id`/`board_approval_date`/`vestings`) land on `OptionGrant`
  vs `RestrictedStockUnit`. Each such field is a `target: { Option/Rsu/Sar: pointer|null }` map; the
  validator enforces the keys stay in sync with the variant set (every variant present, none
  unknown). The remaining `shared:` fields are uniform (all `unmappable`).
- **Per-variant divergence.** `exercise_price` is Option-only; OCF `base_price` → Carta
  `SarIssuanceTransaction.exercisePrice` (SAR-only); `early_exercisable` and
  `termination_exercise_windows` are Option-only; the Option mapping explicitly selects the
  first window under `first_termination_window`; RSUs settle (no exercise price, no expiration).
  `option_grant_type` (OCF-deprecated) and `compensation_type` both target `stockOptionType`;
  precedence is importer logic.
- **SAR has no Carta security object.** Carta models SARs with only a `SarIssuanceTransaction`
  (no `SarGrant`/security `$def`), so the five security-level identity fields are `null` in the
  `Sar` column of their target maps — genuinely no home, shown as `✗ unmappable` for SAR in the
  report rather than borrowing an Option pointer.
- **Lossy by Carta's design.** CSAR vs SSAR collapse to one `SarIssuanceTransaction` (no
  settlement-mode field). `OPTION` (unspecified) → `OTHER`.
- **`vesting_start_date` → Carta `vestingStartDate`.** The v2 model splits the old
  `vesting_terms_id` into `vesting_template_id` (the reusable template ref, mapped above like the
  old field) plus this per-grant anchor. It lands on the resolved family's security object
  (`OptionGrant` / `RestrictedStockUnit`), mirroring `vestings`; SAR has no security object so `Sar: null`.
