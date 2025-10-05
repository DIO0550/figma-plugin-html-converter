import { describe, test, expect } from "vitest";

/**
 * common/index.tsのexportをテスト
 * Typography関連の全コンポーネントが正しくexportされているか確認
 */
describe("common/index.ts exports", () => {
  test("Typography関連のコンポーネントをexportする", async () => {
    // インポートできることを確認
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

  test("exportされたコンポーネントが正しく動作する", async () => {
    const { FontSize } = await import("../index");

    // FontSizeの基本的な機能をテスト
    const fontSize = FontSize.parse("16px");
    expect(fontSize).toBeDefined();
  });
});
