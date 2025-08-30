import { describe, it, expect, beforeEach } from "vitest";
import { PConverter } from "../p-converter";

describe("PConverter.mapToFigma", () => {
  let converter: PConverter;

  beforeEach(() => {
    converter = new PConverter();
  });

  describe("p要素の判定", () => {
    it("p要素ノードをFigmaノード設定にマッピングできる", () => {
      const node = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [],
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeDefined();
      expect(result?.type).toBe("FRAME");
    });

    it("属性とchildrenを持つp要素を正しくマッピングできる", () => {
      const node = {
        type: "element",
        tagName: "p",
        attributes: {
          id: "test-paragraph",
          style: "color: blue;",
        },
        children: [{ type: "text", content: "Test content" }],
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeDefined();
      expect(result?.type).toBe("FRAME");
      expect(result?.name).toContain("test-paragraph");
      expect(result?.children).toHaveLength(1);
    });
  });

  describe("非p要素の処理", () => {
    it("p以外の要素に対してはnullを返す", () => {
      const node = {
        type: "element",
        tagName: "div",
        attributes: {},
        children: [],
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeNull();
    });

    it("spanタグに対してnullを返す", () => {
      const node = {
        type: "element",
        tagName: "span",
        attributes: {},
        children: [],
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeNull();
    });

    it("h1タグに対してnullを返す", () => {
      const node = {
        type: "element",
        tagName: "h1",
        attributes: {},
        children: [],
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeNull();
    });
  });

  describe("無効なノードの処理", () => {
    it("テキストノードに対してnullを返す", () => {
      const node = {
        type: "text",
        content: "text",
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeNull();
    });

    it("コメントノードに対してnullを返す", () => {
      const node = {
        type: "comment",
        content: "<!-- comment -->",
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeNull();
    });

    it("nullに対してnullを返す", () => {
      const result = converter.mapToFigma(null);
      expect(result).toBeNull();
    });

    it("undefinedに対してnullを返す", () => {
      const result = converter.mapToFigma(undefined);
      expect(result).toBeNull();
    });

    it("空のオブジェクトに対してnullを返す", () => {
      const result = converter.mapToFigma({});
      expect(result).toBeNull();
    });

    it("typeプロパティがない要素に対してnullを返す", () => {
      const node = {
        tagName: "p",
        attributes: {},
      };

      const result = converter.mapToFigma(node);
      expect(result).toBeNull();
    });

    it("tagNameプロパティがない要素に対してnullを返す", () => {
      const node = {
        type: "element",
        attributes: {},
      };

      const result = converter.mapToFigma(node);
      expect(result).toBeNull();
    });
  });

  describe("部分的な要素構造の処理", () => {
    it("attributesプロパティがない要素も処理できる", () => {
      const node = {
        type: "element",
        tagName: "p",
        children: [],
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeDefined();
      expect(result?.type).toBe("FRAME");
    });

    it("childrenプロパティがない要素も処理できる", () => {
      const node = {
        type: "element",
        tagName: "p",
        attributes: {},
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeDefined();
      expect(result?.type).toBe("FRAME");
    });

    it("最小限の構造でも処理できる", () => {
      const node = {
        type: "element",
        tagName: "p",
      };

      const result = converter.mapToFigma(node);

      expect(result).toBeDefined();
      expect(result?.type).toBe("FRAME");
    });
  });
});
