import { describe, it, expect } from "vitest";
import { AudioElement } from "../audio-element";

describe("AudioElement コントロールUI", () => {
  describe("createPlayIcon", () => {
    it("三角形の再生アイコンを作成する", () => {
      const icon = AudioElement.createPlayIcon();

      expect(icon.type).toBe("POLYGON");
      expect(icon.name).toBe("play-icon");
      expect(icon.pointCount).toBe(3);
      expect(icon.rotation).toBe(90);
    });

    it("アイコンサイズは16pxである", () => {
      const icon = AudioElement.createPlayIcon();

      expect(icon.width).toBe(16);
      expect(icon.height).toBe(16);
    });

    it("白色のアイコンである", () => {
      const icon = AudioElement.createPlayIcon();

      expect(icon.fills).toBeDefined();
      expect(icon.fills).toHaveLength(1);
    });
  });

  describe("createPlayButton", () => {
    it("円形の再生ボタンを作成する", () => {
      const button = AudioElement.createPlayButton();

      expect(button.type).toBe("FRAME");
      expect(button.name).toBe("play-button");
      expect(button.cornerRadius).toBe(20);
    });

    it("ボタンサイズは40x40pxである", () => {
      const button = AudioElement.createPlayButton();

      expect(button.width).toBe(40);
      expect(button.height).toBe(40);
    });

    it("中央配置のレイアウトを持つ", () => {
      const button = AudioElement.createPlayButton();

      expect(button.layoutMode).toBe("HORIZONTAL");
      expect(button.primaryAxisAlignItems).toBe("CENTER");
      expect(button.counterAxisAlignItems).toBe("CENTER");
    });

    it("再生アイコンを子要素として持つ", () => {
      const button = AudioElement.createPlayButton();

      expect(button.children).toBeDefined();
      expect(button.children).toHaveLength(1);
      expect(button.children![0].name).toBe("play-icon");
    });
  });

  describe("toFigmaNode with controls", () => {
    it("controls属性がある場合は再生ボタンを含む", () => {
      const element = AudioElement.create({ controls: true });
      const config = AudioElement.toFigmaNode(element);

      expect(config.children).toBeDefined();
      expect(config.children).toHaveLength(1);
      expect(config.children![0].name).toBe("play-button");
    });

    it("controls属性がない場合は再生ボタンを含まない", () => {
      const element = AudioElement.create();
      const config = AudioElement.toFigmaNode(element);

      expect(config.children).toBeUndefined();
    });
  });
});
