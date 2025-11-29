import { test, expect } from "vitest";
import { ColElement } from "../col-element";

test("ColElement.isColElement() - 正常なColElementオブジェクトはtrueを返す", () => {
  const node = {
    type: "element",
    tagName: "col",
    attributes: {},
    children: [],
  };

  expect(ColElement.isColElement(node)).toBe(true);
});

test("ColElement.isColElement() - ColElement.create()で生成した要素はtrueを返す", () => {
  const col = ColElement.create({ span: 2 });

  expect(ColElement.isColElement(col)).toBe(true);
});

test("ColElement.isColElement() - 属性を持つColElementはtrueを返す", () => {
  const node = {
    type: "element",
    tagName: "col",
    attributes: {
      span: 3,
      width: "100px",
      id: "column-1",
    },
    children: [],
  };

  expect(ColElement.isColElement(node)).toBe(true);
});

test("ColElement.isColElement() - nullはfalseを返す", () => {
  expect(ColElement.isColElement(null)).toBe(false);
});

test("ColElement.isColElement() - undefinedはfalseを返す", () => {
  expect(ColElement.isColElement(undefined)).toBe(false);
});

test("ColElement.isColElement() - 文字列はfalseを返す", () => {
  expect(ColElement.isColElement("col")).toBe(false);
});

test("ColElement.isColElement() - 数値はfalseを返す", () => {
  expect(ColElement.isColElement(123)).toBe(false);
});

test("ColElement.isColElement() - 配列はfalseを返す", () => {
  expect(ColElement.isColElement([])).toBe(false);
});

test("ColElement.isColElement() - type属性がないオブジェクトはfalseを返す", () => {
  const node = {
    tagName: "col",
    attributes: {},
    children: [],
  };

  expect(ColElement.isColElement(node)).toBe(false);
});

test("ColElement.isColElement() - tagName属性がないオブジェクトはfalseを返す", () => {
  const node = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(ColElement.isColElement(node)).toBe(false);
});

test("ColElement.isColElement() - typeがelementでないオブジェクトはfalseを返す", () => {
  const node = {
    type: "text",
    tagName: "col",
    attributes: {},
    children: [],
  };

  expect(ColElement.isColElement(node)).toBe(false);
});

test("ColElement.isColElement() - tagNameがcolでないオブジェクトはfalseを返す", () => {
  const node = {
    type: "element",
    tagName: "colgroup",
    attributes: {},
    children: [],
  };

  expect(ColElement.isColElement(node)).toBe(false);
});

test("ColElement.isColElement() - 空のオブジェクトはfalseを返す", () => {
  expect(ColElement.isColElement({})).toBe(false);
});
