import { test, expect } from "vitest";
import { ClipPathElement } from "../clip-path-element";

// ClipPathElement.mapToFigma - マッピングのテスト

test("ClipPathElement.mapToFigma - clipPath要素 - nullを返す（描画されない）", () => {
  // Arrange
  const element = ClipPathElement.create({ id: "clip1" });

  // Act
  const config = ClipPathElement.mapToFigma(element);

  // Assert
  expect(config).toBeNull();
});

test("ClipPathElement.mapToFigma - HTMLNode形式のclipPath要素 - nullを返す", () => {
  // Arrange
  const htmlNode = {
    type: "element" as const,
    tagName: "clipPath",
    attributes: { id: "clip1" },
  };

  // Act
  const config = ClipPathElement.mapToFigma(htmlNode);

  // Assert
  expect(config).toBeNull();
});

test("ClipPathElement.mapToFigma - 子要素を持つclipPath要素 - nullを返し子要素は保持される", () => {
  // Arrange
  const children = [
    {
      type: "element" as const,
      tagName: "rect",
      attributes: { x: 0, y: 0, width: 100, height: 100 },
    },
  ];
  const element = ClipPathElement.create({ id: "clip2" }, children);

  // Act
  const config = ClipPathElement.mapToFigma(element);

  // Assert
  expect(config).toBeNull();
  expect(ClipPathElement.getClipShapes(element)).toHaveLength(1);
});

// ClipPathElement.getId - id属性取得のテスト

test("ClipPathElement.getId - id属性あり - id値を返す", () => {
  // Arrange
  const element = ClipPathElement.create({ id: "myClip" });

  // Act & Assert
  expect(ClipPathElement.getId(element)).toBe("myClip");
});

test("ClipPathElement.getId - id属性なし - undefinedを返す", () => {
  // Arrange
  const element = ClipPathElement.create({});

  // Act & Assert
  expect(ClipPathElement.getId(element)).toBeUndefined();
});

// ClipPathElement.getClipPathUnits - clipPathUnits属性取得のテスト

test("ClipPathElement.getClipPathUnits - clipPathUnits='userSpaceOnUse' - 設定値を返す", () => {
  // Arrange
  const element = ClipPathElement.create({
    id: "clip1",
    clipPathUnits: "userSpaceOnUse",
  });

  // Act & Assert
  expect(ClipPathElement.getClipPathUnits(element)).toBe("userSpaceOnUse");
});

test("ClipPathElement.getClipPathUnits - clipPathUnits='objectBoundingBox' - 設定値を返す", () => {
  // Arrange
  const element = ClipPathElement.create({
    id: "clip2",
    clipPathUnits: "objectBoundingBox",
  });

  // Act & Assert
  expect(ClipPathElement.getClipPathUnits(element)).toBe("objectBoundingBox");
});

test("ClipPathElement.getClipPathUnits - clipPathUnits未設定 - デフォルト値'userSpaceOnUse'を返す", () => {
  // Arrange
  const element = ClipPathElement.create({ id: "clip3" });

  // Act & Assert
  expect(ClipPathElement.getClipPathUnits(element)).toBe("userSpaceOnUse");
});

// ClipPathElement.getClipShapes - 子要素取得のテスト

test("ClipPathElement.getClipShapes - 子要素あり - 子要素配列を返す", () => {
  // Arrange
  const children = [
    {
      type: "element" as const,
      tagName: "circle",
      attributes: { cx: 50, cy: 50, r: 25 },
    },
  ];
  const element = ClipPathElement.create({ id: "clip1" }, children);

  // Act
  const shapes = ClipPathElement.getClipShapes(element);

  // Assert
  expect(shapes).toHaveLength(1);
  expect(shapes[0].tagName).toBe("circle");
});

test("ClipPathElement.getClipShapes - 複数の子要素あり - 全ての子要素を返す", () => {
  // Arrange
  const children = [
    {
      type: "element" as const,
      tagName: "circle",
      attributes: { cx: 50, cy: 50, r: 25 },
    },
    {
      type: "element" as const,
      tagName: "rect",
      attributes: { x: 0, y: 0, width: 50, height: 50 },
    },
  ];
  const element = ClipPathElement.create({ id: "clip2" }, children);

  // Act
  const shapes = ClipPathElement.getClipShapes(element);

  // Assert
  expect(shapes).toHaveLength(2);
});

test("ClipPathElement.getClipShapes - 子要素なし - 空配列を返す", () => {
  // Arrange
  const element = ClipPathElement.create({ id: "emptyClip" });

  // Act
  const shapes = ClipPathElement.getClipShapes(element);

  // Assert
  expect(shapes).toEqual([]);
});
