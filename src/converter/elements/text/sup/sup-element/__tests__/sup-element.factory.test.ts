import { test, expect } from "vitest";
import { SupElement } from "../sup-element";

test("デフォルトのSupElementを作成する", () => {
    const element = SupElement.create();
    expect(element).toEqual({
    type: "element",
    tagName: "sup",
    attributes: {},
    children: [],
    });
});

test("属性を持つSupElementを作成する", () => {
    const attributes = {
    id: "sup-1",
    class: "superscript",
    };
    const element = SupElement.create(attributes);
    expect(element).toEqual({
    type: "element",
    tagName: "sup",
    attributes,
    children: [],
    });
});

test("子要素を持つSupElementを作成する", () => {
    const children = [{ type: "text" as const, content: "2" }];
    const element = SupElement.create({}, children);
    expect(element).toEqual({
    type: "element",
    tagName: "sup",
    attributes: {},
    children,
    });
});

test("属性と子要素の両方を持つSupElementを作成する", () => {
    const attributes = { id: "exponent" };
    const children = [{ type: "text" as const, content: "n" }];
    const element = SupElement.create(attributes, children);
    expect(element).toEqual({
    type: "element",
    tagName: "sup",
    attributes,
    children,
    });
});
