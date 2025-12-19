import { describe, test, expect } from "vitest";
import type { SummaryAttributes } from "../summary-attributes";

describe("SummaryAttributes", () => {
  describe("型定義", () => {
    test("GlobalAttributesを継承している", () => {
      const attrs: SummaryAttributes = {
        id: "test-summary",
        class: "summary-class",
        style: "font-weight: bold;",
      };

      expect(attrs.id).toBe("test-summary");
      expect(attrs.class).toBe("summary-class");
      expect(attrs.style).toBe("font-weight: bold;");
    });

    test("空のオブジェクトも有効", () => {
      const attrs: SummaryAttributes = {};
      expect(attrs).toEqual({});
    });

    test("data属性を含めることができる", () => {
      const attrs: SummaryAttributes = {
        "data-testid": "summary-test",
      };

      expect(attrs["data-testid"]).toBe("summary-test");
    });

    test("aria属性を含めることができる", () => {
      const attrs: SummaryAttributes = {
        "aria-expanded": "true",
      };

      expect(attrs["aria-expanded"]).toBe("true");
    });
  });
});
