/**
 * object要素の属性定義テスト
 */

import { describe, test, expect } from "vitest";
import { ObjectAttributes } from "../object-attributes";

describe("ObjectAttributes", () => {
  describe("parseSize", () => {
    test("デフォルトサイズを返す（width/height未指定時）", () => {
      const attributes: ObjectAttributes = {};
      const { width, height } = ObjectAttributes.parseSize(attributes);
      expect(width).toBe(300);
      expect(height).toBe(150);
    });

    test("width属性を解析できる", () => {
      const attributes: ObjectAttributes = { width: "640" };
      const { width, height } = ObjectAttributes.parseSize(attributes);
      expect(width).toBe(640);
      expect(height).toBe(150);
    });

    test("height属性を解析できる", () => {
      const attributes: ObjectAttributes = { height: "360" };
      const { width, height } = ObjectAttributes.parseSize(attributes);
      expect(width).toBe(300);
      expect(height).toBe(360);
    });

    test("width/height両方を解析できる", () => {
      const attributes: ObjectAttributes = { width: "800", height: "600" };
      const { width, height } = ObjectAttributes.parseSize(attributes);
      expect(width).toBe(800);
      expect(height).toBe(600);
    });

    test("無効なwidth値の場合はデフォルト値を使用", () => {
      const attributes: ObjectAttributes = { width: "invalid" };
      const { width } = ObjectAttributes.parseSize(attributes);
      expect(width).toBe(300);
    });

    test("無効なheight値の場合はデフォルト値を使用", () => {
      const attributes: ObjectAttributes = { height: "invalid" };
      const { height } = ObjectAttributes.parseSize(attributes);
      expect(height).toBe(150);
    });

    test("負の値の場合はデフォルト値を使用", () => {
      const attributes: ObjectAttributes = { width: "-100", height: "-50" };
      const { width, height } = ObjectAttributes.parseSize(attributes);
      expect(width).toBe(300);
      expect(height).toBe(150);
    });

    test("0の場合はデフォルト値を使用", () => {
      const attributes: ObjectAttributes = { width: "0", height: "0" };
      const { width, height } = ObjectAttributes.parseSize(attributes);
      expect(width).toBe(300);
      expect(height).toBe(150);
    });

    test("style属性のwidthを優先する", () => {
      const attributes: ObjectAttributes = {
        width: "640",
        style: "width: 800px;",
      };
      const { width } = ObjectAttributes.parseSize(attributes);
      expect(width).toBe(800);
    });

    test("style属性のheightを優先する", () => {
      const attributes: ObjectAttributes = {
        height: "360",
        style: "height: 480px;",
      };
      const { height } = ObjectAttributes.parseSize(attributes);
      expect(height).toBe(480);
    });
  });

  describe("getData", () => {
    test("data属性を取得できる", () => {
      const attributes: ObjectAttributes = {
        data: "https://example.com/content.swf",
      };
      expect(ObjectAttributes.getData(attributes)).toBe(
        "https://example.com/content.swf",
      );
    });

    test("data未設定の場合はnullを返す", () => {
      const attributes: ObjectAttributes = {};
      expect(ObjectAttributes.getData(attributes)).toBeNull();
    });

    test("javascript:URLは無効として扱う", () => {
      const attributes: ObjectAttributes = { data: "javascript:alert(1)" };
      expect(ObjectAttributes.getData(attributes)).toBeNull();
    });

    test("data:URLは無効として扱う", () => {
      const attributes: ObjectAttributes = {
        data: "data:text/html,<h1>Hello</h1>",
      };
      expect(ObjectAttributes.getData(attributes)).toBeNull();
    });

    test("相対パスは有効", () => {
      const attributes: ObjectAttributes = { data: "/content/sample.swf" };
      expect(ObjectAttributes.getData(attributes)).toBe("/content/sample.swf");
    });
  });

  describe("getType", () => {
    test("type属性を取得できる", () => {
      const attributes: ObjectAttributes = {
        type: "application/x-shockwave-flash",
      };
      expect(ObjectAttributes.getType(attributes)).toBe(
        "application/x-shockwave-flash",
      );
    });

    test("type未設定の場合はnullを返す", () => {
      const attributes: ObjectAttributes = {};
      expect(ObjectAttributes.getType(attributes)).toBeNull();
    });

    test("application/pdfを取得できる", () => {
      const attributes: ObjectAttributes = { type: "application/pdf" };
      expect(ObjectAttributes.getType(attributes)).toBe("application/pdf");
    });
  });

  describe("getName", () => {
    test("name属性を取得できる", () => {
      const attributes: ObjectAttributes = { name: "myObject" };
      expect(ObjectAttributes.getName(attributes)).toBe("myObject");
    });

    test("name未設定の場合はnullを返す", () => {
      const attributes: ObjectAttributes = {};
      expect(ObjectAttributes.getName(attributes)).toBeNull();
    });
  });

  describe("getBorder", () => {
    test("style属性からボーダー情報を取得できる", () => {
      const attributes: ObjectAttributes = { style: "border: 1px solid #000" };
      const border = ObjectAttributes.getBorder(attributes);
      expect(border).not.toBeNull();
      expect(border?.width).toBe(1);
    });

    test("style未設定の場合はnullを返す", () => {
      const attributes: ObjectAttributes = {};
      expect(ObjectAttributes.getBorder(attributes)).toBeNull();
    });
  });

  describe("getBorderRadius", () => {
    test("style属性から角丸を取得できる", () => {
      const attributes: ObjectAttributes = { style: "border-radius: 8px" };
      const borderRadius = ObjectAttributes.getBorderRadius(attributes);
      expect(borderRadius).toBe(8);
    });

    test("style未設定の場合はnullを返す", () => {
      const attributes: ObjectAttributes = {};
      expect(ObjectAttributes.getBorderRadius(attributes)).toBeNull();
    });
  });
});
