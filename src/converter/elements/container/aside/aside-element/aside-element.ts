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
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";
import {
  normalizeClassNameAttribute,
  initializeSemanticFramePadding,
  generateNodeName,
} from "../../../../utils/semantic-frame-helpers/semantic-frame-helpers";

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
    return toFigmaNodeWith(
      element,
      (el) => {
        // classNameをclassに変換（共通ヘルパー使用）
        const attributesForDefaults = normalizeClassNameAttribute(
          el.attributes,
        );

        const config = FigmaNode.createFrame("aside");
        let result = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "aside",
          attributesForDefaults,
        );

        // asideはFIXED幅
        result.layoutSizingHorizontal = "FIXED";
        result.layoutSizingVertical = "HUG";

        // padding と itemSpacing を0で初期化（共通ヘルパー使用）
        result = initializeSemanticFramePadding(result);

        // 複数クラス対応のノード名を生成（共通ヘルパー使用）
        result.name = generateNodeName(
          "aside",
          el.attributes?.id,
          el.attributes?.className,
        );

        // role と aria-label を追加
        if (el.attributes?.role) {
          result.name += `[role=${el.attributes.role}]`;
        }
        if (el.attributes?.["aria-label"]) {
          result.name += `[aria-label=${el.attributes["aria-label"]}]`;
        }

        return result;
      },
      {
        applyCommonStyles: true,
        customStyleApplier: (config, _el, styles) => {
          // Flexboxスタイルを適用（aside固有）
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
