---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TaxID.schema.json
ocf_object_type: null
ocf_title: Type - Tax Identifier
ocf_kind: type
required_fields:
  - tax_id
  - country
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Tax Identifier → Carta

> Type representation of a government identifier for tax purposes (e.g. EIN) and corresponding country code (ISO-3166)

## OCF schema

Source: [`TaxID.schema.json`](./TaxID.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TaxID.schema.json",
  "title": "Type - Tax Identifier",
  "description": "Type representation of a government identifier for tax purposes (e.g. EIN) and corresponding country code (ISO-3166)",
  "type": "object",
  "properties": {
    "tax_id": {
      "description": "Tax identifier as string",
      "type": "string"
    },
    "country": {
      "description": "Issuing country code (ISO 3166-1 alpha-2) for the tax identifier",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountryCode.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "tax_id",
    "country"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/TaxID.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 2/2

fields:
  tax_id:
    kind: unmappable
    target: null
  country:
    kind: unmappable
    target: null
```

## Notes / open questions

- Carta has no tax-identifier fields anywhere in the bundled schema. The closest tax-related concepts (`OptionExerciseTaxWithholdingLineItem`, `Jurisdiction.country`) are about tax *withholding* on transactions, not stakeholder/issuer tax IDs. Both OCF Issuer and Stakeholder consequently mark their `tax_ids` arrays as unmappable.
