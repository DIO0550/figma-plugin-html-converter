import { test, expect } from "vitest";
import { ColgroupElement } from "../colgroup-element";

test("ColgroupElement.isColgroupElement() - 正常なColgroupElementオブジェクトはtrueを返す", () => {
  const node = {
    type: "element",
    tagName: "colgroup",
    attributes: {},
    children: [],
  };

  expect(ColgroupElement.isColgroupElement(node)).toBe(true);
});

test("ColgroupElement.isColgroupElement() - ColgroupElement.create()で生成した要素はtrueを返す", () => {
  const colgroup = ColgroupElement.create({ span: 2 });

  expect(ColgroupElement.isColgroupElement(colgroup)).toBe(true);
});

test("ColgroupElement.isColgroupElement() - 属性を持つColgroupElementはtrueを返す", () => {
  const node = {
    type: "element",
    tagName: "colgroup",
    attributes: {
      span: 3,
      id: "colgroup-1",
    },
    children: [],
  };

  expect(ColgroupElement.isColgroupElement(node)).toBe(true);
});

test("ColgroupElement.isColgroupElement() - 子要素を持つColgroupElementはtrueを返す", () => {
  const node = {
    type: "element",
    tagName: "colgroup",
    attributes: {},
    children: [
      { type: "element", tagName: "col", attributes: {}, children: [] },
    ],
  };

  expect(ColgroupElement.isColgroupElement(node)).toBe(true);
});

test("ColgroupElement.isColgroupElement() - nullはfalseを返す", () => {
  expect(ColgroupElement.isColgroupElement(null)).toBe(false);
});

test("ColgroupElement.isColgroupElement() - undefinedはfalseを返す", () => {
  expect(ColgroupElement.isColgroupElement(undefined)).toBe(false);
});

test("ColgroupElement.isColgroupElement() - 文字列はfalseを返す", () => {
  expect(ColgroupElement.isColgroupElement("colgroup")).toBe(false);
});

test("ColgroupElement.isColgroupElement() - 数値はfalseを返す", () => {
  expect(ColgroupElement.isColgroupElement(123)).toBe(false);
});

test("ColgroupElement.isColgroupElement() - 配列はfalseを返す", () => {
  expect(ColgroupElement.isColgroupElement([])).toBe(false);
});

test("ColgroupElement.isColgroupElement() - type属性がないオブジェクトはfalseを返す", () => {
  const node = {
    tagName: "colgroup",
    attributes: {},
    children: [],
  };

  expect(ColgroupElement.isColgroupElement(node)).toBe(false);
});

test("ColgroupElement.isColgroupElement() - tagName属性がないオブジェクトはfalseを返す", () => {
  const node = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(ColgroupElement.isColgroupElement(node)).toBe(false);
});

test("ColgroupElement.isColgroupElement() - typeがelementでないオブジェクトはfalseを返す", () => {
  const node = {
    type: "text",
    tagName: "colgroup",
    attributes: {},
    children: [],
  };

  expect(ColgroupElement.isColgroupElement(node)).toBe(false);
});

test("ColgroupElement.isColgroupElement() - tagNameがcolgroupでないオブジェクトはfalseを返す", () => {
  const node = {
    type: "element",
    tagName: "col",
    attributes: {},
    children: [],
  };

  expect(ColgroupElement.isColgroupElement(node)).toBe(false);
});

test("ColgroupElement.isColgroupElement() - 空のオブジェクトはfalseを返す", () => {
  expect(ColgroupElement.isColgroupElement({})).toBe(false);
});
