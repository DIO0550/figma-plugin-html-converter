import { test, expect } from "vitest";
import { ConversionOptions } from "../conversion-options";

test("負の値を正の値に正規化する", () => {
  const options = {
    containerWidth: -800,
    containerHeight: -600,
    spacing: -8,
  };

  const normalized = ConversionOptions.normalize(options);

  expect(normalized.containerWidth).toBe(800);
  expect(normalized.containerHeight).toBe(600);
  expect(normalized.spacing).toBe(8);
});

test("spacing: 0 は正規化で変更されない（0は有効な値）", () => {
  const options = {
    spacing: 0,
  };

  const normalized = ConversionOptions.normalize(options);

  expect(normalized.spacing).toBe(0);
});

test("NaN/Infinityの値がデフォルト値に差し戻される", () => {
  const options = {
    containerWidth: NaN,
    containerHeight: Infinity,
    spacing: NaN,
  };

  const normalized = ConversionOptions.normalize(options);
  const defaults = ConversionOptions.getDefault();

  expect(normalized.containerWidth).toBe(defaults.containerWidth);
  expect(normalized.containerHeight).toBe(defaults.containerHeight);
  expect(normalized.spacing).toBe(defaults.spacing);
});

test("-Infinityの値がデフォルト値に差し戻される", () => {
  const options = {
    spacing: -Infinity,
  };

  const normalized = ConversionOptions.normalize(options);

  expect(normalized.spacing).toBe(ConversionOptions.getDefault().spacing);
});

test("未定義の値にデフォルト値が設定される", () => {
  const options = {
    containerWidth: 1000,
  };

  const normalized = ConversionOptions.normalize(options);

  expect(normalized.containerWidth).toBe(1000);
  expect(normalized.containerHeight).toBe(600);
  expect(normalized.defaultFont).toEqual({ family: "Inter", style: "Regular" });
});
