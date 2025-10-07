import { test, expect } from "vitest";
import { PreElement } from "../pre-element";

test("PreElement.isPreElement - pre要素として有効なオブジェクトに対してtrueを返す", () => {
  const validPreElement = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [],
  };

  expect(PreElement.isPreElement(validPreElement)).toBe(true);
});

test("PreElement.isPreElement - type が 'element' でない場合は false を返す", () => {
  const invalidElement = {
    type: "text",
    tagName: "pre",
    attributes: {},
  };

  expect(PreElement.isPreElement(invalidElement)).toBe(false);
});

test("PreElement.isPreElement - tagName が 'pre' でない場合は false を返す", () => {
  const invalidElement = {
    type: "element",
    tagName: "code",
    attributes: {},
  };

  expect(PreElement.isPreElement(invalidElement)).toBe(false);
});

test("PreElement.isPreElement - null に対して false を返す", () => {
  expect(PreElement.isPreElement(null)).toBe(false);
});

test("PreElement.isPreElement - undefined に対して false を返す", () => {
  expect(PreElement.isPreElement(undefined)).toBe(false);
});

test("PreElement.isPreElement - プリミティブ値に対して false を返す", () => {
  expect(PreElement.isPreElement("pre")).toBe(false);
  expect(PreElement.isPreElement(42)).toBe(false);
  expect(PreElement.isPreElement(true)).toBe(false);
});
