import { describe, test, expect, vi, beforeEach } from "vitest";
import { FooterElement } from "../footer-element";
import { HTMLToFigmaMapper } from "../../../../../mapper";

vi.mock("../../../../../mapper", () => ({
  HTMLToFigmaMapper: {
    mapNode: vi.fn(),
  },
}));

// NOTE: viモックの初期化を共通化するためdescribeを維持
describe("FooterElement.mapToFigma", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("FooterElement.mapToFigma - footer以外の要素 - nullを返す", () => {
    const node = {
      type: "element",
      tagName: "div",
      attributes: {},
    };

    const result = FooterElement.mapToFigma(node);

    expect(result).toBeNull();
  });

  test("FooterElement.mapToFigma - 子要素なし - Figmaノードを返す", () => {
    const node = {
      type: "element",
      tagName: "footer",
      attributes: { id: "footer" },
    };

    const result = FooterElement.mapToFigma(node);

    expect(result).toMatchObject({
      type: "FRAME",
      name: "footer#footer",
      layoutMode: "VERTICAL",
      layoutSizingHorizontal: "FILL",
      children: [],
    });
  });

  test("FooterElement.mapToFigma - 子要素あり - 子要素をマッピングする", () => {
    const childNode1 = { type: "element", tagName: "p", attributes: {} };
    const childNode2 = { type: "element", tagName: "nav", attributes: {} };
    const mappedChild1 = { type: "TEXT", name: "p" };
    const mappedChild2 = { type: "FRAME", name: "nav" };

    (HTMLToFigmaMapper.mapNode as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mappedChild1)
      .mockReturnValueOnce(mappedChild2);

    const node = {
      type: "element",
      tagName: "footer",
      attributes: { className: "site-footer" },
      children: [childNode1, childNode2],
    };

    const result = FooterElement.mapToFigma(node);

    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(2);
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenNthCalledWith(1, childNode1);
    expect(HTMLToFigmaMapper.mapNode).toHaveBeenNthCalledWith(2, childNode2);

    expect(result).toMatchObject({
      type: "FRAME",
      name: "footer.site-footer",
      layoutMode: "VERTICAL",
      layoutSizingHorizontal: "FILL",
      children: [mappedChild1, mappedChild2],
    });
  });

  test("FooterElement.mapToFigma - null子要素あり - nullを除外する", () => {
    const childNode1 = { type: "element", tagName: "p", attributes: {} };
    const childNode2 = { type: "comment", content: "comment" };
    const childNode3 = { type: "element", tagName: "div", attributes: {} };
    const mappedChild1 = { type: "TEXT", name: "p" };
    const mappedChild3 = { type: "FRAME", name: "div" };

    (HTMLToFigmaMapper.mapNode as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mappedChild1)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(mappedChild3);

    const node = {
      type: "element",
      tagName: "footer",
      attributes: {},
      children: [childNode1, childNode2, childNode3],
    };

    const result = FooterElement.mapToFigma(node);

    expect(HTMLToFigmaMapper.mapNode).toHaveBeenCalledTimes(3);
    expect(result?.children).toEqual([mappedChild1, mappedChild3]);
  });

  test("FooterElement.mapToFigma - スタイル属性あり - スタイルを反映する", () => {
    const node = {
      type: "element",
      tagName: "footer",
      attributes: {
        id: "footer",
        className: "footer-container",
        style: "display: flex; padding: 20px; background-color: #f0f0f0;",
      },
      children: [],
    };

    const result = FooterElement.mapToFigma(node);

    expect(result).toMatchObject({
      type: "FRAME",
      name: "footer#footer.footer-container",
      layoutMode: "HORIZONTAL",
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 20,
      fills: [
        {
          type: "SOLID",
          color: {
            r: 0.9411764705882353,
            g: 0.9411764705882353,
            b: 0.9411764705882353,
          },
          opacity: 1,
        },
      ],
      children: [],
    });
  });

  test("FooterElement.mapToFigma - 空配列children - 空配列を設定する", () => {
    const node = {
      type: "element",
      tagName: "footer",
      attributes: {},
      children: [],
    };

    const result = FooterElement.mapToFigma(node);

    expect(HTMLToFigmaMapper.mapNode).not.toHaveBeenCalled();
    expect(result?.children).toEqual([]);
  });

  test("FooterElement.mapToFigma - childrenがundefined - 空配列を設定する", () => {
    const node = {
      type: "element",
      tagName: "footer",
      attributes: {},
      children: undefined,
    };

    const result = FooterElement.mapToFigma(node);

    expect(HTMLToFigmaMapper.mapNode).not.toHaveBeenCalled();
    expect(result?.children).toEqual([]);
  });
});
