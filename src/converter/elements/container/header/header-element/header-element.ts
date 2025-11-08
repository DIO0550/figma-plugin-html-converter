import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { HeaderAttributes } from "../header-attributes";
import type { BaseElement } from "../../../base/base-element";
import { HTMLToFigmaMapper } from "../../../../mapper";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";
import {
  normalizeClassNameAttribute,
  initializeSemanticFramePadding,
  generateNodeName,
  applySemanticFlexboxStyles,
} from "../../../../utils/semantic-frame-helpers/semantic-frame-helpers";

/**
 * header要素の型定義
 * HTML5のheader要素を表現し、Figmaのフレームノードに変換される
 * BaseElementを継承した専用の型
 */
export interface HeaderElement extends BaseElement<"header", HeaderAttributes> {
  children?: HTMLNode[];
}

/**
 * header要素のコンパニオンオブジェクト
 * 型ガード、ファクトリー、アクセサ、変換メソッドを提供
 */
export const HeaderElement = {
  /**
   * header要素かどうかを判定する型ガード
   */
  isHeaderElement(node: unknown): node is HeaderElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      node.tagName === "header"
    );
  },

  /**
   * header要素を作成するファクトリー関数
   */
  create(
    attributes: Partial<HeaderAttributes> = {},
    children: HTMLNode[] = [],
  ): HeaderElement {
    return {
      type: "element",
      tagName: "header",
      attributes: attributes as HeaderAttributes,
      children,
    };
  },

  /**
   * ID属性を取得
   */
  getId(element: HeaderElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * className属性を取得
   */
  getClassName(element: HeaderElement): string | undefined {
    return element.attributes?.className;
  },

  /**
   * style属性を取得
   */
  getStyle(element: HeaderElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * 任意の属性を取得
   */
  getAttribute(element: HeaderElement, name: string): unknown {
    return element.attributes?.[name as keyof HeaderAttributes];
  },

  /**
   * 子要素を取得
   */
  getChildren(element: HeaderElement): HTMLNode[] | undefined {
    return element.children;
  },

  /**
   * 属性の存在確認
   */
  hasAttribute(element: HeaderElement, name: string): boolean {
    return element.attributes ? name in element.attributes : false;
  },

  /**
   * header要素をFigmaノードに変換
   */
  toFigmaNode(element: HeaderElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const attributesForDefaults = normalizeClassNameAttribute(
          el.attributes,
        );

        const config = FigmaNode.createFrame("header");
        const baseResult = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "header",
          attributesForDefaults,
        );

        baseResult.layoutMode = "HORIZONTAL";
        baseResult.layoutSizingHorizontal = "FIXED";
        baseResult.layoutSizingVertical = "HUG";

        const result = initializeSemanticFramePadding(baseResult);

        result.name = generateNodeName(
          el.tagName,
          el.attributes?.id,
          attributesForDefaults.class,
        );

        return result;
      },
      {
        applyCommonStyles: true,
        customStyleApplier: (config, _el, styles) =>
          applySemanticFlexboxStyles(config, styles),
      },
    );
  },

  /**
   * HTMLノードをFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!HeaderElement.isHeaderElement(node)) {
      return null;
    }

    const figmaNode = HeaderElement.toFigmaNode(node);

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
