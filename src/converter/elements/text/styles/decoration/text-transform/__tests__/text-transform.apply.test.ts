import { test, expect } from "vitest";
import { TextTransform } from "../text-transform";

test("TextTransform.apply - テキストをuppercaseに変換した場合 - 全て大文字になる", () => {
  const result = TextTransform.apply("hello world", "UPPERCASE");
  expect(result).toBe("HELLO WORLD");
});

test("TextTransform.apply - テキストをlowercaseに変換した場合 - 全て小文字になる", () => {
  const result = TextTransform.apply("HELLO WORLD", "LOWERCASE");
  expect(result).toBe("hello world");
});

test("TextTransform.apply - テキストをcapitalizeに変換した場合 - 各単語の先頭が大文字になる", () => {
  const result = TextTransform.apply("hello world", "CAPITALIZE");
  expect(result).toBe("Hello World");
});

test("TextTransform.apply - ORIGINALを指定した場合 - 元のテキストをそのまま返す", () => {
  const result = TextTransform.apply("HeLLo WoRLD", "ORIGINAL");
  expect(result).toBe("HeLLo WoRLD");
});

test("TextTransform.apply - undefinedを指定した場合 - 元のテキストをそのまま返す", () => {
  const result = TextTransform.apply("HeLLo WoRLD", undefined);
  expect(result).toBe("HeLLo WoRLD");
});

test("TextTransform.apply - 空文字列を渡した場合 - 空文字列を返す", () => {
  expect(TextTransform.apply("", "UPPERCASE")).toBe("");
  expect(TextTransform.apply("", "LOWERCASE")).toBe("");
  expect(TextTransform.apply("", "CAPITALIZE")).toBe("");
  expect(TextTransform.apply("", "ORIGINAL")).toBe("");
});

test("TextTransform.apply - 1文字を渡した場合 - 正しく変換する", () => {
  expect(TextTransform.apply("a", "UPPERCASE")).toBe("A");
  expect(TextTransform.apply("A", "LOWERCASE")).toBe("a");
  expect(TextTransform.apply("a", "CAPITALIZE")).toBe("A");
  expect(TextTransform.apply("A", "ORIGINAL")).toBe("A");
});

test("TextTransform.apply - 特殊文字と数字を含むテキストの場合 - 正しく変換する", () => {
  const text = "123 ABC! @#$ xyz";
  expect(TextTransform.apply(text, "UPPERCASE")).toBe("123 ABC! @#$ XYZ");
  expect(TextTransform.apply(text, "LOWERCASE")).toBe("123 abc! @#$ xyz");
  expect(TextTransform.apply(text, "CAPITALIZE")).toBe("123 Abc! @#$ Xyz");
  expect(TextTransform.apply(text, "ORIGINAL")).toBe(text);
});

test("TextTransform.apply - capitalizeで複数スペースがある場合 - 正しく変換する", () => {
  const result = TextTransform.apply("hello   world", "CAPITALIZE");
  expect(result).toBe("Hello   World");
});

test("TextTransform.apply - capitalizeで句読点の後の場合 - 正しく大文字化する", () => {
  const result = TextTransform.apply("hello. world! test", "CAPITALIZE");
  expect(result).toBe("Hello. World! Test");
});
