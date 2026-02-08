export { Styles, type SizeValue, type BorderStyle } from "./styles";
export { RedundancyDetector } from "./redundancy-detector";
export type {
  RedundancyType,
  RedundancySeverity,
  RedundancyIssue,
} from "./redundancy-detector";
export { StyleAnalyzer } from "./style-analyzer";
export type { StyleAnalysisResult, TreeAnalysisResult } from "./style-analyzer";
export { StyleOptimizer } from "./style-optimizer";
export type {
  OptimizationMode,
  OptimizationProposal,
  OptimizationResult,
  StyleComparison,
  OptimizationSummary,
} from "./style-optimizer";
