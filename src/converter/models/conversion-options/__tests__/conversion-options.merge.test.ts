import { test, expect } from "vitest";
import { ConversionOptions } from "../conversion-options";
import type { ConversionOptions as ConversionOptionsType } from "../conversion-options";

test("ベースオプションとオーバーライドをマージできる", () => {
  const base = ConversionOptions.getDefault();
  const override = {
    containerWidth: 1200,
    colorMode: "hex" as const,
  };

  const merged = ConversionOptions.merge(base, override);

  expect(merged.containerWidth).toBe(1200);
  expect(merged.colorMode).toBe("hex");
  expect(merged.containerHeight).toBe(600);
  expect(merged.spacing).toBe(8);
});

test("空のオーバーライドでベースオプションが保持される", () => {
  const base = ConversionOptions.getDefault();
  const merged = ConversionOptions.merge(base, {});

  expect(merged).toEqual(base);
});

test("複数のオプションをマージできる", () => {
  const options1 = { containerWidth: 1000 };
  const options2 = { containerHeight: 800 };
  const options3 = { colorMode: "hex" as const };

  const merged = ConversionOptions.mergeAll(options1, options2, options3);

  expect(merged.containerWidth).toBe(1000);
  expect(merged.containerHeight).toBe(800);
  expect(merged.colorMode).toBe("hex");
  expect(merged.spacing).toBe(8);
});

test("明示的undefinedを渡した場合にベース値が保持される", () => {
  const base = ConversionOptions.getDefault();
  const override = {
    spacing: undefined,
    containerWidth: undefined,
    containerHeight: undefined,
  };

  const merged = ConversionOptions.merge(base, override);

  expect(merged.spacing).toBe(8);
  expect(merged.containerWidth).toBe(800);
  expect(merged.containerHeight).toBe(600);
});

test("mergeAllで明示的undefinedを渡した場合にデフォルト値が保持される", () => {
  const options1 = { containerWidth: 1000 };
  const options2 = { containerWidth: undefined, spacing: undefined };

  const merged = ConversionOptions.mergeAll(options1, options2);

  expect(merged.containerWidth).toBe(1000);
  expect(merged.spacing).toBe(8);
});

test("nullが渡された場合にベース値が保持される（外部入力のnull混入対策）", () => {
  const base = ConversionOptions.getDefault();
  // 外部入力経由でnullが混入するケースを想定
  const override = {
    spacing: null,
    containerWidth: null,
    containerHeight: null,
  } as unknown as Partial<ConversionOptionsType>;

  const merged = ConversionOptions.merge(base, override);

  expect(merged.spacing).toBe(8);
  expect(merged.containerWidth).toBe(800);
  expect(merged.containerHeight).toBe(600);
});

test("mergeAllでnullが混入してもデフォルト値が保持される", () => {
  const options1 = { containerWidth: 1000 };
  const options2 = {
    containerWidth: null,
    spacing: null,
  } as unknown as Partial<ConversionOptionsType>;

  const merged = ConversionOptions.mergeAll(options1, options2);

  expect(merged.containerWidth).toBe(1000);
  expect(merged.spacing).toBe(8);
});

test("後のオプションが前のオプションを上書きする", () => {
  const options1 = { containerWidth: 1000 };
  const options2 = { containerWidth: 1200 };

  const merged = ConversionOptions.mergeAll(options1, options2);

  expect(merged.containerWidth).toBe(1200);
});
