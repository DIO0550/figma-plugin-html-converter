/**
 * embedded-element-utils のテスト
 */

import { test, expect } from "vitest";
import {
  DEFAULT_EMBEDDED_SIZE,
  parseSize,
  isValidUrl,
  getBorder,
  getBorderRadius,
} from "../embedded-element-utils";

test(
  "embedded-element-utils.DEFAULT_EMBEDDED_SIZE - 定義 - HTML Living Standard準拠の値を持つ",
  () => {
    expect(DEFAULT_EMBEDDED_SIZE.WIDTH).toBe(300);
    expect(DEFAULT_EMBEDDED_SIZE.HEIGHT).toBe(150);
  },
);

test(
  "embedded-element-utils.parseSize - 属性なし - デフォルトサイズを返す",
  () => {
    const result = parseSize({});
    expect(result).toEqual({ width: 300, height: 150 });
  },
);

test(
  "embedded-element-utils.parseSize - width/height属性あり - サイズを解析する",
  () => {
    const result = parseSize({ width: "400", height: "300" });
    expect(result).toEqual({ width: 400, height: 300 });
  },
);

test(
  "embedded-element-utils.parseSize - 無効なwidth/height - デフォルトサイズを返す",
  () => {
    const result = parseSize({ width: "invalid", height: "abc" });
    expect(result).toEqual({ width: 300, height: 150 });
  },
);

test(
  "embedded-element-utils.parseSize - 0以下の値 - デフォルトサイズを返す",
  () => {
    const result = parseSize({ width: "0", height: "-10" });
    expect(result).toEqual({ width: 300, height: 150 });
  },
);

test(
  "embedded-element-utils.parseSize - style属性あり - styleサイズを返す",
  () => {
    const result = parseSize({ style: "width: 500px; height: 400px" });
    expect(result).toEqual({ width: 500, height: 400 });
  },
);

test(
  "embedded-element-utils.parseSize - style属性あり - styleがwidth/heightより優先される",
  () => {
    const result = parseSize({
      width: "200",
      height: "100",
      style: "width: 600px; height: 500px",
    });
    expect(result).toEqual({ width: 600, height: 500 });
  },
);

test("embedded-element-utils.isValidUrl - undefined - falseを返す", () => {
  expect(isValidUrl(undefined)).toBe(false);
});

test("embedded-element-utils.isValidUrl - 空文字 - falseを返す", () => {
  expect(isValidUrl("")).toBe(false);
  expect(isValidUrl("  ")).toBe(false);
});

test("embedded-element-utils.isValidUrl - http URL - trueを返す", () => {
  expect(isValidUrl("http://example.com")).toBe(true);
});

test("embedded-element-utils.isValidUrl - https URL - trueを返す", () => {
  expect(isValidUrl("https://example.com")).toBe(true);
});

test("embedded-element-utils.isValidUrl - 相対パス - trueを返す", () => {
  expect(isValidUrl("/path/to/resource")).toBe(true);
  expect(isValidUrl("./relative")).toBe(true);
  expect(isValidUrl("../parent")).toBe(true);
});

test(
  "embedded-element-utils.isValidUrl - javascriptスキーム - falseを返す",
  () => {
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("JAVASCRIPT:void(0)")).toBe(false);
  },
);

test("embedded-element-utils.isValidUrl - dataスキーム - falseを返す", () => {
  expect(isValidUrl("data:text/html,<script>")).toBe(false);
  expect(isValidUrl("DATA:image/png;base64,")).toBe(false);
});

test(
  "embedded-element-utils.isValidUrl - HTMLタグ含む - falseを返す",
  () => {
    expect(isValidUrl("https://example.com/<script>")).toBe(false);
    expect(isValidUrl("https://example.com/>test")).toBe(false);
  },
);

test("embedded-element-utils.getBorder - styleなし - nullを返す", () => {
  expect(getBorder({})).toBeNull();
});

test("embedded-element-utils.getBorder - styleあり - border情報を返す", () => {
  const result = getBorder({ style: "border: 2px solid red" });
  expect(result).not.toBeNull();
});

test("embedded-element-utils.getBorderRadius - styleなし - nullを返す", () => {
  expect(getBorderRadius({})).toBeNull();
});

test(
  "embedded-element-utils.getBorderRadius - 数値の角丸 - 数値を返す",
  () => {
    const result = getBorderRadius({ style: "border-radius: 10px" });
    expect(result).toBe(10);
  },
);

test("embedded-element-utils.getBorderRadius - 角丸なし - nullを返す", () => {
  const result = getBorderRadius({ style: "color: red" });
  expect(result).toBeNull();
});
