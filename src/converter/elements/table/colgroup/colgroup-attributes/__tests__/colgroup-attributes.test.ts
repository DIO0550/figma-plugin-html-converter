import { test, expect } from "vitest";
import type { ColgroupAttributes } from "../colgroup-attributes";

test("ColgroupAttributes - span属性に数値を設定できる", () => {
  const attrs: ColgroupAttributes = {
    span: 3,
  };

  expect(attrs.span).toBe(3);
});

test("ColgroupAttributes - span属性に文字列を設定できる", () => {
  const attrs: ColgroupAttributes = {
    span: "4",
  };

  expect(attrs.span).toBe("4");
});

test("ColgroupAttributes - すべての属性を設定できる", () => {
  const attrs: ColgroupAttributes = {
    span: 2,
    id: "colgroup-1",
    className: "header-columns",
    style: "background-color: #f0f0f0;",
  };

  expect(attrs.span).toBe(2);
  expect(attrs.id).toBe("colgroup-1");
  expect(attrs.className).toBe("header-columns");
  expect(attrs.style).toBe("background-color: #f0f0f0;");
});

test("ColgroupAttributes - 属性なしでも有効", () => {
  const attrs: ColgroupAttributes = {};

  expect(attrs.span).toBeUndefined();
});

test("ColgroupAttributes - GlobalAttributesを継承している", () => {
  const attrs: ColgroupAttributes = {
    id: "cg-1",
    className: "table-colgroup",
    style: "visibility: collapse;",
  };

  expect(attrs.id).toBe("cg-1");
  expect(attrs.className).toBe("table-colgroup");
  expect(attrs.style).toBe("visibility: collapse;");
});

test("ColgroupAttributes - span属性のみでも有効", () => {
  const attrs: ColgroupAttributes = {
    span: 5,
  };

  expect(attrs.span).toBe(5);
  expect(attrs.id).toBeUndefined();
});
