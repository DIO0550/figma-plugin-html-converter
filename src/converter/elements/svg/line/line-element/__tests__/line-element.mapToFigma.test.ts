import { test, expect } from "vitest";
import { LineElement } from "../line-element";

// LineElement.mapToFigma
test("LineElement.mapToFigma - 文字列属性のLineElementオブジェクト - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "line",
    attributes: {
      x1: "10",
      y1: "20",
      x2: "100",
      y2: "80",
    },
  };

  // Act
  const config = LineElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.name).toBe("line");
  expect(config?.type).toBe("FRAME");
});

test("LineElement.mapToFigma - 数値属性のHTMLNodeライクな構造 - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "line",
    attributes: {
      x1: 10,
      y1: 20,
      x2: 100,
      y2: 80,
      stroke: "#ff0000",
    },
  };

  // Act
  const config = LineElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.strokes?.length).toBe(1);
});

test("LineElement.mapToFigma - 異なるタグ名 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "circle",
    attributes: {},
  };

  // Act
  const config = LineElement.mapToFigma(node);

  // Assert
  expect(config).toBeNull();
});

test("LineElement.mapToFigma - null - nullを返す", () => {
  // Arrange & Act
  const config = LineElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});

test("LineElement.mapToFigma - undefined - nullを返す", () => {
  // Arrange & Act
  const config = LineElement.mapToFigma(undefined);

  // Assert
  expect(config).toBeNull();
});
