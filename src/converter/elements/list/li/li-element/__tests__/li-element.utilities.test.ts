/**
 * @fileoverview LiElement ユーティリティメソッドのテスト
 */

import { test, expect } from "vitest";
import { LiElement, type ListContext } from "../li-element";

// getValue テスト
test("LiElement.getValue: returns value attribute when set", () => {
  const element = LiElement.create({ value: "5" });
  expect(LiElement.getValue(element)).toBe(5);
});

test("LiElement.getValue: returns undefined when value attribute is not set", () => {
  const element = LiElement.create();
  expect(LiElement.getValue(element)).toBeUndefined();
});

test("LiElement.getValue: returns undefined when value attribute is invalid", () => {
  const element = LiElement.create({ value: "invalid" });
  expect(LiElement.getValue(element)).toBeUndefined();
});

test("LiElement.getValue: handles negative numbers", () => {
  const element = LiElement.create({ value: "-5" });
  expect(LiElement.getValue(element)).toBe(-5);
});

test("LiElement.getValue: handles zero correctly", () => {
  const element = LiElement.create({ value: "0" });
  expect(LiElement.getValue(element)).toBe(0);
});

// calculateItemNumber テスト
test("LiElement.calculateItemNumber: returns undefined for ul context", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ul",
    index: 0,
  };
  expect(LiElement.calculateItemNumber(context, element)).toBeUndefined();
});

test("LiElement.calculateItemNumber: returns value attribute when specified in ol", () => {
  const element = LiElement.create({ value: "10" });
  const context: ListContext = {
    listType: "ol",
    index: 2,
    startNumber: 1,
  };
  expect(LiElement.calculateItemNumber(context, element)).toBe(10);
});

test("LiElement.calculateItemNumber: calculates number from index in ol", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 3,
    startNumber: 1,
  };
  expect(LiElement.calculateItemNumber(context, element)).toBe(4);
});

test("LiElement.calculateItemNumber: considers start number in ol", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 2,
    startNumber: 5,
  };
  expect(LiElement.calculateItemNumber(context, element)).toBe(7);
});

test("LiElement.calculateItemNumber: considers reversed order in ol", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 2,
    startNumber: 10,
    reversed: true,
  };
  expect(LiElement.calculateItemNumber(context, element)).toBe(8);
});

test("LiElement.calculateItemNumber: returns default 1 when index is undefined", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
  };
  expect(LiElement.calculateItemNumber(context, element)).toBe(1);
});

// getMarkerText テスト
test("LiElement.getMarkerText: returns bullet for ul context", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ul",
  };
  expect(LiElement.getMarkerText(context, element)).toBe("•");
});

test("LiElement.getMarkerText: returns numeric marker for ol", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 0,
    type: "1",
  };
  expect(LiElement.getMarkerText(context, element)).toBe("1.");
});

test("LiElement.getMarkerText: returns lowercase alpha marker for ol", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 0,
    type: "a",
  };
  expect(LiElement.getMarkerText(context, element)).toBe("a.");
});

test("LiElement.getMarkerText: returns uppercase alpha marker for ol", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 0,
    type: "A",
  };
  expect(LiElement.getMarkerText(context, element)).toBe("A.");
});

test("LiElement.getMarkerText: returns lowercase roman marker for ol", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 0,
    type: "i",
  };
  expect(LiElement.getMarkerText(context, element)).toBe("i.");
});

test("LiElement.getMarkerText: returns uppercase roman marker for ol", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 0,
    type: "I",
  };
  expect(LiElement.getMarkerText(context, element)).toBe("I.");
});

test("LiElement.getMarkerText: prioritizes value attribute", () => {
  const element = LiElement.create({ value: "99" });
  const context: ListContext = {
    listType: "ol",
    index: 0,
    type: "1",
  };
  expect(LiElement.getMarkerText(context, element)).toBe("99.");
});

test("LiElement.getMarkerText: handles multi-digit numbers correctly", () => {
  const element = LiElement.create();
  const context: ListContext = {
    listType: "ol",
    index: 99,
    type: "1",
  };
  expect(LiElement.getMarkerText(context, element)).toBe("100.");
});

// toAlpha テスト
test("LiElement.toAlpha: basic alphabet conversion", () => {
  expect(LiElement.toAlpha(1)).toBe("A");
  expect(LiElement.toAlpha(2)).toBe("B");
  expect(LiElement.toAlpha(26)).toBe("Z");
});

test("LiElement.toAlpha: multi-character alphabet conversion", () => {
  expect(LiElement.toAlpha(27)).toBe("AA");
  expect(LiElement.toAlpha(52)).toBe("AZ");
  expect(LiElement.toAlpha(53)).toBe("BA");
});

test("LiElement.toAlpha: large number alphabet conversion", () => {
  expect(LiElement.toAlpha(702)).toBe("ZZ");
  expect(LiElement.toAlpha(703)).toBe("AAA");
});

// toRoman テスト
test("LiElement.toRoman: basic roman numeral conversion", () => {
  expect(LiElement.toRoman(1)).toBe("I");
  expect(LiElement.toRoman(2)).toBe("II");
  expect(LiElement.toRoman(3)).toBe("III");
  expect(LiElement.toRoman(4)).toBe("IV");
  expect(LiElement.toRoman(5)).toBe("V");
});

test("LiElement.toRoman: tens place roman numeral conversion", () => {
  expect(LiElement.toRoman(9)).toBe("IX");
  expect(LiElement.toRoman(10)).toBe("X");
  expect(LiElement.toRoman(40)).toBe("XL");
  expect(LiElement.toRoman(50)).toBe("L");
  expect(LiElement.toRoman(90)).toBe("XC");
});

test("LiElement.toRoman: hundreds place roman numeral conversion", () => {
  expect(LiElement.toRoman(100)).toBe("C");
  expect(LiElement.toRoman(400)).toBe("CD");
  expect(LiElement.toRoman(500)).toBe("D");
  expect(LiElement.toRoman(900)).toBe("CM");
});

test("LiElement.toRoman: thousands place roman numeral conversion", () => {
  expect(LiElement.toRoman(1000)).toBe("M");
  expect(LiElement.toRoman(2000)).toBe("MM");
  expect(LiElement.toRoman(3000)).toBe("MMM");
});

test("LiElement.toRoman: compound roman numeral conversion", () => {
  expect(LiElement.toRoman(1984)).toBe("MCMLXXXIV");
  expect(LiElement.toRoman(2024)).toBe("MMXXIV");
  expect(LiElement.toRoman(3999)).toBe("MMMCMXCIX");
});
