import { test, expect } from "vitest";
import { A11yChecker } from "../a11y-checker";
import type { A11yCheckContext, ParsedHtmlNode } from "../../types";
import { DEFAULT_A11Y_CONFIG } from "../../constants";

function createNode(
  tagName: string,
  attributes: Record<string, string> = {},
): ParsedHtmlNode {
  return {
    tagName,
    attributes,
    textContent: "",
    children: [],
    xpath: `/${tagName}`,
  };
}

const checker = new A11yChecker();

// =============================================================================
// HTML + Figma 統合チェック
// =============================================================================

test("HTMLとFigmaの両方の問題を検出する", () => {
  const context: A11yCheckContext = {
    parsedNodes: [createNode("img", { src: "test.png" })],
    figmaNodes: [
      {
        id: "n1",
        name: "Small Text",
        type: "TEXT",
        fontSize: 8,
      },
    ],
    config: DEFAULT_A11Y_CONFIG,
  };
  const issues = checker.check(context);
  expect(issues.length).toBeGreaterThanOrEqual(2);
});

test("HTMLのみのチェック設定の場合、Figma問題を検出しない", () => {
  const context: A11yCheckContext = {
    parsedNodes: [createNode("img", { src: "test.png" })],
    figmaNodes: [
      {
        id: "n1",
        name: "Small Text",
        type: "TEXT",
        fontSize: 8,
      },
    ],
    config: { ...DEFAULT_A11Y_CONFIG, checkTarget: "html" },
  };
  const issues = checker.check(context);
  const figmaIssues = issues.filter((i) => i.target === "figma");
  expect(figmaIssues).toHaveLength(0);
});

test("Figmaのみのチェック設定の場合、HTML問題を検出しない", () => {
  const context: A11yCheckContext = {
    parsedNodes: [createNode("img", { src: "test.png" })],
    figmaNodes: [
      {
        id: "n1",
        name: "Small Text",
        type: "TEXT",
        fontSize: 8,
      },
    ],
    config: { ...DEFAULT_A11Y_CONFIG, checkTarget: "figma" },
  };
  const issues = checker.check(context);
  const htmlIssues = issues.filter((i) => i.target === "html");
  expect(htmlIssues).toHaveLength(0);
});

test("問題がない場合は空配列を返す", () => {
  const context: A11yCheckContext = {
    parsedNodes: [createNode("img", { src: "test.png", alt: "テスト画像" })],
    figmaNodes: [
      {
        id: "n1",
        name: "Normal Text",
        type: "TEXT",
        fontSize: 16,
        fills: [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }],
        parentFills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }],
      },
    ],
    config: {
      ...DEFAULT_A11Y_CONFIG,
      enabledRules: [
        "missing-alt-text",
        "low-contrast",
        "insufficient-text-size",
      ],
    },
  };
  const issues = checker.check(context);
  expect(issues).toHaveLength(0);
});

test("enabledRulesで指定したルールのみ実行する", () => {
  const context: A11yCheckContext = {
    parsedNodes: [
      createNode("img", { src: "test.png" }), // missing-alt-text
      createNode("html"), // missing-lang-attribute
    ],
    config: {
      ...DEFAULT_A11Y_CONFIG,
      enabledRules: ["missing-alt-text"],
    },
  };
  const issues = checker.check(context);
  const altIssues = issues.filter((i) => i.type === "missing-alt-text");
  const langIssues = issues.filter((i) => i.type === "missing-lang-attribute");
  expect(altIssues.length).toBeGreaterThanOrEqual(1);
  expect(langIssues).toHaveLength(0);
});
