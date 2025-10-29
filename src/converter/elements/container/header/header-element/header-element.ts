import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { HeaderAttributes } from "../header-attributes";
import type { BaseElement } from "../../../base/base-element";
import { Styles } from "../../../../models/styles";
import { HTMLToFigmaMapper } from "../../../../mapper";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * header要素の型定義
 * HTML5のheader要素を表現し、Figmaのフレームノードに変換される
 * BaseElementを継承した専用の型
 */
export interface HeaderElement extends BaseElement<"header", HeaderAttributes> {
  children?: HTMLNode[];
}

/**
 * header要素のコンパニオンオブジェクト
 * 型ガード、ファクトリー、アクセサ、変換メソッドを提供
 */
export const HeaderElement = {
  /**
   * header要素かどうかを判定する型ガード
   */
  isHeaderElement(node: unknown): node is HeaderElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      node.tagName === "header"
    );
  },

  /**
   * header要素を作成するファクトリー関数
   */
  create(
    attributes: Partial<HeaderAttributes> = {},
    children: HTMLNode[] = [],
  ): HeaderElement {
    return {
      type: "element",
      tagName: "header",
      attributes: attributes as HeaderAttributes,
      children,
    };
  },

  /**
   * ID属性を取得
   */
  getId(element: HeaderElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * className属性を取得
   */
  getClassName(element: HeaderElement): string | undefined {
    return element.attributes?.className;
  },

  /**
   * style属性を取得
   */
  getStyle(element: HeaderElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * 任意の属性を取得
   */
  getAttribute(element: HeaderElement, name: string): unknown {
    return element.attributes?.[name as keyof HeaderAttributes];
  },

  /**
   * 子要素を取得
   */
  getChildren(element: HeaderElement): HTMLNode[] | undefined {
    return element.children;
  },

  /**
   * 属性の存在確認
   */
  hasAttribute(element: HeaderElement, name: string): boolean {
    return element.attributes ? name in element.attributes : false;
  },

  /**
   * header要素をFigmaノードに変換
   */
  toFigmaNode(element: HeaderElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        // classNameをclassに変換してapplyHtmlElementDefaultsに渡す
        const attributesForDefaults = {
          ...el.attributes,
          class: el.attributes?.className || el.attributes?.class,
        };

        const config = FigmaNode.createFrame("header");
        const result = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "header",
          attributesForDefaults,
        );

        // headerはFIXED幅でHORIZONTALレイアウト
        result.layoutMode = "HORIZONTAL";
        result.layoutSizingHorizontal = "FIXED";
        result.layoutSizingVertical = "HUG";

        // padding と itemSpacing のデフォルト値を設定
        result.paddingLeft = 0;
        result.paddingRight = 0;
        result.paddingTop = 0;
        result.paddingBottom = 0;
        result.itemSpacing = 0;

        // 複数クラス対応のノード名を生成（applyHtmlElementDefaultsは最初のクラスのみ使用）
        if (el.attributes?.className) {
          const classes = el.attributes?.className.split(" ").filter(Boolean);
          if (classes.length >= 1) {
            // 全てのクラスを含める
            result.name = el.attributes?.id
              ? `header#${el.attributes.id}.${classes.join(".")}`
              : `header.${classes.join(".")}`;
          }
        }

        return result;
      },
      {
        applyCommonStyles: true,
        customStyleApplier: (config, _el, styles) => {
          // Flexboxスタイルを適用（header固有）
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
    if (!HeaderElement.isHeaderElement(node)) {
      return null;
    }

    const figmaNode = HeaderElement.toFigmaNode(node);

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
