/**
 * @fileoverview OlAttributes のテスト
 */

import { test, expect } from "vitest";
import type { OlAttributes } from "../ol-attributes";

test("OlAttributes: can create empty attributes", () => {
  const attrs: OlAttributes = {};
  expect(attrs).toEqual({});
});

test("OlAttributes: can set start attribute", () => {
  const attrs: OlAttributes = {
    start: "5",
  };
  expect(attrs.start).toBe("5");
});

test("OlAttributes: can set reversed attribute", () => {
  const attrs: OlAttributes = {
    reversed: "",
  };
  expect(attrs.reversed).toBe("");
});

test("OlAttributes: can set type attribute with numeric format", () => {
  const attrs: OlAttributes = {
    type: "1",
  };
  expect(attrs.type).toBe("1");
});

test("OlAttributes: can set type attribute with lowercase alpha format", () => {
  const attrs: OlAttributes = {
    type: "a",
  };
  expect(attrs.type).toBe("a");
});

test("OlAttributes: can set type attribute with uppercase alpha format", () => {
  const attrs: OlAttributes = {
    type: "A",
  };
  expect(attrs.type).toBe("A");
});

test("OlAttributes: can set type attribute with lowercase roman format", () => {
  const attrs: OlAttributes = {
    type: "i",
  };
  expect(attrs.type).toBe("i");
});

test("OlAttributes: can set type attribute with uppercase roman format", () => {
  const attrs: OlAttributes = {
    type: "I",
  };
  expect(attrs.type).toBe("I");
});

test("OlAttributes: inherits GlobalAttributes", () => {
  const attrs: OlAttributes = {
    id: "my-list",
    class: "ordered-list",
    style: "padding: 10px;",
    start: "3",
    type: "A",
    reversed: "",
  };

  expect(attrs.id).toBe("my-list");
  expect(attrs.class).toBe("ordered-list");
  expect(attrs.style).toBe("padding: 10px;");
  expect(attrs.start).toBe("3");
  expect(attrs.type).toBe("A");
  expect(attrs.reversed).toBe("");
});
