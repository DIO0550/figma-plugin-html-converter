/**
 * SuggestionGenerator のテスト
 */
import { describe, test, expect } from "vitest";
import { SuggestionGenerator } from "../suggestion-generator";
import type { LayoutProblem, SuggestionResult } from "../../types";
import { createNodePath } from "../../types";

describe("SuggestionGenerator", () => {
  describe("generate", () => {
    test("問題がない場合は空の提案リストを返す", () => {
      const problems: LayoutProblem[] = [];

      const result = SuggestionGenerator.generate(problems);

      expect(result.suggestions).toEqual([]);
      expect(result.usedAI).toBe(false);
      expect(result.generatedAt).toBeInstanceOf(Date);
    });

    test("missing-flex-container問題から提案を生成できる", () => {
      const problems: LayoutProblem[] = [
        {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "Flexコンテナがありません",
          currentValue: "block",
        },
      ];

      const result = SuggestionGenerator.generate(problems);

      expect(result.suggestions.length).toBe(1);
      expect(result.suggestions[0].problem.type).toBe("missing-flex-container");
      expect(result.suggestions[0].suggestion).toContain("display: flex");
      expect(result.suggestions[0].autoApplicable).toBe(true);
    });

    test("missing-alignment問題から提案を生成できる", () => {
      const problems: LayoutProblem[] = [
        {
          type: "missing-alignment",
          severity: "low",
          location: createNodePath("root > div"),
          description: "配置指定がありません",
        },
      ];

      const result = SuggestionGenerator.generate(problems);

      expect(result.suggestions.length).toBe(1);
      expect(result.suggestions[0].problem.type).toBe("missing-alignment");
      expect(result.suggestions[0].suggestion).toContain("justify-content");
    });

    test("inconsistent-spacing問題から提案を生成できる", () => {
      const problems: LayoutProblem[] = [
        {
          type: "inconsistent-spacing",
          severity: "low",
          location: createNodePath("root > div"),
          description: "スペーシングが一貫していません",
          currentValue: "gap: 10px, padding: 20px",
        },
      ];

      const result = SuggestionGenerator.generate(problems);

      expect(result.suggestions.length).toBe(1);
      expect(result.suggestions[0].problem.type).toBe("inconsistent-spacing");
    });

    test("suboptimal-direction問題から提案を生成できる", () => {
      const problems: LayoutProblem[] = [
        {
          type: "suboptimal-direction",
          severity: "low",
          location: createNodePath("root > div"),
          description: "横並びですが、縦並びが適切かもしれません",
          currentValue: "row",
        },
      ];

      const result = SuggestionGenerator.generate(problems);

      expect(result.suggestions.length).toBe(1);
      expect(result.suggestions[0].problem.type).toBe("suboptimal-direction");
      expect(result.suggestions[0].suggestion).toContain("column");
    });

    test("inefficient-nesting問題から提案を生成できる", () => {
      const problems: LayoutProblem[] = [
        {
          type: "inefficient-nesting",
          severity: "medium",
          location: createNodePath("root > div > div > div > div > div"),
          description: "ネストが深すぎます",
          currentValue: "depth: 5",
        },
      ];

      const result = SuggestionGenerator.generate(problems);

      expect(result.suggestions.length).toBe(1);
      expect(result.suggestions[0].problem.type).toBe("inefficient-nesting");
    });

    test("複数の問題から複数の提案を生成できる", () => {
      const problems: LayoutProblem[] = [
        {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "Flexコンテナがありません",
        },
        {
          type: "missing-alignment",
          severity: "low",
          location: createNodePath("root > section"),
          description: "配置指定がありません",
        },
      ];

      const result = SuggestionGenerator.generate(problems);

      expect(result.suggestions.length).toBe(2);
    });
  });

  describe("generateForProblem", () => {
    test("個別の問題から提案を生成できる", () => {
      const problem: LayoutProblem = {
        type: "missing-flex-container",
        severity: "medium",
        location: createNodePath("root > div"),
        description: "Flexコンテナがありません",
      };

      const suggestion = SuggestionGenerator.generateForProblem(problem);

      expect(suggestion).not.toBeNull();
      expect(suggestion?.problem).toEqual(problem);
      expect(suggestion?.id).toBeDefined();
      expect(suggestion?.confidence).toBeGreaterThan(0);
    });
  });

  describe("filterByConfidence", () => {
    test("信頼度でフィルタリングできる", () => {
      const result: SuggestionResult = {
        suggestions: [
          {
            id: "1" as any,
            problem: {
              type: "missing-flex-container",
              severity: "medium",
              location: createNodePath("root > div"),
              description: "test",
            },
            suggestion: "test",
            confidence: 0.8,
            autoApplicable: true,
          },
          {
            id: "2" as any,
            problem: {
              type: "missing-alignment",
              severity: "low",
              location: createNodePath("root > div"),
              description: "test",
            },
            suggestion: "test",
            confidence: 0.4,
            autoApplicable: true,
          },
        ],
        usedAI: false,
        generatedAt: new Date(),
      };

      const filtered = SuggestionGenerator.filterByConfidence(result, 0.5);

      expect(filtered.suggestions.length).toBe(1);
      expect(filtered.suggestions[0].confidence).toBe(0.8);
    });
  });

  describe("sortBySeverity", () => {
    test("重大度でソートできる", () => {
      const result: SuggestionResult = {
        suggestions: [
          {
            id: "1" as any,
            problem: {
              type: "missing-alignment",
              severity: "low",
              location: createNodePath("root > div"),
              description: "test",
            },
            suggestion: "test",
            confidence: 0.8,
            autoApplicable: true,
          },
          {
            id: "2" as any,
            problem: {
              type: "missing-flex-container",
              severity: "high",
              location: createNodePath("root > div"),
              description: "test",
            },
            suggestion: "test",
            confidence: 0.8,
            autoApplicable: true,
          },
          {
            id: "3" as any,
            problem: {
              type: "inefficient-nesting",
              severity: "medium",
              location: createNodePath("root > div"),
              description: "test",
            },
            suggestion: "test",
            confidence: 0.8,
            autoApplicable: true,
          },
        ],
        usedAI: false,
        generatedAt: new Date(),
      };

      const sorted = SuggestionGenerator.sortBySeverity(result);

      expect(sorted.suggestions[0].problem.severity).toBe("high");
      expect(sorted.suggestions[1].problem.severity).toBe("medium");
      expect(sorted.suggestions[2].problem.severity).toBe("low");
    });
  });
});
