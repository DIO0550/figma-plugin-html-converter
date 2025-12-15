import { test, expect } from "vitest";
import { GroupElement, RectElement, CircleElement } from "../index";

// グループ構造の再現
test("GroupElement.create + toFigmaNode - 単一のg要素 - GROUPノードに変換される", () => {
  // Arrange
  const group = GroupElement.create({
    id: "main-group",
  });

  // Act
  const config = GroupElement.toFigmaNode(group);

  // Assert
  expect(config.type).toBe("GROUP");
  expect(config.name).toBe("main-group");
});

test("GroupElement.create + toFigmaNode - transform属性を持つg要素 - 位置が設定される", () => {
  // Arrange
  const group = GroupElement.create({
    id: "transformed-group",
    transform: "translate(100, 50)",
  });

  // Act
  const config = GroupElement.toFigmaNode(group);

  // Assert
  expect(config.type).toBe("GROUP");
  expect(config.x).toBe(100);
  expect(config.y).toBe(50);
});

test("GroupElement.create + toFigmaNode - 複数のtranslate - 移動量が合算される", () => {
  // Arrange
  const group = GroupElement.create({
    transform: "translate(10, 20) translate(30, 40)",
  });

  // Act
  const config = GroupElement.toFigmaNode(group);

  // Assert
  expect(config.x).toBe(40);
  expect(config.y).toBe(60);
});

test("GroupElement.create + toFigmaNode - opacity属性 - 不透明度が設定される", () => {
  // Arrange
  const group = GroupElement.create({
    opacity: "0.75",
  });

  // Act
  const config = GroupElement.toFigmaNode(group);

  // Assert
  expect(config.opacity).toBe(0.75);
});

// ネストされたグループ構造
test("GroupElement.create - ネストされたグループ - 子要素として保持される", () => {
  // Arrange
  const innerGroup = GroupElement.create({
    id: "inner-group",
    transform: "translate(20, 20)",
  });

  // Act
  const outerGroup = GroupElement.create(
    {
      id: "outer-group",
      transform: "translate(10, 10)",
    },
    [innerGroup],
  );

  // Assert
  expect(outerGroup.children).toHaveLength(1);
  expect(outerGroup.children?.[0].tagName).toBe("g");
});

test("GroupElement.create - グループ内の図形要素 - 子要素として保持される", () => {
  // Arrange & Act
  const group = GroupElement.create(
    {
      id: "shape-group",
    },
    [
      {
        type: "element",
        tagName: "rect",
        attributes: { x: 0, y: 0, width: 100, height: 50 },
      },
      {
        type: "element",
        tagName: "circle",
        attributes: { cx: 50, cy: 50, r: 25 },
      },
    ],
  );

  // Assert
  expect(group.children).toHaveLength(2);
  expect(group.children?.[0].tagName).toBe("rect");
  expect(group.children?.[1].tagName).toBe("circle");
});

// 型ガードのテスト
test("GroupElement.isGroupElement - 他のSVG要素 - falseを返す", () => {
  // Arrange
  const rect = RectElement.create({ x: 0, y: 0, width: 100, height: 50 });
  const circle = CircleElement.create({ cx: 50, cy: 50, r: 25 });

  // Act & Assert
  expect(GroupElement.isGroupElement(rect)).toBe(false);
  expect(GroupElement.isGroupElement(circle)).toBe(false);
});

// mapToFigmaのテスト
test("GroupElement.mapToFigma - HTMLNode形式のg要素 - GROUPノードに変換される", () => {
  // Arrange
  const htmlNode = {
    type: "element" as const,
    tagName: "g",
    attributes: {
      id: "html-group",
      transform: "translate(25, 25)",
    },
  };

  // Act
  const config = GroupElement.mapToFigma(htmlNode);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.type).toBe("GROUP");
  expect(config?.name).toBe("html-group");
  expect(config?.x).toBe(25);
  expect(config?.y).toBe(25);
});
