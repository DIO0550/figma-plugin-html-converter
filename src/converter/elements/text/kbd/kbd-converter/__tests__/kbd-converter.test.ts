import { test, expect } from "vitest";
import { KbdConverter } from "../kbd-converter";
import type { KbdElement } from "../../kbd-element";

test("KbdConverter.toFigmaNode - 基本的なkbd要素の場合 - TEXTノードに変換する（モノスペースフォント）", () => {
  const element: KbdElement = {
    type: "element",
    tagName: "kbd",
    attributes: {},
    children: [],
  };

  const result = KbdConverter.toFigmaNode(element);

  expect(result.type).toBe("TEXT");
  expect(result.name).toBe("kbd");
  expect(result.content).toBe("");
  expect(result.style?.fontFamily).toBe("monospace");
  expect(result.style?.fontSize).toBe(14);
});

test("KbdConverter.toFigmaNode - テキストコンテンツを持つ場合 - 正しく変換する", () => {
  const element: KbdElement = {
    type: "element",
    tagName: "kbd",
    attributes: {},
    children: [{ type: "text", textContent: "Ctrl+C" }],
  };

  const result = KbdConverter.toFigmaNode(element);

  expect(result.content).toBe("Ctrl+C");
});

test("KbdConverter.toFigmaNode - ID属性がある場合 - ノード名に反映する", () => {
  const element: KbdElement = {
    type: "element",
    tagName: "kbd",
    attributes: { id: "shortcut-copy" },
    children: [],
  };

  const result = KbdConverter.toFigmaNode(element);

  expect(result.name).toBe("kbd#shortcut-copy");
});

test("KbdConverter.toFigmaNode - スタイル属性がある場合 - font-familyをオーバーライドできる", () => {
  const element: KbdElement = {
    type: "element",
    tagName: "kbd",
    attributes: { style: "font-family: Courier New" },
    children: [],
  };

  const result = KbdConverter.toFigmaNode(element);

  expect(result.style?.fontFamily).toBe("Courier New");
});

test("KbdConverter.mapToFigma - kbd要素の場合 - 正しく変換する", () => {
  const element = {
    type: "element",
    tagName: "kbd",
    attributes: {},
    children: [],
  };

  const result = KbdConverter.mapToFigma(element);

  expect(result).not.toBeNull();
  expect(result?.type).toBe("TEXT");
});

test("KbdConverter.mapToFigma - kbd要素でない場合 - nullを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  const result = KbdConverter.mapToFigma(element);

  expect(result).toBeNull();
});

test("KbdConverter.mapToFigma - nullを渡した場合 - nullを返す", () => {
  const result = KbdConverter.mapToFigma(null);
  expect(result).toBeNull();
});
