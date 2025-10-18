/**
 * @fileoverview DdConverter のテスト
 */

import { test, expect } from "vitest";
import { DdConverter } from "../dd-converter";
import { DdElement } from "../../dd-element";

test("DdConverter.toFigmaNode: converts dd element to Figma frame node", () => {
  const converter = new DdConverter();
  const element = DdElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("dd");
  expect(node.layoutMode).toBe("VERTICAL");
  expect(node.layoutSizingHorizontal).toBe("FILL");
  expect(node.layoutSizingVertical).toBe("HUG");
});

test("DdConverter.toFigmaNode: applies default indent", () => {
  const converter = new DdConverter();
  const element = DdElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.paddingLeft).toBe(40); // DEFAULT_INDENT
});

test("DdConverter.toFigmaNode: handles ID attribute", () => {
  const converter = new DdConverter();
  const element = DdElement.create({ id: "description-1" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("dd#description-1");
});

test("DdConverter.toFigmaNode: handles class attribute", () => {
  const converter = new DdConverter();
  const element = DdElement.create({ class: "description definition" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("dd.description");
});

test("DdConverter.toFigmaNode: applies style attributes", () => {
  const converter = new DdConverter();
  const element = DdElement.create({
    style: "padding: 15px; background-color: #fafafa;",
  });
  const node = converter.toFigmaNode(element);

  expect(node.paddingTop).toBe(15);
  expect(node.paddingBottom).toBe(15);
  expect(node.paddingLeft).toBe(15);
  expect(node.paddingRight).toBe(15);
  expect(node.fills).toBeDefined();
  expect(node.fills?.[0].type).toBe("SOLID");
});

test("DdConverter.toFigmaNode: applies custom padding-left", () => {
  const converter = new DdConverter();
  const element = DdElement.create({
    style: "padding-left: 60px;",
  });
  const node = converter.toFigmaNode(element);

  expect(node.paddingLeft).toBe(60);
});

test("DdConverter.mapToFigma: converts DdElement", () => {
  const converter = new DdConverter();
  const element = DdElement.create();
  const result = converter.mapToFigma(element);

  expect(result).toBeDefined();
  expect(result?.name).toBe("dd");
  expect(result?.type).toBe("FRAME");
});

test("DdConverter.mapToFigma: converts HTMLNode format dd element", () => {
  const converter = new DdConverter();
  const node = {
    type: "element",
    tagName: "dd",
    attributes: { id: "def" },
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("dd#def");
  expect(result?.type).toBe("FRAME");
});

test("DdConverter.mapToFigma: handles HTMLNode without attributes", () => {
  const converter = new DdConverter();
  const node = {
    type: "element",
    tagName: "dd",
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("dd");
});

test("DdConverter.mapToFigma: returns null for non-dd elements", () => {
  const converter = new DdConverter();
  const node = {
    type: "element",
    tagName: "dt",
    attributes: {},
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeNull();
});

test("DdConverter.mapToFigma: returns null for invalid nodes", () => {
  const converter = new DdConverter();

  expect(converter.mapToFigma(null)).toBeNull();
  expect(converter.mapToFigma(undefined)).toBeNull();
  expect(converter.mapToFigma("string")).toBeNull();
  expect(converter.mapToFigma(123)).toBeNull();
  expect(converter.mapToFigma({})).toBeNull();
});
