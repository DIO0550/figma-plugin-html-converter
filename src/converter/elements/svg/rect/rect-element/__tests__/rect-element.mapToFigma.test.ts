import { test, expect } from "vitest";
import { RectElement } from "../rect-element";

// RectElement.mapToFigma
test("RectElement.mapToFigma - 文字列属性のRectElementオブジェクト - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "rect",
    attributes: {
      x: "10",
      y: "20",
      width: "100",
      height: "50",
    },
  };

  // Act
  const config = RectElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.name).toBe("rect");
  expect(config?.type).toBe("RECTANGLE");
});

test("RectElement.mapToFigma - 数値属性のHTMLNodeライクな構造 - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "rect",
    attributes: {
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      fill: "#ff0000",
    },
  };

  // Act
  const config = RectElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.fills?.length).toBe(1);
});

test("RectElement.mapToFigma - 異なるタグ名 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "circle",
    attributes: {},
  };

  // Act
  const config = RectElement.mapToFigma(node);

  // Assert
  expect(config).toBeNull();
});

test("RectElement.mapToFigma - null - nullを返す", () => {
  // Arrange & Act
  const config = RectElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});

test("RectElement.mapToFigma - undefined - nullを返す", () => {
  // Arrange & Act
  const config = RectElement.mapToFigma(undefined);

  // Assert
  expect(config).toBeNull();
});
