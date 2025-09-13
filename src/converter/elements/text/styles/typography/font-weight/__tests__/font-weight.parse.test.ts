import { test, expect } from "vitest";
import { FontWeight } from "../font-weight";

// =============================================================================
// FontWeight.parse - 名前付きウェイトのテスト
// =============================================================================

test.each([
  ["thin", 100],
  ["hairline", 100],
  ["extra-light", 200],
  ["ultra-light", 200],
  ["light", 300],
  ["normal", 400],
  ["regular", 400],
  ["medium", 500],
  ["semi-bold", 600],
  ["demi-bold", 600],
  ["bold", 700],
  ["extra-bold", 800],
  ["ultra-bold", 800],
  ["black", 900],
  ["heavy", 900],
])(
  "FontWeight.parse() - 名前付きウェイト '%s' を %s として処理できる",
  (input, expected) => {
    // Act
    const result = FontWeight.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontWeight.parse - 相対的なウェイトのテスト
// =============================================================================

test.each([
  ["lighter", 300],
  ["bolder", 700],
])(
  "FontWeight.parse() - 相対ウェイト '%s' を %s として処理できる",
  (input, expected) => {
    // Act
    const result = FontWeight.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontWeight.parse - 数値ウェイトのテスト
// =============================================================================

test.each([
  ["100", 100],
  ["200", 200],
  ["300", 300],
  ["400", 400],
  ["500", 500],
  ["600", 600],
  ["700", 700],
  ["800", 800],
  ["900", 900],
])(
  "FontWeight.parse() - 数値文字列 '%s' を %s として処理できる",
  (input, expected) => {
    // Act
    const result = FontWeight.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

test.each([
  ["150", 150],
  ["250", 250],
  ["350", 350],
  ["450", 450],
  ["550", 550],
  ["650", 650],
  ["750", 750],
  ["850", 850],
])(
  "FontWeight.parse() - 中間値文字列 '%s' を %s として処理できる",
  (input, expected) => {
    // Act
    const result = FontWeight.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontWeight.parse - 大文字小文字の処理テスト
// =============================================================================

test.each([
  ["BOLD", 700],
  ["Bold", 700],
  ["NORMAL", 400],
  ["Normal", 400],
  ["LIGHT", 300],
  ["Light", 300],
  ["SEMI-BOLD", 600],
  ["Semi-Bold", 600],
  ["ExTrA-BoLd", 800],
])(
  "FontWeight.parse() - 大文字小文字混在 '%s' を適切に処理できる",
  (input, expected) => {
    // Act
    const result = FontWeight.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontWeight.parse - 空白を含むケースのテスト
// =============================================================================

test.each([
  ["  bold  ", 700],
  ["\tbold\t", 700],
  ["\nbold\n", 700],
  ["  400  ", 400],
  ["  normal  ", 400],
  ["  extra-light  ", 200],
])(
  "FontWeight.parse() - 前後の空白を含む '%s' を適切に処理できる",
  (input, expected) => {
    // Act
    const result = FontWeight.parse(input.trim());

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontWeight.parse - 無効な値のテスト
// =============================================================================

test.each([
  [""],
  ["invalid"],
  ["abc"],
  ["1000"], // 範囲外
  ["50"], // 範囲外
  ["0"], // 範囲外
  ["-100"], // 負の値
  ["-400"],
  ["1001"],
  ["999"],
  ["99"],
  ["super-bold"], // 存在しないキーワード
  ["very-light"],
  ["ultra-normal"],
  ["100px"], // 単位付き
  ["400em"],
  ["bold-italic"], // 複合値
  ["inherit"], // CSS継承値
  ["initial"],
  ["unset"],
  ["auto"],
])("FontWeight.parse() - 無効な入力 '%s' に対してnullを返す", (input) => {
  // Act
  const result = FontWeight.parse(input);

  // Assert
  expect(result).toBeNull();
});

// =============================================================================
// FontWeight.parse - 境界値テスト
// =============================================================================

test("FontWeight.parse() - 境界値付近の値を適切に処理できる", () => {
  // Arrange
  const testCases = [
    ["100", 100], // 最小値
    ["101", 101], // 最小値+1
    ["899", 899], // 最大値-1
    ["900", 900], // 最大値
  ];

  testCases.forEach(([input, expected]) => {
    // Act
    const result = FontWeight.parse(input);

    // Assert
    expect(result).toBe(expected);
  });
});

// =============================================================================
// FontWeight.parse - 小数値のテスト
// =============================================================================

test.each([
  ["100.5", 100.5],
  ["400.25", 400.25],
  ["700.75", 700.75],
])(
  "FontWeight.parse() - 小数値 '%s' を %s として処理できる",
  (input, expected) => {
    // Act
    const result = FontWeight.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontWeight.parse - 国際化対応テスト
// =============================================================================

test("FontWeight.parse() - 様々な言語での'bold'相当語は現在未対応", () => {
  // Arrange
  const internationalBold = [
    "太字", // 日本語
    "粗体", // 中国語
    "굵게", // 韓国語
    "жирный", // ロシア語
  ];

  internationalBold.forEach((input) => {
    // Act
    const result = FontWeight.parse(input);

    // Assert
    expect(result).toBeNull();
  });
});

// =============================================================================
// FontWeight.parse - CSS変数と関数のテスト（将来の拡張用）
// =============================================================================

test.each([
  ["var(--font-weight)"],
  ["var(--weight-bold, 700)"],
  ["calc(400 + 300)"],
  ["clamp(400, 500, 700)"],
])("FontWeight.parse() - CSS関数 '%s' は現在未対応でnullを返す", (input) => {
  // Act
  const result = FontWeight.parse(input);

  // Assert
  expect(result).toBeNull();
});

// =============================================================================
// FontWeight.parse - 特殊な形式のテスト
// =============================================================================

test.each([
  ["w100", null], // wプレフィックス形式
  ["w400", null],
  ["w700", null],
  ["100w", null], // wサフィックス形式
  ["400w", null],
  ["700w", null],
])(
  "FontWeight.parse() - 特殊形式 '%s' の処理結果が %s である",
  (input, expected) => {
    // Act
    const result = FontWeight.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);
