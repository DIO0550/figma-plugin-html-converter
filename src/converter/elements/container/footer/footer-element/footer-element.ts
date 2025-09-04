import type { HTMLNode } from "../../../../models/html-node";
import type { FooterAttributes } from "../footer-attributes";
import type { BaseElement } from "../../../base/base-element";
import { FigmaNode, FigmaNodeConfig } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { HTMLToFigmaMapper } from "../../../../mapper";

/**
 * footer要素の型定義
 * HTML5のfooter要素を表現し、Figmaのフレームノードに変換される
 * BaseElementを継承した専用の型
 */
export interface FooterElement extends BaseElement<"footer", FooterAttributes> {
  children?: HTMLNode[];
}

/**
 * footer要素のコンパニオンオブジェクト
 * 型ガード、ファクトリー、アクセサ、変換メソッドを提供
 */
export const FooterElement = {
  /**
   * footer要素かどうかを判定する型ガード
   */
  isFooterElement(node: unknown): node is FooterElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      node.tagName === "footer"
    );
  },

  /**
   * footer要素を作成するファクトリー関数
   */
  create(
    attributes: Partial<FooterAttributes> = {},
    children: HTMLNode[] = [],
  ): FooterElement {
    return {
      type: "element",
      tagName: "footer",
      attributes: attributes as FooterAttributes,
      children,
    };
  },

  getId(element: FooterElement): string | undefined {
    return element.attributes?.id;
  },

  getClassName(element: FooterElement): string | undefined {
    return element.attributes?.className;
  },

  getStyle(element: FooterElement): string | undefined {
    return element.attributes?.style;
  },

  getAttribute(element: FooterElement, name: string): unknown {
    return element.attributes?.[name as keyof FooterAttributes];
  },

  getChildren(element: FooterElement): HTMLNode[] | undefined {
    return element.children;
  },

  hasAttribute(element: FooterElement, name: string): boolean {
    return element.attributes ? name in element.attributes : false;
  },

  /**
   * footer要素をFigmaノードに変換
   */
  toFigmaNode(element: FooterElement): FigmaNodeConfig {
    let config = FigmaNode.createFrame("footer");

    // applyHtmlElementDefaultsはclassプロパティを期待するため変換が必要
    const attributesForDefaults = {
      ...element.attributes,
      class: element.attributes?.className || element.attributes?.class,
    };
    config = FigmaNodeConfig.applyHtmlElementDefaults(
      config,
      "footer",
      attributesForDefaults,
    );

    if (!element.attributes?.style) {
      return config;
    }

    const styles = Styles.parse(element.attributes?.style);

    const backgroundColor = Styles.getBackgroundColor(styles);
    if (backgroundColor) {
      config = FigmaNodeConfig.applyBackgroundColor(config, backgroundColor);
    }

    const padding = Styles.getPadding(styles);
    if (padding) {
      config = FigmaNodeConfig.applyPaddingStyles(config, padding);
    }

    config = FigmaNodeConfig.applyFlexboxStyles(
      config,
      Styles.extractFlexboxOptions(styles),
    );

    config = FigmaNodeConfig.applyBorderStyles(
      config,
      Styles.extractBorderOptions(styles),
    );

    config = FigmaNodeConfig.applySizeStyles(
      config,
      Styles.extractSizeOptions(styles),
    );

    return config;
  },

  /**
   * HTMLノードをFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!FooterElement.isFooterElement(node)) {
      return null;
    }

    const figmaNode = FooterElement.toFigmaNode(node);

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
