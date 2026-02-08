/**
 * embed要素のタイプガードテスト
 */

import { test, expect } from "vitest";
import { EmbedElement } from "../embed-element";

test("EmbedElement.isEmbedElement - EmbedElementの場合 - trueを返す", () => {
  const element = EmbedElement.create({
    src: "https://example.com/video.mp4",
  });
  expect(EmbedElement.isEmbedElement(element)).toBe(true);
});

test(
  "EmbedElement.isEmbedElement - typeがelement以外の場合 - falseを返す",
  () => {
    const element = { type: "text", tagName: "embed", attributes: {} };
    expect(EmbedElement.isEmbedElement(element)).toBe(false);
  },
);

test(
  "EmbedElement.isEmbedElement - tagNameがembed以外の場合 - falseを返す",
  () => {
    const element = { type: "element", tagName: "iframe", attributes: {} };
    expect(EmbedElement.isEmbedElement(element)).toBe(false);
  },
);

test("EmbedElement.isEmbedElement - nullの場合 - falseを返す", () => {
  expect(EmbedElement.isEmbedElement(null)).toBe(false);
});

test("EmbedElement.isEmbedElement - undefinedの場合 - falseを返す", () => {
  expect(EmbedElement.isEmbedElement(undefined)).toBe(false);
});

test("EmbedElement.isEmbedElement - オブジェクト以外の場合 - falseを返す", () => {
  expect(EmbedElement.isEmbedElement("embed")).toBe(false);
  expect(EmbedElement.isEmbedElement(123)).toBe(false);
});

test(
  "EmbedElement.isEmbedElement - typeプロパティなしの場合 - falseを返す",
  () => {
    const element = { tagName: "embed", attributes: {} };
    expect(EmbedElement.isEmbedElement(element)).toBe(false);
  },
);

test(
  "EmbedElement.isEmbedElement - tagNameプロパティなしの場合 - falseを返す",
  () => {
    const element = { type: "element", attributes: {} };
    expect(EmbedElement.isEmbedElement(element)).toBe(false);
  },
);
