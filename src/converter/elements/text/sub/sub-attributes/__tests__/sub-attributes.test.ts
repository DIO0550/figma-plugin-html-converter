import { test, expect } from "vitest";
import type { SubAttributes } from "../sub-attributes";

test("グローバル属性を含む", () => {
  const attributes: SubAttributes = {
    id: "sub-1",
    class: "subscript",
    style: "vertical-align: sub;",
  };

  expect(attributes.id).toBe("sub-1");
  expect(attributes.class).toBe("subscript");
  expect(attributes.style).toBe("vertical-align: sub;");
});

test("すべての属性がオプション", () => {
  const attributes: SubAttributes = {};
  expect(attributes).toEqual({});
});

test("data属性を持つ", () => {
  const attributes: SubAttributes = {
    "data-formula": "H2O",
  };
  expect(attributes["data-formula"]).toBe("H2O");
});

test("aria属性を持つ", () => {
  const attributes: SubAttributes = {
    "aria-label": "下付き文字",
  };
  expect(attributes["aria-label"]).toBe("下付き文字");
});

test("title属性を持つ", () => {
  const attributes: SubAttributes = {
    title: "化学式の下付き文字",
  };
  expect(attributes.title).toBe("化学式の下付き文字");
});
