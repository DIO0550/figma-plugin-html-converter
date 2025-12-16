import { describe, test, expect } from "vitest";
import { UseElement } from "../use";
import { ClipPathElement } from "../clip-path";
import { DefsElement } from "../defs";
import { RectElement } from "../rect";
import { CircleElement } from "../circle";

describe("use要素とclipPath要素の統合テスト", () => {
  describe("use要素の基本変換", () => {
    test("use要素をGROUPノードに変換できる", () => {
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

    test("xlink:href属性を持つuse要素も変換できる", () => {
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

    test("transform属性とx/y属性の組み合わせ", () => {
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
  });

  describe("clipPath要素の基本処理", () => {
    test("clipPath要素はnullを返す（描画されない）", () => {
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

    test("clipPath要素の子要素を取得できる", () => {
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
  });

  describe("defs内でのuse/clipPath定義", () => {
    test("defs内にclipPathを含むSVG構造", () => {
      // Arrange: <defs><clipPath id="clip1"><rect .../></clipPath></defs>
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
      expect(defsConfig).toBeNull(); // defs自体は描画されない
    });

    test("defs内に定義された図形をuse要素で参照する構造", () => {
      // Arrange:
      // <defs>
      //   <rect id="baseRect" x="0" y="0" width="50" height="50"/>
      // </defs>
      // <use href="#baseRect" x="100" y="100"/>
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
  });

  describe("型ガードの相互排他性", () => {
    test("use要素はclipPath要素として判定されない", () => {
      // Arrange
      const use = UseElement.create({ href: "#shape" });

      // Act & Assert
      expect(UseElement.isUseElement(use)).toBe(true);
      expect(ClipPathElement.isClipPathElement(use)).toBe(false);
    });

    test("clipPath要素はuse要素として判定されない", () => {
      // Arrange
      const clipPath = ClipPathElement.create({ id: "clip1" });

      // Act & Assert
      expect(ClipPathElement.isClipPathElement(clipPath)).toBe(true);
      expect(UseElement.isUseElement(clipPath)).toBe(false);
    });

    test("rect要素はuse/clipPath要素として判定されない", () => {
      // Arrange
      const rect = RectElement.create({ x: 0, y: 0, width: 100, height: 50 });

      // Act & Assert
      expect(UseElement.isUseElement(rect)).toBe(false);
      expect(ClipPathElement.isClipPathElement(rect)).toBe(false);
    });

    test("circle要素はuse/clipPath要素として判定されない", () => {
      // Arrange
      const circle = CircleElement.create({ cx: 50, cy: 50, r: 25 });

      // Act & Assert
      expect(UseElement.isUseElement(circle)).toBe(false);
      expect(ClipPathElement.isClipPathElement(circle)).toBe(false);
    });
  });

  describe("use要素の属性取得", () => {
    test("全ての属性を正しく取得できる", () => {
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

    test("文字列形式の数値属性を正しくパースできる", () => {
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
  });

  describe("clipPath要素の属性取得", () => {
    test("clipPathUnitsのデフォルト値", () => {
      // Arrange
      const clipPath = ClipPathElement.create({ id: "clip1" });

      // Act & Assert
      expect(ClipPathElement.getClipPathUnits(clipPath)).toBe("userSpaceOnUse");
    });

    test("clipPathUnits=objectBoundingBoxを取得できる", () => {
      // Arrange
      const clipPath = ClipPathElement.create({
        id: "clip2",
        clipPathUnits: "objectBoundingBox",
      });

      // Act & Assert
      expect(ClipPathElement.getClipPathUnits(clipPath)).toBe(
        "objectBoundingBox",
      );
    });
  });
});
