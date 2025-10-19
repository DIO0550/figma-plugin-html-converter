/**
 * @fileoverview LiAttributes のテスト
 */

import { test, expect } from "vitest";
import type { LiAttributes } from "../li-attributes";

test("LiAttributes: can create empty attributes", () => {
  const attrs: LiAttributes = {};
  expect(attrs).toEqual({});
});

test("LiAttributes: can set value attribute", () => {
  const attrs: LiAttributes = {
    value: "5",
  };
  expect(attrs.value).toBe("5");
});

test("LiAttributes: inherits GlobalAttributes", () => {
  const attrs: LiAttributes = {
    id: "list-item-1",
    class: "item active",
    style: "color: red;",
    value: "3",
  };

  expect(attrs.id).toBe("list-item-1");
  expect(attrs.class).toBe("item active");
  expect(attrs.style).toBe("color: red;");
  expect(attrs.value).toBe("3");
});

test("LiAttributes: can be created without value attribute", () => {
  const attrs: LiAttributes = {
    id: "item",
    class: "list-item",
  };

  expect(attrs.value).toBeUndefined();
  expect(attrs.id).toBe("item");
  expect(attrs.class).toBe("list-item");
});

test("LiAttributes: can set data attributes", () => {
  const attrs: LiAttributes = {
    "data-index": "0",
    "data-value": "first",
    value: "1",
  };

  expect(attrs["data-index"]).toBe("0");
  expect(attrs["data-value"]).toBe("first");
  expect(attrs.value).toBe("1");
});

test("LiAttributes: can set aria attributes", () => {
  const attrs: LiAttributes = {
    "aria-label": "First item",
    "aria-current": "page",
    role: "listitem",
  };

  expect(attrs["aria-label"]).toBe("First item");
  expect(attrs["aria-current"]).toBe("page");
  expect(attrs.role).toBe("listitem");
});
