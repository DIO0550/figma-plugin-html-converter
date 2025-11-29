import { test, expect } from "vitest";
import { ColElement } from "../col-element";

// getSpan テスト

test("ColElement.getSpan() - span属性が未設定の場合は1を返す", () => {
  const col = ColElement.create();

  expect(ColElement.getSpan(col)).toBe(1);
});

test("ColElement.getSpan() - span属性が数値の場合はその値を返す", () => {
  const col = ColElement.create({ span: 3 });

  expect(ColElement.getSpan(col)).toBe(3);
});

test("ColElement.getSpan() - span属性が文字列数値の場合はパースして返す", () => {
  const col = ColElement.create({ span: "5" });

  expect(ColElement.getSpan(col)).toBe(5);
});

test("ColElement.getSpan() - span属性が1の場合は1を返す", () => {
  const col = ColElement.create({ span: 1 });

  expect(ColElement.getSpan(col)).toBe(1);
});

test("ColElement.getSpan() - span属性が0以下の場合は1を返す", () => {
  const col = ColElement.create({ span: 0 });

  expect(ColElement.getSpan(col)).toBe(1);
});

test("ColElement.getSpan() - span属性が負の数の場合は1を返す", () => {
  const col = ColElement.create({ span: -2 });

  expect(ColElement.getSpan(col)).toBe(1);
});

test("ColElement.getSpan() - span属性が無効な文字列の場合は1を返す", () => {
  const col = ColElement.create({ span: "invalid" });

  expect(ColElement.getSpan(col)).toBe(1);
});

// getWidth テスト

test("ColElement.getWidth() - width属性が未設定の場合はundefinedを返す", () => {
  const col = ColElement.create();

  expect(ColElement.getWidth(col)).toBeUndefined();
});

test("ColElement.getWidth() - width属性が文字列の場合はそのまま返す", () => {
  const col = ColElement.create({ width: "100px" });

  expect(ColElement.getWidth(col)).toBe("100px");
});

test("ColElement.getWidth() - width属性が数値の場合はpx単位の文字列に変換する", () => {
  const col = ColElement.create({ width: 150 });

  expect(ColElement.getWidth(col)).toBe("150px");
});

test("ColElement.getWidth() - width属性がパーセント文字列の場合はそのまま返す", () => {
  const col = ColElement.create({ width: "50%" });

  expect(ColElement.getWidth(col)).toBe("50%");
});

test("ColElement.getWidth() - width属性が0の場合は0pxを返す", () => {
  const col = ColElement.create({ width: 0 });

  expect(ColElement.getWidth(col)).toBe("0px");
});

test("ColElement.getWidth() - width属性がem単位の場合はそのまま返す", () => {
  const col = ColElement.create({ width: "10em" });

  expect(ColElement.getWidth(col)).toBe("10em");
});
