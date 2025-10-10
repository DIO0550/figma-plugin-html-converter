import { test, expect } from "vitest";
import { SmallElement } from "../small-element";
import type { SmallAttributes } from "../../small-attributes";

test("SmallElement.getId - ID属性を取得できる", () => {
  const element = SmallElement.create({ id: "small-1" });
  expect(SmallElement.getId(element)).toBe("small-1");
});

test("SmallElement.getId - ID属性がない場合はundefinedを返す", () => {
  const element = SmallElement.create();
  expect(SmallElement.getId(element)).toBeUndefined();
});

test("SmallElement.getId - 空文字列のIDも取得できる", () => {
  const element = SmallElement.create({ id: "" });
  expect(SmallElement.getId(element)).toBe("");
});

test("SmallElement.getClass - class属性を取得できる", () => {
  const element = SmallElement.create({ class: "small-text footnote" });
  expect(SmallElement.getClass(element)).toBe("small-text footnote");
});

test("SmallElement.getClass - class属性がない場合はundefinedを返す", () => {
  const element = SmallElement.create();
  expect(SmallElement.getClass(element)).toBeUndefined();
});

test("SmallElement.getClass - 複数のクラス名を含むclass属性を取得できる", () => {
  const element = SmallElement.create({
    class: "text-xs text-gray-500 mt-2",
  });
  expect(SmallElement.getClass(element)).toBe("text-xs text-gray-500 mt-2");
});

test("SmallElement.getStyle - style属性を取得できる", () => {
  const element = SmallElement.create({
    style: "font-size: 0.8em; color: #666;",
  });
  expect(SmallElement.getStyle(element)).toBe("font-size: 0.8em; color: #666;");
});

test("SmallElement.getStyle - style属性がない場合はundefinedを返す", () => {
  const element = SmallElement.create();
  expect(SmallElement.getStyle(element)).toBeUndefined();
});

test("SmallElement.getStyle - 複雑なスタイル文字列も取得できる", () => {
  const complexStyle =
    "font-size: 0.75rem; line-height: 1.2; letter-spacing: 0.025em;";
  const element = SmallElement.create({ style: complexStyle });
  expect(SmallElement.getStyle(element)).toBe(complexStyle);
});

test("SmallElement アクセサ - 全ての属性を個別に取得できる", () => {
  const attributes: Partial<SmallAttributes> = {
    id: "footer-small",
    class: "copyright-text",
    style: "font-size: 0.8em; opacity: 0.8;",
  };
  const element = SmallElement.create(attributes);

  expect(SmallElement.getId(element)).toBe("footer-small");
  expect(SmallElement.getClass(element)).toBe("copyright-text");
  expect(SmallElement.getStyle(element)).toBe(
    "font-size: 0.8em; opacity: 0.8;",
  );
});

test("SmallElement アクセサ - 一部の属性のみが設定されている場合も正しく動作する", () => {
  const element = SmallElement.create({ id: "only-id" });

  expect(SmallElement.getId(element)).toBe("only-id");
  expect(SmallElement.getClass(element)).toBeUndefined();
  expect(SmallElement.getStyle(element)).toBeUndefined();
});

test("SmallElement アクセサ - data属性を含む場合も他のアクセサが正しく動作する", () => {
  const element = SmallElement.create({
    id: "small-with-data",
    "data-testid": "small-element",
    class: "small",
  });

  expect(SmallElement.getId(element)).toBe("small-with-data");
  expect(SmallElement.getClass(element)).toBe("small");
  expect(element.attributes?.["data-testid"]).toBe("small-element");
});
