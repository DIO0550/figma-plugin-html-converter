import { test, expect } from "vitest";
import {
  GroupElement,
  DefsElement,
  RectElement,
  CircleElement,
} from "../index";

// グループ構造の再現
test("統合: GroupElement.create + toFigmaNode - 単一のg要素 - GROUPノードに変換される", () => {
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

test("統合: GroupElement.create + toFigmaNode - transform属性を持つg要素 - 位置が設定される", () => {
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

test("統合: GroupElement.create + toFigmaNode - 複数のtranslate - 移動量が合算される", () => {
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

test("統合: GroupElement.create + toFigmaNode - opacity属性 - 不透明度が設定される", () => {
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
test("統合: GroupElement.create - ネストされたグループ - 子要素として保持される", () => {
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

test("統合: GroupElement.create - グループ内の図形要素 - 子要素として保持される", () => {
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

// defs要素の処理
test("統合: DefsElement.mapToFigma - defs要素 - nullを返す（描画されない）", () => {
  // Arrange
  const defs = DefsElement.create({
    id: "definitions",
  });

  // Act
  const config = DefsElement.mapToFigma(defs);

  // Assert
  expect(config).toBeNull();
});

test("統合: DefsElement.mapToFigma - グラデーション定義を含むdefs要素 - nullを返し定義は保持される", () => {
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

test("統合: DefsElement.getDefinitions - 複数の定義を含むdefs要素 - 全ての定義が取得できる", () => {
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

// グループとdefs要素の組み合わせ
test("統合: GroupElement + DefsElement - defs要素を子に持つg要素 - グループは変換されdefs要素は子として保持される", () => {
  // Arrange
  const group = GroupElement.create(
    {
      id: "group-with-defs",
    },
    [
      { type: "element", tagName: "defs", attributes: {} },
      {
        type: "element",
        tagName: "rect",
        attributes: { x: 0, y: 0, width: 100, height: 50 },
      },
    ],
  );

  // Act
  const config = GroupElement.toFigmaNode(group);

  // Assert
  expect(group.children).toHaveLength(2);
  expect(config.type).toBe("GROUP");
});

// 型ガードの統合テスト
test("統合: 型ガード - GroupElementとDefsElement - 相互に区別できる", () => {
  // Arrange
  const group = GroupElement.create();
  const defs = DefsElement.create();

  // Act & Assert
  expect(GroupElement.isGroupElement(group)).toBe(true);
  expect(GroupElement.isGroupElement(defs)).toBe(false);
  expect(DefsElement.isDefsElement(defs)).toBe(true);
  expect(DefsElement.isDefsElement(group)).toBe(false);
});

test("統合: 型ガード - 他のSVG要素 - GroupElementとDefsElementではないと判定される", () => {
  // Arrange
  const rect = RectElement.create({ x: 0, y: 0, width: 100, height: 50 });
  const circle = CircleElement.create({ cx: 50, cy: 50, r: 25 });

  // Act & Assert
  expect(GroupElement.isGroupElement(rect)).toBe(false);
  expect(GroupElement.isGroupElement(circle)).toBe(false);
  expect(DefsElement.isDefsElement(rect)).toBe(false);
  expect(DefsElement.isDefsElement(circle)).toBe(false);
});

// mapToFigmaの統合テスト
test("統合: GroupElement.mapToFigma - HTMLNode形式のg要素 - GROUPノードに変換される", () => {
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

test("統合: DefsElement.mapToFigma - HTMLNode形式のdefs要素 - nullを返す", () => {
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
