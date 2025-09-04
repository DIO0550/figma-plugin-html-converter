/**
 * aside要素のコンバーター実装
 * HTML5のaside要素をFigmaのフレームノードに変換する機能を提供
 */

import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { AsideAttributes } from "../aside-attributes";
import type { BaseElement } from "../../../base/base-element";
import { Styles } from "../../../../models/styles";
import { HTMLToFigmaMapper } from "../../../../mapper";

/**
 * aside要素の型定義
 * HTML5のaside要素を表現し、Figmaのフレームノードに変換される
 * BaseElementを継承した専用の型
 */
export interface AsideElement extends BaseElement<"aside", AsideAttributes> {
  children?: HTMLNode[];
}

/**
 * aside要素のコンパニオンオブジェクト
 * 型ガード、ファクトリー、アクセサ、変換メソッドを提供
 */
export const AsideElement = {
  /**
   * aside要素かどうかを判定する型ガード
   * @param node - 判定対象のノード
   * @returns aside要素の場合true
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
   * @param attributes - 要素の属性（オプション）
   * @param children - 子要素の配列（オプション）
   * @returns 新しいAsideElement
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
   * @param element - aside要素
   * @returns ID属性の値、存在しない場合はundefined
   */
  getId(element: AsideElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * className属性を取得
   * @param element - aside要素
   * @returns className属性の値、存在しない場合はundefined
   */
  getClassName(element: AsideElement): string | undefined {
    return element.attributes?.className;
  },

  /**
   * style属性を取得
   * @param element - aside要素
   * @returns style属性の値、存在しない場合はundefined
   */
  getStyle(element: AsideElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * 任意の属性を取得
   * @param element - aside要素
   * @param name - 属性名
   * @returns 属性の値、存在しない場合はundefined
   */
  getAttribute(element: AsideElement, name: string): unknown {
    return element.attributes?.[name as keyof AsideAttributes];
  },

  /**
   * 子要素を取得
   * @param element - aside要素
   * @returns 子要素の配列、存在しない場合はundefined
   */
  getChildren(element: AsideElement): HTMLNode[] | undefined {
    return element.children;
  },

  /**
   * 属性の存在確認
   * @param element - aside要素
   * @param name - 属性名
   * @returns 属性が存在する場合true
   */
  hasAttribute(element: AsideElement, name: string): boolean {
    return element.attributes ? name in element.attributes : false;
  },

  /**
   * aside要素をFigmaノードに変換
   * @param element - 変換対象のaside要素
   * @returns Figmaノード設定オブジェクト
   */
  toFigmaNode(element: AsideElement): FigmaNodeConfig {
    let config = FigmaNode.createFrame("aside");

    // ノード名の生成
    let name = "aside";
    if (element.attributes?.id) {
      name += `#${element.attributes?.id}`;
    }
    if (element.attributes?.className) {
      const classes = element.attributes?.className.split(" ").filter(Boolean);
      if (classes.length > 0) {
        name += `.${classes.join(".")}`;
      }
    }
    if (element.attributes?.role) {
      name += `[role=${element.attributes?.role}]`;
    }
    if (element.attributes?.["aria-label"]) {
      name += `[aria-label=${element.attributes?.["aria-label"]}]`;
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

    const styles = Styles.parse(element.attributes?.style);

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
   * @param node - マッピング対象のノード
   * @returns Figmaノード設定オブジェクト、変換できない場合はnull
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
