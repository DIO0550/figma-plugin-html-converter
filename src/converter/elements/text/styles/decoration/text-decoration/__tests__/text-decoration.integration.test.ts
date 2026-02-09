import { test, expect } from "vitest";
import { TextDecoration } from "../text-decoration";
import type { TextNodeConfig } from "../../../../../../models/figma-node";

type StyleObject = Record<string, unknown>;

test("TextDecoration統合 - underlineスタイルを抽出してconfigに適用する場合 - UNDERLINEが設定される", () => {
  const style: StyleObject = { textDecoration: "underline" };
  const config = { style: {} } as TextNodeConfig;

  const decoration = TextDecoration.extractStyle(style);
  const result = TextDecoration.applyToConfig(config, decoration);

  expect(result.style.textDecoration).toBe("UNDERLINE");
});

test("TextDecoration統合 - line-throughスタイルを抽出してconfigに適用する場合 - STRIKETHROUGHが設定される", () => {
  const style: StyleObject = { "text-decoration": "line-through" };
  const config = { style: {} } as TextNodeConfig;

  const decoration = TextDecoration.extractStyle(style);
  const result = TextDecoration.applyToConfig(config, decoration);

  expect(result.style.textDecoration).toBe("STRIKETHROUGH");
});

test("TextDecoration統合 - noneの場合 - removeFromConfigで明示的に削除される", () => {
  const style: StyleObject = { textDecoration: "none" };
  const config = {
    style: { textDecoration: "UNDERLINE" },
  } as TextNodeConfig;

  const decoration = TextDecoration.extractStyle(style);
  // extractStyleがundefinedを返した場合、noneかどうかを別途チェックして
  // removeFromConfigを呼び出す必要がある（Typographyモジュールで行う）
  expect(decoration).toBeUndefined();

  // removeFromConfigで明示的に削除
  const result = TextDecoration.removeFromConfig(config);
  expect(result.style.textDecoration).toBeUndefined();
});

test("TextDecoration統合 - サポートされていない値の場合 - 既存のdecorationを維持する", () => {
  const style: StyleObject = { textDecoration: "overline" }; // サポートされていない値
  const config = {
    style: { textDecoration: "UNDERLINE" },
  } as TextNodeConfig;

  const decoration = TextDecoration.extractStyle(style);
  expect(decoration).toBeUndefined();

  // applyToConfigはundefinedの場合に既存の設定を維持
  const result = TextDecoration.applyToConfig(config, decoration);
  expect(result.style.textDecoration).toBe("UNDERLINE");
});
