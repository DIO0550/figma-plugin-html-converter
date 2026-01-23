/**
 * LayoutAnalyzer のテスト
 */
import { describe, test, expect } from "vitest";
import { LayoutAnalyzer } from "../layout-analyzer";
import type { LayoutAnalysisContext, LayoutAnalysisResult } from "../../types";
import { createNodePath } from "../../types";

describe("LayoutAnalyzer", () => {
  describe("analyze", () => {
    test("空のHTMLを分析すると空の結果を返す", () => {
      const context: LayoutAnalysisContext = {
        html: "",
        nestingDepth: 0,
      };

      const result = LayoutAnalyzer.analyze(context);

      expect(result.problems).toEqual([]);
      expect(result.analyzedNodeCount).toBe(0);
      expect(result.analyzedAt).toBeInstanceOf(Date);
    });

    test("単純なdivを分析できる", () => {
      const context: LayoutAnalysisContext = {
        html: '<div style="display: flex;"><span>Hello</span></div>',
        nestingDepth: 0,
      };

      const result = LayoutAnalyzer.analyze(context);

      expect(result.analyzedNodeCount).toBeGreaterThan(0);
      expect(result.analyzedAt).toBeInstanceOf(Date);
    });

    test("Flexコンテナがない場合に問題を検出する", () => {
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

    test("Flexコンテナがある場合はmissing-flex-container問題を検出しない", () => {
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

    test("配置指定がない場合に問題を検出する", () => {
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

    test("配置指定がある場合はmissing-alignment問題を検出しない", () => {
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
  });

  describe("analyzeNode", () => {
    test("ノード単位で分析できる", () => {
      const html = '<div style="display: flex;"><span>Hello</span></div>';

      const problems = LayoutAnalyzer.analyzeNode(html, createNodePath("root"));

      expect(Array.isArray(problems)).toBe(true);
    });
  });

  describe("getAnalysisSummary", () => {
    test("分析結果のサマリーを取得できる", () => {
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

    test("問題がない場合のサマリー", () => {
      const result: LayoutAnalysisResult = {
        problems: [],
        analyzedNodeCount: 1,
        analyzedAt: new Date(),
      };

      const summary = LayoutAnalyzer.getAnalysisSummary(result);

      expect(summary.totalProblems).toBe(0);
    });
  });

  describe("countDirectChildren", () => {
    test("通常の子要素をカウントする", () => {
      const content = "<span>text1</span><span>text2</span>";
      expect(LayoutAnalyzer.countDirectChildren(content)).toBe(2);
    });

    test("自己閉じタグをカウントする（明示的なスラッシュ）", () => {
      const content = "<img /><br /><span>text</span>";
      expect(LayoutAnalyzer.countDirectChildren(content)).toBe(3);
    });

    test("HTML5 void要素をカウントする（スラッシュなし）", () => {
      // img, brはvoid要素なのでスラッシュなしでも自己閉じとして扱う
      const content = "<img><br><span>text</span>";
      expect(LayoutAnalyzer.countDirectChildren(content)).toBe(3);
    });

    test("ネストされた要素は直接の子要素のみカウントする", () => {
      const content = "<div><span>nested</span></div><span>direct child</span>";
      // 直接の子要素は: div (1) + span (1) = 2
      expect(LayoutAnalyzer.countDirectChildren(content)).toBe(2);
    });

    test("深くネストされた要素を正しくカウントする", () => {
      const content = "<div><div><div>deeply nested</div></div></div>";
      // 直接の子要素は: div (1つのみ)
      expect(LayoutAnalyzer.countDirectChildren(content)).toBe(1);
    });

    test("同じタグ名が複数ネストされる場合も正しくカウントする", () => {
      const content =
        "<div>outer<div>inner<div>deep</div></div></div><div>sibling</div>";
      // 直接の子要素は: div (1) + div (1) = 2
      expect(LayoutAnalyzer.countDirectChildren(content)).toBe(2);
    });

    test("空のコンテンツは0を返す", () => {
      expect(LayoutAnalyzer.countDirectChildren("")).toBe(0);
    });

    test("テキストのみの場合は0を返す", () => {
      expect(LayoutAnalyzer.countDirectChildren("just text")).toBe(0);
    });

    test("自己閉じタグとネストされた要素の混在", () => {
      const content =
        "<img /><div><span>text</span><br /></div><input /><span>direct</span>";
      // 直接の子要素は: img (1) + div (1) + input (1) + span (1) = 4
      expect(LayoutAnalyzer.countDirectChildren(content)).toBe(4);
    });
  });
});
