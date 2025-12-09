import { describe, test, expect } from "vitest";
import {
  GroupElement,
  DefsElement,
  RectElement,
  CircleElement,
} from "../index";

describe("SVG Group/Defs 統合テスト", () => {
  describe("グループ構造の再現", () => {
    test("単一のg要素をGROUPノードに変換する", () => {
      const group = GroupElement.create({
        id: "main-group",
      });

      const config = GroupElement.toFigmaNode(group);

      expect(config.type).toBe("GROUP");
      expect(config.name).toBe("main-group");
    });

    test("transform属性を持つg要素を変換する", () => {
      const group = GroupElement.create({
        id: "transformed-group",
        transform: "translate(100, 50)",
      });

      const config = GroupElement.toFigmaNode(group);

      expect(config.type).toBe("GROUP");
      expect(config.x).toBe(100);
      expect(config.y).toBe(50);
    });

    test("複数のtransformを持つg要素を変換する", () => {
      const group = GroupElement.create({
        transform: "translate(10, 20) translate(30, 40)",
      });

      const config = GroupElement.toFigmaNode(group);

      expect(config.x).toBe(40);
      expect(config.y).toBe(60);
    });

    test("opacity属性を持つg要素を変換する", () => {
      const group = GroupElement.create({
        opacity: "0.75",
      });

      const config = GroupElement.toFigmaNode(group);

      expect(config.opacity).toBe(0.75);
    });
  });

  describe("ネストされたグループ構造", () => {
    test("ネストされたグループを持つg要素を作成する", () => {
      const innerGroup = GroupElement.create({
        id: "inner-group",
        transform: "translate(20, 20)",
      });

      const outerGroup = GroupElement.create(
        {
          id: "outer-group",
          transform: "translate(10, 10)",
        },
        [innerGroup],
      );

      expect(outerGroup.children).toHaveLength(1);
      expect(outerGroup.children?.[0].tagName).toBe("g");
    });

    test("グループ内の図形要素を持つ構造", () => {
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

      expect(group.children).toHaveLength(2);
      expect(group.children?.[0].tagName).toBe("rect");
      expect(group.children?.[1].tagName).toBe("circle");
    });
  });

  describe("defs要素の処理", () => {
    test("defs要素は描画されない（nullを返す）", () => {
      const defs = DefsElement.create({
        id: "definitions",
      });

      const config = DefsElement.mapToFigma(defs);

      expect(config).toBeNull();
    });

    test("グラデーション定義を含むdefs要素も描画されない", () => {
      const defs = DefsElement.create({}, [
        {
          type: "element",
          tagName: "linearGradient",
          attributes: { id: "grad1", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        },
      ]);

      const config = DefsElement.mapToFigma(defs);

      expect(config).toBeNull();
      expect(DefsElement.getDefinitions(defs)).toHaveLength(1);
    });

    test("複数の定義を含むdefs要素", () => {
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

      expect(DefsElement.getDefinitions(defs)).toHaveLength(3);
    });
  });

  describe("グループとdefs要素の組み合わせ", () => {
    test("defs要素を子に持つg要素", () => {
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

      expect(group.children).toHaveLength(2);

      // グループ自体は変換される
      const config = GroupElement.toFigmaNode(group);
      expect(config.type).toBe("GROUP");
    });
  });

  describe("型ガードの統合テスト", () => {
    test("GroupElementとDefsElementを区別する", () => {
      const group = GroupElement.create();
      const defs = DefsElement.create();

      expect(GroupElement.isGroupElement(group)).toBe(true);
      expect(GroupElement.isGroupElement(defs)).toBe(false);
      expect(DefsElement.isDefsElement(defs)).toBe(true);
      expect(DefsElement.isDefsElement(group)).toBe(false);
    });

    test("他のSVG要素と区別する", () => {
      const rect = RectElement.create({ x: 0, y: 0, width: 100, height: 50 });
      const circle = CircleElement.create({ cx: 50, cy: 50, r: 25 });

      expect(GroupElement.isGroupElement(rect)).toBe(false);
      expect(GroupElement.isGroupElement(circle)).toBe(false);
      expect(DefsElement.isDefsElement(rect)).toBe(false);
      expect(DefsElement.isDefsElement(circle)).toBe(false);
    });
  });

  describe("mapToFigmaの統合テスト", () => {
    test("HTMLNode形式のg要素を変換する", () => {
      const htmlNode = {
        type: "element" as const,
        tagName: "g",
        attributes: {
          id: "html-group",
          transform: "translate(25, 25)",
        },
      };

      const config = GroupElement.mapToFigma(htmlNode);

      expect(config).not.toBeNull();
      expect(config?.type).toBe("GROUP");
      expect(config?.name).toBe("html-group");
      expect(config?.x).toBe(25);
      expect(config?.y).toBe(25);
    });

    test("HTMLNode形式のdefs要素は変換されない", () => {
      const htmlNode = {
        type: "element" as const,
        tagName: "defs",
        attributes: {},
      };

      const config = DefsElement.mapToFigma(htmlNode);

      expect(config).toBeNull();
    });
  });
});
