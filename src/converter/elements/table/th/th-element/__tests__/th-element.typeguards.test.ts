import { test, expect } from "vitest";
import { ThElement } from "../th-element";

test("ThElement.isThElement() - 有効なThElementに対してtrueを返す", () => {
  const element = ThElement.create();

  expect(ThElement.isThElement(element)).toBe(true);
});

test("ThElement.isThElement() - 属性を持つth要素に対してtrueを返す", () => {
  const element = ThElement.create({
    id: "test-header",
    width: "100px",
    scope: "col",
  });

  expect(ThElement.isThElement(element)).toBe(true);
});

test("ThElement.isThElement() - nullに対してfalseを返す", () => {
  expect(ThElement.isThElement(null)).toBe(false);
});

test("ThElement.isThElement() - undefinedに対してfalseを返す", () => {
  expect(ThElement.isThElement(undefined)).toBe(false);
});

test("ThElement.isThElement() - 非要素オブジェクトに対してfalseを返す", () => {
  expect(ThElement.isThElement({})).toBe(false);
});

test("ThElement.isThElement() - 異なる要素タイプに対してfalseを返す", () => {
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  expect(ThElement.isThElement(divElement)).toBe(false);
});

test("ThElement.isThElement() - td要素に対してfalseを返す", () => {
  const tdElement = {
    type: "element",
    tagName: "td",
    attributes: {},
    children: [],
  };

  expect(ThElement.isThElement(tdElement)).toBe(false);
});

test("ThElement.isThElement() - typeプロパティが欠けているオブジェクトに対してfalseを返す", () => {
  const invalidElement = {
    tagName: "th",
    attributes: {},
    children: [],
  };

  expect(ThElement.isThElement(invalidElement)).toBe(false);
});

test("ThElement.isThElement() - tagNameプロパティが欠けているオブジェクトに対してfalseを返す", () => {
  const invalidElement = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(ThElement.isThElement(invalidElement)).toBe(false);
});
