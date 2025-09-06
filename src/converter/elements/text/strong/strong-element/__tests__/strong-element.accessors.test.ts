import { test, expect } from "vitest";
import { StrongElement } from "../strong-element";

test("StrongElement.getIdはID属性を取得できる", () => {
  const element = StrongElement.create({
    id: "test-id",
    class: "test-class",
  });

  expect(StrongElement.getId(element)).toBe("test-id");
});

test("StrongElement.getIdはID属性がない場合undefinedを返す", () => {
  const element = StrongElement.create({
    class: "test-class",
  });

  expect(StrongElement.getId(element)).toBeUndefined();
});

test("StrongElement.getIdは属性自体がない場合もundefinedを返す", () => {
  const element = {
    type: "element" as const,
    tagName: "strong" as const,
    children: [],
  };

  expect(StrongElement.getId(element)).toBeUndefined();
});

test("StrongElement.getClassはクラス属性を取得できる", () => {
  const element = StrongElement.create({
    id: "test-id",
    class: "test-class highlight",
  });

  expect(StrongElement.getClass(element)).toBe("test-class highlight");
});

test("StrongElement.getClassはクラス属性がない場合undefinedを返す", () => {
  const element = StrongElement.create({
    id: "test-id",
  });

  expect(StrongElement.getClass(element)).toBeUndefined();
});

test("StrongElement.getStyleはスタイル属性を取得できる", () => {
  const element = StrongElement.create({
    id: "test-id",
    style: "font-weight: 900; color: red;",
  });

  expect(StrongElement.getStyle(element)).toBe("font-weight: 900; color: red;");
});

test("StrongElement.getStyleはスタイル属性がない場合undefinedを返す", () => {
  const element = StrongElement.create({
    id: "test-id",
  });

  expect(StrongElement.getStyle(element)).toBeUndefined();
});
