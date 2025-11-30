import { describe, test, expect } from "vitest";
import {
  getColspanValue,
  getRowspanValue,
  getSpanValue,
} from "../span-helpers";

// =============================================================================
// getColspanValue テスト
// =============================================================================

describe("getColspanValue", () => {
  test("colspan未設定時はデフォルト1を返す", () => {
    expect(getColspanValue({ attributes: {} })).toBe(1);
    expect(getColspanValue({ attributes: undefined })).toBe(1);
    expect(getColspanValue({})).toBe(1);
  });

  test("colspan属性が文字列の場合正しくパースする", () => {
    expect(getColspanValue({ attributes: { colspan: "2" } })).toBe(2);
    expect(getColspanValue({ attributes: { colspan: "5" } })).toBe(5);
    expect(getColspanValue({ attributes: { colspan: "10" } })).toBe(10);
  });

  test("colspan属性が数値の場合そのまま返す", () => {
    expect(getColspanValue({ attributes: { colspan: 3 } })).toBe(3);
    expect(getColspanValue({ attributes: { colspan: 7 } })).toBe(7);
  });

  test("無効な値の場合デフォルト1を返す", () => {
    expect(getColspanValue({ attributes: { colspan: "invalid" } })).toBe(1);
    expect(getColspanValue({ attributes: { colspan: "abc" } })).toBe(1);
  });

  test("0以下の値の場合デフォルト1を返す", () => {
    expect(getColspanValue({ attributes: { colspan: "0" } })).toBe(1);
    expect(getColspanValue({ attributes: { colspan: "-1" } })).toBe(1);
    expect(getColspanValue({ attributes: { colspan: 0 } })).toBe(1);
    expect(getColspanValue({ attributes: { colspan: -5 } })).toBe(1);
  });

  test("空文字の場合デフォルト1を返す", () => {
    expect(getColspanValue({ attributes: { colspan: "" } })).toBe(1);
  });
});

// =============================================================================
// getRowspanValue テスト
// =============================================================================

describe("getRowspanValue", () => {
  test("rowspan未設定時はデフォルト1を返す", () => {
    expect(getRowspanValue({ attributes: {} })).toBe(1);
    expect(getRowspanValue({ attributes: undefined })).toBe(1);
    expect(getRowspanValue({})).toBe(1);
  });

  test("rowspan属性が文字列の場合正しくパースする", () => {
    expect(getRowspanValue({ attributes: { rowspan: "3" } })).toBe(3);
    expect(getRowspanValue({ attributes: { rowspan: "4" } })).toBe(4);
    expect(getRowspanValue({ attributes: { rowspan: "20" } })).toBe(20);
  });

  test("rowspan属性が数値の場合そのまま返す", () => {
    expect(getRowspanValue({ attributes: { rowspan: 2 } })).toBe(2);
    expect(getRowspanValue({ attributes: { rowspan: 8 } })).toBe(8);
  });

  test("無効な値の場合デフォルト1を返す", () => {
    expect(getRowspanValue({ attributes: { rowspan: "invalid" } })).toBe(1);
    expect(getRowspanValue({ attributes: { rowspan: "xyz" } })).toBe(1);
  });

  test("0以下の値の場合デフォルト1を返す", () => {
    expect(getRowspanValue({ attributes: { rowspan: "0" } })).toBe(1);
    expect(getRowspanValue({ attributes: { rowspan: "-2" } })).toBe(1);
    expect(getRowspanValue({ attributes: { rowspan: 0 } })).toBe(1);
    expect(getRowspanValue({ attributes: { rowspan: -3 } })).toBe(1);
  });

  test("空文字の場合デフォルト1を返す", () => {
    expect(getRowspanValue({ attributes: { rowspan: "" } })).toBe(1);
  });
});

// =============================================================================
// getSpanValue テスト
// =============================================================================

describe("getSpanValue", () => {
  test("span未設定時はデフォルト1を返す", () => {
    expect(getSpanValue({ attributes: {} })).toBe(1);
    expect(getSpanValue({ attributes: undefined })).toBe(1);
    expect(getSpanValue({})).toBe(1);
  });

  test("span属性が文字列の場合正しくパースする", () => {
    expect(getSpanValue({ attributes: { span: "2" } })).toBe(2);
    expect(getSpanValue({ attributes: { span: "5" } })).toBe(5);
  });

  test("span属性が数値の場合そのまま返す", () => {
    expect(getSpanValue({ attributes: { span: 3 } })).toBe(3);
    expect(getSpanValue({ attributes: { span: 10 } })).toBe(10);
  });

  test("無効な値の場合デフォルト1を返す", () => {
    expect(getSpanValue({ attributes: { span: "invalid" } })).toBe(1);
    expect(getSpanValue({ attributes: { span: NaN } })).toBe(1);
  });

  test("1未満の値の場合デフォルト1を返す", () => {
    expect(getSpanValue({ attributes: { span: "0" } })).toBe(1);
    expect(getSpanValue({ attributes: { span: "-1" } })).toBe(1);
    expect(getSpanValue({ attributes: { span: 0 } })).toBe(1);
  });
});
