import { test, expect } from "vitest";
import { SupElement } from "../sup-element";

test("sup要素を正しく識別する", () => {
    const element = {
    type: "element" as const,
    tagName: "sup" as const,
    attributes: {},
    children: [],
    };
    expect(SupElement.isSupElement(element)).toBe(true);
});

test("タグ名が異なる要素を拒否する", () => {
    const element = {
    type: "element" as const,
    tagName: "sub" as const,
    attributes: {},
    children: [],
    };
    expect(SupElement.isSupElement(element)).toBe(false);
});

test("nullを拒否する", () => {
    expect(SupElement.isSupElement(null)).toBe(false);
});

test("undefinedを拒否する", () => {
    expect(SupElement.isSupElement(undefined)).toBe(false);
});

test("文字列を拒否する", () => {
    expect(SupElement.isSupElement("sup")).toBe(false);
});

test("数値を拒否する", () => {
    expect(SupElement.isSupElement(123)).toBe(false);
});
