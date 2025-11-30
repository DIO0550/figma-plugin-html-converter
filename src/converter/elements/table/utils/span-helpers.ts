/**
 * @fileoverview テーブル要素のspan関連ヘルパー関数
 *
 * td/th要素のcolspan/rowspan、col/colgroup要素のspan属性を
 * 取得するための共通ユーティリティ関数を提供します。
 */

/**
 * colspan属性を持つ要素の型
 */
type ElementWithColspan = {
  attributes?: { colspan?: string | number };
};

/**
 * rowspan属性を持つ要素の型
 */
type ElementWithRowspan = {
  attributes?: { rowspan?: string | number };
};

/**
 * span属性を持つ要素の型
 */
type ElementWithSpan = {
  attributes?: { span?: string | number };
};

/**
 * colspan属性の値を取得する
 *
 * td/th要素のcolspan属性を数値として取得します。
 * 未設定、無効値、0以下の場合はデフォルト値1を返します。
 *
 * @param element - colspan属性を持つ要素
 * @returns colspan値（1以上の整数）
 *
 * @example
 * ```typescript
 * getColspanValue({ attributes: { colspan: "2" } }); // => 2
 * getColspanValue({ attributes: {} }); // => 1
 * getColspanValue({ attributes: { colspan: "invalid" } }); // => 1
 * ```
 */
export function getColspanValue(element: ElementWithColspan): number {
  const colspan = element.attributes?.colspan;
  if (colspan === undefined || colspan === "") {
    return 1;
  }
  const parsed =
    typeof colspan === "number" ? colspan : parseInt(String(colspan), 10);
  return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
}

/**
 * rowspan属性の値を取得する
 *
 * td/th要素のrowspan属性を数値として取得します。
 * 未設定、無効値、0以下の場合はデフォルト値1を返します。
 *
 * @param element - rowspan属性を持つ要素
 * @returns rowspan値（1以上の整数）
 *
 * @example
 * ```typescript
 * getRowspanValue({ attributes: { rowspan: "3" } }); // => 3
 * getRowspanValue({ attributes: {} }); // => 1
 * getRowspanValue({ attributes: { rowspan: "-1" } }); // => 1
 * ```
 */
export function getRowspanValue(element: ElementWithRowspan): number {
  const rowspan = element.attributes?.rowspan;
  if (rowspan === undefined || rowspan === "") {
    return 1;
  }
  const parsed =
    typeof rowspan === "number" ? rowspan : parseInt(String(rowspan), 10);
  return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
}

/**
 * span属性の値を取得する
 *
 * col/colgroup要素のspan属性を数値として取得します。
 * 未設定、無効値、1未満の場合はデフォルト値1を返します。
 *
 * @param element - span属性を持つ要素
 * @returns span値（1以上の整数）
 *
 * @example
 * ```typescript
 * getSpanValue({ attributes: { span: "2" } }); // => 2
 * getSpanValue({ attributes: {} }); // => 1
 * getSpanValue({ attributes: { span: 0 } }); // => 1
 * ```
 */
export function getSpanValue(element: ElementWithSpan): number {
  const span = element.attributes?.span;
  if (span === undefined) {
    return 1;
  }
  const parsed = typeof span === "number" ? span : parseInt(String(span), 10);
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
}
