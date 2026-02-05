/**
 * SuggestionGenerator のテスト
 */
import { it, expect } from "vitest";
import { SuggestionGenerator } from "../suggestion-generator";
import type { LayoutProblem, SuggestionResult } from "../../types";
import { createNodePath, createSuggestionId } from "../../types";

it("SuggestionGenerator.generate - 問題がない - 空の提案リストを返す", () => {
  const problems: LayoutProblem[] = [];

  const result = SuggestionGenerator.generate(problems);

  expect(result.suggestions).toEqual([]);
  expect(result.usedAI).toBe(false);
  expect(result.generatedAt).toBeInstanceOf(Date);
});

it("SuggestionGenerator.generate - missing-flex-container問題 - 提案を生成する", () => {
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

it("SuggestionGenerator.generate - missing-alignment問題 - 提案を生成する", () => {
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

it("SuggestionGenerator.generate - inconsistent-spacing問題 - 提案を生成する", () => {
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

it("SuggestionGenerator.generate - suboptimal-direction問題 - 提案を生成する", () => {
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

it("SuggestionGenerator.generate - inefficient-nesting問題 - 提案を生成する", () => {
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

it("SuggestionGenerator.generate - 複数の問題 - 複数の提案を生成する", () => {
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

it("SuggestionGenerator.generateForProblem - 個別の問題 - 提案を生成する", () => {
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

it("SuggestionGenerator.filterByConfidence - 信頼度でフィルタリング - 信頼度以上の提案を返す", () => {
  const result: SuggestionResult = {
    suggestions: [
      {
        id: createSuggestionId("test-1"),
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
        id: createSuggestionId("test-2"),
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

it("SuggestionGenerator.sortBySeverity - 重大度でソート - 重大度順に提案を返す", () => {
  const result: SuggestionResult = {
    suggestions: [
      {
        id: createSuggestionId("test-1"),
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
        id: createSuggestionId("test-2"),
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
        id: createSuggestionId("test-3"),
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

it("SuggestionGenerator.limitSuggestions - 制限数以下 - 指定数の提案を返す", () => {
  const result: SuggestionResult = {
    suggestions: [
      {
        id: createSuggestionId("test-1"),
        problem: {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "test 1",
        },
        suggestion: "test 1",
        confidence: 0.8,
        autoApplicable: true,
      },
      {
        id: createSuggestionId("test-2"),
        problem: {
          type: "missing-alignment",
          severity: "low",
          location: createNodePath("root > div"),
          description: "test 2",
        },
        suggestion: "test 2",
        confidence: 0.7,
        autoApplicable: true,
      },
      {
        id: createSuggestionId("test-3"),
        problem: {
          type: "inefficient-nesting",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "test 3",
        },
        suggestion: "test 3",
        confidence: 0.6,
        autoApplicable: false,
      },
    ],
    usedAI: false,
    generatedAt: new Date(),
  };

  const limited = SuggestionGenerator.limitSuggestions(result, 2);

  expect(limited.suggestions.length).toBe(2);
  expect(limited.suggestions[0].suggestion).toBe("test 1");
  expect(limited.suggestions[1].suggestion).toBe("test 2");
});

it("SuggestionGenerator.limitSuggestions - limit > 提案数 - 全ての提案を返す", () => {
  const result: SuggestionResult = {
    suggestions: [
      {
        id: createSuggestionId("test-1"),
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
    ],
    usedAI: false,
    generatedAt: new Date(),
  };

  const limited = SuggestionGenerator.limitSuggestions(result, 10);

  expect(limited.suggestions.length).toBe(1);
});

it("SuggestionGenerator.limitSuggestions - limit=0 - 空の配列を返す", () => {
  const result: SuggestionResult = {
    suggestions: [
      {
        id: createSuggestionId("test-1"),
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
    ],
    usedAI: false,
    generatedAt: new Date(),
  };

  const limited = SuggestionGenerator.limitSuggestions(result, 0);

  expect(limited.suggestions.length).toBe(0);
});

const createTestResult = (): SuggestionResult => ({
  suggestions: [
    {
      id: createSuggestionId("test-1"),
      problem: {
        type: "missing-alignment",
        severity: "low",
        location: createNodePath("root > div"),
        description: "test 1",
      },
      suggestion: "test 1",
      confidence: 0.4,
      autoApplicable: true,
    },
    {
      id: createSuggestionId("test-2"),
      problem: {
        type: "missing-flex-container",
        severity: "high",
        location: createNodePath("root > div"),
        description: "test 2",
      },
      suggestion: "test 2",
      confidence: 0.9,
      autoApplicable: true,
    },
    {
      id: createSuggestionId("test-3"),
      problem: {
        type: "inefficient-nesting",
        severity: "medium",
        location: createNodePath("root > div"),
        description: "test 3",
      },
      suggestion: "test 3",
      confidence: 0.6,
      autoApplicable: false,
    },
  ],
  usedAI: false,
  generatedAt: new Date(),
});

it("SuggestionGenerator.optimize - オプションなし - 元の結果を返す", () => {
  const result = createTestResult();

  const optimized = SuggestionGenerator.optimize(result);

  expect(optimized.suggestions.length).toBe(3);
});

it("SuggestionGenerator.optimize - minConfidence指定 - 信頼度でフィルタリングする", () => {
  const result = createTestResult();

  const optimized = SuggestionGenerator.optimize(result, {
    minConfidence: 0.5,
  });

  expect(optimized.suggestions.length).toBe(2);
  expect(optimized.suggestions.every((s) => s.confidence >= 0.5)).toBe(
    true,
  );
});

it("SuggestionGenerator.optimize - sortBySeverity指定 - 重大度でソートする", () => {
  const result = createTestResult();

  const optimized = SuggestionGenerator.optimize(result, {
    sortBySeverity: true,
  });

  expect(optimized.suggestions[0].problem.severity).toBe("high");
  expect(optimized.suggestions[1].problem.severity).toBe("medium");
  expect(optimized.suggestions[2].problem.severity).toBe("low");
});

it("SuggestionGenerator.optimize - maxSuggestions指定 - 提案数を制限する", () => {
  const result = createTestResult();

  const optimized = SuggestionGenerator.optimize(result, {
    maxSuggestions: 2,
  });

  expect(optimized.suggestions.length).toBe(2);
});

it("SuggestionGenerator.optimize - 複数オプション - フィルタリング・ソート・制限を適用する", () => {
      const result = createTestResult();

      const optimized = SuggestionGenerator.optimize(result, {
        minConfidence: 0.5,
        sortBySeverity: true,
        maxSuggestions: 1,
      });

      // 0.5以上でフィルタ → 2件（0.9と0.6）
      // 重大度でソート → high（0.9）が先頭
      // 1件に制限 → high（0.9）のみ
      expect(optimized.suggestions.length).toBe(1);
      expect(optimized.suggestions[0].problem.severity).toBe("high");
      expect(optimized.suggestions[0].confidence).toBe(0.9);
    });

    test("フィルタ→ソート→制限の順序で適用される", () => {
  const result = createTestResult();

  const optimized = SuggestionGenerator.optimize(result, {
    minConfidence: 0.5,
    sortBySeverity: true,
    maxSuggestions: 2,
  });

  expect(optimized.suggestions.length).toBe(2);
  expect(optimized.suggestions[0].problem.severity).toBe("high");
  expect(optimized.suggestions[1].problem.severity).toBe("medium");
});
