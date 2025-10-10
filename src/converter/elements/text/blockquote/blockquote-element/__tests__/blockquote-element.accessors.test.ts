import { test, expect } from "vitest";
import { BlockquoteElement } from "../blockquote-element";
import type { BlockquoteAttributes } from "../../blockquote-attributes";

test("BlockquoteElement.getId - ID属性を取得できる", () => {
  const element = BlockquoteElement.create({ id: "quote-1" });
  expect(BlockquoteElement.getId(element)).toBe("quote-1");
});

test("BlockquoteElement.getId - ID属性がない場合はundefinedを返す", () => {
  const element = BlockquoteElement.create();
  expect(BlockquoteElement.getId(element)).toBeUndefined();
});

test("BlockquoteElement.getId - 空文字列のIDも取得できる", () => {
  const element = BlockquoteElement.create({ id: "" });
  expect(BlockquoteElement.getId(element)).toBe("");
});

test("BlockquoteElement.getClass - class属性を取得できる", () => {
  const element = BlockquoteElement.create({ class: "quote-block fancy" });
  expect(BlockquoteElement.getClass(element)).toBe("quote-block fancy");
});

test("BlockquoteElement.getClass - class属性がない場合はundefinedを返す", () => {
  const element = BlockquoteElement.create();
  expect(BlockquoteElement.getClass(element)).toBeUndefined();
});

test("BlockquoteElement.getClass - 複数のクラス名を含むclass属性を取得できる", () => {
  const element = BlockquoteElement.create({
    class: "text-lg font-italic border-left",
  });
  expect(BlockquoteElement.getClass(element)).toBe(
    "text-lg font-italic border-left",
  );
});

test("BlockquoteElement.getStyle - style属性を取得できる", () => {
  const element = BlockquoteElement.create({
    style: "margin-left: 40px; color: gray;",
  });
  expect(BlockquoteElement.getStyle(element)).toBe(
    "margin-left: 40px; color: gray;",
  );
});

test("BlockquoteElement.getStyle - style属性がない場合はundefinedを返す", () => {
  const element = BlockquoteElement.create();
  expect(BlockquoteElement.getStyle(element)).toBeUndefined();
});

test("BlockquoteElement.getStyle - 複雑なスタイル文字列も取得できる", () => {
  const complexStyle =
    "border-left: 4px solid #ccc; padding: 10px 20px; margin: 20px 0;";
  const element = BlockquoteElement.create({ style: complexStyle });
  expect(BlockquoteElement.getStyle(element)).toBe(complexStyle);
});

test("BlockquoteElement.getCite - cite属性を取得できる", () => {
  const element = BlockquoteElement.create({
    cite: "https://example.com/source",
  });
  expect(BlockquoteElement.getCite(element)).toBe("https://example.com/source");
});

test("BlockquoteElement.getCite - cite属性がない場合はundefinedを返す", () => {
  const element = BlockquoteElement.create();
  expect(BlockquoteElement.getCite(element)).toBeUndefined();
});

test("BlockquoteElement.getCite - 空文字列のciteも取得できる", () => {
  const element = BlockquoteElement.create({ cite: "" });
  expect(BlockquoteElement.getCite(element)).toBe("");
});

test("BlockquoteElement アクセサ - 全ての属性を個別に取得できる", () => {
  const attributes: Partial<BlockquoteAttributes> = {
    id: "main-quote",
    class: "quote-highlight",
    style: "font-style: italic;",
    cite: "https://example.com/famous-quotes",
  };
  const element = BlockquoteElement.create(attributes);

  expect(BlockquoteElement.getId(element)).toBe("main-quote");
  expect(BlockquoteElement.getClass(element)).toBe("quote-highlight");
  expect(BlockquoteElement.getStyle(element)).toBe("font-style: italic;");
  expect(BlockquoteElement.getCite(element)).toBe(
    "https://example.com/famous-quotes",
  );
});

test("BlockquoteElement アクセサ - 一部の属性のみが設定されている場合も正しく動作する", () => {
  const element = BlockquoteElement.create({ id: "only-id" });

  expect(BlockquoteElement.getId(element)).toBe("only-id");
  expect(BlockquoteElement.getClass(element)).toBeUndefined();
  expect(BlockquoteElement.getStyle(element)).toBeUndefined();
  expect(BlockquoteElement.getCite(element)).toBeUndefined();
});
