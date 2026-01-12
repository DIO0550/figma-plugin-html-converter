/**
 * プレースホルダー要素で共通して使用するユーティリティ
 * embed/object/iframe要素のFigma変換で使用する共通ロジックを提供
 */

import type { FigmaNodeConfig } from "../../models/figma-node";
import { Paint } from "../../models/paint";

/**
 * Figmaの標準プレースホルダー色
 * 他のFigma要素との視覚的一貫性を確保するための共通設定
 */
export const DEFAULT_PLACEHOLDER_COLOR = { r: 0.94, g: 0.94, b: 0.94 };

/**
 * ラベル表示の共通設定
 *
 * 各値の意図:
 * - MAX_LENGTH: URLの可読性を保ちながら長すぎる表示を防ぐための文字数上限
 * - ELLIPSIS: 省略時に使用する標準的な省略記号
 * - FONT_SIZE: Figmaの標準的なキャプションサイズに準拠
 * - COLOR: グレー（50%）で控えめな表示、メインコンテンツより目立たない
 * - ITEM_SPACING: Figmaの標準的な8pxグリッドシステムに準拠
 */
export const LABEL_CONFIG = {
  MAX_LENGTH: 50,
  ELLIPSIS: "...",
  FONT_SIZE: 12,
  COLOR: { r: 0.5, g: 0.5, b: 0.5 },
  ITEM_SPACING: 8,
} as const;

/**
 * プレースホルダーの塗りつぶしを作成する
 * @returns 標準プレースホルダー色のPaint配列
 */
export function createPlaceholderFills(): Paint[] {
  return [Paint.solid(DEFAULT_PLACEHOLDER_COLOR)];
}

/**
 * URLラベルを作成する
 * @param url - 表示するURL
 * @param name - ラベル名（デフォルト: "url-label"）
 * @returns FigmaNodeConfig
 */
export function createUrlLabel(
  url: string,
  name: string = "url-label",
): FigmaNodeConfig {
  let displayUrl = url;
  if (url.length > LABEL_CONFIG.MAX_LENGTH) {
    displayUrl =
      url.substring(0, LABEL_CONFIG.MAX_LENGTH) + LABEL_CONFIG.ELLIPSIS;
  }

  const label: FigmaNodeConfig = {
    type: "TEXT",
    name,
    characters: displayUrl,
    fontSize: LABEL_CONFIG.FONT_SIZE,
    fills: [Paint.solid(LABEL_CONFIG.COLOR)],
  };

  return label;
}

/**
 * テキストラベルを作成する
 * @param text - 表示するテキスト
 * @param name - ラベル名
 * @returns FigmaNodeConfig
 */
export function createTextLabel(text: string, name: string): FigmaNodeConfig {
  const label: FigmaNodeConfig = {
    type: "TEXT",
    name,
    characters: text,
    fontSize: LABEL_CONFIG.FONT_SIZE,
    fills: [Paint.solid(LABEL_CONFIG.COLOR)],
  };

  return label;
}
