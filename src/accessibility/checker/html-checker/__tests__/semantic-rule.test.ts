import { test, expect } from "vitest";
import { SemanticRule } from "../semantic-rule";
import type { A11yCheckContext, ParsedHtmlNode } from "../../../types";
import { DEFAULT_A11Y_CONFIG } from "../../../constants";

function createContext(nodes: readonly ParsedHtmlNode[]): A11yCheckContext {
  return { parsedNodes: nodes, config: DEFAULT_A11Y_CONFIG };
}

function createNode(
  tagName: string,
  attributes: Record<string, string> = {},
  children: readonly ParsedHtmlNode[] = [],
): ParsedHtmlNode {
  return {
    tagName,
    attributes,
    textContent: "",
    children,
    xpath: `/${tagName}`,
  };
}

const rule = new SemanticRule();

// =============================================================================
// ルールメタ情報
// =============================================================================

test("ルールIDがmissing-heading-hierarchyである", () => {
  expect(rule.id).toBe("missing-heading-hierarchy");
});

test("WCAG基準が1.3.1である", () => {
  expect(rule.wcagCriterion).toBe("1.3.1");
});

// =============================================================================
// 見出し階層チェック
// =============================================================================

test("見出し階層がスキップされている場合を検出する（h1→h3）", () => {
  const nodes = [createNode("h1"), createNode("h3")];
  const issues = rule.check(createContext(nodes));
  const hierarchy = issues.filter(
    (i) => i.type === "missing-heading-hierarchy",
  );
  expect(hierarchy).toHaveLength(1);
});

test("正しい見出し階層は問題なし（h1→h2→h3）", () => {
  const nodes = [createNode("h1"), createNode("h2"), createNode("h3")];
  const issues = rule.check(createContext(nodes));
  const hierarchy = issues.filter(
    (i) => i.type === "missing-heading-hierarchy",
  );
  expect(hierarchy).toHaveLength(0);
});

test("見出しがない場合は問題なし", () => {
  const nodes = [createNode("div"), createNode("p")];
  const issues = rule.check(createContext(nodes));
  const hierarchy = issues.filter(
    (i) => i.type === "missing-heading-hierarchy",
  );
  expect(hierarchy).toHaveLength(0);
});

// =============================================================================
// ランドマークチェック
// =============================================================================

test("ランドマーク要素がない場合を検出する", () => {
  const nodes = [createNode("div"), createNode("p")];
  const issues = rule.check(createContext(nodes));
  const landmark = issues.filter((i) => i.type === "missing-landmark");
  expect(landmark).toHaveLength(1);
});

test("main要素があればランドマーク問題なし", () => {
  const nodes = [createNode("main")];
  const issues = rule.check(createContext(nodes));
  const landmark = issues.filter((i) => i.type === "missing-landmark");
  expect(landmark).toHaveLength(0);
});

test("nav要素があればランドマーク問題なし", () => {
  const nodes = [createNode("nav")];
  const issues = rule.check(createContext(nodes));
  const landmark = issues.filter((i) => i.type === "missing-landmark");
  expect(landmark).toHaveLength(0);
});

// =============================================================================
// lang属性チェック
// =============================================================================

test("html要素にlang属性がない場合を検出する", () => {
  const nodes = [createNode("html")];
  const issues = rule.check(createContext(nodes));
  const lang = issues.filter((i) => i.type === "missing-lang-attribute");
  expect(lang).toHaveLength(1);
});

test("html要素にlang属性があれば問題なし", () => {
  const nodes = [createNode("html", { lang: "ja" })];
  const issues = rule.check(createContext(nodes));
  const lang = issues.filter((i) => i.type === "missing-lang-attribute");
  expect(lang).toHaveLength(0);
});

test("parsedNodesが未定義の場合は空配列を返す", () => {
  const issues = rule.check({ config: DEFAULT_A11Y_CONFIG });
  expect(issues).toHaveLength(0);
});
