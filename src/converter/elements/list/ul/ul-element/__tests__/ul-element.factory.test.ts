import { test, expect } from "vitest";
import { UlElement } from "../ul-element";

test("UlElement.create: creates a basic ul element without attributes", () => {
  const element = UlElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "ul",
    attributes: {},
    children: [],
  });
});

test("UlElement.create: creates a ul element with attributes", () => {
  const attributes = { id: "my-list", className: "list-class" };
  const element = UlElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "ul",
    attributes,
    children: [],
  });
});

test("UlElement.create: creates a ul element with children", () => {
  const children = [
    { type: "text" as const, textContent: "Item 1" },
    { type: "text" as const, textContent: "Item 2" },
  ];
  const element = UlElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "ul",
    attributes: {},
    children,
  });
});

test("UlElement.create: creates a ul element with both attributes and children", () => {
  const attributes = { id: "list" };
  const children = [{ type: "text" as const, textContent: "Item" }];
  const element = UlElement.create(attributes, children);

  expect(element).toEqual({
    type: "element",
    tagName: "ul",
    attributes,
    children,
  });
});
