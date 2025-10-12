import { test, expect } from "vitest";
import { SubElement } from "../sub-element";

test("デフォルトのSubElementを作成する", () => {
  const element = SubElement.create();
  expect(element).toEqual({
    type: "element",
    tagName: "sub",
    attributes: {},
    children: [],
});
});

test("属性を持つSubElementを作成する", () => {
  const attributes = {
    id: "sub-1",
    class: "subscript",
  };
  const element = SubElement.create(attributes);
  expect(element).toEqual({
    type: "element",
    tagName: "sub",
    attributes,
    children: [],
});
});

test("子要素を持つSubElementを作成する", () => {
  const children = [{ type: "text" as const, content: "2" }];
  const element = SubElement.create({}, children);
  expect(element).toEqual({
    type: "element",
    tagName: "sub",
    attributes: {},
    children,
});
});

test("属性と子要素の両方を持つSubElementを作成する", () => {
  const attributes = { id: "formula" };
  const children = [{ type: "text" as const, content: "n" }];
  const element = SubElement.create(attributes, children);
  expect(element).toEqual({
    type: "element",
    tagName: "sub",
    attributes,
    children,
});
});
