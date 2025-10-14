/**
 * @fileoverview OlElement ユーティリティメソッドのテスト
 */

import { test, expect } from "vitest";
import { OlElement } from "../ol-element";

// getStartNumber テスト
test("OlElement.getStartNumber: returns start attribute value when set", () => {
  const element = OlElement.create({ start: "5" });
  expect(OlElement.getStartNumber(element)).toBe(5);
});

test("OlElement.getStartNumber: returns 1 when start attribute is not set", () => {
  const element = OlElement.create();
  expect(OlElement.getStartNumber(element)).toBe(1);
});

test("OlElement.getStartNumber: returns 1 when start attribute is invalid", () => {
  const element = OlElement.create({ start: "invalid" });
  expect(OlElement.getStartNumber(element)).toBe(1);
});

test("OlElement.getStartNumber: handles negative numbers", () => {
  const element = OlElement.create({ start: "-5" });
  expect(OlElement.getStartNumber(element)).toBe(-5);
});

// getListType テスト
test("OlElement.getListType: returns type attribute value when set", () => {
  const element = OlElement.create({ type: "A" });
  expect(OlElement.getListType(element)).toBe("A");
});

test("OlElement.getListType: returns '1' when type attribute is not set", () => {
  const element = OlElement.create();
  expect(OlElement.getListType(element)).toBe("1");
});

// isReversed テスト
test("OlElement.isReversed: returns true when reversed attribute is set", () => {
  const element = OlElement.create({ reversed: "" });
  expect(OlElement.isReversed(element)).toBe(true);
});

test("OlElement.isReversed: returns false when reversed attribute is not set", () => {
  const element = OlElement.create();
  expect(OlElement.isReversed(element)).toBe(false);
});

// formatNumber テスト - 数字形式 ('1')
test("OlElement.formatNumber: numeric format returns number as string", () => {
  expect(OlElement.formatNumber(1, "1")).toBe("1");
  expect(OlElement.formatNumber(10, "1")).toBe("10");
  expect(OlElement.formatNumber(100, "1")).toBe("100");
});

// formatNumber テスト - 小文字英字形式 ('a')
test("OlElement.formatNumber: lowercase alpha format converts numbers to lowercase letters", () => {
  expect(OlElement.formatNumber(1, "a")).toBe("a");
  expect(OlElement.formatNumber(2, "a")).toBe("b");
  expect(OlElement.formatNumber(26, "a")).toBe("z");
  expect(OlElement.formatNumber(27, "a")).toBe("aa");
  expect(OlElement.formatNumber(52, "a")).toBe("az");
  expect(OlElement.formatNumber(53, "a")).toBe("ba");
});

// formatNumber テスト - 大文字英字形式 ('A')
test("OlElement.formatNumber: uppercase alpha format converts numbers to uppercase letters", () => {
  expect(OlElement.formatNumber(1, "A")).toBe("A");
  expect(OlElement.formatNumber(2, "A")).toBe("B");
  expect(OlElement.formatNumber(26, "A")).toBe("Z");
  expect(OlElement.formatNumber(27, "A")).toBe("AA");
  expect(OlElement.formatNumber(52, "A")).toBe("AZ");
  expect(OlElement.formatNumber(53, "A")).toBe("BA");
});

// formatNumber テスト - 小文字ローマ数字形式 ('i')
test("OlElement.formatNumber: lowercase roman format converts numbers to lowercase roman numerals", () => {
  expect(OlElement.formatNumber(1, "i")).toBe("i");
  expect(OlElement.formatNumber(2, "i")).toBe("ii");
  expect(OlElement.formatNumber(3, "i")).toBe("iii");
  expect(OlElement.formatNumber(4, "i")).toBe("iv");
  expect(OlElement.formatNumber(5, "i")).toBe("v");
  expect(OlElement.formatNumber(9, "i")).toBe("ix");
  expect(OlElement.formatNumber(10, "i")).toBe("x");
  expect(OlElement.formatNumber(49, "i")).toBe("xlix");
  expect(OlElement.formatNumber(50, "i")).toBe("l");
  expect(OlElement.formatNumber(99, "i")).toBe("xcix");
  expect(OlElement.formatNumber(100, "i")).toBe("c");
});

// formatNumber テスト - 大文字ローマ数字形式 ('I')
test("OlElement.formatNumber: uppercase roman format converts numbers to uppercase roman numerals", () => {
  expect(OlElement.formatNumber(1, "I")).toBe("I");
  expect(OlElement.formatNumber(2, "I")).toBe("II");
  expect(OlElement.formatNumber(3, "I")).toBe("III");
  expect(OlElement.formatNumber(4, "I")).toBe("IV");
  expect(OlElement.formatNumber(5, "I")).toBe("V");
  expect(OlElement.formatNumber(9, "I")).toBe("IX");
  expect(OlElement.formatNumber(10, "I")).toBe("X");
  expect(OlElement.formatNumber(49, "I")).toBe("XLIX");
  expect(OlElement.formatNumber(50, "I")).toBe("L");
  expect(OlElement.formatNumber(99, "I")).toBe("XCIX");
  expect(OlElement.formatNumber(100, "I")).toBe("C");
  expect(OlElement.formatNumber(500, "I")).toBe("D");
  expect(OlElement.formatNumber(1000, "I")).toBe("M");
  expect(OlElement.formatNumber(1984, "I")).toBe("MCMLXXXIV");
  expect(OlElement.formatNumber(2024, "I")).toBe("MMXXIV");
});

// toAlpha テスト
test("OlElement.toAlpha: converts numbers to alphabets", () => {
  expect(OlElement.toAlpha(1)).toBe("A");
  expect(OlElement.toAlpha(26)).toBe("Z");
  expect(OlElement.toAlpha(27)).toBe("AA");
  expect(OlElement.toAlpha(52)).toBe("AZ");
  expect(OlElement.toAlpha(53)).toBe("BA");
  expect(OlElement.toAlpha(702)).toBe("ZZ");
  expect(OlElement.toAlpha(703)).toBe("AAA");
});

// toRoman テスト
test("OlElement.toRoman: converts numbers to roman numerals", () => {
  expect(OlElement.toRoman(1)).toBe("I");
  expect(OlElement.toRoman(4)).toBe("IV");
  expect(OlElement.toRoman(5)).toBe("V");
  expect(OlElement.toRoman(9)).toBe("IX");
  expect(OlElement.toRoman(10)).toBe("X");
  expect(OlElement.toRoman(40)).toBe("XL");
  expect(OlElement.toRoman(50)).toBe("L");
  expect(OlElement.toRoman(90)).toBe("XC");
  expect(OlElement.toRoman(100)).toBe("C");
  expect(OlElement.toRoman(400)).toBe("CD");
  expect(OlElement.toRoman(500)).toBe("D");
  expect(OlElement.toRoman(900)).toBe("CM");
  expect(OlElement.toRoman(1000)).toBe("M");
  expect(OlElement.toRoman(3999)).toBe("MMMCMXCIX");
});
