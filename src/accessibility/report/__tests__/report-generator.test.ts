import { test, expect } from "vitest";
import { generateReport } from "../report-generator";
import type { A11yIssue } from "../../types";
import { createA11yIssueId } from "../../types";

function createIssue(
  type: A11yIssue["type"],
  severity: A11yIssue["severity"],
  wcag: A11yIssue["wcagCriterion"],
): A11yIssue {
  return {
    id: createA11yIssueId(`test-${type}`),
    type,
    severity,
    wcagCriterion: wcag,
    target: "html",
    element: { tagName: "div", xpath: "/div" },
    message: "テスト問題",
  };
}

// =============================================================================
// レポート生成
// =============================================================================

test("問題リストからレポートを生成する", () => {
  const issues: A11yIssue[] = [
    createIssue("missing-alt-text", "error", "1.1.1"),
    createIssue("low-contrast", "error", "1.4.3"),
    createIssue("insufficient-text-size", "warning", "1.4.4"),
  ];
  const report = generateReport(issues);

  expect(report.issues).toHaveLength(3);
  expect(report.suggestions).toHaveLength(3);
  expect(report.summary.totalIssues).toBe(3);
  expect(report.summary.errorCount).toBe(2);
  expect(report.summary.warningCount).toBe(1);
  expect(report.summary.infoCount).toBe(0);
  expect(report.timestamp).toBeTruthy();
});

test("WCAG準拠状態を正しく計算する", () => {
  const issues: A11yIssue[] = [
    createIssue("missing-alt-text", "error", "1.1.1"),
  ];
  const report = generateReport(issues);

  expect(report.summary.wcagCompliance["1.1.1"]).toBe(false);
  expect(report.summary.wcagCompliance["1.4.3"]).toBe(true);
  expect(report.summary.wcagCompliance["1.4.4"]).toBe(true);
  expect(report.summary.wcagCompliance["4.1.2"]).toBe(true);
  expect(report.summary.wcagCompliance.overallAA).toBe(false);
});

test("問題がない場合はすべてのWCAG基準が準拠", () => {
  const report = generateReport([]);

  expect(report.summary.totalIssues).toBe(0);
  expect(report.summary.wcagCompliance.overallAA).toBe(true);
  expect(report.summary.wcagCompliance["1.1.1"]).toBe(true);
});

test("AI分析結果を含めることができる", () => {
  const issues: A11yIssue[] = [];
  const aiAnalysis = {
    additionalIssues: [],
    enhancedSuggestions: [],
    confidence: 0.9,
  };
  const report = generateReport(issues, aiAnalysis);

  expect(report.aiAnalysis).toBeDefined();
  expect(report.aiAnalysis?.confidence).toBe(0.9);
});

test("error重要度の問題のみがWCAG準拠を不合格にする", () => {
  const issues: A11yIssue[] = [
    createIssue("insufficient-text-size", "warning", "1.4.4"),
    createIssue("missing-landmark", "info", "1.1.1"),
  ];
  const report = generateReport(issues);

  // warningやinfoはWCAG準拠判定に影響しない
  expect(report.summary.wcagCompliance.overallAA).toBe(true);
});
