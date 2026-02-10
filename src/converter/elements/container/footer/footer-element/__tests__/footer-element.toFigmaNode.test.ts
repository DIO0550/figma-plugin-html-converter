import { test, expect } from "vitest";
import { FooterElement } from "../footer-element";
import type { FooterElement as FooterElementType } from "../footer-element";

test(
  "FooterElement.toFigmaNode - 基本footer要素 - Figmaノードを生成する",
  () => {
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
  }
);

test("FooterElement.toFigmaNode - id属性あり - nameにidを含める", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: { id: "site-footer" },
  };

  const figmaNode = FooterElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("footer#site-footer");
});

test(
  "FooterElement.toFigmaNode - className属性あり - nameにclassNameを含める",
  () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: { className: "footer container dark" },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("footer.footer.container.dark");
  }
);

test(
  "FooterElement.toFigmaNode - idとclassName属性あり - nameに両方を含める",
  () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: { id: "main-footer", className: "site-footer dark" },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("footer#main-footer.site-footer.dark");
  }
);

test(
  "FooterElement.toFigmaNode - display:flex - レイアウトを反映する",
  () => {
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
  }
);

test(
  "FooterElement.toFigmaNode - flex-direction:column - layoutModeをVERTICALにする",
  () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {
        style: "display: flex; flex-direction: column;",
      },
    };

    const figmaNode = FooterElement.toFigmaNode(element);

    expect(figmaNode.layoutMode).toBe("VERTICAL");
  }
);

test(
  "FooterElement.toFigmaNode - padding指定 - 全方向に反映する",
  () => {
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
  }
);

test(
  "FooterElement.toFigmaNode - 個別padding指定 - 各値を反映する",
  () => {
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
  }
);

test("FooterElement.toFigmaNode - gap指定 - itemSpacingを設定する", () => {
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

test(
  "FooterElement.toFigmaNode - 背景色hex指定 - fillsを設定する",
  () => {
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
  }
);

test(
  "FooterElement.toFigmaNode - 背景色short hex指定 - fillsを設定する",
  () => {
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
  }
);

test(
  "FooterElement.toFigmaNode - width/height指定 - サイズを反映する",
  () => {
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
  }
);

test(
  "FooterElement.toFigmaNode - min/max指定 - 制約値を設定する",
  () => {
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
  }
);

test(
  "FooterElement.toFigmaNode - 複数スタイル指定 - 主要スタイルを反映する",
  () => {
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
  }
);
