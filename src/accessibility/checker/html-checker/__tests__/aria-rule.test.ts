import { test, expect } from "vitest";
import { AriaRule } from "../aria-rule";
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

const rule = new AriaRule();

// =============================================================================
// ルールメタ情報
// =============================================================================

test("ルールIDがinvalid-aria-roleである", () => {
  expect(rule.id).toBe("invalid-aria-role");
});

test("WCAG基準が4.1.2である", () => {
  expect(rule.wcagCriterion).toBe("4.1.2");
});

// =============================================================================
// 無効なARIAロール
// =============================================================================

test("無効なrole属性を検出する", () => {
  const nodes = [createNode("div", { role: "invalid-role" })];
  const issues = rule.check(createContext(nodes));
  const invalidRole = issues.filter((i) => i.type === "invalid-aria-role");
  expect(invalidRole).toHaveLength(1);
});

test("有効なrole属性は問題なし", () => {
  const nodes = [createNode("div", { role: "button" })];
  const issues = rule.check(createContext(nodes));
  const invalidRole = issues.filter((i) => i.type === "invalid-aria-role");
  expect(invalidRole).toHaveLength(0);
});

// =============================================================================
// 重複ID
// =============================================================================

test("重複するidを検出する", () => {
  const nodes = [
    createNode("div", { id: "duplicate" }),
    createNode("span", { id: "duplicate" }),
  ];
  const issues = rule.check(createContext(nodes));
  const duplicates = issues.filter((i) => i.type === "duplicate-aria-id");
  expect(duplicates.length).toBeGreaterThanOrEqual(1);
});

test("一意のidは問題なし", () => {
  const nodes = [
    createNode("div", { id: "unique1" }),
    createNode("span", { id: "unique2" }),
  ];
  const issues = rule.check(createContext(nodes));
  const duplicates = issues.filter((i) => i.type === "duplicate-aria-id");
  expect(duplicates).toHaveLength(0);
});

// =============================================================================
// aria-label
// =============================================================================

test("インタラクティブ要素にaria-labelがない場合を検出する", () => {
  const nodes = [createNode("button", {})];
  const issues = rule.check(createContext(nodes));
  const missingLabel = issues.filter((i) => i.type === "missing-aria-label");
  expect(missingLabel).toHaveLength(1);
});

test("テキストコンテンツがあるbutton要素はaria-label不要", () => {
  const node: ParsedHtmlNode = {
    tagName: "button",
    attributes: {},
    textContent: "クリック",
    children: [],
    xpath: "/button",
  };
  const issues = rule.check(createContext([node]));
  const missingLabel = issues.filter((i) => i.type === "missing-aria-label");
  expect(missingLabel).toHaveLength(0);
});

test("parsedNodesが未定義の場合は空配列を返す", () => {
  const issues = rule.check({ config: DEFAULT_A11Y_CONFIG });
  expect(issues).toHaveLength(0);
});
