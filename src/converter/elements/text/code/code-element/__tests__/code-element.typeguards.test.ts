import { test, expect } from "vitest";
import { CodeElement } from "../code-element";

test("CodeElement.isCodeElement - code要素として有効なオブジェクトに対してtrueを返す", () => {
  const validCodeElement = {
    type: "element",
    tagName: "code",
    attributes: {},
    children: [],
  };

  expect(CodeElement.isCodeElement(validCodeElement)).toBe(true);
});

test("CodeElement.isCodeElement - type が 'element' でない場合は false を返す", () => {
  const invalidElement = {
    type: "text",
    tagName: "code",
    attributes: {},
    children: [],
  };

  expect(CodeElement.isCodeElement(invalidElement)).toBe(false);
});

test("CodeElement.isCodeElement - tagName が 'code' でない場合は false を返す", () => {
  const invalidElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  expect(CodeElement.isCodeElement(invalidElement)).toBe(false);
});

test("CodeElement.isCodeElement - null に対して false を返す", () => {
  expect(CodeElement.isCodeElement(null)).toBe(false);
});

test("CodeElement.isCodeElement - undefined に対して false を返す", () => {
  expect(CodeElement.isCodeElement(undefined)).toBe(false);
});

test("CodeElement.isCodeElement - プリミティブ値に対して false を返す", () => {
  expect(CodeElement.isCodeElement("code")).toBe(false);
  expect(CodeElement.isCodeElement(123)).toBe(false);
  expect(CodeElement.isCodeElement(true)).toBe(false);
});
