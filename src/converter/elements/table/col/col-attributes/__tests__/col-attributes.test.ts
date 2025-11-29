import { test, expect } from "vitest";
import type { ColAttributes } from "../col-attributes";

test("ColAttributes - span属性に数値を設定できる", () => {
  const attrs: ColAttributes = {
    span: 2,
  };

  expect(attrs.span).toBe(2);
});

test("ColAttributes - span属性に文字列を設定できる", () => {
  const attrs: ColAttributes = {
    span: "3",
  };

  expect(attrs.span).toBe("3");
});

test("ColAttributes - width属性に文字列を設定できる", () => {
  const attrs: ColAttributes = {
    width: "100px",
  };

  expect(attrs.width).toBe("100px");
});

test("ColAttributes - width属性に数値を設定できる", () => {
  const attrs: ColAttributes = {
    width: 150,
  };

  expect(attrs.width).toBe(150);
});

test("ColAttributes - すべての属性を設定できる", () => {
  const attrs: ColAttributes = {
    span: 2,
    width: "200px",
    id: "column-1",
    className: "highlight-column",
    style: "background-color: #f0f0f0;",
  };

  expect(attrs.span).toBe(2);
  expect(attrs.width).toBe("200px");
  expect(attrs.id).toBe("column-1");
  expect(attrs.className).toBe("highlight-column");
  expect(attrs.style).toBe("background-color: #f0f0f0;");
});

test("ColAttributes - 属性なしでも有効", () => {
  const attrs: ColAttributes = {};

  expect(attrs.span).toBeUndefined();
  expect(attrs.width).toBeUndefined();
});

test("ColAttributes - GlobalAttributesを継承している", () => {
  const attrs: ColAttributes = {
    id: "col-1",
    className: "table-col",
    style: "width: 100px;",
  };

  expect(attrs.id).toBe("col-1");
  expect(attrs.className).toBe("table-col");
  expect(attrs.style).toBe("width: 100px;");
});
