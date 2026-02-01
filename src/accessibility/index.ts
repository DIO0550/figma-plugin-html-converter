/**
 * アクセシビリティチェック機能のエントリーポイント
 */

// 型定義
export type {
  A11yIssueId,
  A11ySeverity,
  WcagCriterion,
  A11yCheckTarget,
  A11yIssueType,
  A11yElementInfo,
  A11yIssue,
  A11yFixCode,
  A11ySuggestion,
  ContrastResult,
  A11yAIAnalysis,
  WcagComplianceStatus,
  A11ySummary,
  A11yReport,
  A11yCheckerConfig,
  A11yRule,
  ParsedHtmlNode,
  FigmaNodeInfo,
  FigmaPaint,
  A11yCheckContext,
} from "./types";

// ファクトリ関数
export { createA11yIssueId } from "./types";

// 定数
export {
  WCAG_CONTRAST,
  TEXT_SIZE,
  VALID_ARIA_ROLES,
  LANDMARK_ELEMENTS,
  HEADING_ELEMENTS,
  WCAG_REFERENCE_URLS,
  ALL_A11Y_RULES,
  DEFAULT_A11Y_CONFIG,
} from "./constants";

// チェッカー
export { A11yChecker } from "./checker";
export { HtmlA11yChecker } from "./checker/html-checker";
export { FigmaA11yChecker } from "./checker/figma-checker";

// コントラスト計算
export {
  calculateRelativeLuminance,
  calculateContrastRatio,
  checkContrast,
} from "./contrast";

// AI分析
export { A11yAIAnalyzer } from "./ai-analysis";
export type { McpClientInterface } from "./ai-analysis";

// レポート
export { generateReport } from "./report";
export { generateSuggestions } from "./report";
