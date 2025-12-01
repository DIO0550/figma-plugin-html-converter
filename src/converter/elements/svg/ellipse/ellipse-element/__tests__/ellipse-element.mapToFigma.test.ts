import { test, expect } from "vitest";
import { EllipseElement } from "../ellipse-element";

// EllipseElement.mapToFigma
test("EllipseElement.mapToFigma - 文字列属性のEllipseElementオブジェクト - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "ellipse",
    attributes: {
      cx: "100",
      cy: "50",
      rx: "80",
      ry: "40",
    },
  };

  // Act
  const config = EllipseElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.name).toBe("ellipse");
  expect(config?.type).toBe("RECTANGLE");
});

test("EllipseElement.mapToFigma - 数値属性のHTMLNodeライクな構造 - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "ellipse",
    attributes: {
      cx: 100,
      cy: 50,
      rx: 80,
      ry: 40,
      fill: "#ff0000",
    },
  };

  // Act
  const config = EllipseElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.fills?.length).toBe(1);
});

test("EllipseElement.mapToFigma - 異なるタグ名 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "circle",
    attributes: {},
  };

  // Act
  const config = EllipseElement.mapToFigma(node);

  // Assert
  expect(config).toBeNull();
});

test("EllipseElement.mapToFigma - null - nullを返す", () => {
  // Arrange & Act
  const config = EllipseElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});

test("EllipseElement.mapToFigma - undefined - nullを返す", () => {
  // Arrange & Act
  const config = EllipseElement.mapToFigma(undefined);

  // Assert
  expect(config).toBeNull();
});
