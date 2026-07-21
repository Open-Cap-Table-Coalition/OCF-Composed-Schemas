---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockLegendTemplate.schema.json
ocf_object_type: STOCK_LEGEND_TEMPLATE
ocf_title: Object - Stock Legend Template
ocf_kind: object
required_fields:
  - name
  - text
  - id
  - object_type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stock Legend Template → Carta

> Object describing a stock legend template

## OCF schema

Source: [`StockLegendTemplate.schema.json`](./StockLegendTemplate.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockLegendTemplate.schema.json",
  "title": "Object - Stock Legend Template",
  "description": "Object describing a stock legend template",
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
      "const": "STOCK_LEGEND_TEMPLATE"
    },
    "name": {
      "description": "Name for the stock legend template",
      "type": "string"
    },
    "text": {
      "description": "The full text of the stock legend",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "name",
    "text",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/StockLegendTemplate.schema.json"
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
      STOCK_LEGEND_TEMPLATE: null
  name:
    kind: unmappable
    target: null
    reason: no-equivalent
  text:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no stock-legend concept at all.** A case-insensitive search for `legend` across the authoritative pinned bundle (`target-schema/Carta.schema.json`), the per-`$def` index (`/tmp/carta-index.json`), and the enum dump (`/tmp/carta-enums.json`) returns **zero** hits. There is no `StockLegendTemplate`/`LegendTemplate` `$def`, no object that stores restrictive-legend text, and no `legendId`/`stockLegendId` foreign key anywhere. So OCF's whole `StockLegendTemplate` object — a reusable, per-issuer library entry holding the boilerplate restrictive-transfer text printed on certificates (e.g. the Rule 144 / "THE SECURITIES REPRESENTED BY THIS CERTIFICATE HAVE NOT BEEN REGISTERED…" legends) — has no Carta counterpart object, and therefore no destination for any of its fields. This is the all-unmappable shape of the `Issuer` precedent, where the named field has no Carta home.
- **How legends are wired in OCF (for context on what is being dropped).** `StockLegendTemplate` objects live in the cap table as standalone reusable records and are referenced *by id* from issuance transactions: `objects/transactions/issuance/StockIssuance.schema.json` carries a required `stock_legend_ids: string[]` ("List of stock legend ids that apply to this stock"). It is the only OCF schema that `$ref`s/points at this object's ids. Carta's `StockIssuance`/certificate analogues carry no equivalent legend-id array, so the *link* is dropped at the transaction level as well, not just the template body. The closest Carta pattern is reference-by-template-id for *vesting* (`vestingScheduleTemplateId` on certificates), but Carta exposes no parallel construct for legends, so there is nothing to model the template against even by analogy.
- Per-field justification (every field unmappable):
    - `name`: the human label of the template ("Name for the stock legend template"). Carta stores no legend template, so there is no object to carry its name. `no-equivalent`.
    - `text`: the full restrictive-legend body ("The full text of the stock legend") — the substantive payload of the object. This is the field a mapping would most want to preserve, but Carta has no field, on any object, that holds legend text (no `legendText`, `restrictiveLegend`, `securityLawExemption`, or free-text certificate-legend slot exists in the bundle). `no-equivalent`.
    - `id`, `comments`, `object_type`: boilerplate OCF object scaffolding (`ocf-internal`). `id` is OCF's own identifier and is also the join key targeted by `StockIssuance.stock_legend_ids`; Carta assigns server-side ids and exposes no legend object to assign them to. `object_type` is OCF's `const` discriminator (`STOCK_LEGEND_TEMPLATE`), which Carta does not need (it types positionally per endpoint), so its single enum value maps to `null`. `comments` has no Carta slot.
- Net effect: the entire OCF `StockLegendTemplate` object — and the `stock_legend_ids` links that point at it — is lost on conversion to Carta. If round-tripping or legend fidelity matters, this is a candidate for a Carta extension/side-car, since the data has no home in `v1alpha1 (2026-04-30)`.
</content>
</invoke>
