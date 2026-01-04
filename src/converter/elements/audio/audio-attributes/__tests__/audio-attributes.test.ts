import { describe, it, expect } from "vitest";
import { AudioAttributes } from "../audio-attributes";

describe("AudioAttributes", () => {
  describe("parseSize", () => {
    it("デフォルトサイズを返す（300x54px）", () => {
      const attributes: AudioAttributes = {};
      const result = AudioAttributes.parseSize(attributes);

      expect(result.width).toBe(300);
      expect(result.height).toBe(54);
    });

    it("width属性を解析する", () => {
      const attributes: AudioAttributes = { width: "400" };
      const result = AudioAttributes.parseSize(attributes);

      expect(result.width).toBe(400);
      expect(result.height).toBe(54);
    });

    it("height属性を解析する", () => {
      const attributes: AudioAttributes = { height: "80" };
      const result = AudioAttributes.parseSize(attributes);

      expect(result.width).toBe(300);
      expect(result.height).toBe(80);
    });

    it("width と height 両方を解析する", () => {
      const attributes: AudioAttributes = { width: "500", height: "60" };
      const result = AudioAttributes.parseSize(attributes);

      expect(result.width).toBe(500);
      expect(result.height).toBe(60);
    });

    it("不正な値は無視してデフォルトを使用する", () => {
      const attributes: AudioAttributes = { width: "invalid", height: "abc" };
      const result = AudioAttributes.parseSize(attributes);

      expect(result.width).toBe(300);
      expect(result.height).toBe(54);
    });

    it("CSSスタイルがHTML属性より優先される", () => {
      const attributes: AudioAttributes = {
        width: "200",
        height: "40",
        style: "width: 400px; height: 80px;",
      };
      const result = AudioAttributes.parseSize(attributes);

      expect(result.width).toBe(400);
      expect(result.height).toBe(80);
    });
  });

  describe("isValidUrl", () => {
    it("https URLを有効と判定する", () => {
      expect(AudioAttributes.isValidUrl("https://example.com/audio.mp3")).toBe(
        true,
      );
    });

    it("http URLを有効と判定する", () => {
      expect(AudioAttributes.isValidUrl("http://example.com/audio.mp3")).toBe(
        true,
      );
    });

    it("相対URLを有効と判定する", () => {
      expect(AudioAttributes.isValidUrl("/audio/track.mp3")).toBe(true);
      expect(AudioAttributes.isValidUrl("./audio.mp3")).toBe(true);
      expect(AudioAttributes.isValidUrl("../audio.mp3")).toBe(true);
    });

    it("data:audio URLを有効と判定する", () => {
      expect(AudioAttributes.isValidUrl("data:audio/mp3;base64,ABC")).toBe(
        true,
      );
    });

    it("javascript: URLを無効と判定する", () => {
      expect(AudioAttributes.isValidUrl("javascript:alert(1)")).toBe(false);
    });

    it("空文字を無効と判定する", () => {
      expect(AudioAttributes.isValidUrl("")).toBe(false);
    });

    it("undefinedを無効と判定する", () => {
      expect(AudioAttributes.isValidUrl(undefined)).toBe(false);
    });

    it("XSS攻撃パターンを無効と判定する", () => {
      expect(AudioAttributes.isValidUrl("<script>")).toBe(false);
      expect(AudioAttributes.isValidUrl("test<img>")).toBe(false);
    });
  });

  describe("hasControls", () => {
    it("controls属性がtrueの場合はtrueを返す", () => {
      const attributes: AudioAttributes = { controls: true };
      expect(AudioAttributes.hasControls(attributes)).toBe(true);
    });

    it("controls属性がfalseの場合はfalseを返す", () => {
      const attributes: AudioAttributes = { controls: false };
      expect(AudioAttributes.hasControls(attributes)).toBe(false);
    });

    it("controls属性がundefinedの場合はfalseを返す", () => {
      const attributes: AudioAttributes = {};
      expect(AudioAttributes.hasControls(attributes)).toBe(false);
    });
  });

  describe("getAudioSrc", () => {
    it("有効なsrc属性を返す", () => {
      const attributes: AudioAttributes = {
        src: "https://example.com/audio.mp3",
      };
      expect(AudioAttributes.getAudioSrc(attributes)).toBe(
        "https://example.com/audio.mp3",
      );
    });

    it("無効なsrc属性はnullを返す", () => {
      const attributes: AudioAttributes = { src: "javascript:alert(1)" };
      expect(AudioAttributes.getAudioSrc(attributes)).toBeNull();
    });

    it("src属性がない場合はnullを返す", () => {
      const attributes: AudioAttributes = {};
      expect(AudioAttributes.getAudioSrc(attributes)).toBeNull();
    });
  });

  describe("getPreload", () => {
    it("preload属性を返す", () => {
      const attributes: AudioAttributes = { preload: "none" };
      expect(AudioAttributes.getPreload(attributes)).toBe("none");
    });

    it("デフォルトはautoを返す", () => {
      const attributes: AudioAttributes = {};
      expect(AudioAttributes.getPreload(attributes)).toBe("auto");
    });
  });

  describe("getBorder", () => {
    it("ボーダー情報を返す", () => {
      const attributes: AudioAttributes = {
        style: "border: 2px solid #000000;",
      };
      const border = AudioAttributes.getBorder(attributes);

      expect(border).not.toBeNull();
      expect(border?.width).toBe(2);
    });

    it("スタイルがない場合はnullを返す", () => {
      const attributes: AudioAttributes = {};
      expect(AudioAttributes.getBorder(attributes)).toBeNull();
    });
  });

  describe("getBorderRadius", () => {
    it("角丸を返す", () => {
      const attributes: AudioAttributes = { style: "border-radius: 8px;" };
      expect(AudioAttributes.getBorderRadius(attributes)).toBe(8);
    });

    it("スタイルがない場合はnullを返す", () => {
      const attributes: AudioAttributes = {};
      expect(AudioAttributes.getBorderRadius(attributes)).toBeNull();
    });
  });
});
