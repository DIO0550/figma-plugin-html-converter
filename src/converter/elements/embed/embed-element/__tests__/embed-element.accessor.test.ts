/**
 * embed要素のアクセサテスト
 */

import { describe, test, expect } from "vitest";
import { EmbedElement } from "../embed-element";

describe("EmbedElement accessors", () => {
  describe("getSrc", () => {
    test("src属性を取得できる", () => {
      const element = EmbedElement.create({
        src: "https://example.com/video.mp4",
      });
      expect(EmbedElement.getSrc(element)).toBe(
        "https://example.com/video.mp4",
      );
    });

    test("src未設定の場合はundefinedを返す", () => {
      const element = EmbedElement.create({});
      expect(EmbedElement.getSrc(element)).toBeUndefined();
    });
  });

  describe("getWidth", () => {
    test("width属性を取得できる", () => {
      const element = EmbedElement.create({ width: "640" });
      expect(EmbedElement.getWidth(element)).toBe("640");
    });

    test("width未設定の場合はundefinedを返す", () => {
      const element = EmbedElement.create({});
      expect(EmbedElement.getWidth(element)).toBeUndefined();
    });
  });

  describe("getHeight", () => {
    test("height属性を取得できる", () => {
      const element = EmbedElement.create({ height: "360" });
      expect(EmbedElement.getHeight(element)).toBe("360");
    });

    test("height未設定の場合はundefinedを返す", () => {
      const element = EmbedElement.create({});
      expect(EmbedElement.getHeight(element)).toBeUndefined();
    });
  });

  describe("getType", () => {
    test("type属性を取得できる", () => {
      const element = EmbedElement.create({ type: "video/mp4" });
      expect(EmbedElement.getType(element)).toBe("video/mp4");
    });

    test("type未設定の場合はundefinedを返す", () => {
      const element = EmbedElement.create({});
      expect(EmbedElement.getType(element)).toBeUndefined();
    });
  });

  describe("getStyle", () => {
    test("style属性を取得できる", () => {
      const element = EmbedElement.create({ style: "width: 100%;" });
      expect(EmbedElement.getStyle(element)).toBe("width: 100%;");
    });

    test("style未設定の場合はundefinedを返す", () => {
      const element = EmbedElement.create({});
      expect(EmbedElement.getStyle(element)).toBeUndefined();
    });
  });

  describe("getNodeName", () => {
    test("type属性がある場合はembed: typeの形式で返す", () => {
      const element = EmbedElement.create({ type: "video/mp4" });
      expect(EmbedElement.getNodeName(element)).toBe("embed: video/mp4");
    });

    test("srcのみの場合はホスト名を使用する", () => {
      const element = EmbedElement.create({
        src: "https://example.com/video.mp4",
      });
      expect(EmbedElement.getNodeName(element)).toBe("embed: example.com");
    });

    test("typeとsrcがある場合はtypeを優先する", () => {
      const element = EmbedElement.create({
        src: "https://example.com/video.mp4",
        type: "application/pdf",
      });
      expect(EmbedElement.getNodeName(element)).toBe("embed: application/pdf");
    });

    test("typeもsrcもない場合はembedを返す", () => {
      const element = EmbedElement.create({});
      expect(EmbedElement.getNodeName(element)).toBe("embed");
    });

    test("不正なsrcの場合はembedを返す", () => {
      const element = EmbedElement.create({ src: "invalid-url" });
      expect(EmbedElement.getNodeName(element)).toBe("embed");
    });
  });
});
