import { test, expect } from "vitest";
import { ColgroupElement } from "../colgroup-element";
import { ColElement } from "../../../col";

// getSpan テスト

test("ColgroupElement.getSpan() - span属性が未設定の場合は1を返す", () => {
  const colgroup = ColgroupElement.create();

  expect(ColgroupElement.getSpan(colgroup)).toBe(1);
});

test("ColgroupElement.getSpan() - span属性が数値の場合はその値を返す", () => {
  const colgroup = ColgroupElement.create({ span: 3 });

  expect(ColgroupElement.getSpan(colgroup)).toBe(3);
});

test("ColgroupElement.getSpan() - span属性が文字列数値の場合はパースして返す", () => {
  const colgroup = ColgroupElement.create({ span: "5" });

  expect(ColgroupElement.getSpan(colgroup)).toBe(5);
});

test("ColgroupElement.getSpan() - span属性が0以下の場合は1を返す", () => {
  const colgroup = ColgroupElement.create({ span: 0 });

  expect(ColgroupElement.getSpan(colgroup)).toBe(1);
});

test("ColgroupElement.getSpan() - span属性が負の数の場合は1を返す", () => {
  const colgroup = ColgroupElement.create({ span: -2 });

  expect(ColgroupElement.getSpan(colgroup)).toBe(1);
});

test("ColgroupElement.getSpan() - span属性が無効な文字列の場合は1を返す", () => {
  const colgroup = ColgroupElement.create({ span: "invalid" });

  expect(ColgroupElement.getSpan(colgroup)).toBe(1);
});

// getColumnCount テスト

test("ColgroupElement.getColumnCount() - 子要素なしでspan未設定の場合は1を返す", () => {
  const colgroup = ColgroupElement.create();

  expect(ColgroupElement.getColumnCount(colgroup)).toBe(1);
});

test("ColgroupElement.getColumnCount() - 子要素なしでspan設定の場合はspan値を返す", () => {
  const colgroup = ColgroupElement.create({ span: 4 });

  expect(ColgroupElement.getColumnCount(colgroup)).toBe(4);
});

test("ColgroupElement.getColumnCount() - col子要素1つの場合はそのspanを返す", () => {
  const col = ColElement.create({ span: 2 });
  const colgroup = ColgroupElement.createWithChildren({}, [col]);

  expect(ColgroupElement.getColumnCount(colgroup)).toBe(2);
});

test("ColgroupElement.getColumnCount() - col子要素が複数の場合はspanの合計を返す", () => {
  const col1 = ColElement.create({ span: 2 });
  const col2 = ColElement.create({ span: 3 });
  const col3 = ColElement.create({ span: 1 });
  const colgroup = ColgroupElement.createWithChildren({}, [col1, col2, col3]);

  expect(ColgroupElement.getColumnCount(colgroup)).toBe(6);
});

test("ColgroupElement.getColumnCount() - col子要素のspanがデフォルトの場合は1ずつカウント", () => {
  const col1 = ColElement.create();
  const col2 = ColElement.create();
  const colgroup = ColgroupElement.createWithChildren({}, [col1, col2]);

  expect(ColgroupElement.getColumnCount(colgroup)).toBe(2);
});

test("ColgroupElement.getColumnCount() - col子要素がある場合はcolgroup.span属性は無視される", () => {
  const col = ColElement.create({ span: 3 });
  // colgroupにspan: 10を設定しても、子要素があるので無視される
  const colgroup = ColgroupElement.createWithChildren({ span: 10 }, [col]);

  expect(ColgroupElement.getColumnCount(colgroup)).toBe(3);
});

test("ColgroupElement.getColumnCount() - 混合spanの子要素を正しく計算する", () => {
  const col1 = ColElement.create({ span: 1 });
  const col2 = ColElement.create({ span: 2 });
  const col3 = ColElement.create(); // デフォルト span: 1
  const col4 = ColElement.create({ span: "3" }); // 文字列span
  const colgroup = ColgroupElement.createWithChildren({}, [
    col1,
    col2,
    col3,
    col4,
  ]);

  expect(ColgroupElement.getColumnCount(colgroup)).toBe(7); // 1+2+1+3
});
