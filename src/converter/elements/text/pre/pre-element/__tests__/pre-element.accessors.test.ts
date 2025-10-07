import { test, expect } from "vitest";
import { PreElement } from "../pre-element";

test("PreElement.getId - id属性を取得できる", () => {
  const element = PreElement.create({ id: "pre-id" });
  const id = PreElement.getId(element);

  expect(id).toBe("pre-id");
});

test("PreElement.getId - id属性が未設定の場合はundefinedを返す", () => {
  const element = PreElement.create();
  const id = PreElement.getId(element);

  expect(id).toBeUndefined();
});

test("PreElement.getClass - class属性を取得できる", () => {
  const element = PreElement.create({ class: "preformatted" });
  const className = PreElement.getClass(element);

  expect(className).toBe("preformatted");
});

test("PreElement.getClass - class属性が未設定の場合はundefinedを返す", () => {
  const element = PreElement.create();
  const className = PreElement.getClass(element);

  expect(className).toBeUndefined();
});

test("PreElement.getStyle - style属性を取得できる", () => {
  const element = PreElement.create({ style: "color: red;" });
  const style = PreElement.getStyle(element);

  expect(style).toBe("color: red;");
});

test("PreElement.getStyle - style属性が未設定の場合はundefinedを返す", () => {
  const element = PreElement.create();
  const style = PreElement.getStyle(element);

  expect(style).toBeUndefined();
});
