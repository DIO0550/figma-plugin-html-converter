import { test, expect } from "vitest";
import { VarConverter } from "../var-converter";
import type { VarElement } from "../../var-element";

test("VarConverter.toFigmaNode - 基本的なvar要素 - TEXTノードに変換する（イタリック体）", () => {
  const element: VarElement = {
    type: "element",
    tagName: "var",
    attributes: {},
    children: [],
  };

  const result = VarConverter.toFigmaNode(element);

  expect(result.type).toBe("TEXT");
  expect(result.name).toBe("var");
  expect(result.content).toBe("");
  expect(result.style?.fontStyle).toBe("ITALIC");
});

test("VarConverter.toFigmaNode - テキストコンテンツを持つvar要素 - 正しく変換する", () => {
  const element: VarElement = {
    type: "element",
    tagName: "var",
    attributes: {},
    children: [{ type: "text", textContent: "x" }],
  };

  const result = VarConverter.toFigmaNode(element);

  expect(result.content).toBe("x");
});

test("VarConverter.toFigmaNode - ID属性がある場合 - ノード名に反映する", () => {
  const element: VarElement = {
    type: "element",
    tagName: "var",
    attributes: { id: "variable-x" },
    children: [],
  };

  const result = VarConverter.toFigmaNode(element);

  expect(result.name).toBe("var#variable-x");
});

test("VarConverter.toFigmaNode - font-style: normalのスタイル属性 - font-styleをオーバーライドできる", () => {
  const element: VarElement = {
    type: "element",
    tagName: "var",
    attributes: { style: "font-style: normal" },
    children: [],
  };

  const result = VarConverter.toFigmaNode(element);

  expect(result.style?.fontStyle).toBeUndefined();
});

test("VarConverter.mapToFigma - var要素の場合 - 正しく変換する", () => {
  const element = {
    type: "element",
    tagName: "var",
    attributes: {},
    children: [],
  };

  const result = VarConverter.mapToFigma(element);

  expect(result).not.toBeNull();
  expect(result?.type).toBe("TEXT");
});

test("VarConverter.mapToFigma - var要素でない場合 - nullを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  const result = VarConverter.mapToFigma(element);

  expect(result).toBeNull();
});

test("VarConverter.mapToFigma - nullを渡した場合 - nullを返す", () => {
  const result = VarConverter.mapToFigma(null);
  expect(result).toBeNull();
});
