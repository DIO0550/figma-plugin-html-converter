import { describe, test, expect } from "vitest";
import { ClipPathElement } from "../clip-path-element";

describe("ClipPathElement.mapToFigma", () => {
  test("clipPath要素 - nullを返す（描画されない）", () => {
    // Arrange
    const element = ClipPathElement.create({ id: "clip1" });

    // Act
    const config = ClipPathElement.mapToFigma(element);

    // Assert
    expect(config).toBeNull();
  });

  test("HTMLNode形式のclipPath要素 - nullを返す", () => {
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

  test("子要素を持つclipPath要素 - nullを返し子要素は保持される", () => {
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
});

describe("ClipPathElement.getId", () => {
  test("id属性を取得できる", () => {
    // Arrange
    const element = ClipPathElement.create({ id: "myClip" });

    // Act & Assert
    expect(ClipPathElement.getId(element)).toBe("myClip");
  });

  test("id属性がない場合、undefinedを返す", () => {
    // Arrange
    const element = ClipPathElement.create({});

    // Act & Assert
    expect(ClipPathElement.getId(element)).toBeUndefined();
  });
});

describe("ClipPathElement.getClipPathUnits", () => {
  test("clipPathUnitsがuserSpaceOnUseの場合", () => {
    // Arrange
    const element = ClipPathElement.create({
      id: "clip1",
      clipPathUnits: "userSpaceOnUse",
    });

    // Act & Assert
    expect(ClipPathElement.getClipPathUnits(element)).toBe("userSpaceOnUse");
  });

  test("clipPathUnitsがobjectBoundingBoxの場合", () => {
    // Arrange
    const element = ClipPathElement.create({
      id: "clip2",
      clipPathUnits: "objectBoundingBox",
    });

    // Act & Assert
    expect(ClipPathElement.getClipPathUnits(element)).toBe("objectBoundingBox");
  });

  test("clipPathUnitsが未設定の場合、userSpaceOnUseを返す", () => {
    // Arrange
    const element = ClipPathElement.create({ id: "clip3" });

    // Act & Assert
    expect(ClipPathElement.getClipPathUnits(element)).toBe("userSpaceOnUse");
  });
});

describe("ClipPathElement.getClipShapes", () => {
  test("子要素を取得できる", () => {
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

  test("複数の子要素を取得できる", () => {
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

  test("子要素がない場合、空配列を返す", () => {
    // Arrange
    const element = ClipPathElement.create({ id: "emptyClip" });

    // Act
    const shapes = ClipPathElement.getClipShapes(element);

    // Assert
    expect(shapes).toEqual([]);
  });
});
