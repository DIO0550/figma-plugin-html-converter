import { describe, it, expect, beforeEach } from "vitest";
import { PConverter } from "../p-converter";
import type { PElement } from "../../p-element";

describe("PConverter スタイル処理", () => {
  let converter: PConverter;

  beforeEach(() => {
    converter = new PConverter();
  });

  describe("背景色とパディング", () => {
    it("カスタムスタイルを適用できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style: "background-color: #f0f0f0; padding: 10px; margin: 20px;",
        },
        children: [],
      };

      const result = converter.toFigmaNode(element);

      // 背景色の確認
      expect(result.fills).toBeDefined();
      expect(result.fills).toHaveLength(1);
      expect(result.fills[0].type).toBe("SOLID");
      expect(result.fills[0].color.r).toBeCloseTo(240 / 255, 2);
      expect(result.fills[0].color.g).toBeCloseTo(240 / 255, 2);
      expect(result.fills[0].color.b).toBeCloseTo(240 / 255, 2);

      // パディングの確認
      expect(result.paddingTop).toBe(10);
      expect(result.paddingBottom).toBe(10);
      expect(result.paddingLeft).toBe(10);
      expect(result.paddingRight).toBe(10);
    });

    it("個別のパディング値を適用できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style: "padding: 5px 10px 15px 20px;",
        },
        children: [],
      };

      const result = converter.toFigmaNode(element);

      expect(result.paddingTop).toBe(5);
      expect(result.paddingRight).toBe(10);
      expect(result.paddingBottom).toBe(15);
      expect(result.paddingLeft).toBe(20);
    });
  });

  describe("テキストスタイル", () => {
    it("テキストの配置スタイルを処理できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style: "text-align: center;",
        },
        children: [
          {
            type: "text",
            content: "Centered paragraph",
          },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children[0]).toMatchObject({
        type: "TEXT",
        content: "Centered paragraph",
        style: expect.objectContaining({
          textAlign: "CENTER",
        }),
      });
    });

    it("フォントサイズスタイルを処理できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style: "font-size: 18px;",
        },
        children: [
          {
            type: "text",
            content: "Larger text",
          },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children[0]).toMatchObject({
        type: "TEXT",
        style: expect.objectContaining({
          fontSize: 18,
        }),
      });
    });

    it("行の高さスタイルを処理できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style: "line-height: 1.8;",
        },
        children: [
          {
            type: "text",
            content: "Paragraph with custom line height",
          },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children[0]).toMatchObject({
        type: "TEXT",
        style: expect.objectContaining({
          lineHeight: {
            unit: "PIXELS",
            value: 28.8, // 16 * 1.8
          },
        }),
      });
    });

    it("カラースタイルを処理できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style: "color: #333333;",
        },
        children: [
          {
            type: "text",
            content: "Colored text",
          },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children[0]).toMatchObject({
        type: "TEXT",
        style: expect.objectContaining({
          fills: [
            {
              type: "SOLID",
              color: {
                r: 51 / 255,
                g: 51 / 255,
                b: 51 / 255,
                a: 1,
              },
            },
          ],
        }),
      });
    });

    it("複数のテキストスタイルを組み合わせて適用できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style:
            "font-size: 20px; line-height: 1.5; text-align: right; color: #ff0000;",
        },
        children: [
          {
            type: "text",
            content: "Styled text",
          },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children[0]).toMatchObject({
        type: "TEXT",
        style: expect.objectContaining({
          fontSize: 20,
          lineHeight: {
            unit: "PIXELS",
            value: 30, // 20 * 1.5
          },
          textAlign: "RIGHT",
          fills: [
            {
              type: "SOLID",
              color: {
                r: 1,
                g: 0,
                b: 0,
                a: 1,
              },
            },
          ],
        }),
      });
    });
  });

  describe("ボーダーとサイズ", () => {
    it("ボーダースタイルを適用できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style: "border: 2px solid #000000;",
        },
        children: [],
      };

      const result = converter.toFigmaNode(element);

      expect(result.strokes).toBeDefined();
      expect(result.strokeWeight).toBe(2);
    });

    it("サイズスタイルを適用できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style: "width: 300px; height: 100px;",
        },
        children: [],
      };

      const result = converter.toFigmaNode(element);

      expect(result.width).toBe(300);
      expect(result.height).toBe(100);
    });

    it("border-radiusスタイルを適用できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          style: "border-radius: 8px;",
        },
        children: [],
      };

      const result = converter.toFigmaNode(element);

      expect(result.cornerRadius).toBe(8);
    });
  });
});
