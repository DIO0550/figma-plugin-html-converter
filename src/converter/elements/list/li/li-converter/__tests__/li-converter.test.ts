/**
 * @fileoverview LiConverter のテスト
 */

import { test, expect } from "vitest";
import { LiConverter } from "../li-converter";
import { LiElement, type ListContext } from "../../li-element";

test("LiConverter.toFigmaNode: converts li element to Figma frame node", () => {
  const converter = new LiConverter();
  const element = LiElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("li");
  expect(node.layoutMode).toBe("HORIZONTAL");
  expect(node.itemSpacing).toBe(8); // DEFAULT_MARKER_SPACING
  expect(node.layoutSizingHorizontal).toBe("FILL");
  expect(node.layoutSizingVertical).toBe("HUG");
  expect(node.children).toHaveLength(2); // マーカーとコンテンツ
});

test("LiConverter.toFigmaNode: creates bullet marker for UL context", () => {
  const converter = new LiConverter();
  const element = LiElement.create();
  const context: ListContext = { listType: "ul" };
  const node = converter.toFigmaNode(element, context);

  expect(node.children).toHaveLength(2);
  expect(node.children![0].name).toBe("marker");
  expect(node.children![1].name).toBe("content");
});

test("LiConverter.toFigmaNode: creates number marker for OL context", () => {
  const converter = new LiConverter();
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 0,
    type: "1",
  };
  const node = converter.toFigmaNode(element, context);

  expect(node.children).toHaveLength(2);
  expect(node.children![0].name).toBe("marker");
  expect(node.children![1].name).toBe("content");
});

test("LiConverter.toFigmaNode: handles ID attribute", () => {
  const converter = new LiConverter();
  const element = LiElement.create({ id: "item-1" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("li#item-1");
});

test("LiConverter.toFigmaNode: handles class attribute", () => {
  const converter = new LiConverter();
  const element = LiElement.create({ class: "list-item active" });
  const node = converter.toFigmaNode(element);

  expect(node.name).toBe("li.list-item");
});

test("LiConverter.toFigmaNode: applies style attributes", () => {
  const converter = new LiConverter();
  const element = LiElement.create({
    style: "padding: 10px; background-color: #f0f0f0;",
  });
  const node = converter.toFigmaNode(element);

  expect(node.paddingTop).toBe(10);
  expect(node.paddingBottom).toBe(10);
  expect(node.paddingLeft).toBe(10);
  expect(node.paddingRight).toBe(10);
  expect(node.fills).toBeDefined();
  expect(node.fills?.[0].type).toBe("SOLID");
});

test("LiConverter.toFigmaNode: works without context (defaults to UL)", () => {
  const converter = new LiConverter();
  const element = LiElement.create();
  const node = converter.toFigmaNode(element);

  expect(node.children).toHaveLength(2);
  // デフォルトではULとして扱われる
});

test("LiConverter.createMarker: creates bullet marker for UL context", () => {
  const converter = new LiConverter();
  const element = LiElement.create();
  const context: ListContext = { listType: "ul" };
  const marker = converter.createMarker(element, context);

  expect(marker.name).toBe("marker");
  expect(marker.width).toBe(24); // DEFAULT_MARKER_WIDTH
  expect(marker.layoutMode).toBe("HORIZONTAL");
  expect(marker.children).toHaveLength(1);
  expect(marker.children![0].name).toBe("bullet");
  expect(marker.children![0].type).toBe("RECTANGLE");
});

test("LiConverter.createMarker: creates number marker for OL context", () => {
  const converter = new LiConverter();
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 0,
    type: "1",
  };
  const marker = converter.createMarker(element, context);

  expect(marker.name).toBe("marker");
  expect(marker.width).toBe(24); // DEFAULT_MARKER_WIDTH
  expect(marker.layoutMode).toBe("HORIZONTAL");
  expect(marker.primaryAxisAlignItems).toBe("MAX"); // 右揃え
  expect(marker.children).toHaveLength(1);
  expect(marker.children![0].name).toBe("marker");
  expect(marker.children![0].type).toBe("TEXT");
});

test("LiConverter.createMarker: defaults to UL marker without context", () => {
  const converter = new LiConverter();
  const element = LiElement.create();
  const marker = converter.createMarker(element);

  expect(marker.name).toBe("marker");
  expect(marker.children).toHaveLength(1);
  expect(marker.children![0].name).toBe("bullet");
});

test("LiConverter.createMarker: handles different OL marker types", () => {
  const converter = new LiConverter();
  const element = LiElement.create();
  const contexts: ListContext[] = [
    { listType: "ol", index: 0, type: "a" },
    { listType: "ol", index: 0, type: "A" },
    { listType: "ol", index: 0, type: "i" },
    { listType: "ol", index: 0, type: "I" },
  ];

  contexts.forEach((context) => {
    const marker = converter.createMarker(element, context);
    expect(marker.children).toHaveLength(1);
    expect(marker.children![0].name).toBe("marker");
    expect(marker.children![0].type).toBe("TEXT");
  });
});

test("LiConverter.mapToFigma: converts LiElement", () => {
  const converter = new LiConverter();
  const element = LiElement.create();
  const result = converter.mapToFigma(element);

  expect(result).toBeDefined();
  expect(result?.name).toBe("li");
  expect(result?.type).toBe("FRAME");
});

test("LiConverter.mapToFigma: converts HTMLNode format li element", () => {
  const converter = new LiConverter();
  const node = {
    type: "element",
    tagName: "li",
    attributes: {
      id: "item",
      value: "3",
    },
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("li#item");
  expect(result?.type).toBe("FRAME");
});

test("LiConverter.mapToFigma: converts HTMLNode with context", () => {
  const converter = new LiConverter();
  const node = {
    type: "element",
    tagName: "li",
    attributes: {},
    children: [],
  };
  const context: ListContext = {
    listType: "ol",
    index: 2,
  };
  const result = converter.mapToFigma(node, context);

  expect(result).toBeDefined();
  expect(result?.children).toHaveLength(2);
});

test("LiConverter.mapToFigma: handles HTMLNode without attributes", () => {
  const converter = new LiConverter();
  const node = {
    type: "element",
    tagName: "li",
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.name).toBe("li");
});

test("LiConverter.mapToFigma: returns null for non-li elements", () => {
  const converter = new LiConverter();
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };
  const result = converter.mapToFigma(node);

  expect(result).toBeNull();
});

test("LiConverter.mapToFigma: returns null for invalid nodes", () => {
  const converter = new LiConverter();

  expect(converter.mapToFigma(null)).toBeNull();
  expect(converter.mapToFigma(undefined)).toBeNull();
  expect(converter.mapToFigma("string")).toBeNull();
  expect(converter.mapToFigma(123)).toBeNull();
  expect(converter.mapToFigma({})).toBeNull();
});

test("LiConverter.mapToFigma: handles OL context with type attribute", () => {
  const converter = new LiConverter();
  const node = {
    type: "element",
    tagName: "li",
    attributes: { class: "item" },
    children: [],
  };
  const context: ListContext = {
    listType: "ol",
    index: 3,
    type: "A",
  };
  const result = converter.mapToFigma(node, context);

  expect(result).toBeDefined();
  expect(result?.name).toBe("li.item");
  expect(result?.children).toHaveLength(2);
});
