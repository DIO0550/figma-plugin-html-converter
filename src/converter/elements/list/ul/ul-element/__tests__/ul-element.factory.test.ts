import { describe, it, expect } from "vitest";
import { createUlElement } from "../ul-element.factory";
import { UlElement } from "../ul-element";

describe("createUlElement", () => {
  it("should create a UlElement with default attributes", () => {
    const element = createUlElement();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("ul");
    expect(element.children).toEqual([]);
  });

  it("should create a UlElement with custom attributes", () => {
    const element = createUlElement({
      className: "custom-list",
      id: "my-list",
    });

    expect(element.attributes?.className).toBe("custom-list");
    expect(element.attributes?.id).toBe("my-list");
  });

  it("should handle style attributes", () => {
    const element = createUlElement({
      style: "list-style-type: none; padding-left: 20px",
    });

    expect(element.attributes?.style).toBe(
      "list-style-type: none; padding-left: 20px",
    );
  });

  it("should be recognized as UlElement", () => {
    const element = createUlElement();
    expect(UlElement.isUlElement(element)).toBe(true);
  });
});
