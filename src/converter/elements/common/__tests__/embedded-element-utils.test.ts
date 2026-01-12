/**
 * embedded-element-utils のテスト
 */

import { describe, it, expect } from "vitest";
import {
  DEFAULT_EMBEDDED_SIZE,
  parseSize,
  isValidUrl,
  getBorder,
  getBorderRadius,
} from "../embedded-element-utils";

describe("embedded-element-utils", () => {
  describe("DEFAULT_EMBEDDED_SIZE", () => {
    it("HTML Living Standard準拠のデフォルト値を持つ", () => {
      expect(DEFAULT_EMBEDDED_SIZE.WIDTH).toBe(300);
      expect(DEFAULT_EMBEDDED_SIZE.HEIGHT).toBe(150);
    });
  });

  describe("parseSize", () => {
    it("属性がない場合はデフォルト値を返す", () => {
      const result = parseSize({});
      expect(result).toEqual({ width: 300, height: 150 });
    });

    it("width/height属性から値を解析する", () => {
      const result = parseSize({ width: "400", height: "300" });
      expect(result).toEqual({ width: 400, height: 300 });
    });

    it("無効なwidth/height属性は無視される", () => {
      const result = parseSize({ width: "invalid", height: "abc" });
      expect(result).toEqual({ width: 300, height: 150 });
    });

    it("0以下の値は無視される", () => {
      const result = parseSize({ width: "0", height: "-10" });
      expect(result).toEqual({ width: 300, height: 150 });
    });

    it("style属性からサイズを取得する", () => {
      const result = parseSize({ style: "width: 500px; height: 400px" });
      expect(result).toEqual({ width: 500, height: 400 });
    });

    it("style属性がwidth/height属性より優先される", () => {
      const result = parseSize({
        width: "200",
        height: "100",
        style: "width: 600px; height: 500px",
      });
      expect(result).toEqual({ width: 600, height: 500 });
    });
  });

  describe("isValidUrl", () => {
    it("undefinedの場合はfalseを返す", () => {
      expect(isValidUrl(undefined)).toBe(false);
    });

    it("空文字の場合はfalseを返す", () => {
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl("  ")).toBe(false);
    });

    it("http://で始まるURLは有効", () => {
      expect(isValidUrl("http://example.com")).toBe(true);
    });

    it("https://で始まるURLは有効", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
    });

    it("相対パスは有効", () => {
      expect(isValidUrl("/path/to/resource")).toBe(true);
      expect(isValidUrl("./relative")).toBe(true);
      expect(isValidUrl("../parent")).toBe(true);
    });

    it("javascript:スキームは拒否", () => {
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
      expect(isValidUrl("JAVASCRIPT:void(0)")).toBe(false);
    });

    it("data:スキームは拒否", () => {
      expect(isValidUrl("data:text/html,<script>")).toBe(false);
      expect(isValidUrl("DATA:image/png;base64,")).toBe(false);
    });

    it("HTMLタグを含むURLは拒否", () => {
      expect(isValidUrl("https://example.com/<script>")).toBe(false);
      expect(isValidUrl("https://example.com/>test")).toBe(false);
    });
  });

  describe("getBorder", () => {
    it("style属性がない場合はnullを返す", () => {
      expect(getBorder({})).toBeNull();
    });

    it("style属性からボーダー情報を取得する", () => {
      const result = getBorder({ style: "border: 2px solid red" });
      expect(result).not.toBeNull();
    });
  });

  describe("getBorderRadius", () => {
    it("style属性がない場合はnullを返す", () => {
      expect(getBorderRadius({})).toBeNull();
    });

    it("数値の角丸値を取得する", () => {
      const result = getBorderRadius({ style: "border-radius: 10px" });
      expect(result).toBe(10);
    });

    it("角丸がない場合はnullを返す", () => {
      const result = getBorderRadius({ style: "color: red" });
      expect(result).toBeNull();
    });
  });
});
