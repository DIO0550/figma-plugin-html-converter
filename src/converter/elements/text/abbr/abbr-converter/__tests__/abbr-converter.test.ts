import { test, expect } from "vitest";
import { AbbrConverter } from "../abbr-converter";
import type { AbbrElement } from "../../abbr-element";

test("AbbrConverter.toFigmaNode - 基本的なabbr要素の場合 - TEXTノードに変換する", () => {
  const element: AbbrElement = {
    type: "element",
    tagName: "abbr",
    attributes: {},
    children: [],
  };

  const result = AbbrConverter.toFigmaNode(element);

  expect(result.type).toBe("TEXT");
  expect(result.name).toBe("abbr");
  expect(result.content).toBe("");
  expect(result.style).toEqual({
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: { unit: "PIXELS", value: 24 },
    letterSpacing: 0,
    textAlign: "LEFT",
    verticalAlign: "TOP",
    textDecoration: "UNDERLINE",
  });
});

test("AbbrConverter.toFigmaNode - テキストコンテンツを持つabbr要素の場合 - コンテンツを正しく変換する", () => {
  const element: AbbrElement = {
    type: "element",
    tagName: "abbr",
    attributes: { title: "HyperText Markup Language" },
    children: [{ type: "text", textContent: "HTML" }],
  };

  const result = AbbrConverter.toFigmaNode(element);

  expect(result.content).toBe("HTML");
});

test("AbbrConverter.toFigmaNode - title属性がある場合 - ノード名に含める", () => {
  const element: AbbrElement = {
    type: "element",
    tagName: "abbr",
    attributes: { title: "HyperText Markup Language" },
    children: [],
  };

  const result = AbbrConverter.toFigmaNode(element);

  expect(result.name).toBe("abbr [HyperText Markup Language]");
});

test("AbbrConverter.toFigmaNode - ID属性がある場合 - ノード名に反映する", () => {
  const element: AbbrElement = {
    type: "element",
    tagName: "abbr",
    attributes: { id: "html-abbr" },
    children: [],
  };

  const result = AbbrConverter.toFigmaNode(element);

  expect(result.name).toBe("abbr#html-abbr");
});

test("AbbrConverter.toFigmaNode - IDとtitle両方がある場合 - 両方をノード名に含める", () => {
  const element: AbbrElement = {
    type: "element",
    tagName: "abbr",
    attributes: {
      id: "html-abbr",
      title: "HyperText Markup Language",
    },
    children: [],
  };

  const result = AbbrConverter.toFigmaNode(element);

  expect(result.name).toBe("abbr#html-abbr [HyperText Markup Language]");
});

test("AbbrConverter.toFigmaNode - text-decorationをオーバーライドした場合 - スタイルが上書きされる", () => {
  const element: AbbrElement = {
    type: "element",
    tagName: "abbr",
    attributes: { style: "text-decoration: line-through" },
    children: [],
  };

  const result = AbbrConverter.toFigmaNode(element);

  // デフォルトのUNDERLINEがline-through（STRIKETHROUGH）でオーバーライドされることを確認
  expect(result.style?.textDecoration).toBe("STRIKETHROUGH");
});

test("AbbrConverter.toFigmaNode - text-decoration: noneを指定した場合 - デフォルトの下線が削除される", () => {
  const element: AbbrElement = {
    type: "element",
    tagName: "abbr",
    attributes: { style: "text-decoration: none" },
    children: [],
  };

  const result = AbbrConverter.toFigmaNode(element);

  // デフォルトのUNDERLINEがnoneで削除されることを確認
  expect(result.style?.textDecoration).toBeUndefined();
});

test("AbbrConverter.mapToFigma - abbr要素の場合 - 正しく変換する", () => {
  const element = {
    type: "element",
    tagName: "abbr",
    attributes: {},
    children: [],
  };

  const result = AbbrConverter.mapToFigma(element);

  expect(result).not.toBeNull();
  expect(result?.type).toBe("TEXT");
});

test("AbbrConverter.mapToFigma - abbr要素でない場合 - nullを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  const result = AbbrConverter.mapToFigma(element);

  expect(result).toBeNull();
});

test("AbbrConverter.mapToFigma - nullを渡した場合 - nullを返す", () => {
  const result = AbbrConverter.mapToFigma(null);
  expect(result).toBeNull();
});
