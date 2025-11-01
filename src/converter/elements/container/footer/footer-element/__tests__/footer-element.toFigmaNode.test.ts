import { describe, it, expect } from "vitest";
import { FooterElement } from "../footer-element";
import type { FooterElement as FooterElementType } from "../footer-element";

describe("FooterElement.toFigmaNode", () => {
  it("基本的なfooter要素をFigmaノードに変換できること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {},
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("footer");
    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
  });

  it("ID付きfooter要素の名前が正しく生成されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: { id: "site-footer" },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("footer#site-footer");
  });

  it("クラス名付きfooter要素の名前が正しく生成されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: { className: "footer container dark" },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("footer.footer.container.dark");
  });

  it("IDとクラス名の両方がある場合の名前生成", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: { id: "main-footer", className: "site-footer dark" },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("footer#main-footer.site-footer.dark");
  });

  it("display: flexのスタイルが適用されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style:
          "display: flex; justify-content: space-between; align-items: center;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.layoutMode).toBe("HORIZONTAL");
    expect(figmaNode.primaryAxisAlignItems).toBe("SPACE_BETWEEN");
    expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
  });

  it("flex-direction: columnが適用されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style: "display: flex; flex-direction: column;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.layoutMode).toBe("VERTICAL");
  });

  it("パディングが正しく適用されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style: "padding: 20px;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.paddingTop).toBe(20);
    expect(figmaNode.paddingRight).toBe(20);
    expect(figmaNode.paddingBottom).toBe(20);
    expect(figmaNode.paddingLeft).toBe(20);
  });

  it("個別のパディングが適用されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style: "padding: 10px 20px 30px 40px;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.paddingTop).toBe(10);
    expect(figmaNode.paddingRight).toBe(20);
    expect(figmaNode.paddingBottom).toBe(30);
    expect(figmaNode.paddingLeft).toBe(40);
  });

  it("gapが正しく適用されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style: "display: flex; gap: 16px;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.itemSpacing).toBe(16);
  });

  it("背景色が正しく適用されること（HEX形式）", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style: "background-color: #333333;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.fills).toBeDefined();
    expect(figmaNode.fills?.[0]).toMatchObject({
      type: "SOLID",
      color: { r: 0.2, g: 0.2, b: 0.2 },
    });
  });

  it("背景色が正しく適用されること（短縮HEX形式）", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style: "background-color: #fff;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.fills).toBeDefined();
    expect(figmaNode.fills?.[0]).toMatchObject({
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 },
    });
  });

  it("幅と高さが正しく適用されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style: "width: 800px; height: 100px;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.width).toBe(800);
    expect(figmaNode.height).toBe(100);
  });

  it("最小・最大サイズが適用されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style:
          "min-width: 320px; max-width: 1200px; min-height: 60px; max-height: 200px;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode).toBeDefined();
  });

  it("複数のスタイルが組み合わさって適用されること", () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        id: "footer",
        className: "site-footer",
        style:
          "display: flex; justify-content: space-between; padding: 20px 30px; background-color: #222; gap: 15px;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("footer#footer.site-footer");
    expect(figmaNode.layoutMode).toBe("HORIZONTAL");
    expect(figmaNode.primaryAxisAlignItems).toBe("SPACE_BETWEEN");
    expect(figmaNode.paddingTop).toBeDefined();
    expect(figmaNode.paddingBottom).toBeDefined();
    expect(figmaNode.paddingLeft).toBeDefined();
    expect(figmaNode.paddingRight).toBeDefined();
    expect(figmaNode.itemSpacing).toBe(15);
    expect(figmaNode.fills).toBeDefined();
    expect(figmaNode.fills?.[0]).toMatchObject({
      type: "SOLID",
      color: {
        r: 0.13333333333333333,
        g: 0.13333333333333333,
        b: 0.13333333333333333,
      },
    });
  });
});
