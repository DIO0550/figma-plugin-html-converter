import { test, expect } from "vitest";
import { FontStyle } from "../font-style";

// =============================================================================
// FontStyle.create のテスト
// =============================================================================

test("FontStyle.create() - 'normal'からFontStyleを作成できる", () => {
  // Arrange
  const input = "normal";

  // Act
  const result = FontStyle.create(input);

  // Assert
  expect(result).toBe("normal");
});

test("FontStyle.create() - 'italic'からFontStyleを作成できる", () => {
  // Arrange
  const input = "italic";

  // Act
  const result = FontStyle.create(input);

  // Assert
  expect(result).toBe("italic");
});

test("FontStyle.create() - 'italic'からFontStyleを作成できる（oblique非対応）", () => {
  // Arrange
  const input = "italic" as const;

  // Act
  const result = FontStyle.create(input);

  // Assert
  expect(result).toBe("italic");
});

// =============================================================================
// FontStyle.parse - 標準キーワードのテスト
// =============================================================================

test.each([
  ["normal", "normal"],
  ["italic", "italic"],
  ["oblique", "italic"], // obliqueはitalicとして扱われる
])(
  "FontStyle.parse() - 標準キーワード '%s' を '%s' として処理できる",
  (input, expected) => {
    // Act
    const result = FontStyle.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontStyle.parse - 大文字小文字の処理テスト
// =============================================================================

test.each([
  ["NORMAL", "normal"],
  ["Normal", "normal"],
  ["nOrMaL", "normal"],
  ["ITALIC", "italic"],
  ["Italic", "italic"],
  ["iTaLiC", "italic"],
  ["OBLIQUE", "italic"],
  ["Oblique", "italic"],
  ["oBLiQuE", "italic"],
])(
  "FontStyle.parse() - 大文字小文字混在 '%s' を '%s' として処理できる",
  (input, expected) => {
    // Act
    const result = FontStyle.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontStyle.parse - 空白を含むケースのテスト
// =============================================================================

test.each([
  ["  normal  ", "normal"],
  ["\tnormal\t", "normal"],
  ["\nnormal\n", "normal"],
  ["  italic  ", "italic"],
  ["\titalic\t", "italic"],
  ["\nitalic\n", "italic"],
  ["  oblique  ", "italic"],
  ["\toblique\t", "italic"],
])(
  "FontStyle.parse() - 前後の空白を含む '%s' を '%s' として処理できる",
  (input, expected) => {
    // Act
    const result = FontStyle.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontStyle.parse - oblique角度指定のテスト
// =============================================================================

test.each([
  ["oblique 10deg", "italic"],
  ["oblique 20deg", "italic"],
  ["oblique 30deg", "italic"],
  ["oblique 45deg", "italic"],
  ["oblique -10deg", "italic"],
  ["oblique -20deg", "italic"],
  ["oblique 0deg", "italic"],
  ["oblique 90deg", "italic"],
  ["OBLIQUE 15DEG", "italic"],
  ["Oblique 25Deg", "italic"],
])(
  "FontStyle.parse() - oblique角度指定 '%s' を 'italic' として処理できる",
  (input) => {
    // Act
    const result = FontStyle.parse(input);

    // Assert
    expect(result).toBe("italic");
  },
);

test.each([
  ["oblique 10", "italic"], // 単位なし
  ["oblique 10rad", "italic"], // ラジアン
  ["oblique 10grad", "italic"], // グラジアン
  ["oblique 10turn", "italic"], // ターン
  ["oblique10deg", null], // スペースなし（無効）
])(
  "FontStyle.parse() - oblique角度指定の変形 '%s' の処理結果が %s である",
  (input, expected) => {
    // Act
    const result = FontStyle.parse(input);

    // Assert
    expect(result).toBe(expected);
  },
);

// =============================================================================
// FontStyle.parse - 無効な値のテスト
// =============================================================================

test.each([
  [""],
  ["invalid"],
  ["bold"], // font-weightの値
  ["700"], // font-weightの数値
  ["underline"], // text-decorationの値
  ["strikethrough"],
  ["overline"],
  ["100"],
  ["400"],
  ["inherit"], // CSS継承値
  ["initial"],
  ["unset"],
  ["auto"],
  ["none"],
  ["regular"], // font-weightでは有効だがfont-styleでは無効
  ["light"],
  ["medium"],
  ["semi-bold"],
])("FontStyle.parse() - 無効な入力 '%s' に対してnullを返す", (input) => {
  // Act
  const result = FontStyle.parse(input);

  // Assert
  expect(result).toBeNull();
});

// =============================================================================
// FontStyle.parse - エッジケースのテスト
// =============================================================================

test("FontStyle.parse() - 非常に長い文字列を処理できる", () => {
  // Arrange
  const longString = "italic" + " ".repeat(1000) + "italic";

  // Act
  const result = FontStyle.parse(longString);

  // Assert
  // スペースを含む複合値は無効とする実装のため
  expect(result).toBeNull();
});

test("FontStyle.parse() - 特殊文字を含む文字列を処理できる", () => {
  // Arrange
  const testCases = [
    ["italic!", null],
    ["@italic", null],
    ["#italic", null],
    ["italic$", null],
    ["italic%", null],
    ["italic^", null],
    ["italic&", null],
    ["italic*", null],
    ["(italic)", null],
    ["[italic]", null],
    ["{italic}", null],
    ["italic;", null],
    ["italic:", null],
    ["italic,", null],
    ["italic.", null],
  ];

  testCases.forEach(([input, expected]) => {
    // Act
    const result = FontStyle.parse(input as string);

    // Assert
    expect(result).toBe(expected);
  });
});

// =============================================================================
// FontStyle.isItalic のテスト
// =============================================================================

test("FontStyle.isItalic() - 'italic'をイタリック体と判定する", () => {
  // Arrange
  const style = FontStyle.create("italic");

  // Act
  const result = FontStyle.isItalic(style);

  // Assert
  expect(result).toBe(true);
});

test("FontStyle.isItalic() - 'normal'をイタリック体ではないと判定する", () => {
  // Arrange
  const style = FontStyle.create("normal");

  // Act
  const result = FontStyle.isItalic(style);

  // Assert
  expect(result).toBe(false);
});

test("FontStyle.isItalic() - parseした値でも正しく判定する", () => {
  // Arrange & Act
  const italic = FontStyle.parse("italic");
  const normal = FontStyle.parse("normal");
  const oblique = FontStyle.parse("oblique");
  const obliqueWithAngle = FontStyle.parse("oblique 15deg");

  // Assert
  if (italic) expect(FontStyle.isItalic(italic)).toBe(true);
  if (normal) expect(FontStyle.isItalic(normal)).toBe(false);
  if (oblique) expect(FontStyle.isItalic(oblique)).toBe(true);
  if (obliqueWithAngle) expect(FontStyle.isItalic(obliqueWithAngle)).toBe(true);
});

test("FontStyle.isItalic() - 大文字小文字混在でparseした値でも正しく判定する", () => {
  // Arrange & Act
  const italic1 = FontStyle.parse("ITALIC");
  const italic2 = FontStyle.parse("Italic");
  const normal1 = FontStyle.parse("NORMAL");
  const normal2 = FontStyle.parse("Normal");

  // Assert
  if (italic1) expect(FontStyle.isItalic(italic1)).toBe(true);
  if (italic2) expect(FontStyle.isItalic(italic2)).toBe(true);
  if (normal1) expect(FontStyle.isItalic(normal1)).toBe(false);
  if (normal2) expect(FontStyle.isItalic(normal2)).toBe(false);
});

// =============================================================================
// FontStyle.parse - 国際化対応テスト
// =============================================================================

test("FontStyle.parse() - 様々な言語での'italic'相当語は現在未対応", () => {
  // Arrange
  const internationalItalic = [
    "斜体", // 日本語
    "イタリック", // 日本語カタカナ
    "斜體", // 繁体字中国語
    "기울임", // 韓国語
    "курсив", // ロシア語
    "kursiv", // ドイツ語
    "corsivo", // イタリア語
    "cursiva", // スペイン語
  ];

  internationalItalic.forEach((input) => {
    // Act
    const result = FontStyle.parse(input);

    // Assert
    expect(result).toBeNull();
  });
});

// =============================================================================
// FontStyle.parse - CSS変数と関数のテスト（将来の拡張用）
// =============================================================================

test.each([
  ["var(--font-style)"],
  ["var(--style-italic, italic)"],
  ["var(--text-style)"],
  ["env(font-style-base)"],
])("FontStyle.parse() - CSS変数 '%s' は現在未対応でnullを返す", (input) => {
  // Act
  const result = FontStyle.parse(input);

  // Assert
  expect(result).toBeNull();
});

// =============================================================================
// FontStyle.parse - 複合値のテスト
// =============================================================================

test.each([
  ["italic bold"], // font-weightとの複合
  ["normal 400"], // font-weightとの複合
  ["italic underline"], // text-decorationとの複合
  ["oblique small-caps"], // font-variantとの複合
])("FontStyle.parse() - 複合値 '%s' は現在未対応でnullを返す", (input) => {
  // Act
  const result = FontStyle.parse(input);

  // Assert
  expect(result).toBeNull();
});

// =============================================================================
// FontStyle.parse - システムフォントキーワードのテスト
// =============================================================================

test.each([
  ["caption"],
  ["icon"],
  ["menu"],
  ["message-box"],
  ["small-caption"],
  ["status-bar"],
])(
  "FontStyle.parse() - システムフォントキーワード '%s' は現在未対応でnullを返す",
  (input) => {
    // Act
    const result = FontStyle.parse(input);

    // Assert
    expect(result).toBeNull();
  },
);
