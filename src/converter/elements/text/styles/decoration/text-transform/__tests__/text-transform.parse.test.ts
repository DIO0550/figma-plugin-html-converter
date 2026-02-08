import { test, expect } from "vitest";
import { TextTransform } from "../text-transform";

// valid transform values

test("TextTransform.parse - 'uppercase'を渡した場合 - UPPERCASEを返す", () => {
  const result = TextTransform.parse("uppercase");
  expect(result).toBe("UPPERCASE");
});

test("TextTransform.parse - 'lowercase'を渡した場合 - LOWERCASEを返す", () => {
  const result = TextTransform.parse("lowercase");
  expect(result).toBe("LOWERCASE");
});

test("TextTransform.parse - 'capitalize'を渡した場合 - CAPITALIZEを返す", () => {
  const result = TextTransform.parse("capitalize");
  expect(result).toBe("CAPITALIZE");
});

test("TextTransform.parse - 'none'を渡した場合 - ORIGINALを返す", () => {
  const result = TextTransform.parse("none");
  expect(result).toBe("ORIGINAL");
});

test("TextTransform.parse - 'full-width'を渡した場合 - undefinedを返す（未サポート）", () => {
  const result = TextTransform.parse("full-width");
  expect(result).toBeUndefined();
});

test("TextTransform.parse - 'full-size-kana'を渡した場合 - undefinedを返す（未サポート）", () => {
  const result = TextTransform.parse("full-size-kana");
  expect(result).toBeUndefined();
});

// case insensitivity

test("TextTransform.parse - 'UPPERCASE'を渡した場合 - 大文字小文字を区別せずUPPERCASEを返す", () => {
  const result = TextTransform.parse("UPPERCASE");
  expect(result).toBe("UPPERCASE");
});

test("TextTransform.parse - 'UpperCase'を渡した場合 - 大文字小文字を区別せずUPPERCASEを返す", () => {
  const result = TextTransform.parse("UpperCase");
  expect(result).toBe("UPPERCASE");
});

test("TextTransform.parse - 'LOWERCASE'を渡した場合 - 大文字小文字を区別せずLOWERCASEを返す", () => {
  const result = TextTransform.parse("LOWERCASE");
  expect(result).toBe("LOWERCASE");
});

test("TextTransform.parse - 'Capitalize'を渡した場合 - 大文字小文字を区別せずCAPITALIZEを返す", () => {
  const result = TextTransform.parse("Capitalize");
  expect(result).toBe("CAPITALIZE");
});

test("TextTransform.parse - 'NONE'を渡した場合 - 大文字小文字を区別せずORIGINALを返す", () => {
  const result = TextTransform.parse("NONE");
  expect(result).toBe("ORIGINAL");
});

// invalid and edge cases

test("TextTransform.parse - 空文字列を渡した場合 - undefinedを返す", () => {
  const result = TextTransform.parse("");
  expect(result).toBeUndefined();
});

test("TextTransform.parse - 空白文字のみを渡した場合 - undefinedを返す", () => {
  const result = TextTransform.parse("   ");
  expect(result).toBeUndefined();
});

test("TextTransform.parse - 無効な値を渡した場合 - undefinedを返す", () => {
  const result = TextTransform.parse("invalid");
  expect(result).toBeUndefined();
});

test("TextTransform.parse - CSS変数を渡した場合 - undefinedを返す", () => {
  const result = TextTransform.parse("var(--text-transform)");
  expect(result).toBeUndefined();
});

test("TextTransform.parse - inheritキーワードを渡した場合 - undefinedを返す", () => {
  const result = TextTransform.parse("inherit");
  expect(result).toBeUndefined();
});

test("TextTransform.parse - initialキーワードを渡した場合 - undefinedを返す", () => {
  const result = TextTransform.parse("initial");
  expect(result).toBeUndefined();
});

test("TextTransform.parse - unsetキーワードを渡した場合 - undefinedを返す", () => {
  const result = TextTransform.parse("unset");
  expect(result).toBeUndefined();
});
