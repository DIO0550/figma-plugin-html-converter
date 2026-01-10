import { test, expect } from "vitest";
import { IframeAttributes } from "../iframe-attributes";

// parseSize テスト
test("parseSize: デフォルトサイズは300x150を返す", () => {
  const result = IframeAttributes.parseSize({});
  expect(result.width).toBe(300);
  expect(result.height).toBe(150);
});

test("parseSize: width属性を指定した場合はその値を返す", () => {
  const result = IframeAttributes.parseSize({ width: "640" });
  expect(result.width).toBe(640);
  expect(result.height).toBe(150);
});

test("parseSize: height属性を指定した場合はその値を返す", () => {
  const result = IframeAttributes.parseSize({ height: "480" });
  expect(result.width).toBe(300);
  expect(result.height).toBe(480);
});

test("parseSize: width/height両方指定した場合はその値を返す", () => {
  const result = IframeAttributes.parseSize({ width: "800", height: "600" });
  expect(result.width).toBe(800);
  expect(result.height).toBe(600);
});

test("parseSize: 無効な数値の場合はデフォルト値を返す", () => {
  const result = IframeAttributes.parseSize({
    width: "invalid",
    height: "abc",
  });
  expect(result.width).toBe(300);
  expect(result.height).toBe(150);
});

test("parseSize: styleのwidth/heightが属性より優先される", () => {
  const result = IframeAttributes.parseSize({
    width: "640",
    height: "480",
    style: "width: 1024px; height: 768px;",
  });
  expect(result.width).toBe(1024);
  expect(result.height).toBe(768);
});

// isValidUrl テスト
test("isValidUrl: undefinedはfalseを返す", () => {
  expect(IframeAttributes.isValidUrl(undefined)).toBe(false);
});

test("isValidUrl: 空文字はfalseを返す", () => {
  expect(IframeAttributes.isValidUrl("")).toBe(false);
});

test("isValidUrl: https URLはtrueを返す", () => {
  expect(IframeAttributes.isValidUrl("https://example.com")).toBe(true);
});

test("isValidUrl: http URLはtrueを返す", () => {
  expect(IframeAttributes.isValidUrl("http://example.com")).toBe(true);
});

test("isValidUrl: javascript: URLはfalseを返す", () => {
  expect(IframeAttributes.isValidUrl("javascript:alert(1)")).toBe(false);
});

test("isValidUrl: data: URLはfalseを返す", () => {
  expect(IframeAttributes.isValidUrl("data:text/html,<h1>test</h1>")).toBe(
    false,
  );
});

test("isValidUrl: XSSパターン（<>含む）はfalseを返す", () => {
  expect(IframeAttributes.isValidUrl("https://example.com/<script>")).toBe(
    false,
  );
});

test("isValidUrl: 相対URLはtrueを返す", () => {
  expect(IframeAttributes.isValidUrl("/page.html")).toBe(true);
  expect(IframeAttributes.isValidUrl("./page.html")).toBe(true);
  expect(IframeAttributes.isValidUrl("../page.html")).toBe(true);
});

test("isValidUrl: 明示的なパス形式でない相対URLはfalseを返す", () => {
  expect(IframeAttributes.isValidUrl("page.html")).toBe(false);
  expect(IframeAttributes.isValidUrl("subdir/page.html")).toBe(false);
});

// getSrc テスト
test("getSrc: src属性がない場合はnullを返す", () => {
  expect(IframeAttributes.getSrc({})).toBeNull();
});

test("getSrc: 有効なsrc属性がある場合はその値を返す", () => {
  expect(IframeAttributes.getSrc({ src: "https://example.com" })).toBe(
    "https://example.com",
  );
});

test("getSrc: 無効なsrc属性がある場合はnullを返す", () => {
  expect(IframeAttributes.getSrc({ src: "javascript:alert(1)" })).toBeNull();
});

// getTitle テスト
test("getTitle: title属性がない場合はnullを返す", () => {
  expect(IframeAttributes.getTitle({})).toBeNull();
});

test("getTitle: title属性がある場合はその値を返す", () => {
  expect(IframeAttributes.getTitle({ title: "Embedded Content" })).toBe(
    "Embedded Content",
  );
});

// getBorder テスト
test("getBorder: style属性がない場合はnullを返す", () => {
  expect(IframeAttributes.getBorder({})).toBeNull();
});

test("getBorder: styleにborderがある場合はその値を返す", () => {
  const result = IframeAttributes.getBorder({
    style: "border: 1px solid black;",
  });
  expect(result).not.toBeNull();
  expect(result?.width).toBe(1);
});

// getBorderRadius テスト
test("getBorderRadius: style属性がない場合はnullを返す", () => {
  expect(IframeAttributes.getBorderRadius({})).toBeNull();
});

test("getBorderRadius: styleにborder-radiusがある場合はその値を返す", () => {
  expect(
    IframeAttributes.getBorderRadius({ style: "border-radius: 8px;" }),
  ).toBe(8);
});
