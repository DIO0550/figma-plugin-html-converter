import { test, expect } from "vitest";
import { ColgroupElement } from "../colgroup-element";
import { ColElement } from "../../../col";

test("ColgroupElement.create() - デフォルト値でColgroupElementを生成できる", () => {
  const colgroup = ColgroupElement.create();

  expect(colgroup.type).toBe("element");
  expect(colgroup.tagName).toBe("colgroup");
  expect(colgroup.attributes).toEqual({});
  expect(colgroup.children).toEqual([]);
});

test("ColgroupElement.create() - span属性付きでColgroupElementを生成できる", () => {
  const colgroup = ColgroupElement.create({ span: 3 });

  expect(colgroup.type).toBe("element");
  expect(colgroup.tagName).toBe("colgroup");
  expect(colgroup.attributes?.span).toBe(3);
});

test("ColgroupElement.create() - id属性付きでColgroupElementを生成できる", () => {
  const colgroup = ColgroupElement.create({ id: "header-group" });

  expect(colgroup.attributes?.id).toBe("header-group");
});

test("ColgroupElement.create() - className属性付きでColgroupElementを生成できる", () => {
  const colgroup = ColgroupElement.create({ className: "styled-group" });

  expect(colgroup.attributes?.className).toBe("styled-group");
});

test("ColgroupElement.create() - 複数の属性付きでColgroupElementを生成できる", () => {
  const colgroup = ColgroupElement.create({
    span: 2,
    id: "colgroup-1",
    className: "highlight",
    style: "background-color: #eee;",
  });

  expect(colgroup.attributes?.span).toBe(2);
  expect(colgroup.attributes?.id).toBe("colgroup-1");
  expect(colgroup.attributes?.className).toBe("highlight");
  expect(colgroup.attributes?.style).toBe("background-color: #eee;");
});

test("ColgroupElement.create() - 子要素なしで生成すると空配列", () => {
  const colgroup = ColgroupElement.create({ span: 2 });

  expect(colgroup.children).toEqual([]);
  expect(colgroup.children.length).toBe(0);
});

test("ColgroupElement.createWithChildren() - col子要素付きでColgroupElementを生成できる", () => {
  const col1 = ColElement.create({ span: 1 });
  const col2 = ColElement.create({ span: 2 });

  const colgroup = ColgroupElement.createWithChildren({}, [col1, col2]);

  expect(colgroup.type).toBe("element");
  expect(colgroup.tagName).toBe("colgroup");
  expect(colgroup.children.length).toBe(2);
});

test("ColgroupElement.createWithChildren() - 属性と子要素両方を設定できる", () => {
  const col = ColElement.create({ width: "100px" });

  const colgroup = ColgroupElement.createWithChildren(
    { id: "group-1", className: "header" },
    [col],
  );

  expect(colgroup.attributes?.id).toBe("group-1");
  expect(colgroup.attributes?.className).toBe("header");
  expect(colgroup.children.length).toBe(1);
});
