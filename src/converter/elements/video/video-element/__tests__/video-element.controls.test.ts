import { test, expect } from "vitest";
import { VideoElement } from "../video-element";

test("toFigmaNode: controls属性がある場合、再生ボタンの子要素を持つ", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
    controls: true,
    width: "640",
    height: "360",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  expect(figmaNode.children).toBeDefined();
  expect(figmaNode.children!.length).toBeGreaterThan(0);

  const playButton = figmaNode.children!.find(
    (child) => child.name === "play-button",
  );
  expect(playButton).toBeDefined();
});

test("toFigmaNode: controls属性がない場合、再生ボタンを含まない", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
    width: "640",
    height: "360",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  if (figmaNode.children) {
    const playButton = figmaNode.children.find(
      (child) => child.name === "play-button",
    );
    expect(playButton).toBeUndefined();
  }
});

test("toFigmaNode: 再生ボタンは64x64pxの円形（角丸32px）", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
    controls: true,
    width: "640",
    height: "360",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  const playButton = figmaNode.children!.find(
    (child) => child.name === "play-button",
  );

  expect(playButton!.width).toBe(64);
  expect(playButton!.height).toBe(64);
  expect(playButton!.cornerRadius).toBe(32);
});

test("toFigmaNode: 再生ボタン内に三角形アイコン（POLYGON、3点、24x24px、90度回転）がある", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
    controls: true,
    width: "640",
    height: "360",
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  const playButton = figmaNode.children!.find(
    (child) => child.name === "play-button",
  );

  expect(playButton!.children).toBeDefined();
  const playIcon = playButton!.children!.find(
    (child) => child.name === "play-icon",
  );
  expect(playIcon).toBeDefined();
  expect(playIcon!.type).toBe("POLYGON");
  expect(playIcon!.pointCount).toBe(3);
  expect(playIcon!.width).toBe(24);
  expect(playIcon!.height).toBe(24);
  expect(playIcon!.rotation).toBe(90);
});

test("toFigmaNode: 再生ボタンの背景は半透明の黒（opacity: 0.6）", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
    controls: true,
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  const playButton = figmaNode.children!.find(
    (child) => child.name === "play-button",
  );

  expect(playButton!.fills).toBeDefined();
  expect(playButton!.fills).toHaveLength(1);
  expect(playButton!.fills![0]).toEqual(
    expect.objectContaining({
      type: "SOLID",
      color: { r: 0, g: 0, b: 0 },
      opacity: 0.6,
    }),
  );
});

test("toFigmaNode: 再生アイコンは白色（r:1, g:1, b:1）", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
    controls: true,
  });
  const figmaNode = VideoElement.toFigmaNode(element);

  const playButton = figmaNode.children!.find(
    (child) => child.name === "play-button",
  );
  const playIcon = playButton!.children!.find(
    (child) => child.name === "play-icon",
  );

  expect(playIcon!.fills).toBeDefined();
  expect(playIcon!.fills).toHaveLength(1);
  expect(playIcon!.fills![0]).toEqual(
    expect.objectContaining({
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 },
    }),
  );
});
