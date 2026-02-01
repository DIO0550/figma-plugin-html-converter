import { test, expect } from "vitest";
import { FigmaTextSizeRule } from "../figma-text-size-rule";
import type { A11yCheckContext, FigmaNodeInfo } from "../../../types";
import { DEFAULT_A11Y_CONFIG } from "../../../constants";

function createContext(figmaNodes: readonly FigmaNodeInfo[]): A11yCheckContext {
  return { figmaNodes, config: DEFAULT_A11Y_CONFIG };
}

const rule = new FigmaTextSizeRule();

// =============================================================================
// ルールメタ情報
// =============================================================================

test("ルールIDがinsufficient-text-sizeである", () => {
  expect(rule.id).toBe("insufficient-text-size");
});

test("WCAG基準が1.4.4である", () => {
  expect(rule.wcagCriterion).toBe("1.4.4");
});

// =============================================================================
// テキストサイズチェック
// =============================================================================

test("フォントサイズが最小未満のテキストノードを検出する", () => {
  const nodes: FigmaNodeInfo[] = [
    {
      id: "node1",
      name: "Small Text",
      type: "TEXT",
      fontSize: 10,
    },
  ];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(1);
  expect(issues[0].type).toBe("insufficient-text-size");
});

test("フォントサイズが最小以上のテキストノードは問題なし", () => {
  const nodes: FigmaNodeInfo[] = [
    {
      id: "node1",
      name: "Normal Text",
      type: "TEXT",
      fontSize: 14,
    },
  ];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("fontSizeがないノードはスキップする", () => {
  const nodes: FigmaNodeInfo[] = [
    {
      id: "node1",
      name: "Text",
      type: "TEXT",
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
      fontSize: 8,
    },
  ];
  const issues = rule.check(createContext(nodes));
  expect(issues).toHaveLength(0);
});

test("figmaNodesが未定義の場合は空配列を返す", () => {
  const issues = rule.check({ config: DEFAULT_A11Y_CONFIG });
  expect(issues).toHaveLength(0);
});
