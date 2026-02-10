/**
 * @fileoverview size-helpers のテスト
 */

import { expect, test } from "vitest";
import { resolveSize } from "../size-helpers";

const defaultOptions = { defaultWidth: 200, defaultHeight: 12 };

test("resolveSize - style未定義の場合 - デフォルト値を返す", () => {
  expect(resolveSize(undefined, defaultOptions)).toEqual({
    width: 200,
    height: 12,
  });
});

test("resolveSize - 空のattributesの場合 - デフォルト値を返す", () => {
  expect(resolveSize({}, defaultOptions)).toEqual({
    width: 200,
    height: 12,
  });
});

test("resolveSize - style属性にwidth/height指定 - width/heightを解決する", () => {
  const result = resolveSize(
    { style: "width: 300px; height: 8px;" },
    defaultOptions,
  );
  expect(result.width).toBe(300);
  expect(result.height).toBe(8);
});

test("resolveSize - widthのみ指定 - heightはデフォルト", () => {
  const result = resolveSize({ style: "width: 150px;" }, defaultOptions);
  expect(result.width).toBe(150);
  expect(result.height).toBe(12);
});

test("resolveSize - heightのみ指定 - widthはデフォルト", () => {
  const result = resolveSize({ style: "height: 20px;" }, defaultOptions);
  expect(result.width).toBe(200);
  expect(result.height).toBe(20);
});
