import { describe, it, expect } from "vitest";
import { HeaderElement } from "../header-element";
import type { HeaderElement as HeaderElementType } from "../header-element";

describe("HeaderElement accessors", () => {
  describe("getId", () => {
    it("should return id when present", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: { id: "page-header" },
      };
      expect(HeaderElement.getId(element)).toBe("page-header");
    });

    it("should return undefined when id not present", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {},
      };
      expect(HeaderElement.getId(element)).toBeUndefined();
    });
  });

  describe("getClassName", () => {
    it("should return className when present", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: { className: "header sticky-header" },
      };
      expect(HeaderElement.getClassName(element)).toBe("header sticky-header");
    });

    it("should return undefined when className not present", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {},
      };
      expect(HeaderElement.getClassName(element)).toBeUndefined();
    });
  });

  describe("getStyle", () => {
    it("should return style when present", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: { style: "background: #333; padding: 20px;" },
      };
      expect(HeaderElement.getStyle(element)).toBe(
        "background: #333; padding: 20px;",
      );
    });

    it("should return undefined when style not present", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {},
      };
      expect(HeaderElement.getStyle(element)).toBeUndefined();
    });
  });

  describe("getAttribute", () => {
    it("should return attribute value when present", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          id: "header",
          className: "site-header",
          "data-sticky": "true",
        },
      };
      expect(HeaderElement.getAttribute(element, "id")).toBe("header");
      expect(HeaderElement.getAttribute(element, "className")).toBe(
        "site-header",
      );
      expect(HeaderElement.getAttribute(element, "data-sticky")).toBe("true");
    });

    it("should return undefined for non-existent attribute", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {},
      };
      expect(HeaderElement.getAttribute(element, "id")).toBeUndefined();
    });
  });

  describe("getChildren", () => {
    it("should return children when present", () => {
      const children = [
        {
          type: "element" as const,
          tagName: "nav",
          attributes: {},
        },
      ];
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {},
        children,
      };
      expect(HeaderElement.getChildren(element)).toBe(children);
    });

    it("should return undefined when children not present", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {},
      };
      expect(HeaderElement.getChildren(element)).toBeUndefined();
    });

    it("should return empty array when children is empty array", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {},
        children: [],
      };
      expect(HeaderElement.getChildren(element)).toEqual([]);
    });
  });

  describe("hasAttribute", () => {
    it("should return true when attribute exists", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          id: "header",
          className: "site-header",
        },
      };
      expect(HeaderElement.hasAttribute(element, "id")).toBe(true);
      expect(HeaderElement.hasAttribute(element, "className")).toBe(true);
    });

    it("should return false when attribute does not exist", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          id: "header",
        },
      };
      expect(HeaderElement.hasAttribute(element, "className")).toBe(false);
      expect(HeaderElement.hasAttribute(element, "style")).toBe(false);
    });

    it("should return false for empty attributes", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {},
      };
      expect(HeaderElement.hasAttribute(element, "id")).toBe(false);
    });
  });
});
