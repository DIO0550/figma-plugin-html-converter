import { describe, it, expect } from "vitest";
import { PElement } from "../p-element";

describe("PElement 型ガード", () => {
  describe("isPElement", () => {
    it("有効なPElement要素を正しく識別する", () => {
      const validElement = {
        type: "element",
        tagName: "p",
        attributes: {},
        children: [],
      };

      expect(PElement.isPElement(validElement)).toBe(true);
    });

    it("子要素を持つPElementを正しく識別する", () => {
      const elementWithChildren = {
        type: "element",
        tagName: "p",
        attributes: { class: "paragraph" },
        children: [{ type: "text", content: "Hello World" }],
      };

      expect(PElement.isPElement(elementWithChildren)).toBe(true);
    });

    it("tagNameが異なる要素を拒否する", () => {
      const divElement = {
        type: "element",
        tagName: "div",
        attributes: {},
        children: [],
      };

      expect(PElement.isPElement(divElement)).toBe(false);
    });

    it("typeが異なる要素を拒否する", () => {
      const textNode = {
        type: "text",
        content: "Some text",
      };

      expect(PElement.isPElement(textNode)).toBe(false);
    });

    it("nullを拒否する", () => {
      expect(PElement.isPElement(null)).toBe(false);
    });

    it("undefinedを拒否する", () => {
      expect(PElement.isPElement(undefined)).toBe(false);
    });

    it("文字列を拒否する", () => {
      expect(PElement.isPElement("p")).toBe(false);
    });

    it("数値を拒否する", () => {
      expect(PElement.isPElement(123)).toBe(false);
    });

    it("配列を拒否する", () => {
      expect(PElement.isPElement([])).toBe(false);
    });

    it("tagNameプロパティがない要素を拒否する", () => {
      const invalidElement = {
        type: "element",
        attributes: {},
      };

      expect(PElement.isPElement(invalidElement)).toBe(false);
    });

    it("typeプロパティがない要素を拒否する", () => {
      const invalidElement = {
        tagName: "p",
        attributes: {},
      };

      expect(PElement.isPElement(invalidElement)).toBe(false);
    });
  });
});
