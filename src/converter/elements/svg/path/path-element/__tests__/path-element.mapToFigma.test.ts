import { test, expect } from "vitest";
import { PathElement } from "../path-element";

test("PathElement.mapToFigma - PathElement.createで作成した要素を渡す - FigmaNodeConfigを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "M0 0 L100 100" });

  // Act
  const config = PathElement.mapToFigma(element);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.type).toBe("FRAME");
});

test("PathElement.mapToFigma - HTMLNodeライクな構造{type:'element', tagName:'path'}を渡す - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "path",
    attributes: {
      d: "M10 20 L50 80",
      fill: "#ff0000",
    },
  };

  // Act
  const config = PathElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.type).toBe("FRAME");
  expect(config?.fills).toHaveLength(1);
});

test("PathElement.mapToFigma - tagName='rect'の要素を渡す - nullを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "rect",
    attributes: { d: "M0 0 L100 100" },
  };

  // Act
  const config = PathElement.mapToFigma(node);

  // Assert
  expect(config).toBeNull();
});

test("PathElement.mapToFigma - nullを渡す - nullを返す", () => {
  // Act
  const config = PathElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});

test("PathElement.mapToFigma - undefinedを渡す - nullを返す", () => {
  // Act
  const config = PathElement.mapToFigma(undefined);

  // Assert
  expect(config).toBeNull();
});

test("PathElement.mapToFigma - 空オブジェクトを渡す - nullを返す", () => {
  // Act
  const config = PathElement.mapToFigma({});

  // Assert
  expect(config).toBeNull();
});

test("PathElement.mapToFigma - stroke属性を持つHTMLNodeライクな構造を渡す - strokesとstrokeWeightが設定されたFigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "path",
    attributes: {
      d: "M0 0 L100 100",
      stroke: "#00ff00",
      "stroke-width": "2",
    },
  };

  // Act
  const config = PathElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.strokes).toHaveLength(1);
  expect(config?.strokeWeight).toBe(2);
});
