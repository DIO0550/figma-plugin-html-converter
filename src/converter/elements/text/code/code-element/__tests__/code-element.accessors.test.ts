import { test, expect } from "vitest";
import { CodeElement } from "../code-element";

test("CodeElement.getId - id属性を取得できる", () => {
  const element = CodeElement.create({ id: "code-id" });
  const id = CodeElement.getId(element);

  expect(id).toBe("code-id");
});

test("CodeElement.getId - id属性が未設定の場合はundefinedを返す", () => {
  const element = CodeElement.create();
  const id = CodeElement.getId(element);

  expect(id).toBeUndefined();
});

test("CodeElement.getClass - class属性を取得できる", () => {
  const element = CodeElement.create({ class: "language-typescript" });
  const className = CodeElement.getClass(element);

  expect(className).toBe("language-typescript");
});

test("CodeElement.getClass - class属性が未設定の場合はundefinedを返す", () => {
  const element = CodeElement.create();
  const className = CodeElement.getClass(element);

  expect(className).toBeUndefined();
});

test("CodeElement.getStyle - style属性を取得できる", () => {
  const element = CodeElement.create({ style: "font-size: 14px;" });
  const style = CodeElement.getStyle(element);

  expect(style).toBe("font-size: 14px;");
});

test("CodeElement.getStyle - style属性が未設定の場合はundefinedを返す", () => {
  const element = CodeElement.create();
  const style = CodeElement.getStyle(element);

  expect(style).toBeUndefined();
});
