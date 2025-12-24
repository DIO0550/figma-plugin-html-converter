import { describe, test, expect } from "vitest";
import { CiteElement } from "../cite-element";

describe("CiteElement.isCiteElement", () => {
  test("cite要素の場合trueを返す", () => {
    const element = {
      type: "element",
      tagName: "cite",
      attributes: {},
      children: [],
    };

    expect(CiteElement.isCiteElement(element)).toBe(true);
  });

  test("異なるタグ名の場合falseを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    expect(CiteElement.isCiteElement(element)).toBe(false);
  });

  test("nullの場合falseを返す", () => {
    expect(CiteElement.isCiteElement(null)).toBe(false);
  });

  test("undefinedの場合falseを返す", () => {
    expect(CiteElement.isCiteElement(undefined)).toBe(false);
  });
});

describe("CiteElement.create", () => {
  test("デフォルト値でcite要素を作成する", () => {
    const element = CiteElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("cite");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("属性付きでcite要素を作成する", () => {
    const element = CiteElement.create({
      id: "book-title",
      class: "citation",
    });

    expect(element.attributes?.id).toBe("book-title");
    expect(element.attributes?.class).toBe("citation");
  });
});

describe("CiteElement accessors", () => {
  test("getIdはid属性を取得する", () => {
    const element = CiteElement.create({ id: "book-title" });
    expect(CiteElement.getId(element)).toBe("book-title");
  });

  test("getClassはclass属性を取得する", () => {
    const element = CiteElement.create({ class: "citation" });
    expect(CiteElement.getClass(element)).toBe("citation");
  });

  test("getStyleはstyle属性を取得する", () => {
    const element = CiteElement.create({ style: "font-style: italic" });
    expect(CiteElement.getStyle(element)).toBe("font-style: italic");
  });
});
