import { test, expect } from "vitest";
import { VideoElement } from "../video-element";

test("isVideoElement: VideoElementを正しく判定する", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
  });
  expect(VideoElement.isVideoElement(element)).toBe(true);
});

test("isVideoElement: nullはfalseを返す", () => {
  expect(VideoElement.isVideoElement(null)).toBe(false);
});

test("isVideoElement: undefinedはfalseを返す", () => {
  expect(VideoElement.isVideoElement(undefined)).toBe(false);
});

test("isVideoElement: 文字列はfalseを返す", () => {
  expect(VideoElement.isVideoElement("video")).toBe(false);
});

test("isVideoElement: 数値はfalseを返す", () => {
  expect(VideoElement.isVideoElement(123)).toBe(false);
});

test("isVideoElement: 空のオブジェクトはfalseを返す", () => {
  expect(VideoElement.isVideoElement({})).toBe(false);
});

test("isVideoElement: typeが異なるオブジェクトはfalseを返す", () => {
  expect(
    VideoElement.isVideoElement({
      type: "text",
      tagName: "video",
      attributes: {},
    }),
  ).toBe(false);
});

test("isVideoElement: tagNameが異なるオブジェクトはfalseを返す", () => {
  expect(
    VideoElement.isVideoElement({
      type: "element",
      tagName: "img",
      attributes: {},
    }),
  ).toBe(false);
});

test("isVideoElement: HTMLNodeライクなvideo要素を正しく判定する", () => {
  const node = {
    type: "element",
    tagName: "video",
    attributes: {
      src: "video.mp4",
      controls: true,
    },
    children: [],
  };
  expect(VideoElement.isVideoElement(node)).toBe(true);
});

test("isVideoElement: 属性がないvideo要素を正しく判定する", () => {
  const node = {
    type: "element",
    tagName: "video",
    attributes: {},
    children: [],
  };
  expect(VideoElement.isVideoElement(node)).toBe(true);
});
