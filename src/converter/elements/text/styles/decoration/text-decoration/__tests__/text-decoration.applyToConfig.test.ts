import { test, expect } from "vitest";
import { TextDecoration } from "../text-decoration";
import type { TextNodeConfig } from "../../../../../../models/figma-node";

test("TextDecoration.applyToConfig - UNDERLINEを適用する場合 - configにUNDERLINEが設定される", () => {
  const config = { style: {} } as TextNodeConfig;
  const decoration = TextDecoration.create("UNDERLINE");
  const result = TextDecoration.applyToConfig(config, decoration);

  expect(result.style.textDecoration).toBe("UNDERLINE");
  expect(result).not.toBe(config); // should return new object (immutable)
  expect(config.style.textDecoration).toBeUndefined(); // original should not be modified
});

test("TextDecoration.applyToConfig - STRIKETHROUGHを適用する場合 - configにSTRIKETHROUGHが設定される", () => {
  const config = { style: {} } as TextNodeConfig;
  const decoration = TextDecoration.create("STRIKETHROUGH");
  const result = TextDecoration.applyToConfig(config, decoration);

  expect(result.style.textDecoration).toBe("STRIKETHROUGH");
});

test("TextDecoration.applyToConfig - decorationがundefinedの場合 - configを変更しない", () => {
  const config = { style: {} } as TextNodeConfig;
  const result = TextDecoration.applyToConfig(config, undefined);

  expect(result.style.textDecoration).toBeUndefined();
  expect(result).toBe(config);
});

test("TextDecoration.applyToConfig - 既存のdecorationがある場合 - 新しい値で上書きする", () => {
  const config = {
    style: { textDecoration: "UNDERLINE" },
  } as TextNodeConfig;
  const decoration = TextDecoration.create("STRIKETHROUGH");
  const result = TextDecoration.applyToConfig(config, decoration);

  expect(result.style.textDecoration).toBe("STRIKETHROUGH");
});
