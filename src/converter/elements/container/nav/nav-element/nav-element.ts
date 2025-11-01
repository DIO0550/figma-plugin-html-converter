import type { HTMLNode } from "../../../../models/html-node";
import type { NavAttributes } from "../nav-attributes";
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
 * nav要素の型定義
 * HTML5のnav要素を表現し、Figmaのフレームノードに変換される
 * BaseElementを継承した専用の型
 */
export interface NavElement extends BaseElement<"nav", NavAttributes> {
  children?: HTMLNode[];
}

/**
 * nav要素のコンパニオンオブジェクト
 * 型ガード、ファクトリー、アクセサ、変換メソッドを提供
 */
export const NavElement = {
  /**
   * nav要素かどうかを判定する型ガード
   */
  isNavElement(node: unknown): node is NavElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      node.tagName === "nav"
    );
  },

  /**
   * nav要素を作成するファクトリー関数
   */
  create(
    attributes: Partial<NavAttributes> = {},
    children: HTMLNode[] = [],
  ): NavElement {
    // Partial<NavAttributes>から完全なNavAttributesオブジェクトを構築
    // GlobalAttributesのすべてのプロパティはオプショナルなので、
    // 空オブジェクトでもNavAttributesの要件を満たす
    const navAttributes: NavAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "nav",
      attributes: navAttributes,
      children,
    };
  },

  getId(element: NavElement): string | undefined {
    return element.attributes?.id;
  },

  getClassName(element: NavElement): string | undefined {
    return element.attributes?.className;
  },

  getStyle(element: NavElement): string | undefined {
    return element.attributes?.style;
  },

  getAriaLabel(element: NavElement): string | undefined {
    return element.attributes?.["aria-label"];
  },

  getRole(element: NavElement): string | undefined {
    return element.attributes?.role;
  },

  getAttribute(element: NavElement, name: string): unknown {
    return element.attributes?.[name as keyof NavAttributes];
  },

  getChildren(element: NavElement): HTMLNode[] | undefined {
    return element.children;
  },

  hasAttribute(element: NavElement, name: string): boolean {
    return element.attributes ? name in element.attributes : false;
  },

  /**
   * nav要素をFigmaノードに変換
   */
  toFigmaNode(element: NavElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("nav");
        const attributesForDefaults = normalizeClassNameAttribute(
          el.attributes,
        );
        const result = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "nav",
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
          // Flexboxスタイルを適用（nav固有）
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
   * HTMLNodeをnavElementとしてFigmaNodeConfigに変換
   * navElementでない場合はnullを返す
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!NavElement.isNavElement(node)) {
      return null;
    }

    const figmaNode = NavElement.toFigmaNode(node);

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
