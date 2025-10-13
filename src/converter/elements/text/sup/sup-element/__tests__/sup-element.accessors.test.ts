import { test, expect } from "vitest";
import { SupElement } from "../sup-element";

test("ID属性を取得できる", () => {
  const element = SupElement.create({ id: "sup-1" });
  expect(SupElement.getId(element)).toBe("sup-1");
});

test("ID属性がない場合はundefinedを返す", () => {
  const element = SupElement.create({});
  expect(SupElement.getId(element)).toBeUndefined();
});

test("class属性を取得できる", () => {
  const element = SupElement.create({ class: "superscript" });
  expect(SupElement.getClass(element)).toBe("superscript");
});

test("class属性がない場合はundefinedを返す", () => {
  const element = SupElement.create({});
  expect(SupElement.getClass(element)).toBeUndefined();
});

test("style属性を取得できる", () => {
  const element = SupElement.create({ style: "vertical-align: super;" });
  expect(SupElement.getStyle(element)).toBe("vertical-align: super;");
});

test("style属性がない場合はundefinedを返す", () => {
  const element = SupElement.create({});
  expect(SupElement.getStyle(element)).toBeUndefined();
});
