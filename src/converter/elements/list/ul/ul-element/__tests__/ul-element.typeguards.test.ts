import { describe, it, expect } from "vitest";
import { isUlElement } from "../ul-element.typeguards";
import { createUlElement } from "../ul-element.factory";
import { UlElement } from "../ul-element";

describe("isUlElement", () => {
  it("should return true for UlElement instances", () => {
    const element = createUlElement();
    expect(isUlElement(element)).toBe(true);
  });

  it("should return false for non-UlElement instances", () => {
    const div = {
      type: "element",
      tagName: "div",
      attributes: {},
      children: [],
    };
    expect(isUlElement(div)).toBe(false);
  });

  it("should return false for null", () => {
    expect(isUlElement(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isUlElement(undefined)).toBe(false);
  });

  it("should return false for plain objects", () => {
    const obj = { tagName: "ul" };
    expect(isUlElement(obj)).toBe(false);
  });

  it("should check tagName property", () => {
    const element = createUlElement();
    expect(element.tagName).toBe("ul");
    expect(isUlElement(element)).toBe(true);
  });

  it("should use UlElement.isUlElement internally", () => {
    const element = createUlElement();
    expect(isUlElement(element)).toBe(UlElement.isUlElement(element));
  });
});
