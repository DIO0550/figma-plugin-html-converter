/**
 * ブランド型を定義するためのユーティリティ型
 * 
 * @template T - ベースとなる型
 * @template B - ブランド名（文字列リテラル）
 * 
 * @example
 * type HTML = Brand<string, 'HTML'>;
 * type Styles = Brand<Record<string, string>, 'Styles'>;
 */
export type Brand<T, B extends string> = T & { __brand: B };