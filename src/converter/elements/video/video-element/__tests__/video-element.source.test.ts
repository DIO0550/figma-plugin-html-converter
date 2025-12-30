import { test, expect } from "vitest";
import { VideoElement } from "../video-element";

// getVideoSource テスト
test("getVideoSource: src属性がある場合はsrc属性を返す", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
  });
  expect(VideoElement.getVideoSource(element)).toBe(
    "https://example.com/video.mp4",
  );
});

test("getVideoSource: src属性がなくsource子要素がある場合はsource要素のsrcを返す", () => {
  const element = VideoElement.create({}, [
    {
      type: "element",
      tagName: "source",
      attributes: { src: "video.mp4", type: "video/mp4" },
    },
  ]);
  expect(VideoElement.getVideoSource(element)).toBe("video.mp4");
});

test("getVideoSource: 複数のsource子要素がある場合は最初のsrcを返す", () => {
  const element = VideoElement.create({}, [
    {
      type: "element",
      tagName: "source",
      attributes: { src: "video.mp4", type: "video/mp4" },
    },
    {
      type: "element",
      tagName: "source",
      attributes: { src: "video.webm", type: "video/webm" },
    },
  ]);
  expect(VideoElement.getVideoSource(element)).toBe("video.mp4");
});

test("getVideoSource: src属性もsource子要素もない場合はnullを返す", () => {
  const element = VideoElement.create({});
  expect(VideoElement.getVideoSource(element)).toBeNull();
});

test("getVideoSource: source子要素にsrc属性がなくtype属性のみの場合はnullを返す", () => {
  const element = VideoElement.create({}, [
    {
      type: "element",
      tagName: "source",
      attributes: { type: "video/mp4" },
    },
  ]);
  expect(VideoElement.getVideoSource(element)).toBeNull();
});

test("getVideoSource: source以外の子要素（track等）は無視される", () => {
  const element = VideoElement.create({}, [
    {
      type: "element",
      tagName: "track",
      attributes: { src: "subtitles.vtt", kind: "subtitles" },
    },
    {
      type: "element",
      tagName: "source",
      attributes: { src: "video.mp4", type: "video/mp4" },
    },
  ]);
  expect(VideoElement.getVideoSource(element)).toBe("video.mp4");
});

// getNodeName with source elements テスト
test("getNodeName: source子要素からファイル名を取得する", () => {
  const element = VideoElement.create({}, [
    {
      type: "element",
      tagName: "source",
      attributes: { src: "https://example.com/my-video.mp4" },
    },
  ]);
  expect(VideoElement.getNodeName(element)).toBe("video: my-video.mp4");
});
