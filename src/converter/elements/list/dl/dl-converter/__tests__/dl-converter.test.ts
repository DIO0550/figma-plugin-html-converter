/**
 * @fileoverview DlConverter のテスト
 */

import { test, expect } from "vitest";
import { DlConverter } from "../dl-converter";
import { DlElement } from "../../dl-element";

test("DlConverter.toFigmaNode: converts dl element to Figma frame node", () => {
  const converter = new DlConverter();
  const element = DlElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("dl");
  expect(node.layoutMode).toBe("VERTICAL");
  expect(node.itemSpacing).toBe(8); // DEFAULT_ITEM_SPACING
});

test("DlConverter.toFigmaNode: applies default padding", () => {
  const converter = new DlConverter();
  const element = DlElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.paddingTop).toBe(16); // DEFAULT_LIST_VERTICAL_PADDING
  expect(node.paddingBottom).toBe(16);
  expect(node.paddingLeft).toBe(0);
  expect(node.paddingRight).toBe(0);
});

test("DlConverter.toFigmaNode: handles ID attribute", () => {
  const converter = new DlConverter();
  const element = DlElement.create({ id: "definitions" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("dl#definitions");
});

test("DlConverter.toFigmaNode: handles class attribute", () => {
  const converter = new DlConverter();
  const element = DlElement.create({ class: "definition-list glossary" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("dl.definition-list");
});

test("DlConverter.toFigmaNode: applies style attributes", () => {
  const converter = new DlConverter();
  const element = DlElement.create({
    style: "padding: 20px; background-color: #f5f5f5;",
  });
  const node = converter.toFigmaNode(element);

  expect(node.paddingTop).toBe(20);
  expect(node.paddingBottom).toBe(20);
  expect(node.paddingLeft).toBe(20);
  expect(node.paddingRight).toBe(20);
  expect(node.fills).toBeDefined();
  expect(node.fills?.[0].type).toBe("SOLID");
});

test("DlConverter.mapToFigma: converts DlElement", () => {
  const converter = new DlConverter();
  const element = DlElement.create();
  const result = converter.mapToFigma(element);

  expect(result).toBeDefined();
  expect(result?.name).toBe("dl");
  expect(result?.type).toBe("FRAME");
});

test("DlConverter.mapToFigma: converts HTMLNode format dl element", () => {
  const converter = new DlConverter();
  const node = {
    type: "element",
    tagName: "dl",
    attributes: { id: "glossary" },
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("dl#glossary");
  expect(result?.type).toBe("FRAME");
});

test("DlConverter.mapToFigma: handles HTMLNode without attributes", () => {
  const converter = new DlConverter();
  const node = {
    type: "element",
    tagName: "dl",
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("dl");
});

test("DlConverter.mapToFigma: returns null for non-dl elements", () => {
  const converter = new DlConverter();
  const node = {
    type: "element",
    tagName: "ul",
    attributes: {},
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeNull();
});

test("DlConverter.mapToFigma: returns null for invalid nodes", () => {
  const converter = new DlConverter();

  expect(converter.mapToFigma(null)).toBeNull();
  expect(converter.mapToFigma(undefined)).toBeNull();
  expect(converter.mapToFigma("string")).toBeNull();
  expect(converter.mapToFigma(123)).toBeNull();
  expect(converter.mapToFigma({})).toBeNull();
});
