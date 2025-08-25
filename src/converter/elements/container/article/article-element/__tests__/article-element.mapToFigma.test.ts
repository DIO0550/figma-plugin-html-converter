import { describe, it, expect, vi } from "vitest";
import { ArticleElement } from "../article-element";
import { HTMLToFigmaMapper } from "../../../../mapper";

vi.mock("../../../../mapper", () => ({
  HTMLToFigmaMapper: {
    mapNode: vi.fn(),
  },
}));

describe("ArticleElement - mapToFigma", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return null for non-article element", () => {
    const node = {
      type: "element",
      tagName: "div",
      attributes: {},
      children: [],
    };

    const result = ArticleElement.mapToFigma(node);

    expect(result).toBeNull();
    expect(HTMLToFigmaMapper.mapNode).not.toHaveBeenCalled();
  });

  it("should return null for text node", () => {
    const node = {
      type: "text",
      content: "Text content",
    };

    const result = ArticleElement.mapToFigma(node);

    expect(result).toBeNull();
    expect(HTMLToFigmaMapper.mapNode).not.toHaveBeenCalled();
  });

  it("should map basic article element", () => {
    const node = {
      type: "element",
      tagName: "article",
      attributes: {},
      children: [],
    };

    const expectedFigmaNode = {
      type: "FRAME",
      name: "article",
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "FIXED",
      layoutAlign: "STRETCH",
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      itemSpacing: 0,
      children: [],
    };

    const result = ArticleElement.mapToFigma(node);

    expect(result).toEqual(expectedFigmaNode);
    expect(HTMLToFigmaMapper.mapNode).not.toHaveBeenCalled();
  });

  it("should map article element with children", () => {
    const mockChildFigmaNode = { type: "TEXT", name: "text" };
    vi.mocked(HTMLToFigmaMapper.mapNode).mockReturnValue(mockChildFigmaNode);

    const node = {
      type: "element",
      tagName: "article",
      attributes: {},
      children: [
        { type: "text", content: "Text content" },
        { type: "element", tagName: "p", attributes: {}, children: [] },
      ],
    };

    const result = ArticleElement.mapToFigma(node);

    expect(result).toBeDefined();
    expect(result?.children).toHaveLength(2);
    expect(result?.children).toEqual([mockChildFigmaNode, mockChildFigmaNode]);
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(2);
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledWith({
      type: "text",
      content: "Text content",
    });
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledWith({
      type: "element",
      tagName: "p",
      attributes: {},
      children: [],
    });
  });

  it("should filter out null children", () => {
    vi.mocked(HTMLToFigmaMapper.mapNode)
      .mockReturnValueOnce({ type: "TEXT", name: "text1" })
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({ type: "TEXT", name: "text2" });

    const node = {
      type: "element",
      tagName: "article",
      attributes: {},
      children: [
        { type: "text", content: "Text 1" },
        { type: "element", tagName: "unknown", attributes: {}, children: [] },
        { type: "text", content: "Text 2" },
      ],
    };

    const result = ArticleElement.mapToFigma(node);

    expect(result?.children).toHaveLength(2);
    expect(result?.children).toEqual([
      { type: "TEXT", name: "text1" },
      { type: "TEXT", name: "text2" },
    ]);
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(3);
  });

  it("should map article with attributes", () => {
    const node = {
      type: "element",
      tagName: "article",
      attributes: {
        id: "main-article",
        className: "blog-post",
        style: "padding: 20px; background-color: #f5f5f5;",
      },
      children: [],
    };

    const result = ArticleElement.mapToFigma(node);

    expect(result).toBeDefined();
    expect(result?.name).toBe("article#main-article.blog-post");
    expect(result?.paddingTop).toBe(20);
    expect(result?.paddingRight).toBe(20);
    expect(result?.paddingBottom).toBe(20);
    expect(result?.paddingLeft).toBe(20);
    expect(result?.fills).toEqual([
      {
        type: "SOLID",
        color: {
          r: 245 / 255,
          g: 245 / 255,
          b: 245 / 255,
        },
        opacity: 1,
      },
    ]);
  });

  it("should handle empty children array", () => {
    const node = {
      type: "element",
      tagName: "article",
      attributes: {},
      children: [],
    };

    const result = ArticleElement.mapToFigma(node);

    expect(result?.children).toEqual([]);
    expect(HTMLToFigmaMapper.mapNode).not.toHaveBeenCalled();
  });

  it("should handle undefined children", () => {
    const node = {
      type: "element",
      tagName: "article",
      attributes: {},
    };

    const result = ArticleElement.mapToFigma(node);

    expect(result?.children).toEqual([]);
    expect(HTMLToFigmaMapper.mapNode).not.toHaveBeenCalled();
  });

  it("should handle complex nested structure", () => {
    const mockHeaderNode = { type: "FRAME", name: "header" };
    const mockSectionNode = { type: "FRAME", name: "section" };
    const mockFooterNode = { type: "FRAME", name: "footer" };

    vi.mocked(HTMLToFigmaMapper.mapNode)
      .mockReturnValueOnce(mockHeaderNode)
      .mockReturnValueOnce(mockSectionNode)
      .mockReturnValueOnce(mockFooterNode);

    const node = {
      type: "element",
      tagName: "article",
      attributes: {
        className: "blog-post",
        style: "display: flex; flex-direction: column; gap: 24px;",
      },
      children: [
        {
          type: "element",
          tagName: "header",
          attributes: {},
          children: [],
        },
        {
          type: "element",
          tagName: "section",
          attributes: {},
          children: [],
        },
        {
          type: "element",
          tagName: "footer",
          attributes: {},
          children: [],
        },
      ],
    };

    const result = ArticleElement.mapToFigma(node);

    expect(result).toBeDefined();
    expect(result?.name).toBe("article.blog-post");
    expect(result?.layoutMode).toBe("VERTICAL");
    expect(result?.itemSpacing).toBe(24);
    expect(result?.children).toHaveLength(3);
    expect(result?.children).toEqual([
      mockHeaderNode,
      mockSectionNode,
      mockFooterNode,
    ]);
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(3);
  });

  it("should validate input is article element before processing", () => {
    const invalidNodes = [
      null,
      undefined,
      "string",
      123,
      { type: "text", content: "text" },
      { type: "element", tagName: "section" },
      { tagName: "article" },
    ];

    invalidNodes.forEach((node) => {
      const result = ArticleElement.mapToFigma(node);
      expect(result).toBeNull();
    });

    expect(HTMLToFigmaMapper.mapNode).not.toHaveBeenCalled();
  });
});
