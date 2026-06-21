# Mapping policy: where a mapping lives, and the three buckets for types

This note records *how to decide* an OCF → target mapping — in particular, when a
mapping belongs on an OCF **type** versus on the **objects** that use it. It is the
methodology behind the `.mapping.md` files; the mechanical rules the validator
enforces are documented separately in [`mapping-validation.md`](./mapping-validation.md).

The worked vocabulary below is OCF → Carta (the only pinned target today), but the
decision procedure is target-agnostic.

## Objects/transactions vs types

OCF schemas come in two shapes, and they are mapped differently:

- **Objects and transactions** (`ocf_kind: object`) — e.g. `Issuer`, `StockClass`,
  `StockIssuance`. These map **at the object level**: each property maps directly to
  the corresponding field of the analogous target object (or is `unmappable`). The
  three-bucket test below does **not** apply to them.
- **Types** (`ocf_kind: type`) — e.g. `Email`, `Monetary`, `Address`, the
  `conversion_mechanisms/*`. A reusable OCF type can be nested inside many different
  objects, so "what does it map to?" is not always well-posed. Use the three-bucket
  test.

## The three-bucket test (for OCF types)

Ask: **does the target model this concept as its own reusable type/structure?**

### Bucket 1 — type-to-type (the target has an analogous type)

The target has a single `$def`/structure that corresponds to the whole OCF type. Map
each OCF field to that type's corresponding field; mark only the genuinely-absent
fields `unmappable`. Anti-laziness applies fully here — hunt for the real target.

| OCF type | Carta target |
| --- | --- |
| `Monetary` | `Money` (`amount`, `currencyCode`) |
| `Numeric` | `Decimal` |
| `Date` | `Iso8601CompleteCalendarDate` |
| `CurrencyCode` | `Iso4217CurrencyAlphaCode` |
| `CountryCode` | `Iso3166Set1Alpha3Code` (note: alpha-2 → alpha-3) |
| `ContactInfo` / `ContactInfoWithoutName` | `PointOfContact` |
| `Address` | `StakeholderAddress` (only `country` survives) |

A **single clear home counts as bucket 1 even if the target inlines it** (no reusable
type), as long as exactly one target object is unambiguously the destination:

| OCF type | Single clear home |
| --- | --- |
| `InterestRate.rate` | `ConvertibleNote.interestRate` |
| a conversion ratio | `ShareClassRightsAndPreferences.conversionRatio` |
| `SecurityExemption.description` | `Compliance.federalExemption` |
| `TerminationWindow` | `ExercisePeriods` |

> Over-applying bucket 2 to a structured type that has a clear home is the
> **lazy-unmappable defect** — the thing this policy most wants to prevent.

### Bucket 2 — inlined-per-object (no single home)

The target has **no** analogous type, *and* inlines the concept as bare scalars across
**multiple unrelated** objects, so the real destination depends on which OCF object
nested the type. There is **no well-posed single type-level target**.

Mark **every** field `unmappable` / `reason: no-equivalent`, and in the Notes:
(a) state the target has no reusable `<Type>` type, (b) list the OCF objects that
`$ref` this type, (c) say where each is actually routed at the **object** level (or
that it is dropped). **Never invent a "representative" inline target.**

| OCF type | Why bucket 2 | Object-level routing |
| --- | --- | --- |
| `Email` | inlined as `Stakeholder.email`, `PointOfContact.userEmail` | `Issuer.email` dropped; `ContactInfo.emails` → `PointOfContact.userEmail` |
| `Name` | inlined as `fullName` on 3+ objects | `Stakeholder.name` → `Stakeholder.fullName`; `ContactInfo.name` → `PointOfContact.userFullName` |
| `ObjectReference` | every `*Id` is a bare string | resolved per consuming object |

The discriminator vs bucket 1 is **cardinality of homes**: one unambiguous home → bucket 1;
two-or-more unrelated homes → bucket 2.

### Bucket 3 — absent (the target lacks the concept)

The target does not model the concept at all → every field `unmappable` /
`reason: no-equivalent`. Examples: `Phone`, `Md5`, `TaxID` (Carta has no phone,
checksum, or tax-id structure).

## Consistency rule

Two OCF types that represent the **same concept** must map to the **same** target type.
`ContactInfo` and `ContactInfoWithoutName` both map to `PointOfContact`
(`emails` → `userEmail`, `name` → `userFullName`, `phone_numbers` → `unmappable`).

## How this interacts with `reason:`

Once a field is `unmappable`, pick the most accurate reason
(`no-equivalent` | `excluded-from-snapshot` | `out-of-scope` | `ocf-internal`):

- Bucket 2 and bucket 3 fields are `no-equivalent` (the target genuinely lacks the
  concept / a single home).
- OCF scaffolding (`id`, `object_type`, `comments`) is always `ocf-internal`.
- A target that exists but resolves to `true` in the pinned snapshot is
  `excluded-from-snapshot`, not `no-equivalent`.
