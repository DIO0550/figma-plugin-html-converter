import { test, expect } from "vitest";
import { PreElement } from "../pre-element";

test("PreElement.create - 無効な属性でもエラーを発生させずに処理できる", () => {
  // Testing with invalid attributes (bypass type checking for test)
  const element = PreElement.create({ unknownAttr: "value" } as never);

  expect(element).toBeDefined();
  expect(element.tagName).toBe("pre");
  expect(element.type).toBe("element");
  // Accessing unknown attribute
  const attrs = element.attributes as Record<string, unknown>;
  expect(attrs.unknownAttr).toBe("value");
});

test("PreElement.create - undefined属性を渡しても正常に動作する", () => {
  // Testing with undefined attributes (bypass type checking for test)
  const element = PreElement.create(undefined as never);

  expect(element).toBeDefined();
  expect(element.tagName).toBe("pre");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("PreElement.create - null属性を渡しても正常に動作する", () => {
  // Testing with null attributes (bypass type checking for test)
  const element = PreElement.create(null as never);

  expect(element).toBeDefined();
  expect(element.tagName).toBe("pre");
  expect(element.attributes).toEqual({});
});

test("PreElement.getId - attributes自体がundefinedの場合はundefinedを返す", () => {
  // Testing with undefined attributes
  const element = { ...PreElement.create(), attributes: undefined };
  const id = PreElement.getId(element);

  expect(id).toBeUndefined();
});

test("PreElement.getClass - attributes自体がundefinedの場合はundefinedを返す", () => {
  // Testing with undefined attributes
  const element = { ...PreElement.create(), attributes: undefined };
  const className = PreElement.getClass(element);

  expect(className).toBeUndefined();
});

test("PreElement.getStyle - attributes自体がundefinedの場合はundefinedを返す", () => {
  // Testing with undefined attributes
  const element = { ...PreElement.create(), attributes: undefined };
  const style = PreElement.getStyle(element);

  expect(style).toBeUndefined();
});

test("PreElement.isPreElement - 不完全なオブジェクトに対してfalseを返す", () => {
  expect(PreElement.isPreElement({})).toBe(false);
  expect(PreElement.isPreElement({ type: "element" })).toBe(false);
  expect(PreElement.isPreElement({ tagName: "pre" })).toBe(false);
});

test("PreElement.create - 無効な子要素を含む配列でも処理できる", () => {
  const children = [
    { type: "text" as const, textContent: "valid" },
    null as never,
    undefined as never,
    { type: "invalid" as const } as never,
  ];

  const element = PreElement.create({}, children);

  expect(element.children).toBeDefined();
  expect(element.children?.length).toBe(4);
});
