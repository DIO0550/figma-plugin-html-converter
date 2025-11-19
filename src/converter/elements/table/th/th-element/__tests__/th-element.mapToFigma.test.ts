import { test, expect } from "vitest";
import { ThElement } from "../th-element";
import type { ThElement as ThElementType } from "../th-element";

test("ThElement型の要素を正しく変換できる", () => {
  const element: ThElementType = {
    type: "element",
    tagName: "th",
    attributes: { scope: "col" },
    children: [],
  };

  const node = ThElement.mapToFigma(element);

  expect(node).not.toBeNull();
  expect(node?.type).toBe("FRAME");
  expect(node?.name).toBe("th-col");
});

test("HTMLNode互換の構造から変換できる", () => {
  const htmlNode = {
    type: "element",
    tagName: "th",
    attributes: { scope: "row" },
  };

  const node = ThElement.mapToFigma(htmlNode);

  expect(node).not.toBeNull();
  expect(node?.type).toBe("FRAME");
  expect(node?.name).toBe("th-row");
});

test.each([
  { type: "element", tagName: "td", attributes: {} },
  { type: "text", tagName: "th", attributes: {} },
  null,
  undefined,
  "th",
  123,
  true,
])("無効な要素%pの場合はnullを返す", (input) => {
  const node = ThElement.mapToFigma(input);
  expect(node).toBeNull();
});

test("attributesがない要素でも変換できる", () => {
  const element = { type: "element", tagName: "th" };
  const node = ThElement.mapToFigma(element);

  expect(node).not.toBeNull();
  expect(node?.type).toBe("FRAME");
  expect(node?.name).toBe("th");
});

test("属性を持つHTMLNode互換構造から正しく変換される", () => {
  const htmlNode = {
    type: "element",
    tagName: "th",
    attributes: {
      scope: "col",
      id: "header-1",
      class: "header-cell",
      style: "padding: 10px; background-color: #e0e0e0;",
    },
  };

  const node = ThElement.mapToFigma(htmlNode);

  expect(node).not.toBeNull();
  expect(node?.type).toBe("FRAME");
  expect(node?.name).toBe("th#header-1");
});
