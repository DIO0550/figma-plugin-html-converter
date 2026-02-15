import { test, expect } from "vitest";
import {
  getColspanValue,
  getRowspanValue,
  getSpanValue,
} from "../span-helpers";

test("getColspanValue - colspan未設定 - デフォルト1を返す", () => {
  expect(getColspanValue({ attributes: {} })).toBe(1);
  expect(getColspanValue({ attributes: undefined })).toBe(1);
  expect(getColspanValue({})).toBe(1);
});

test("getColspanValue - colspan属性が文字列 - 数値にパースして返す", () => {
  expect(getColspanValue({ attributes: { colspan: "2" } })).toBe(2);
  expect(getColspanValue({ attributes: { colspan: "5" } })).toBe(5);
  expect(getColspanValue({ attributes: { colspan: "10" } })).toBe(10);
});

test("getColspanValue - colspan属性が数値 - そのまま返す", () => {
  expect(getColspanValue({ attributes: { colspan: 3 } })).toBe(3);
  expect(getColspanValue({ attributes: { colspan: 7 } })).toBe(7);
});

test("getColspanValue - 無効な値 - デフォルト1を返す", () => {
  expect(getColspanValue({ attributes: { colspan: "invalid" } })).toBe(1);
  expect(getColspanValue({ attributes: { colspan: "abc" } })).toBe(1);
});

test("getColspanValue - 0以下の値 - デフォルト1を返す", () => {
  expect(getColspanValue({ attributes: { colspan: "0" } })).toBe(1);
  expect(getColspanValue({ attributes: { colspan: "-1" } })).toBe(1);
  expect(getColspanValue({ attributes: { colspan: 0 } })).toBe(1);
  expect(getColspanValue({ attributes: { colspan: -5 } })).toBe(1);
});

test("getColspanValue - 空文字 - デフォルト1を返す", () => {
  expect(getColspanValue({ attributes: { colspan: "" } })).toBe(1);
});

test("getRowspanValue - rowspan未設定 - デフォルト1を返す", () => {
  expect(getRowspanValue({ attributes: {} })).toBe(1);
  expect(getRowspanValue({ attributes: undefined })).toBe(1);
  expect(getRowspanValue({})).toBe(1);
});

test("getRowspanValue - rowspan属性が文字列 - 数値にパースして返す", () => {
  expect(getRowspanValue({ attributes: { rowspan: "3" } })).toBe(3);
  expect(getRowspanValue({ attributes: { rowspan: "4" } })).toBe(4);
  expect(getRowspanValue({ attributes: { rowspan: "20" } })).toBe(20);
});

test("getRowspanValue - rowspan属性が数値 - そのまま返す", () => {
  expect(getRowspanValue({ attributes: { rowspan: 2 } })).toBe(2);
  expect(getRowspanValue({ attributes: { rowspan: 8 } })).toBe(8);
});

test("getRowspanValue - 無効な値 - デフォルト1を返す", () => {
  expect(getRowspanValue({ attributes: { rowspan: "invalid" } })).toBe(1);
  expect(getRowspanValue({ attributes: { rowspan: "xyz" } })).toBe(1);
});

test("getRowspanValue - 0以下の値 - デフォルト1を返す", () => {
  expect(getRowspanValue({ attributes: { rowspan: "0" } })).toBe(1);
  expect(getRowspanValue({ attributes: { rowspan: "-2" } })).toBe(1);
  expect(getRowspanValue({ attributes: { rowspan: 0 } })).toBe(1);
  expect(getRowspanValue({ attributes: { rowspan: -3 } })).toBe(1);
});

test("getRowspanValue - 空文字 - デフォルト1を返す", () => {
  expect(getRowspanValue({ attributes: { rowspan: "" } })).toBe(1);
});

test("getSpanValue - span未設定 - デフォルト1を返す", () => {
  expect(getSpanValue({ attributes: {} })).toBe(1);
  expect(getSpanValue({ attributes: undefined })).toBe(1);
  expect(getSpanValue({})).toBe(1);
});

test("getSpanValue - span属性が文字列 - 数値にパースして返す", () => {
  expect(getSpanValue({ attributes: { span: "2" } })).toBe(2);
  expect(getSpanValue({ attributes: { span: "5" } })).toBe(5);
});

test("getSpanValue - span属性が数値 - そのまま返す", () => {
  expect(getSpanValue({ attributes: { span: 3 } })).toBe(3);
  expect(getSpanValue({ attributes: { span: 10 } })).toBe(10);
});

test("getSpanValue - 無効な値 - デフォルト1を返す", () => {
  expect(getSpanValue({ attributes: { span: "invalid" } })).toBe(1);
  expect(getSpanValue({ attributes: { span: NaN } })).toBe(1);
});

test("getSpanValue - 1未満の値 - デフォルト1を返す", () => {
  expect(getSpanValue({ attributes: { span: "0" } })).toBe(1);
  expect(getSpanValue({ attributes: { span: "-1" } })).toBe(1);
  expect(getSpanValue({ attributes: { span: 0 } })).toBe(1);
});

test("getSpanValue - 空文字 - デフォルト1を返す", () => {
  expect(getSpanValue({ attributes: { span: "" } })).toBe(1);
});
