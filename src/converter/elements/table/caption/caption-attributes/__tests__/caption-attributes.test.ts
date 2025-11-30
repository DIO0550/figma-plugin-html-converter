import { test, expect } from "vitest";
import type { CaptionAttributes } from "../caption-attributes";

test("CaptionAttributes - GlobalAttributesを継承する", () => {
  const attrs: CaptionAttributes = {
    id: "table-caption",
    className: "caption-section",
    style: "text-align: center;",
  };

  expect(attrs.id).toBe("table-caption");
  expect(attrs.className).toBe("caption-section");
  expect(attrs.style).toBe("text-align: center;");
});

test("CaptionAttributes - すべてオプショナル", () => {
  const attrs: CaptionAttributes = {};

  expect(attrs.id).toBeUndefined();
  expect(attrs.className).toBeUndefined();
  expect(attrs.style).toBeUndefined();
});

test("CaptionAttributes - id属性を持つ", () => {
  const attrs: CaptionAttributes = {
    id: "main-caption",
  };

  expect(attrs.id).toBe("main-caption");
});

test("CaptionAttributes - className属性を持つ", () => {
  const attrs: CaptionAttributes = {
    className: "bold-caption",
  };

  expect(attrs.className).toBe("bold-caption");
});

test("CaptionAttributes - style属性を持つ", () => {
  const attrs: CaptionAttributes = {
    style: "font-weight: bold;",
  };

  expect(attrs.style).toBe("font-weight: bold;");
});
