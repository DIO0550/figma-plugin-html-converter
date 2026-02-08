import type { Styles } from "../styles";
import type {
  RedundancyIssue,
  RedundancyType,
} from "../redundancy-detector/types";

export type OptimizationMode = "auto" | "manual";

export interface OptimizationProposal {
  id: string;
  issue: RedundancyIssue;
  action: "remove" | "replace" | "merge" | "review";
  beforeValue: string;
  afterValue: string;
  confidence: number;
  source: "local" | "ai";
  /** 提案が属する要素のパス（例: "div > p > span"） */
  elementPath?: string;
}

export interface OptimizationResult {
  originalStyles: Styles;
  optimizedStyles: Styles;
  proposals: OptimizationProposal[];
  appliedCount: number;
  skippedCount: number;
  summary: OptimizationSummary;
}

export interface StyleComparison {
  added: Record<string, string>;
  removed: Record<string, string>;
  changed: Array<{ property: string; before: string; after: string }>;
  unchanged: Record<string, string>;
  reductionPercentage: number;
}

export interface OptimizationSummary {
  totalIssues: number;
  applied: number;
  skipped: number;
  reductionPercentage: number;
  byType: Record<RedundancyType, number>;
}
