import { test, expect } from "vitest";
import type { AbbrAttributes } from "../abbr-attributes";

test("AbbrAttributes - title属性を含む場合 - title属性を取得できる", () => {
  const attributes: AbbrAttributes = {
    title: "HyperText Markup Language",
  };

  expect(attributes.title).toBe("HyperText Markup Language");
});

test("AbbrAttributes - グローバル属性を含む場合 - 全ての属性を取得できる", () => {
  const attributes: AbbrAttributes = {
    id: "html-abbr",
    class: "tech-term",
    style: "color: blue",
    title: "HyperText Markup Language",
  };

  expect(attributes.id).toBe("html-abbr");
  expect(attributes.class).toBe("tech-term");
  expect(attributes.style).toBe("color: blue");
  expect(attributes.title).toBe("HyperText Markup Language");
});

test("AbbrAttributes - title属性なしの場合 - undefinedを返す", () => {
  const attributes: AbbrAttributes = {
    id: "abbr-display",
  };

  expect(attributes.id).toBe("abbr-display");
  expect(attributes.title).toBeUndefined();
});
