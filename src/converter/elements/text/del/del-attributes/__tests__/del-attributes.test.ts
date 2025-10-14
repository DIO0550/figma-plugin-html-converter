import { test, expect } from "vitest";
import type { DelAttributes } from "../del-attributes";

test("DelAttributes - グローバル属性を含む", () => {
  const attributes: DelAttributes = {
    id: "del-1",
    class: "deleted-text",
    style: "text-decoration: line-through;",
  };

  expect(attributes.id).toBe("del-1");
  expect(attributes.class).toBe("deleted-text");
  expect(attributes.style).toBe("text-decoration: line-through;");
});

test("DelAttributes - cite属性を持つ", () => {
  const attributes: DelAttributes = {
    cite: "https://example.com/reason",
  };

  expect(attributes.cite).toBe("https://example.com/reason");
});

test("DelAttributes - datetime属性を持つ", () => {
  const attributes: DelAttributes = {
    datetime: "2024-01-01T12:00:00Z",
  };

  expect(attributes.datetime).toBe("2024-01-01T12:00:00Z");
});

test("DelAttributes - すべての属性がオプション", () => {
  const attributes: DelAttributes = {};
  expect(attributes).toEqual({});
});

test("DelAttributes - グローバル属性とdel特有の属性を組み合わせる", () => {
  const attributes: DelAttributes = {
    id: "del-1",
    class: "deleted",
    style: "color: red;",
    cite: "https://example.com/changelog",
    datetime: "2024-01-01",
  };

  expect(attributes.id).toBe("del-1");
  expect(attributes.class).toBe("deleted");
  expect(attributes.style).toBe("color: red;");
  expect(attributes.cite).toBe("https://example.com/changelog");
  expect(attributes.datetime).toBe("2024-01-01");
});

test("DelAttributes - data属性を持つ", () => {
  const attributes: DelAttributes = {
    "data-reason": "obsolete",
    "data-version": "2.0",
  };

  expect(attributes["data-reason"]).toBe("obsolete");
  expect(attributes["data-version"]).toBe("2.0");
});

test("DelAttributes - aria属性を持つ", () => {
  const attributes: DelAttributes = {
    "aria-label": "削除されたテキスト",
    "aria-hidden": "false",
  };

  expect(attributes["aria-label"]).toBe("削除されたテキスト");
  expect(attributes["aria-hidden"]).toBe("false");
});

test("DelAttributes - title属性を持つ", () => {
  const attributes: DelAttributes = {
    title: "このテキストは削除されました",
  };

  expect(attributes.title).toBe("このテキストは削除されました");
});

test("DelAttributes - lang属性を持つ", () => {
  const attributes: DelAttributes = {
    lang: "ja",
  };

  expect(attributes.lang).toBe("ja");
});

test("DelAttributes - dir属性を持つ", () => {
  const attributes: DelAttributes = {
    dir: "ltr",
  };

  expect(attributes.dir).toBe("ltr");
});
