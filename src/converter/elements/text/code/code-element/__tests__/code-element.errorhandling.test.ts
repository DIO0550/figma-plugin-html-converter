import { test, expect } from "vitest";
import { CodeElement } from "../code-element";

test("CodeElement.create - 無効な属性でもエラーを発生させずに処理できる", () => {
  // Testing with invalid attributes (bypass type checking for test)
  const element = CodeElement.create({ unknownAttr: "value" } as never);

  expect(element).toBeDefined();
  expect(element.tagName).toBe("code");
  expect(element.type).toBe("element");
  // Accessing unknown attribute
  const attrs = element.attributes as Record<string, unknown>;
  expect(attrs.unknownAttr).toBe("value");
});

test("CodeElement.create - undefined属性を渡しても正常に動作する", () => {
  // Testing with undefined attributes (bypass type checking for test)
  const element = CodeElement.create(undefined as never);

  expect(element).toBeDefined();
  expect(element.tagName).toBe("code");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("CodeElement.create - null属性を渡しても正常に動作する", () => {
  // Testing with null attributes (bypass type checking for test)
  const element = CodeElement.create(null as never);

  expect(element).toBeDefined();
  expect(element.tagName).toBe("code");
  expect(element.attributes).toEqual({});
});

test("CodeElement.getId - attributes自体がundefinedの場合はundefinedを返す", () => {
  // Testing with undefined attributes
  const element = { ...CodeElement.create(), attributes: undefined };
  const id = CodeElement.getId(element);

  expect(id).toBeUndefined();
});

test("CodeElement.getClass - attributes自体がundefinedの場合はundefinedを返す", () => {
  // Testing with undefined attributes
  const element = { ...CodeElement.create(), attributes: undefined };
  const className = CodeElement.getClass(element);

  expect(className).toBeUndefined();
});

test("CodeElement.getStyle - attributes自体がundefinedの場合はundefinedを返す", () => {
  // Testing with undefined attributes
  const element = { ...CodeElement.create(), attributes: undefined };
  const style = CodeElement.getStyle(element);

  expect(style).toBeUndefined();
});

test("CodeElement.isCodeElement - 不完全なオブジェクトに対してfalseを返す", () => {
  expect(CodeElement.isCodeElement({})).toBe(false);
  expect(CodeElement.isCodeElement({ type: "element" })).toBe(false);
  expect(CodeElement.isCodeElement({ tagName: "code" })).toBe(false);
});
