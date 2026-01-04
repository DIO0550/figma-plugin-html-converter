import { describe, it, expect } from "vitest";
import { AudioElement } from "../audio-element";

describe("AudioElement 変換", () => {
  describe("toFigmaNode", () => {
    it("FRAMEタイプのノードを作成する", () => {
      const element = AudioElement.create();
      const config = AudioElement.toFigmaNode(element);

      expect(config.type).toBe("FRAME");
    });

    it("デフォルトサイズを適用する（300x54）", () => {
      const element = AudioElement.create();
      const config = AudioElement.toFigmaNode(element);

      expect(config.width).toBe(300);
      expect(config.height).toBe(54);
    });

    it("カスタムサイズを適用する", () => {
      const element = AudioElement.create({ width: "400", height: "60" });
      const config = AudioElement.toFigmaNode(element);

      expect(config.width).toBe(400);
      expect(config.height).toBe(60);
    });

    it("背景色を適用する（ダークグレー）", () => {
      const element = AudioElement.create();
      const config = AudioElement.toFigmaNode(element);

      expect(config.fills).toBeDefined();
      expect(config.fills).toHaveLength(1);
    });

    it("ボーダーを適用する", () => {
      const element = AudioElement.create({
        style: "border: 2px solid #000000;",
      });
      const config = AudioElement.toFigmaNode(element);

      expect(config.strokes).toBeDefined();
      expect(config.strokeWeight).toBe(2);
    });

    it("角丸を適用する", () => {
      const element = AudioElement.create({ style: "border-radius: 8px;" });
      const config = AudioElement.toFigmaNode(element);

      expect(config.cornerRadius).toBe(8);
    });
  });

  describe("createFills", () => {
    it("プレースホルダー色（ダークグレー）を返す", () => {
      const element = AudioElement.create();
      const fills = AudioElement.createFills(element);

      expect(fills).toHaveLength(1);
      expect(fills[0].type).toBe("SOLID");
    });
  });

  describe("mapToFigma", () => {
    it("AudioElementをFigmaNodeConfigに変換する", () => {
      const element = AudioElement.create({
        src: "https://example.com/audio.mp3",
        controls: true,
      });
      const config = AudioElement.mapToFigma(element);

      expect(config).not.toBeNull();
      expect(config!.type).toBe("FRAME");
    });

    it("HTMLNodeライクなオブジェクトも変換する", () => {
      const node = {
        type: "element",
        tagName: "audio",
        attributes: { src: "audio.mp3", controls: true },
        children: [],
      };
      const config = AudioElement.mapToFigma(node);

      expect(config).not.toBeNull();
      expect(config!.type).toBe("FRAME");
    });

    it("audio要素でない場合はnullを返す", () => {
      const node = {
        type: "element",
        tagName: "video",
        attributes: {},
        children: [],
      };
      const config = AudioElement.mapToFigma(node);

      expect(config).toBeNull();
    });

    it("source子要素を含むHTMLNodeを変換する", () => {
      const node = {
        type: "element",
        tagName: "audio",
        attributes: { controls: true },
        children: [
          {
            type: "element",
            tagName: "source",
            attributes: { src: "audio.mp3", type: "audio/mpeg" },
          },
        ],
      };
      const config = AudioElement.mapToFigma(node);

      expect(config).not.toBeNull();
      expect(config!.name).toBe("audio: audio.mp3");
    });
  });
});
