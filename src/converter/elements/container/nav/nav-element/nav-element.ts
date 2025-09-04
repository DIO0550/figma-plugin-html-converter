import type { HTMLNode } from "../../../../models/html-node";
import type { NavAttributes } from "../nav-attributes";
import type { BaseElement } from "../../../base/base-element";
import { FigmaNode, FigmaNodeConfig } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { HTMLToFigmaMapper } from "../../../../mapper";

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
    let config = FigmaNode.createFrame("nav");

    // ReactやJSXではclassName属性を使用するが、HTML標準ではclass属性を使用する。
    // applyHtmlElementDefaultsメソッドはHTML標準のclass属性を期待するため、
    // className属性が存在する場合はそれをclass属性として渡す必要がある。
    // classNameとclassの両方が存在する場合は、classNameを優先する。
    const attributesForDefaults = {
      ...element.attributes,
      class: element.attributes?.className || element.attributes?.class,
    };
    config = FigmaNodeConfig.applyHtmlElementDefaults(
      config,
      "nav",
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
