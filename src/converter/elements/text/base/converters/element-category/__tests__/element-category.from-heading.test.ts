import { test, expect } from "vitest";
import { ElementCategory } from "../element-category";

// =============================================================================
// ElementCategory.from() - heading カテゴリのテスト
// =============================================================================

test("ElementCategory.from() - h1をheadingとして分類できる", () => {
  expect(ElementCategory.from("h1")).toBe("heading");
});

test("ElementCategory.from() - h2をheadingとして分類できる", () => {
  expect(ElementCategory.from("h2")).toBe("heading");
});

test("ElementCategory.from() - h3をheadingとして分類できる", () => {
  expect(ElementCategory.from("h3")).toBe("heading");
});

test("ElementCategory.from() - h4をheadingとして分類できる", () => {
  expect(ElementCategory.from("h4")).toBe("heading");
});

test("ElementCategory.from() - h5をheadingとして分類できる", () => {
  expect(ElementCategory.from("h5")).toBe("heading");
});

test("ElementCategory.from() - h6をheadingとして分類できる", () => {
  expect(ElementCategory.from("h6")).toBe("heading");
});

test("ElementCategory.from() - 大文字の見出し要素を正しく処理できる", () => {
  expect(ElementCategory.from("H1")).toBe("heading");
  expect(ElementCategory.from("H6")).toBe("heading");
});

test("ElementCategory.from() - 混合ケースの見出し要素を正しく処理できる", () => {
  expect(ElementCategory.from("H1")).toBe("heading");
  expect(ElementCategory.from("h2")).toBe("heading");
  expect(ElementCategory.from("H3")).toBe("heading");
});
