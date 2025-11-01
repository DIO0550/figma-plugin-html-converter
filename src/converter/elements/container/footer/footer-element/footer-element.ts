import type { HTMLNode } from "../../../../models/html-node";
import type { FooterAttributes } from "../footer-attributes";
import type { BaseElement } from "../../../base/base-element";
import { FigmaNode, FigmaNodeConfig } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { HTMLToFigmaMapper } from "../../../../mapper";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";
import {
  normalizeClassNameAttribute,
  generateNodeName,
} from "../../../../utils/semantic-frame-helpers/semantic-frame-helpers";

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
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("footer");
        const attributesForDefaults = normalizeClassNameAttribute(
          el.attributes,
        );
        const result = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "footer",
          attributesForDefaults,
        );

        result.name = generateNodeName(
          el.tagName,
          el.attributes?.id,
          attributesForDefaults.class,
        );

        return result;
      },
      {
        applyCommonStyles: true,
        customStyleApplier: (config, _el, styles) => {
          // Flexboxスタイルを適用（footer固有）
          const flexboxOptions = Styles.extractFlexboxOptions(styles);
          const result = FigmaNodeConfig.applyFlexboxStyles(
            config,
            flexboxOptions,
          );

          // gapをitemSpacingとして適用
          if (flexboxOptions.gap !== undefined) {
            result.itemSpacing = flexboxOptions.gap;
          }

          // heightが数値（px値）の場合のみ、layoutSizingVerticalを"FIXED"に
          const sizeOptions = Styles.extractSizeOptions(styles);
          if (sizeOptions.height !== undefined) {
            result.layoutSizingVertical = "FIXED";
          }

          return result;
        },
      },
    );
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
