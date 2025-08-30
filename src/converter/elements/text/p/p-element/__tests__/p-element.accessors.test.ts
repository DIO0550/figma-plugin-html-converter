import { test, expect } from "vitest";
import { PElement } from "../p-element";
import type { PAttributes } from "../../p-attributes";

test("PElement.getId - ID属性を取得できる", () => {
  const element = PElement.create({ id: "paragraph-1" });
  expect(PElement.getId(element)).toBe("paragraph-1");
});

test("PElement.getId - ID属性がない場合はundefinedを返す", () => {
  const element = PElement.create();
  expect(PElement.getId(element)).toBeUndefined();
});

test("PElement.getId - 空文字列のIDも取得できる", () => {
  const element = PElement.create({ id: "" });
  expect(PElement.getId(element)).toBe("");
});

test("PElement.getClass - class属性を取得できる", () => {
  const element = PElement.create({ class: "text-body paragraph" });
  expect(PElement.getClass(element)).toBe("text-body paragraph");
});

test("PElement.getClass - class属性がない場合はundefinedを返す", () => {
  const element = PElement.create();
  expect(PElement.getClass(element)).toBeUndefined();
});

test("PElement.getClass - 複数のクラス名を含むclass属性を取得できる", () => {
  const element = PElement.create({
    class: "text-lg font-bold text-center",
  });
  expect(PElement.getClass(element)).toBe("text-lg font-bold text-center");
});

test("PElement.getStyle - style属性を取得できる", () => {
  const element = PElement.create({
    style: "color: blue; font-size: 16px;",
  });
  expect(PElement.getStyle(element)).toBe("color: blue; font-size: 16px;");
});

test("PElement.getStyle - style属性がない場合はundefinedを返す", () => {
  const element = PElement.create();
  expect(PElement.getStyle(element)).toBeUndefined();
});

test("PElement.getStyle - 複雑なスタイル文字列も取得できる", () => {
  const complexStyle =
    "background: linear-gradient(45deg, #000, #fff); padding: 10px 20px; margin: 0 auto;";
  const element = PElement.create({ style: complexStyle });
  expect(PElement.getStyle(element)).toBe(complexStyle);
});

test("PElement アクセサ - 全ての属性を個別に取得できる", () => {
  const attributes: Partial<PAttributes> = {
    id: "main-para",
    class: "lead-text",
    style: "font-weight: bold;",
  };
  const element = PElement.create(attributes);

  expect(PElement.getId(element)).toBe("main-para");
  expect(PElement.getClass(element)).toBe("lead-text");
  expect(PElement.getStyle(element)).toBe("font-weight: bold;");
});

test("PElement アクセサ - 一部の属性のみが設定されている場合も正しく動作する", () => {
  const element = PElement.create({ id: "only-id" });

  expect(PElement.getId(element)).toBe("only-id");
  expect(PElement.getClass(element)).toBeUndefined();
  expect(PElement.getStyle(element)).toBeUndefined();
});
