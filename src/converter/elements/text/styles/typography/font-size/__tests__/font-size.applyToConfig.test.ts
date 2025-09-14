import { test, expect } from "vitest";
import { FontSize } from "../font-size";
import { TextNodeConfig } from "../../../../../../models/figma-node";

// =============================================================================
// FontSize.applyToConfig のテスト
// =============================================================================

test("FontSize.applyToConfig() - スタイルからフォントサイズを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-size": "24px" };

  // Act
  const result = FontSize.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontSize).toBe(24);
  // 元のconfigは変更されていない（イミュータブル）
  expect(config.style.fontSize).toBe(16);
  expect(result).not.toBe(config);
});

test("FontSize.applyToConfig() - デフォルト値を使用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const defaultSize = 20;

  // Act
  const result = FontSize.applyToConfig(config, styles, defaultSize);

  // Assert
  expect(result.style.fontSize).toBe(20);
});

test("FontSize.applyToConfig() - em単位を処理できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-size": "1.5em" };

  // Act
  const result = FontSize.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontSize).toBe(24); // 16 * 1.5
});

test("FontSize.applyToConfig() - rem単位を処理できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-size": "2rem" };

  // Act
  const result = FontSize.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontSize).toBe(32); // 16 * 2
});

test("FontSize.applyToConfig() - 不正な値の場合はデフォルト値を使用", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-size": "invalid" };

  // Act
  const result = FontSize.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontSize).toBe(16);
});

test("FontSize.applyToConfig() - configの他のプロパティは保持される", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  config.style.fontWeight = 700;
  config.style.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0, a: 1 } }];
  const styles = { "font-size": "20px" };

  // Act
  const result = FontSize.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontSize).toBe(20);
  expect(result.style.fontWeight).toBe(700);
  expect(result.style.fills).toEqual([
    { type: "SOLID", color: { r: 1, g: 0, b: 0, a: 1 } },
  ]);
});

test("FontSize.applyToConfig() - 小数値を正しく処理できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-size": "16.5px" };

  // Act
  const result = FontSize.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontSize).toBe(16.5);
});

test("FontSize.applyToConfig() - ゼロ値を処理できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "font-size": "0px" };

  // Act
  const result = FontSize.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontSize).toBe(0);
});
