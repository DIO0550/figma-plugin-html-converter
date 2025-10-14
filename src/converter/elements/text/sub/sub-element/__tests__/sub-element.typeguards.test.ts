import { test, expect } from "vitest";
import { SubElement } from "../sub-element";

test("sub要素を正しく識別する", () => {
  const element = {
    type: "element" as const,
    tagName: "sub" as const,
    attributes: {},
    children: [],
  };
  expect(SubElement.isSubElement(element)).toBe(true);
});

test("タグ名が異なる要素を拒否する", () => {
  const element = {
    type: "element" as const,
    tagName: "sup" as const,
    attributes: {},
    children: [],
  };
  expect(SubElement.isSubElement(element)).toBe(false);
});

test("nullを拒否する", () => {
  expect(SubElement.isSubElement(null)).toBe(false);
});

test("undefinedを拒否する", () => {
  expect(SubElement.isSubElement(undefined)).toBe(false);
});

test("文字列を拒否する", () => {
  expect(SubElement.isSubElement("sub")).toBe(false);
});

test("数値を拒否する", () => {
  expect(SubElement.isSubElement(123)).toBe(false);
});
