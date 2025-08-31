import { test, expect } from "vitest";
import { SpanConverter } from "../span-converter";
import type { SpanElement } from "../../span-element";

test("基本的なspan要素をSpanConverter.toFigmaNodeはTEXTノードに変換する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

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

test("テキストコンテンツを持つspan要素をSpanConverter.toFigmaNodeは正しく変換する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Hello World",
      },
    ],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result).toEqual({
    type: "TEXT",
    name: "span",
    content: "Hello World",
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

test("複数のテキストノードをSpanConverter.toFigmaNodeは結合して単一のcontentにする", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Hello ",
      },
      {
        type: "text",
        textContent: "World",
      },
    ],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.content).toBe("Hello World");
});

test("ID属性をSpanConverter.toFigmaNodeはname属性に#付きで反映する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      id: "highlight-text",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.name).toBe("span#highlight-text");
});

test("class属性をSpanConverter.toFigmaNodeはname属性に.付きで反映する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      class: "bold italic",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.name).toBe("span.bold.italic");
});

test("IDとclass両方をSpanConverter.toFigmaNodeはname属性に正しく反映する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      id: "main-text",
      class: "highlight",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.name).toBe("span#main-text.highlight");
});

test("ネストされた要素のテキストもSpanConverter.toFigmaNodeは再帰的に抽出する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "This is ",
      },
      {
        type: "element",
        tagName: "strong",
        attributes: {},
        children: [
          {
            type: "text",
            textContent: "important",
          },
        ],
      },
      {
        type: "text",
        textContent: " text",
      },
    ],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.content).toBe("This is important text");
});

test("空のspan要素をSpanConverter.toFigmaNodeは空文字を持つTEXTノードに変換する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.type).toBe("TEXT");
  expect(result.content).toBe("");
});
