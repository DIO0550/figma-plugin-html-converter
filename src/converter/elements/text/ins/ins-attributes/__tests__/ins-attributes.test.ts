import { test, expect } from "vitest";
import type { InsAttributes } from "../ins-attributes";

test("InsAttributes - グローバル属性を含む", () => {
  const attributes: InsAttributes = {
    id: "ins-1",
    class: "inserted-text",
    style: "text-decoration: line-through;",
  };

  expect(attributes.id).toBe("ins-1");
  expect(attributes.class).toBe("inserted-text");
  expect(attributes.style).toBe("text-decoration: line-through;");
});

test("InsAttributes - cite属性を持つ", () => {
  const attributes: InsAttributes = {
    cite: "https://example.com/reason",
  };

  expect(attributes.cite).toBe("https://example.com/reason");
});

test("InsAttributes - datetime属性を持つ", () => {
  const attributes: InsAttributes = {
    datetime: "2024-01-01T12:00:00Z",
  };

  expect(attributes.datetime).toBe("2024-01-01T12:00:00Z");
});

test("InsAttributes - すべての属性がオプション", () => {
  const attributes: InsAttributes = {};
  expect(attributes).toEqual({});
});

test("InsAttributes - グローバル属性とdel特有の属性を組み合わせる", () => {
  const attributes: InsAttributes = {
    id: "ins-1",
    class: "inserted",
    style: "color: red;",
    cite: "https://example.com/changelog",
    datetime: "2024-01-01",
  };

  expect(attributes.id).toBe("ins-1");
  expect(attributes.class).toBe("inserted");
  expect(attributes.style).toBe("color: red;");
  expect(attributes.cite).toBe("https://example.com/changelog");
  expect(attributes.datetime).toBe("2024-01-01");
});

test("InsAttributes - data属性を持つ", () => {
  const attributes: InsAttributes = {
    "data-reason": "obsolete",
    "data-version": "2.0",
  };

  expect(attributes["data-reason"]).toBe("obsolete");
  expect(attributes["data-version"]).toBe("2.0");
});

test("InsAttributes - aria属性を持つ", () => {
  const attributes: InsAttributes = {
    "aria-label": "挿入されたテキスト",
    "aria-hidden": "false",
  };

  expect(attributes["aria-label"]).toBe("挿入されたテキスト");
  expect(attributes["aria-hidden"]).toBe("false");
});

test("InsAttributes - title属性を持つ", () => {
  const attributes: InsAttributes = {
    title: "このテキストは挿入されました",
  };

  expect(attributes.title).toBe("このテキストは挿入されました");
});

test("InsAttributes - lang属性を持つ", () => {
  const attributes: InsAttributes = {
    lang: "ja",
  };

  expect(attributes.lang).toBe("ja");
});

test("InsAttributes - dir属性を持つ", () => {
  const attributes: InsAttributes = {
    dir: "ltr",
  };

  expect(attributes.dir).toBe("ltr");
});
