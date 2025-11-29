import { test, expect } from "vitest";
import { ColElement } from "../col-element";

test("ColElement.create() - デフォルト値でColElementを生成できる", () => {
  const col = ColElement.create();

  expect(col.type).toBe("element");
  expect(col.tagName).toBe("col");
  expect(col.attributes).toEqual({});
  expect(col.children).toEqual([]);
});

test("ColElement.create() - span属性付きでColElementを生成できる", () => {
  const col = ColElement.create({ span: 2 });

  expect(col.type).toBe("element");
  expect(col.tagName).toBe("col");
  expect(col.attributes.span).toBe(2);
});

test("ColElement.create() - width属性付きでColElementを生成できる", () => {
  const col = ColElement.create({ width: "100px" });

  expect(col.attributes.width).toBe("100px");
});

test("ColElement.create() - 複数の属性付きでColElementを生成できる", () => {
  const col = ColElement.create({
    span: 3,
    width: "150px",
    id: "column-1",
    className: "highlight",
  });

  expect(col.attributes.span).toBe(3);
  expect(col.attributes.width).toBe("150px");
  expect(col.attributes.id).toBe("column-1");
  expect(col.attributes.className).toBe("highlight");
});

test("ColElement.create() - id属性のみでColElementを生成できる", () => {
  const col = ColElement.create({ id: "first-col" });

  expect(col.attributes.id).toBe("first-col");
});

test("ColElement.create() - className属性のみでColElementを生成できる", () => {
  const col = ColElement.create({ className: "styled-col" });

  expect(col.attributes.className).toBe("styled-col");
});

test("ColElement.create() - style属性付きでColElementを生成できる", () => {
  const col = ColElement.create({ style: "background-color: #ccc;" });

  expect(col.attributes.style).toBe("background-color: #ccc;");
});

test("ColElement.create() - 子要素は常に空配列", () => {
  const col = ColElement.create({ span: 2 });

  expect(col.children).toEqual([]);
  expect(col.children.length).toBe(0);
});
