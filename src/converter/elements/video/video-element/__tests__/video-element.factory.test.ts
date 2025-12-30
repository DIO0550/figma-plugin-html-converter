import { test, expect } from "vitest";
import { VideoElement } from "../video-element";

test("create: 空の属性でVideoElementを作成できる", () => {
  const element = VideoElement.create();
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("video");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("create: src属性を持つVideoElementを作成できる", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
  });
  expect(element.attributes.src).toBe("https://example.com/video.mp4");
});

test("create: poster属性を持つVideoElementを作成できる", () => {
  const element = VideoElement.create({
    poster: "https://example.com/thumbnail.jpg",
  });
  expect(element.attributes.poster).toBe("https://example.com/thumbnail.jpg");
});

test("create: サイズ属性を持つVideoElementを作成できる", () => {
  const element = VideoElement.create({
    width: "640",
    height: "360",
  });
  expect(element.attributes.width).toBe("640");
  expect(element.attributes.height).toBe("360");
});

test("create: 再生制御属性を持つVideoElementを作成できる", () => {
  const element = VideoElement.create({
    controls: true,
    autoplay: true,
    loop: true,
    muted: true,
  });
  expect(element.attributes.controls).toBe(true);
  expect(element.attributes.autoplay).toBe(true);
  expect(element.attributes.loop).toBe(true);
  expect(element.attributes.muted).toBe(true);
});

test("create: 複数の属性を組み合わせてVideoElementを作成できる", () => {
  const element = VideoElement.create({
    src: "https://example.com/video.mp4",
    poster: "https://example.com/thumbnail.jpg",
    width: "1280",
    height: "720",
    controls: true,
    preload: "metadata",
  });
  expect(element.attributes.src).toBe("https://example.com/video.mp4");
  expect(element.attributes.poster).toBe("https://example.com/thumbnail.jpg");
  expect(element.attributes.width).toBe("1280");
  expect(element.attributes.height).toBe("720");
  expect(element.attributes.controls).toBe(true);
  expect(element.attributes.preload).toBe("metadata");
});

test("create: 子要素を持つVideoElementを作成できる", () => {
  const element = VideoElement.create({ controls: true }, [
    {
      type: "element",
      tagName: "source",
      attributes: { src: "video.mp4", type: "video/mp4" },
    },
  ]);
  expect(element.children).toHaveLength(1);
  expect(element.children[0]).toEqual({
    type: "element",
    tagName: "source",
    attributes: { src: "video.mp4", type: "video/mp4" },
  });
});
