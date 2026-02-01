/**
 * アクセシビリティレポート生成
 */
import type {
  A11yIssue,
  A11yReport,
  A11ySummary,
  A11yAIAnalysis,
  WcagComplianceStatus,
  WcagCriterion,
} from "../types";
import { generateSuggestions } from "./suggestion-generator";

/**
 * 問題リストからアクセシビリティレポートを生成する
 */
export function generateReport(
  issues: readonly A11yIssue[],
  aiAnalysis?: A11yAIAnalysis,
): A11yReport {
  const suggestions = generateSuggestions(issues);
  const summary = calculateSummary(issues);

  return {
    issues,
    suggestions,
    summary,
    timestamp: new Date().toISOString(),
    aiAnalysis,
  };
}

function calculateSummary(issues: readonly A11yIssue[]): A11ySummary {
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

  const wcagCompliance = calculateWcagCompliance(issues);

  return {
    totalIssues: issues.length,
    errorCount,
    warningCount,
    infoCount,
    wcagCompliance,
  };
}

function calculateWcagCompliance(
  issues: readonly A11yIssue[],
): WcagComplianceStatus {
  const criteriaToCheck: WcagCriterion[] = ["1.1.1", "1.4.3", "1.4.4", "4.1.2"];

  // error重要度の問題のみがWCAG準拠を不合格にする
  const errorIssues = issues.filter((i) => i.severity === "error");

  const compliance: Record<string, boolean> = {};
  for (const criterion of criteriaToCheck) {
    const hasErrors = errorIssues.some((i) => i.wcagCriterion === criterion);
    compliance[criterion] = !hasErrors;
  }

  const overallAA = criteriaToCheck.every((c) => compliance[c]);

  return {
    "1.1.1": compliance["1.1.1"],
    "1.4.3": compliance["1.4.3"],
    "1.4.4": compliance["1.4.4"],
    "4.1.2": compliance["4.1.2"],
    overallAA,
  };
}
