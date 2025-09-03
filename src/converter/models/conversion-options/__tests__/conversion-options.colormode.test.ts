import { test, expect } from "vitest";
import { ConversionOptions } from "../conversion-options";
import type { ConversionOptions } from "../conversion-options";

test("isRGBModeが正しく動作する", () => {
  const rgbOptions: ConversionOptions = { colorMode: "rgb" };
  const hexOptions: ConversionOptions = { colorMode: "hex" };
  const noMode: ConversionOptions = {};

  expect(ConversionOptions.isRGBMode(rgbOptions)).toBe(true);
  expect(ConversionOptions.isRGBMode(hexOptions)).toBe(false);
  expect(ConversionOptions.isRGBMode(noMode)).toBe(false);
});

test("isHexModeが正しく動作する", () => {
  const hexOptions: ConversionOptions = { colorMode: "hex" };
  const rgbOptions: ConversionOptions = { colorMode: "rgb" };
  const noMode: ConversionOptions = {};

  expect(ConversionOptions.isHexMode(hexOptions)).toBe(true);
  expect(ConversionOptions.isHexMode(rgbOptions)).toBe(false);
  expect(ConversionOptions.isHexMode(noMode)).toBe(false);
});
