import { test, expect } from "vitest";
import { GroupElement } from "../group-element";

test("GroupElement.toFigmaNode - 基本的なg要素 - type=GROUP, name=gのノードを返す", () => {
  // Arrange
  const element = GroupElement.create();

  // Act
  const config = GroupElement.toFigmaNode(element);

  // Assert
  expect(config.type).toBe("GROUP");
  expect(config.name).toBe("g");
});

test("GroupElement.toFigmaNode - id属性あり - nameにidが反映される", () => {
  // Arrange
  const element = GroupElement.create({
    id: "my-group",
  });

  // Act
  const config = GroupElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("my-group");
});

test("GroupElement.toFigmaNode - translate変換を含むtransform属性 - x, yに位置が設定される", () => {
  // Arrange
  const element = GroupElement.create({
    transform: "translate(10, 20)",
  });

  // Act
  const config = GroupElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(10);
  expect(config.y).toBe(20);
});

test("GroupElement.toFigmaNode - 複数のtranslate変換 - 移動量が累積される", () => {
  // Arrange
  const element = GroupElement.create({
    transform: "translate(10, 20) translate(5, 10)",
  });

  // Act
  const config = GroupElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(15);
  expect(config.y).toBe(30);
});

test("GroupElement.toFigmaNode - opacity属性 - opacityが設定される", () => {
  // Arrange
  const element = GroupElement.create({
    opacity: "0.5",
  });

  // Act
  const config = GroupElement.toFigmaNode(element);

  // Assert
  expect(config.opacity).toBe(0.5);
});

test("GroupElement.toFigmaNode - 子要素なし - childrenは空配列", () => {
  // Arrange
  const element = GroupElement.create();

  // Act
  const config = GroupElement.toFigmaNode(element);

  // Assert
  expect(config.children).toEqual([]);
});

test("GroupElement.toFigmaNode - 子要素あり - 子要素は変換されず空配列を返す（変換は呼び出し側の責任）", () => {
  // Arrange
  const element = GroupElement.create({}, [
    {
      type: "element",
      tagName: "rect",
      attributes: { x: 0, y: 0, width: 100, height: 50 },
    },
  ]);

  // Act
  const config = GroupElement.toFigmaNode(element);

  // Assert
  expect(config.children).toEqual([]);
});
