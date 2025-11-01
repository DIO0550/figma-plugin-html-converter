import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { ArticleAttributes } from "../article-attributes";
import type { BaseElement } from "../../../base/base-element";
import { Styles } from "../../../../models/styles";
import { HTMLToFigmaMapper } from "../../../../mapper";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";
import {
  normalizeClassNameAttribute,
  initializeSemanticFramePadding,
  generateNodeName,
} from "../../../../utils/semantic-frame-helpers/semantic-frame-helpers";

/**
 * article要素の型定義
 * HTML5のarticle要素を表現し、Figmaのフレームノードに変換される
 * BaseElementを継承した専用の型
 */
export interface ArticleElement
  extends BaseElement<"article", ArticleAttributes> {
  children?: HTMLNode[];
}

/**
 * article要素のコンパニオンオブジェクト
 * 型ガード、ファクトリー、アクセサ、変換メソッドを提供
 */
export const ArticleElement = {
  /**
   * article要素かどうかを判定する型ガード
   */
  isArticleElement(node: unknown): node is ArticleElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      node.tagName === "article"
    );
  },

  /**
   * article要素を作成するファクトリー関数
   */
  create(
    attributes: Partial<ArticleAttributes> = {},
    children: HTMLNode[] = [],
  ): ArticleElement {
    return {
      type: "element",
      tagName: "article",
      attributes: attributes as ArticleAttributes,
      children,
    };
  },

  /**
   * ID属性を取得
   */
  getId(element: ArticleElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * className属性を取得
   */
  getClassName(element: ArticleElement): string | undefined {
    return element.attributes?.className;
  },

  /**
   * style属性を取得
   */
  getStyle(element: ArticleElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * 任意の属性を取得
   */
  getAttribute(element: ArticleElement, name: string): unknown {
    return element.attributes?.[name as keyof ArticleAttributes];
  },

  /**
   * 子要素を取得
   */
  getChildren(element: ArticleElement): HTMLNode[] | undefined {
    return element.children;
  },

  /**
   * 属性の存在確認
   */
  hasAttribute(element: ArticleElement, name: string): boolean {
    return element.attributes ? name in element.attributes : false;
  },

  /**
   * article要素をFigmaノードに変換
   */
  toFigmaNode(element: ArticleElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        // classNameをclassに変換（共通ヘルパー使用）
        const attributesForDefaults = normalizeClassNameAttribute(
          el.attributes,
        );

        const config = FigmaNode.createFrame("article");
        const baseResult = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "article",
          attributesForDefaults,
        );

        // articleはFIXED幅（applyHtmlElementDefaultsはFILLを設定するため上書き）
        baseResult.layoutSizingHorizontal = "FIXED";
        baseResult.layoutSizingVertical = "HUG";

        // padding と itemSpacing を0で初期化（共通ヘルパー使用）
        const result = initializeSemanticFramePadding(baseResult);

        // 複数クラス対応のノード名を生成（共通ヘルパー使用）
        result.name = generateNodeName(
          "article",
          el.attributes?.id,
          attributesForDefaults.class,
        );

        return result;
      },
      {
        applyCommonStyles: true,
        customStyleApplier: (config, _el, styles) => {
          // Flexboxスタイルを適用（article固有）
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
    if (!ArticleElement.isArticleElement(node)) {
      return null;
    }

    const figmaNode = ArticleElement.toFigmaNode(node);

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
