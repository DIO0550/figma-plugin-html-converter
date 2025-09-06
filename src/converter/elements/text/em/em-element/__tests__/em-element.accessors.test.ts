import { test, expect } from "vitest";
import { EmElement } from "../em-element";

test("EmElement.getIdはID属性を取得できる", () => {
  const element = EmElement.create({
    id: "test-id",
    class: "test-class",
  });

  expect(EmElement.getId(element)).toBe("test-id");
});

test("EmElement.getIdはID属性がない場合undefinedを返す", () => {
  const element = EmElement.create({
    class: "test-class",
  });

  expect(EmElement.getId(element)).toBeUndefined();
});

test("EmElement.getIdは属性自体がない場合もundefinedを返す", () => {
  const element = {
    type: "element" as const,
    tagName: "em" as const,
    children: [],
  };

  expect(EmElement.getId(element)).toBeUndefined();
});

test("EmElement.getClassはクラス属性を取得できる", () => {
  const element = EmElement.create({
    id: "test-id",
    class: "test-class italic",
  });

  expect(EmElement.getClass(element)).toBe("test-class italic");
});

test("EmElement.getClassはクラス属性がない場合undefinedを返す", () => {
  const element = EmElement.create({
    id: "test-id",
  });

  expect(EmElement.getClass(element)).toBeUndefined();
});

test("EmElement.getStyleはスタイル属性を取得できる", () => {
  const element = EmElement.create({
    id: "test-id",
    style: "font-style: italic; color: blue;",
  });

  expect(EmElement.getStyle(element)).toBe("font-style: italic; color: blue;");
});

test("EmElement.getStyleはスタイル属性がない場合undefinedを返す", () => {
  const element = EmElement.create({
    id: "test-id",
  });

  expect(EmElement.getStyle(element)).toBeUndefined();
});
