import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { MainAttributes } from "../main-attributes";
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
 * main要素の型定義
 * HTML5のmain要素を表現し、Figmaのフレームノードに変換される
 * BaseElementを継承した専用の型
 */
export interface MainElement extends BaseElement<"main", MainAttributes> {
  children?: HTMLNode[];
}

/**
 * main要素のコンパニオンオブジェクト
 * 型ガード、ファクトリー、アクセサ、変換メソッドを提供
 */
export const MainElement = {
  /**
   * main要素かどうかを判定する型ガード
   */
  isMainElement(node: unknown): node is MainElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      node.tagName === "main"
    );
  },

  /**
   * main要素を作成するファクトリー関数
   */
  create(
    attributes: Partial<MainAttributes> = {},
    children: HTMLNode[] = [],
  ): MainElement {
    return {
      type: "element",
      tagName: "main",
      attributes: attributes as MainAttributes,
      children,
    };
  },

  /**
   * ID属性を取得
   */
  getId(element: MainElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * className属性を取得
   */
  getClassName(element: MainElement): string | undefined {
    return element.attributes?.className;
  },

  /**
   * style属性を取得
   */
  getStyle(element: MainElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * 任意の属性を取得
   */
  getAttribute(element: MainElement, name: string): unknown {
    return element.attributes?.[name as keyof MainAttributes];
  },

  /**
   * 子要素を取得
   */
  getChildren(element: MainElement): HTMLNode[] | undefined {
    return element.children;
  },

  /**
   * 属性の存在確認
   */
  hasAttribute(element: MainElement, name: string): boolean {
    return element.attributes ? name in element.attributes : false;
  },

  /**
   * main要素をFigmaノードに変換
   */
  toFigmaNode(element: MainElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const attributesForDefaults = normalizeClassNameAttribute(
          el.attributes,
        );

        const config = FigmaNode.createFrame("main");
        const baseResult = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "main",
          attributesForDefaults,
        );

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
        customStyleApplier: (config, _el, styles) => {
          // Flexboxスタイルを適用（main固有）
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
    if (!MainElement.isMainElement(node)) {
      return null;
    }

    const figmaNode = MainElement.toFigmaNode(node);

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
