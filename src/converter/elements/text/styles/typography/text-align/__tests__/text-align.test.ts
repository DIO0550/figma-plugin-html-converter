import { test, expect } from "vitest";
import { TextAlign } from "../text-align";
import { TextNodeConfig } from "../../../../../../models/figma-node";

// =============================================================================
// TextAlign.create のテスト
// =============================================================================

test("TextAlign.create() - LEFTを作成できる", () => {
  // Act
  const result = TextAlign.create("LEFT");

  // Assert
  expect(result).toBe("LEFT");
});

test("TextAlign.create() - CENTERを作成できる", () => {
  // Act
  const result = TextAlign.create("CENTER");

  // Assert
  expect(result).toBe("CENTER");
});

test("TextAlign.create() - RIGHTを作成できる", () => {
  // Act
  const result = TextAlign.create("RIGHT");

  // Assert
  expect(result).toBe("RIGHT");
});

test("TextAlign.create() - JUSTIFYを作成できる", () => {
  // Act
  const result = TextAlign.create("JUSTIFY");

  // Assert
  expect(result).toBe("JUSTIFY");
});

// =============================================================================
// TextAlign.parse のテスト
// =============================================================================

test("TextAlign.parse() - leftをLEFTとして処理できる", () => {
  // Act
  const result = TextAlign.parse("left");

  // Assert
  expect(result).toBe("LEFT");
});

test("TextAlign.parse() - centerをCENTERとして処理できる", () => {
  // Act
  const result = TextAlign.parse("center");

  // Assert
  expect(result).toBe("CENTER");
});

test("TextAlign.parse() - rightをRIGHTとして処理できる", () => {
  // Act
  const result = TextAlign.parse("right");

  // Assert
  expect(result).toBe("RIGHT");
});

test("TextAlign.parse() - justifyをJUSTIFYとして処理できる", () => {
  // Act
  const result = TextAlign.parse("justify");

  // Assert
  expect(result).toBe("JUSTIFY");
});

test("TextAlign.parse() - startをLEFTにマッピング", () => {
  // Act
  const result = TextAlign.parse("start");

  // Assert
  expect(result).toBe("LEFT");
});

test("TextAlign.parse() - endをRIGHTにマッピング", () => {
  // Act
  const result = TextAlign.parse("end");

  // Assert
  expect(result).toBe("RIGHT");
});

test("TextAlign.parse() - 大文字小文字を無視する", () => {
  // Act
  const result1 = TextAlign.parse("CENTER");
  const result2 = TextAlign.parse("Center");
  const result3 = TextAlign.parse("cEnTeR");

  // Assert
  expect(result1).toBe("CENTER");
  expect(result2).toBe("CENTER");
  expect(result3).toBe("CENTER");
});

test("TextAlign.parse() - 前後の空白を無視する", () => {
  // Act
  const result = TextAlign.parse("  center  ");

  // Assert
  expect(result).toBe("CENTER");
});

test("TextAlign.parse() - 空文字列はnullを返す", () => {
  // Act
  const result = TextAlign.parse("");

  // Assert
  expect(result).toBeNull();
});

test("TextAlign.parse() - 不正な値はnullを返す", () => {
  // Act
  const result = TextAlign.parse("invalid");

  // Assert
  expect(result).toBeNull();
});

// =============================================================================
// TextAlign.default のテスト
// =============================================================================

test("TextAlign.default() - デフォルトはLEFT", () => {
  // Act
  const result = TextAlign.default();

  // Assert
  expect(result).toBe("LEFT");
});

// =============================================================================
// TextAlign.isCenter のテスト
// =============================================================================

test("TextAlign.isCenter() - CENTERをtrueと判定", () => {
  // Arrange
  const center = TextAlign.create("CENTER");

  // Act
  const result = TextAlign.isCenter(center);

  // Assert
  expect(result).toBe(true);
});

test("TextAlign.isCenter() - CENTER以外をfalseと判定", () => {
  // Arrange
  const left = TextAlign.create("LEFT");
  const right = TextAlign.create("RIGHT");
  const justify = TextAlign.create("JUSTIFY");

  // Act & Assert
  expect(TextAlign.isCenter(left)).toBe(false);
  expect(TextAlign.isCenter(right)).toBe(false);
  expect(TextAlign.isCenter(justify)).toBe(false);
});

// =============================================================================
// TextAlign.isRight のテスト
// =============================================================================

test("TextAlign.isRight() - RIGHTをtrueと判定", () => {
  // Arrange
  const right = TextAlign.create("RIGHT");

  // Act
  const result = TextAlign.isRight(right);

  // Assert
  expect(result).toBe(true);
});

test("TextAlign.isRight() - RIGHT以外をfalseと判定", () => {
  // Arrange
  const left = TextAlign.create("LEFT");
  const center = TextAlign.create("CENTER");
  const justify = TextAlign.create("JUSTIFY");

  // Act & Assert
  expect(TextAlign.isRight(left)).toBe(false);
  expect(TextAlign.isRight(center)).toBe(false);
  expect(TextAlign.isRight(justify)).toBe(false);
});

// =============================================================================
// TextAlign.isJustify のテスト
// =============================================================================

test("TextAlign.isJustify() - JUSTIFYをtrueと判定", () => {
  // Arrange
  const justify = TextAlign.create("JUSTIFY");

  // Act
  const result = TextAlign.isJustify(justify);

  // Assert
  expect(result).toBe(true);
});

test("TextAlign.isJustify() - JUSTIFY以外をfalseと判定", () => {
  // Arrange
  const left = TextAlign.create("LEFT");
  const center = TextAlign.create("CENTER");
  const right = TextAlign.create("RIGHT");

  // Act & Assert
  expect(TextAlign.isJustify(left)).toBe(false);
  expect(TextAlign.isJustify(center)).toBe(false);
  expect(TextAlign.isJustify(right)).toBe(false);
});

// =============================================================================
// TextAlign.extractStyle のテスト
// =============================================================================

test("TextAlign.extractStyle() - スタイルから配置を抽出できる", () => {
  // Arrange
  const styles = { "text-align": "center" };

  // Act
  const result = TextAlign.extractStyle(styles);

  // Assert
  expect(result).toBe("CENTER");
});

test("TextAlign.extractStyle() - デフォルトがLEFTの場合はnullを返す", () => {
  // Arrange
  const styles = {};

  // Act
  const result = TextAlign.extractStyle(styles, "LEFT");

  // Assert
  expect(result).toBeNull();
});

test("TextAlign.extractStyle() - デフォルトがLEFT以外の場合は値を返す", () => {
  // Arrange
  const styles = {};

  // Act
  const result = TextAlign.extractStyle(styles, "CENTER");

  // Assert
  expect(result).toBe("CENTER");
});

test("TextAlign.extractStyle() - 不正な値の場合はnullを返す", () => {
  // Arrange
  const styles = { "text-align": "invalid" };

  // Act
  const result = TextAlign.extractStyle(styles);

  // Assert
  expect(result).toBeNull();
});

// =============================================================================
// TextAlign.applyTo のテスト（deprecated）
// =============================================================================

test("TextAlign.applyTo() - configを直接変更する（deprecated）", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "text-align": "center" };

  // Act
  TextAlign.applyTo(config, styles);

  // Assert
  expect(config.style.textAlign).toBe("CENTER");
});

test("TextAlign.applyTo() - デフォルトLEFTでスタイルなしの場合は変更しない", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const originalAlign = config.style.textAlign;

  // Act
  TextAlign.applyTo(config, styles, "LEFT");

  // Assert
  expect(config.style.textAlign).toBe(originalAlign);
});

test("TextAlign.applyTo() - カスタムデフォルトを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};

  // Act
  TextAlign.applyTo(config, styles, "RIGHT");

  // Assert
  expect(config.style.textAlign).toBe("RIGHT");
});

// =============================================================================
// TextAlign.applyToConfig のテスト
// =============================================================================

test("TextAlign.applyToConfig() - leftを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "text-align": "left" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result.style.textAlign).toBe("LEFT");
  // 元のconfigは変更されていない（イミュータブル）
  expect(config.style.textAlign).toBe("LEFT"); // デフォルト値
  expect(result).not.toBe(config);
});

test("TextAlign.applyToConfig() - centerを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "text-align": "center" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result.style.textAlign).toBe("CENTER");
});

test("TextAlign.applyToConfig() - rightを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "text-align": "right" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result.style.textAlign).toBe("RIGHT");
});

test("TextAlign.applyToConfig() - justifyを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "text-align": "justify" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result.style.textAlign).toBe("JUSTIFY");
});

test("TextAlign.applyToConfig() - 大文字小文字を無視する", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "text-align": "CENTER" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result.style.textAlign).toBe("CENTER");
});

test("TextAlign.applyToConfig() - デフォルト値がLEFTの場合は適用しない", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const defaultAlign = "LEFT";

  // Act
  const result = TextAlign.applyToConfig(config, styles, defaultAlign);

  // Assert
  expect(result).toBe(config); // 変更なし
  expect(result.style.textAlign).toBe("LEFT"); // デフォルト値のまま
});

test("TextAlign.applyToConfig() - デフォルト値がLEFT以外の場合は適用する", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const defaultAlign = "CENTER";

  // Act
  const result = TextAlign.applyToConfig(config, styles, defaultAlign);

  // Assert
  expect(result.style.textAlign).toBe("CENTER");
});

test("TextAlign.applyToConfig() - startをLEFTにマッピング", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "text-align": "start" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result.style.textAlign).toBe("LEFT");
});

test("TextAlign.applyToConfig() - endをRIGHTにマッピング", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "text-align": "end" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result.style.textAlign).toBe("RIGHT");
});

test("TextAlign.applyToConfig() - 不正な値の場合は適用しない", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { "text-align": "invalid" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result).toBe(config); // 変更なし
  expect(result.style.textAlign).toBe("LEFT"); // デフォルト値のまま
});

test("TextAlign.applyToConfig() - configの他のプロパティは保持される", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  config.style.fontSize = 24;
  config.style.fontWeight = 700;
  config.style.lineHeight = { unit: "PIXELS", value: 32 };
  const styles = { "text-align": "right" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result.style.textAlign).toBe("RIGHT");
  expect(result.style.fontSize).toBe(24);
  expect(result.style.fontWeight).toBe(700);
  expect(result.style.lineHeight).toEqual({ unit: "PIXELS", value: 32 });
});

test("TextAlign.applyToConfig() - 既存の値を上書きできる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  config.style.textAlign = "LEFT";
  const styles = { "text-align": "center" };

  // Act
  const result = TextAlign.applyToConfig(config, styles);

  // Assert
  expect(result.style.textAlign).toBe("CENTER");
  expect(config.style.textAlign).toBe("LEFT"); // 元は変更されない
});
