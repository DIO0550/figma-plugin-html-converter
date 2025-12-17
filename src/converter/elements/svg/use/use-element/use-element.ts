import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { UseAttributes } from "../use-attributes";
import type { SvgChildNode } from "../../group/group-element";
import { SvgTransformUtils } from "../../utils/svg-transform-utils";
import { SvgAttributes } from "../../svg-attributes";

/**
 * SVG use（再利用）要素の型定義
 *
 * use要素はdefs内で定義された要素を参照し、再利用する
 */
export interface UseElement {
  type: "element";
  tagName: "use";
  attributes: UseAttributes;
  children?: SvgChildNode[];
}

/**
 * 数値をパースするヘルパー関数
 */
function parseNumber(value: string | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = typeof value === "number" ? value : parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * UseElementコンパニオンオブジェクト
 */
export const UseElement = {
  /**
   * UseElement型ガード
   *
   * @param node - 判定対象のノード
   * @returns nodeがUseElementの場合true
   */
  isUseElement(node: unknown): node is UseElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "use"
    );
  },

  /**
   * UseElementファクトリーメソッド
   *
   * @param attributes - use要素の属性
   * @returns 新しいUseElementインスタンス
   */
  create(attributes: UseAttributes = {}): UseElement {
    return {
      type: "element",
      tagName: "use",
      attributes,
    };
  },

  /**
   * href属性を取得（href優先、xlink:hrefフォールバック）
   *
   * @param element - 対象のUseElement
   * @returns 参照先のID（#付き）、未設定の場合はundefined
   */
  getHref(element: UseElement): string | undefined {
    return element.attributes.href ?? element.attributes["xlink:href"];
  },

  /**
   * x属性を取得
   *
   * @param element - 対象のUseElement
   * @returns x座標の数値、未設定の場合は0
   */
  getX(element: UseElement): number {
    return parseNumber(element.attributes.x) ?? 0;
  },

  /**
   * y属性を取得
   *
   * @param element - 対象のUseElement
   * @returns y座標の数値、未設定の場合は0
   */
  getY(element: UseElement): number {
    return parseNumber(element.attributes.y) ?? 0;
  },

  /**
   * width属性を取得
   *
   * @param element - 対象のUseElement
   * @returns 幅の数値、未設定の場合はundefined
   */
  getWidth(element: UseElement): number | undefined {
    return parseNumber(element.attributes.width);
  },

  /**
   * height属性を取得
   *
   * @param element - 対象のUseElement
   * @returns 高さの数値、未設定の場合はundefined
   */
  getHeight(element: UseElement): number | undefined {
    return parseNumber(element.attributes.height);
  },

  /**
   * id属性を取得
   *
   * @param element - 対象のUseElement
   * @returns id属性の値、未設定の場合はundefined
   */
  getId(element: UseElement): string | undefined {
    return element.attributes.id;
  },

  /**
   * opacity属性を取得
   *
   * @param element - 対象のUseElement
   * @returns opacity属性の値、未設定の場合はundefined
   */
  getOpacity(element: UseElement): number | undefined {
    return SvgAttributes.getOpacity(element.attributes);
  },

  /**
   * transform属性を取得
   *
   * @param element - 対象のUseElement
   * @returns transform属性の値、未設定の場合はundefined
   */
  getTransform(element: UseElement): string | undefined {
    return SvgAttributes.getTransform(element.attributes);
  },

  /**
   * UseElementをFigmaのGROUPノードに変換
   *
   * 参照先の要素解決は呼び出し側で行う想定
   * use要素自体はGROUPとして変換し、x/y属性を位置として適用
   *
   * @param element - 変換するUse要素
   * @returns FigmaノードConfig
   */
  toFigmaNode(element: UseElement): FigmaNodeConfig {
    const id = this.getId(element);
    const name = id ?? "use";

    const config = FigmaNode.createGroup(name);

    // x, y属性から位置を取得
    const x = this.getX(element);
    const y = this.getY(element);

    // transform属性からの位置オフセットを取得
    const transform = this.getTransform(element);
    let translationX = 0;
    let translationY = 0;
    if (transform) {
      const commands = SvgTransformUtils.parseTransform(transform);
      const translation = SvgTransformUtils.extractTranslation(commands);
      translationX = translation.x;
      translationY = translation.y;
    }

    // x/y属性またはtransformのオフセットが0以外の場合のみ設定
    // (use要素固有: x/y属性はtranslateと同等の効果を持つ)
    const hasPosition = x !== 0 || y !== 0;
    const hasTransform = translationX !== 0 || translationY !== 0;
    if (hasPosition || hasTransform) {
      config.x = x + translationX;
      config.y = y + translationY;
    }

    // opacity属性の適用
    const opacity = this.getOpacity(element);
    if (opacity !== undefined) {
      config.opacity = opacity;
    }

    // 子要素配列を初期化（参照解決は呼び出し側で行う）
    config.children = [];

    return config;
  },

  /**
   * 任意のノードをUseElementとしてFigmaノード設定にマッピング
   *
   * @param node - マッピング対象のノード
   * @returns FigmaNodeConfig（use要素の場合）、またはnull（use要素でない場合）
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "use",
      this.isUseElement,
      (attrs) => this.create(attrs),
      (element) => this.toFigmaNode(element),
    );
  },
};
