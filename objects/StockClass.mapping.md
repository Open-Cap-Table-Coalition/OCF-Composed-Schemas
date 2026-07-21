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
target_version: v1alpha1 (2026-04-30)
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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

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
      STOCK_CLASS: null
  name:
    kind: rename
    target: "#/$defs/ShareClass/properties/name"
  class_type:
    kind: enum-remap
    target: "#/$defs/ShareClass/properties/type"
    values:
      COMMON: COMMON
      PREFERRED: PREFERRED
  default_id_prefix:
    kind: rename
    target: "#/$defs/ShareClass/properties/prefix"
  initial_shares_authorized:
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
    target: "#/$defs/ShareClass/properties/seniority"
  conversion_rights:
    kind: split
    target:
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio"
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionPrice"
    policy: first_ratio_conversion_right
  liquidation_preference_multiple:
    kind: rename
    target: "#/$defs/ShareClassRightsAndPreferences/properties/multiplier"
  participation_cap_multiple:
    kind: rename
    target: "#/$defs/ShareClassRightsAndPreferences/properties/participationCap"
```

## Notes / open questions

- `class_type` → `type`: clean 1:1 enum-remap. Both sides use the same two values (`COMMON`, `PREFERRED`).
- `default_id_prefix` → `prefix`: OCF allows a trailing dash (e.g. `CS-` when certificate IDs look like `CS-1`); Carta's `prefix` is constrained to numbers and letters only (e.g. `CS`). Any trailing dash should be stripped on transfer.
- `initial_shares_authorized` → `authorizedShareCount`: OCF's `oneOf [AuthorizedShares enum, Numeric]` maps cleanly for the Numeric branch — Carta's field is `$ref: Decimal`. The sentinel enum values (`NOT APPLICABLE`, `UNLIMITED`) have no Carta target. As on `Issuer`, Carta's field carries no description and doesn't document temporal semantics, so we can't tell from the schema whether it reflects initial vs current authorization.
- `par_value` → `parValue`: clean rename, OCF `Monetary` → Carta `Money` (both carry an amount + currency).
- `seniority` → `seniority`: `kind: computed` because the value is inverted and rebased. OCF: higher number means higher priority (and decimals are allowed for inserting between classes, see the OCF description). Carta: integer where `1` is highest priority and increasing means *lower* priority. Producing the Carta value requires sorting all of an issuer's stock classes by OCF `seniority` descending and assigning Carta seniority `1, 2, 3, ...` in that order — i.e., per-record context is insufficient. The transformation is well-defined but requires the full set of stock classes for the issuer.
- `price_per_share` → `preferredShareClassDetails.rightsAndPreferences.originalIssuePrice`: only meaningful for preferred classes. Common stock classes typically don't carry this in OCF, and there is no Carta target on the `ShareClass` for a common's original price.
- `liquidation_preference_multiple` → `preferredShareClassDetails.rightsAndPreferences.multiplier`: preferred-only. Carta's field is `Decimal` (the OCF field is `Numeric`); both are numeric so this is a straightforward rename.
- `participation_cap_multiple` → `preferredShareClassDetails.rightsAndPreferences.participationCap`: preferred-only. Same numeric correspondence as `multiplier`. Note that Carta also carries a separate `participating` boolean (whether the preferred is participating at all) which OCF does not represent explicitly; in OCF, "is participating" is implied by `participation_cap_multiple` being set.
- `conversion_rights` → `rightsAndPreferences.conversionRatio` + `rightsAndPreferences.conversionPrice` (kind `split`, policy `first_ratio_conversion_right`): OCF carries an *array* of structured conversion rights, while Carta has only one ratio and one price. The explicit policy selects the first applicable ratio right; the ratio quotient is then reduced to Carta's Decimal and the monetary price maps to Money. Additional rights and unsupported mechanism details are dropped.
- `board_approval_date` / `stockholder_approval_date`: unmappable. Carta has a `BoardApproval` *enum* (`BOARD_APPROVAL_APPROVED` / `BOARD_APPROVAL_NOT_APPROVED`) but no field that carries the approval *date*. There is no Carta concept for stockholder approval at all on `ShareClass`.
- `votes_per_share`: unmappable. Carta's `ShareClass` has no voting-rights field. (Carta's `ShareClassType` description does mention "PREFERRED: with no voting rights" — implying a categorical assumption rather than a per-class field — but there is no slot to express anything other than the type-level default.)
- `id`, `comments`, `object_type`: unmappable OCF object scaffolding (same pattern as `Document`, `Issuer`, `Stakeholder`).
- Carta-side `ShareClass` fields with no OCF source: `issuerId` (back-reference; OCF has one issuer per file), `pariPassu` (OCF expresses pari-passu by giving multiple classes the same `seniority` number rather than as a field), `preferredShareClassDetails.dividendDetails` (OCF `StockClass` carries no dividend information), `preferredShareClassDetails.rightsAndPreferences.participating` (in OCF, "participating" is implied by whether `participation_cap_multiple` is set; not an explicit field).
