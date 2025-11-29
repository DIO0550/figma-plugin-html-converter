import { test, expect } from "vitest";
import { TdElement } from "../td-element";

// =============================================================================
// getColspan テスト
// =============================================================================

test("TdElement.getColspan() - colspan未設定時はデフォルト1を返す", () => {
  const td = TdElement.create();

  expect(TdElement.getColspan(td)).toBe(1);
});

test("TdElement.getColspan() - colspan属性が設定されている場合その値を返す", () => {
  const td = TdElement.create({ colspan: "2" });

  expect(TdElement.getColspan(td)).toBe(2);
});

test("TdElement.getColspan() - colspan属性が数値の場合も正しくパースする", () => {
  const td = TdElement.create({ colspan: "5" });

  expect(TdElement.getColspan(td)).toBe(5);
});

test("TdElement.getColspan() - 無効な値の場合デフォルト1を返す", () => {
  const td = TdElement.create({ colspan: "invalid" });

  expect(TdElement.getColspan(td)).toBe(1);
});

test("TdElement.getColspan() - 0以下の値の場合デフォルト1を返す", () => {
  const td1 = TdElement.create({ colspan: "0" });
  const td2 = TdElement.create({ colspan: "-1" });

  expect(TdElement.getColspan(td1)).toBe(1);
  expect(TdElement.getColspan(td2)).toBe(1);
});

test("TdElement.getColspan() - 空文字の場合デフォルト1を返す", () => {
  const td = TdElement.create({ colspan: "" });

  expect(TdElement.getColspan(td)).toBe(1);
});

// =============================================================================
// getRowspan テスト
// =============================================================================

test("TdElement.getRowspan() - rowspan未設定時はデフォルト1を返す", () => {
  const td = TdElement.create();

  expect(TdElement.getRowspan(td)).toBe(1);
});

test("TdElement.getRowspan() - rowspan属性が設定されている場合その値を返す", () => {
  const td = TdElement.create({ rowspan: "3" });

  expect(TdElement.getRowspan(td)).toBe(3);
});

test("TdElement.getRowspan() - rowspan属性が数値の場合も正しくパースする", () => {
  const td = TdElement.create({ rowspan: "4" });

  expect(TdElement.getRowspan(td)).toBe(4);
});

test("TdElement.getRowspan() - 無効な値の場合デフォルト1を返す", () => {
  const td = TdElement.create({ rowspan: "invalid" });

  expect(TdElement.getRowspan(td)).toBe(1);
});

test("TdElement.getRowspan() - 0以下の値の場合デフォルト1を返す", () => {
  const td1 = TdElement.create({ rowspan: "0" });
  const td2 = TdElement.create({ rowspan: "-2" });

  expect(TdElement.getRowspan(td1)).toBe(1);
  expect(TdElement.getRowspan(td2)).toBe(1);
});

test("TdElement.getRowspan() - 空文字の場合デフォルト1を返す", () => {
  const td = TdElement.create({ rowspan: "" });

  expect(TdElement.getRowspan(td)).toBe(1);
});

// =============================================================================
// colspan と rowspan の組み合わせテスト
// =============================================================================

test("TdElement - colspan と rowspan の両方を持つセル", () => {
  const td = TdElement.create({ colspan: "2", rowspan: "3" });

  expect(TdElement.getColspan(td)).toBe(2);
  expect(TdElement.getRowspan(td)).toBe(3);
});

test("TdElement - 大きな colspan/rowspan 値を処理できる", () => {
  const td = TdElement.create({ colspan: "10", rowspan: "20" });

  expect(TdElement.getColspan(td)).toBe(10);
  expect(TdElement.getRowspan(td)).toBe(20);
});

test("TdElement - パースされたHTML要素の colspan/rowspan を処理", () => {
  // HTMLパース結果をシミュレート（文字列として受け取る）
  const parsedTd = {
    type: "element" as const,
    tagName: "td" as const,
    attributes: {
      colspan: "3",
      rowspan: "2",
    },
    children: [],
  };

  expect(TdElement.isTdElement(parsedTd)).toBe(true);
  expect(TdElement.getColspan(parsedTd as TdElement)).toBe(3);
  expect(TdElement.getRowspan(parsedTd as TdElement)).toBe(2);
});
