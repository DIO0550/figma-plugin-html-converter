import { describe, it, expect } from "vitest";
import { HeaderElement } from "../header-element";

describe("HeaderElement.isHeaderElement", () => {
  it("should return true for valid header element", () => {
    const element = {
      type: "element",
      tagName: "header",
      attributes: {},
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(true);
  });

  it("should return true for header element with children", () => {
    const element = {
      type: "element",
      tagName: "header",
      attributes: { id: "page-header" },
      children: [],
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(true);
  });

  it("should return false for non-object", () => {
    expect(HeaderElement.isHeaderElement("header")).toBe(false);
    expect(HeaderElement.isHeaderElement(123)).toBe(false);
    expect(HeaderElement.isHeaderElement(true)).toBe(false);
    expect(HeaderElement.isHeaderElement(undefined)).toBe(false);
    expect(HeaderElement.isHeaderElement(null)).toBe(false);
  });

  it("should return false for object with wrong type", () => {
    const element = {
      type: "text",
      tagName: "header",
      attributes: {},
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(false);
  });

  it("should return false for element with wrong tagName", () => {
    const element = {
      type: "element",
      tagName: "main",
      attributes: {},
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(false);
  });

  it("should return false for element missing type", () => {
    const element = {
      tagName: "header",
      attributes: {},
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(false);
  });

  it("should return false for element missing tagName", () => {
    const element = {
      type: "element",
      attributes: {},
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(false);
  });
});
