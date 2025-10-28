import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { SectionAttributes } from "../section-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * section要素の型定義
 * BaseElementを継承した専用の型
 * HTML5のセマンティック要素として文書のセクションを表す
 */
export interface SectionElement
  extends BaseElement<"section", SectionAttributes> {
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
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("section");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "section",
          el.attributes,
        );
      },
      {
        applyCommonStyles: true,
        customStyleApplier: (config, _el, styles) => {
          // Flexboxスタイルを適用（section固有）
          const flexboxOptions = Styles.extractFlexboxOptions(styles);
          const result = FigmaNodeConfig.applyFlexboxStyles(
            config,
            flexboxOptions,
          );

          // gapをitemSpacingとして適用
          if (flexboxOptions.gap !== undefined) {
            result.itemSpacing = flexboxOptions.gap;
          }

          // heightが設定されている場合、layoutSizingVerticalを"FIXED"に
          if (styles.height) {
            result.layoutSizingVertical = "FIXED";
          }

          return result;
        },
      },
    );
  },

  /**
   * マッピング: 汎用的なHTMLNodeをFigmaノードに変換
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "section",
      this.isSectionElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
