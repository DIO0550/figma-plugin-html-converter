import { test, expect } from "vitest";
import { A11yChecker } from "../../checker";
import { generateReport } from "../../report";
import type {
  A11yCheckContext,
  ParsedHtmlNode,
  FigmaNodeInfo,
} from "../../types";
import { DEFAULT_A11Y_CONFIG } from "../../constants";

// =============================================================================
// ヘルパー
// =============================================================================

function createNode(
  tagName: string,
  attributes: Record<string, string> = {},
  textContent = "",
  children: ParsedHtmlNode[] = [],
): ParsedHtmlNode {
  return {
    tagName,
    attributes,
    textContent,
    children,
    xpath: `/${tagName}`,
  };
}

// =============================================================================
// 統合テスト: HTML → チェック → レポート生成
// =============================================================================

test("HTML入力からレポート生成までの一連のフローが動作する", () => {
  const checker = new A11yChecker();

  const context: A11yCheckContext = {
    parsedNodes: [
      createNode("html", {}, "", [
        createNode("body", {}, "", [
          createNode("img", { src: "photo.jpg" }),
          createNode("div", {}, "", [
            createNode("h1", {}, "タイトル"),
            createNode("h3", {}, "サブタイトル"), // h2をスキップ
          ]),
        ]),
      ]),
    ],
    config: DEFAULT_A11Y_CONFIG,
  };

  const issues = checker.check(context);
  expect(issues.length).toBeGreaterThan(0);

  const report = generateReport(issues);
  expect(report.issues.length).toBeGreaterThan(0);
  expect(report.suggestions.length).toBeGreaterThan(0);
  expect(report.summary.totalIssues).toBe(report.issues.length);
  expect(report.timestamp).toBeTruthy();

  // alt属性なしのimg要素が検出されている
  const altIssues = report.issues.filter((i) => i.type === "missing-alt-text");
  expect(altIssues.length).toBeGreaterThanOrEqual(1);

  // 見出し階層スキップが検出されている
  const headingIssues = report.issues.filter(
    (i) => i.type === "missing-heading-hierarchy",
  );
  expect(headingIssues.length).toBeGreaterThanOrEqual(1);
});

// =============================================================================
// 統合テスト: Figma → チェック → レポート生成
// =============================================================================

test("Figmaノード入力からレポート生成までのフローが動作する", () => {
  const checker = new A11yChecker();

  const figmaNodes: FigmaNodeInfo[] = [
    {
      id: "text1",
      name: "低コントラストテキスト",
      type: "TEXT",
      fontSize: 14,
      fills: [{ type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } }],
      parentFills: [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95 } }],
    },
    {
      id: "text2",
      name: "小さいテキスト",
      type: "TEXT",
      fontSize: 8,
    },
  ];

  const context: A11yCheckContext = {
    figmaNodes,
    config: { ...DEFAULT_A11Y_CONFIG, checkTarget: "figma" },
  };

  const issues = checker.check(context);
  const report = generateReport(issues);

  expect(report.issues.length).toBeGreaterThanOrEqual(2);
  expect(report.summary.wcagCompliance.overallAA).toBe(false);
});

// =============================================================================
// 統合テスト: 問題なしのケース
// =============================================================================

test("問題のない入力の場合、クリーンなレポートを生成する", () => {
  const checker = new A11yChecker();

  const context: A11yCheckContext = {
    parsedNodes: [
      createNode("html", { lang: "ja" }, "", [
        createNode("body", {}, "", [
          createNode("header", {}, "", [createNode("nav")]),
          createNode("main", {}, "", [
            createNode("h1", {}, "タイトル"),
            createNode("h2", {}, "サブタイトル"),
            createNode("img", { src: "photo.jpg", alt: "写真の説明" }),
            createNode("p", { style: "font-size: 16px" }, "本文テキスト"),
          ]),
          createNode("footer"),
        ]),
      ]),
    ],
    figmaNodes: [
      {
        id: "text1",
        name: "本文",
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
        "missing-heading-hierarchy",
        "missing-landmark",
        "missing-lang-attribute",
      ],
    },
  };

  const issues = checker.check(context);
  const report = generateReport(issues);

  expect(report.summary.totalIssues).toBe(0);
  expect(report.summary.wcagCompliance.overallAA).toBe(true);
});

// =============================================================================
// 統合テスト: 空の入力
// =============================================================================

test("空の入力でもエラーなく動作する", () => {
  const checker = new A11yChecker();

  const context: A11yCheckContext = {
    config: DEFAULT_A11Y_CONFIG,
  };

  const issues = checker.check(context);
  const report = generateReport(issues);

  expect(report.issues).toHaveLength(0);
  expect(report.summary.totalIssues).toBe(0);
});
