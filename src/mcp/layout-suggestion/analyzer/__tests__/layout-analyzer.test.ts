/**
 * LayoutAnalyzer のテスト
 */
import { test, expect } from "vitest";
import { LayoutAnalyzer } from "../layout-analyzer";
import type { LayoutAnalysisContext, LayoutAnalysisResult } from "../../types";
import { createNodePath } from "../../types";

test("LayoutAnalyzer.analyze - 空のHTML - 空の結果を返す", () => {
      const context: LayoutAnalysisContext = {
        html: "",
        nestingDepth: 0,
      };

      const result = LayoutAnalyzer.analyze(context);

  expect(result.problems).toEqual([]);
  expect(result.analyzedNodeCount).toBe(0);
  expect(result.analyzedAt).toBeInstanceOf(Date);
});

test("LayoutAnalyzer.analyze - 単純なdiv - 分析する", () => {
      const context: LayoutAnalysisContext = {
        html: '<div style="display: flex;"><span>Hello</span></div>',
        nestingDepth: 0,
      };

      const result = LayoutAnalyzer.analyze(context);

  expect(result.analyzedNodeCount).toBeGreaterThan(0);
  expect(result.analyzedAt).toBeInstanceOf(Date);
});

test("LayoutAnalyzer.analyze - Flexコンテナがない場合 - 問題を検出する", () => {
      const context: LayoutAnalysisContext = {
        html: "<div><span>Child 1</span><span>Child 2</span></div>",
        nestingDepth: 0,
      };

      const result = LayoutAnalyzer.analyze(context);

  const missingFlexProblems = result.problems.filter(
    (p) => p.type === "missing-flex-container",
  );
  expect(missingFlexProblems.length).toBeGreaterThan(0);
});

test("LayoutAnalyzer.analyze - Flexコンテナがある場合 - missing-flex-container問題を検出しない", () => {
      const context: LayoutAnalysisContext = {
        html: '<div style="display: flex;"><span>Child 1</span><span>Child 2</span></div>',
        nestingDepth: 0,
      };

      const result = LayoutAnalyzer.analyze(context);

  const missingFlexProblems = result.problems.filter(
    (p) => p.type === "missing-flex-container",
  );
  expect(missingFlexProblems.length).toBe(0);
});

test("LayoutAnalyzer.analyze - 配置指定がない場合 - 問題を検出する", () => {
      const context: LayoutAnalysisContext = {
        html: '<div style="display: flex;"><span>Child</span></div>',
        nestingDepth: 0,
      };

      const result = LayoutAnalyzer.analyze(context);

  const alignmentProblems = result.problems.filter(
    (p) => p.type === "missing-alignment",
  );
  expect(alignmentProblems.length).toBeGreaterThan(0);
});

test("LayoutAnalyzer.analyze - 配置指定がある場合 - missing-alignment問題を検出しない", () => {
      const context: LayoutAnalysisContext = {
        html: '<div style="display: flex; justify-content: center; align-items: center;"><span>Child</span></div>',
        nestingDepth: 0,
      };

      const result = LayoutAnalyzer.analyze(context);

  const alignmentProblems = result.problems.filter(
    (p) => p.type === "missing-alignment",
  );
  expect(alignmentProblems.length).toBe(0);
});

test("LayoutAnalyzer.analyzeNode - ノード単位 - 分析する", () => {
      const html = '<div style="display: flex;"><span>Hello</span></div>';

      const problems = LayoutAnalyzer.analyzeNode(html, createNodePath("root"));

  expect(Array.isArray(problems)).toBe(true);
});

test("LayoutAnalyzer.getAnalysisSummary - 分析結果 - サマリーを取得する", () => {
      const result: LayoutAnalysisResult = {
        problems: [
          {
            type: "missing-flex-container",
            severity: "medium",
            location: createNodePath("root > div"),
            description: "Flexコンテナがありません",
          },
          {
            type: "missing-alignment",
            severity: "low",
            location: createNodePath("root > div"),
            description: "配置指定がありません",
          },
        ],
        analyzedNodeCount: 3,
        analyzedAt: new Date(),
      };

      const summary = LayoutAnalyzer.getAnalysisSummary(result);

  expect(summary.totalProblems).toBe(2);
  expect(summary.problemsByType["missing-flex-container"]).toBe(1);
  expect(summary.problemsByType["missing-alignment"]).toBe(1);
  expect(summary.problemsBySeverity["medium"]).toBe(1);
  expect(summary.problemsBySeverity["low"]).toBe(1);
});

test("LayoutAnalyzer.getAnalysisSummary - 問題がない場合 - サマリーを返す", () => {
      const result: LayoutAnalysisResult = {
        problems: [],
        analyzedNodeCount: 1,
        analyzedAt: new Date(),
      };

      const summary = LayoutAnalyzer.getAnalysisSummary(result);

  expect(summary.totalProblems).toBe(0);
});

test("LayoutAnalyzer.countDirectChildren - 通常の子要素 - カウントする", () => {
  const content = "<span>text1</span><span>text2</span>";
  expect(LayoutAnalyzer.countDirectChildren(content)).toBe(2);
});

test("LayoutAnalyzer.countDirectChildren - 自己閉じタグ（明示的なスラッシュ） - カウントする", () => {
  const content = "<img /><br /><span>text</span>";
  expect(LayoutAnalyzer.countDirectChildren(content)).toBe(3);
});

test("LayoutAnalyzer.countDirectChildren - HTML5 void要素（スラッシュなし） - カウントする", () => {
  const content = "<img><br><span>text</span>";
  expect(LayoutAnalyzer.countDirectChildren(content)).toBe(3);
});

test("LayoutAnalyzer.countDirectChildren - ネストされた要素 - 直接の子要素のみカウントする", () => {
  const content = "<div><span>nested</span></div><span>direct child</span>";
  expect(LayoutAnalyzer.countDirectChildren(content)).toBe(2);
});

test("LayoutAnalyzer.countDirectChildren - 深くネストされた要素 - 正しくカウントする", () => {
  const content = "<div><div><div>deeply nested</div></div></div>";
  expect(LayoutAnalyzer.countDirectChildren(content)).toBe(1);
});

test("LayoutAnalyzer.countDirectChildren - 同じタグ名が複数ネスト - 正しくカウントする", () => {
  const content =
    "<div>outer<div>inner<div>deep</div></div></div><div>sibling</div>";
  expect(LayoutAnalyzer.countDirectChildren(content)).toBe(2);
});

test("LayoutAnalyzer.countDirectChildren - 空のコンテンツ - 0を返す", () => {
  expect(LayoutAnalyzer.countDirectChildren("")).toBe(0);
});

test("LayoutAnalyzer.countDirectChildren - テキストのみ - 0を返す", () => {
  expect(LayoutAnalyzer.countDirectChildren("just text")).toBe(0);
});

test("LayoutAnalyzer.countDirectChildren - 自己閉じタグとネストされた要素の混在 - 正しくカウントする", () => {
  const content =
    "<img /><div><span>text</span><br /></div><input /><span>direct</span>";
  expect(LayoutAnalyzer.countDirectChildren(content)).toBe(4);
});
