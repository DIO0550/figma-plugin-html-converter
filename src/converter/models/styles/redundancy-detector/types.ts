export type RedundancyType =
  | "duplicate-property"
  | "default-value"
  | "shorthand-opportunity";

export type RedundancySeverity = "low" | "medium" | "high";

export interface RedundancyIssue {
  type: RedundancyType;
  severity: RedundancySeverity;
  property: string;
  currentValue: string;
  suggestedValue?: string;
  description: string;
}
