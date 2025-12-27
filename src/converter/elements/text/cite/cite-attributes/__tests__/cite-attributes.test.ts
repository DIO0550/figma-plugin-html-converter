import { describe, test, expect } from "vitest";
import type { CiteAttributes } from "../cite-attributes";

describe("CiteAttributes", () => {
  test("CiteAttributesはグローバル属性を含むことができる", () => {
    const attributes: CiteAttributes = {
      id: "book-title",
      class: "citation",
      style: "font-style: italic",
    };

    expect(attributes.id).toBe("book-title");
    expect(attributes.class).toBe("citation");
    expect(attributes.style).toBe("font-style: italic");
  });
});
