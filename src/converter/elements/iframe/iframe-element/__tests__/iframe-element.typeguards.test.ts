import { test, expect } from "vitest";
import { IframeElement } from "../iframe-element";

test("isIframeElement: 有効なIframeElementに対してtrueを返す", () => {
  const element = IframeElement.create({ src: "https://example.com" });
  expect(IframeElement.isIframeElement(element)).toBe(true);
});

test("isIframeElement: nullに対してfalseを返す", () => {
  expect(IframeElement.isIframeElement(null)).toBe(false);
});

test("isIframeElement: undefinedに対してfalseを返す", () => {
  expect(IframeElement.isIframeElement(undefined)).toBe(false);
});

test("isIframeElement: 空オブジェクトに対してfalseを返す", () => {
  expect(IframeElement.isIframeElement({})).toBe(false);
});

test("isIframeElement: typeが異なる場合falseを返す", () => {
  expect(
    IframeElement.isIframeElement({
      type: "text",
      tagName: "iframe",
    }),
  ).toBe(false);
});

test("isIframeElement: tagNameが異なる場合falseを返す", () => {
  expect(
    IframeElement.isIframeElement({
      type: "element",
      tagName: "video",
    }),
  ).toBe(false);
});

test("isIframeElement: 正しい構造の場合trueを返す", () => {
  expect(
    IframeElement.isIframeElement({
      type: "element",
      tagName: "iframe",
      attributes: { src: "https://example.com" },
    }),
  ).toBe(true);
});
