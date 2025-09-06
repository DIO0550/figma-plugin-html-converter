import { test, expect } from "vitest";
import { IElement } from "../i-element";

test("IElement.getIdはID属性を取得できる", () => {
  const element = IElement.create({
    id: "test-id",
    class: "test-class",
  });

  expect(IElement.getId(element)).toBe("test-id");
});

test("IElement.getIdはID属性がない場合undefinedを返す", () => {
  const element = IElement.create({
    class: "test-class",
  });

  expect(IElement.getId(element)).toBeUndefined();
});

test("IElement.getIdは属性自体がない場合もundefinedを返す", () => {
  const element = {
    type: "element" as const,
    tagName: "i" as const,
    children: [],
  };

  expect(IElement.getId(element)).toBeUndefined();
});

test("IElement.getClassはクラス属性を取得できる", () => {
  const element = IElement.create({
    id: "test-id",
    class: "test-class italic",
  });

  expect(IElement.getClass(element)).toBe("test-class italic");
});

test("IElement.getClassはクラス属性がない場合undefinedを返す", () => {
  const element = IElement.create({
    id: "test-id",
  });

  expect(IElement.getClass(element)).toBeUndefined();
});

test("IElement.getStyleはスタイル属性を取得できる", () => {
  const element = IElement.create({
    id: "test-id",
    style: "font-style: italic; color: black;",
  });

  expect(IElement.getStyle(element)).toBe("font-style: italic; color: black;");
});

test("IElement.getStyleはスタイル属性がない場合undefinedを返す", () => {
  const element = IElement.create({
    id: "test-id",
  });

  expect(IElement.getStyle(element)).toBeUndefined();
});
