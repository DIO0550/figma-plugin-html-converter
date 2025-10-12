import { test, expect } from "vitest";
import type { SupAttributes } from "../sup-attributes";

test("グローバル属性を含む", () => {
  const attributes: SupAttributes = {
    id: "sup-1",
    class: "superscript",
    style: "vertical-align: super;",
  };

  expect(attributes.id).toBe("sup-1");
  expect(attributes.class).toBe("superscript");
  expect(attributes.style).toBe("vertical-align: super;");
});

test("すべての属性がオプション", () => {
  const attributes: SupAttributes = {};
  expect(attributes).toEqual({});
});

test("data属性を持つ", () => {
  const attributes: SupAttributes = {
    "data-exponent": "2",
  };
  expect(attributes["data-exponent"]).toBe("2");
});

test("aria属性を持つ", () => {
  const attributes: SupAttributes = {
    "aria-label": "上付き文字",
  };
  expect(attributes["aria-label"]).toBe("上付き文字");
});

test("title属性を持つ", () => {
  const attributes: SupAttributes = {
    title: "指数表記",
  };
  expect(attributes.title).toBe("指数表記");
});
