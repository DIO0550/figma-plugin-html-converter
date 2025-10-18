/**
 * @fileoverview DlAttributes のテスト
 */

import { test, expect } from "vitest";
import type { DlAttributes } from "../dl-attributes";

test("DlAttributes: can create empty attributes", () => {
  const attrs: DlAttributes = {};
  expect(attrs).toEqual({});
});

test("DlAttributes: inherits GlobalAttributes - id", () => {
  const attrs: DlAttributes = {
    id: "definitions-list",
  };
  expect(attrs.id).toBe("definitions-list");
});

test("DlAttributes: inherits GlobalAttributes - class", () => {
  const attrs: DlAttributes = {
    class: "glossary terms",
  };
  expect(attrs.class).toBe("glossary terms");
});

test("DlAttributes: inherits GlobalAttributes - style", () => {
  const attrs: DlAttributes = {
    style: "margin: 20px; padding: 10px;",
  };
  expect(attrs.style).toBe("margin: 20px; padding: 10px;");
});

test("DlAttributes: can combine multiple GlobalAttributes", () => {
  const attrs: DlAttributes = {
    id: "main-glossary",
    class: "definitions",
    style: "background-color: #f5f5f5;",
  };

  expect(attrs.id).toBe("main-glossary");
  expect(attrs.class).toBe("definitions");
  expect(attrs.style).toBe("background-color: #f5f5f5;");
});

test("DlAttributes: can set data attributes", () => {
  const attrs: DlAttributes = {
    "data-category": "technical",
    "data-count": "10",
  };

  expect(attrs["data-category"]).toBe("technical");
  expect(attrs["data-count"]).toBe("10");
});

test("DlAttributes: can set aria attributes", () => {
  const attrs: DlAttributes = {
    "aria-label": "Glossary of terms",
    "aria-describedby": "glossary-description",
    role: "list",
  };

  expect(attrs["aria-label"]).toBe("Glossary of terms");
  expect(attrs["aria-describedby"]).toBe("glossary-description");
  expect(attrs.role).toBe("list");
});
