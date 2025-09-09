import { test, expect } from "vitest";
import { UlElement } from "../ul-element";

test("UlElement.isUlElement: returns true for UlElement instances", () => {
  const element = UlElement.create();
  expect(UlElement.isUlElement(element)).toBe(true);
});

test("UlElement.isUlElement: validates element with custom attributes", () => {
  const element = UlElement.create({ id: "custom-list", className: "my-list" });
  expect(UlElement.isUlElement(element)).toBe(true);
  expect(element.attributes.id).toBe("custom-list");
  expect(element.attributes.className).toBe("my-list");
});

test("UlElement.isUlElement: works with manually created ul elements", () => {
  const element = {
    type: "element" as const,
    tagName: "ul" as const,
    attributes: {},
    children: [],
  };
  expect(UlElement.isUlElement(element)).toBe(true);
});

test("UlElement.isUlElement: returns false for non-ul elements", () => {
  const element = {
    type: "element" as const,
    tagName: "div" as const,
    attributes: {},
    children: [],
  };
  expect(UlElement.isUlElement(element)).toBe(false);
});

test("UlElement.isUlElement: returns false for text nodes", () => {
  const notElement = {
    type: "text" as const,
    content: "Hello",
  };
  expect(UlElement.isUlElement(notElement)).toBe(false);
});

test("UlElement.isUlElement: returns false for null", () => {
  expect(UlElement.isUlElement(null)).toBe(false);
});

test("UlElement.isUlElement: returns false for undefined", () => {
  expect(UlElement.isUlElement(undefined)).toBe(false);
});

test("UlElement.isUlElement: returns false for strings", () => {
  expect(UlElement.isUlElement("string")).toBe(false);
});

test("UlElement.isUlElement: returns false for numbers", () => {
  expect(UlElement.isUlElement(123)).toBe(false);
});
