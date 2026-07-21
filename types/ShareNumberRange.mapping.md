---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ShareNumberRange.schema.json
ocf_object_type: null
ocf_title: Type - Share Number Range
ocf_kind: type
required_fields:
  - starting_share_number
  - ending_share_number
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Share Number Range → Carta

> Type representation of a range of share numbers associated with an event (such as the share numbers associated with an issuance) - for use where shares are not fungible and need unique identifiers *per share*

## OCF schema

Source: [`ShareNumberRange.schema.json`](./ShareNumberRange.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ShareNumberRange.schema.json",
  "title": "Type - Share Number Range",
  "description": "Type representation of a range of share numbers associated with an event (such as the share numbers associated with an issuance) - for use where shares are not fungible and need unique identifiers *per share*",
  "type": "object",
  "properties": {
    "starting_share_number": {
      "description": "The starting share number of a range of shares impacted by a particular event (**INCLUSIVE** and assuming **share counts start at 1**)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "ending_share_number": {
      "description": "The ending share number of a range of shares impacted by a particular event (**INCLUSIVE**)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "starting_share_number",
    "ending_share_number"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/ShareNumberRange.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  starting_share_number:
    kind: unmappable
    target: null
    reason: no-equivalent
  ending_share_number:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- Carta's `Certificate` carries a quantity but not numbered share-range bounds (no `startingShareNumber`/`endingShareNumber` fields anywhere in the bundle). OCF uses `ShareNumberRange` primarily on stock issuance transactions to describe which specific share numbers were issued on a certificate; that level of granularity is not represented in Carta.
