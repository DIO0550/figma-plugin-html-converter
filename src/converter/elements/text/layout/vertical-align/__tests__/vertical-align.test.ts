import { test, expect } from "vitest";
import { VerticalAlign, type VerticalAlignType } from "../vertical-align";
import {
  createTextNodeConfig,
  createMinimalTextNodeConfig,
} from "../../__tests__/helpers/text-node-config.helper";

// ===================
// create メソッドのテスト
// ===================

test("VerticalAlign.create - 引数なしで実行すると、デフォルト値のbaselineが返される", () => {
  const result = VerticalAlign.create();
  expect(result).toBe("baseline");
});

test.each([
  ["top", "top"],
  ["middle", "middle"],
  ["bottom", "bottom"],
  ["super", "super"],
  ["sub", "sub"],
  ["baseline", "baseline"],
] as const)(
  "VerticalAlign.create - %sを指定すると、%sが返される",
  (input, expected) => {
    expect(VerticalAlign.create(input)).toBe(expected);
  },
);

// ===================
// parse メソッドのテスト
// ===================

test.each([
  ["baseline", "baseline"],
  ["top", "top"],
  ["middle", "middle"],
  ["bottom", "bottom"],
  ["text-top", "text-top"],
  ["text-bottom", "text-bottom"],
  ["super", "super"],
  ["sub", "sub"],
])("VerticalAlign.parse - %sを渡すと、%sが返される", (input, expected) => {
  expect(VerticalAlign.parse(input)).toBe(expected);
});

test.each([
  ["TOP", "top"],
  ["Middle", "middle"],
  ["SUPER", "super"],
  ["Text-Top", "text-top"],
])(
  "VerticalAlign.parse - %s（大文字混在）を渡すと、%s（小文字）に正規化される",
  (input, expected) => {
    expect(VerticalAlign.parse(input)).toBe(expected);
  },
);

test.each([
  ["  top  ", "top"],
  ["\tmiddle\n", "middle"],
  [" baseline ", "baseline"],
])(
  "VerticalAlign.parse - %s（空白含む）を渡すと、空白が除去されて%sが返される",
  (input, expected) => {
    expect(VerticalAlign.parse(input)).toBe(expected);
  },
);

test.each([
  ["10px", "baseline"],
  ["-5px", "baseline"],
  ["0.5em", "baseline"],
  ["-1.5rem", "baseline"],
  ["50%", "baseline"],
  ["-25%", "baseline"],
  ["0", "baseline"],
])(
  "VerticalAlign.parse - %s（数値指定）を渡すと、baselineが返される",
  (input) => {
    expect(VerticalAlign.parse(input)).toBe("baseline");
  },
);

test.each([["invalid"], ["center"], ["inherit"], [""], [null], [undefined]])(
  "VerticalAlign.parse - %s（無効な値）を渡すと、nullが返される",
  (input) => {
    expect(VerticalAlign.parse(input)).toBeNull();
  },
);

// ===================
// 判定メソッドのテスト
// ===================

test.each([
  ["super", true, false, false],
  ["sub", false, true, false],
  ["middle", false, false, true],
  ["baseline", false, false, false],
  ["top", false, false, false],
  [null, false, false, false],
] as const)(
  "VerticalAlign判定メソッド - %sの場合、isSuper=%s, isSub=%s, isMiddle=%s",
  (value, expectedSuper, expectedSub, expectedMiddle) => {
    expect(VerticalAlign.isSuper(value)).toBe(expectedSuper);
    expect(VerticalAlign.isSub(value)).toBe(expectedSub);
    expect(VerticalAlign.isMiddle(value)).toBe(expectedMiddle);
  },
);

// ===================
// getDefault メソッドのテスト
// ===================

test("VerticalAlign.getDefault - デフォルト値baselineが返される", () => {
  expect(VerticalAlign.getDefault()).toBe("baseline");
});

// ===================
// extractStyle メソッドのテスト
// ===================

test("VerticalAlign.extractStyle - vertical-alignプロパティから値を抽出できる", () => {
  const styles = { "vertical-align": "top" };
  expect(VerticalAlign.extractStyle(styles)).toBe("top");
});

test("VerticalAlign.extractStyle - verticalAlign（キャメルケース）から値を抽出できる", () => {
  const styles = { verticalAlign: "middle" };
  expect(VerticalAlign.extractStyle(styles)).toBe("middle");
});

test("VerticalAlign.extractStyle - 両方ある場合はハイフン区切りが優先される", () => {
  const styles = {
    "vertical-align": "top",
    verticalAlign: "bottom",
  };
  expect(VerticalAlign.extractStyle(styles)).toBe("top");
});

test.each([{}, { color: "red" }, { fontSize: "16px" }] as Record<
  string,
  string
>[])(
  "VerticalAlign.extractStyle - vertical-alignプロパティがない場合はnullが返される",
  (styles) => {
    expect(VerticalAlign.extractStyle(styles)).toBeNull();
  },
);

// ===================
// applyToConfig メソッドのテスト
// ===================

test("VerticalAlign.applyToConfig - baselineの場合、設定は変更されない", () => {
  const config = createTextNodeConfig();
  const result = VerticalAlign.applyToConfig(config, "baseline");
  expect(result).toEqual(config);
});

test("VerticalAlign.applyToConfig - nullの場合、設定は変更されない", () => {
  const config = createTextNodeConfig();
  const result = VerticalAlign.applyToConfig(config, null);
  expect(result).toEqual(config);
});

test("VerticalAlign.applyToConfig - superの場合、フォントサイズが75%に縮小される", () => {
  const config = createTextNodeConfig({ style: { fontSize: 16 } });
  const result = VerticalAlign.applyToConfig(config, "super");
  expect(result.style.fontSize).toBe(12); // 16 * 0.75 = 12
  expect(result.style.verticalAlign).toBe("super");
});

test("VerticalAlign.applyToConfig - subの場合、フォントサイズが75%に縮小される", () => {
  const config = createTextNodeConfig({ style: { fontSize: 20 } });
  const result = VerticalAlign.applyToConfig(config, "sub");
  expect(result.style.fontSize).toBe(15); // 20 * 0.75 = 15
  expect(result.style.verticalAlign).toBe("sub");
});

test.each([
  ["top", "top"],
  ["middle", "middle"],
  ["bottom", "bottom"],
  ["text-top", "text-top"],
  ["text-bottom", "text-bottom"],
] as const)(
  "VerticalAlign.applyToConfig - %sの場合、verticalAlignが%sに設定され、フォントサイズは変更されない",
  (input, expected) => {
    const config = createTextNodeConfig({ style: { fontSize: 16 } });
    const result = VerticalAlign.applyToConfig(config, input);
    expect(result.style.verticalAlign).toBe(expected);
    expect(result.style.fontSize).toBe(16);
  },
);

// ===================
// 境界値テスト
// ===================

test("VerticalAlign.applyToConfig - フォントサイズが0の場合、super/subで0が維持される", () => {
  const config = createTextNodeConfig({ style: { fontSize: 0 } });
  const result = VerticalAlign.applyToConfig(config, "super");
  expect(result.style.fontSize).toBe(0);
});

test("VerticalAlign.applyToConfig - フォントサイズが極大値の場合、計算が正しく行われる", () => {
  const config = createTextNodeConfig({ style: { fontSize: 10000 } });
  const result = VerticalAlign.applyToConfig(config, "super");
  expect(result.style.fontSize).toBe(7500); // 10000 * 0.75
});

test("VerticalAlign.applyToConfig - フォントサイズが小数の場合、計算が正しく行われる", () => {
  const config = createTextNodeConfig({ style: { fontSize: 15.5 } });
  const result = VerticalAlign.applyToConfig(config, "sub");
  expect(result.style.fontSize).toBe(11.625); // 15.5 * 0.75
});

// ===================
// toFigmaAlignment メソッドのテスト
// ===================

test.each([
  ["top", "MIN"],
  ["text-top", "MIN"],
  ["middle", "CENTER"],
  ["bottom", "MAX"],
  ["text-bottom", "MAX"],
])(
  "VerticalAlign.toFigmaAlignment - %sを渡すと、%sが返される",
  (input, expected) => {
    expect(VerticalAlign.toFigmaAlignment(input as VerticalAlignType)).toBe(
      expected,
    );
  },
);

test.each([["baseline"], ["super"], ["sub"], [null]])(
  "VerticalAlign.toFigmaAlignment - %sを渡すと、nullが返される",
  (input) => {
    expect(
      VerticalAlign.toFigmaAlignment(input as VerticalAlignType | null),
    ).toBeNull();
  },
);

// ===================
// エッジケーステスト
// ===================

test("VerticalAlign.applyToConfig - 最小限の設定でもクラッシュしない", () => {
  const config = createMinimalTextNodeConfig();
  const result = VerticalAlign.applyToConfig(config, "super");
  expect(result.style.fontSize).toBe(9); // 12 * 0.75
});

test("VerticalAlign.parse - 極端に長い文字列でもクラッシュしない", () => {
  const longString = "top".padEnd(10000, " ");
  expect(VerticalAlign.parse(longString)).toBe("top");
});

test("VerticalAlign - 複数回の変換を適用してもイミュータブル", () => {
  const config = createTextNodeConfig();
  const result1 = VerticalAlign.applyToConfig(config, "super");
  const result2 = VerticalAlign.applyToConfig(config, "sub");

  expect(config.style.fontSize).toBe(16); // 元の設定は変更されない
  expect(result1.style.fontSize).toBe(12);
  expect(result2.style.fontSize).toBe(12);
});
