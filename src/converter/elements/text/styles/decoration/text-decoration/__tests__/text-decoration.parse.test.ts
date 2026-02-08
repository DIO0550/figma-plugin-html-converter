import { test, expect } from "vitest";
import { TextDecoration } from "../text-decoration";

test("TextDecoration.parse - 'underline'の場合 - UNDERLINEを返す", () => {
  const result = TextDecoration.parse("underline");
  expect(result).toBe("UNDERLINE");
});

test("TextDecoration.parse - 'line-through'の場合 - STRIKETHROUGHを返す", () => {
  const result = TextDecoration.parse("line-through");
  expect(result).toBe("STRIKETHROUGH");
});

test("TextDecoration.parse - 'overline'の場合 - undefinedを返す（Figma未サポート）", () => {
  const result = TextDecoration.parse("overline");
  expect(result).toBeUndefined();
});

test("TextDecoration.parse - 'none'の場合 - undefinedを返す", () => {
  const result = TextDecoration.parse("none");
  expect(result).toBeUndefined();
});

test("TextDecoration.parse - 'underline line-through'の場合 - UNDERLINE（最初のサポート値）を返す", () => {
  const result = TextDecoration.parse("underline line-through");
  expect(result).toBe("UNDERLINE");
});

test("TextDecoration.parse - 'line-through underline'の場合 - STRIKETHROUGH（最初のサポート値）を返す", () => {
  const result = TextDecoration.parse("line-through underline");
  expect(result).toBe("STRIKETHROUGH");
});

test("TextDecoration.parse - 'overline underline'の場合 - UNDERLINEを返す（未サポートをスキップ）", () => {
  const result = TextDecoration.parse("overline underline");
  expect(result).toBe("UNDERLINE");
});

test("TextDecoration.parse - 空文字列の場合 - undefinedを返す", () => {
  const result = TextDecoration.parse("");
  expect(result).toBeUndefined();
});

test("TextDecoration.parse - ホワイトスペースのみの場合 - undefinedを返す", () => {
  const result = TextDecoration.parse("   ");
  expect(result).toBeUndefined();
});

test("TextDecoration.parse - 無効な値の場合 - undefinedを返す", () => {
  const result = TextDecoration.parse("invalid");
  expect(result).toBeUndefined();
});

test("TextDecoration.parse - CSS変数の場合 - undefinedを返す", () => {
  const result = TextDecoration.parse("var(--text-decoration)");
  expect(result).toBeUndefined();
});

test("TextDecoration.parse - inheritキーワードの場合 - undefinedを返す", () => {
  const result = TextDecoration.parse("inherit");
  expect(result).toBeUndefined();
});

test("TextDecoration.parse - initialキーワードの場合 - undefinedを返す", () => {
  const result = TextDecoration.parse("initial");
  expect(result).toBeUndefined();
});

test("TextDecoration.parse - unsetキーワードの場合 - undefinedを返す", () => {
  const result = TextDecoration.parse("unset");
  expect(result).toBeUndefined();
});

test("TextDecoration.parse - 'UNDERLINE'大文字の場合 - 大文字小文字を区別せずUNDERLINEを返す", () => {
  const result = TextDecoration.parse("UNDERLINE");
  expect(result).toBe("UNDERLINE");
});

test("TextDecoration.parse - 'UnderLine'混合ケースの場合 - 大文字小文字を区別せずUNDERLINEを返す", () => {
  const result = TextDecoration.parse("UnderLine");
  expect(result).toBe("UNDERLINE");
});

test("TextDecoration.parse - 'LINE-THROUGH'大文字の場合 - 大文字小文字を区別せずSTRIKETHROUGHを返す", () => {
  const result = TextDecoration.parse("LINE-THROUGH");
  expect(result).toBe("STRIKETHROUGH");
});
