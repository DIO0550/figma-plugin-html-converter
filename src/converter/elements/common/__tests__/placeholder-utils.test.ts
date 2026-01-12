/**
 * placeholder-utils のテスト
 */

import { describe, it, expect } from "vitest";
import {
  DEFAULT_PLACEHOLDER_COLOR,
  LABEL_CONFIG,
  createPlaceholderFills,
  createUrlLabel,
  createTextLabel,
} from "../placeholder-utils";

describe("placeholder-utils", () => {
  describe("DEFAULT_PLACEHOLDER_COLOR", () => {
    it("Figmaの標準プレースホルダー色を持つ", () => {
      expect(DEFAULT_PLACEHOLDER_COLOR).toEqual({ r: 0.94, g: 0.94, b: 0.94 });
    });
  });

  describe("LABEL_CONFIG", () => {
    it("適切なラベル設定を持つ", () => {
      expect(LABEL_CONFIG.MAX_LENGTH).toBe(50);
      expect(LABEL_CONFIG.ELLIPSIS).toBe("...");
      expect(LABEL_CONFIG.FONT_SIZE).toBe(12);
      expect(LABEL_CONFIG.COLOR).toEqual({ r: 0.5, g: 0.5, b: 0.5 });
      expect(LABEL_CONFIG.ITEM_SPACING).toBe(8);
    });
  });

  describe("createPlaceholderFills", () => {
    it("プレースホルダー色のPaint配列を返す", () => {
      const fills = createPlaceholderFills();
      expect(fills).toHaveLength(1);
      expect(fills[0]).toMatchObject({
        type: "SOLID",
        color: DEFAULT_PLACEHOLDER_COLOR,
      });
    });
  });

  describe("createUrlLabel", () => {
    it("短いURLはそのまま表示する", () => {
      const label = createUrlLabel("https://example.com");
      expect(label.characters).toBe("https://example.com");
      expect(label.type).toBe("TEXT");
      expect(label.name).toBe("url-label");
    });

    it("長いURLは省略する", () => {
      const longUrl = "https://example.com/" + "a".repeat(100);
      const label = createUrlLabel(longUrl);
      expect(label.characters!.length).toBe(
        LABEL_CONFIG.MAX_LENGTH + LABEL_CONFIG.ELLIPSIS.length,
      );
      expect(label.characters!.endsWith(LABEL_CONFIG.ELLIPSIS)).toBe(true);
    });

    it("カスタム名を指定できる", () => {
      const label = createUrlLabel("https://example.com", "custom-name");
      expect(label.name).toBe("custom-name");
    });

    it("適切なフォントサイズと色を持つ", () => {
      const label = createUrlLabel("https://example.com");
      expect(label.fontSize).toBe(LABEL_CONFIG.FONT_SIZE);
      expect(label.fills).toHaveLength(1);
    });
  });

  describe("createTextLabel", () => {
    it("テキストラベルを作成する", () => {
      const label = createTextLabel("test text", "test-label");
      expect(label.characters).toBe("test text");
      expect(label.name).toBe("test-label");
      expect(label.type).toBe("TEXT");
    });

    it("適切なフォントサイズと色を持つ", () => {
      const label = createTextLabel("test", "test-label");
      expect(label.fontSize).toBe(LABEL_CONFIG.FONT_SIZE);
      expect(label.fills).toHaveLength(1);
    });
  });
});
