import { test, expect } from "vitest";
import { TextTransform } from "../text-transform";

type StyleObject = Record<string, unknown>;

test("TextTransform.extractStyle - スタイルオブジェクトにtextTransformがある場合 - 変換値を返す", () => {
  const style: StyleObject = { textTransform: "uppercase" };
  const result = TextTransform.extractStyle(style);
  expect(result).toBe("UPPERCASE");
});

test("TextTransform.extractStyle - ケバブケースのtext-transformプロパティがある場合 - 変換値を返す", () => {
  const style: StyleObject = { "text-transform": "lowercase" };
  const result = TextTransform.extractStyle(style);
  expect(result).toBe("LOWERCASE");
});

test("TextTransform.extractStyle - textTransformとtext-transformの両方がある場合 - textTransformを優先する", () => {
  const style: StyleObject = {
    textTransform: "uppercase",
    "text-transform": "lowercase",
  };
  const result = TextTransform.extractStyle(style);
  expect(result).toBe("UPPERCASE");
});

test("TextTransform.extractStyle - transformプロパティが存在しない場合 - undefinedを返す", () => {
  const style: StyleObject = { color: "red" };
  const result = TextTransform.extractStyle(style);
  expect(result).toBeUndefined();
});

test("TextTransform.extractStyle - 空のスタイルオブジェクトの場合 - undefinedを返す", () => {
  const style: StyleObject = {};
  const result = TextTransform.extractStyle(style);
  expect(result).toBeUndefined();
});
