import { test, expect } from "vitest";
import { toFigmaNode } from "../heading-converter";
import type { H1Element } from "../../h1/h1-element";
import type { H2Element } from "../../h2/h2-element";
import type { H3Element } from "../../h3/h3-element";
import type { H4Element } from "../../h4/h4-element";
import type { H5Element } from "../../h5/h5-element";
import type { H6Element } from "../../h6/h6-element";

test("toFigmaNode - h1要素をFigmaノードに変換できる", () => {
  const element: H1Element = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [{ type: "text", textContent: "Main Title" }],
  };

  const result = toFigmaNode(element);

  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("h1");
  expect(result.children).toHaveLength(1);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Main Title",
    style: {
      fontSize: 32,
      fontWeight: 700,
    },
  });
});

test("toFigmaNode - h2要素を適切なフォントサイズで変換できる", () => {
  const element: H2Element = {
    type: "element",
    tagName: "h2",
    attributes: {},
    children: [{ type: "text", textContent: "Section Title" }],
  };

  const result = toFigmaNode(element);

  expect(result.name).toBe("h2");
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Section Title",
    style: {
      fontSize: 24,
      fontWeight: 700,
    },
  });
});

test("toFigmaNode - h3要素を適切なフォントサイズで変換できる", () => {
  const element: H3Element = {
    type: "element",
    tagName: "h3",
    attributes: {},
    children: [{ type: "text", textContent: "Subsection" }],
  };

  const result = toFigmaNode(element);

  expect(result.name).toBe("h3");
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Subsection",
    style: {
      fontSize: 19,
      fontWeight: 700,
    },
  });
});

test("toFigmaNode - h4要素を適切なフォントサイズで変換できる", () => {
  const element: H4Element = {
    type: "element",
    tagName: "h4",
    attributes: {},
    children: [{ type: "text", textContent: "Paragraph Title" }],
  };

  const result = toFigmaNode(element);

  expect(result.name).toBe("h4");
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Paragraph Title",
    style: {
      fontSize: 16,
      fontWeight: 700,
    },
  });
});

test("toFigmaNode - h5要素を適切なフォントサイズで変換できる", () => {
  const element: H5Element = {
    type: "element",
    tagName: "h5",
    attributes: {},
    children: [{ type: "text", textContent: "Minor Heading" }],
  };

  const result = toFigmaNode(element);

  expect(result.name).toBe("h5");
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Minor Heading",
    style: {
      fontSize: 13,
      fontWeight: 700,
    },
  });
});

test("toFigmaNode - h6要素を適切なフォントサイズで変換できる", () => {
  const element: H6Element = {
    type: "element",
    tagName: "h6",
    attributes: {},
    children: [{ type: "text", textContent: "Small Heading" }],
  };

  const result = toFigmaNode(element);

  expect(result.name).toBe("h6");
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Small Heading",
    style: {
      fontSize: 11,
      fontWeight: 700,
    },
  });
});

test("toFigmaNode - インライン要素を含む見出しを変換できる", () => {
  const element: H1Element = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [
      { type: "text", textContent: "Welcome to " },
      {
        type: "element",
        tagName: "strong",
        attributes: {},
        children: [{ type: "text", textContent: "Figma" }],
      },
      { type: "text", textContent: " Converter" },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children).toHaveLength(3);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Welcome to ",
  });
  expect(result.children![1]).toMatchObject({
    type: "TEXT",
    content: "Figma",
    style: {
      fontWeight: 700,
    },
  });
  expect(result.children![2]).toMatchObject({
    type: "TEXT",
    content: " Converter",
  });
});

test("toFigmaNode - スタイル属性を適用できる", () => {
  const element: H1Element = {
    type: "element",
    tagName: "h1",
    attributes: {
      style: "color: #ff0000; text-align: center;",
    },
    children: [{ type: "text", textContent: "Styled Heading" }],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Styled Heading",
    style: {
      textAlign: "CENTER",
      fills: [
        {
          type: "SOLID",
          color: {
            r: 1,
            g: 0,
            b: 0,
            a: 1,
          },
        },
      ],
    },
  });
});
