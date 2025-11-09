import { describe, it, expect } from "vitest";
import { InsConverter } from "../ins-converter";
import { InsElement } from "../../ins-element";
import type { TextNodeConfig } from "../../../../../models/figma-node";

describe("InsConverter.mapToFigma", () => {
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
