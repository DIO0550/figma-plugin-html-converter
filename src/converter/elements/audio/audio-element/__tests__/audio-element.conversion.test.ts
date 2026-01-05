import { test, expect } from "vitest";
import { AudioElement } from "../audio-element";

// toFigmaNode
test("AudioElement.toFigmaNode: FRAMEタイプのノードを作成する", () => {
  const element = AudioElement.create();
  const config = AudioElement.toFigmaNode(element);

  expect(config.type).toBe("FRAME");
});

test("AudioElement.toFigmaNode: デフォルトサイズ300x54pxを適用する", () => {
  const element = AudioElement.create();
  const config = AudioElement.toFigmaNode(element);

  expect(config.width).toBe(300);
  expect(config.height).toBe(54);
});

test("AudioElement.toFigmaNode: カスタムサイズを適用する", () => {
  const element = AudioElement.create({ width: "400", height: "60" });
  const config = AudioElement.toFigmaNode(element);

  expect(config.width).toBe(400);
  expect(config.height).toBe(60);
});

test("AudioElement.toFigmaNode: 背景色（ダークグレー）を適用する", () => {
  const element = AudioElement.create();
  const config = AudioElement.toFigmaNode(element);

  expect(config.fills).toBeDefined();
  expect(config.fills).toHaveLength(1);
});

test("AudioElement.toFigmaNode: ボーダースタイルを適用する", () => {
  const element = AudioElement.create({
    style: "border: 2px solid #000000;",
  });
  const config = AudioElement.toFigmaNode(element);

  expect(config.strokes).toBeDefined();
  expect(config.strokeWeight).toBe(2);
});

test("AudioElement.toFigmaNode: 角丸スタイルを適用する", () => {
  const element = AudioElement.create({ style: "border-radius: 8px;" });
  const config = AudioElement.toFigmaNode(element);

  expect(config.cornerRadius).toBe(8);
});

// createFills
test("AudioElement.createFills: プレースホルダー色（SOLIDタイプのダークグレー）を返す", () => {
  const element = AudioElement.create();
  const fills = AudioElement.createFills(element);

  expect(fills).toHaveLength(1);
  expect(fills[0].type).toBe("SOLID");
});

// mapToFigma
test("AudioElement.mapToFigma: AudioElementをFigmaNodeConfigに変換する", () => {
  const element = AudioElement.create({
    src: "https://example.com/audio.mp3",
    controls: true,
  });
  const config = AudioElement.mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config!.type).toBe("FRAME");
});

test("AudioElement.mapToFigma: HTMLNodeライクなオブジェクトも変換できる", () => {
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

test("AudioElement.mapToFigma: audio要素でない場合、nullを返す", () => {
  const node = {
    type: "element",
    tagName: "video",
    attributes: {},
    children: [],
  };
  const config = AudioElement.mapToFigma(node);

  expect(config).toBeNull();
});

test("AudioElement.mapToFigma: source子要素を含むHTMLNodeを変換し、ファイル名をnameに含める", () => {
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
