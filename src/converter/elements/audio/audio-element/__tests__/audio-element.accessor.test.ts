import { describe, it, expect } from "vitest";
import { AudioElement } from "../audio-element";

describe("AudioElement アクセサメソッド", () => {
  describe("getSrc", () => {
    it("src属性を返す", () => {
      const element = AudioElement.create({
        src: "https://example.com/audio.mp3",
      });
      expect(AudioElement.getSrc(element)).toBe(
        "https://example.com/audio.mp3",
      );
    });

    it("src属性がない場合はundefinedを返す", () => {
      const element = AudioElement.create();
      expect(AudioElement.getSrc(element)).toBeUndefined();
    });
  });

  describe("getWidth", () => {
    it("width属性を返す", () => {
      const element = AudioElement.create({ width: "400" });
      expect(AudioElement.getWidth(element)).toBe("400");
    });
  });

  describe("getHeight", () => {
    it("height属性を返す", () => {
      const element = AudioElement.create({ height: "60" });
      expect(AudioElement.getHeight(element)).toBe("60");
    });
  });

  describe("hasControls", () => {
    it("controls属性がtrueの場合はtrueを返す", () => {
      const element = AudioElement.create({ controls: true });
      expect(AudioElement.hasControls(element)).toBe(true);
    });

    it("controls属性がない場合はfalseを返す", () => {
      const element = AudioElement.create();
      expect(AudioElement.hasControls(element)).toBe(false);
    });
  });

  describe("getStyle", () => {
    it("style属性を返す", () => {
      const element = AudioElement.create({ style: "width: 400px;" });
      expect(AudioElement.getStyle(element)).toBe("width: 400px;");
    });
  });

  describe("getNodeName", () => {
    it("title属性がある場合はtitleを含む名前を返す", () => {
      const element = AudioElement.create({ title: "背景音楽" });
      expect(AudioElement.getNodeName(element)).toBe("audio: 背景音楽");
    });

    it("srcがある場合はファイル名を含む名前を返す", () => {
      const element = AudioElement.create({
        src: "https://example.com/music.mp3",
      });
      expect(AudioElement.getNodeName(element)).toBe("audio: music.mp3");
    });

    it("属性がない場合はaudioを返す", () => {
      const element = AudioElement.create();
      expect(AudioElement.getNodeName(element)).toBe("audio");
    });
  });
});
