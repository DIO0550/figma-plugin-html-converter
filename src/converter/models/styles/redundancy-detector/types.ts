export type RedundancyType =
  | "duplicate-property"
  | "default-value"
  | "shorthand-opportunity";

export type RedundancySeverity = "low" | "medium" | "high";

interface BaseRedundancyIssue {
  severity: RedundancySeverity;
  property: string;
  description: string;
  suggestedValue?: string;
}

export interface DuplicatePropertyIssue extends BaseRedundancyIssue {
  type: "duplicate-property";
  currentValue: string;
}

export interface DefaultValueIssue extends BaseRedundancyIssue {
  type: "default-value";
  currentValue: string;
}

export interface ShorthandOpportunityIssue extends BaseRedundancyIssue {
  type: "shorthand-opportunity";
  currentLonghandProperties: readonly string[];
}

export type RedundancyIssue =
  | DuplicatePropertyIssue
  | DefaultValueIssue
  | ShorthandOpportunityIssue;
