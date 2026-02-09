import { test, expect } from "vitest";
import { CiteElement } from "../cite-element";

test("CiteElement.isCiteElement - cite要素の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "cite",
    attributes: {},
    children: [],
  };

  expect(CiteElement.isCiteElement(element)).toBe(true);
});

test("CiteElement.isCiteElement - 異なるタグ名の場合 - falseを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  expect(CiteElement.isCiteElement(element)).toBe(false);
});

test("CiteElement.isCiteElement - nullの場合 - falseを返す", () => {
  expect(CiteElement.isCiteElement(null)).toBe(false);
});

test("CiteElement.isCiteElement - undefinedの場合 - falseを返す", () => {
  expect(CiteElement.isCiteElement(undefined)).toBe(false);
});

test("CiteElement.create - デフォルト値の場合 - cite要素を作成する", () => {
  const element = CiteElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("cite");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("CiteElement.create - 属性付きの場合 - 属性を持つcite要素を作成する", () => {
  const element = CiteElement.create({
    id: "book-title",
    class: "citation",
  });

  expect(element.attributes?.id).toBe("book-title");
  expect(element.attributes?.class).toBe("citation");
});

test("CiteElement.getId - id属性がある場合 - id属性を取得する", () => {
  const element = CiteElement.create({ id: "book-title" });
  expect(CiteElement.getId(element)).toBe("book-title");
});

test("CiteElement.getClass - class属性がある場合 - class属性を取得する", () => {
  const element = CiteElement.create({ class: "citation" });
  expect(CiteElement.getClass(element)).toBe("citation");
});

test("CiteElement.getStyle - style属性がある場合 - style属性を取得する", () => {
  const element = CiteElement.create({ style: "font-style: italic" });
  expect(CiteElement.getStyle(element)).toBe("font-style: italic");
});
