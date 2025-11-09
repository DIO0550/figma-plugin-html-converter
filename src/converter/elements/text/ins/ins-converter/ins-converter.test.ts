import { describe, it, expect } from "vitest";
import { InsConverter } from "./ins-converter";
import { InsElement } from "../ins-element";
import type { TextNodeConfig } from "../../../../models/figma-node";

describe("InsConverter", () => {
  describe("toFigmaNode", () => {
    it("should apply underline text decoration by default", () => {
      const element = InsElement.create({});
      const config = InsConverter.toFigmaNode(element);
      expect(config.style.textDecoration).toBe("UNDERLINE");
    });

    it("should preserve custom text decoration if specified", () => {
      const element = InsElement.create({
        style: "text-decoration: line-through;",
      });
      const config = InsConverter.toFigmaNode(element);
      expect(config.style.textDecoration).toBe("STRIKETHROUGH");
    });

    it("should handle cite attribute", () => {
      const element = InsElement.create({
        cite: "https://example.com/source",
      });
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.type).toBe("TEXT");
      // cite属性はFigmaノードのメタデータとして保存される可能性がある
    });

    it("should handle datetime attribute", () => {
      const element = InsElement.create({
        datetime: "2025-11-09T10:00:00",
      });
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.type).toBe("TEXT");
      // datetime属性はFigmaノードのメタデータとして保存される可能性がある
    });

    it("should handle both cite and datetime attributes", () => {
      const element = InsElement.create({
        cite: "https://example.com/source",
        datetime: "2025-11-09",
      });
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.type).toBe("TEXT");
    });

    it("should handle children elements", () => {
      const element = InsElement.create({}, [
        { type: "text", textContent: "inserted text" } as any,
      ]);
      const config = InsConverter.toFigmaNode(element);
      expect(config.content).toBe("inserted text");
    });

    it("should handle nested elements", () => {
      const element = InsElement.create({}, [
        {
          type: "element",
          tagName: "strong",
          attributes: {},
          children: [{ type: "text", textContent: "bold inserted text" }],
        } as any,
      ]);
      const config = InsConverter.toFigmaNode(element);
      expect(config.content).toBe("bold inserted text");
    });

    it("should handle empty element", () => {
      const element = InsElement.create({}, []);
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.type).toBe("TEXT");
      expect(config.content).toBe("");
    });

    it("should apply id attribute", () => {
      const element = InsElement.create({ id: "test-ins" });
      const config = InsConverter.toFigmaNode(element);
      expect(config.name).toContain("test-ins");
    });

    it("should apply class attribute", () => {
      const element = InsElement.create({ class: "highlight" });
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.type).toBe("TEXT");
    });

    it("should handle multiple style properties", () => {
      const element = InsElement.create({
        style: "color: red; font-size: 16px;",
      });
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.type).toBe("TEXT");
    });

    it("should handle color style", () => {
      const element = InsElement.create({
        style: "color: rgb(255, 0, 0);",
      });
      const config = InsConverter.toFigmaNode(element);
      expect(config.style.fills).toBeDefined();
      expect(config.style.fills?.[0].color.r).toBe(1);
      expect(config.style.fills?.[0].color.g).toBe(0);
      expect(config.style.fills?.[0].color.b).toBe(0);
    });

    it("should handle font-size style", () => {
      const element = InsElement.create({
        style: "font-size: 18px;",
      });
      const config = InsConverter.toFigmaNode(element);
      expect(config.style.fontSize).toBe(18);
    });

    it("should handle complex text content", () => {
      const element = InsElement.create({}, [
        { type: "text", textContent: "This is " } as any,
        {
          type: "element",
          tagName: "em",
          attributes: {},
          children: [{ type: "text", textContent: "emphasized" }],
        } as any,
        { type: "text", textContent: " inserted text" } as any,
      ]);
      const config = InsConverter.toFigmaNode(element);
      expect(config.content).toBe("This is emphasized inserted text");
    });

    it("should handle special characters in text", () => {
      const element = InsElement.create({}, [
        { type: "text", textContent: "<>&\"'" } as any,
      ]);
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.content).toBe("<>&\"'");
    });

    it("should handle very long text content", () => {
      const longText = "a".repeat(1000);
      const element = InsElement.create({}, [
        { type: "text", textContent: longText } as any,
      ]);
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.content).toBe(longText);
    });

    it("should handle deeply nested elements", () => {
      const element = InsElement.create({}, [
        {
          type: "element",
          tagName: "span",
          attributes: {},
          children: [
            {
              type: "element",
              tagName: "strong",
              attributes: {},
              children: [{ type: "text", textContent: "deeply nested" }],
            },
          ],
        } as any,
      ]);
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.content).toBe("deeply nested");
    });

    it("should handle undefined attributes", () => {
      const element: any = {
        type: "element",
        tagName: "ins",
        attributes: undefined,
        children: [],
      };
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.type).toBe("TEXT");
    });

    it("should handle null children", () => {
      const element = InsElement.create({});
      element.children = undefined;
      const config = InsConverter.toFigmaNode(element);
      expect(config).toBeDefined();
      expect(config.content).toBe("");
    });

    it("should create valid Figma node config", () => {
      const element = InsElement.create({
        style: "color: blue; font-size: 14px;",
      });
      const config = InsConverter.toFigmaNode(element);
      expect(config.type).toBe("TEXT");
      expect(config.name).toBeDefined();
    });
  });

  describe("mapToFigma", () => {
    it("should convert valid ins node", () => {
      const node = {
        type: "element",
        tagName: "ins",
        attributes: {},
      };
      const config = InsConverter.mapToFigma(node) as TextNodeConfig;
      expect(config).not.toBeNull();
      expect(config.type).toBe("TEXT");
      expect(config.style.textDecoration).toBe("UNDERLINE");
    });

    it("should convert ins node with attributes", () => {
      const node = {
        type: "element",
        tagName: "ins",
        attributes: {
          cite: "https://example.com",
          datetime: "2025-11-09",
        },
      };
      const config = InsConverter.mapToFigma(node);
      expect(config).not.toBeNull();
      expect(config?.type).toBe("TEXT");
    });

    it("should convert ins node with children", () => {
      const node = {
        type: "element",
        tagName: "ins",
        attributes: {},
        children: [{ type: "text", textContent: "inserted" }],
      };
      const config = InsConverter.mapToFigma(node) as TextNodeConfig;
      expect(config).not.toBeNull();
      expect(config.type).toBe("TEXT");
      expect(config.content).toBe("inserted");
    });

    it("should return null for invalid node type", () => {
      const node = {
        type: "text",
        content: "not an element",
      };
      const config = InsConverter.mapToFigma(node);
      expect(config).toBeNull();
    });

    it("should return null for different tagName", () => {
      const node = {
        type: "element",
        tagName: "div",
        attributes: {},
      };
      const config = InsConverter.mapToFigma(node);
      expect(config).toBeNull();
    });

    it("should return null for del tagName", () => {
      const node = {
        type: "element",
        tagName: "del",
        attributes: {},
      };
      const config = InsConverter.mapToFigma(node);
      expect(config).toBeNull();
    });

    it("should return null for null input", () => {
      const config = InsConverter.mapToFigma(null);
      expect(config).toBeNull();
    });

    it("should return null for undefined input", () => {
      const config = InsConverter.mapToFigma(undefined);
      expect(config).toBeNull();
    });

    it("should return null for non-object input", () => {
      const config = InsConverter.mapToFigma("string");
      expect(config).toBeNull();
    });

    it("should return null for number input", () => {
      const config = InsConverter.mapToFigma(123);
      expect(config).toBeNull();
    });

    it("should handle node without type property", () => {
      const node = {
        tagName: "ins",
        attributes: {},
      };
      const config = InsConverter.mapToFigma(node);
      expect(config).toBeNull();
    });

    it("should handle node without tagName property", () => {
      const node = {
        type: "element",
        attributes: {},
      };
      const config = InsConverter.mapToFigma(node);
      expect(config).toBeNull();
    });

    it("should convert InsElement instance", () => {
      const element = InsElement.create({
        cite: "https://example.com",
      });
      const config = InsConverter.mapToFigma(element) as TextNodeConfig;
      expect(config).not.toBeNull();
      expect(config.type).toBe("TEXT");
      expect(config.style.textDecoration).toBe("UNDERLINE");
    });
  });
});
