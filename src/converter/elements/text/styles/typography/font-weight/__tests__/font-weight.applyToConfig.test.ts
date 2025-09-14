import { test, expect } from "vitest";
import { FontWeight } from "../font-weight";
import { TextNodeConfig } from "../../../../../../models/figma-node";

// =============================================================================
// FontWeight.applyToConfig のテスト
// =============================================================================

test("FontWeight.applyToConfig() - スタイルからフォントウェイトを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-weight": "bold" };

  // Act
  const result = FontWeight.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontWeight).toBe(700);
  // 元のconfigは変更されていない（イミュータブル）
  expect(config.style.fontWeight).toBe(400); // デフォルト値
  expect(result).not.toBe(config);
});

test("FontWeight.applyToConfig() - 数値のフォントウェイトを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-weight": "600" };

  // Act
  const result = FontWeight.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontWeight).toBe(600);
});

test("FontWeight.applyToConfig() - normalを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  config.style.fontWeight = 700; // 既存の値
  const styles = { "font-weight": "normal" };

  // Act
  const result = FontWeight.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontWeight).toBe(400);
});

test("FontWeight.applyToConfig() - デフォルト値が400の場合は適用しない", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const defaultWeight = 400;

  // Act
  const result = FontWeight.applyToConfig(config, styles, defaultWeight);

  // Assert
  expect(result).toBe(config); // 変更なし
  expect(result.style.fontWeight).toBe(400); // デフォルト値のまま
});

test("FontWeight.applyToConfig() - デフォルト値が400以外の場合は適用する", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const defaultWeight = 700;

  // Act
  const result = FontWeight.applyToConfig(config, styles, defaultWeight);

  // Assert
  expect(result.style.fontWeight).toBe(700);
});

test("FontWeight.applyToConfig() - 不正な値の場合は適用しない", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-weight": "invalid" };

  // Act
  const result = FontWeight.applyToConfig(config, styles);

  // Assert
  expect(result).toBe(config); // 変更なし
  expect(result.style.fontWeight).toBe(400); // デフォルト値のまま
});

test("FontWeight.applyToConfig() - configの他のプロパティは保持される", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  config.style.fontSize = 24;
  config.style.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0, a: 1 } }];
  const styles = { "font-weight": "500" };

  // Act
  const result = FontWeight.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontWeight).toBe(500);
  expect(result.style.fontSize).toBe(24);
  expect(result.style.fills).toEqual([
    { type: "SOLID", color: { r: 1, g: 0, b: 0, a: 1 } },
  ]);
});

test("FontWeight.applyToConfig() - 名前付きウェイトを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const testCases = [
    { input: "thin", expected: 100 },
    { input: "light", expected: 300 },
    { input: "medium", expected: 500 },
    { input: "semi-bold", expected: 600 },
    { input: "extra-bold", expected: 800 },
    { input: "black", expected: 900 },
  ];

  for (const { input, expected } of testCases) {
    // Act
    const result = FontWeight.applyToConfig(config, {
      "font-weight": input,
    });

    // Assert
    expect(result.style.fontWeight).toBe(expected);
  }
});

test("FontWeight.applyToConfig() - 小数値のウェイトを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-weight": "450.5" };

  // Act
  const result = FontWeight.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontWeight).toBe(450.5);
});
