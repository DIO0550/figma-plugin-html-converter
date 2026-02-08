import { test, expect } from "vitest";
import { TextTransform } from "../text-transform";
import type { TextNodeConfig } from "../../../../../../models/figma-node";

type StyleObject = Record<string, unknown>;

test("TextTransform統合 - スタイルからuppercaseを抽出してconfigに適用した場合 - textCaseにUPPERCASEが設定される", () => {
  const style: StyleObject = { textTransform: "uppercase" };
  const config = { style: {} } as TextNodeConfig;

  const transform = TextTransform.extractStyle(style);
  const result = TextTransform.applyToConfig(config, transform);

  expect(result.style.textCase).toBe("UPPERCASE");
});

test("TextTransform統合 - ケバブケースでlowercaseを抽出してconfigに適用した場合 - textCaseにLOWERCASEが設定される", () => {
  const style: StyleObject = { "text-transform": "lowercase" };
  const config = { style: {} } as TextNodeConfig;

  const transform = TextTransform.extractStyle(style);
  const result = TextTransform.applyToConfig(config, transform);

  expect(result.style.textCase).toBe("LOWERCASE");
});

test("TextTransform統合 - noneを抽出して既存のtextCaseがあるconfigに適用した場合 - textCaseにORIGINALが設定される", () => {
  const style: StyleObject = { textTransform: "none" };
  const config = { style: { textCase: "UPPERCASE" } } as TextNodeConfig;

  const transform = TextTransform.extractStyle(style);
  const result = TextTransform.applyToConfig(config, transform);

  expect(result.style.textCase).toBe("ORIGINAL");
});
