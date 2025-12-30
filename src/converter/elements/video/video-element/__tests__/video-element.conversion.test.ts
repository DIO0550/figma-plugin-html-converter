import { test, expect } from "vitest";
import { VideoElement } from "../video-element";

// toFigmaNode 基本変換テスト
test("toFigmaNode: 基本的なvideo要素をFRAMEに変換する", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
    width: "640",
    height: "360",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.width).toBe(640);
  expect(figmaNode.height).toBe(360);
});

test("toFigmaNode: サイズ未指定の場合デフォルトサイズ(300x150)を使用する", () => {
  const element = VideoElement.create({});
  const figmaNode = VideoElement.toFigmaNode(element);

  expect(figmaNode.width).toBe(300);
  expect(figmaNode.height).toBe(150);
});

test("toFigmaNode: ノード名がtitle属性から設定される", () => {
  const element = VideoElement.create({ title: "紹介動画" });
  const figmaNode = VideoElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("video: 紹介動画");
});

// プレースホルダー背景テスト
test("toFigmaNode: poster属性がない場合はダーク背景(0.1, 0.1, 0.1)を使用", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  expect(figmaNode.fills).toBeDefined();
  expect(figmaNode.fills).toHaveLength(1);
  expect(figmaNode.fills![0]).toEqual(
    expect.objectContaining({
      type: "SOLID",
      color: { r: 0.1, g: 0.1, b: 0.1 },
    }),
  );
});

test("toFigmaNode: poster属性がある場合はIMAGEタイプで画像URLを設定", () => {
  const element = VideoElement.create({
    poster: "https://example.com/thumbnail.jpg",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  expect(figmaNode.fills).toBeDefined();
  expect(figmaNode.fills).toHaveLength(1);
  expect(figmaNode.fills![0]).toEqual(
    expect.objectContaining({
      type: "IMAGE",
      imageUrl: "https://example.com/thumbnail.jpg",
    }),
  );
});

// スタイル適用テスト
test("toFigmaNode: style属性のサイズがwidth/height属性より優先される", () => {
  const element = VideoElement.create({
    width: "640",
    height: "360",
    style: "width: 1280px; height: 720px;",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  expect(figmaNode.width).toBe(1280);
  expect(figmaNode.height).toBe(720);
});

test("toFigmaNode: style属性のボーダーが適用される", () => {
  const element = VideoElement.create({
    style: "border: 2px solid #333;",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  expect(figmaNode.strokes).toBeDefined();
  expect(figmaNode.strokeWeight).toBe(2);
});

test("toFigmaNode: style属性の角丸が適用される", () => {
  const element = VideoElement.create({
    style: "border-radius: 8px;",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  expect(figmaNode.cornerRadius).toBe(8);
});

// mapToFigma テスト
test("mapToFigma: VideoElementからFigmaNodeConfigを生成する", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
    width: "800",
    height: "450",
  });
  const figmaNode = VideoElement.mapToFigma(element);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode!.type).toBe("FRAME");
  expect(figmaNode!.width).toBe(800);
  expect(figmaNode!.height).toBe(450);
});

test("mapToFigma: HTMLNodeライクなオブジェクトからFigmaNodeConfigを生成する", () => {
  const node = {
    type: "element",
    tagName: "video",
    attributes: {
      src: "video.mp4",
      width: "640",
      height: "360",
    },
    children: [],
  };
  const figmaNode = VideoElement.mapToFigma(node);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode!.type).toBe("FRAME");
});

test("mapToFigma: video要素以外のノードはnullを返す", () => {
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
  };
  const figmaNode = VideoElement.mapToFigma(node);

  expect(figmaNode).toBeNull();
});

test("mapToFigma: source子要素を持つHTMLNodeからファイル名を取得してノード名に使用する", () => {
  const node = {
    type: "element",
    tagName: "video",
    attributes: {},
    children: [
      {
        type: "element",
        tagName: "source",
        attributes: {
          src: "https://example.com/my-video.mp4",
          type: "video/mp4",
        },
      },
    ],
  };
  const figmaNode = VideoElement.mapToFigma(node);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode!.name).toBe("video: my-video.mp4");
});

test("mapToFigma: 複数のsource子要素がある場合は最初のsrcを使用する", () => {
  const node = {
    type: "element",
    tagName: "video",
    attributes: {},
    children: [
      {
        type: "element",
        tagName: "source",
        attributes: { src: "first-video.mp4", type: "video/mp4" },
      },
      {
        type: "element",
        tagName: "source",
        attributes: { src: "second-video.webm", type: "video/webm" },
      },
    ],
  };
  const figmaNode = VideoElement.mapToFigma(node);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode!.name).toBe("video: first-video.mp4");
});

test("mapToFigma: src属性がsource子要素より優先される", () => {
  const node = {
    type: "element",
    tagName: "video",
    attributes: { src: "main-video.mp4" },
    children: [
      {
        type: "element",
        tagName: "source",
        attributes: { src: "fallback-video.mp4", type: "video/mp4" },
      },
    ],
  };
  const figmaNode = VideoElement.mapToFigma(node);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode!.name).toBe("video: main-video.mp4");
});
