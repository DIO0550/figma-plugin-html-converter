import { test, expect } from "vitest";
import { TextDecoration } from "../text-decoration";

type StyleObject = Record<string, unknown>;

test("TextDecoration.extractStyle - スタイルオブジェクトからtextDecorationを抽出する場合 - UNDERLINEを返す", () => {
  const style: StyleObject = { textDecoration: "underline" };
  const result = TextDecoration.extractStyle(style);
  expect(result).toBe("UNDERLINE");
});

test("TextDecoration.extractStyle - ケバブケースプロパティの場合 - STRIKETHROUGHを返す", () => {
  const style: StyleObject = { "text-decoration": "line-through" };
  const result = TextDecoration.extractStyle(style);
  expect(result).toBe("STRIKETHROUGH");
});

test("TextDecoration.extractStyle - textDecorationとtext-decorationが両方ある場合 - textDecorationを優先する", () => {
  const style: StyleObject = {
    textDecoration: "underline",
    "text-decoration": "line-through",
  };
  const result = TextDecoration.extractStyle(style);
  expect(result).toBe("UNDERLINE");
});

test("TextDecoration.extractStyle - decorationプロパティが存在しない場合 - undefinedを返す", () => {
  const style: StyleObject = { color: "red" };
  const result = TextDecoration.extractStyle(style);
  expect(result).toBeUndefined();
});

test("TextDecoration.extractStyle - 空のスタイルオブジェクトの場合 - undefinedを返す", () => {
  const style: StyleObject = {};
  const result = TextDecoration.extractStyle(style);
  expect(result).toBeUndefined();
});
