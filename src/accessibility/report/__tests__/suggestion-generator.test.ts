import { test, expect } from "vitest";
import { generateSuggestions } from "../suggestion-generator";
import type { A11yIssue } from "../../types";
import { createA11yIssueId } from "../../types";

function createIssue(
  type: A11yIssue["type"],
  overrides: Partial<A11yIssue> = {},
): A11yIssue {
  return {
    id: createA11yIssueId(`test-${type}`),
    type,
    severity: "error",
    wcagCriterion: "1.1.1",
    target: "html",
    element: {
      tagName: "img",
      xpath: "/img",
      attributes: { src: "test.png" },
    },
    message: "テスト問題",
    ...overrides,
  };
}

// =============================================================================
// 改善提案生成
// =============================================================================

test("missing-alt-textに対する改善提案を生成する", () => {
  const issues = [createIssue("missing-alt-text")];
  const suggestions = generateSuggestions(issues);
  expect(suggestions).toHaveLength(1);
  expect(suggestions[0].fixCode).toBeDefined();
  expect(suggestions[0].fixCode?.language).toBe("html");
});

test("empty-alt-textに対する改善提案を生成する", () => {
  const issues = [createIssue("empty-alt-text")];
  const suggestions = generateSuggestions(issues);
  expect(suggestions).toHaveLength(1);
  expect(suggestions[0].description).toContain("alt");
});

test("low-contrastに対する改善提案を生成する", () => {
  const issues = [
    createIssue("low-contrast", {
      wcagCriterion: "1.4.3",
      target: "figma",
      element: { tagName: "TEXT", figmaNodeId: "n1" },
    }),
  ];
  const suggestions = generateSuggestions(issues);
  expect(suggestions).toHaveLength(1);
  expect(suggestions[0].wcagReference).toContain("contrast-minimum");
});

test("insufficient-text-sizeに対する改善提案を生成する", () => {
  const issues = [
    createIssue("insufficient-text-size", { wcagCriterion: "1.4.4" }),
  ];
  const suggestions = generateSuggestions(issues);
  expect(suggestions).toHaveLength(1);
});

test("invalid-aria-roleに対する改善提案を生成する", () => {
  const issues = [createIssue("invalid-aria-role", { wcagCriterion: "4.1.2" })];
  const suggestions = generateSuggestions(issues);
  expect(suggestions).toHaveLength(1);
});

test("空の問題リストの場合は空の提案を返す", () => {
  const suggestions = generateSuggestions([]);
  expect(suggestions).toHaveLength(0);
});

test("複数の問題に対して個別の提案を生成する", () => {
  const issues = [
    createIssue("missing-alt-text"),
    createIssue("low-contrast", {
      wcagCriterion: "1.4.3",
      element: { tagName: "TEXT", figmaNodeId: "n1" },
    }),
  ];
  const suggestions = generateSuggestions(issues);
  expect(suggestions).toHaveLength(2);
});
