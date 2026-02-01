import { test, expect } from "vitest";
import { AltTextRule } from "../alt-text-rule";
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

const rule = new AltTextRule();

// =============================================================================
// ルールメタ情報
// =============================================================================

test("ルールIDがmissing-alt-textである", () => {
  expect(rule.id).toBe("missing-alt-text");
});

test("WCAG基準が1.1.1である", () => {
  expect(rule.wcagCriterion).toBe("1.1.1");
});

test("重要度がerrorである", () => {
  expect(rule.severity).toBe("error");
});

// =============================================================================
// alt属性チェック
// =============================================================================

test("alt属性のないimg要素を検出する", () => {
  const nodes = [createNode("img", { src: "image.png" })];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(1);
  expect(issues[0].type).toBe("missing-alt-text");
});

test("空のalt属性を持つimg要素を検出する", () => {
  const nodes = [createNode("img", { src: "image.png", alt: "" })];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(1);
  expect(issues[0].type).toBe("empty-alt-text");
  expect(issues[0].severity).toBe("warning");
});

test("有効なalt属性を持つimg要素は問題なし", () => {
  const nodes = [createNode("img", { src: "image.png", alt: "説明テキスト" })];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("ネストされたimg要素もチェックする", () => {
  const nodes = [
    createNode("div", {}, [createNode("img", { src: "nested.png" })]),
  ];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(1);
});

test("role=presentationのimg要素はalt不要", () => {
  const nodes = [
    createNode("img", { src: "decorative.png", role: "presentation" }),
  ];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("parsedNodesが未定義の場合は空配列を返す", () => {
  const issues = rule.check({ config: DEFAULT_A11Y_CONFIG });
  expect(issues).toHaveLength(0);
});
