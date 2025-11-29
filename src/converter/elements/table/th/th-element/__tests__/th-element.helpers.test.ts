import { test, expect } from "vitest";
import { ThElement } from "../th-element";

// =============================================================================
// getColspan テスト
// =============================================================================

test("ThElement.getColspan() - colspan未設定時はデフォルト1を返す", () => {
  const th = ThElement.create();

  expect(ThElement.getColspan(th)).toBe(1);
});

test("ThElement.getColspan() - colspan属性が設定されている場合その値を返す", () => {
  const th = ThElement.create({ colspan: "2" });

  expect(ThElement.getColspan(th)).toBe(2);
});

test("ThElement.getColspan() - colspan属性が数値の場合も正しくパースする", () => {
  const th = ThElement.create({ colspan: "5" });

  expect(ThElement.getColspan(th)).toBe(5);
});

test("ThElement.getColspan() - 無効な値の場合デフォルト1を返す", () => {
  const th = ThElement.create({ colspan: "invalid" });

  expect(ThElement.getColspan(th)).toBe(1);
});

test("ThElement.getColspan() - 0以下の値の場合デフォルト1を返す", () => {
  const th1 = ThElement.create({ colspan: "0" });
  const th2 = ThElement.create({ colspan: "-1" });

  expect(ThElement.getColspan(th1)).toBe(1);
  expect(ThElement.getColspan(th2)).toBe(1);
});

test("ThElement.getColspan() - 空文字の場合デフォルト1を返す", () => {
  const th = ThElement.create({ colspan: "" });

  expect(ThElement.getColspan(th)).toBe(1);
});

// =============================================================================
// getRowspan テスト
// =============================================================================

test("ThElement.getRowspan() - rowspan未設定時はデフォルト1を返す", () => {
  const th = ThElement.create();

  expect(ThElement.getRowspan(th)).toBe(1);
});

test("ThElement.getRowspan() - rowspan属性が設定されている場合その値を返す", () => {
  const th = ThElement.create({ rowspan: "3" });

  expect(ThElement.getRowspan(th)).toBe(3);
});

test("ThElement.getRowspan() - rowspan属性が数値の場合も正しくパースする", () => {
  const th = ThElement.create({ rowspan: "4" });

  expect(ThElement.getRowspan(th)).toBe(4);
});

test("ThElement.getRowspan() - 無効な値の場合デフォルト1を返す", () => {
  const th = ThElement.create({ rowspan: "invalid" });

  expect(ThElement.getRowspan(th)).toBe(1);
});

test("ThElement.getRowspan() - 0以下の値の場合デフォルト1を返す", () => {
  const th1 = ThElement.create({ rowspan: "0" });
  const th2 = ThElement.create({ rowspan: "-2" });

  expect(ThElement.getRowspan(th1)).toBe(1);
  expect(ThElement.getRowspan(th2)).toBe(1);
});

test("ThElement.getRowspan() - 空文字の場合デフォルト1を返す", () => {
  const th = ThElement.create({ rowspan: "" });

  expect(ThElement.getRowspan(th)).toBe(1);
});

// =============================================================================
// colspan と rowspan の組み合わせテスト
// =============================================================================

test("ThElement - colspan と rowspan の両方を持つセル", () => {
  const th = ThElement.create({ colspan: "2", rowspan: "3" });

  expect(ThElement.getColspan(th)).toBe(2);
  expect(ThElement.getRowspan(th)).toBe(3);
});

test("ThElement - 大きな colspan/rowspan 値を処理できる", () => {
  const th = ThElement.create({ colspan: "10", rowspan: "20" });

  expect(ThElement.getColspan(th)).toBe(10);
  expect(ThElement.getRowspan(th)).toBe(20);
});

test("ThElement - scope属性と colspan/rowspan の組み合わせ", () => {
  const th = ThElement.create({
    scope: "col",
    colspan: "3",
    rowspan: "1",
  });

  expect(th.attributes?.scope).toBe("col");
  expect(ThElement.getColspan(th)).toBe(3);
  expect(ThElement.getRowspan(th)).toBe(1);
});

test("ThElement - パースされたHTML要素の colspan/rowspan を処理", () => {
  // HTMLパース結果をシミュレート（文字列として受け取る）
  const parsedTh = {
    type: "element" as const,
    tagName: "th" as const,
    attributes: {
      colspan: "3",
      rowspan: "2",
      scope: "colgroup",
    },
    children: [],
  };

  expect(ThElement.isThElement(parsedTh)).toBe(true);
  expect(ThElement.getColspan(parsedTh as ThElement)).toBe(3);
  expect(ThElement.getRowspan(parsedTh as ThElement)).toBe(2);
});
