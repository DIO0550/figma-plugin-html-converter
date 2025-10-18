/**
 * @fileoverview LiElement ファクトリーメソッドのテスト
 */

import { test, expect } from "vitest";
import { LiElement } from "../li-element";

test("LiElement.create: creates default LiElement", () => {
  const element = LiElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "li",
    attributes: {},
    children: [],
  });
});

test("LiElement.create: creates LiElement with attributes", () => {
  const attributes = {
    id: "item-1",
    class: "list-item",
    value: "3",
  };
  const element = LiElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("LiElement.create: creates LiElement with children", () => {
  const children = [{ type: "text" as const, content: "List item content" }];
  const element = LiElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("LiElement.create: creates LiElement with value attribute", () => {
  const element = LiElement.create({ value: "10" });

  expect(element.attributes.value).toBe("10");
});

test("LiElement.create: creates LiElement with multiple attributes and children", () => {
  const attributes = {
    id: "special-item",
    class: "highlighted",
    style: "font-weight: bold;",
    value: "5",
  };
  const children = [{ type: "text" as const, content: "Important item" }];
  const element = LiElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
