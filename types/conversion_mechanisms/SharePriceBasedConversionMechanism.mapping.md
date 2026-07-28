---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SharePriceBasedConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Share-Price-Based Conversion Mechanism
ocf_kind: type
required_fields:
  - type
  - description
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Share-Price-Based Conversion Mechanism → Carta

> Sets forth inputs and conversion mechanism based on price per share of a future round (with potential discounts)

## OCF schema

Source: [`SharePriceBasedConversionMechanism.schema.json`](./SharePriceBasedConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SharePriceBasedConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Share-Price-Based Conversion Mechanism",
  "description": "Sets forth inputs and conversion mechanism based on price per share of a future round (with potential discounts)",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "PPS_BASED_CONVERSION"
    },
    "description": {
      "type": "string",
      "description": "A description of the specifics of the conversion - e.g. The Holder is entitled, during the Exercise Period, to purchase from the Company such number of Preferred Shares as are equal to $100,000 divided by the Exercise Price. 'Exercise Price' shall mean 80% of the price per share paid by the investors in the next Qualified Financing."
    },
    "discount": {
      "type": "boolean",
      "description": "True if the conversion shares should be based on a discount off the price-per-share in the next elligible financing"
    },
    "discount_percentage": {
      "description": "If the conversion price is base on a percent discount off the price-per-share of the next elligible financing, what is the discount percent",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json"
    },
    "discount_amount": {
      "description": "If the resulting conversion shares is based on a fixed amount discount off the price-per-share of the next eilligible financing, what is the discount amount (in currency)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    }
  },
  "oneOf": [
    {
      "properties": {
        "discount": {
          "const": true
        }
      },
      "required": [
        "discount_percentage"
      ],
      "not": {
        "required": [
          "discount_amount"
        ]
      }
    },
    {
      "properties": {
        "discount": {
          "const": true
        }
      },
      "required": [
        "discount_amount"
      ],
      "not": {
        "required": [
          "discount_percentage"
        ]
      }
    },
    {
      "properties": {
        "discount": {
          "const": false
        }
      },
      "not": {
        "required": [
          "discount_percentage",
          "discount_amount"
        ]
      }
    }
  ],
  "required": [
    "type",
    "description",
    "type"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/SharePriceBasedConversionMechanism.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: ocf-internal
  description:
    kind: unmappable
    target: null
    reason: no-equivalent
  discount:
    kind: unmappable
    target: null
    reason: no-equivalent
  discount_percentage:
    kind: unmappable
    target: null
    reason: no-equivalent
  discount_amount:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+type&property_path=type) |
| `description` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+description&property_path=description) |
| `discount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+discount&property_path=discount) |
| `discount_percentage` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+discount_percentage&property_path=discount_percentage) |
| `discount_amount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+discount_amount&property_path=discount_amount) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- In the current OCF consumers this mechanism belongs to warrant conversion rights. Carta has no warrant term for a future-round price discount, so the discriminator, description, discount, and discount amounts are unmappable.
- Do not route this reusable type to convertible-note discount fields without a consumer-specific mapping that proves the source is convertible.
