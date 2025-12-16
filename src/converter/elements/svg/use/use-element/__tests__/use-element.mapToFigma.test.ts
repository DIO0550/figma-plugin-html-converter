import { describe, test, expect } from "vitest";
import { UseElement } from "../use-element";

describe("UseElement.mapToFigma", () => {
  test("UseElementをFigmaノード設定に変換できる", () => {
    // Arrange
    const element = UseElement.create({ href: "#rect1" });

    // Act
    const config = UseElement.mapToFigma(element);

    // Assert
    expect(config).not.toBeNull();
    expect(config?.type).toBe("GROUP");
  });

  test("HTMLNode形式のuse要素を変換できる", () => {
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

  test("use要素以外の場合、nullを返す", () => {
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

  test("nullの場合、nullを返す", () => {
    // Act
    const config = UseElement.mapToFigma(null);

    // Assert
    expect(config).toBeNull();
  });

  test("id属性がある場合、ノード名として使用", () => {
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

  test("位置属性がある場合、適用される", () => {
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
});
