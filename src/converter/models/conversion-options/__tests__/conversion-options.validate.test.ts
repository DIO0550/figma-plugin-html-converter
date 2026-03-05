import { test, expect } from "vitest";
import { ConversionOptions } from "../conversion-options";
import type { ConversionOptions } from "../conversion-options";

test("有効なオプションがtrueを返す", () => {
  const options = ConversionOptions.getDefault();
  expect(ConversionOptions.validate(options)).toBe(true);
});

test("負のcontainerWidthがfalseを返す", () => {
  const options: ConversionOptions = {
    containerWidth: -100,
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test("負のcontainerHeightがfalseを返す", () => {
  const options: ConversionOptions = {
    containerHeight: -100,
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test("負のspacingがfalseを返す", () => {
  const options: ConversionOptions = {
    spacing: -5,
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test("無効なcolorModeがfalseを返す", () => {
  const options: ConversionOptions = {
    colorMode: "invalid" as ConversionOptions["colorMode"],
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test("ゼロのcontainerWidthがfalseを返す", () => {
  const options: ConversionOptions = {
    containerWidth: 0,
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test("NaNのcontainerWidthがfalseを返す", () => {
  const options: ConversionOptions = {
    containerWidth: NaN,
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test("InfinityのcontainerHeightがfalseを返す", () => {
  const options: ConversionOptions = {
    containerHeight: Infinity,
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test("NaNのspacingがfalseを返す", () => {
  const options: ConversionOptions = {
    spacing: NaN,
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test("Infinityのspacingがfalseを返す", () => {
  const options: ConversionOptions = {
    spacing: Infinity,
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});
