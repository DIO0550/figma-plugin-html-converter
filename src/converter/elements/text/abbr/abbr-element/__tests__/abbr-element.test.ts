import { test, expect } from "vitest";
import { AbbrElement } from "../abbr-element";

test("AbbrElement.isAbbrElement - abbr要素の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "abbr",
    attributes: {},
    children: [],
  };

  expect(AbbrElement.isAbbrElement(element)).toBe(true);
});

test("AbbrElement.isAbbrElement - abbr要素（子要素なし）の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "abbr",
    attributes: {},
  };

  expect(AbbrElement.isAbbrElement(element)).toBe(true);
});

test("AbbrElement.isAbbrElement - title属性を持つabbr要素の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "abbr",
    attributes: { title: "HyperText Markup Language" },
    children: [],
  };

  expect(AbbrElement.isAbbrElement(element)).toBe(true);
});

test("AbbrElement.isAbbrElement - 異なるタグ名の場合 - falseを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  expect(AbbrElement.isAbbrElement(element)).toBe(false);
});

test("AbbrElement.isAbbrElement - nullの場合 - falseを返す", () => {
  expect(AbbrElement.isAbbrElement(null)).toBe(false);
});

test("AbbrElement.isAbbrElement - undefinedの場合 - falseを返す", () => {
  expect(AbbrElement.isAbbrElement(undefined)).toBe(false);
});

test("AbbrElement.create - デフォルト値の場合 - abbr要素を作成する", () => {
  const element = AbbrElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("abbr");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("AbbrElement.create - 属性付きの場合 - 属性を持つabbr要素を作成する", () => {
  const element = AbbrElement.create({
    title: "HyperText Markup Language",
    id: "html-abbr",
  });

  expect(element.attributes?.title).toBe("HyperText Markup Language");
  expect(element.attributes?.id).toBe("html-abbr");
});

test("AbbrElement.create - 子要素付きの場合 - 子要素を持つabbr要素を作成する", () => {
  const children = [{ type: "text" as const, textContent: "HTML" }];
  const element = AbbrElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("AbbrElement.getId - id属性がある場合 - id属性を取得する", () => {
  const element = AbbrElement.create({ id: "html-abbr" });
  expect(AbbrElement.getId(element)).toBe("html-abbr");
});

test("AbbrElement.getClass - class属性がある場合 - class属性を取得する", () => {
  const element = AbbrElement.create({ class: "tech-term" });
  expect(AbbrElement.getClass(element)).toBe("tech-term");
});

test("AbbrElement.getStyle - style属性がある場合 - style属性を取得する", () => {
  const element = AbbrElement.create({ style: "color: blue" });
  expect(AbbrElement.getStyle(element)).toBe("color: blue");
});

test("AbbrElement.getTitle - title属性がある場合 - title属性を取得する", () => {
  const element = AbbrElement.create({ title: "HyperText Markup Language" });
  expect(AbbrElement.getTitle(element)).toBe("HyperText Markup Language");
});

test("AbbrElement.getTitle - title属性がない場合 - undefinedを返す", () => {
  const element = AbbrElement.create({});
  expect(AbbrElement.getTitle(element)).toBeUndefined();
});
