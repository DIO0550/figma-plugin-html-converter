import { describe, test, expect } from "vitest";
import type { QAttributes } from "../q-attributes";

describe("QAttributes", () => {
  test("QAttributesはcite属性を含むことができる", () => {
    const attributes: QAttributes = {
      cite: "https://example.com/source",
    };

    expect(attributes.cite).toBe("https://example.com/source");
  });

  test("QAttributesはグローバル属性を含むことができる", () => {
    const attributes: QAttributes = {
      id: "quote-1",
      class: "inline-quote",
      cite: "https://example.com/source",
    };

    expect(attributes.id).toBe("quote-1");
    expect(attributes.class).toBe("inline-quote");
    expect(attributes.cite).toBe("https://example.com/source");
  });
});
