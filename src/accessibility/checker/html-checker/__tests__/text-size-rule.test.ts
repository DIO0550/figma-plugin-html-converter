import { test, expect } from "vitest";
import { TextSizeRule } from "../text-size-rule";
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

const rule = new TextSizeRule();

// =============================================================================
// ルールメタ情報
// =============================================================================

test("ルールIDがinsufficient-text-sizeである", () => {
  expect(rule.id).toBe("insufficient-text-size");
});

test("WCAG基準が1.4.4である", () => {
  expect(rule.wcagCriterion).toBe("1.4.4");
});

test("重要度がwarningである", () => {
  expect(rule.severity).toBe("warning");
});

// =============================================================================
// テキストサイズチェック
// =============================================================================

test("font-sizeが最小サイズ未満の場合を検出する", () => {
  const nodes = [createNode("p", { style: "font-size: 10px" })];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(1);
  expect(issues[0].type).toBe("insufficient-text-size");
});

test("font-sizeが最小サイズ以上の場合は問題なし", () => {
  const nodes = [createNode("p", { style: "font-size: 14px" })];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("font-sizeが12pxの場合は問題なし（境界値）", () => {
  const nodes = [createNode("p", { style: "font-size: 12px" })];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("style属性がない場合は問題なし", () => {
  const nodes = [createNode("p")];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("font-size以外のスタイルのみの場合は問題なし", () => {
  const nodes = [createNode("p", { style: "color: red" })];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("ptで指定されたフォントサイズもチェックする", () => {
  // 8pt ≈ 10.66px < 12px → 問題あり
  const nodes = [createNode("p", { style: "font-size: 8pt" })];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(1);
});

test("parsedNodesが未定義の場合は空配列を返す", () => {
  const issues = rule.check({ config: DEFAULT_A11Y_CONFIG });
  expect(issues).toHaveLength(0);
});
