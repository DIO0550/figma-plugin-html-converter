/**
 * embed要素の属性定義テスト
 */

import { describe, test, expect } from "vitest";
import { EmbedAttributes } from "../embed-attributes";

describe("EmbedAttributes", () => {
  describe("parseSize", () => {
    test("デフォルトサイズを返す（width/height未指定時）", () => {
      const attributes: EmbedAttributes = {};
      const { width, height } = EmbedAttributes.parseSize(attributes);
      expect(width).toBe(300);
      expect(height).toBe(150);
    });

    test("width属性を解析できる", () => {
      const attributes: EmbedAttributes = { width: "640" };
      const { width, height } = EmbedAttributes.parseSize(attributes);
      expect(width).toBe(640);
      expect(height).toBe(150);
    });

    test("height属性を解析できる", () => {
      const attributes: EmbedAttributes = { height: "360" };
      const { width, height } = EmbedAttributes.parseSize(attributes);
      expect(width).toBe(300);
      expect(height).toBe(360);
    });

    test("width/height両方を解析できる", () => {
      const attributes: EmbedAttributes = { width: "800", height: "600" };
      const { width, height } = EmbedAttributes.parseSize(attributes);
      expect(width).toBe(800);
      expect(height).toBe(600);
    });

    test("無効なwidth値の場合はデフォルト値を使用", () => {
      const attributes: EmbedAttributes = { width: "invalid" };
      const { width } = EmbedAttributes.parseSize(attributes);
      expect(width).toBe(300);
    });

    test("無効なheight値の場合はデフォルト値を使用", () => {
      const attributes: EmbedAttributes = { height: "invalid" };
      const { height } = EmbedAttributes.parseSize(attributes);
      expect(height).toBe(150);
    });

    test("負の値の場合はデフォルト値を使用", () => {
      const attributes: EmbedAttributes = { width: "-100", height: "-50" };
      const { width, height } = EmbedAttributes.parseSize(attributes);
      expect(width).toBe(300);
      expect(height).toBe(150);
    });

    test("0の場合はデフォルト値を使用", () => {
      const attributes: EmbedAttributes = { width: "0", height: "0" };
      const { width, height } = EmbedAttributes.parseSize(attributes);
      expect(width).toBe(300);
      expect(height).toBe(150);
    });

    test("style属性のwidthを優先する", () => {
      const attributes: EmbedAttributes = {
        width: "640",
        style: "width: 800px;",
      };
      const { width } = EmbedAttributes.parseSize(attributes);
      expect(width).toBe(800);
    });

    test("style属性のheightを優先する", () => {
      const attributes: EmbedAttributes = {
        height: "360",
        style: "height: 480px;",
      };
      const { height } = EmbedAttributes.parseSize(attributes);
      expect(height).toBe(480);
    });
  });

  describe("getSrc", () => {
    test("src属性を取得できる", () => {
      const attributes: EmbedAttributes = {
        src: "https://example.com/video.mp4",
      };
      expect(EmbedAttributes.getSrc(attributes)).toBe(
        "https://example.com/video.mp4",
      );
    });

    test("src未設定の場合はnullを返す", () => {
      const attributes: EmbedAttributes = {};
      expect(EmbedAttributes.getSrc(attributes)).toBeNull();
    });

    test("javascript:URLは無効として扱う", () => {
      const attributes: EmbedAttributes = { src: "javascript:alert(1)" };
      expect(EmbedAttributes.getSrc(attributes)).toBeNull();
    });

    test("data:URLは無効として扱う", () => {
      const attributes: EmbedAttributes = {
        src: "data:text/html,<h1>Hello</h1>",
      };
      expect(EmbedAttributes.getSrc(attributes)).toBeNull();
    });

    test("相対パスは有効", () => {
      const attributes: EmbedAttributes = { src: "/videos/sample.mp4" };
      expect(EmbedAttributes.getSrc(attributes)).toBe("/videos/sample.mp4");
    });
  });

  describe("getType", () => {
    test("type属性を取得できる", () => {
      const attributes: EmbedAttributes = { type: "video/mp4" };
      expect(EmbedAttributes.getType(attributes)).toBe("video/mp4");
    });

    test("type未設定の場合はnullを返す", () => {
      const attributes: EmbedAttributes = {};
      expect(EmbedAttributes.getType(attributes)).toBeNull();
    });

    test("application/pdfを取得できる", () => {
      const attributes: EmbedAttributes = { type: "application/pdf" };
      expect(EmbedAttributes.getType(attributes)).toBe("application/pdf");
    });
  });

  describe("getBorder", () => {
    test("style属性からボーダー情報を取得できる", () => {
      const attributes: EmbedAttributes = { style: "border: 1px solid #000" };
      const border = EmbedAttributes.getBorder(attributes);
      expect(border).not.toBeNull();
      expect(border?.width).toBe(1);
    });

    test("style未設定の場合はnullを返す", () => {
      const attributes: EmbedAttributes = {};
      expect(EmbedAttributes.getBorder(attributes)).toBeNull();
    });
  });

  describe("getBorderRadius", () => {
    test("style属性から角丸を取得できる", () => {
      const attributes: EmbedAttributes = { style: "border-radius: 8px" };
      const borderRadius = EmbedAttributes.getBorderRadius(attributes);
      expect(borderRadius).toBe(8);
    });

    test("style未設定の場合はnullを返す", () => {
      const attributes: EmbedAttributes = {};
      expect(EmbedAttributes.getBorderRadius(attributes)).toBeNull();
    });
  });
});
