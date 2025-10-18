/**
 * @fileoverview DtAttributes のテスト
 */

import { test, expect } from "vitest";
import type { DtAttributes } from "../dt-attributes";

test("DtAttributes: can create empty attributes", () => {
  const attrs: DtAttributes = {};
  expect(attrs).toEqual({});
});

test("DtAttributes: inherits GlobalAttributes - id", () => {
  const attrs: DtAttributes = {
    id: "term-1",
  };
  expect(attrs.id).toBe("term-1");
});

test("DtAttributes: inherits GlobalAttributes - class", () => {
  const attrs: DtAttributes = {
    class: "term glossary-term",
  };
  expect(attrs.class).toBe("term glossary-term");
});

test("DtAttributes: inherits GlobalAttributes - style", () => {
  const attrs: DtAttributes = {
    style: "font-weight: bold; color: #333;",
  };
  expect(attrs.style).toBe("font-weight: bold; color: #333;");
});

test("DtAttributes: can combine multiple GlobalAttributes", () => {
  const attrs: DtAttributes = {
    id: "api-term",
    class: "technical-term",
    style: "text-transform: uppercase;",
  };

  expect(attrs.id).toBe("api-term");
  expect(attrs.class).toBe("technical-term");
  expect(attrs.style).toBe("text-transform: uppercase;");
});

test("DtAttributes: can set data attributes", () => {
  const attrs: DtAttributes = {
    "data-term-id": "123",
    "data-definition-count": "3",
  };

  expect(attrs["data-term-id"]).toBe("123");
  expect(attrs["data-definition-count"]).toBe("3");
});

test("DtAttributes: can set aria attributes", () => {
  const attrs: DtAttributes = {
    "aria-label": "Definition term",
    "aria-expanded": "false",
    role: "term",
  };

  expect(attrs["aria-label"]).toBe("Definition term");
  expect(attrs["aria-expanded"]).toBe("false");
  expect(attrs.role).toBe("term");
});
