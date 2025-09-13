import { test, expect } from "vitest";
import { FontFamily } from "../font-family";

// =============================================================================
// FontFamily.create のテスト
// =============================================================================

test("FontFamily.create() - 通常の文字列からFontFamilyを作成できる", () => {
  // Arrange
  const input = "Arial";

  // Act
  const result = FontFamily.create(input);

  // Assert
  expect(result).toBe("Arial");
});

test("FontFamily.create() - 空文字列でもFontFamilyを作成できる", () => {
  // Arrange
  const input = "";

  // Act
  const result = FontFamily.create(input);

  // Assert
  expect(result).toBe("");
});

test("FontFamily.create() - Unicode文字を含むフォント名を作成できる", () => {
  // Arrange
  const input = "游ゴシック";

  // Act
  const result = FontFamily.create(input);

  // Assert
  expect(result).toBe("游ゴシック");
});

// =============================================================================
// FontFamily.parse の正常系テスト
// =============================================================================

test.each([
  ["Arial", "Arial"],
  ["Helvetica", "Helvetica"],
  ["Times New Roman", "Times New Roman"],
  ["游ゴシック", "游ゴシック"],
  ["MS Pゴシック", "MS Pゴシック"],
])(
  "FontFamily.parse() - 単一のフォントファミリー '%s' を処理できる",
  (input, expected) => {
    // Act
    const result = FontFamily.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

test.each([
  ["Arial, sans-serif", "Arial"],
  ["Helvetica, Arial, sans-serif", "Helvetica"],
  ["Georgia, Times, serif", "Georgia"],
  ['"Segoe UI", Tahoma, Geneva', "Segoe UI"],
  ["'Times New Roman', Times, serif", "Times New Roman"],
])(
  "FontFamily.parse() - 複数のフォントファミリー '%s' から最初のものを取得する",
  (input, expected) => {
    // Act
    const result = FontFamily.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontFamily.parse のクォート処理テスト
// =============================================================================

test.each([
  ['"Arial"', "Arial"],
  ["'Arial'", "Arial"],
  ['"Helvetica Neue"', "Helvetica Neue"],
  ["'Helvetica Neue'", "Helvetica Neue"],
  [`"Segoe UI"`, "Segoe UI"],
  [`'MS P Gothic'`, "MS P Gothic"],
])("FontFamily.parse() - クォート '%s' を適切に除去する", (input, expected) => {
  // Act
  const result = FontFamily.parse(input);

  // Assert
  expect(result).toBe(expected);
});

// =============================================================================
// FontFamily.parse の空白処理テスト
// =============================================================================

test.each([
  ["  Arial  ", "Arial"],
  ["\tArial\t", "Arial"],
  ["\nArial\n", "Arial"],
  ["  Arial  , sans-serif", "Arial"],
  ['  "Arial"  , sans-serif', "Arial"],
  ["   'Helvetica Neue'   ", "Helvetica Neue"],
])(
  "FontFamily.parse() - 前後の空白 '%s' を適切に除去する",
  (input, expected) => {
    // Act
    const result = FontFamily.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontFamily.parse の異常系・エッジケーステスト
// =============================================================================

test.each([
  [""],
  [","],
  [",,"],
  [", ,"],
  ["   "],
  ["\t\t"],
  ["\n\n"],
  ["   , sans-serif"],
  ['""'],
  ["''"],
  ['"", sans-serif'],
])("FontFamily.parse() - 無効な入力 '%s' に対してnullを返す", (input) => {
  // Act
  const result = FontFamily.parse(input);

  // Assert
  expect(result).toBeNull();
});

// =============================================================================
// FontFamily.parse の複雑なケーステスト
// =============================================================================

test("FontFamily.parse() - 極端に長いフォントファミリーリストを処理できる", () => {
  // Arrange
  const fonts = Array(100).fill("Arial").join(", ");

  // Act
  const result = FontFamily.parse(fonts);

  // Assert
  expect(result).toBe("Arial");
});

test("FontFamily.parse() - 特殊文字を含むフォント名を処理できる", () => {
  // Arrange
  const testCases = [
    ["Font-Name", "Font-Name"],
    ["Font_Name", "Font_Name"],
    ["Font.Name", "Font.Name"],
    ["Font@Name", "Font@Name"],
    ["Font#Name", "Font#Name"],
    ["Font&Name", "Font&Name"],
  ];

  testCases.forEach(([input, expected]) => {
    // Act
    const result = FontFamily.parse(input);

    // Assert
    expect(result).toBe(expected);
  });
});

test("FontFamily.parse() - ネストされたクォートを含むケースを処理できる", () => {
  // Arrange & Act
  const result1 = FontFamily.parse(`"Font 'Name'", sans-serif`);
  const result2 = FontFamily.parse(`'Font "Name"', sans-serif`);

  // Assert
  expect(result1).toBe("Font 'Name'");
  expect(result2).toBe('Font "Name"');
});

test("FontFamily.parse() - 国際化対応：様々な言語のフォント名を処理できる", () => {
  // Arrange
  const internationalFonts = [
    ["微软雅黑", "微软雅黑"], // 中国語
    ["맑은 고딕", "맑은 고딕"], // 韓国語
    ["العربية", "العربية"], // アラビア語
    ["Κυρίλλικα", "Κυρίλλικα"], // ギリシャ語
  ];

  internationalFonts.forEach(([input, expected]) => {
    // Act
    const result = FontFamily.parse(input);

    // Assert
    expect(result).toBe(expected);
  });
});

// =============================================================================
// FontFamily.parse の境界値テスト
// =============================================================================

test("FontFamily.parse() - 1文字のフォント名を処理できる", () => {
  // Arrange & Act
  const result = FontFamily.parse("A");

  // Assert
  expect(result).toBe("A");
});

test("FontFamily.parse() - 非常に長いフォント名を処理できる", () => {
  // Arrange
  const longName = "A".repeat(1000);

  // Act
  const result = FontFamily.parse(longName);

  // Assert
  expect(result).toBe(longName);
});

test("FontFamily.parse() - fallback値の様々なパターンを処理できる", () => {
  // Arrange
  const testCases = [
    ["Arial, inherit", "Arial"],
    ["Arial, initial", "Arial"],
    ["Arial, unset", "Arial"],
    ["Arial, system-ui", "Arial"],
    ["Arial, -apple-system", "Arial"],
  ];

  testCases.forEach(([input, expected]) => {
    // Act
    const result = FontFamily.parse(input);

    // Assert
    expect(result).toBe(expected);
  });
});
