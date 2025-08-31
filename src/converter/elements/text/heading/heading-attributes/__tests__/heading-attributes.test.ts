import { test, expect } from "vitest";
import type { HeadingAttributes } from "../heading-attributes";

test("HeadingAttributes - GlobalAttributesを継承している", () => {
  const attributes: HeadingAttributes = {
    id: "heading-1",
    class: "title",
    style: "color: red;",
  };

  expect(attributes.id).toBe("heading-1");
  expect(attributes.class).toBe("title");
  expect(attributes.style).toBe("color: red;");
});

test("HeadingAttributes - 任意のカスタム属性を設定できる", () => {
  const attributes: HeadingAttributes = {
    "data-level": "1",
    "aria-label": "Main heading",
  };

  expect(attributes["data-level"]).toBe("1");
  expect(attributes["aria-label"]).toBe("Main heading");
});

test("HeadingAttributes - 空のオブジェクトも有効", () => {
  const attributes: HeadingAttributes = {};
  expect(attributes).toEqual({});
});
