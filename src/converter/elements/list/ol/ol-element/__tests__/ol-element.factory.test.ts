/**
 * @fileoverview OlElement ファクトリーメソッドのテスト
 */

import { test, expect } from "vitest";
import { OlElement } from "../ol-element";

test("OlElement.create: creates default OlElement", () => {
  const element = OlElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "ol",
    attributes: {},
    children: [],
  });
});

test("OlElement.create: creates OlElement with attributes", () => {
  const attributes = {
    id: "my-list",
    class: "ordered-list",
    start: "5",
    type: "A" as const,
  };
  const element = OlElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("OlElement.create: creates OlElement with children", () => {
  const children = [
    { type: "text" as const, content: "Item 1" },
    { type: "text" as const, content: "Item 2" },
  ];
  const element = OlElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("OlElement.create: creates OlElement with reversed attribute", () => {
  const element = OlElement.create({ reversed: "" });

  expect(element.attributes.reversed).toBe("");
});

test("OlElement.create: creates OlElement with all list types", () => {
  const types = ["1", "a", "A", "i", "I"] as const;

  types.forEach((type) => {
    const element = OlElement.create({ type });
    expect(element.attributes.type).toBe(type);
  });
});
