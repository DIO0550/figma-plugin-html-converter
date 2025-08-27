import { describe, it, expect } from "vitest";
import { FooterElement } from "../footer-element";
import type { FooterElement as FooterElementType } from "../footer-element";

describe("FooterElement Accessors", () => {
  describe("getId", () => {
    it("ID属性を取得できること", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: { id: "site-footer" },
      };

      expect(FooterElement.getId(element)).toBe("site-footer");
    });

    it("ID属性がない場合はundefinedを返すこと", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: {},
      };

      expect(FooterElement.getId(element)).toBeUndefined();
    });
  });

  describe("getClassName", () => {
    it("className属性を取得できること", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: { className: "footer site-footer" },
      };

      expect(FooterElement.getClassName(element)).toBe("footer site-footer");
    });

    it("className属性がない場合はundefinedを返すこと", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: {},
      };

      expect(FooterElement.getClassName(element)).toBeUndefined();
    });
  });

  describe("getStyle", () => {
    it("style属性を取得できること", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: { style: "background-color: #333; padding: 20px;" },
      };

      expect(FooterElement.getStyle(element)).toBe(
        "background-color: #333; padding: 20px;",
      );
    });

    it("style属性がない場合はundefinedを返すこと", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: {},
      };

      expect(FooterElement.getStyle(element)).toBeUndefined();
    });
  });

  describe("getAttribute", () => {
    it("指定された属性を取得できること", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: {
          id: "footer",
          className: "site-footer",
          "data-theme": "dark",
          "aria-label": "ページフッター",
        },
      };

      expect(FooterElement.getAttribute(element, "id")).toBe("footer");
      expect(FooterElement.getAttribute(element, "className")).toBe(
        "site-footer",
      );
      expect(FooterElement.getAttribute(element, "data-theme")).toBe("dark");
      expect(FooterElement.getAttribute(element, "aria-label")).toBe(
        "ページフッター",
      );
    });

    it("存在しない属性の場合はundefinedを返すこと", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: { id: "footer" },
      };

      expect(FooterElement.getAttribute(element, "className")).toBeUndefined();
      expect(FooterElement.getAttribute(element, "style")).toBeUndefined();
    });
  });

  describe("getChildren", () => {
    it("子要素を取得できること", () => {
      const children = [
        { type: "text" as const, content: "Footer content" },
        {
          type: "element" as const,
          tagName: "nav",
          attributes: {},
          children: [],
        },
      ];
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: {},
        children,
      };

      expect(FooterElement.getChildren(element)).toEqual(children);
    });

    it("子要素がない場合はundefinedを返すこと", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: {},
      };

      expect(FooterElement.getChildren(element)).toBeUndefined();
    });

    it("空の子要素配列の場合は空配列を返すこと", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: {},
        children: [],
      };

      expect(FooterElement.getChildren(element)).toEqual([]);
    });
  });

  describe("hasAttribute", () => {
    it("存在する属性の場合はtrueを返すこと", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: {
          id: "footer",
          className: "site-footer",
          style: "padding: 10px;",
        },
      };

      expect(FooterElement.hasAttribute(element, "id")).toBe(true);
      expect(FooterElement.hasAttribute(element, "className")).toBe(true);
      expect(FooterElement.hasAttribute(element, "style")).toBe(true);
    });

    it("存在しない属性の場合はfalseを返すこと", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: { id: "footer" },
      };

      expect(FooterElement.hasAttribute(element, "className")).toBe(false);
      expect(FooterElement.hasAttribute(element, "style")).toBe(false);
      expect(FooterElement.hasAttribute(element, "data-test")).toBe(false);
    });

    it("値がundefinedでも属性が存在すればtrueを返すこと", () => {
      const element: FooterElementType = {
        type: "element",
        tagName: "footer",
        attributes: { id: undefined } as FooterElementType["attributes"],
      };

      expect(FooterElement.hasAttribute(element, "id")).toBe(true);
    });
  });
});
