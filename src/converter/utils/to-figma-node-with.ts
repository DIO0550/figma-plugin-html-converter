import type { FigmaNodeConfig } from "../models/figma-node";
import { FigmaNodeConfig as FigmaNodeConfigUtil } from "../models/figma-node";
import { Styles } from "../models/styles";
import type { BaseElement } from "../elements/base/base-element";

/**
 * toFigmaNodeWith のオプション設定
 */
interface ToFigmaNodeOptions<T extends BaseElement<string, unknown>> {
  /**
   * 共通スタイル（背景色、パディング、ボーダー、サイズ）を自動適用するか
   * デフォルト: true
   */
  applyCommonStyles?: boolean;

  /**
   * 要素固有のカスタムスタイルを適用する関数
   * 共通スタイル適用後に実行される
   */
  customStyleApplier?: (
    config: FigmaNodeConfig,
    element: T,
    styles: Styles,
  ) => FigmaNodeConfig;

  /**
   * 子要素を変換する関数
   * 要素が子要素を持つ場合に使用
   */
  childrenConverter?: (element: T) => FigmaNodeConfig[];
}

/**
 * 汎用的なtoFigmaNode実装を提供する高階関数
 *
 * @template T - BaseElementを継承した要素型
 * @param element - 変換対象の要素
 * @param createBaseConfig - ベース設定を作成する関数
 * @param options - オプション設定
 * @returns 変換されたFigmaNodeConfig
 *
 * @example
 * // パターン1: HTMLFrame使用
 * export function toFigmaNode(element: PElement): FigmaNodeConfig {
 *   return toFigmaNodeWith(
 *     element,
 *     (el) => {
 *       const frame = HTMLFrame.from("p", el.attributes);
 *       return HTMLFrame.toFigmaNodeConfig(frame);
 *     },
 *     {
 *       applyCommonStyles: true,
 *       childrenConverter: (el) =>
 *         ElementContextConverter.convertAll(
 *           el.children,
 *           el.attributes?.style,
 *           "p"
 *         ).map((result) => result.node as FigmaNodeConfig),
 *     }
 *   );
 * }
 *
 * @example
 * // パターン2: createFrame + Flexbox
 * export function toFigmaNode(element: DivElement): FigmaNodeConfig {
 *   return toFigmaNodeWith(
 *     element,
 *     (el) => {
 *       let config = FigmaNode.createFrame("div");
 *       return FigmaNodeConfig.applyHtmlElementDefaults(
 *         config,
 *         "div",
 *         el.attributes
 *       );
 *     },
 *     {
 *       applyCommonStyles: true,
 *       customStyleApplier: (config, el, styles) =>
 *         FigmaNodeConfig.applyFlexboxStyles(
 *           config,
 *           Styles.extractFlexboxOptions(styles)
 *         ),
 *     }
 *   );
 * }
 */
export function toFigmaNodeWith<T extends BaseElement<string, unknown>>(
  element: T,
  createBaseConfig: (element: T) => FigmaNodeConfig,
  options: ToFigmaNodeOptions<T> = {},
): FigmaNodeConfig {
  const {
    applyCommonStyles = true,
    customStyleApplier,
    childrenConverter,
  } = options;

  // 1. ベース設定を作成
  let config = createBaseConfig(element);

  // 2. スタイルを解析（存在する場合のみ）
  const styleString =
    element.attributes &&
    typeof element.attributes === "object" &&
    element.attributes !== null &&
    "style" in element.attributes
      ? (element.attributes.style as string | undefined)
      : undefined;

  if (!styleString) {
    // スタイルがない場合は子要素のみ処理して早期リターン
    if (childrenConverter) {
      const children = childrenConverter(element);
      return { ...config, children };
    }
    return config;
  }

  const styles = Styles.parse(styleString);

  // 3. 共通スタイルを適用
  if (applyCommonStyles) {
    config = applyCommonStylesInternal(config, styles);
  }

  // 4. カスタムスタイルを適用
  if (customStyleApplier) {
    config = customStyleApplier(config, element, styles);
  }

  // 5. 子要素を変換
  if (childrenConverter) {
    const children = childrenConverter(element);
    config = { ...config, children };
  }

  return config;
}

/**
 * 4つの共通スタイルを適用する内部関数
 *
 * 適用するスタイル:
 * 1. 背景色 (applyBackgroundColor)
 * 2. パディング (applyPaddingStyles)
 * 3. ボーダー (applyBorderStyles)
 * 4. サイズ (applySizeStyles)
 *
 * @param config - 適用対象のFigmaNodeConfig
 * @param styles - 解析済みのStyles
 * @returns スタイルが適用されたFigmaNodeConfig
 */
function applyCommonStylesInternal(
  config: FigmaNodeConfig,
  styles: Styles,
): FigmaNodeConfig {
  let result = config;

  // 1. 背景色
  const backgroundColor = Styles.getBackgroundColor(styles);
  if (backgroundColor) {
    result = FigmaNodeConfigUtil.applyBackgroundColor(result, backgroundColor);
  }

  // 2. パディング（統一）
  const padding = Styles.getPadding(styles);
  if (padding) {
    result = FigmaNodeConfigUtil.applyPaddingStyles(result, padding);
  }

  // 2.5. 個別パディング
  const paddingTop = Styles.getPaddingTop(styles);
  const paddingRight = Styles.getPaddingRight(styles);
  const paddingBottom = Styles.getPaddingBottom(styles);
  const paddingLeft = Styles.getPaddingLeft(styles);

  if (paddingTop !== null && typeof paddingTop === "number") {
    result.paddingTop = paddingTop;
  }
  if (paddingRight !== null && typeof paddingRight === "number") {
    result.paddingRight = paddingRight;
  }
  if (paddingBottom !== null && typeof paddingBottom === "number") {
    result.paddingBottom = paddingBottom;
  }
  if (paddingLeft !== null && typeof paddingLeft === "number") {
    result.paddingLeft = paddingLeft;
  }

  // 3. ボーダー
  result = FigmaNodeConfigUtil.applyBorderStyles(
    result,
    Styles.extractBorderOptions(styles),
  );

  // 4. サイズ
  result = FigmaNodeConfigUtil.applySizeStyles(
    result,
    Styles.extractSizeOptions(styles),
  );

  // 5. 最小・最大サイズ
  if (styles["min-width"]) {
    const minWidth = parseFloat(styles["min-width"]);
    if (!isNaN(minWidth)) {
      result.minWidth = minWidth;
    }
  }
  if (styles["max-width"]) {
    const maxWidth = parseFloat(styles["max-width"]);
    if (!isNaN(maxWidth)) {
      result.maxWidth = maxWidth;
    }
  }
  if (styles["min-height"]) {
    const minHeight = parseFloat(styles["min-height"]);
    if (!isNaN(minHeight)) {
      result.minHeight = minHeight;
    }
  }
  if (styles["max-height"]) {
    const maxHeight = parseFloat(styles["max-height"]);
    if (!isNaN(maxHeight)) {
      result.maxHeight = maxHeight;
    }
  }

  return result;
}
