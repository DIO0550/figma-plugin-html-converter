import { test, expect } from "vitest";
import { FigmaContrastRule } from "../contrast-rule";
import type { A11yCheckContext, FigmaNodeInfo } from "../../../types";
import { DEFAULT_A11Y_CONFIG } from "../../../constants";

function createContext(figmaNodes: readonly FigmaNodeInfo[]): A11yCheckContext {
  return { figmaNodes, config: DEFAULT_A11Y_CONFIG };
}

const rule = new FigmaContrastRule();

// =============================================================================
// ルールメタ情報
// =============================================================================

test("ルールIDがlow-contrastである", () => {
  expect(rule.id).toBe("low-contrast");
});

test("WCAG基準が1.4.3である", () => {
  expect(rule.wcagCriterion).toBe("1.4.3");
});

// =============================================================================
// コントラストチェック
// =============================================================================

test("低コントラストのテキストノードを検出する", () => {
  const nodes: FigmaNodeInfo[] = [
    {
      id: "node1",
      name: "Text",
      type: "TEXT",
      fills: [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }],
      parentFills: [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }],
      fontSize: 14,
    },
  ];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(1);
  expect(issues[0].type).toBe("low-contrast");
});

test("高コントラストのテキストノードは問題なし", () => {
  const nodes: FigmaNodeInfo[] = [
    {
      id: "node1",
      name: "Text",
      type: "TEXT",
      fills: [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }],
      parentFills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }],
      fontSize: 14,
    },
  ];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("TEXT以外のノードはスキップする", () => {
  const nodes: FigmaNodeInfo[] = [
    {
      id: "node1",
      name: "Frame",
      type: "FRAME",
      fills: [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }],
    },
  ];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("fillsがないテキストノードはスキップする", () => {
  const nodes: FigmaNodeInfo[] = [
    {
      id: "node1",
      name: "Text",
      type: "TEXT",
      fontSize: 14,
    },
  ];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("figmaNodesが未定義の場合は空配列を返す", () => {
  const issues = rule.check({ config: DEFAULT_A11Y_CONFIG });
  expect(issues).toHaveLength(0);
});
