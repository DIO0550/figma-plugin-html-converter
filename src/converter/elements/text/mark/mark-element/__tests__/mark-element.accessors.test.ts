import { test, expect } from "vitest";
import { MarkElement } from "../mark-element";
import type { MarkAttributes } from "../../mark-attributes";

test("MarkElement.getId - ID属性を取得できる", () => {
  const element = MarkElement.create({ id: "mark-1" });
  expect(MarkElement.getId(element)).toBe("mark-1");
});

test("MarkElement.getId - ID属性がない場合はundefinedを返す", () => {
  const element = MarkElement.create();
  expect(MarkElement.getId(element)).toBeUndefined();
});

test("MarkElement.getId - 空文字列のIDも取得できる", () => {
  const element = MarkElement.create({ id: "" });
  expect(MarkElement.getId(element)).toBe("");
});

test("MarkElement.getClass - class属性を取得できる", () => {
  const element = MarkElement.create({ class: "highlight important" });
  expect(MarkElement.getClass(element)).toBe("highlight important");
});

test("MarkElement.getClass - class属性がない場合はundefinedを返す", () => {
  const element = MarkElement.create();
  expect(MarkElement.getClass(element)).toBeUndefined();
});

test("MarkElement.getClass - 複数のクラス名を含むclass属性を取得できる", () => {
  const element = MarkElement.create({
    class: "bg-yellow-200 text-black px-1",
  });
  expect(MarkElement.getClass(element)).toBe("bg-yellow-200 text-black px-1");
});

test("MarkElement.getStyle - style属性を取得できる", () => {
  const element = MarkElement.create({
    style: "background-color: yellow; padding: 2px;",
  });
  expect(MarkElement.getStyle(element)).toBe(
    "background-color: yellow; padding: 2px;",
  );
});

test("MarkElement.getStyle - style属性がない場合はundefinedを返す", () => {
  const element = MarkElement.create();
  expect(MarkElement.getStyle(element)).toBeUndefined();
});

test("MarkElement.getStyle - 複雑なスタイル文字列も取得できる", () => {
  const complexStyle =
    "background-color: #ffff00; color: #000000; font-weight: bold; padding: 0 4px;";
  const element = MarkElement.create({ style: complexStyle });
  expect(MarkElement.getStyle(element)).toBe(complexStyle);
});

test("MarkElement アクセサ - 全ての属性を個別に取得できる", () => {
  const attributes: Partial<MarkAttributes> = {
    id: "important-mark",
    class: "highlight-text",
    style: "background-color: yellow; color: black;",
  };
  const element = MarkElement.create(attributes);

  expect(MarkElement.getId(element)).toBe("important-mark");
  expect(MarkElement.getClass(element)).toBe("highlight-text");
  expect(MarkElement.getStyle(element)).toBe(
    "background-color: yellow; color: black;",
  );
});

test("MarkElement アクセサ - 一部の属性のみが設定されている場合も正しく動作する", () => {
  const element = MarkElement.create({ id: "only-id" });

  expect(MarkElement.getId(element)).toBe("only-id");
  expect(MarkElement.getClass(element)).toBeUndefined();
  expect(MarkElement.getStyle(element)).toBeUndefined();
});

test("MarkElement アクセサ - data属性を含む場合も他のアクセサが正しく動作する", () => {
  const element = MarkElement.create({
    id: "mark-with-data",
    "data-testid": "mark-element",
    class: "highlight",
  });

  expect(MarkElement.getId(element)).toBe("mark-with-data");
  expect(MarkElement.getClass(element)).toBe("highlight");
  expect(element.attributes?.["data-testid"]).toBe("mark-element");
});
