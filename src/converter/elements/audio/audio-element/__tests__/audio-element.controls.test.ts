import { it, expect } from "vitest";
import { AudioElement } from "../audio-element";

// createPlayIcon
it("AudioElement.createPlayIcon: 三角形の再生アイコン（POLYGON）を作成する", () => {
  const icon = AudioElement.createPlayIcon();

  expect(icon.type).toBe("POLYGON");
  expect(icon.name).toBe("play-icon");
  expect(icon.pointCount).toBe(3);
  expect(icon.rotation).toBe(90);
});

it("AudioElement.createPlayIcon: アイコンサイズは16x16pxである", () => {
  const icon = AudioElement.createPlayIcon();

  expect(icon.width).toBe(16);
  expect(icon.height).toBe(16);
});

it("AudioElement.createPlayIcon: 白色のfillsを持つ", () => {
  const icon = AudioElement.createPlayIcon();

  expect(icon.fills).toBeDefined();
  expect(icon.fills).toHaveLength(1);
});

// createPlayButton
it("AudioElement.createPlayButton: 円形の再生ボタン（FRAME）を作成する", () => {
  const button = AudioElement.createPlayButton();

  expect(button.type).toBe("FRAME");
  expect(button.name).toBe("play-button");
  expect(button.cornerRadius).toBe(20);
});

it("AudioElement.createPlayButton: ボタンサイズは40x40pxである", () => {
  const button = AudioElement.createPlayButton();

  expect(button.width).toBe(40);
  expect(button.height).toBe(40);
});

it("AudioElement.createPlayButton: 中央配置のレイアウトを持つ", () => {
  const button = AudioElement.createPlayButton();

  expect(button.layoutMode).toBe("HORIZONTAL");
  expect(button.primaryAxisAlignItems).toBe("CENTER");
  expect(button.counterAxisAlignItems).toBe("CENTER");
});

it("AudioElement.createPlayButton: 再生アイコンを子要素として持つ", () => {
  const button = AudioElement.createPlayButton();

  expect(button.children).toBeDefined();
  expect(button.children).toHaveLength(1);
  expect(button.children![0].name).toBe("play-icon");
});

// toFigmaNode with controls
it("AudioElement.toFigmaNode: controls属性がある場合、再生ボタンを子要素として含む", () => {
  const element = AudioElement.create({ controls: true });
  const config = AudioElement.toFigmaNode(element);

  expect(config.children).toBeDefined();
  expect(config.children).toHaveLength(1);
  expect(config.children![0].name).toBe("play-button");
});

it("AudioElement.toFigmaNode: controls属性がない場合、子要素は含まない", () => {
  const element = AudioElement.create();
  const config = AudioElement.toFigmaNode(element);

  expect(config.children).toBeUndefined();
});
