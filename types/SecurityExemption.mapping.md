---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/SecurityExemption.schema.json
ocf_object_type: null
ocf_title: Type - Security Exemption
ocf_kind: type
required_fields:
  - description
  - jurisdiction
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Security Exemption → TBD

> Type representation of a securities issuance exemption that includes an unstructured description and a country code for ease of processing and analysis

## OCF schema

Source: [`SecurityExemption.schema.json`](./SecurityExemption.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/SecurityExemption.schema.json",
  "title": "Type - Security Exemption",
  "description": "Type representation of a securities issuance exemption that includes an unstructured description and a country code for ease of processing and analysis",
  "type": "object",
  "properties": {
    "description": {
      "description": "Description of an applicable security law exemption governing the issuance",
      "type": "string"
    },
    "jurisdiction": {
      "description": "Jurisdiction of the applicable law. This is a free-text field as there is no known enumeration of all global legal jurisdictions, but please try to use ISO 3166-1 alpha-2, if appropriate. Otherwise, we rely on implementers to choose an appropriate value here.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "description",
    "jurisdiction"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/SecurityExemption.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  description:
    kind: TODO
    target: TODO
  jurisdiction:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
