import { describe, test, expect } from "vitest";
import type { AbbrAttributes } from "../abbr-attributes";

describe("AbbrAttributes", () => {
  test("AbbrAttributesはtitle属性を含むことができる", () => {
    const attributes: AbbrAttributes = {
      title: "HyperText Markup Language",
    };

    expect(attributes.title).toBe("HyperText Markup Language");
  });

  test("AbbrAttributesはグローバル属性を含むことができる", () => {
    const attributes: AbbrAttributes = {
      id: "html-abbr",
      class: "tech-term",
      style: "color: blue",
      title: "HyperText Markup Language",
    };

    expect(attributes.id).toBe("html-abbr");
    expect(attributes.class).toBe("tech-term");
    expect(attributes.style).toBe("color: blue");
    expect(attributes.title).toBe("HyperText Markup Language");
  });

  test("AbbrAttributesはtitle属性なしでも定義できる", () => {
    const attributes: AbbrAttributes = {
      id: "abbr-display",
    };

    expect(attributes.id).toBe("abbr-display");
    expect(attributes.title).toBeUndefined();
  });
});
