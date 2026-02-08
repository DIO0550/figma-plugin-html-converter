import { test, expect } from "vitest";

test("common/index.ts - Typography関連コンポーネント - 正しくexportされている", async () => {
  const commonExports = await import("../index");

  // Typography系
  expect(commonExports.FontFamily).toBeDefined();
  expect(commonExports.FontSize).toBeDefined();
  expect(commonExports.FontWeight).toBeDefined();
  expect(commonExports.FontStyle).toBeDefined();
  expect(commonExports.LineHeight).toBeDefined();
  expect(commonExports.TextAlign).toBeDefined();
  expect(commonExports.TextColor).toBeDefined();

  // Spacing系
  expect(commonExports.LetterSpacing).toBeDefined();

  // Decoration系
  expect(commonExports.TextDecoration).toBeDefined();
  expect(commonExports.TextTransform).toBeDefined();

  // Layout系
  expect(commonExports.VerticalAlign).toBeDefined();
  expect(commonExports.TextDirection).toBeDefined();

  // Typography統合オブジェクト
  expect(commonExports.Typography).toBeDefined();
});

test("common/index.ts - exportされたコンポーネント - 正しく動作する", async () => {
  const { FontSize } = await import("../index");

  const fontSize = FontSize.parse("16px");
  expect(fontSize).toBeDefined();
});
