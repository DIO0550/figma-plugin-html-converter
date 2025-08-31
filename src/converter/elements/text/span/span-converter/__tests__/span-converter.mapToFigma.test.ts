import { test, expect } from "vitest";
import { SpanConverter } from "../span-converter";

test("span要素をSpanConverter.mapToFigmaは正しくFigmaノードにマッピングする", () => {
  const node = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  const result = SpanConverter.mapToFigma(node);

  expect(result).toEqual({
    type: "TEXT",
    name: "span",
    content: "",
    style: {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: {
        unit: "PIXELS",
        value: 24,
      },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "TOP",
    },
  });
});

test("テキストコンテンツを持つspan要素をSpanConverter.mapToFigmaは正しくマッピングする", () => {
  const node = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Sample text",
      },
    ],
  };

  const result = SpanConverter.mapToFigma(node);

  expect(result).toEqual({
    type: "TEXT",
    name: "span",
    content: "Sample text",
    style: {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: {
        unit: "PIXELS",
        value: 24,
      },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "TOP",
    },
  });
});

test("span要素でない場合SpanConverter.mapToFigmaはnullを返す", () => {
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  const result = SpanConverter.mapToFigma(node);

  expect(result).toBeNull();
});

test("typeがelementでない場合SpanConverter.mapToFigmaはnullを返す", () => {
  const node = {
    type: "text",
    content: "text node",
  };

  const result = SpanConverter.mapToFigma(node);

  expect(result).toBeNull();
});

test("tagNameがspan以外の場合SpanConverter.mapToFigmaはnullを返す", () => {
  const node = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [],
  };

  const result = SpanConverter.mapToFigma(node);

  expect(result).toBeNull();
});

test("属性付きspan要素をSpanConverter.mapToFigmaは正しくマッピングする", () => {
  const node = {
    type: "element",
    tagName: "span",
    attributes: {
      id: "test-span",
      class: "highlight",
      style: "font-size: 18px; color: blue;",
    },
    children: [
      {
        type: "text",
        textContent: "Styled span",
      },
    ],
  };

  const result = SpanConverter.mapToFigma(node);

  expect(result).toMatchObject({
    type: "TEXT",
    name: "span#test-span.highlight",
    content: "Styled span",
    style: {
      fontSize: 18,
    },
  });
});

test("nullまたはundefinedの場合SpanConverter.mapToFigmaはnullを返す", () => {
  expect(SpanConverter.mapToFigma(null)).toBeNull();
  expect(SpanConverter.mapToFigma(undefined)).toBeNull();
});

test("不正な構造のオブジェクトの場合SpanConverter.mapToFigmaはnullを返す", () => {
  const invalidNode = {
    notAType: "element",
    notATagName: "span",
  };

  const result = SpanConverter.mapToFigma(invalidNode);

  expect(result).toBeNull();
});
