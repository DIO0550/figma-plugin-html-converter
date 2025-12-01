import { test, expect } from "vitest";
import { CircleElement } from "../circle-element";

// CircleElement.mapToFigma
test("CircleElement.mapToFigma - 文字列属性のCircleElementオブジェクト - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "circle",
    attributes: {
      cx: "50",
      cy: "50",
      r: "25",
    },
  };

  // Act
  const config = CircleElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.name).toBe("circle");
  expect(config?.type).toBe("RECTANGLE");
});

test("CircleElement.mapToFigma - 数値属性のHTMLNodeライクな構造 - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "circle",
    attributes: {
      cx: 100,
      cy: 100,
      r: 50,
      fill: "#ff0000",
    },
  };

  // Act
  const config = CircleElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.fills?.length).toBe(1);
});

test("CircleElement.mapToFigma - 異なるタグ名 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "rect",
    attributes: {},
  };

  // Act
  const config = CircleElement.mapToFigma(node);

  // Assert
  expect(config).toBeNull();
});

test("CircleElement.mapToFigma - null - nullを返す", () => {
  // Arrange & Act
  const config = CircleElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});

test("CircleElement.mapToFigma - undefined - nullを返す", () => {
  // Arrange & Act
  const config = CircleElement.mapToFigma(undefined);

  // Assert
  expect(config).toBeNull();
});

test("CircleElement.mapToFigma - 属性がないノード - デフォルト値でFigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "circle",
    attributes: {},
  };

  // Act
  const config = CircleElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.x).toBe(0);
  expect(config?.y).toBe(0);
});
