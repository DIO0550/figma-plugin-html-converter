/**
 * @fileoverview DdAttributes のテスト
 */

import { test, expect } from "vitest";
import type { DdAttributes } from "../dd-attributes";

test("DdAttributes: can create empty attributes", () => {
  const attrs: DdAttributes = {};
  expect(attrs).toEqual({});
});

test("DdAttributes: inherits GlobalAttributes - id", () => {
  const attrs: DdAttributes = {
    id: "definition-1",
  };
  expect(attrs.id).toBe("definition-1");
});

test("DdAttributes: inherits GlobalAttributes - class", () => {
  const attrs: DdAttributes = {
    class: "definition description",
  };
  expect(attrs.class).toBe("definition description");
});

test("DdAttributes: inherits GlobalAttributes - style", () => {
  const attrs: DdAttributes = {
    style: "margin-left: 20px; color: #666;",
  };
  expect(attrs.style).toBe("margin-left: 20px; color: #666;");
});

test("DdAttributes: can combine multiple GlobalAttributes", () => {
  const attrs: DdAttributes = {
    id: "api-definition",
    class: "technical-definition",
    style: "font-style: italic;",
  };

  expect(attrs.id).toBe("api-definition");
  expect(attrs.class).toBe("technical-definition");
  expect(attrs.style).toBe("font-style: italic;");
});

test("DdAttributes: can set data attributes", () => {
  const attrs: DdAttributes = {
    "data-definition-id": "456",
    "data-term-ref": "api-term",
  };

  expect(attrs["data-definition-id"]).toBe("456");
  expect(attrs["data-term-ref"]).toBe("api-term");
});

test("DdAttributes: can set aria attributes", () => {
  const attrs: DdAttributes = {
    "aria-label": "Definition description",
    "aria-describedby": "term-1",
    role: "definition",
  };

  expect(attrs["aria-label"]).toBe("Definition description");
  expect(attrs["aria-describedby"]).toBe("term-1");
  expect(attrs.role).toBe("definition");
});
