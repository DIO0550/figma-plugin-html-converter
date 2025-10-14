/**
 * @fileoverview OlConverter のテスト
 */

import { test, expect } from "vitest";
import { OlConverter } from "../ol-converter";
import { OlElement } from "../../ol-element";

test("OlConverter.toFigmaNode: converts ol element to Figma frame node", () => {
  const converter = new OlConverter();
  const element = OlElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("ol");
  expect(node.layoutMode).toBe("VERTICAL");
  expect(node.itemSpacing).toBe(8);
});

test("OlConverter.toFigmaNode: applies default padding for list", () => {
  const converter = new OlConverter();
  const element = OlElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.paddingLeft).toBe(40); // DEFAULT_LIST_INDENT
  expect(node.paddingTop).toBe(16);
  expect(node.paddingBottom).toBe(16);
  expect(node.paddingRight).toBe(0);
});

test("OlConverter.toFigmaNode: handles ID attribute", () => {
  const converter = new OlConverter();
  const element = OlElement.create({ id: "main-list" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("ol#main-list");
});

test("OlConverter.toFigmaNode: handles class attribute", () => {
  const converter = new OlConverter();
  const element = OlElement.create({ class: "ordered-list primary" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("ol.ordered-list");
});

test("OlConverter.toFigmaNode: handles start attribute", () => {
  const converter = new OlConverter();
  const element = OlElement.create({ start: "5" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("ol (start=5)");
});

test("OlConverter.toFigmaNode: handles reversed attribute", () => {
  const converter = new OlConverter();
  const element = OlElement.create({ reversed: "" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("ol (reversed)");
});

test("OlConverter.toFigmaNode: handles multiple attributes", () => {
  const converter = new OlConverter();
  const element = OlElement.create({
    id: "custom-list",
    start: "10",
    reversed: "",
  });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("ol#custom-list (start=10) (reversed)");
});

test("OlConverter.toFigmaNode: applies style attributes", () => {
  const converter = new OlConverter();
  const element = OlElement.create({
    style: "padding-left: 60px; padding-top: 20px;",
  });
  const node = converter.toFigmaNode(element);

  expect(node.paddingLeft).toBe(60);
  expect(node.paddingTop).toBe(20);
});

test("OlConverter.toFigmaNode: applies background color from styles", () => {
  const converter = new OlConverter();
  const element = OlElement.create({
    style: "background-color: #f0f0f0;",
  });
  const node = converter.toFigmaNode(element);

  expect(node.fills).toBeDefined();
  expect(node.fills?.[0].type).toBe("SOLID");
});

test("OlConverter.toFigmaNode: applies margin-bottom as item spacing", () => {
  const converter = new OlConverter();
  const element = OlElement.create({
    style: "margin-bottom: 16px;",
  });
  const node = converter.toFigmaNode(element);

  expect(node.itemSpacing).toBe(16);
});

test("OlConverter.mapToFigma: converts OlElement", () => {
  const converter = new OlConverter();
  const element = OlElement.create();
  const result = converter.mapToFigma(element);

  expect(result).toBeDefined();
  expect(result?.name).toBe("ol");
  expect(result?.type).toBe("FRAME");
});

test("OlConverter.mapToFigma: converts HTMLNode format ol element", () => {
  const converter = new OlConverter();
  const node = {
    type: "element",
    tagName: "ol",
    attributes: {
      id: "list",
      start: "3",
    },
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("ol#list (start=3)");
  expect(result?.type).toBe("FRAME");
});

test("OlConverter.mapToFigma: handles HTMLNode without attributes", () => {
  const converter = new OlConverter();
  const node = {
    type: "element",
    tagName: "ol",
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("ol");
});

test("OlConverter.mapToFigma: returns null for non-ol elements", () => {
  const converter = new OlConverter();
  const node = {
    type: "element",
    tagName: "ul",
    attributes: {},
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeNull();
});

test("OlConverter.mapToFigma: returns null for invalid nodes", () => {
  const converter = new OlConverter();

  expect(converter.mapToFigma(null)).toBeNull();
  expect(converter.mapToFigma(undefined)).toBeNull();
  expect(converter.mapToFigma("string")).toBeNull();
  expect(converter.mapToFigma(123)).toBeNull();
  expect(converter.mapToFigma({})).toBeNull();
});

test("OlConverter.mapToFigma: handles HTMLNode with children", () => {
  const converter = new OlConverter();
  const node = {
    type: "element",
    tagName: "ol",
    attributes: { type: "a" },
    children: [
      { type: "element", tagName: "li", children: [] },
      { type: "element", tagName: "li", children: [] },
    ],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("ol");
  expect(result?.type).toBe("FRAME");
});
