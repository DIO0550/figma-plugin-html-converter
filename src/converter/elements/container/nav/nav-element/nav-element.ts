import type { HTMLNode } from "../../../../models/html-node";
import type { NavAttributes } from "../nav-attributes";
import { FigmaNode, FigmaNodeConfig } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { HTMLToFigmaMapper } from "../../../../mapper";

/**
 * nav要素の型定義
 * HTML5のnav要素を表現し、Figmaのフレームノードに変換される
 */
export interface NavElement {
  type: "element";
  tagName: "nav";
  attributes: NavAttributes;
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
    return {
      type: "element",
      tagName: "nav",
      attributes: attributes as NavAttributes,
      children,
    };
  },

  getId(element: NavElement): string | undefined {
    return element.attributes.id;
  },

  getClassName(element: NavElement): string | undefined {
    return element.attributes.className;
  },

  getStyle(element: NavElement): string | undefined {
    return element.attributes.style;
  },

  getAriaLabel(element: NavElement): string | undefined {
    return element.attributes["aria-label"];
  },

  getRole(element: NavElement): string | undefined {
    return element.attributes.role;
  },

  getAttribute(element: NavElement, name: string): unknown {
    return element.attributes[name as keyof NavAttributes];
  },

  getChildren(element: NavElement): HTMLNode[] | undefined {
    return element.children;
  },

  hasAttribute(element: NavElement, name: string): boolean {
    return name in element.attributes;
  },

  /**
   * nav要素をFigmaノードに変換
   */
  toFigmaNode(element: NavElement): FigmaNodeConfig {
    let config = FigmaNode.createFrame("nav");

    // applyHtmlElementDefaultsはclassプロパティを期待するため変換が必要
    const attributesForDefaults = {
      ...element.attributes,
      class: element.attributes.className || element.attributes.class,
    };
    config = FigmaNodeConfig.applyHtmlElementDefaults(
      config,
      "nav",
      attributesForDefaults,
    );

    if (!element.attributes?.style) {
      return config;
    }

    const styles = Styles.parse(element.attributes.style);

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
