import { test, expect } from "vitest";
import type { TheadAttributes } from "../thead-attributes";

test("TheadAttributes - GlobalAttributesを継承する", () => {
  const attrs: TheadAttributes = {
    id: "table-header",
    className: "header-section",
    style: "background-color: #f0f0f0;",
  };

  expect(attrs.id).toBe("table-header");
  expect(attrs.className).toBe("header-section");
  expect(attrs.style).toBe("background-color: #f0f0f0;");
});

test("TheadAttributes - すべてオプショナル", () => {
  const attrs: TheadAttributes = {};

  expect(attrs.id).toBeUndefined();
  expect(attrs.className).toBeUndefined();
  expect(attrs.style).toBeUndefined();
});

test("TheadAttributes - id属性を持つ", () => {
  const attrs: TheadAttributes = {
    id: "main-header",
  };

  expect(attrs.id).toBe("main-header");
});

test("TheadAttributes - className属性を持つ", () => {
  const attrs: TheadAttributes = {
    className: "sticky-header",
  };

  expect(attrs.className).toBe("sticky-header");
});

test("TheadAttributes - style属性を持つ", () => {
  const attrs: TheadAttributes = {
    style: "font-weight: bold;",
  };

  expect(attrs.style).toBe("font-weight: bold;");
});
