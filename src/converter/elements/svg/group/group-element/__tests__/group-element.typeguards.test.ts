import { test, expect } from "vitest";
import { GroupElement } from "../group-element";

test("GroupElement.isGroupElement - GroupElement.createで作成した要素 - trueを返す", () => {
  // Arrange
  const element = GroupElement.create();

  // Act
  const result = GroupElement.isGroupElement(element);

  // Assert
  expect(result).toBe(true);
});

test("GroupElement.isGroupElement - tagName=g, type=elementのオブジェクト - trueを返す", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "g",
    attributes: {},
  };

  // Act
  const result = GroupElement.isGroupElement(node);

  // Assert
  expect(result).toBe(true);
});

test("GroupElement.isGroupElement - tagNameがg以外 - falseを返す", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "rect",
    attributes: {},
  };

  // Act
  const result = GroupElement.isGroupElement(node);

  // Assert
  expect(result).toBe(false);
});

test("GroupElement.isGroupElement - typeがelement以外 - falseを返す", () => {
  // Arrange
  const node = {
    type: "text" as const,
    tagName: "g",
    attributes: {},
  };

  // Act
  const result = GroupElement.isGroupElement(node);

  // Assert
  expect(result).toBe(false);
});

test("GroupElement.isGroupElement - null - falseを返す", () => {
  // Arrange & Act
  const result = GroupElement.isGroupElement(null);

  // Assert
  expect(result).toBe(false);
});

test("GroupElement.isGroupElement - undefined - falseを返す", () => {
  // Arrange & Act
  const result = GroupElement.isGroupElement(undefined);

  // Assert
  expect(result).toBe(false);
});

test("GroupElement.isGroupElement - オブジェクトでない値 - falseを返す", () => {
  // Arrange & Act & Assert
  expect(GroupElement.isGroupElement("g")).toBe(false);
  expect(GroupElement.isGroupElement(123)).toBe(false);
});
