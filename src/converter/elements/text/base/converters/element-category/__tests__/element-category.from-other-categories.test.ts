import { test, expect } from "vitest";
import { ElementCategory } from "../element-category";

// =============================================================================
// ElementCategory.from() - その他のカテゴリのテスト
// =============================================================================

// Code カテゴリ
test("ElementCategory.from() - codeをcodeとして分類できる", () => {
  expect(ElementCategory.from("code")).toBe("code");
});

test("ElementCategory.from() - preをcodeとして分類できる", () => {
  expect(ElementCategory.from("pre")).toBe("code");
});

test("ElementCategory.from() - kbdをcodeとして分類できる", () => {
  expect(ElementCategory.from("kbd")).toBe("code");
});

test("ElementCategory.from() - sampをcodeとして分類できる", () => {
  expect(ElementCategory.from("samp")).toBe("code");
});

test("ElementCategory.from() - varをcodeとして分類できる", () => {
  expect(ElementCategory.from("var")).toBe("code");
});

// Quote カテゴリ
test("ElementCategory.from() - blockquoteをquoteとして分類できる", () => {
  expect(ElementCategory.from("blockquote")).toBe("quote");
});

test("ElementCategory.from() - qをquoteとして分類できる", () => {
  expect(ElementCategory.from("q")).toBe("quote");
});

// List カテゴリ
test("ElementCategory.from() - ulをlistとして分類できる", () => {
  expect(ElementCategory.from("ul")).toBe("list");
});

test("ElementCategory.from() - olをlistとして分類できる", () => {
  expect(ElementCategory.from("ol")).toBe("list");
});

test("ElementCategory.from() - liをlistとして分類できる", () => {
  expect(ElementCategory.from("li")).toBe("list");
});

test("ElementCategory.from() - dlをlistとして分類できる", () => {
  expect(ElementCategory.from("dl")).toBe("list");
});

test("ElementCategory.from() - dtをlistとして分類できる", () => {
  expect(ElementCategory.from("dt")).toBe("list");
});

test("ElementCategory.from() - ddをlistとして分類できる", () => {
  expect(ElementCategory.from("dd")).toBe("list");
});

// Paragraph カテゴリ（デフォルト）
test("ElementCategory.from() - pをparagraphとして分類できる", () => {
  expect(ElementCategory.from("p")).toBe("paragraph");
});

test("ElementCategory.from() - divをparagraphとして分類できる", () => {
  expect(ElementCategory.from("div")).toBe("paragraph");
});

test("ElementCategory.from() - sectionをparagraphとして分類できる", () => {
  expect(ElementCategory.from("section")).toBe("paragraph");
});

test("ElementCategory.from() - articleをparagraphとして分類できる", () => {
  expect(ElementCategory.from("article")).toBe("paragraph");
});

test("ElementCategory.from() - asideをparagraphとして分類できる", () => {
  expect(ElementCategory.from("aside")).toBe("paragraph");
});

test("ElementCategory.from() - navをparagraphとして分類できる", () => {
  expect(ElementCategory.from("nav")).toBe("paragraph");
});

test("ElementCategory.from() - headerをparagraphとして分類できる", () => {
  expect(ElementCategory.from("header")).toBe("paragraph");
});

test("ElementCategory.from() - footerをparagraphとして分類できる", () => {
  expect(ElementCategory.from("footer")).toBe("paragraph");
});

test("ElementCategory.from() - mainをparagraphとして分類できる", () => {
  expect(ElementCategory.from("main")).toBe("paragraph");
});

// エッジケース
test("ElementCategory.from() - undefinedをparagraphとして分類できる", () => {
  expect(ElementCategory.from(undefined)).toBe("paragraph");
});

test("ElementCategory.from() - 空文字列をparagraphとして分類できる", () => {
  expect(ElementCategory.from("")).toBe("paragraph");
});

test("ElementCategory.from() - 不明な要素をparagraphとして分類できる", () => {
  expect(ElementCategory.from("unknown")).toBe("paragraph");
  expect(ElementCategory.from("custom-element")).toBe("paragraph");
});
