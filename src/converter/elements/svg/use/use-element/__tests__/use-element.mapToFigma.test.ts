import { test, expect } from "vitest";
import { UseElement } from "../use-element";

// UseElement.mapToFigma - マッピングのテスト

test("UseElement.mapToFigma - UseElement - Figmaノード設定に変換できる", () => {
  // Arrange
  const element = UseElement.create({ href: "#rect1" });

  // Act
  const config = UseElement.mapToFigma(element);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.type).toBe("GROUP");
});

test("UseElement.mapToFigma - HTMLNode形式のuse要素 - Figmaノード設定に変換できる", () => {
  // Arrange
  const htmlNode = {
    type: "element" as const,
    tagName: "use",
    attributes: { href: "#shape1" },
  };

  // Act
  const config = UseElement.mapToFigma(htmlNode);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.type).toBe("GROUP");
});

test("UseElement.mapToFigma - use要素以外 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "rect",
    attributes: {},
  };

  // Act
  const config = UseElement.mapToFigma(node);

  // Assert
  expect(config).toBeNull();
});

test("UseElement.mapToFigma - null - nullを返す", () => {
  // Act
  const config = UseElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});

test("UseElement.mapToFigma - id属性あり - ノード名としてid値が使用される", () => {
  // Arrange
  const htmlNode = {
    type: "element" as const,
    tagName: "use",
    attributes: { id: "myUse", href: "#symbol1" },
  };

  // Act
  const config = UseElement.mapToFigma(htmlNode);

  // Assert
  expect(config?.name).toBe("myUse");
});

test("UseElement.mapToFigma - 位置属性あり - x, yが適用される", () => {
  // Arrange
  const htmlNode = {
    type: "element" as const,
    tagName: "use",
    attributes: { href: "#shape", x: 100, y: 50 },
  };

  // Act
  const config = UseElement.mapToFigma(htmlNode);

  // Assert
  expect(config?.x).toBe(100);
  expect(config?.y).toBe(50);
});
