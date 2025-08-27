import { describe, it, expect, vi, beforeEach } from "vitest";
import { HeaderElement } from "../header-element";
import { HTMLToFigmaMapper } from "../../../../../mapper";

vi.mock("../../../../../mapper", () => ({
  HTMLToFigmaMapper: {
    mapNode: vi.fn(),
  },
}));

describe("HeaderElement.mapToFigma", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null for non-header elements", () => {
    const notHeader = {
      type: "element",
      tagName: "div",
      attributes: {},
    };

    const result = HeaderElement.mapToFigma(notHeader);

    expect(result).toBeNull();
  });

  it("should map basic header element", () => {
    const element = {
      type: "element",
      tagName: "header",
      attributes: {},
    };

    const result = HeaderElement.mapToFigma(element);

    expect(result).toMatchObject({
      type: "FRAME",
      name: "header",
      layoutMode: "HORIZONTAL",
      children: [],
    });
  });

  it("should map header element with children", () => {
    const childFigmaNode1 = { type: "FRAME", name: "nav" };
    const childFigmaNode2 = { type: "TEXT", name: "text" };

    vi.mocked(HTMLToFigmaMapper.mapNode)
      .mockReturnValueOnce(childFigmaNode1)
      .mockReturnValueOnce(childFigmaNode2);

    const element = {
      type: "element",
      tagName: "header",
      attributes: { id: "page-header" },
      children: [
        {
          type: "element" as const,
          tagName: "nav",
          attributes: {},
        },
        {
          type: "text" as const,
          content: "Header text",
        },
      ],
    };

    const result = HeaderElement.mapToFigma(element);

    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(2);
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenNthCalledWith(
      1,
      element.children![0],
    );
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenNthCalledWith(
      2,
      element.children![1],
    );

    expect(result).toMatchObject({
      type: "FRAME",
      name: "header#page-header",
      layoutMode: "HORIZONTAL",
      children: [childFigmaNode1, childFigmaNode2],
    });
  });

  it("should filter out null children", () => {
    vi.mocked(HTMLToFigmaMapper.mapNode)
      .mockReturnValueOnce({ type: "FRAME", name: "nav" })
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({ type: "TEXT", name: "text" });

    const element = {
      type: "element",
      tagName: "header",
      attributes: {},
      children: [
        { type: "element" as const, tagName: "nav", attributes: {} },
        { type: "comment" as const, content: "comment" },
        { type: "text" as const, content: "text" },
      ],
    };

    const result = HeaderElement.mapToFigma(element);

    expect(result?.children).toHaveLength(2);
    expect(result?.children).toEqual([
      { type: "FRAME", name: "nav" },
      { type: "TEXT", name: "text" },
    ]);
  });

  it("should set empty children array when no children", () => {
    const element = {
      type: "element",
      tagName: "header",
      attributes: {},
    };

    const result = HeaderElement.mapToFigma(element);

    expect(result?.children).toEqual([]);
  });

  it("should apply styles from attributes", () => {
    const element = {
      type: "element",
      tagName: "header",
      attributes: {
        id: "header",
        className: "site-header",
        style:
          "display: flex; justify-content: space-between; background-color: #000; padding: 20px;",
      },
    };

    const result = HeaderElement.mapToFigma(element);

    expect(result).toMatchObject({
      type: "FRAME",
      name: "header#header.site-header",
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "SPACE_BETWEEN",
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      fills: [
        {
          type: "SOLID",
          color: { r: 0, g: 0, b: 0 },
          opacity: 1,
        },
      ],
      children: [],
    });
  });

  it("should handle invalid input gracefully", () => {
    expect(HeaderElement.mapToFigma(null)).toBeNull();
    expect(HeaderElement.mapToFigma(undefined)).toBeNull();
    expect(HeaderElement.mapToFigma("not an object")).toBeNull();
    expect(HeaderElement.mapToFigma(123)).toBeNull();
  });
});
