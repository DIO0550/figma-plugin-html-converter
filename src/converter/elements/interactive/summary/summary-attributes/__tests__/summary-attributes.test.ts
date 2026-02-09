import { test, expect } from "vitest";
import type { SummaryAttributes } from "../summary-attributes";

test("SummaryAttributes - GlobalAttributesを継承している", () => {
  const attrs: SummaryAttributes = {
    id: "test-summary",
    class: "summary-class",
    style: "font-weight: bold;",
  };

  expect(attrs.id).toBe("test-summary");
  expect(attrs.class).toBe("summary-class");
  expect(attrs.style).toBe("font-weight: bold;");
});

test("SummaryAttributes - 空のオブジェクト - 有効", () => {
  const attrs: SummaryAttributes = {};
  expect(attrs).toEqual({});
});

test("SummaryAttributes - data属性 - 含めることができる", () => {
  const attrs: SummaryAttributes = {
    "data-testid": "summary-test",
  };

  expect(attrs["data-testid"]).toBe("summary-test");
});

test("SummaryAttributes - aria属性 - 含めることができる", () => {
  const attrs: SummaryAttributes = {
    "aria-expanded": "true",
  };

  expect(attrs["aria-expanded"]).toBe("true");
});
