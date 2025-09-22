import { test, expect } from "vitest";
import { ElementCategory } from "../element-category";

// =============================================================================
// ElementCategory.from() - inline カテゴリのテスト
// =============================================================================

test("ElementCategory.from() - spanをinlineとして分類できる", () => {
  expect(ElementCategory.from("span")).toBe("inline");
});

test("ElementCategory.from() - aをinlineとして分類できる", () => {
  expect(ElementCategory.from("a")).toBe("inline");
});

test("ElementCategory.from() - markをinlineとして分類できる", () => {
  expect(ElementCategory.from("mark")).toBe("inline");
});

test("ElementCategory.from() - abbrをinlineとして分類できる", () => {
  expect(ElementCategory.from("abbr")).toBe("inline");
});

test("ElementCategory.from() - citeをinlineとして分類できる", () => {
  expect(ElementCategory.from("cite")).toBe("inline");
});

test("ElementCategory.from() - smallをinlineとして分類できる", () => {
  expect(ElementCategory.from("small")).toBe("inline");
});

test("ElementCategory.from() - subをinlineとして分類できる", () => {
  expect(ElementCategory.from("sub")).toBe("inline");
});

test("ElementCategory.from() - supをinlineとして分類できる", () => {
  expect(ElementCategory.from("sup")).toBe("inline");
});
