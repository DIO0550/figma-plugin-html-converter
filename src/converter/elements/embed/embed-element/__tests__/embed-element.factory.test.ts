/**
 * embed要素のファクトリテスト
 */

import { test, expect } from "vitest";
import { EmbedElement } from "../embed-element";

test("create: 空の属性でEmbedElementを作成できる", () => {
  const element = EmbedElement.create();
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("embed");
  expect(element.attributes).toEqual({});
});

test("create: src属性を持つEmbedElementを作成できる", () => {
  const element = EmbedElement.create({
    src: "https://example.com/video.mp4",
  });
  expect(element.attributes.src).toBe("https://example.com/video.mp4");
});

test("create: サイズ属性を持つEmbedElementを作成できる", () => {
  const element = EmbedElement.create({
    width: "640",
    height: "360",
  });
  expect(element.attributes.width).toBe("640");
  expect(element.attributes.height).toBe("360");
});

test("create: type属性を持つEmbedElementを作成できる", () => {
  const element = EmbedElement.create({
    type: "video/mp4",
  });
  expect(element.attributes.type).toBe("video/mp4");
});

test("create: 複数の属性を組み合わせてEmbedElementを作成できる", () => {
  const element = EmbedElement.create({
    src: "https://example.com/document.pdf",
    width: "800",
    height: "600",
    type: "application/pdf",
  });
  expect(element.attributes.src).toBe("https://example.com/document.pdf");
  expect(element.attributes.width).toBe("800");
  expect(element.attributes.height).toBe("600");
  expect(element.attributes.type).toBe("application/pdf");
});
