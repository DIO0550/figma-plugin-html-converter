/**
 * @fileoverview リスト番号フォーマットのテスト
 */

import { test, expect } from "vitest";
import { toAlpha, toRoman } from "../list-number-formatter";

test("toAlpha - 1桁の数値 - 1文字アルファベットを返す", () => {
  expect(toAlpha(1)).toBe("A");
  expect(toAlpha(2)).toBe("B");
  expect(toAlpha(26)).toBe("Z");
});

test("toAlpha - 2桁相当の数値 - 2文字アルファベットを返す", () => {
  expect(toAlpha(27)).toBe("AA");
  expect(toAlpha(28)).toBe("AB");
  expect(toAlpha(52)).toBe("AZ");
});

test("toAlpha - 3桁相当の数値 - 3文字までのアルファベットを返す", () => {
  expect(toAlpha(53)).toBe("BA");
  expect(toAlpha(702)).toBe("ZZ");
  expect(toAlpha(703)).toBe("AAA");
});

test("toRoman - 基本値 - 基本的なローマ数字を返す", () => {
  expect(toRoman(1)).toBe("I");
  expect(toRoman(5)).toBe("V");
  expect(toRoman(10)).toBe("X");
  expect(toRoman(50)).toBe("L");
  expect(toRoman(100)).toBe("C");
  expect(toRoman(500)).toBe("D");
  expect(toRoman(1000)).toBe("M");
});

test("toRoman - 減算記法の値 - 減算記法を含むローマ数字を返す", () => {
  expect(toRoman(4)).toBe("IV");
  expect(toRoman(9)).toBe("IX");
  expect(toRoman(40)).toBe("XL");
  expect(toRoman(90)).toBe("XC");
  expect(toRoman(400)).toBe("CD");
  expect(toRoman(900)).toBe("CM");
});

test("toRoman - 複雑な数値 - 正しいローマ数字を返す", () => {
  expect(toRoman(2)).toBe("II");
  expect(toRoman(3)).toBe("III");
  expect(toRoman(27)).toBe("XXVII");
  expect(toRoman(48)).toBe("XLVIII");
  expect(toRoman(59)).toBe("LIX");
  expect(toRoman(93)).toBe("XCIII");
  expect(toRoman(141)).toBe("CXLI");
  expect(toRoman(163)).toBe("CLXIII");
  expect(toRoman(402)).toBe("CDII");
  expect(toRoman(575)).toBe("DLXXV");
  expect(toRoman(911)).toBe("CMXI");
  expect(toRoman(1024)).toBe("MXXIV");
  expect(toRoman(3999)).toBe("MMMCMXCIX");
});
