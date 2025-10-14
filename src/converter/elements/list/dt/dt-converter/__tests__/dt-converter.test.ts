/**
 * @fileoverview DtConverter のテスト
 */

import { test, expect } from "vitest";
import { DtConverter } from "../dt-converter";
import { DtElement } from "../../dt-element";

test("DtConverter.toFigmaNode: converts dt element to Figma frame node", () => {
  const converter = new DtConverter();
  const element = DtElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("dt");
  expect(node.layoutMode).toBe("VERTICAL");
  expect(node.layoutSizingHorizontal).toBe("FILL");
  expect(node.layoutSizingVertical).toBe("HUG");
});

test("DtConverter.toFigmaNode: handles ID attribute", () => {
  const converter = new DtConverter();
  const element = DtElement.create({ id: "term-1" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("dt#term-1");
});

test("DtConverter.toFigmaNode: handles class attribute", () => {
  const converter = new DtConverter();
  const element = DtElement.create({ class: "term glossary-term" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("dt.term");
});

test("DtConverter.toFigmaNode: applies style attributes", () => {
  const converter = new DtConverter();
  const element = DtElement.create({
    style: "padding: 10px; background-color: #e0e0e0;",
  });
  const node = converter.toFigmaNode(element);

  expect(node.paddingTop).toBe(10);
  expect(node.paddingBottom).toBe(10);
  expect(node.paddingLeft).toBe(10);
  expect(node.paddingRight).toBe(10);
  expect(node.fills).toBeDefined();
  expect(node.fills?.[0].type).toBe("SOLID");
});

test("DtConverter.mapToFigma: converts DtElement", () => {
  const converter = new DtConverter();
  const element = DtElement.create();
  const result = converter.mapToFigma(element);

  expect(result).toBeDefined();
  expect(result?.name).toBe("dt");
  expect(result?.type).toBe("FRAME");
});

test("DtConverter.mapToFigma: converts HTMLNode format dt element", () => {
  const converter = new DtConverter();
  const node = {
    type: "element",
    tagName: "dt",
    attributes: { id: "term" },
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("dt#term");
  expect(result?.type).toBe("FRAME");
});

test("DtConverter.mapToFigma: handles HTMLNode without attributes", () => {
  const converter = new DtConverter();
  const node = {
    type: "element",
    tagName: "dt",
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("dt");
});

test("DtConverter.mapToFigma: returns null for non-dt elements", () => {
  const converter = new DtConverter();
  const node = {
    type: "element",
    tagName: "dd",
    attributes: {},
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeNull();
});

test("DtConverter.mapToFigma: returns null for invalid nodes", () => {
  const converter = new DtConverter();

  expect(converter.mapToFigma(null)).toBeNull();
  expect(converter.mapToFigma(undefined)).toBeNull();
  expect(converter.mapToFigma("string")).toBeNull();
  expect(converter.mapToFigma(123)).toBeNull();
  expect(converter.mapToFigma({})).toBeNull();
});
