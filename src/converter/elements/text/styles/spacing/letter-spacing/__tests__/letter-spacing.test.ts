import { test, expect } from "vitest";
import { LetterSpacing } from "../letter-spacing";
import type { TextNodeConfig } from "../../../../../../models/figma-node";

function createMockTextNodeConfig(
  fontSize: number = 16,
  overrides: Partial<TextNodeConfig["style"]> = {},
): TextNodeConfig {
  return {
    type: "TEXT",
    name: "Text",
    content: "Sample text",
    style: {
      fontFamily: "Arial",
      fontSize,
      fontWeight: 400,
      lineHeight: {
        unit: "PIXELS",
        value: fontSize * 1.5,
      },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "TOP",
      ...overrides,
    },
  };
}

test("LetterSpacing.create() - 正の数値からLetterSpacingを作成", () => {
  const result = LetterSpacing.create(2);
  expect(result).toBe(2);
});

test("LetterSpacing.create() - ゼロからLetterSpacingを作成", () => {
  const result = LetterSpacing.create(0);
  expect(result).toBe(0);
});

test("LetterSpacing.create() - 負の数値からLetterSpacingを作成", () => {
  const result = LetterSpacing.create(-1);
  expect(result).toBe(-1);
});

test("LetterSpacing.create() - 小数値からLetterSpacingを作成", () => {
  const result = LetterSpacing.create(0.5);
  expect(result).toBe(0.5);
});

test("LetterSpacing.parse() - 'normal'を0として解析", () => {
  const result = LetterSpacing.parse("normal");
  expect(result).toBe(0);
});

test("LetterSpacing.parse() - 'NORMAL'を0として解析（大文字小文字を無視）", () => {
  const result = LetterSpacing.parse("NORMAL");
  expect(result).toBe(0);
});

test.each([
  ["2px", 2],
  ["-1px", -1],
  ["0.5px", 0.5],
  ["0px", 0],
  ["  1.5px  ", 1.5],
  ["999px", 999],
  ["0.001px", 0.001],
])("LetterSpacing.parse() - px値 '%s' を %d として解析", (input, expected) => {
  const result = LetterSpacing.parse(input);
  expect(result).toBe(expected);
});

test.each([
  ["0.1em", 16, 1.6],
  ["-0.05em", 20, -1],
  ["0em", 16, 0],
  ["0.25em", 10, 2.5],
])(
  "LetterSpacing.parse() - em値 '%s' を fontSize=%d で %d として解析",
  (input, fontSize, expected) => {
    const result = LetterSpacing.parse(input, fontSize);
    expect(result).toBe(expected);
  },
);

test("LetterSpacing.parse() - fontSizeなしのem値はnullを返す", () => {
  const result = LetterSpacing.parse("0.1em");
  expect(result).toBeNull();
});

test.each([
  ["0.125rem", undefined, 16, 2], // デフォルトベース
  ["-0.0625rem", undefined, 16, -1], // 負の値
  ["0.2rem", undefined, 20, 4], // カスタムベース
])(
  "LetterSpacing.parse() - rem値 '%s' をベース=%d で %d として解析",
  (input, fontSize, base, expected) => {
    const result = LetterSpacing.parse(input, fontSize, base);
    expect(result).toBe(expected);
  },
);

test.each([
  ["10%", 20, 2],
  ["-5%", 16, -0.8],
])(
  "LetterSpacing.parse() - パーセンテージ '%s' を fontSize=%d で %d として解析",
  (input, fontSize, expected) => {
    const result = LetterSpacing.parse(input, fontSize);
    expect(result).toBe(expected);
  },
);

test("LetterSpacing.parse() - fontSizeなしのパーセンテージはnullを返す", () => {
  const result = LetterSpacing.parse("10%");
  expect(result).toBeNull();
});

test.each([["var(--letter-spacing)"], ["inherit"], ["initial"], ["unset"]])(
  "LetterSpacing.parse() - CSS変数/キーワード '%s' はnullを返す",
  (input) => {
    const result = LetterSpacing.parse(input);
    expect(result).toBeNull();
  },
);

test.each([
  ["", null],
  ["   ", null],
  ["abc", null],
  ["NaN", null],
  [",,,", null],
])("LetterSpacing.parse() - 無効な値 '%s' はnullを返す", (input, expected) => {
  const result = LetterSpacing.parse(input);
  expect(result).toBe(expected);
});

test("LetterSpacing.extractStyle() - letter-spacingをスタイルから抽出", () => {
  const styles = { "letter-spacing": "2px" };
  const result = LetterSpacing.extractStyle(styles);
  expect(result).toBe(2);
});

test("LetterSpacing.extractStyle() - em値をfontSizeで計算して抽出", () => {
  const styles = { "letter-spacing": "0.1em" };
  const result = LetterSpacing.extractStyle(styles, 16);
  expect(result).toBe(1.6);
});

test("LetterSpacing.extractStyle() - letter-spacingが存在しない場合は0を返す", () => {
  const styles = {};
  const result = LetterSpacing.extractStyle(styles);
  expect(result).toBe(0);
});

test("LetterSpacing.extractStyle() - 無効な値の場合は0を返す", () => {
  const styles = { "letter-spacing": "invalid" };
  const result = LetterSpacing.extractStyle(styles);
  expect(result).toBe(0);
});

test("LetterSpacing.extractStyle() - normal値は0を返す", () => {
  const styles = { "letter-spacing": "normal" };
  const result = LetterSpacing.extractStyle(styles);
  expect(result).toBe(0);
});

test("LetterSpacing.applyToConfig() - letter-spacingをconfigに適用", () => {
  // Arrange
  const config = createMockTextNodeConfig();
  const styles = { "letter-spacing": "2px" };

  // Act
  const result = LetterSpacing.applyToConfig(config, styles);

  // Assert
  expect(result).not.toBe(config); // イミュータブル
  expect(result.style.letterSpacing).toBe(2);
  expect(result.style.fontSize).toBe(16); // 他のプロパティが保持される
});

test("LetterSpacing.applyToConfig() - em値をconfigのfontSizeで計算して適用", () => {
  // Arrange
  const config = createMockTextNodeConfig(20);
  const styles = { "letter-spacing": "0.1em" };

  // Act
  const result = LetterSpacing.applyToConfig(config, styles);

  // Assert
  expect(result.style.letterSpacing).toBe(2); // 0.1 * 20
});

test("LetterSpacing.applyToConfig() - normalを0として適用", () => {
  // Arrange
  const config = createMockTextNodeConfig();
  const styles = { "letter-spacing": "normal" };

  // Act
  const result = LetterSpacing.applyToConfig(config, styles);

  // Assert
  expect(result.style.letterSpacing).toBe(0);
});

test("LetterSpacing.applyToConfig() - letter-spacingなしの場合は0を適用", () => {
  // Arrange
  const config = createMockTextNodeConfig();
  const styles = {};

  // Act
  const result = LetterSpacing.applyToConfig(config, styles);

  // Assert
  expect(result.style.letterSpacing).toBe(0);
});

test("LetterSpacing.applyToConfig() - 他のスタイルプロパティを保持", () => {
  // Arrange
  const config = createMockTextNodeConfig(16, {
    fontWeight: 700,
    textAlign: "CENTER",
    verticalAlign: "MIDDLE",
  });
  const styles = { "letter-spacing": "1px" };

  // Act
  const result = LetterSpacing.applyToConfig(config, styles);

  // Assert
  expect(result.style.fontSize).toBe(16);
  expect(result.style.fontWeight).toBe(700);
  expect(result.style.lineHeight.value).toBe(24);
  expect(result.style.textAlign).toBe("CENTER");
  expect(result.style.verticalAlign).toBe("MIDDLE");
  expect(result.style.letterSpacing).toBe(1);
});

test("LetterSpacing.applyToConfig() - 負の値を適用", () => {
  // Arrange
  const config = createMockTextNodeConfig();
  const styles = { "letter-spacing": "-0.5px" };

  // Act
  const result = LetterSpacing.applyToConfig(config, styles);

  // Assert
  expect(result.style.letterSpacing).toBe(-0.5);
});

test.each([
  [2, { value: 2, unit: "PIXELS" }],
  [0, { value: 0, unit: "PIXELS" }],
  [-1, { value: -1, unit: "PIXELS" }],
])(
  "LetterSpacing.toFigmaLetterSpacing() - %d をFigma形式に変換",
  (input, expected) => {
    const letterSpacing = LetterSpacing.create(input);
    const result = LetterSpacing.toFigmaLetterSpacing(letterSpacing);
    expect(result).toEqual(expected);
  },
);
