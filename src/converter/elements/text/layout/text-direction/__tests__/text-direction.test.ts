import { expect, test } from "vitest";
import { TextDirection } from "../text-direction";
import {
  createTextNodeConfig,
  createMinimalTextNodeConfig,
  createRTLTextNodeConfig,
} from "../../__tests__/helpers/text-node-config.helper";

// ===================
// create メソッドのテスト
// ===================

test("TextDirection.create - 引数なしで実行すると、デフォルト値のltrが返される", () => {
  const result = TextDirection.create();
  expect(result).toBe("ltr");
});

test.each([
  ["ltr", "ltr"],
  ["rtl", "rtl"],
] as const)(
  "TextDirection.create - %sを指定すると、%sが返される",
  (input, expected) => {
    expect(TextDirection.create(input)).toBe(expected);
  },
);

// ===================
// parse メソッドのテスト
// ===================

test.each([
  ["ltr", "ltr"],
  ["rtl", "rtl"],
])("TextDirection.parse - %sを渡すと、%sが返される", (input, expected) => {
  expect(TextDirection.parse(input)).toBe(expected);
});

test.each([
  ["LTR", "ltr"],
  ["RTL", "rtl"],
  ["Ltr", "ltr"],
])(
  "TextDirection.parse - %s（大文字混在）を渡すと、%s（小文字）に正規化される",
  (input, expected) => {
    expect(TextDirection.parse(input)).toBe(expected);
  },
);

test.each([
  ["  ltr  ", "ltr"],
  ["\trtl\n", "rtl"],
  [" ltr ", "ltr"],
])(
  "TextDirection.parse - %s（空白含む）を渡すと、空白が除去されて%sが返される",
  (input, expected) => {
    expect(TextDirection.parse(input)).toBe(expected);
  },
);

test.each([
  ["inherit", "ltr"],
  ["initial", "ltr"],
  ["unset", "ltr"],
])(
  "TextDirection.parse - %s（継承値）を渡すと、デフォルトのltrが返される",
  (input) => {
    expect(TextDirection.parse(input)).toBe("ltr");
  },
);

test.each([["invalid"], ["left"], ["right"], [""], [null], [undefined]])(
  "TextDirection.parse - %s（無効な値）を渡すと、nullが返される",
  (input) => {
    expect(TextDirection.parse(input)).toBeNull();
  },
);

// ===================
// 判定メソッドのテスト
// ===================

test.each([
  ["rtl", true, false],
  ["ltr", false, true],
  [null, false, false],
] as const)(
  "TextDirection判定メソッド - %sの場合、isRTL=%s, isLTR=%s",
  (value, expectedRTL, expectedLTR) => {
    expect(TextDirection.isRTL(value)).toBe(expectedRTL);
    expect(TextDirection.isLTR(value)).toBe(expectedLTR);
  },
);

// ===================
// getDefault メソッドのテスト
// ===================

test("TextDirection.getDefault - デフォルト値ltrが返される", () => {
  expect(TextDirection.getDefault()).toBe("ltr");
});

// ===================
// extractStyle メソッドのテスト
// ===================

test("TextDirection.extractStyle - directionプロパティから値を抽出できる", () => {
  const styles = { direction: "rtl" };
  expect(TextDirection.extractStyle(styles)).toBe("rtl");
});

test.each([{}, { color: "red" }, { fontSize: "16px" }] as Record<
  string,
  string
>[])(
  "TextDirection.extractStyle - directionプロパティがない場合はnullが返される",
  (styles) => {
    expect(TextDirection.extractStyle(styles)).toBeNull();
  },
);

// ===================
// applyToConfig メソッドのテスト
// ===================

test("TextDirection.applyToConfig - ltrの場合、設定は変更されない", () => {
  const config = createTextNodeConfig();
  const result = TextDirection.applyToConfig(config, "ltr");
  expect(result).toEqual(config);
});

test("TextDirection.applyToConfig - nullの場合、設定は変更されない", () => {
  const config = createTextNodeConfig();
  const result = TextDirection.applyToConfig(config, null);
  expect(result).toEqual(config);
});

test("TextDirection.applyToConfig - rtlの場合、テキストを右寄せに設定", () => {
  const config = createTextNodeConfig({ style: { textAlign: "LEFT" } });
  const result = TextDirection.applyToConfig(config, "rtl");
  expect(result.style.textAlign).toBe("RIGHT");
  expect(result.style.fontSize).toBe(16); // フォントサイズは変更されない
});

test("TextDirection.applyToConfig - RTL用設定でもフォントサイズは保持される", () => {
  const config = createRTLTextNodeConfig();
  const result = TextDirection.applyToConfig(config, "rtl");
  expect(result.style.textAlign).toBe("RIGHT");
  expect(result.style.fontSize).toBe(16);
});

// ===================
// parseWritingMode メソッドのテスト
// ===================

test.each([
  ["horizontal-tb", "horizontal-tb"],
  ["vertical-rl", "vertical-rl"],
  ["vertical-lr", "vertical-lr"],
  ["sideways-rl", "sideways-rl"],
  ["sideways-lr", "sideways-lr"],
])(
  "TextDirection.parseWritingMode - %sを渡すと、%sが返される",
  (input, expected) => {
    expect(TextDirection.parseWritingMode(input)).toBe(expected);
  },
);

test.each([
  ["tb", "vertical-rl"],
  ["lr", "horizontal-tb"],
  ["lr-tb", "horizontal-tb"],
  ["rl", "vertical-rl"],
  ["tb-rl", "vertical-rl"],
])(
  "TextDirection.parseWritingMode - %s（旧仕様）を渡すと、%s（新仕様）に変換される",
  (input, expected) => {
    expect(TextDirection.parseWritingMode(input)).toBe(expected);
  },
);

test.each([
  ["VERTICAL-RL", "vertical-rl"],
  ["Horizontal-TB", "horizontal-tb"],
])(
  "TextDirection.parseWritingMode - %s（大文字混在）を渡すと、%s（小文字）に正規化される",
  (input, expected) => {
    expect(TextDirection.parseWritingMode(input)).toBe(expected);
  },
);

test.each([["invalid"], ["vertical"], [""], [null], [undefined]])(
  "TextDirection.parseWritingMode - %s（無効な値）を渡すと、nullが返される",
  (input) => {
    expect(TextDirection.parseWritingMode(input)).toBeNull();
  },
);

// ===================
// 書字方向判定メソッドのテスト
// ===================

test.each([
  ["vertical-rl", true, false],
  ["vertical-lr", true, false],
  ["sideways-rl", true, false],
  ["sideways-lr", true, false],
  ["horizontal-tb", false, true],
  [null, false, true], // nullはデフォルト横書き
] as const)(
  "TextDirection書字方向判定 - %sの場合、isVertical=%s, isHorizontal=%s",
  (mode, expectedVertical, expectedHorizontal) => {
    expect(TextDirection.isVertical(mode)).toBe(expectedVertical);
    expect(TextDirection.isHorizontal(mode)).toBe(expectedHorizontal);
  },
);

// ===================
// extractWritingMode メソッドのテスト
// ===================

test("TextDirection.extractWritingMode - writing-modeプロパティから値を抽出できる", () => {
  const styles = { "writing-mode": "vertical-rl" };
  expect(TextDirection.extractWritingMode(styles)).toBe("vertical-rl");
});

test("TextDirection.extractWritingMode - writingMode（キャメルケース）から値を抽出できる", () => {
  const styles = { writingMode: "horizontal-tb" };
  expect(TextDirection.extractWritingMode(styles)).toBe("horizontal-tb");
});

test("TextDirection.extractWritingMode - 両方ある場合はハイフン区切りが優先される", () => {
  const styles = {
    "writing-mode": "vertical-rl",
    writingMode: "horizontal-tb",
  };
  expect(TextDirection.extractWritingMode(styles)).toBe("vertical-rl");
});

test.each([{}, { color: "red" }, { fontSize: "16px" }] as Record<
  string,
  string
>[])(
  "TextDirection.extractWritingMode - writing-modeプロパティがない場合はnullが返される",
  (styles) => {
    expect(TextDirection.extractWritingMode(styles)).toBeNull();
  },
);

// ===================
// applyWritingModeToConfig メソッドのテスト
// ===================

test("TextDirection.applyWritingModeToConfig - horizontal-tbの場合、設定は変更されない", () => {
  const config = createTextNodeConfig();
  const result = TextDirection.applyWritingModeToConfig(
    config,
    "horizontal-tb",
  );
  expect(result).toEqual(config);
});

test("TextDirection.applyWritingModeToConfig - nullの場合、設定は変更されない", () => {
  const config = createTextNodeConfig();
  const result = TextDirection.applyWritingModeToConfig(config, null);
  expect(result).toEqual(config);
});

test("TextDirection.applyWritingModeToConfig - 縦書きモードの場合、設定を保持", () => {
  const config = createTextNodeConfig();
  const result = TextDirection.applyWritingModeToConfig(config, "vertical-rl");
  // 縦書きはFigmaでサポートされていないため、メタ情報として保持
  expect(result.style.fontSize).toBe(16);
});

// ===================
// reverse メソッドのテスト
// ===================

test.each([
  ["ltr", "rtl"],
  ["rtl", "ltr"],
] as const)(
  "TextDirection.reverse - %sを渡すと、%sに反転される",
  (input, expected) => {
    expect(TextDirection.reverse(input)).toBe(expected);
  },
);

// ===================
// fromLanguage メソッドのテスト
// ===================

test.each([
  ["ar", "rtl"], // アラビア語
  ["he", "rtl"], // ヘブライ語
  ["fa", "rtl"], // ペルシア語
  ["ur", "rtl"], // ウルドゥー語
  ["yi", "rtl"], // イディッシュ語
  ["ps", "rtl"], // パシュトー語
])(
  "TextDirection.fromLanguage - %s（RTL言語）を渡すと、rtlが返される",
  (langCode) => {
    expect(TextDirection.fromLanguage(langCode)).toBe("rtl");
  },
);

test.each([
  ["en", "ltr"], // 英語
  ["ja", "ltr"], // 日本語
  ["fr", "ltr"], // フランス語
  ["es", "ltr"], // スペイン語
  ["de", "ltr"], // ドイツ語
  ["zh", "ltr"], // 中国語
])(
  "TextDirection.fromLanguage - %s（LTR言語）を渡すと、ltrが返される",
  (langCode) => {
    expect(TextDirection.fromLanguage(langCode)).toBe("ltr");
  },
);

test.each([
  ["ar-SA", "rtl"], // アラビア語（サウジアラビア）
  ["en-US", "ltr"], // 英語（米国）
  ["ja-JP", "ltr"], // 日本語（日本）
  ["he-IL", "rtl"], // ヘブライ語（イスラエル）
])(
  "TextDirection.fromLanguage - %s（言語タグ）を渡すと、言語コードを抽出して%sが返される",
  (langTag, expected) => {
    expect(TextDirection.fromLanguage(langTag)).toBe(expected);
  },
);

test.each([
  ["AR", "rtl"],
  ["HE", "rtl"],
  ["EN", "ltr"],
  ["JA", "ltr"],
])(
  "TextDirection.fromLanguage - %s（大文字）を渡すと、大文字小文字を無視して%sが返される",
  (langCode, expected) => {
    expect(TextDirection.fromLanguage(langCode)).toBe(expected);
  },
);

// ===================
// 境界値テスト
// ===================

test("TextDirection.applyToConfig - 最小限の設定でもクラッシュしない", () => {
  const config = createMinimalTextNodeConfig();
  const result = TextDirection.applyToConfig(config, "rtl");
  expect(result.style.textAlign).toBe("RIGHT");
});

test("TextDirection.parse - 極端に長い文字列でもクラッシュしない", () => {
  const longString = "rtl".padEnd(10000, " ");
  expect(TextDirection.parse(longString)).toBe("rtl");
});

test("TextDirection.fromLanguage - 未知の言語コードでltrが返される", () => {
  expect(TextDirection.fromLanguage("xx")).toBe("ltr");
  expect(TextDirection.fromLanguage("unknown")).toBe("ltr");
  expect(TextDirection.fromLanguage("")).toBe("ltr");
});

test("TextDirection - 複数回の変換を適用してもイミュータブル", () => {
  const config = createTextNodeConfig();
  const result1 = TextDirection.applyToConfig(config, "rtl");
  const result2 = TextDirection.applyToConfig(config, "ltr");
  const result3 = TextDirection.applyWritingModeToConfig(config, "vertical-rl");

  expect(config.style.textAlign).toBe("LEFT"); // 元の設定は変更されない
  expect(result1.style.textAlign).toBe("RIGHT");
  expect(result2.style.textAlign).toBe("LEFT");
  expect(result3.style.textAlign).toBe("LEFT");
});
