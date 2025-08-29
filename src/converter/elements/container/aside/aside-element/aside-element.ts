import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { AsideAttributes } from "../aside-attributes";
import { Styles } from "../../../../models/styles";
import { HTMLToFigmaMapper } from "../../../../mapper";

/**
 * aside要素の型定義
 * HTML5のaside要素を表現し、Figmaのフレームノードに変換される
 */
export interface AsideElement {
  type: "element";
  tagName: "aside";
  attributes: AsideAttributes;
  children?: HTMLNode[];
}

/**
 * aside要素のコンパニオンオブジェクト
 * 型ガード、ファクトリー、アクセサ、変換メソッドを提供
 */
export const AsideElement = {
  /**
   * aside要素かどうかを判定する型ガード
   */
  isAsideElement(node: unknown): node is AsideElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      node.tagName === "aside"
    );
  },

  /**
   * aside要素を作成するファクトリー関数
   */
  create(
    attributes: Partial<AsideAttributes> = {},
    children: HTMLNode[] = [],
  ): AsideElement {
    return {
      type: "element",
      tagName: "aside",
      attributes: attributes as AsideAttributes,
      children,
    };
  },

  /**
   * ID属性を取得
   */
  getId(element: AsideElement): string | undefined {
    return element.attributes.id;
  },

  /**
   * className属性を取得
   */
  getClassName(element: AsideElement): string | undefined {
    return element.attributes.className;
  },

  /**
   * style属性を取得
   */
  getStyle(element: AsideElement): string | undefined {
    return element.attributes.style;
  },

  /**
   * 任意の属性を取得
   */
  getAttribute(element: AsideElement, name: string): unknown {
    return element.attributes[name as keyof AsideAttributes];
  },

  /**
   * 子要素を取得
   */
  getChildren(element: AsideElement): HTMLNode[] | undefined {
    return element.children;
  },

  /**
   * 属性の存在確認
   */
  hasAttribute(element: AsideElement, name: string): boolean {
    return name in element.attributes;
  },

  /**
   * aside要素をFigmaノードに変換
   */
  toFigmaNode(element: AsideElement): FigmaNodeConfig {
    let config = FigmaNode.createFrame("aside");

    // ノード名の生成
    let name = "aside";
    if (element.attributes.id) {
      name += `#${element.attributes.id}`;
    }
    if (element.attributes.className) {
      const classes = element.attributes.className.split(" ").filter(Boolean);
      if (classes.length > 0) {
        name += `.${classes.join(".")}`;
      }
    }
    if (element.attributes.role) {
      name += `[role=${element.attributes.role}]`;
    }
    if (element.attributes["aria-label"]) {
      name += `[aria-label=${element.attributes["aria-label"]}]`;
    }
    config.name = name;

    // asideのデフォルトレイアウト設定
    config.layoutMode = "VERTICAL";
    config.layoutSizingHorizontal = "FIXED";
    config.layoutSizingVertical = "HUG";

    // スタイルがない場合は早期リターン
    if (!element.attributes?.style) {
      return config;
    }

    const styles = Styles.parse(element.attributes.style);

    // 背景色を適用
    const backgroundColor = Styles.getBackgroundColor(styles);
    if (backgroundColor) {
      config = FigmaNodeConfig.applyBackgroundColor(config, backgroundColor);
    }

    // パディングを適用
    const padding = Styles.getPadding(styles);
    if (padding) {
      config = FigmaNodeConfig.applyPaddingStyles(config, padding);
    }

    // 個別パディングも処理
    const paddingTop = Styles.getPaddingTop(styles);
    const paddingRight = Styles.getPaddingRight(styles);
    const paddingBottom = Styles.getPaddingBottom(styles);
    const paddingLeft = Styles.getPaddingLeft(styles);

    if (paddingTop !== null && typeof paddingTop === "number") {
      config.paddingTop = paddingTop;
    }
    if (paddingRight !== null && typeof paddingRight === "number") {
      config.paddingRight = paddingRight;
    }
    if (paddingBottom !== null && typeof paddingBottom === "number") {
      config.paddingBottom = paddingBottom;
    }
    if (paddingLeft !== null && typeof paddingLeft === "number") {
      config.paddingLeft = paddingLeft;
    }

    // Flexboxスタイルを適用（常に実行、内部で判定）
    const flexboxOptions = Styles.extractFlexboxOptions(styles);
    config = FigmaNodeConfig.applyFlexboxStyles(config, flexboxOptions);

    // gapをitemSpacingとして適用
    if (flexboxOptions.gap !== undefined) {
      config.itemSpacing = flexboxOptions.gap;
    }

    // ボーダースタイルを適用（常に実行、内部で判定）
    config = FigmaNodeConfig.applyBorderStyles(
      config,
      Styles.extractBorderOptions(styles),
    );

    // サイズスタイルを適用（常に実行、内部で判定）
    const sizeOptions = Styles.extractSizeOptions(styles);
    config = FigmaNodeConfig.applySizeStyles(config, sizeOptions);

    // width/heightが明示的に設定されている場合はlayoutSizingを調整
    if (sizeOptions.width !== undefined) {
      config.layoutSizingHorizontal = "FIXED";
    }
    if (sizeOptions.height !== undefined) {
      config.layoutSizingVertical = "FIXED";
    }

    // 最小・最大サイズの処理
    if (styles["min-width"]) {
      const minWidth = parseFloat(styles["min-width"]);
      if (!isNaN(minWidth)) {
        config.minWidth = minWidth;
      }
    }
    if (styles["max-width"]) {
      const maxWidth = parseFloat(styles["max-width"]);
      if (!isNaN(maxWidth)) {
        config.maxWidth = maxWidth;
      }
    }
    if (styles["min-height"]) {
      const minHeight = parseFloat(styles["min-height"]);
      if (!isNaN(minHeight)) {
        config.minHeight = minHeight;
      }
    }
    if (styles["max-height"]) {
      const maxHeight = parseFloat(styles["max-height"]);
      if (!isNaN(maxHeight)) {
        config.maxHeight = maxHeight;
      }
    }

    return config;
  },

  /**
   * HTMLノードをFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!AsideElement.isAsideElement(node)) {
      return null;
    }

    const figmaNode = AsideElement.toFigmaNode(node);

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
