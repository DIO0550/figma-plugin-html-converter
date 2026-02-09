import { test, expect } from "vitest";
import { CiteConverter } from "../cite-converter";
import type { CiteElement } from "../../cite-element";

test("CiteConverter.toFigmaNode - 基本的なcite要素の場合 - TEXTノードに変換する（イタリック体）", () => {
  const element: CiteElement = {
    type: "element",
    tagName: "cite",
    attributes: {},
    children: [],
  };

  const result = CiteConverter.toFigmaNode(element);

  expect(result.type).toBe("TEXT");
  expect(result.name).toBe("cite");
  expect(result.content).toBe("");
  expect(result.style?.fontStyle).toBe("ITALIC");
});

test("CiteConverter.toFigmaNode - テキストコンテンツを持つcite要素の場合 - コンテンツを正しく変換する", () => {
  const element: CiteElement = {
    type: "element",
    tagName: "cite",
    attributes: {},
    children: [{ type: "text", textContent: "The Great Gatsby" }],
  };

  const result = CiteConverter.toFigmaNode(element);

  expect(result.content).toBe("The Great Gatsby");
});

test("CiteConverter.toFigmaNode - ID属性がある場合 - ノード名に反映する", () => {
  const element: CiteElement = {
    type: "element",
    tagName: "cite",
    attributes: { id: "book-title" },
    children: [],
  };

  const result = CiteConverter.toFigmaNode(element);

  expect(result.name).toBe("cite#book-title");
});

test("CiteConverter.toFigmaNode - スタイル属性でfont-style: normalの場合 - fontStyleがundefinedになる", () => {
  const element: CiteElement = {
    type: "element",
    tagName: "cite",
    attributes: { style: "font-style: normal" },
    children: [],
  };

  const result = CiteConverter.toFigmaNode(element);

  // font-style: normalの場合、FigmaではfontStyleプロパティは設定されない（undefinedになる）
  expect(result.style?.fontStyle).toBeUndefined();
});

test("CiteConverter.mapToFigma - cite要素の場合 - 正しく変換する", () => {
  const element = {
    type: "element",
    tagName: "cite",
    attributes: {},
    children: [],
  };

  const result = CiteConverter.mapToFigma(element);

  expect(result).not.toBeNull();
  expect(result?.type).toBe("TEXT");
});

test("CiteConverter.mapToFigma - cite要素でない場合 - nullを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  const result = CiteConverter.mapToFigma(element);

  expect(result).toBeNull();
});

test("CiteConverter.mapToFigma - nullを渡した場合 - nullを返す", () => {
  const result = CiteConverter.mapToFigma(null);
  expect(result).toBeNull();
});
