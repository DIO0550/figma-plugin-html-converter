import { test, expect } from "vitest";
import { ConversionOptions } from "../conversion-options";

test("部分的なオプションから完全なオプションを作成する", () => {
  const defaults = ConversionOptions.getDefault();
  const partial = {
    containerWidth: 1200,
  };

  const options = ConversionOptions.from(partial);

  expect(options.containerWidth).toBe(1200);
  expect(options.containerHeight).toBe(defaults.containerHeight);
  expect(options.spacing).toBe(defaults.spacing);
  expect(options.colorMode).toBe(defaults.colorMode);
});

test("空のオブジェクトからデフォルトオプションを作成する", () => {
  const options = ConversionOptions.from();

  expect(options).toEqual(ConversionOptions.getDefault());
});

test("負の値が正規化される", () => {
  const partial = {
    containerWidth: -1000,
    spacing: -10,
  };

  const options = ConversionOptions.from(partial);
  const defaults = ConversionOptions.getDefault();

  // containerWidth: 0以下はデフォルト値に差し戻される
  expect(options.containerWidth).toBe(defaults.containerWidth);
  // spacing: 負の値は絶対値に正規化される
  expect(options.spacing).toBe(10);
});
