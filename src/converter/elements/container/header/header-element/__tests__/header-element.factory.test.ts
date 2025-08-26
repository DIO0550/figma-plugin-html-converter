import { describe, it, expect } from "vitest";
import { HeaderElement } from "../header-element";

describe("HeaderElement.create", () => {
  it("should create header element with default values", () => {
    const element = HeaderElement.create();

    expect(element).toEqual({
      type: "element",
      tagName: "header",
      attributes: {},
      children: [],
    });
  });

  it("should create header element with attributes", () => {
    const attributes = {
      id: "page-header",
      className: "header sticky-header",
      style: "position: sticky; top: 0;",
    };
    const element = HeaderElement.create(attributes);

    expect(element).toEqual({
      type: "element",
      tagName: "header",
      attributes,
      children: [],
    });
  });

  it("should create header element with children", () => {
    const children = [
      {
        type: "element" as const,
        tagName: "nav",
        attributes: {},
      },
      {
        type: "text" as const,
        content: "Header text",
      },
    ];
    const element = HeaderElement.create({}, children);

    expect(element).toEqual({
      type: "element",
      tagName: "header",
      attributes: {},
      children,
    });
  });

  it("should create header element with both attributes and children", () => {
    const attributes = {
      id: "main-header",
      className: "header",
    };
    const children = [
      {
        type: "element" as const,
        tagName: "div",
        attributes: { className: "logo" },
      },
    ];
    const element = HeaderElement.create(attributes, children);

    expect(element).toEqual({
      type: "element",
      tagName: "header",
      attributes,
      children,
    });
  });

  it("should handle partial attributes", () => {
    const element = HeaderElement.create({ id: "header" });

    expect(element.attributes).toEqual({ id: "header" });
    expect(element.children).toEqual([]);
  });

  it("should handle empty attributes as empty object", () => {
    const element = HeaderElement.create({});

    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });
});
