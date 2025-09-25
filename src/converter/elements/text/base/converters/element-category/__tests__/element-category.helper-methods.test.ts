import { test, expect } from "vitest";
import { ElementCategory } from "../element-category";

// =============================================================================
// ElementCategory ヘルパーメソッドのテスト
// =============================================================================

// isHeading
test("ElementCategory.isHeading() - h1に対してtrueを返す", () => {
  expect(ElementCategory.isHeading("h1")).toBe(true);
});

test("ElementCategory.isHeading() - pに対してfalseを返す", () => {
  expect(ElementCategory.isHeading("p")).toBe(false);
});

test("ElementCategory.isHeading() - undefinedに対してfalseを返す", () => {
  expect(ElementCategory.isHeading(undefined)).toBe(false);
});

// isParagraph
test("ElementCategory.isParagraph() - pに対してtrueを返す", () => {
  expect(ElementCategory.isParagraph("p")).toBe(true);
});

test("ElementCategory.isParagraph() - divに対してtrueを返す", () => {
  expect(ElementCategory.isParagraph("div")).toBe(true);
});

test("ElementCategory.isParagraph() - h1に対してfalseを返す", () => {
  expect(ElementCategory.isParagraph("h1")).toBe(false);
});

// isInline
test("ElementCategory.isInline() - spanに対してtrueを返す", () => {
  expect(ElementCategory.isInline("span")).toBe(true);
});

test("ElementCategory.isInline() - aに対してtrueを返す", () => {
  expect(ElementCategory.isInline("a")).toBe(true);
});

test("ElementCategory.isInline() - pに対してfalseを返す", () => {
  expect(ElementCategory.isInline("p")).toBe(false);
});

// isCode
test("ElementCategory.isCode() - codeに対してtrueを返す", () => {
  expect(ElementCategory.isCode("code")).toBe(true);
});

test("ElementCategory.isCode() - preに対してtrueを返す", () => {
  expect(ElementCategory.isCode("pre")).toBe(true);
});

test("ElementCategory.isCode() - pに対してfalseを返す", () => {
  expect(ElementCategory.isCode("p")).toBe(false);
});

// isQuote
test("ElementCategory.isQuote() - blockquoteに対してtrueを返す", () => {
  expect(ElementCategory.isQuote("blockquote")).toBe(true);
});

test("ElementCategory.isQuote() - qに対してtrueを返す", () => {
  expect(ElementCategory.isQuote("q")).toBe(true);
});

test("ElementCategory.isQuote() - pに対してfalseを返す", () => {
  expect(ElementCategory.isQuote("p")).toBe(false);
});

// isList
test("ElementCategory.isList() - ulに対してtrueを返す", () => {
  expect(ElementCategory.isList("ul")).toBe(true);
});

test("ElementCategory.isList() - liに対してtrueを返す", () => {
  expect(ElementCategory.isList("li")).toBe(true);
});

test("ElementCategory.isList() - pに対してfalseを返す", () => {
  expect(ElementCategory.isList("p")).toBe(false);
});
