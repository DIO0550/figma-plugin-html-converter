import { test, expect } from "vitest";
import type { TfootAttributes } from "../tfoot-attributes";

test("TfootAttributes - GlobalAttributesを継承する", () => {
  const attrs: TfootAttributes = {
    id: "table-footer",
    className: "footer-section",
    style: "background-color: #f0f0f0;",
  };

  expect(attrs.id).toBe("table-footer");
  expect(attrs.className).toBe("footer-section");
  expect(attrs.style).toBe("background-color: #f0f0f0;");
});

test("TfootAttributes - すべてオプショナル", () => {
  const attrs: TfootAttributes = {};

  expect(attrs.id).toBeUndefined();
  expect(attrs.className).toBeUndefined();
  expect(attrs.style).toBeUndefined();
});

test("TfootAttributes - id属性を持つ", () => {
  const attrs: TfootAttributes = {
    id: "summary-footer",
  };

  expect(attrs.id).toBe("summary-footer");
});

test("TfootAttributes - className属性を持つ", () => {
  const attrs: TfootAttributes = {
    className: "total-footer",
  };

  expect(attrs.className).toBe("total-footer");
});

test("TfootAttributes - style属性を持つ", () => {
  const attrs: TfootAttributes = {
    style: "font-weight: bold;",
  };

  expect(attrs.style).toBe("font-weight: bold;");
});
