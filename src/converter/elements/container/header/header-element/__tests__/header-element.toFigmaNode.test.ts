import { it, expect, test } from "vitest";
import { HeaderElement } from "../header-element";
import type { HeaderElement as HeaderElementType } from "../header-element";

it(
  "HeaderElement.toFigmaNode - 基本header要素 - デフォルトノードを生成する",
  () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: {},
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode).toEqual({
      type: "FRAME",
      name: "header",
      layoutMode: "HORIZONTAL",
      layoutSizingVertical: "HUG",
      layoutSizingHorizontal: "FIXED",
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      itemSpacing: 0,
    });
  });

  it("HeaderElement.toFigmaNode - id属性あり - nameにidを含める", () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: { id: "page-header" },
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("header#page-header");
  });

  it(
    "HeaderElement.toFigmaNode - className属性あり - nameにclassNameを含める",
    () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: { className: "site-header sticky" },
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("header.site-header.sticky");
  });

  it(
    "HeaderElement.toFigmaNode - idとclassName属性あり - nameに両方を含める",
    () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: {
        id: "main-header",
        className: "header primary",
      },
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("header#main-header.header.primary");
  });

  it(
    "HeaderElement.toFigmaNode - flex-direction: row - layoutModeをHORIZONTALにする",
    () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "display: flex; flex-direction: row;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.layoutMode).toBe("HORIZONTAL");
    });

    it(
      "HeaderElement.toFigmaNode - flex-direction: column - layoutModeをVERTICALにする",
      () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "display: flex; flex-direction: column;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.layoutMode).toBe("VERTICAL");
    });

    it(
      "HeaderElement.toFigmaNode - justify-content指定 - primaryAxisAlignItemsを設定する",
      () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "display: flex; justify-content: space-between;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.primaryAxisAlignItems).toBe("SPACE_BETWEEN");
    });

    it(
      "HeaderElement.toFigmaNode - align-items指定 - counterAxisAlignItemsを設定する",
      () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "display: flex; align-items: center;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
    });

  it(
    "HeaderElement.toFigmaNode - padding指定 - 全方向に反映する",
    () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "padding: 20px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.paddingTop).toBe(20);
      expect(figmaNode.paddingRight).toBe(20);
      expect(figmaNode.paddingBottom).toBe(20);
      expect(figmaNode.paddingLeft).toBe(20);
    });

    it(
      "HeaderElement.toFigmaNode - 個別padding指定 - 各値を反映する",
      () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style:
            "padding-top: 10px; padding-right: 20px; padding-bottom: 30px; padding-left: 40px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.paddingTop).toBe(10);
      expect(figmaNode.paddingRight).toBe(20);
      expect(figmaNode.paddingBottom).toBe(30);
      expect(figmaNode.paddingLeft).toBe(40);
    });

  it("HeaderElement.toFigmaNode - gap指定 - itemSpacingを設定する", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "gap: 16px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.itemSpacing).toBe(16);
    });

  it(
    "HeaderElement.toFigmaNode - 背景色hex指定 - fillsを設定する",
    () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "background-color: #ff0000;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.fills).toEqual([
        {
          type: "SOLID",
          color: { r: 1, g: 0, b: 0 },
          opacity: 1,
        },
      ]);
    });

    it(
      "HeaderElement.toFigmaNode - 背景色short hex指定 - fillsを設定する",
      () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "background-color: #f00;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.fills).toEqual([
        {
          type: "SOLID",
          color: { r: 1, g: 0, b: 0 },
          opacity: 1,
        },
      ]);
    });

    it(
      "HeaderElement.toFigmaNode - 背景色名指定 - fillsを設定する",
      () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "background-color: black;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.fills).toEqual([
        {
          type: "SOLID",
          color: { r: 0, g: 0, b: 0 },
          opacity: 1,
        },
      ]);
    });

  it(
    "HeaderElement.toFigmaNode - width指定 - widthとlayoutSizingHorizontalを設定する",
    () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "width: 500px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.width).toBe(500);
      expect(figmaNode.layoutSizingHorizontal).toBe("FIXED");
    });

    it(
      "HeaderElement.toFigmaNode - height指定 - heightとlayoutSizingVerticalを設定する",
      () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "height: 100px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.height).toBe(100);
      expect(figmaNode.layoutSizingVertical).toBe("FIXED");
    });

    it(
      "HeaderElement.toFigmaNode - min/max指定 - 制約値を設定する",
      () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style:
            "min-width: 200px; max-width: 800px; min-height: 60px; max-height: 150px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.minWidth).toBe(200);
      expect(figmaNode.maxWidth).toBe(800);
      expect(figmaNode.minHeight).toBe(60);
      expect(figmaNode.maxHeight).toBe(150);
    });

  it(
    "HeaderElement.toFigmaNode - 複合スタイル指定 - 主要スタイルを反映する",
    () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: {
        id: "site-header",
        className: "header sticky",
        style:
          "display: flex; justify-content: space-between; align-items: center; background-color: #333333; padding: 20px; gap: 16px; height: 80px;",
      },
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode).toMatchObject({
      type: "FRAME",
      name: "header#site-header.header.sticky",
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "SPACE_BETWEEN",
      counterAxisAlignItems: "CENTER",
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      itemSpacing: 16,
      height: 80,
      layoutSizingVertical: "FIXED",
      fills: [
        {
          type: "SOLID",
          color: { r: 0.2, g: 0.2, b: 0.2 },
          opacity: 1,
        },
      ],
    });
  });

test(
  "HeaderElement.toFigmaNode - height:auto - layoutSizingVerticalを固定しない",
  () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {
      style: "height: auto;",
    },
  };

  const figmaNode = HeaderElement.toFigmaNode(element);

  expect(figmaNode.height).toBeUndefined();
  expect(figmaNode.layoutSizingVertical).not.toBe("FIXED");
  }
);

test(
  "HeaderElement.toFigmaNode - height:50% - layoutSizingVerticalを固定しない",
  () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {
      style: "height: 50%;",
    },
  };

  const figmaNode = HeaderElement.toFigmaNode(element);

  expect(figmaNode.height).toBeUndefined();
  expect(figmaNode.layoutSizingVertical).not.toBe("FIXED");
  }
);

test(
  "HeaderElement.toFigmaNode - height:5rem - layoutSizingVerticalを固定しない",
  () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {
      style: "height: 5rem;",
    },
  };

  const figmaNode = HeaderElement.toFigmaNode(element);

  expect(figmaNode.height).toBeUndefined();
  expect(figmaNode.layoutSizingVertical).not.toBe("FIXED");
  }
);

test(
  "HeaderElement.toFigmaNode - gap:1rem - itemSpacingを設定しない",
  () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {
      style: "display: flex; gap: 1rem;",
    },
  };

  const figmaNode = HeaderElement.toFigmaNode(element);

  expect(figmaNode.itemSpacing).toBe(0);
  }
);

test(
  "HeaderElement.toFigmaNode - gap:10% - itemSpacingを設定しない",
  () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {
      style: "display: flex; gap: 10%;",
    },
  };

  const figmaNode = HeaderElement.toFigmaNode(element);

  expect(figmaNode.itemSpacing).toBe(0);
  }
);
