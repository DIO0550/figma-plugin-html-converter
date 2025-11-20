import { test, expect } from "vitest";
import type { ThAttributes } from "../th-attributes";

test("ThAttributes - GlobalAttributes properties を受け入れる", () => {
  const attributes: ThAttributes = {
    id: "test-id",
    className: "test-class",
    style: "color: red;",
  };

  expect(attributes.id).toBe("test-id");
  expect(attributes.className).toBe("test-class");
  expect(attributes.style).toBe("color: red;");
});

test("ThAttributes - width 属性のみを受け入れる", () => {
  const attributes: ThAttributes = {
    width: "100px",
  };

  expect(attributes.width).toBe("100px");
});

test("ThAttributes - height 属性のみを受け入れる", () => {
  const attributes: ThAttributes = {
    height: "50px",
  };

  expect(attributes.height).toBe("50px");
});

test("ThAttributes - scope 属性のみを受け入れる", () => {
  const attributes: ThAttributes = {
    scope: "col",
  };

  expect(attributes.scope).toBe("col");
});

test("ThAttributes - abbr 属性のみを受け入れる", () => {
  const attributes: ThAttributes = {
    abbr: "Name",
  };

  expect(attributes.abbr).toBe("Name");
});

test("ThAttributes - colspan 属性のみを受け入れる", () => {
  const attributes: ThAttributes = {
    colspan: "2",
  };

  expect(attributes.colspan).toBe("2");
});

test("ThAttributes - rowspan 属性のみを受け入れる", () => {
  const attributes: ThAttributes = {
    rowspan: "3",
  };

  expect(attributes.rowspan).toBe("3");
});

test("ThAttributes - width と height の両方を受け入れる", () => {
  const attributes: ThAttributes = {
    width: "200px",
    height: "100px",
  };

  expect(attributes.width).toBe("200px");
  expect(attributes.height).toBe("100px");
});

test("ThAttributes - scope の全ての有効な値を受け入れる", () => {
  const col: ThAttributes = { scope: "col" };
  const row: ThAttributes = { scope: "row" };
  const colgroup: ThAttributes = { scope: "colgroup" };
  const rowgroup: ThAttributes = { scope: "rowgroup" };

  expect(col.scope).toBe("col");
  expect(row.scope).toBe("row");
  expect(colgroup.scope).toBe("colgroup");
  expect(rowgroup.scope).toBe("rowgroup");
});

test("ThAttributes - 全ての属性を同時に受け入れる", () => {
  const attributes: ThAttributes = {
    id: "header-1",
    className: "table-header",
    style: "border: 1px solid black; padding: 10px;",
    width: "150px",
    height: "75px",
    scope: "col",
    abbr: "Product Name",
    colspan: "2",
    rowspan: "1",
  };

  expect(attributes.id).toBe("header-1");
  expect(attributes.className).toBe("table-header");
  expect(attributes.style).toBe("border: 1px solid black; padding: 10px;");
  expect(attributes.width).toBe("150px");
  expect(attributes.height).toBe("75px");
  expect(attributes.scope).toBe("col");
  expect(attributes.abbr).toBe("Product Name");
  expect(attributes.colspan).toBe("2");
  expect(attributes.rowspan).toBe("1");
});

test("ThAttributes - 空の属性オブジェクトを許可する", () => {
  const attributes: ThAttributes = {};

  expect(Object.keys(attributes).length).toBe(0);
});
