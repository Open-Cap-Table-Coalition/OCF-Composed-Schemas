---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/EquityCompensationAcceptance.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Acceptance Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Equity Compensation Acceptance Transaction → Carta

> Object describing equity compensation acceptance transaction

## OCF schema

Source: [`EquityCompensationAcceptance.schema.json`](./EquityCompensationAcceptance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/EquityCompensationAcceptance.schema.json",
  "title": "Object - Equity Compensation Acceptance Transaction",
  "description": "Object describing equity compensation acceptance transaction",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/acceptance/Acceptance.schema.json"
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
        "TX_PLAN_SECURITY_ACCEPTANCE",
        "TX_EQUITY_COMPENSATION_ACCEPTANCE"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_ACCEPTANCE` will be deprecated in v2.0.0"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/acceptance/EquityCompensationAcceptance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). Acceptance is NOT a Carta transaction;
# it sets a stakeholderAcceptanceDate on the security object. The record carries only
# security_id and NO discriminator, so the family (Option/Rsu/Sar) is undecidable from
# the record alone: it is resolved by joining security_id back to the
# EquityCompensationIssuance and reading that issuance's compensation_type.
# See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/EquityCompensationIssuance.mapping.md
      on_property: compensation_type
  exhaustive: true

# shared: every source property. `date` lands on the resolved family's security object
# (stakeholderAcceptanceDate), and `security_id` anchors the resolved Carta transaction
# item plus the security object where one exists. Both therefore carry per-variant target
# maps { Option/Rsu/Sar }. SAR has no first-class Carta security object or acceptance-date
# field, so its acceptance record is wholly unmappable in the June 22 bundle.
shared:
  id:          { kind: unmappable, target: null, reason: ocf-internal }
  comments:    { kind: unmappable, target: null, reason: no-equivalent }
  object_type: { kind: unmappable, target: null, reason: ocf-internal }
  security_id:
    kind: rename
    target:
      Option:
        - "#/$defs/OptionTransactionItem/properties/securityId"
        - "#/$defs/OptionGrant/properties/id"
        - "#/$defs/OptionGrant/properties/securityId"
      Rsu:
        - "#/$defs/RsuTransactionItem/properties/securityId"
        - "#/$defs/RestrictedStockUnit/properties/id"
        - "#/$defs/RestrictedStockUnit/properties/securityId"
      Sar:    null
  date:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/stakeholderAcceptanceDate"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/stakeholderAcceptanceDate"
      Sar:    null

variants:

  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets:
      - "#/$defs/OptionGrant"
    fields: {}

  Rsu:
    when: [RSU]
    primary_targets:
      - "#/$defs/RestrictedStockUnit"
    fields: {}

  Sar:
    when: [CSAR, SSAR]
    primary_targets: null
    fields: {}

 ```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&title=%5BMapping+question%5D+EquityCompensationAcceptance) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&title=%5BMapping+question%5D+EquityCompensationAcceptance%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&title=%5BMapping+question%5D+EquityCompensationAcceptance%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&title=%5BMapping+question%5D+EquityCompensationAcceptance%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&title=%5BMapping+question%5D+EquityCompensationAcceptance%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FEquityCompensationAcceptance.mapping.md&title=%5BMapping+question%5D+EquityCompensationAcceptance%3A+security_id&property_path=security_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Join-dependent (downstream), and acceptance is not a transaction.** Carta has no
  acceptance *transaction*: its transaction set covers issuance / exercise / cancellation
  but not acceptance. Instead Carta folds "the stakeholder accepted" into the security
  object itself as `stakeholderAcceptanceDate`. One OCF `EquityCompensationAcceptance`
  therefore does not fan out to a Carta tx — it sets a date on the resolved family's
  security object. The record carries no discriminator, only `security_id`, so the family
  is fixed at issuance and an importer must resolve `compensation_type` from the joined
  `EquityCompensationIssuance` first (the two-pass requirement, §2.2 of
  docs/polymorphic-transaction-routing.md).
- **`date` is the only acceptance-specific field.** It is the substantive payload — the date the
  holder accepted — and lands on the resolved family's security object via a per-variant
  target map: Option → `OptionGrant.stakeholderAcceptanceDate`, Rsu →
  `RestrictedStockUnit.stakeholderAcceptanceDate`. Both sides are calendar dates (OCF
  `Date`, Carta `Iso8601CompleteCalendarDate`), so there is no date-vs-datetime widening
  to flag.
- **Sar has no acceptance-date home (`primary_targets: null`).** CSAR/SSAR have no Carta
  security object with a `stakeholderAcceptanceDate` (there is no SAR grant object to set
  the field on), so the acceptance date is unmappable here and `date`'s `Sar` target is
  `null`; the SAR transaction-item identity is still retained through `security_id`.
- **`security_id`** is the join key (`route_by_property.lookup_by.key`) and is also preserved
  on the resolved Carta aggregate: `OptionTransactionItem.securityId` plus
  `OptionGrant.securityId` for options, `RsuTransactionItem.securityId` plus
  `RestrictedStockUnit.securityId` for RSUs. The SAR path has no retained Carta target because
  the SAR transaction-item and security definitions were removed.
- **`id`, `object_type`, `comments`: OCF scaffolding.** `id` is OCF's identifier for the
  acceptance transaction object; Carta has no acceptance object for it to become
  (`ocf-internal`). `object_type` is OCF's discriminator — neither enum member
  (`TX_EQUITY_COMPENSATION_ACCEPTANCE` nor the v2.0.0-deprecated alias
  `TX_PLAN_SECURITY_ACCEPTANCE`) corresponds to any Carta type (`ocf-internal`).
  `comments` is free-text OCF metadata with no slot on the Carta security (`no-equivalent`).
- The `when:` sets partition `CompensationType` exactly: Option `[OPTION, OPTION_NSO,
  OPTION_ISO]`, Rsu `[RSU]`, Sar `[CSAR, SSAR]`.
