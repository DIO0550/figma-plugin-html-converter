import { test, expect } from "vitest";
import { FontSize } from "../font-size";

// =============================================================================
// FontSize.create のテスト
// =============================================================================

test("FontSize.create() - 整数値からFontSizeを作成できる", () => {
  // Arrange
  const input = 16;

  // Act
  const result = FontSize.create(input);

  // Assert
  expect(result).toBe(16);
});

test("FontSize.create() - 小数値からFontSizeを作成できる", () => {
  // Arrange
  const input = 16.5;

  // Act
  const result = FontSize.create(input);

  // Assert
  expect(result).toBe(16.5);
});

test("FontSize.create() - 0値からFontSizeを作成できる", () => {
  // Arrange
  const input = 0;

  // Act
  const result = FontSize.create(input);

  // Assert
  expect(result).toBe(0);
});

test("FontSize.create() - 負の値からFontSizeを作成できる", () => {
  // Arrange
  const input = -10;

  // Act
  const result = FontSize.create(input);

  // Assert
  expect(result).toBe(-10);
});

test("FontSize.create() - 極小値からFontSizeを作成できる", () => {
  // Arrange
  const input = 0.001;

  // Act
  const result = FontSize.create(input);

  // Assert
  expect(result).toBe(0.001);
});

test("FontSize.create() - 極大値からFontSizeを作成できる", () => {
  // Arrange
  const input = 999999;

  // Act
  const result = FontSize.create(input);

  // Assert
  expect(result).toBe(999999);
});

// =============================================================================
// FontSize.parse - ピクセル値のテスト
// =============================================================================

test.each([
  ["16px", 16],
  ["24px", 24],
  ["32px", 32],
  ["12.5px", 12.5],
  ["0.5px", 0.5],
  ["100px", 100],
  ["1000px", 1000],
])(
  "FontSize.parse() - ピクセル値 '%s' を %s として処理できる",
  (input, expected) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontSize.parse - 単位なし数値のテスト
// =============================================================================

test.each([
  ["16", 16],
  ["24", 24],
  ["32", 32],
  ["12.5", 12.5],
  ["0.5", 0.5],
  ["100", 100],
  ["1000", 1000],
])(
  "FontSize.parse() - 単位なし数値 '%s' を %s として処理できる",
  (input, expected) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontSize.parse - em単位のテスト
// =============================================================================

test.each([
  ["1em", 16],
  ["1.5em", 24],
  ["2em", 32],
  ["0.5em", 8],
  ["0.75em", 12],
  ["2.5em", 40],
  ["10em", 160],
])(
  "FontSize.parse() - em値 '%s' を %s px として処理できる（基準16px）",
  (input, expected) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontSize.parse - rem単位のテスト
// =============================================================================

test.each([
  ["1rem", 16],
  ["1.5rem", 24],
  ["2rem", 32],
  ["0.5rem", 8],
  ["0.75rem", 12],
  ["2.5rem", 40],
  ["10rem", 160],
])(
  "FontSize.parse() - rem値 '%s' を %s px として処理できる（基準16px）",
  (input, expected) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontSize.parse - 特殊値のテスト
// =============================================================================

test.each([
  ["0", 0],
  ["0px", 0],
  ["0em", 0],
  ["0rem", 0],
  ["0.0", 0],
])("FontSize.parse() - ゼロ値 '%s' を 0 として処理できる", (input) => {
  // Act
  const result = FontSize.parse(input);

  // Assert
  expect(result).toBe(0);
});

// =============================================================================
// FontSize.parse - 無効な値のテスト
// =============================================================================

test.each([
  [""],
  ["invalid"],
  ["auto"],
  ["inherit"],
  ["initial"],
  ["unset"],
  ["none"],
  ["normal"],
  ["px"],
  ["em"],
  ["rem"],
  ["abc123"],
  ["12pt"], // pt単位は未対応
  ["9pt"],
  ["100%"], // パーセンテージは未対応
  ["50%"],
  ["-16px"], // 負の値は未対応
  ["-1em"],
  ["-2rem"],
])("FontSize.parse() - 無効な入力 '%s' に対してnullを返す", (input) => {
  // Act
  const result = FontSize.parse(input);

  // Assert
  expect(result).toBeNull();
});
