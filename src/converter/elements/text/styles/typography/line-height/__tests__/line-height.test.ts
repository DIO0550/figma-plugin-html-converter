import { test, expect } from "vitest";
import { LineHeight } from "../line-height";
import { TextNodeConfig } from "../../../../../../models/figma-node";

// =============================================================================
// LineHeight.create のテスト
// =============================================================================

test("LineHeight.create() - 整数値からLineHeightを作成できる", () => {
  // Act
  const result = LineHeight.create(24);

  // Assert
  expect(result).toBe(24);
});

test("LineHeight.create() - 小数値からLineHeightを作成できる", () => {
  // Act
  const result = LineHeight.create(24.5);

  // Assert
  expect(result).toBe(24.5);
});

test("LineHeight.create() - 0値からLineHeightを作成できる", () => {
  // Act
  const result = LineHeight.create(0);

  // Assert
  expect(result).toBe(0);
});

test("LineHeight.create() - 負の値からLineHeightを作成できる", () => {
  // Act
  const result = LineHeight.create(-10);

  // Assert
  expect(result).toBe(-10);
});

// =============================================================================
// LineHeight.parse のテスト
// =============================================================================

test("LineHeight.parse() - normalを1.2倍として処理できる", () => {
  // Act
  const result = LineHeight.parse("normal", 16);

  // Assert
  expect(result).toBe(19.2); // 16 * 1.2
});

test("LineHeight.parse() - 数値のみを倍率として処理できる", () => {
  // Act
  const result = LineHeight.parse("1.5", 20);

  // Assert
  expect(result).toBe(30); // 20 * 1.5
});

test("LineHeight.parse() - 0を倍率として処理できる", () => {
  // Act
  const result = LineHeight.parse("0", 16);

  // Assert
  expect(result).toBe(0);
});

test("LineHeight.parse() - px単位の値を処理できる", () => {
  // Act
  const result = LineHeight.parse("24px", 16);

  // Assert
  expect(result).toBe(24);
});

test("LineHeight.parse() - 0pxを処理できない（0以下は無効）", () => {
  // Act
  const result = LineHeight.parse("0px", 16);

  // Assert
  expect(result).toBeNull();
});

test("LineHeight.parse() - 負のpx値を処理できない", () => {
  // Act
  const result = LineHeight.parse("-10px", 16);

  // Assert
  expect(result).toBeNull();
});

test("LineHeight.parse() - em単位の値を処理できる", () => {
  // Act
  const result = LineHeight.parse("2em", 16);

  // Assert
  expect(result).toBe(32); // 16 * 2
});

test("LineHeight.parse() - 0emを処理できない", () => {
  // Act
  const result = LineHeight.parse("0em", 16);

  // Assert
  expect(result).toBeNull();
});

test("LineHeight.parse() - パーセント値を処理できる", () => {
  // Act
  const result = LineHeight.parse("150%", 20);

  // Assert
  expect(result).toBe(30); // 20 * 1.5
});

test("LineHeight.parse() - 0%を処理できない", () => {
  // Act
  const result = LineHeight.parse("0%", 16);

  // Assert
  expect(result).toBeNull();
});

test("LineHeight.parse() - 空文字列はnullを返す", () => {
  // Act
  const result = LineHeight.parse("", 16);

  // Assert
  expect(result).toBeNull();
});

test("LineHeight.parse() - 不正な値はnullを返す", () => {
  // Act
  const result = LineHeight.parse("invalid", 16);

  // Assert
  expect(result).toBeNull();
});

test("LineHeight.parse() - 前後の空白を無視する", () => {
  // Act
  const result = LineHeight.parse("  24px  ", 16);

  // Assert
  expect(result).toBe(24);
});

test("LineHeight.parse() - 小数のem値を処理できる", () => {
  // Act
  const result = LineHeight.parse("1.75em", 16);

  // Assert
  expect(result).toBe(28); // 16 * 1.75
});

test("LineHeight.parse() - 小数のパーセント値を処理できる", () => {
  // Act
  const result = LineHeight.parse("125.5%", 20);

  // Assert
  expect(result).toBeCloseTo(25.1, 5); // 20 * 1.255
});

// =============================================================================
// LineHeight.calculateDefault のテスト
// =============================================================================

test("LineHeight.calculateDefault() - デフォルト倍率1.5を使用", () => {
  // Act
  const result = LineHeight.calculateDefault(16);

  // Assert
  expect(result).toBe(24); // 16 * 1.5
});

test("LineHeight.calculateDefault() - カスタム倍率を使用できる", () => {
  // Act
  const result = LineHeight.calculateDefault(20, 2);

  // Assert
  expect(result).toBe(40); // 20 * 2
});

test("LineHeight.calculateDefault() - 0のフォントサイズを処理できる", () => {
  // Act
  const result = LineHeight.calculateDefault(0, 1.5);

  // Assert
  expect(result).toBe(0);
});

test("LineHeight.calculateDefault() - 負の倍率を処理できる", () => {
  // Act
  const result = LineHeight.calculateDefault(16, -1);

  // Assert
  expect(result).toBe(-16);
});

// =============================================================================
// LineHeight.extractStyle のテスト
// =============================================================================

test("LineHeight.extractStyle() - スタイルから行高を抽出できる", () => {
  // Arrange
  const styles = { "line-height": "24px" };

  // Act
  const result = LineHeight.extractStyle(styles, 16);

  // Assert
  expect(result).toBe(24);
});

test("LineHeight.extractStyle() - スタイルがない場合はデフォルト値を使用", () => {
  // Arrange
  const styles = {};

  // Act
  const result = LineHeight.extractStyle(styles, 16);

  // Assert
  expect(result).toBe(24); // 16 * 1.5 (default)
});

test("LineHeight.extractStyle() - カスタムデフォルト倍率を使用できる", () => {
  // Arrange
  const styles = {};

  // Act
  const result = LineHeight.extractStyle(styles, 16, 2);

  // Assert
  expect(result).toBe(32); // 16 * 2
});

test("LineHeight.extractStyle() - 不正な値の場合はデフォルト値を使用", () => {
  // Arrange
  const styles = { "line-height": "invalid" };

  // Act
  const result = LineHeight.extractStyle(styles, 16);

  // Assert
  expect(result).toBe(24); // 16 * 1.5 (default)
});

test("LineHeight.extractStyle() - normalを処理できる", () => {
  // Arrange
  const styles = { "line-height": "normal" };

  // Act
  const result = LineHeight.extractStyle(styles, 20);

  // Assert
  expect(result).toBe(24); // 20 * 1.2
});

// =============================================================================
// LineHeight.applyTo のテスト（deprecated）
// =============================================================================

test("LineHeight.applyTo() - configを直接変更する（deprecated）", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "line-height": "32px" };
  const originalValue = config.style.lineHeight.value;

  // Act
  LineHeight.applyTo(config, styles, 16);

  // Assert
  expect(config.style.lineHeight.value).toBe(32);
  expect(originalValue).not.toBe(32);
});

test("LineHeight.applyTo() - デフォルト倍率を使用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};

  // Act
  LineHeight.applyTo(config, styles, 20, 2);

  // Assert
  expect(config.style.lineHeight.value).toBe(40); // 20 * 2
});

// =============================================================================
// LineHeight.applyToConfig のテスト
// =============================================================================

test("LineHeight.applyToConfig() - px単位の行高を適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "line-height": "24px" };
  const fontSize = 16;

  // Act
  const result = LineHeight.applyToConfig(config, styles, fontSize);

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 24,
  });
  // 元のconfigは変更されていない（イミュータブル）
  expect(config).not.toBe(result);
});

test("LineHeight.applyToConfig() - 倍率として数値のみを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "line-height": "1.5" };
  const fontSize = 20;

  // Act
  const result = LineHeight.applyToConfig(config, styles, fontSize);

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 30, // 20 * 1.5
  });
});

test("LineHeight.applyToConfig() - normalを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "line-height": "normal" };
  const fontSize = 16;

  // Act
  const result = LineHeight.applyToConfig(config, styles, fontSize);

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 19.2, // 16 * 1.2
  });
});

test("LineHeight.applyToConfig() - em単位を適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "line-height": "2em" };
  const fontSize = 16;

  // Act
  const result = LineHeight.applyToConfig(config, styles, fontSize);

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 32, // 16 * 2
  });
});

test("LineHeight.applyToConfig() - パーセント単位を適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "line-height": "150%" };
  const fontSize = 20;

  // Act
  const result = LineHeight.applyToConfig(config, styles, fontSize);

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 30, // 20 * 1.5
  });
});

test("LineHeight.applyToConfig() - デフォルトの倍率を使用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const fontSize = 16;
  const defaultMultiplier = 1.8;

  // Act
  const result = LineHeight.applyToConfig(
    config,
    styles,
    fontSize,
    defaultMultiplier,
  );

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 28.8, // 16 * 1.8
  });
});

test("LineHeight.applyToConfig() - 不正な値の場合はデフォルト値を使用", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "line-height": "invalid" };
  const fontSize = 16;

  // Act
  const result = LineHeight.applyToConfig(config, styles, fontSize);

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 24, // 16 * 1.5 (デフォルト)
  });
});

test("LineHeight.applyToConfig() - configの他のプロパティは保持される", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  config.style.fontSize = 24;
  config.style.fontWeight = 700;
  const styles = { "line-height": "32px" };
  const fontSize = 16;

  // Act
  const result = LineHeight.applyToConfig(config, styles, fontSize);

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 32,
  });
  expect(result.style.fontSize).toBe(24);
  expect(result.style.fontWeight).toBe(700);
});

test("LineHeight.applyToConfig() - ゼロ値を処理できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "line-height": "0" };
  const fontSize = 16;

  // Act
  const result = LineHeight.applyToConfig(config, styles, fontSize);

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 0,
  });
});

test("LineHeight.applyToConfig() - 小数値を正しく処理できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "line-height": "1.75" };
  const fontSize = 16;

  // Act
  const result = LineHeight.applyToConfig(config, styles, fontSize);

  // Assert
  expect(result.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 28, // 16 * 1.75
  });
});
