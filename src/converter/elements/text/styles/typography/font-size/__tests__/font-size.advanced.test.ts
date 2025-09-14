import { test, expect } from "vitest";
import { FontSize } from "../font-size";

// =============================================================================
// FontSize.parse - 空白を含むケースのテスト
// =============================================================================

test.each([
  ["  16px  ", 16],
  ["\t24px\t", 24],
  ["\n32px\n", 32],
  ["  1em  ", 16],
  ["  1.5rem  ", 24],
  ["   100   ", 100],
])(
  "FontSize.parse() - 前後の空白を含む '%s' を適切に処理できる",
  (input, expected) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontSize.parse - 境界値テスト
// =============================================================================

test("FontSize.parse() - 非常に小さな値を処理できる", () => {
  // Arrange
  const inputs = [
    ["0.001px", 0.001],
    ["0.0001em", 0.0016],
    ["0.00001rem", 0.00016],
  ];

  inputs.forEach(([input, expected]) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBeCloseTo(expected as number, 5);
  });
});

test("FontSize.parse() - 非常に大きな値を処理できる", () => {
  // Arrange
  const inputs = [
    ["10000px", 10000],
    ["1000em", 16000],
    ["100rem", 1600],
  ];

  inputs.forEach(([input, expected]) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBe(expected);
  });
});

// =============================================================================
// FontSize.parse - 科学記法のテスト（現在未対応）
// =============================================================================

test.each([
  ["1e2", null],
  ["1.5e2", null],
  ["1e-1", null],
  ["1.5e-1", null],
])(
  "FontSize.parse() - 科学記法 '%s' は現在未対応でnullを返す",
  (input, expected) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontSize.parse - 複雑な小数のテスト
// =============================================================================

test.each([
  ["16.123456789px", 16.123456789],
  ["1.123456789em", 17.975309], // 16 * 1.123456789 = 17.975308624
  ["2.987654321rem", 47.802469], // 16 * 2.987654321 = 47.802469136
])(
  "FontSize.parse() - 精密な小数値 '%s' を正確に処理できる",
  (input, expected) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBeCloseTo(expected, 3);
  },
);

// =============================================================================
// FontSize.parse - キーワード値のテスト（将来の拡張用）
// =============================================================================

test.each([
  ["xx-small"],
  ["x-small"],
  ["small"],
  ["medium"],
  ["large"],
  ["x-large"],
  ["xx-large"],
  ["xxx-large"],
  ["smaller"],
  ["larger"],
])(
  "FontSize.parse() - CSSキーワード '%s' は現在未対応でnullを返す",
  (input) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBeNull();
  },
);

// =============================================================================
// FontSize.parse - calc()関数のテスト
// =============================================================================

test.each([
  ["calc(16px + 8px)", 24], // 16 + 8 = 24
  ["calc(1em + 0.5em)", 24], // (1 + 0.5) * 16 = 24
  ["calc(100% - 10px)", null], // パーセントはSizeValueとして返され、数値ではないのでnull
  ["calc(1rem * 2)", null], // 乗算は未対応
])(
  "FontSize.parse() - calc()関数 '%s' の処理結果が %s である",
  (input, expected) => {
    // Act
    const result = FontSize.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontSize.parse - CSS変数のテスト（将来の拡張用）
// =============================================================================

test.each([
  ["var(--font-size)"],
  ["var(--text-base)"],
  ["var(--size-lg, 18px)"],
])("FontSize.parse() - CSS変数 '%s' は現在未対応でnullを返す", (input) => {
  // Act
  const result = FontSize.parse(input);

  // Assert
  expect(result).toBeNull();
});
