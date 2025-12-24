import { describe, test, expect } from "vitest";
import { AbbrElement } from "../abbr-element";

describe("AbbrElement.isAbbrElement", () => {
  test("abbr要素の場合trueを返す", () => {
    const element = {
      type: "element",
      tagName: "abbr",
      attributes: {},
      children: [],
    };

    expect(AbbrElement.isAbbrElement(element)).toBe(true);
  });

  test("abbr要素（子要素なし）の場合もtrueを返す", () => {
    const element = {
      type: "element",
      tagName: "abbr",
      attributes: {},
    };

    expect(AbbrElement.isAbbrElement(element)).toBe(true);
  });

  test("title属性を持つabbr要素の場合trueを返す", () => {
    const element = {
      type: "element",
      tagName: "abbr",
      attributes: { title: "HyperText Markup Language" },
      children: [],
    };

    expect(AbbrElement.isAbbrElement(element)).toBe(true);
  });

  test("異なるタグ名の場合falseを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    expect(AbbrElement.isAbbrElement(element)).toBe(false);
  });

  test("nullの場合falseを返す", () => {
    expect(AbbrElement.isAbbrElement(null)).toBe(false);
  });

  test("undefinedの場合falseを返す", () => {
    expect(AbbrElement.isAbbrElement(undefined)).toBe(false);
  });
});

describe("AbbrElement.create", () => {
  test("デフォルト値でabbr要素を作成する", () => {
    const element = AbbrElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("abbr");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("属性付きでabbr要素を作成する", () => {
    const element = AbbrElement.create({
      title: "HyperText Markup Language",
      id: "html-abbr",
    });

    expect(element.attributes?.title).toBe("HyperText Markup Language");
    expect(element.attributes?.id).toBe("html-abbr");
  });

  test("子要素付きでabbr要素を作成する", () => {
    const children = [{ type: "text" as const, textContent: "HTML" }];
    const element = AbbrElement.create({}, children);

    expect(element.children).toEqual(children);
  });
});

describe("AbbrElement accessors", () => {
  test("getIdはid属性を取得する", () => {
    const element = AbbrElement.create({ id: "html-abbr" });
    expect(AbbrElement.getId(element)).toBe("html-abbr");
  });

  test("getClassはclass属性を取得する", () => {
    const element = AbbrElement.create({ class: "tech-term" });
    expect(AbbrElement.getClass(element)).toBe("tech-term");
  });

  test("getStyleはstyle属性を取得する", () => {
    const element = AbbrElement.create({ style: "color: blue" });
    expect(AbbrElement.getStyle(element)).toBe("color: blue");
  });

  test("getTitleはtitle属性を取得する", () => {
    const element = AbbrElement.create({ title: "HyperText Markup Language" });
    expect(AbbrElement.getTitle(element)).toBe("HyperText Markup Language");
  });

  test("title属性がない場合undefinedを返す", () => {
    const element = AbbrElement.create({});
    expect(AbbrElement.getTitle(element)).toBeUndefined();
  });
});
