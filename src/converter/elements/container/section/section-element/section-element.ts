import { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { SectionAttributes } from "../section-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * section要素の型定義
 * BaseElementを継承した専用の型
 * HTML5のセマンティック要素として文書のセクションを表す
 */
export interface SectionElement extends BaseElement<"section"> {
  attributes: SectionAttributes;
  children: SectionElement[] | [];
}

/**
 * SectionElementコンパニオンオブジェクト
 */
export const SectionElement = {
  /**
   * 型ガード: オブジェクトがSectionElementかを判定
   */
  isSectionElement(node: unknown): node is SectionElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      (node as { type: unknown; tagName: unknown }).type === "element" &&
      (node as { type: unknown; tagName: unknown }).tagName === "section"
    );
  },

  /**
   * ファクトリメソッド: 新しいSectionElementを作成
   */
  create(attributes: Partial<SectionAttributes> = {}): SectionElement {
    return {
      type: "element",
      tagName: "section",
      attributes: attributes as SectionAttributes,
      children: [],
    };
  },

  /**
   * 属性アクセサ: ID属性を取得
   */
  getId(element: SectionElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * 属性アクセサ: class属性を取得
   */
  getClass(element: SectionElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * 属性アクセサ: style属性を取得
   */
  getStyle(element: SectionElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * Figma変換: SectionElementをFigmaノードに変換
   */
  toFigmaNode(element: SectionElement): FigmaNodeConfig {
    let config = FigmaNode.createFrame("section");

    // HTML要素のデフォルト設定を適用
    config = FigmaNodeConfig.applyHtmlElementDefaults(
      config,
      "section",
      element.attributes
    );

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

    // Flexboxスタイルを適用（常に実行、内部で判定）
    config = FigmaNodeConfig.applyFlexboxStyles(
      config,
      Styles.extractFlexboxOptions(styles)
    );

    // ボーダースタイルを適用（常に実行、内部で判定）
    config = FigmaNodeConfig.applyBorderStyles(
      config,
      Styles.extractBorderOptions(styles)
    );

    // サイズスタイルを適用（常に実行、内部で判定）
    config = FigmaNodeConfig.applySizeStyles(
      config,
      Styles.extractSizeOptions(styles)
    );

    return config;
  },

  /**
   * マッピング: 汎用的なHTMLNodeをFigmaノードに変換
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!this.isSectionElement(node)) {
      // 互換性のためのHTMLNodeからの変換
      if (
        typeof node === "object" &&
        node !== null &&
        "type" in node &&
        "tagName" in node &&
        (node as { type: unknown; tagName: unknown }).type === "element" &&
        (node as { type: unknown; tagName: unknown }).tagName === "section"
      ) {
        const nodeWithType = node as { attributes?: unknown };
        const attributes =
          "attributes" in nodeWithType &&
          typeof nodeWithType.attributes === "object"
            ? (nodeWithType.attributes as Partial<SectionAttributes>)
            : {};
        const element = this.create(attributes);
        return this.toFigmaNode(element);
      }
      return null;
    }
    return this.toFigmaNode(node);
  },
};
