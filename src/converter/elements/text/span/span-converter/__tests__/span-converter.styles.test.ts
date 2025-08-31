import { test, expect } from "vitest";
import { SpanConverter } from "../span-converter";
import type { SpanElement } from "../../span-element";

test("font-size: 24pxスタイルをSpanConverterは24として適用する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-size: 24px;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.style.fontSize).toBe(24);
});

test("font-weight: boldをSpanConverterは700として適用する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-weight: bold;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.style.fontWeight).toBe(700);
});

test("font-weight: 700をSpanConverterは700として適用する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-weight: 700;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.style.fontWeight).toBe(700);
});

test("font-style: italicをSpanConverterはitalicとして適用する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-style: italic;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.style.fontStyle).toBe("italic");
});

test("font-family: 'Helvetica Neue'をSpanConverterはHelvetica Neueとして適用する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-family: 'Helvetica Neue';",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.style.fontFamily).toBe("Helvetica Neue");
});

test("text-decoration: underlineをSpanConverterは無視してスタイルオブジェクトは生成する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "text-decoration: underline;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  // text-decorationはTextStyleでサポートされていないため、スキップ
  expect(result.style).toBeDefined();
});

test("text-decoration: line-throughをSpanConverterは無視してスタイルオブジェクトは生成する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "text-decoration: line-through;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  // text-decorationはTextStyleでサポートされていないため、スキップ
  expect(result.style).toBeDefined();
});

test("text-transform: uppercaseをSpanConverterは無視してスタイルオブジェクトは生成する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "text-transform: uppercase;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  // text-transformはTextStyleでサポートされていないため、スキップ
  expect(result.style).toBeDefined();
});

test("text-transform: lowercaseをSpanConverterは無視してスタイルオブジェクトは生成する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "text-transform: lowercase;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  // text-transformはTextStyleでサポートされていないため、スキップ
  expect(result.style).toBeDefined();
});

test("text-transform: capitalizeをSpanConverterは無視してスタイルオブジェクトは生成する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "text-transform: capitalize;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  // text-transformはTextStyleでサポートされていないため、スキップ
  expect(result.style).toBeDefined();
});

test("color: #FF0000スタイルをSpanConverterはRGB(1,0,0)のfillsとして適用する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "color: #FF0000;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: {
        r: 1,
        g: 0,
        b: 0,
        a: 1,
      },
    },
  ]);
});

test("background-color: yellowをSpanConverterは無視してfillsをundefinedのままにする", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "background-color: yellow;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);

  // TEXTノードではbackground-colorは適用されない
  expect(result.style.fills).toBeUndefined();
});

test("複数のスタイル（font-size、font-weight、color）をSpanConverterは同時に適用する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style:
        "font-size: 20px; font-weight: bold; color: #333333; text-decoration: underline;",
    },
    children: [
      {
        type: "text",
        textContent: "Styled text",
      },
    ],
  };

  const result = SpanConverter.toFigmaNode(element);

  expect(result).toMatchObject({
    type: "TEXT",
    content: "Styled text",
    style: {
      fontSize: 20,
      fontWeight: 700,
      fills: [
        {
          type: "SOLID",
          color: {
            r: 0.2,
            g: 0.2,
            b: 0.2,
            a: 1,
          },
        },
      ],
    },
  });
});
