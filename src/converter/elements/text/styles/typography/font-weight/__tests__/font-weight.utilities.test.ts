import { test, expect } from "vitest";
import { FontWeight } from "../font-weight";

// =============================================================================
// FontWeight.isBold のテスト
// =============================================================================

test.each([
  [700, true],
  [750, true],
  [800, true],
  [850, true],
  [900, true],
])("FontWeight.isBold() - 値 %s をboldと判定する", (input, expected) => {
  // Arrange
  const weight = FontWeight.create(input);

  // Act
  const result = FontWeight.isBold(weight);

  // Assert
  expect(result).toBe(expected);
});

test.each([
  [100, false],
  [200, false],
  [300, false],
  [400, false],
  [500, false],
  [600, false],
  [650, false],
  [699, false],
])(
  "FontWeight.isBold() - 値 %s をboldではないと判定する",
  (input, expected) => {
    // Arrange
    const weight = FontWeight.create(input);

    // Act
    const result = FontWeight.isBold(weight);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontWeight.isNormal のテスト
// =============================================================================

test("FontWeight.isNormal() - 値400をnormalと判定する", () => {
  // Arrange
  const weight = FontWeight.create(400);

  // Act
  const result = FontWeight.isNormal(weight);

  // Assert
  expect(result).toBe(true);
});

test.each([
  [100],
  [200],
  [300],
  [350],
  [399],
  [401],
  [450],
  [500],
  [600],
  [700],
  [800],
  [900],
])("FontWeight.isNormal() - 値 %s をnormalではないと判定する", (input) => {
  // Arrange
  const weight = FontWeight.create(input);

  // Act
  const result = FontWeight.isNormal(weight);

  // Assert
  expect(result).toBe(false);
});
