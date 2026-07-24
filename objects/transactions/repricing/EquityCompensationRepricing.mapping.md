---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/repricing/EquityCompensationRepricing.schema.json
ocf_object_type: TX_EQUITY_COMPENSATION_REPRICING
ocf_title: Object - Equity Compensation Repricing Transaction
ocf_kind: object
required_fields:
  - new_exercise_price
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Equity Compensation Repricing Transaction → Carta

> Object describing an event that adjusts the exercise price of existing equity compensation, typically done when the current share price falls significantly below the set exercise price, rendering an option underwater.

## OCF schema

Source: [`EquityCompensationRepricing.schema.json`](./EquityCompensationRepricing.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/repricing/EquityCompensationRepricing.schema.json",
  "title": "Object - Equity Compensation Repricing Transaction",
  "description": "Object describing an event that adjusts the exercise price of existing equity compensation, typically done when the current share price falls significantly below the set exercise price, rendering an option underwater.",
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
      "const": "TX_EQUITY_COMPENSATION_REPRICING"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "new_exercise_price": {
      "description": "What is the exercise price of the option after the repricing?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "new_exercise_price",
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/repricing/EquityCompensationRepricing.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). This repricing carries only
# security_id and NO discriminator, so the price-bearing family
# (Option/Sar/Rsu) is undecidable from the record alone: it is resolved by
# joining security_id back to the EquityCompensationIssuance and reading that
# issuance's compensation_type. See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/EquityCompensationIssuance.mapping.md
      on_property: compensation_type
  exhaustive: true

# shared: every source property. Carta has no repricing transaction; a repricing
# is a price *mutation*, so the only mappable field (new_exercise_price) lands on
# the resolved family's static strike via a per-variant target map. RSUs are
# priceless, so the field has no home in that variant (null).
shared:
  id:          { kind: unmappable, target: null, reason: ocf-internal }
  comments:    { kind: unmappable, target: null, reason: no-equivalent }
  object_type: { kind: unmappable, target: null, reason: ocf-internal }
  security_id: { kind: unmappable, target: null, reason: ocf-internal }
  date:        { kind: unmappable, target: null, reason: no-equivalent }
  new_exercise_price:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/exercisePrice"
      Sar:    "#/$defs/SarIssuanceTransaction/properties/exercisePrice"
      Rsu:    null

variants:

  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets:
      - "#/$defs/OptionGrant"
    fields: {}

  Sar:
    when: [CSAR, SSAR]
    primary_targets:
      - "#/$defs/SarIssuanceTransaction"
    fields: {}

  Rsu:
    when: [RSU]
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&title=%5BMapping+question%5D+EquityCompensationRepricing) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&title=%5BMapping+question%5D+EquityCompensationRepricing%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&title=%5BMapping+question%5D+EquityCompensationRepricing%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&title=%5BMapping+question%5D+EquityCompensationRepricing%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&title=%5BMapping+question%5D+EquityCompensationRepricing%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&title=%5BMapping+question%5D+EquityCompensationRepricing%3A+security_id&property_path=security_id) |
| `new_exercise_price` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepricing%2FEquityCompensationRepricing.mapping.md&title=%5BMapping+question%5D+EquityCompensationRepricing%3A+new_exercise_price&property_path=new_exercise_price) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Join-dependent (downstream).** One OCF `EquityCompensationRepricing` carries only
  `security_id` and no discriminator, so the instrument family is undecidable from the
  record alone. An importer must first resolve `compensation_type` from the joined
  `EquityCompensationIssuance` (the family fixed at issuance) and only then knows which
  price field the new strike applies to — the two-pass requirement
  (docs/polymorphic-transaction-routing.md §2.2/§4.3).
- **Carta has no repricing transaction.** A repricing is a *mutation* of the existing
  strike, not a discrete Carta event. So `new_exercise_price` does not land on a
  repricing tx; it lands on the price-bearing field of the resolved family:
  `OptionGrant.exercisePrice` for the option family and
  `SarIssuanceTransaction.exercisePrice` for the SAR family, via the per-variant target
  map.
- **RSUs are priceless.** RSUs have no exercise price, so there is no field for the new
  strike to land on; `new_exercise_price` is `null` in the `Rsu` variant and that
  variant has `primary_targets: null` — the whole family is unmappable here.
- **`date` has no home.** Because Carta records the strike as a single static value with
  no repricing event, there is no Carta repricing transaction and therefore no
  event-date slot to carry the *when* of the price change; `date` is `no-equivalent`.
- **`security_id`** is the join key (`route_by_property.lookup_by.key`); it routes the family and
  is not itself a stored Carta field. **`id`/`object_type`** are OCF object scaffolding
  (`ocf-internal`) and **`comments`** has no Carta slot (`no-equivalent`).
