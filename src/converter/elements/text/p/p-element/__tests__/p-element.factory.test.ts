import { describe, it, expect } from "vitest";
import { PElement } from "../p-element";
import type { PAttributes } from "../../p-attributes";

describe("PElement ファクトリー", () => {
  describe("create", () => {
    it("デフォルト値でPElementを作成できる", () => {
      const element = PElement.create();

      expect(element).toEqual({
        type: "element",
        tagName: "p",
        attributes: {},
        children: [],
      });
    });

    it("属性を指定してPElementを作成できる", () => {
      const attributes: Partial<PAttributes> = {
        id: "para-1",
        class: "text-body",
        style: "color: blue;",
      };

      const element = PElement.create(attributes);

      expect(element.attributes).toEqual(attributes);
      expect(element.attributes.id).toBe("para-1");
      expect(element.attributes.class).toBe("text-body");
      expect(element.attributes.style).toBe("color: blue;");
    });

    it("子要素を指定してPElementを作成できる", () => {
      const children = [
        { type: "text", content: "Hello " },
        {
          type: "element",
          tagName: "strong",
          attributes: {},
          children: [{ type: "text", content: "World" }],
        },
      ];

      const element = PElement.create({}, children);

      expect(element.children).toEqual(children);
      expect(element.children).toHaveLength(2);
    });

    it("属性と子要素の両方を指定してPElementを作成できる", () => {
      const attributes: Partial<PAttributes> = {
        id: "main-paragraph",
        class: "lead",
      };
      const children = [
        { type: "text", content: "This is the main paragraph." },
      ];

      const element = PElement.create(attributes, children);

      expect(element.attributes).toEqual(attributes);
      expect(element.children).toEqual(children);
    });

    it("空の属性オブジェクトを渡してもエラーにならない", () => {
      const element = PElement.create({});

      expect(element.attributes).toEqual({});
      expect(element.children).toEqual([]);
    });

    it("型が正しくPElementとなる", () => {
      const element = PElement.create();

      expect(element.type).toBe("element");
      expect(element.tagName).toBe("p");
    });
  });
});
