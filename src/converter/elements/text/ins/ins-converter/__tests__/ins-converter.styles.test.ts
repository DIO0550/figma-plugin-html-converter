import { describe, it, expect } from "vitest";
import { InsConverter } from "../ins-converter";
import { InsElement } from "../../ins-element";

describe("InsConverter - Style Application", () => {
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

  it("should allow custom text-decoration override", () => {
    const element = InsElement.create({
      style: "text-decoration: none;",
    });
    const config = InsConverter.toFigmaNode(element);
    expect(config.style.textDecoration).toBeUndefined();
  });

  it("should combine default underline with custom styles", () => {
    const element = InsElement.create({
      style: "color: blue; font-weight: 700;",
    });
    const config = InsConverter.toFigmaNode(element);
    expect(config.style.textDecoration).toBe("UNDERLINE");
    expect(config.style.fontWeight).toBe(700);
  });
});
