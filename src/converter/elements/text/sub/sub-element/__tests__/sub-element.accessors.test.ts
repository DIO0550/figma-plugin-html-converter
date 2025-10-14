import { test, expect } from "vitest";
import { SubElement } from "../sub-element";

test("ID属性を取得できる", () => {
  const element = SubElement.create({ id: "sub-1" });
  expect(SubElement.getId(element)).toBe("sub-1");
});

test("ID属性がない場合はundefinedを返す", () => {
  const element = SubElement.create({});
  expect(SubElement.getId(element)).toBeUndefined();
});

test("class属性を取得できる", () => {
  const element = SubElement.create({ class: "subscript" });
  expect(SubElement.getClass(element)).toBe("subscript");
});

test("class属性がない場合はundefinedを返す", () => {
  const element = SubElement.create({});
  expect(SubElement.getClass(element)).toBeUndefined();
});

test("style属性を取得できる", () => {
  const element = SubElement.create({ style: "vertical-align: sub;" });
  expect(SubElement.getStyle(element)).toBe("vertical-align: sub;");
});

test("style属性がない場合はundefinedを返す", () => {
  const element = SubElement.create({});
  expect(SubElement.getStyle(element)).toBeUndefined();
});
