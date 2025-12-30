import { test, expect } from "vitest";
import { VideoElement } from "../video-element";

// getSrc テスト
test("getSrc: src属性を取得する", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
  });
  expect(VideoElement.getSrc(element)).toBe("https://example.com/video.mp4");
});

test("getSrc: src属性がない場合はundefinedを返す", () => {
  const element = VideoElement.create({});
  expect(VideoElement.getSrc(element)).toBeUndefined();
});

// getPoster テスト
test("getPoster: poster属性を取得する", () => {
  const element = VideoElement.create({
    poster: "https://example.com/thumbnail.jpg",
  });
  expect(VideoElement.getPoster(element)).toBe(
    "https://example.com/thumbnail.jpg",
  );
});

test("getPoster: poster属性がない場合はundefinedを返す", () => {
  const element = VideoElement.create({});
  expect(VideoElement.getPoster(element)).toBeUndefined();
});

// getWidth テスト
test("getWidth: width属性を取得する", () => {
  const element = VideoElement.create({ width: "640" });
  expect(VideoElement.getWidth(element)).toBe("640");
});

test("getWidth: width属性がない場合はundefinedを返す", () => {
  const element = VideoElement.create({});
  expect(VideoElement.getWidth(element)).toBeUndefined();
});

// getHeight テスト
test("getHeight: height属性を取得する", () => {
  const element = VideoElement.create({ height: "360" });
  expect(VideoElement.getHeight(element)).toBe("360");
});

test("getHeight: height属性がない場合はundefinedを返す", () => {
  const element = VideoElement.create({});
  expect(VideoElement.getHeight(element)).toBeUndefined();
});

// hasControls テスト
test("hasControls: controls属性がtrueの場合はtrueを返す", () => {
  const element = VideoElement.create({ controls: true });
  expect(VideoElement.hasControls(element)).toBe(true);
});

test("hasControls: controls属性がfalseの場合はfalseを返す", () => {
  const element = VideoElement.create({ controls: false });
  expect(VideoElement.hasControls(element)).toBe(false);
});

test("hasControls: controls属性がない場合はfalseを返す", () => {
  const element = VideoElement.create({});
  expect(VideoElement.hasControls(element)).toBe(false);
});

// getStyle テスト
test("getStyle: style属性を取得する", () => {
  const element = VideoElement.create({
    style: "width: 100%; max-height: 500px;",
  });
  expect(VideoElement.getStyle(element)).toBe(
    "width: 100%; max-height: 500px;",
  );
});

test("getStyle: style属性がない場合はundefinedを返す", () => {
  const element = VideoElement.create({});
  expect(VideoElement.getStyle(element)).toBeUndefined();
});

// getNodeName テスト
test("getNodeName: title属性があればvideo: titleを返す", () => {
  const element = VideoElement.create({ title: "サンプル動画" });
  expect(VideoElement.getNodeName(element)).toBe("video: サンプル動画");
});

test("getNodeName: title属性がなくsrc属性がある場合はファイル名を使用", () => {
  const element = VideoElement.create({
    src: "https://example.com/my-video.mp4",
  });
  expect(VideoElement.getNodeName(element)).toBe("video: my-video.mp4");
});

test("getNodeName: title属性もsrc属性もない場合はvideoを返す", () => {
  const element = VideoElement.create({});
  expect(VideoElement.getNodeName(element)).toBe("video");
});
