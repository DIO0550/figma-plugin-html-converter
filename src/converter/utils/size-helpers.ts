/**
 * @fileoverview サイズ解決の共通ヘルパー関数
 */

import { Styles } from "../models/styles";

/**
 * サイズ解決のオプション
 */
export interface ResolveSizeOptions {
  /** デフォルトの幅 */
  defaultWidth: number;
  /** デフォルトの高さ */
  defaultHeight: number;
}

/**
 * style属性を持つ可能性のあるオブジェクト
 */
export interface WithStyleAttribute {
  style?: string;
}

/**
 * style属性から幅・高さを解決する
 *
 * @param attributes - style属性を含むオブジェクト
 * @param options - デフォルトサイズのオプション
 * @returns 解決された幅と高さ
 */
export function resolveSize(
  attributes: WithStyleAttribute | undefined,
  options: ResolveSizeOptions,
): { width: number; height: number } {
  const style = attributes?.style;
  if (!style) {
    return { width: options.defaultWidth, height: options.defaultHeight };
  }

  const styles = Styles.parse(style);
  const width = Styles.getWidth(styles);
  const height = Styles.getHeight(styles);

  return {
    width: typeof width === "number" ? width : options.defaultWidth,
    height: typeof height === "number" ? height : options.defaultHeight,
  };
}
