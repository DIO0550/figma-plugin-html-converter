import { test, expect } from "vitest";
import { ThElement } from "../th-element";

test("ThElement.create() - デフォルト属性で要素を作成する", () => {
  const element = ThElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("th");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("ThElement.create() - id属性を指定して作成する", () => {
  const element = ThElement.create({ id: "header-1" });

  expect(element.attributes.id).toBe("header-1");
});

test("ThElement.create() - className属性を指定して作成する", () => {
  const element = ThElement.create({ className: "table-header" });

  expect(element.attributes.className).toBe("table-header");
});

test("ThElement.create() - style属性を指定して作成する", () => {
  const element = ThElement.create({
    style: "background-color: #f0f0f0;",
  });

  expect(element.attributes.style).toBe("background-color: #f0f0f0;");
});

test("ThElement.create() - width属性を指定して作成する", () => {
  const element = ThElement.create({ width: "150px" });

  expect(element.attributes.width).toBe("150px");
});

test("ThElement.create() - height属性を指定して作成する", () => {
  const element = ThElement.create({ height: "50px" });

  expect(element.attributes.height).toBe("50px");
});

test("ThElement.create() - scope属性を指定して作成する (col)", () => {
  const element = ThElement.create({ scope: "col" });

  expect(element.attributes.scope).toBe("col");
});

test("ThElement.create() - scope属性を指定して作成する (row)", () => {
  const element = ThElement.create({ scope: "row" });

  expect(element.attributes.scope).toBe("row");
});

test("ThElement.create() - scope属性を指定して作成する (colgroup)", () => {
  const element = ThElement.create({ scope: "colgroup" });

  expect(element.attributes.scope).toBe("colgroup");
});

test("ThElement.create() - scope属性を指定して作成する (rowgroup)", () => {
  const element = ThElement.create({ scope: "rowgroup" });

  expect(element.attributes.scope).toBe("rowgroup");
});

test("ThElement.create() - abbr属性を指定して作成する", () => {
  const element = ThElement.create({ abbr: "Name" });

  expect(element.attributes.abbr).toBe("Name");
});

test("ThElement.create() - colspan属性を指定して作成する", () => {
  const element = ThElement.create({ colspan: "2" });

  expect(element.attributes.colspan).toBe("2");
});

test("ThElement.create() - rowspan属性を指定して作成する", () => {
  const element = ThElement.create({ rowspan: "3" });

  expect(element.attributes.rowspan).toBe("3");
});

test("ThElement.create() - 複数の属性を同時に指定して作成する", () => {
  const element = ThElement.create({
    id: "header-1",
    className: "table-header",
    style: "font-weight: bold;",
    width: "200px",
    height: "60px",
    scope: "col",
    abbr: "Product",
    colspan: "2",
    rowspan: "1",
  });

  expect(element.attributes.id).toBe("header-1");
  expect(element.attributes.className).toBe("table-header");
  expect(element.attributes.style).toBe("font-weight: bold;");
  expect(element.attributes.width).toBe("200px");
  expect(element.attributes.height).toBe("60px");
  expect(element.attributes.scope).toBe("col");
  expect(element.attributes.abbr).toBe("Product");
  expect(element.attributes.colspan).toBe("2");
  expect(element.attributes.rowspan).toBe("1");
});
