import { test, expect } from "vitest";
import { ConversionOptions } from "../conversion-options";
import type { ConversionOptions } from "../conversion-options";

test("hasDefaultFontが正しく動作する", () => {
  const withFont: ConversionOptions = {
    defaultFont: { family: "Arial", style: "Bold" },
  };
  const withoutFont: ConversionOptions = {};

  expect(ConversionOptions.hasDefaultFont(withFont)).toBe(true);
  expect(ConversionOptions.hasDefaultFont(withoutFont)).toBe(false);
});

test("hasContainerSizeが正しく動作する", () => {
  const withSize: ConversionOptions = {
    containerWidth: 800,
    containerHeight: 600,
  };
  const withoutSize: ConversionOptions = {
    containerWidth: 800,
  };

  expect(ConversionOptions.hasContainerSize(withSize)).toBe(true);
  expect(ConversionOptions.hasContainerSize(withoutSize)).toBe(false);
});

test("hasContainerSizeがNaNやInfinityでfalseを返す", () => {
  const withNaN: ConversionOptions = {
    containerWidth: NaN,
    containerHeight: 600,
  };
  const withInfinity: ConversionOptions = {
    containerWidth: 800,
    containerHeight: Infinity,
  };

  expect(ConversionOptions.hasContainerSize(withNaN)).toBe(false);
  expect(ConversionOptions.hasContainerSize(withInfinity)).toBe(false);
});

test("hasContainerSizeが0以下でfalseを返す（validateと整合）", () => {
  const withZeroWidth: ConversionOptions = {
    containerWidth: 0,
    containerHeight: 600,
  };
  const withZeroHeight: ConversionOptions = {
    containerWidth: 800,
    containerHeight: 0,
  };
  const withNegative: ConversionOptions = {
    containerWidth: -100,
    containerHeight: 600,
  };

  expect(ConversionOptions.hasContainerSize(withZeroWidth)).toBe(false);
  expect(ConversionOptions.hasContainerSize(withZeroHeight)).toBe(false);
  expect(ConversionOptions.hasContainerSize(withNegative)).toBe(false);
});
