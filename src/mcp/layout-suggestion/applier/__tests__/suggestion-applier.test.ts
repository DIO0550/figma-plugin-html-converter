/**
 * SuggestionApplier のテスト
 */
import { test, expect } from "vitest";
import { SuggestionApplier } from "../suggestion-applier";
import type { LayoutSuggestion } from "../../types";
import { createNodePath, createSuggestionId } from "../../types";
import { Styles } from "../../../../converter/models/styles";

test("SuggestionApplier.canApply - 自動適用可能な提案 - trueを返す", () => {
      const suggestion: LayoutSuggestion = {
        id: createSuggestionId("test-1"),
        problem: {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "Flexコンテナがありません",
        },
        suggestion: "display: flexを追加",
        confidence: 0.9,
        autoApplicable: true,
        improvedStyles: { display: "flex" },
      };

  expect(SuggestionApplier.canApply(suggestion)).toBe(true);
});

test("SuggestionApplier.canApply - 自動適用不可の提案 - falseを返す", () => {
      const suggestion: LayoutSuggestion = {
        id: createSuggestionId("test-2"),
        problem: {
          type: "inefficient-nesting",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "ネストが深すぎます",
        },
        suggestion: "HTML構造を簡素化",
        confidence: 0.5,
        autoApplicable: false,
      };

  expect(SuggestionApplier.canApply(suggestion)).toBe(false);
});

test("SuggestionApplier.canApply - improvedStylesがない提案 - falseを返す", () => {
      const suggestion: LayoutSuggestion = {
        id: createSuggestionId("test-3"),
        problem: {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "Flexコンテナがありません",
        },
        suggestion: "display: flexを追加",
        confidence: 0.9,
        autoApplicable: true,
        // improvedStylesなし
      };

  expect(SuggestionApplier.canApply(suggestion)).toBe(false);
});

test("SuggestionApplier.apply - 提案を適用 - 新しいスタイルを生成する", () => {
      const originalStyles = Styles.from({ color: "red" });
      const suggestion: LayoutSuggestion = {
        id: createSuggestionId("test-4"),
        problem: {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "Flexコンテナがありません",
        },
        suggestion: "display: flexを追加",
        confidence: 0.9,
        autoApplicable: true,
        improvedStyles: { display: "flex" },
      };

      const result = SuggestionApplier.apply(suggestion, originalStyles);

  expect(result.success).toBe(true);
  expect(result.appliedSuggestionId).toBe(suggestion.id);
});

test("SuggestionApplier.apply - 成功時 - appliedStylesを返す", () => {
      const originalStyles = Styles.from({ color: "red" });
      const suggestion: LayoutSuggestion = {
        id: createSuggestionId("test-apply-styles"),
        problem: {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "Flexコンテナがありません",
        },
        suggestion: "display: flexを追加",
        confidence: 0.9,
        autoApplicable: true,
        improvedStyles: { display: "flex", gap: "8px" },
      };

      const result = SuggestionApplier.apply(suggestion, originalStyles);

  expect(result.success).toBe(true);
  expect(result.appliedStyles).toBeDefined();
  expect(Styles.get(result.appliedStyles!, "color")).toBe("red");
  expect(Styles.get(result.appliedStyles!, "display")).toBe("flex");
  expect(Styles.get(result.appliedStyles!, "gap")).toBe("8px");
});

test("SuggestionApplier.apply - 適用不可な提案 - エラーを返す", () => {
      const originalStyles = Styles.from({});
      const suggestion: LayoutSuggestion = {
        id: createSuggestionId("test-5"),
        problem: {
          type: "inefficient-nesting",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "ネストが深すぎます",
        },
        suggestion: "HTML構造を簡素化",
        confidence: 0.5,
        autoApplicable: false,
      };

      const result = SuggestionApplier.apply(suggestion, originalStyles);

  expect(result.success).toBe(false);
  expect(result.errorMessage).toBeDefined();
});

test("SuggestionApplier.generateNewStyles - 新しいスタイル - 生成する", () => {
      const originalStyles = Styles.from({ color: "red", padding: "10px" });
      const improvedStyles = { display: "flex", gap: "8px" };

      const newStyles = SuggestionApplier.generateNewStyles(
        originalStyles,
        improvedStyles,
      );

  expect(Styles.get(newStyles, "color")).toBe("red");
  expect(Styles.get(newStyles, "padding")).toBe("10px");
  expect(Styles.get(newStyles, "display")).toBe("flex");
  expect(Styles.get(newStyles, "gap")).toBe("8px");
});

test("SuggestionApplier.generateNewStyles - 既存のスタイル - 上書きする", () => {
      const originalStyles = Styles.from({ display: "block" });
      const improvedStyles = { display: "flex" };

      const newStyles = SuggestionApplier.generateNewStyles(
        originalStyles,
        improvedStyles,
      );

  expect(Styles.get(newStyles, "display")).toBe("flex");
});

test("SuggestionApplier.generateStyleString - スタイルオブジェクト - 文字列を生成する", () => {
      const styles = Styles.from({
        display: "flex",
        "justify-content": "center",
      });

      const styleString = SuggestionApplier.generateStyleString(styles);

  expect(styleString).toContain("display: flex");
  expect(styleString).toContain("justify-content: center");
});

test("SuggestionApplier.applyMultiple - 複数の提案 - 適用する", () => {
      const originalStyles = Styles.from({});
      const suggestions: LayoutSuggestion[] = [
        {
          id: createSuggestionId("test-6"),
          problem: {
            type: "missing-flex-container",
            severity: "medium",
            location: createNodePath("root > div"),
            description: "Flexコンテナがありません",
          },
          suggestion: "display: flexを追加",
          confidence: 0.9,
          autoApplicable: true,
          improvedStyles: { display: "flex" },
        },
        {
          id: createSuggestionId("test-7"),
          problem: {
            type: "missing-alignment",
            severity: "low",
            location: createNodePath("root > div"),
            description: "配置指定がありません",
          },
          suggestion: "配置を指定",
          confidence: 0.8,
          autoApplicable: true,
          improvedStyles: { "justify-content": "center" },
        },
      ];

      const results = SuggestionApplier.applyMultiple(
        suggestions,
        originalStyles,
      );

  expect(results.length).toBe(2);
  expect(results[0].success).toBe(true);
  expect(results[1].success).toBe(true);
});

test("SuggestionApplier.filterApplicable - 適用可能な提案のみ - フィルタリングする", () => {
      const suggestions: LayoutSuggestion[] = [
        {
          id: createSuggestionId("test-8"),
          problem: {
            type: "missing-flex-container",
            severity: "medium",
            location: createNodePath("root > div"),
            description: "test",
          },
          suggestion: "test",
          confidence: 0.9,
          autoApplicable: true,
          improvedStyles: { display: "flex" },
        },
        {
          id: createSuggestionId("test-9"),
          problem: {
            type: "inefficient-nesting",
            severity: "medium",
            location: createNodePath("root > div"),
            description: "test",
          },
          suggestion: "test",
          confidence: 0.5,
          autoApplicable: false,
        },
      ];

      const applicableSuggestions =
        SuggestionApplier.filterApplicable(suggestions);

  expect(applicableSuggestions.length).toBe(1);
  expect(applicableSuggestions[0].autoApplicable).toBe(true);
});

test("SuggestionApplier.summarizeResults - 全て成功した場合 - サマリーを生成する", () => {
      const results = [
        { success: true, appliedSuggestionId: createSuggestionId("test-1") },
        { success: true, appliedSuggestionId: createSuggestionId("test-2") },
        { success: true, appliedSuggestionId: createSuggestionId("test-3") },
      ];

      const summary = SuggestionApplier.summarizeResults(results);

  expect(summary.total).toBe(3);
  expect(summary.successful).toBe(3);
  expect(summary.failed).toBe(0);
  expect(summary.successIds).toHaveLength(3);
  expect(summary.failedIds).toHaveLength(0);
});

test("SuggestionApplier.summarizeResults - 全て失敗した場合 - サマリーを生成する", () => {
      const results = [
        {
          success: false,
          appliedSuggestionId: createSuggestionId("test-1"),
          errorMessage: "エラー1",
        },
        {
          success: false,
          appliedSuggestionId: createSuggestionId("test-2"),
          errorMessage: "エラー2",
        },
      ];

      const summary = SuggestionApplier.summarizeResults(results);

  expect(summary.total).toBe(2);
  expect(summary.successful).toBe(0);
  expect(summary.failed).toBe(2);
  expect(summary.successIds).toHaveLength(0);
  expect(summary.failedIds).toHaveLength(2);
});

test("SuggestionApplier.summarizeResults - 成功と失敗が混在した場合 - サマリーを生成する", () => {
      const id1 = createSuggestionId("test-1");
      const id2 = createSuggestionId("test-2");
      const id3 = createSuggestionId("test-3");

      const results = [
        { success: true, appliedSuggestionId: id1 },
        { success: false, appliedSuggestionId: id2, errorMessage: "エラー" },
        { success: true, appliedSuggestionId: id3 },
      ];

      const summary = SuggestionApplier.summarizeResults(results);

  expect(summary.total).toBe(3);
  expect(summary.successful).toBe(2);
  expect(summary.failed).toBe(1);
  expect(summary.successIds).toEqual([id1, id3]);
  expect(summary.failedIds).toEqual([id2]);
});

test("SuggestionApplier.summarizeResults - 空の結果リスト - サマリーを生成する", () => {
      const results: ReturnType<typeof SuggestionApplier.apply>[] = [];

      const summary = SuggestionApplier.summarizeResults(results);

  expect(summary.total).toBe(0);
  expect(summary.successful).toBe(0);
  expect(summary.failed).toBe(0);
  expect(summary.successIds).toEqual([]);
  expect(summary.failedIds).toEqual([]);
});

test("SuggestionApplier.summarizeResults - 複数のID - 正しく分類する", () => {
      const successId1 = createSuggestionId("success-1");
      const successId2 = createSuggestionId("success-2");
      const failedId1 = createSuggestionId("failed-1");
      const failedId2 = createSuggestionId("failed-2");

      const results = [
        { success: true, appliedSuggestionId: successId1 },
        { success: false, appliedSuggestionId: failedId1, errorMessage: "e1" },
        { success: true, appliedSuggestionId: successId2 },
        { success: false, appliedSuggestionId: failedId2, errorMessage: "e2" },
      ];

      const summary = SuggestionApplier.summarizeResults(results);

  expect(summary.successIds).toContain(successId1);
  expect(summary.successIds).toContain(successId2);
  expect(summary.failedIds).toContain(failedId1);
  expect(summary.failedIds).toContain(failedId2);
});
