import { test, expect } from "vitest";
import { DefsElement } from "../defs-element";

test("DefsElement.mapToFigma - defs要素 - nullを返す（描画されない）", () => {
  // Arrange
  const element = DefsElement.create();

  // Act
  const config = DefsElement.mapToFigma(element);

  // Assert
  expect(config).toBeNull();
});

test("DefsElement.mapToFigma - 定義を含むdefs要素 - nullを返す", () => {
  // Arrange
  const element = DefsElement.create({}, [
    {
      type: "element",
      tagName: "linearGradient",
      attributes: { id: "grad1" },
    },
  ]);

  // Act
  const config = DefsElement.mapToFigma(element);

  // Assert
  expect(config).toBeNull();
});

test("DefsElement.mapToFigma - HTMLNode形式のdefs要素 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "defs",
    attributes: {},
  };

  // Act
  const config = DefsElement.mapToFigma(node);

  // Assert
  expect(config).toBeNull();
});

test("DefsElement.mapToFigma - defs要素以外 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "g",
    attributes: {},
  };

  // Act
  const config = DefsElement.mapToFigma(node);

  // Assert
  expect(config).toBeNull();
});

test("DefsElement.mapToFigma - null - nullを返す", () => {
  // Arrange & Act
  const config = DefsElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});
