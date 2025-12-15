import { test, expect } from "vitest";
import { DefsElement, RectElement, CircleElement } from "../index";

// defs要素の処理
test("DefsElement.mapToFigma - defs要素 - nullを返す（描画されない）", () => {
  // Arrange
  const defs = DefsElement.create({
    id: "definitions",
  });

  // Act
  const config = DefsElement.mapToFigma(defs);

  // Assert
  expect(config).toBeNull();
});

test("DefsElement.mapToFigma - グラデーション定義を含むdefs要素 - nullを返し定義は保持される", () => {
  // Arrange
  const defs = DefsElement.create({}, [
    {
      type: "element",
      tagName: "linearGradient",
      attributes: { id: "grad1", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
    },
  ]);

  // Act
  const config = DefsElement.mapToFigma(defs);

  // Assert
  expect(config).toBeNull();
  expect(DefsElement.getDefinitions(defs)).toHaveLength(1);
});

test("DefsElement.getDefinitions - 複数の定義を含むdefs要素 - 全ての定義が取得できる", () => {
  // Arrange
  const defs = DefsElement.create({}, [
    {
      type: "element",
      tagName: "linearGradient",
      attributes: { id: "grad1" },
    },
    {
      type: "element",
      tagName: "radialGradient",
      attributes: { id: "grad2" },
    },
    { type: "element", tagName: "clipPath", attributes: { id: "clip1" } },
  ]);

  // Act
  const definitions = DefsElement.getDefinitions(defs);

  // Assert
  expect(definitions).toHaveLength(3);
});

// 型ガードのテスト
test("DefsElement.isDefsElement - 他のSVG要素 - falseを返す", () => {
  // Arrange
  const rect = RectElement.create({ x: 0, y: 0, width: 100, height: 50 });
  const circle = CircleElement.create({ cx: 50, cy: 50, r: 25 });

  // Act & Assert
  expect(DefsElement.isDefsElement(rect)).toBe(false);
  expect(DefsElement.isDefsElement(circle)).toBe(false);
});

// mapToFigmaのテスト
test("DefsElement.mapToFigma - HTMLNode形式のdefs要素 - nullを返す", () => {
  // Arrange
  const htmlNode = {
    type: "element" as const,
    tagName: "defs",
    attributes: {},
  };

  // Act
  const config = DefsElement.mapToFigma(htmlNode);

  // Assert
  expect(config).toBeNull();
});
