/**
 * placeholder-utils のテスト
 */

import { test, expect } from "vitest";
import {
  DEFAULT_PLACEHOLDER_COLOR,
  LABEL_CONFIG,
  createPlaceholderFills,
  createUrlLabel,
  createTextLabel,
} from "../placeholder-utils";

test(
  "placeholder-utils.DEFAULT_PLACEHOLDER_COLOR - 定義 - 標準プレースホルダー色を持つ",
  () => {
    expect(DEFAULT_PLACEHOLDER_COLOR).toEqual({ r: 0.94, g: 0.94, b: 0.94 });
  },
);

test("placeholder-utils.LABEL_CONFIG - 定義 - ラベル設定を持つ", () => {
  expect(LABEL_CONFIG.MAX_LENGTH).toBe(50);
  expect(LABEL_CONFIG.ELLIPSIS).toBe("...");
  expect(LABEL_CONFIG.FONT_SIZE).toBe(12);
  expect(LABEL_CONFIG.COLOR).toEqual({ r: 0.5, g: 0.5, b: 0.5 });
  expect(LABEL_CONFIG.ITEM_SPACING).toBe(8);
});

test(
  "placeholder-utils.createPlaceholderFills - 呼び出し - Paint配列を返す",
  () => {
    const fills = createPlaceholderFills();
    expect(fills).toHaveLength(1);
    expect(fills[0]).toMatchObject({
      type: "SOLID",
      color: DEFAULT_PLACEHOLDER_COLOR,
    });
  },
);

test("placeholder-utils.createUrlLabel - 短いURL - そのまま表示する", () => {
  const label = createUrlLabel("https://example.com");
  expect(label.characters).toBe("https://example.com");
  expect(label.type).toBe("TEXT");
  expect(label.name).toBe("url-label");
});

test("placeholder-utils.createUrlLabel - 長いURL - 省略表示する", () => {
  const longUrl = "https://example.com/" + "a".repeat(100);
  const label = createUrlLabel(longUrl);
  expect(label.characters!.length).toBe(
    LABEL_CONFIG.MAX_LENGTH + LABEL_CONFIG.ELLIPSIS.length,
  );
  expect(label.characters!.endsWith(LABEL_CONFIG.ELLIPSIS)).toBe(true);
});

test("placeholder-utils.createUrlLabel - カスタム名指定 - nameを反映する", () => {
  const label = createUrlLabel("https://example.com", "custom-name");
  expect(label.name).toBe("custom-name");
});

test(
  "placeholder-utils.createUrlLabel - フォント設定 - フォントサイズと色を持つ",
  () => {
    const label = createUrlLabel("https://example.com");
    expect(label.fontSize).toBe(LABEL_CONFIG.FONT_SIZE);
    expect(label.fills).toHaveLength(1);
  },
);

test(
  "placeholder-utils.createTextLabel - テキスト入力 - テキストラベルを作成する",
  () => {
    const label = createTextLabel("test text", "test-label");
    expect(label.characters).toBe("test text");
    expect(label.name).toBe("test-label");
    expect(label.type).toBe("TEXT");
  },
);

test(
  "placeholder-utils.createTextLabel - フォント設定 - フォントサイズと色を持つ",
  () => {
    const label = createTextLabel("test", "test-label");
    expect(label.fontSize).toBe(LABEL_CONFIG.FONT_SIZE);
    expect(label.fills).toHaveLength(1);
  },
);
