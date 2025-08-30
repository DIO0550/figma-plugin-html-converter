import { describe, it, expect, beforeEach } from "vitest";
import { PConverter } from "../p-converter";
import type { PElement } from "../../p-element";

describe("PConverter.toFigmaNode", () => {
  let converter: PConverter;

  beforeEach(() => {
    converter = new PConverter();
  });

  describe("基本的な変換", () => {
    it("シンプルなp要素をFigmaノードに変換できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [],
      };

      const result = converter.toFigmaNode(element);

      expect(result.type).toBe("FRAME");
      expect(result.name).toBe("p");
      expect(result.children).toEqual([]);
      expect(result.layoutMode).toBe("VERTICAL");
      expect(result.layoutSizingHorizontal).toBe("FILL");
    });

    it("空のp要素でも正しく処理される", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children).toEqual([]);
    });
  });

  describe("テキストコンテンツの処理", () => {
    it("テキストコンテンツを持つp要素を変換できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [
          {
            type: "text",
            content: "This is a paragraph.",
          },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children).toHaveLength(1);
      expect(result.children[0]).toMatchObject({
        type: "TEXT",
        content: "This is a paragraph.",
        style: {
          fontFamily: "Inter",
          fontSize: 16,
          fontWeight: 400,
          lineHeight: {
            unit: "PIXELS",
            value: 24,
          },
          letterSpacing: 0,
          textAlign: "LEFT",
          verticalAlign: "TOP",
        },
      });
    });

    it("複数のテキストノードを処理できる", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [
          { type: "text", content: "First part. " },
          { type: "text", content: "Second part." },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children).toHaveLength(2);
      expect(result.children[0].content).toBe("First part. ");
      expect(result.children[1].content).toBe("Second part.");
    });
  });

  describe("インライン要素の処理", () => {
    it("strongタグを太字として処理する", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [
          { type: "text", content: "This is " },
          {
            type: "element",
            tagName: "strong",
            attributes: {},
            children: [{ type: "text", content: "bold text" }],
          },
          { type: "text", content: " in a paragraph." },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children).toHaveLength(3);
      expect(result.children[1]).toMatchObject({
        type: "TEXT",
        content: "bold text",
        style: expect.objectContaining({
          fontWeight: 700,
        }),
      });
    });

    it("emタグを斜体として処理する", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [
          {
            type: "element",
            tagName: "em",
            attributes: {},
            children: [{ type: "text", content: "italic text" }],
          },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children).toHaveLength(1);
      expect(result.children[0]).toMatchObject({
        type: "TEXT",
        content: "italic text",
        style: expect.objectContaining({
          fontStyle: "ITALIC",
        }),
      });
    });

    it("bタグを太字として処理する", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [
          {
            type: "element",
            tagName: "b",
            attributes: {},
            children: [{ type: "text", content: "bold" }],
          },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children[0]).toMatchObject({
        style: expect.objectContaining({
          fontWeight: 700,
        }),
      });
    });

    it("iタグを斜体として処理する", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [
          {
            type: "element",
            tagName: "i",
            attributes: {},
            children: [{ type: "text", content: "italic" }],
          },
        ],
      };

      const result = converter.toFigmaNode(element);

      expect(result.children[0]).toMatchObject({
        style: expect.objectContaining({
          fontStyle: "ITALIC",
        }),
      });
    });
  });

  describe("属性の処理", () => {
    it("ID属性とclass属性を名前に反映する", () => {
      const element: PElement = {
        type: "element",
        tagName: "p",
        attributes: {
          id: "main-paragraph",
          class: "content text-large",
        },
        children: [],
      };

      const result = converter.toFigmaNode(element);

      expect(result.name).toContain("main-paragraph");
    });
  });
});
