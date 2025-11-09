import { describe, it, expect } from "vitest";
import { InsConverter } from "../ins-converter";
import { InsElement } from "../../ins-element";
import {
  createInsElement,
  createTextNode,
  createElementNode,
} from "./test-helpers";

describe("InsConverter.toFigmaNode", () => {
  it("should apply underline text decoration by default", () => {
    const element = InsElement.create({});
    const config = InsConverter.toFigmaNode(element);
    expect(config.style.textDecoration).toBe("UNDERLINE");
  });

  it("should handle cite attribute", () => {
    const element = InsElement.create({
      cite: "https://example.com/source",
    });
    const config = InsConverter.toFigmaNode(element);
    expect(config).toBeDefined();
    expect(config.type).toBe("TEXT");
  });

  it("should handle datetime attribute", () => {
    const element = InsElement.create({
      datetime: "2025-11-09T10:00:00",
    });
    const config = InsConverter.toFigmaNode(element);
    expect(config).toBeDefined();
    expect(config.type).toBe("TEXT");
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
    const element = createInsElement({}, [createTextNode("inserted text")]);
    const config = InsConverter.toFigmaNode(element);
    expect(config.content).toBe("inserted text");
  });

  it("should handle nested elements", () => {
    const element = createInsElement({}, [
      createElementNode("strong", [createTextNode("bold inserted text")]),
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

  it("should handle complex text content", () => {
    const element = createInsElement({}, [
      createTextNode("This is "),
      createElementNode("em", [createTextNode("emphasized")]),
      createTextNode(" inserted text"),
    ]);
    const config = InsConverter.toFigmaNode(element);
    expect(config.content).toBe("This is emphasized inserted text");
  });

  it("should handle special characters in text", () => {
    const element = createInsElement({}, [createTextNode("<>&\"'")]);
    const config = InsConverter.toFigmaNode(element);
    expect(config).toBeDefined();
    expect(config.content).toBe("<>&\"'");
  });

  it("should handle very long text content", () => {
    const longText = "a".repeat(1000);
    const element = createInsElement({}, [createTextNode(longText)]);
    const config = InsConverter.toFigmaNode(element);
    expect(config).toBeDefined();
    expect(config.content).toBe(longText);
  });

  it("should handle deeply nested elements", () => {
    const element = createInsElement({}, [
      createElementNode("span", [
        createElementNode("strong", [createTextNode("deeply nested")]),
      ]),
    ]);
    const config = InsConverter.toFigmaNode(element);
    expect(config).toBeDefined();
    expect(config.content).toBe("deeply nested");
  });

  it("should handle undefined attributes", () => {
    const element = createInsElement(undefined, []);
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
