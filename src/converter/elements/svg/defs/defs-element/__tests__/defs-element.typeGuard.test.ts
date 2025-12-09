import { test, expect } from "vitest";
import { DefsElement } from "../defs-element";

test("DefsElement.isDefsElement - DefsElement.createで作成した要素 - trueを返す", () => {
  // Arrange
  const element = DefsElement.create();

  // Act
  const result = DefsElement.isDefsElement(element);

  // Assert
  expect(result).toBe(true);
});

test("DefsElement.isDefsElement - tagName=defs, type=elementのオブジェクト - trueを返す", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "defs",
    attributes: {},
  };

  // Act
  const result = DefsElement.isDefsElement(node);

  // Assert
  expect(result).toBe(true);
});

test("DefsElement.isDefsElement - tagNameがdefs以外 - falseを返す", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "g",
    attributes: {},
  };

  // Act
  const result = DefsElement.isDefsElement(node);

  // Assert
  expect(result).toBe(false);
});

test("DefsElement.isDefsElement - typeがelement以外 - falseを返す", () => {
  // Arrange
  const node = {
    type: "text" as const,
    tagName: "defs",
    attributes: {},
  };

  // Act
  const result = DefsElement.isDefsElement(node);

  // Assert
  expect(result).toBe(false);
});

test("DefsElement.isDefsElement - null - falseを返す", () => {
  // Arrange & Act
  const result = DefsElement.isDefsElement(null);

  // Assert
  expect(result).toBe(false);
});

test("DefsElement.isDefsElement - undefined - falseを返す", () => {
  // Arrange & Act
  const result = DefsElement.isDefsElement(undefined);

  // Assert
  expect(result).toBe(false);
});

test("DefsElement.isDefsElement - オブジェクトでない値 - falseを返す", () => {
  // Arrange & Act & Assert
  expect(DefsElement.isDefsElement("defs")).toBe(false);
  expect(DefsElement.isDefsElement(123)).toBe(false);
});
