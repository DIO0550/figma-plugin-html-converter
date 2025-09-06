import { test, expect } from "vitest";
import { BElement } from "../b-element";

test("BElement.getIdはID属性を取得できる", () => {
  const element = BElement.create({
    id: "test-id",
    class: "test-class",
  });

  expect(BElement.getId(element)).toBe("test-id");
});

test("BElement.getIdはID属性がない場合undefinedを返す", () => {
  const element = BElement.create({
    class: "test-class",
  });

  expect(BElement.getId(element)).toBeUndefined();
});

test("BElement.getIdは属性自体がない場合もundefinedを返す", () => {
  const element = {
    type: "element" as const,
    tagName: "b" as const,
    children: [],
  };

  expect(BElement.getId(element)).toBeUndefined();
});

test("BElement.getClassはクラス属性を取得できる", () => {
  const element = BElement.create({
    id: "test-id",
    class: "test-class bold",
  });

  expect(BElement.getClass(element)).toBe("test-class bold");
});

test("BElement.getClassはクラス属性がない場合undefinedを返す", () => {
  const element = BElement.create({
    id: "test-id",
  });

  expect(BElement.getClass(element)).toBeUndefined();
});

test("BElement.getStyleはスタイル属性を取得できる", () => {
  const element = BElement.create({
    id: "test-id",
    style: "font-weight: bold; color: black;",
  });

  expect(BElement.getStyle(element)).toBe("font-weight: bold; color: black;");
});

test("BElement.getStyleはスタイル属性がない場合undefinedを返す", () => {
  const element = BElement.create({
    id: "test-id",
  });

  expect(BElement.getStyle(element)).toBeUndefined();
});
