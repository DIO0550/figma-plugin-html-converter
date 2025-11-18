import { test, expect } from "vitest";
import { TdElement } from "../td-element";

test("TdElement.isTdElement() - 有効なTdElementに対してtrueを返す", () => {
  // Arrange
  const element = TdElement.create();

  // Act & Assert
  expect(TdElement.isTdElement(element)).toBe(true);
});

test("TdElement.isTdElement() - 属性を持つtd要素に対してtrueを返す", () => {
  // Arrange
  const element = TdElement.create({
    id: "test-cell",
    width: "100px",
  });

  // Act & Assert
  expect(TdElement.isTdElement(element)).toBe(true);
});

test("TdElement.isTdElement() - nullに対してfalseを返す", () => {
  // Act & Assert
  expect(TdElement.isTdElement(null)).toBe(false);
});

test("TdElement.isTdElement() - undefinedに対してfalseを返す", () => {
  // Act & Assert
  expect(TdElement.isTdElement(undefined)).toBe(false);
});

test("TdElement.isTdElement() - 非要素オブジェクトに対してfalseを返す", () => {
  // Act & Assert
  expect(TdElement.isTdElement({})).toBe(false);
});

test("TdElement.isTdElement() - 異なる要素タイプに対してfalseを返す", () => {
  // Arrange
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  // Act & Assert
  expect(TdElement.isTdElement(divElement)).toBe(false);
});

test("TdElement.isTdElement() - typeプロパティが欠けているオブジェクトに対してfalseを返す", () => {
  // Arrange
  const invalidElement = {
    tagName: "td",
    attributes: {},
    children: [],
  };

  // Act & Assert
  expect(TdElement.isTdElement(invalidElement)).toBe(false);
});

test("TdElement.isTdElement() - tagNameプロパティが欠けているオブジェクトに対してfalseを返す", () => {
  // Arrange
  const invalidElement = {
    type: "element",
    attributes: {},
    children: [],
  };

  // Act & Assert
  expect(TdElement.isTdElement(invalidElement)).toBe(false);
});
