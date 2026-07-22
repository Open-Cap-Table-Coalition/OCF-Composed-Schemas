/**
 * Closed vocabulary of named reduction policies used by mapping transforms.
 *
 * Policy names are references, not free-form prose. The validator uses this
 * registry to reject misspellings and to ensure a policy is attached to the
 * kind of transform it actually describes.
 */

export type PolicyHostKind = "select" | "split" | "enum-remap";

export interface TransformPolicyDefinition {
  readonly hosts: readonly PolicyHostKind[];
  readonly description: string;
}

export const TRANSFORM_POLICIES: Readonly<Record<string, TransformPolicyDefinition>> = {
  legal_name: {
    hosts: ["select"],
    description: "select the stakeholder's legal name from the structured name value",
  },
  primary_then_first_email: {
    hosts: ["select"],
    description: "select the primary email when present, otherwise the first email in source order",
  },
  first_ratio_conversion_right: {
    hosts: ["select"],
    description: "select the first StockClassConversionRight with a ratio conversion mechanism",
  },
  first_relationship_in_order: {
    hosts: ["enum-remap"],
    description: "select the first stakeholder relationship in source order",
  },
  first_address_country: {
    hosts: ["select"],
    description: "select the country from the first available address",
  },
  first_applicable_interest_rate: {
    hosts: ["select"],
    description: "select the first applicable interest-rate value in source order",
  },
  first_stock_class_id: {
    hosts: ["select"],
    description: "select the first stock-class identifier in source order",
  },
  first_resulting_security_id: {
    hosts: ["select"],
    description: "select the first resulting-security identifier in source order",
  },
  first_trigger_with_economic_terms: {
    hosts: ["split"],
    description: "select the first conversion trigger carrying economic terms",
  },
  first_termination_window: {
    hosts: ["select"],
    description: "select the first termination window in source order",
  },
};

export function getTransformPolicy(name: string): TransformPolicyDefinition | undefined {
  return TRANSFORM_POLICIES[name];
}

export function registeredPolicyNames(): string[] {
  return Object.keys(TRANSFORM_POLICIES).sort();
}
