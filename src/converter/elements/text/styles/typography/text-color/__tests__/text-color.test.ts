import { test, expect } from "vitest";
import { TextColor } from "../text-color";
import { TextNodeConfig } from "../../../../../../models/figma-node";

// =============================================================================
// TextColor.create のテスト
// =============================================================================

test("TextColor.create() - RGBA値からTextColorを作成できる", () => {
  // Arrange
  const color = { r: 1, g: 0, b: 0, a: 1 };

  // Act
  const result = TextColor.create(color);

  // Assert
  expect(result).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

test("TextColor.create() - 部分的な値からTextColorを作成できる", () => {
  // Arrange
  const color = { r: 0.5, g: 0.5, b: 0.5, a: 0.5 };

  // Act
  const result = TextColor.create(color);

  // Assert
  expect(result).toEqual({ r: 0.5, g: 0.5, b: 0.5, a: 0.5 });
});

test("TextColor.create() - 0値からTextColorを作成できる", () => {
  // Arrange
  const color = { r: 0, g: 0, b: 0, a: 0 };

  // Act
  const result = TextColor.create(color);

  // Assert
  expect(result).toEqual({ r: 0, g: 0, b: 0, a: 0 });
});

// =============================================================================
// TextColor.parse のテスト
// =============================================================================

test("TextColor.parse() - hex色を処理できる", () => {
  // Act
  const result = TextColor.parse("#FF0000");

  // Assert
  expect(result).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

test("TextColor.parse() - 3桁のhex色を処理できる", () => {
  // Act
  const result = TextColor.parse("#F00");

  // Assert
  expect(result).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

test("TextColor.parse() - rgb形式を処理できる", () => {
  // Act
  const result = TextColor.parse("rgb(255, 0, 0)");

  // Assert
  expect(result).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

test("TextColor.parse() - rgba形式を処理できる（alphaは常に1）", () => {
  // Act
  const result = TextColor.parse("rgba(255, 0, 0, 0.5)");

  // Assert
  // Styles.parseColorはalphaを返さないので、常に1
  expect(result).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

test("TextColor.parse() - 名前付きカラーを処理できる", () => {
  // Act
  const result = TextColor.parse("red");

  // Assert
  expect(result).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

test("TextColor.parse() - 空文字列はnullを返す", () => {
  // Act
  const result = TextColor.parse("");

  // Assert
  expect(result).toBeNull();
});

test("TextColor.parse() - 不正な値はnullを返す", () => {
  // Act
  const result = TextColor.parse("invalid");

  // Assert
  expect(result).toBeNull();
});

test("TextColor.parse() - 黒色を処理できる", () => {
  // Act
  const result = TextColor.parse("#000000");

  // Assert
  expect(result).toEqual({ r: 0, g: 0, b: 0, a: 1 });
});

test("TextColor.parse() - 白色を処理できる", () => {
  // Act
  const result = TextColor.parse("#FFFFFF");

  // Assert
  expect(result).toEqual({ r: 1, g: 1, b: 1, a: 1 });
});

// =============================================================================
// TextColor.default のテスト
// =============================================================================

test("TextColor.default() - デフォルトは黒色", () => {
  // Act
  const result = TextColor.default();

  // Assert
  expect(result).toEqual({ r: 0, g: 0, b: 0, a: 1 });
});

// =============================================================================
// TextColor.toFills のテスト
// =============================================================================

test("TextColor.toFills() - TextColorをFills形式に変換できる", () => {
  // Arrange
  const color = TextColor.create({ r: 1, g: 0, b: 0, a: 1 });

  // Act
  const result = TextColor.toFills(color);

  // Assert
  expect(result).toEqual([
    {
      type: "SOLID",
      color: { r: 1, g: 0, b: 0, a: 1 },
    },
  ]);
});

test("TextColor.toFills() - 透明度を含むColorをFills形式に変換できる", () => {
  // Arrange
  const color = TextColor.create({ r: 0, g: 0, b: 1, a: 0.5 });

  // Act
  const result = TextColor.toFills(color);

  // Assert
  expect(result).toEqual([
    {
      type: "SOLID",
      color: { r: 0, g: 0, b: 1, a: 0.5 },
    },
  ]);
});

// =============================================================================
// TextColor.withAlpha のテスト
// =============================================================================

test("TextColor.withAlpha() - 透明度を設定できる", () => {
  // Arrange
  const color = TextColor.create({ r: 1, g: 0, b: 0, a: 1 });

  // Act
  const result = TextColor.withAlpha(color, 0.5);

  // Assert
  expect(result).toEqual({ r: 1, g: 0, b: 0, a: 0.5 });
});

test("TextColor.withAlpha() - 透明度を0に設定できる", () => {
  // Arrange
  const color = TextColor.create({ r: 1, g: 0, b: 0, a: 1 });

  // Act
  const result = TextColor.withAlpha(color, 0);

  // Assert
  expect(result).toEqual({ r: 1, g: 0, b: 0, a: 0 });
});

test("TextColor.withAlpha() - 透明度を1に設定できる", () => {
  // Arrange
  const color = TextColor.create({ r: 1, g: 0, b: 0, a: 0.5 });

  // Act
  const result = TextColor.withAlpha(color, 1);

  // Assert
  expect(result).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

test("TextColor.withAlpha() - 範囲外の値は0-1にクランプされる", () => {
  // Arrange
  const color = TextColor.create({ r: 1, g: 0, b: 0, a: 1 });

  // Act
  const result1 = TextColor.withAlpha(color, -0.5);
  const result2 = TextColor.withAlpha(color, 1.5);

  // Assert
  expect(result1).toEqual({ r: 1, g: 0, b: 0, a: 0 });
  expect(result2).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

// =============================================================================
// TextColor.extractStyle のテスト
// =============================================================================

test("TextColor.extractStyle() - スタイルから色を抽出できる", () => {
  // Arrange
  const styles = { color: "#FF0000" };

  // Act
  const result = TextColor.extractStyle(styles);

  // Assert
  expect(result).toEqual([
    {
      type: "SOLID",
      color: { r: 1, g: 0, b: 0, a: 1 },
    },
  ]);
});

test("TextColor.extractStyle() - スタイルがない場合はnullを返す", () => {
  // Arrange
  const styles = {};

  // Act
  const result = TextColor.extractStyle(styles);

  // Assert
  expect(result).toBeNull();
});

test("TextColor.extractStyle() - デフォルトカラーを使用できる", () => {
  // Arrange
  const styles = {};
  const defaultColor = { r: 0, g: 0, b: 1, a: 1 };

  // Act
  const result = TextColor.extractStyle(styles, defaultColor);

  // Assert
  expect(result).toEqual([
    {
      type: "SOLID",
      color: { r: 0, g: 0, b: 1, a: 1 },
    },
  ]);
});

test("TextColor.extractStyle() - 不正な値の場合はnullを返す", () => {
  // Arrange
  const styles = { color: "invalid" };

  // Act
  const result = TextColor.extractStyle(styles);

  // Assert
  expect(result).toBeNull();
});

test("TextColor.extractStyle() - 名前付きカラーを処理できる", () => {
  // Arrange
  const styles = { color: "blue" };

  // Act
  const result = TextColor.extractStyle(styles);

  // Assert
  expect(result).toEqual([
    {
      type: "SOLID",
      color: { r: 0, g: 0, b: 1, a: 1 },
    },
  ]);
});

// =============================================================================
// TextColor.applyTo のテスト（deprecated）
// =============================================================================

test("TextColor.applyTo() - configを直接変更する（deprecated）", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { color: "#FF0000" };

  // Act
  TextColor.applyTo(config, styles);

  // Assert
  expect(config.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 1, g: 0, b: 0, a: 1 },
    },
  ]);
});

test("TextColor.applyTo() - スタイルがない場合は変更しない", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const originalFills = config.style.fills;

  // Act
  TextColor.applyTo(config, styles);

  // Assert
  expect(config.style.fills).toBe(originalFills);
});

test("TextColor.applyTo() - デフォルトカラーを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const defaultColor = { r: 0, g: 1, b: 0, a: 1 };

  // Act
  TextColor.applyTo(config, styles, defaultColor);

  // Assert
  expect(config.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 0, g: 1, b: 0, a: 1 },
    },
  ]);
});

// =============================================================================
// TextColor.applyToConfig のテスト
// =============================================================================

test("TextColor.applyToConfig() - hex形式の色を適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { color: "#FF0000" };

  // Act
  const result = TextColor.applyToConfig(config, styles);

  // Assert
  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 1, g: 0, b: 0, a: 1 },
    },
  ]);
  // 元のconfigは変更されていない（イミュータブル）
  expect(config.style.fills).toBeUndefined();
  expect(result).not.toBe(config);
});

test("TextColor.applyToConfig() - rgb形式の色を適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { color: "rgb(0, 128, 255)" };

  // Act
  const result = TextColor.applyToConfig(config, styles);

  // Assert
  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 0, g: 0.5019607843137255, b: 1, a: 1 },
    },
  ]);
});

test("TextColor.applyToConfig() - 名前付きカラーを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { color: "blue" };

  // Act
  const result = TextColor.applyToConfig(config, styles);

  // Assert
  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 0, g: 0, b: 1, a: 1 },
    },
  ]);
});

test("TextColor.applyToConfig() - 短縮hex形式を適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { color: "#0F0" };

  // Act
  const result = TextColor.applyToConfig(config, styles);

  // Assert
  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 0, g: 1, b: 0, a: 1 },
    },
  ]);
});

test("TextColor.applyToConfig() - デフォルトカラーを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};
  const defaultColor = { r: 0.5, g: 0.5, b: 0.5, a: 1 };

  // Act
  const result = TextColor.applyToConfig(config, styles, defaultColor);

  // Assert
  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
    },
  ]);
});

test("TextColor.applyToConfig() - スタイルもデフォルトもない場合は適用しない", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = {};

  // Act
  const result = TextColor.applyToConfig(config, styles);

  // Assert
  expect(result).toBe(config); // 変更なし
  expect(result.style.fills).toBeUndefined();
});

test("TextColor.applyToConfig() - 不正な色の場合は適用しない", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { color: "invalid-color" };

  // Act
  const result = TextColor.applyToConfig(config, styles);

  // Assert
  expect(result).toBe(config); // 変更なし
  expect(result.style.fills).toBeUndefined();
});

test("TextColor.applyToConfig() - configの他のプロパティは保持される", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  config.style.fontSize = 24;
  config.style.fontWeight = 700;
  config.style.textAlign = "CENTER";
  const styles = { color: "#333333" };

  // Act
  const result = TextColor.applyToConfig(config, styles);

  // Assert
  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 0.2, g: 0.2, b: 0.2, a: 1 },
    },
  ]);
  expect(result.style.fontSize).toBe(24);
  expect(result.style.fontWeight).toBe(700);
  expect(result.style.textAlign).toBe("CENTER");
});

test("TextColor.applyToConfig() - 既存のfillsを上書きできる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  config.style.fills = [
    {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0, a: 1 },
    },
  ];
  const styles = { color: "white" };

  // Act
  const result = TextColor.applyToConfig(config, styles);

  // Assert
  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1, a: 1 },
    },
  ]);
  // 元のfillsは変更されない
  expect(config.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0, a: 1 },
    },
  ]);
});

test("TextColor.applyToConfig() - transparentを適用できる", () => {
  // Arrange
  const config = TextNodeConfig.create("テキスト");
  const styles = { color: "transparent" };

  // Act
  const result = TextColor.applyToConfig(config, styles);

  // Assert
  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0, a: 1 }, // transparentは黒として扱われる（alphaは別途処理が必要）
    },
  ]);
});
