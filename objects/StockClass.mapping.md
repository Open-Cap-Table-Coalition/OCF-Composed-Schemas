---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockClass.schema.json
ocf_object_type: STOCK_CLASS
ocf_title: Object - Stock Class
ocf_kind: object
required_fields:
  - name
  - class_type
  - default_id_prefix
  - initial_shares_authorized
  - votes_per_share
  - seniority
  - id
  - object_type
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Class → Carta

> Object describing a class of stock issued by the issuer

## OCF schema

Source: [`StockClass.schema.json`](./StockClass.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockClass.schema.json",
  "title": "Object - Stock Class",
  "description": "Object describing a class of stock issued by the issuer",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
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
      "const": "STOCK_CLASS"
    },
    "name": {
      "description": "Name for the stock type (e.g. Series A Preferred or Class A Common)",
      "type": "string"
    },
    "class_type": {
      "description": "The type of this stock class (e.g. Preferred or Common)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockClassType.schema.json"
    },
    "default_id_prefix": {
      "description": "Default prefix for certificate numbers in certificated shares (e.g. CS- in CS-1). If certificate IDs have a dash, the prefix should end in the dash like CS-",
      "type": "string"
    },
    "initial_shares_authorized": {
      "description": "The initial number of shares authorized for this stock class",
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/AuthorizedShares.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
        }
      ]
    },
    "board_approval_date": {
      "description": "Date on which the board approved the stock class",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "Date on which the stockholders approved the stock class",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "votes_per_share": {
      "description": "The number of votes each share of this stock class gets",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "par_value": {
      "description": "Per-share par value of this stock class",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "price_per_share": {
      "description": "Per-share price this stock class was issued for",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "seniority": {
      "description": "Seniority of the stock - determines repayment priority. Seniority is ordered by increasing number so that stock classes with a higher seniority have higher repayment priority. The following properties hold for all stock classes for a given company: \na) transitivity: stock classes are absolutely stackable by seniority and in increasing numerical order, \nb) non-uniqueness: multiple stock classes can have the same Seniority number and therefore have the same liquidation/repayment order.\nIn practice, stock classes with same seniority may be created at different points in time and (for example, an extension of an existing preferred financing round), and also a new stock class can be created with seniority between two existing stock classes, in which case it is assigned some decimal number between the numbers representing seniority of the respective classes.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "conversion_rights": {
      "title": "Stock Class - Stock Class Conversion Rights Array",
      "description": "List of stock class conversion rights possible for this stock class",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/StockClassConversionRight.schema.json"
      }
    },
    "liquidation_preference_multiple": {
      "description": "The liquidation preference per share for this stock class",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "participation_cap_multiple": {
      "description": "The participation cap multiple per share for this stock class",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "name",
    "class_type",
    "default_id_prefix",
    "initial_shares_authorized",
    "votes_per_share",
    "seniority",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/StockClass.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | sequential_transform | combine | enum-remap | union-map | computed | unmappable | TODO
# routing: class_type selects the common/preferred target shape. Both variants
# populate ShareClass; only PREFERRED instantiates the preferred-only wrapper
# whose rights-and-preferences children are populated below.
status: complete

route_by_property:
  on_property: class_type
  exhaustive: true

shared:
  id:
    kind: rename
    target: "#/$defs/ShareClass/properties/id"
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      STOCK_CLASS: null
  name:
    kind: rename
    target:
      - "#/$defs/ShareClass/properties/name"
      - "#/$defs/Certificate/properties/shareClassName"
      - "#/$defs/RestrictedStockAward/properties/shareClassName"
  class_type:
    kind: enum-remap
    target: "#/$defs/ShareClass/properties/type"
    values:
      COMMON: COMMON
      PREFERRED: PREFERRED
    note: >-
      Lossless 1:1 onto ShareClassType. This was `computed` only because it additionally
      derived the valuation read-model's boolean `common` flag (COMMON → true); that
      `ShareClassValuation` target was removed from the June 22 bundle, leaving a straight
      enum correspondence with no derivation.
  default_id_prefix:
    kind: rename
    target: "#/$defs/ShareClass/properties/prefix"
  initial_shares_authorized:
    kind: union-map
    cases:
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/AuthorizedShares.schema.json"
        mapping:
          kind: unmappable
          target: null
          reason: no-equivalent
          values:
            NOT APPLICABLE: null
            UNLIMITED: null
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
        mapping:
          kind: rename
          target: "#/$defs/ShareClass/properties/authorizedShareCount"
  board_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stockholder_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  votes_per_share:
    kind: unmappable
    target: null
    reason: no-equivalent
  par_value:
    kind: rename
    target: "#/$defs/ShareClass/properties/parValue"
  price_per_share:
    kind: rename
    target: "#/$defs/ShareClassRightsAndPreferences/properties/originalIssuePrice"
  seniority:
    kind: computed
    target:
      - "#/$defs/ShareClass/properties/seniority"
      - "#/$defs/ShareClass/properties/pariPassu"
    note: >-
      Rank classes as Carta seniority and derive pariPassu by comparing the OCF seniority
      value with the other classes in the issuer.
  conversion_rights:
    kind: sequential_transform
    steps:
      - kind: select
        policy: first_ratio_conversion_right
      - kind: apply_mapping
        mapping: types/conversion_rights/StockClassConversionRight.mapping.md
        targets:
          - "#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio"
          - "#/$defs/ShareClassRightsAndPreferences/properties/conversionPrice"
  liquidation_preference_multiple:
    kind: rename
    target: "#/$defs/ShareClassRightsAndPreferences/properties/multiplier"
  participation_cap_multiple:
    kind: rename
    target: "#/$defs/ShareClassRightsAndPreferences/properties/participationCap"

variants:
  Common:
    when: [COMMON]
    primary_targets:
      - "#/$defs/ShareClass"
    fields: {}

  Preferred:
    when: [PREFERRED]
    primary_targets:
      - "#/$defs/ShareClass"
      - "#/$defs/PreferredShareClassDetails"
    fields: {}
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+object_type&property_path=object_type) |
| `name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+name&property_path=name) |
| `class_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+class_type&property_path=class_type) |
| `default_id_prefix` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+default_id_prefix&property_path=default_id_prefix) |
| `initial_shares_authorized` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+initial_shares_authorized&property_path=initial_shares_authorized) |
| `board_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+board_approval_date&property_path=board_approval_date) |
| `stockholder_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+stockholder_approval_date&property_path=stockholder_approval_date) |
| `votes_per_share` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+votes_per_share&property_path=votes_per_share) |
| `par_value` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+par_value&property_path=par_value) |
| `price_per_share` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+price_per_share&property_path=price_per_share) |
| `seniority` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+seniority&property_path=seniority) |
| `conversion_rights` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+conversion_rights&property_path=conversion_rights) |
| `liquidation_preference_multiple` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+liquidation_preference_multiple&property_path=liquidation_preference_multiple) |
| `participation_cap_multiple` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockClass.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockClass.mapping.md&title=%5BMapping+question%5D+StockClass%3A+participation_cap_multiple&property_path=participation_cap_multiple) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- `class_type` routes `COMMON` to `ShareClass` and `PREFERRED` to `ShareClass` plus `PreferredShareClassDetails`. `id`, `name`, `par_value`, `default_id_prefix`, and the applicable class fields populate the corresponding Carta objects; `name` also populates denormalized security labels. The former `ShareClassValuation` fan-out was removed.
- `initial_shares_authorized` maps numeric values to `authorizedShareCount`; `NOT APPLICABLE` and `UNLIMITED` remain unmappable. `seniority` is computed into Carta's rank and `pariPassu`, requiring comparison across the issuer's classes.
- Preferred-only pricing, liquidation, participation, and the selected conversion right populate Carta rights-and-preferences leaves. The conversion-right array uses `first_ratio_conversion_right`; additional rights are not represented.
- Approval dates, votes, OCF scaffolding, and Carta-only issuer/dividend fields have no counterpart. June 22 makes `ShareClass.issuerId` required; it is an issuer-context value not present on the OCF StockClass record. Carta's `participating` flag is not explicit in OCF and is left unset.
