import { describe, test, expect } from "vitest";
import { ClipPathElement } from "../clip-path-element";

describe("ClipPathElement.create", () => {
  test("デフォルト属性でclipPath要素を作成できる", () => {
    // Act
    const element = ClipPathElement.create();

    // Assert
    expect(element.type).toBe("element");
    expect(element.tagName).toBe("clipPath");
    expect(element.attributes).toEqual({});
  });

  test("id属性を指定してclipPath要素を作成できる", () => {
    // Arrange
    const attributes = { id: "clip1" };

    // Act
    const element = ClipPathElement.create(attributes);

    // Assert
    expect(element.attributes.id).toBe("clip1");
  });

  test("clipPathUnits属性を指定してclipPath要素を作成できる", () => {
    // Arrange
    const attributes = {
      id: "clip2",
      clipPathUnits: "objectBoundingBox" as const,
    };

    // Act
    const element = ClipPathElement.create(attributes);

    // Assert
    expect(element.attributes.clipPathUnits).toBe("objectBoundingBox");
  });

  test("子要素（図形）を指定してclipPath要素を作成できる", () => {
    // Arrange
    const attributes = { id: "clip3" };
    const children = [
      {
        type: "element" as const,
        tagName: "rect",
        attributes: { x: 0, y: 0, width: 100, height: 100 },
      },
    ];

    // Act
    const element = ClipPathElement.create(attributes, children);

    // Assert
    expect(element.children).toHaveLength(1);
    expect(element.children?.[0].tagName).toBe("rect");
  });

  test("複数の子要素を持つclipPath要素を作成できる", () => {
    // Arrange
    const attributes = { id: "complexClip" };
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

    // Act
    const element = ClipPathElement.create(attributes, children);

    // Assert
    expect(element.children).toHaveLength(2);
  });
});
