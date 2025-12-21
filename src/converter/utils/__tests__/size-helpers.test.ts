/**
 * @fileoverview size-helpers のテスト
 */

import { describe, expect, test } from "vitest";
import { resolveSize } from "../size-helpers";

describe("resolveSize", () => {
  const defaultOptions = { defaultWidth: 200, defaultHeight: 12 };

  test("style未定義の場合はデフォルト値を返す", () => {
    expect(resolveSize(undefined, defaultOptions)).toEqual({
      width: 200,
      height: 12,
    });
  });

  test("空のattributesの場合はデフォルト値を返す", () => {
    expect(resolveSize({}, defaultOptions)).toEqual({
      width: 200,
      height: 12,
    });
  });

  test("style属性からwidth/heightを解決する", () => {
    const result = resolveSize(
      { style: "width: 300px; height: 8px;" },
      defaultOptions,
    );
    expect(result.width).toBe(300);
    expect(result.height).toBe(8);
  });

  test("widthのみ指定された場合、heightはデフォルト", () => {
    const result = resolveSize({ style: "width: 150px;" }, defaultOptions);
    expect(result.width).toBe(150);
    expect(result.height).toBe(12);
  });

  test("heightのみ指定された場合、widthはデフォルト", () => {
    const result = resolveSize({ style: "height: 20px;" }, defaultOptions);
    expect(result.width).toBe(200);
    expect(result.height).toBe(20);
  });
});
