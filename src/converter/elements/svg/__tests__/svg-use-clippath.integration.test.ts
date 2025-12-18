import { test, expect } from "vitest";
import { UseElement } from "../use";
import { ClipPathElement } from "../clip-path";
import { DefsElement } from "../defs";
import { RectElement } from "../rect";
import { CircleElement } from "../circle";

// use要素の基本変換

test("UseElement.mapToFigma - use要素の基本変換 - type='GROUP', 位置・名前が正しく設定される", () => {
  // Arrange
  const use = UseElement.create({
    id: "useRect",
    href: "#myRect",
    x: 100,
    y: 50,
  });

  // Act
  const config = UseElement.mapToFigma(use);

  // Assert
  expect(config).not.toBeNull();
  expect(config?.type).toBe("GROUP");
  expect(config?.name).toBe("useRect");
  expect(config?.x).toBe(100);
  expect(config?.y).toBe(50);
});

test("UseElement.mapToFigma - xlink:href属性を持つuse要素 - href値として取得できる", () => {
  // Arrange
  const use = UseElement.create({
    "xlink:href": "#legacyShape",
    x: 200,
    y: 100,
  });

  // Act
  const config = UseElement.mapToFigma(use);

  // Assert
  expect(config).not.toBeNull();
  expect(UseElement.getHref(use)).toBe("#legacyShape");
});

test("UseElement.toFigmaNode - transform属性とx/y属性の組み合わせ - 両方の値が加算される", () => {
  // Arrange
  const use = UseElement.create({
    href: "#shape",
    x: 10,
    y: 20,
    transform: "translate(30, 40)",
  });

  // Act
  const config = UseElement.toFigmaNode(use);

  // Assert
  expect(config.x).toBe(40); // 10 + 30
  expect(config.y).toBe(60); // 20 + 40
});

// clipPath要素の基本処理

test("ClipPathElement.mapToFigma - clipPath要素 - nullを返す（描画されない）", () => {
  // Arrange
  const clipPath = ClipPathElement.create({ id: "clip1" }, [
    {
      type: "element",
      tagName: "rect",
      attributes: { x: 0, y: 0, width: 100, height: 100 },
    },
  ]);

  // Act
  const config = ClipPathElement.mapToFigma(clipPath);

  // Assert
  expect(config).toBeNull();
});

test("ClipPathElement.getClipShapes - 複数の子要素 - 全ての子図形を配列で返す", () => {
  // Arrange
  const clipPath = ClipPathElement.create({ id: "complexClip" }, [
    {
      type: "element",
      tagName: "circle",
      attributes: { cx: 50, cy: 50, r: 40 },
    },
    {
      type: "element",
      tagName: "rect",
      attributes: { x: 0, y: 0, width: 50, height: 50 },
    },
  ]);

  // Act
  const shapes = ClipPathElement.getClipShapes(clipPath);

  // Assert
  expect(shapes).toHaveLength(2);
  expect(shapes[0].tagName).toBe("circle");
  expect(shapes[1].tagName).toBe("rect");
});

// defs内でのuse/clipPath定義

test("defs+clipPath - defs内にclipPathを含むSVG構造 - defsの定義として取得でき、defs自体はnullを返す", () => {
  // Arrange
  const clipPath = ClipPathElement.create({ id: "clip1" }, [
    {
      type: "element",
      tagName: "rect",
      attributes: { x: 0, y: 0, width: 100, height: 100 },
    },
  ]);

  const defs = DefsElement.create({}, [
    {
      type: "element",
      tagName: "clipPath",
      attributes: clipPath.attributes,
      children: clipPath.children,
    },
  ]);

  // Act
  const definitions = DefsElement.getDefinitions(defs);
  const defsConfig = DefsElement.mapToFigma(defs);

  // Assert
  expect(definitions).toHaveLength(1);
  expect(definitions[0].tagName).toBe("clipPath");
  expect(defsConfig).toBeNull();
});

test("defs+use - defs内の図形をuse要素で参照する構造 - href参照とuse位置が正しく動作する", () => {
  // Arrange
  const baseRect = RectElement.create({
    id: "baseRect",
    x: 0,
    y: 0,
    width: 50,
    height: 50,
  });

  const defs = DefsElement.create({}, [
    {
      type: "element",
      tagName: "rect",
      attributes: baseRect.attributes,
    },
  ]);

  const use = UseElement.create({
    href: "#baseRect",
    x: 100,
    y: 100,
  });

  // Act
  const defsDefinitions = DefsElement.getDefinitions(defs);
  const useConfig = UseElement.mapToFigma(use);
  const href = UseElement.getHref(use);

  // Assert
  expect(defsDefinitions).toHaveLength(1);
  expect(defsDefinitions[0].tagName).toBe("rect");
  expect(href).toBe("#baseRect");
  expect(useConfig?.x).toBe(100);
  expect(useConfig?.y).toBe(100);
});

// 型ガードの相互排他性

test("型ガードの相互排他性 - use要素 - UseElementとしてtrueかつClipPathElementとしてfalseを返す", () => {
  // Arrange
  const use = UseElement.create({ href: "#shape" });

  // Act & Assert
  expect(UseElement.isUseElement(use)).toBe(true);
  expect(ClipPathElement.isClipPathElement(use)).toBe(false);
});

test("型ガードの相互排他性 - clipPath要素 - ClipPathElementとしてtrueかつUseElementとしてfalseを返す", () => {
  // Arrange
  const clipPath = ClipPathElement.create({ id: "clip1" });

  // Act & Assert
  expect(ClipPathElement.isClipPathElement(clipPath)).toBe(true);
  expect(UseElement.isUseElement(clipPath)).toBe(false);
});

test("型ガードの相互排他性 - rect要素 - UseElement/ClipPathElementのどちらともfalseを返す", () => {
  // Arrange
  const rect = RectElement.create({ x: 0, y: 0, width: 100, height: 50 });

  // Act & Assert
  expect(UseElement.isUseElement(rect)).toBe(false);
  expect(ClipPathElement.isClipPathElement(rect)).toBe(false);
});

test("型ガードの相互排他性 - circle要素 - UseElement/ClipPathElementのどちらともfalseを返す", () => {
  // Arrange
  const circle = CircleElement.create({ cx: 50, cy: 50, r: 25 });

  // Act & Assert
  expect(UseElement.isUseElement(circle)).toBe(false);
  expect(ClipPathElement.isClipPathElement(circle)).toBe(false);
});

// use要素の属性取得

test("UseElement - 全属性取得 - 全ての属性が正しく取得できる", () => {
  // Arrange
  const use = UseElement.create({
    id: "myUse",
    href: "#target",
    x: 10,
    y: 20,
    width: 100,
    height: 80,
    opacity: 0.7,
  });

  // Act & Assert
  expect(UseElement.getId(use)).toBe("myUse");
  expect(UseElement.getHref(use)).toBe("#target");
  expect(UseElement.getX(use)).toBe(10);
  expect(UseElement.getY(use)).toBe(20);
  expect(UseElement.getWidth(use)).toBe(100);
  expect(UseElement.getHeight(use)).toBe(80);
  expect(UseElement.getOpacity(use)).toBe(0.7);
});

test("UseElement - 文字列形式の数値属性 - 数値にパースされる", () => {
  // Arrange
  const use = UseElement.create({
    href: "#shape",
    x: "150",
    y: "75",
    width: "200",
    height: "100",
  });

  // Act & Assert
  expect(UseElement.getX(use)).toBe(150);
  expect(UseElement.getY(use)).toBe(75);
  expect(UseElement.getWidth(use)).toBe(200);
  expect(UseElement.getHeight(use)).toBe(100);
});

// clipPath要素の属性取得

test("ClipPathElement.getClipPathUnits - clipPathUnits未設定 - デフォルト値'userSpaceOnUse'を返す", () => {
  // Arrange
  const clipPath = ClipPathElement.create({ id: "clip1" });

  // Act & Assert
  expect(ClipPathElement.getClipPathUnits(clipPath)).toBe("userSpaceOnUse");
});

test("ClipPathElement.getClipPathUnits - clipPathUnits='objectBoundingBox' - 設定値を返す", () => {
  // Arrange
  const clipPath = ClipPathElement.create({
    id: "clip2",
    clipPathUnits: "objectBoundingBox",
  });

  // Act & Assert
  expect(ClipPathElement.getClipPathUnits(clipPath)).toBe("objectBoundingBox");
});
