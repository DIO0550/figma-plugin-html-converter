import { test, expect } from "vitest";
import { GroupElement } from "../group-element";

test("GroupElement.mapToFigma - GroupElement - FigmaNodeConfigに変換する", () => {
  // Arrange
  const element = GroupElement.create({
    id: "test-group",
  });

  // Act
  const config = GroupElement.mapToFigma(element);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.type).toBe("GROUP");
  expect(config?.name).toBe("test-group");
});

test("GroupElement.mapToFigma - HTMLNode形式のg要素 - FigmaNodeConfigに変換する", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "g",
    attributes: {
      transform: "translate(50, 100)",
    },
  };

  // Act
  const config = GroupElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.type).toBe("GROUP");
  expect(config?.x).toBe(50);
  expect(config?.y).toBe(100);
});

test("GroupElement.mapToFigma - g要素以外 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "rect",
    attributes: {},
  };

  // Act
  const config = GroupElement.mapToFigma(node);

  // Assert
  expect(config).toBeNull();
});

test("GroupElement.mapToFigma - null - nullを返す", () => {
  // Arrange & Act
  const config = GroupElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});

test("GroupElement.mapToFigma - 属性が空のg要素 - 正しく変換する", () => {
  // Arrange
  const node = {
    type: "element" as const,
    tagName: "g",
    attributes: {},
  };

  // Act
  const config = GroupElement.mapToFigma(node);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.type).toBe("GROUP");
});
