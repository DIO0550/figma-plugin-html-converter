import type { HTMLNode } from "../../../../models/html-node";
import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { ArticleAttributes } from "../article-attributes";
import type { BaseElement } from "../../../base/base-element";
import { Styles } from "../../../../models/styles";
import { HTMLToFigmaMapper } from "../../../../mapper";

/**
 * article要素の型定義
 * HTML5のarticle要素を表現し、Figmaのフレームノードに変換される
 * BaseElementを継承した専用の型
 */
export interface ArticleElement
  extends BaseElement<"article", ArticleAttributes> {
  children?: HTMLNode[];
}

/**
 * article要素のコンパニオンオブジェクト
 * 型ガード、ファクトリー、アクセサ、変換メソッドを提供
 */
export const ArticleElement = {
  /**
   * article要素かどうかを判定する型ガード
   */
  isArticleElement(node: unknown): node is ArticleElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      node.tagName === "article"
    );
  },

  /**
   * article要素を作成するファクトリー関数
   */
  create(
    attributes: Partial<ArticleAttributes> = {},
    children: HTMLNode[] = [],
  ): ArticleElement {
    return {
      type: "element",
      tagName: "article",
      attributes: attributes as ArticleAttributes,
      children,
    };
  },

  /**
   * ID属性を取得
   */
  getId(element: ArticleElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * className属性を取得
   */
  getClassName(element: ArticleElement): string | undefined {
    return element.attributes?.className;
  },

  /**
   * style属性を取得
   */
  getStyle(element: ArticleElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * 任意の属性を取得
   */
  getAttribute(element: ArticleElement, name: string): unknown {
    return element.attributes?.[name as keyof ArticleAttributes];
  },

  /**
   * 子要素を取得
   */
  getChildren(element: ArticleElement): HTMLNode[] | undefined {
    return element.children;
  },

  /**
   * 属性の存在確認
   */
  hasAttribute(element: ArticleElement, name: string): boolean {
    return element.attributes ? name in element.attributes : false;
  },

  /**
   * article要素をFigmaノードに変換
   */
  toFigmaNode(element: ArticleElement): FigmaNodeConfig {
    const id = element.attributes?.id;
    const className = element.attributes?.className;
    const style = element.attributes?.style;
    const styles = Styles.parse(style || "");

    // ノード名の生成
    let name = "article";
    if (id) {
      name += `#${id}`;
    }
    if (className) {
      const classes = className.split(" ").filter(Boolean);
      if (classes.length > 0) {
        name += `.${classes.join(".")}`;
      }
    }

    // 基本設定（デフォルトは縦方向のレイアウト）
    const figmaNode: FigmaNodeConfig = {
      type: "FRAME",
      name,
      layoutMode: "VERTICAL",
      layoutSizingVertical: "HUG",
      layoutSizingHorizontal: "FIXED",
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      itemSpacing: 0,
    };

    // display: flexの処理
    if (styles.display === "flex") {
      // Flexbox設定
      figmaNode.layoutMode =
        styles["flex-direction"] === "row" ? "HORIZONTAL" : "VERTICAL";

      // justify-content
      const justifyContent = styles["justify-content"];
      if (justifyContent) {
        const alignMap: Record<string, string> = {
          "flex-start": "MIN",
          "flex-end": "MAX",
          center: "CENTER",
          "space-between": "SPACE_BETWEEN",
          "space-around": "SPACE_AROUND",
          "space-evenly": "SPACE_EVENLY",
        };
        figmaNode.primaryAxisAlignItems = (alignMap[justifyContent] ||
          "MIN") as "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
      }

      // align-items
      const alignItems = styles["align-items"];
      if (alignItems) {
        const alignMap: Record<string, string> = {
          "flex-start": "MIN",
          "flex-end": "MAX",
          center: "CENTER",
          stretch: "STRETCH",
          baseline: "BASELINE",
        };
        figmaNode.counterAxisAlignItems = (alignMap[alignItems] || "MIN") as
          | "MIN"
          | "CENTER"
          | "MAX"
          | "STRETCH";
      }
    }

    // パディング処理
    if (styles.padding) {
      const paddingValue = parseFloat(styles.padding);
      if (!isNaN(paddingValue)) {
        figmaNode.paddingTop = paddingValue;
        figmaNode.paddingRight = paddingValue;
        figmaNode.paddingBottom = paddingValue;
        figmaNode.paddingLeft = paddingValue;
      }
    }

    // 個別パディング
    ["top", "right", "bottom", "left"].forEach((side) => {
      const key = `padding-${side}` as keyof typeof styles;
      const figmaKey = `padding${
        side.charAt(0).toUpperCase() + side.slice(1)
      }` as keyof FigmaNodeConfig;
      if (styles[key]) {
        const value = parseFloat(styles[key] as string);
        if (!isNaN(value)) {
          (figmaNode as unknown as Record<string, unknown>)[figmaKey] = value;
        }
      }
    });

    // ギャップ（itemSpacing）
    if (styles.gap) {
      const gapValue = parseFloat(styles.gap);
      if (!isNaN(gapValue)) {
        figmaNode.itemSpacing = gapValue;
      }
    }

    // 背景色
    if (styles["background-color"]) {
      const color = styles["background-color"];
      let r = 0,
        g = 0,
        b = 0;
      const opacity = 1;

      if (color.startsWith("#")) {
        const hex = color.slice(1);
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16) / 255;
          g = parseInt(hex[1] + hex[1], 16) / 255;
          b = parseInt(hex[2] + hex[2], 16) / 255;
        } else if (hex.length === 6) {
          r = parseInt(hex.slice(0, 2), 16) / 255;
          g = parseInt(hex.slice(2, 4), 16) / 255;
          b = parseInt(hex.slice(4, 6), 16) / 255;
        }
      } else if (color === "white") {
        r = g = b = 1;
      } else if (color === "black") {
        r = g = b = 0;
      }

      figmaNode.fills = [
        {
          type: "SOLID",
          color: { r, g, b },
          opacity,
        },
      ];
    }

    // サイズ設定
    if (styles.width) {
      const width = parseFloat(styles.width);
      if (!isNaN(width)) {
        figmaNode.width = width;
        figmaNode.layoutSizingHorizontal = "FIXED";
      }
    }

    if (styles.height) {
      const height = parseFloat(styles.height);
      if (!isNaN(height)) {
        figmaNode.height = height;
        figmaNode.layoutSizingVertical = "FIXED";
      }
    }

    // 最小・最大サイズ
    ["min-width", "max-width", "min-height", "max-height"].forEach((prop) => {
      if (styles[prop]) {
        const value = parseFloat(styles[prop]);
        if (!isNaN(value)) {
          const figmaKey = prop.replace("-", "") as keyof FigmaNodeConfig;
          const camelCaseKey =
            figmaKey.slice(0, 3) +
            figmaKey.charAt(3).toUpperCase() +
            figmaKey.slice(4);
          (figmaNode as unknown as Record<string, unknown>)[camelCaseKey] =
            value;
        }
      }
    });

    return figmaNode;
  },

  /**
   * HTMLノードをFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!ArticleElement.isArticleElement(node)) {
      return null;
    }

    const figmaNode = ArticleElement.toFigmaNode(node);

    // 子要素の処理
    if (node.children && node.children.length > 0) {
      figmaNode.children = node.children
        .map((child) => HTMLToFigmaMapper.mapNode(child))
        .filter((child): child is FigmaNodeConfig => child !== null);
    } else {
      figmaNode.children = [];
    }

    return figmaNode;
  },
};
