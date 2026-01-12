/**
 * embed要素のタイプガードテスト
 */

import { describe, test, expect } from "vitest";
import { EmbedElement } from "../embed-element";

describe("EmbedElement.isEmbedElement", () => {
  test("EmbedElementを正しく識別できる", () => {
    const element = EmbedElement.create({
      src: "https://example.com/video.mp4",
    });
    expect(EmbedElement.isEmbedElement(element)).toBe(true);
  });

  test("type: elementでない場合はfalseを返す", () => {
    const element = { type: "text", tagName: "embed", attributes: {} };
    expect(EmbedElement.isEmbedElement(element)).toBe(false);
  });

  test("tagName: embedでない場合はfalseを返す", () => {
    const element = { type: "element", tagName: "iframe", attributes: {} };
    expect(EmbedElement.isEmbedElement(element)).toBe(false);
  });

  test("nullの場合はfalseを返す", () => {
    expect(EmbedElement.isEmbedElement(null)).toBe(false);
  });

  test("undefinedの場合はfalseを返す", () => {
    expect(EmbedElement.isEmbedElement(undefined)).toBe(false);
  });

  test("オブジェクトでない場合はfalseを返す", () => {
    expect(EmbedElement.isEmbedElement("embed")).toBe(false);
    expect(EmbedElement.isEmbedElement(123)).toBe(false);
  });

  test("typeプロパティがない場合はfalseを返す", () => {
    const element = { tagName: "embed", attributes: {} };
    expect(EmbedElement.isEmbedElement(element)).toBe(false);
  });

  test("tagNameプロパティがない場合はfalseを返す", () => {
    const element = { type: "element", attributes: {} };
    expect(EmbedElement.isEmbedElement(element)).toBe(false);
  });
});
