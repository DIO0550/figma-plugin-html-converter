import { test, expect } from "vitest";
import { ThElement } from "../th-element";

test("有効なth要素を正しく判定できる", () => {
  const element = {
    type: "element",
    tagName: "th",
    attributes: {},
    children: [],
  };

  expect(ThElement.isThElement(element)).toBe(true);
});

test("属性を持つth要素を正しく判定できる", () => {
  const element = {
    type: "element",
    tagName: "th",
    attributes: { scope: "col", width: "100px" },
    children: [],
  };

  expect(ThElement.isThElement(element)).toBe(true);
});

test("typeがelementでない場合はfalseを返す", () => {
  const element = {
    type: "text",
    tagName: "th",
    attributes: {},
    children: [],
  };

  expect(ThElement.isThElement(element)).toBe(false);
});

test("tagNameがthでない場合はfalseを返す", () => {
  const element = {
    type: "element",
    tagName: "td",
    attributes: {},
    children: [],
  };

  expect(ThElement.isThElement(element)).toBe(false);
});

test.each([
  [null, false],
  [undefined, false],
  ["th", false],
  [123, false],
  [true, false],
  [[], false],
  [{}, false],
  [{ type: "element" }, false],
  [{ tagName: "th" }, false],
  [{ type: "element", tagName: "th" }, true], // attributesとchildrenはオプショナル
  [{ type: "element", tagName: "th", attributes: {}, children: [] }, true],
])("isThElement(%p)は%pを返す", (input, expected) => {
  expect(ThElement.isThElement(input)).toBe(expected);
});
