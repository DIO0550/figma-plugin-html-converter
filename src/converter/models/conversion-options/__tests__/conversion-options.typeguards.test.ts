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
