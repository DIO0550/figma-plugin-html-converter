import { test, expect } from "vitest";
import { FontWeight } from "../font-weight";

// =============================================================================
// FontWeight.create のテスト
// =============================================================================

test.each([[100], [200], [300], [400], [500], [600], [700], [800], [900]])(
  "FontWeight.create() - 有効な標準値 %s からFontWeightを作成できる",
  (input) => {
    // Act
    const result = FontWeight.create(input);

    // Assert
    expect(result).toBe(input);
  },
);

test.each([[150], [250], [350], [450], [550], [650], [750], [850]])(
  "FontWeight.create() - 中間値 %s からFontWeightを作成できる",
  (input) => {
    // Act
    const result = FontWeight.create(input);

    // Assert
    expect(result).toBe(input);
  },
);

test("FontWeight.create() - 境界値100-900の範囲でFontWeightを作成できる", () => {
  // Arrange
  const minValue = 100;
  const maxValue = 900;

  // Act
  const minResult = FontWeight.create(minValue);
  const maxResult = FontWeight.create(maxValue);

  // Assert
  expect(minResult).toBe(100);
  expect(maxResult).toBe(900);
});
