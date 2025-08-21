import type { BaseElement } from "../base-element";
import type { GlobalAttributes } from "../global-attributes";

/**
 * BaseElementからtagNameを抽出する型
 */
export type ExtractTagName<T> = T extends BaseElement<infer U> ? U : never;

/**
 * Void要素（子要素を持たない要素）かどうかを判定する型
 */
export type IsVoidElement<T extends string> = T extends
  | "area"
  | "base"
  | "br"
  | "col"
  | "embed"
  | "hr"
  | "img"
  | "input"
  | "link"
  | "meta"
  | "param"
  | "source"
  | "track"
  | "wbr"
  ? true
  : false;

/**
 * 要素の子要素の型を決定する
 * Void要素の場合はnever、それ以外はunknown[]
 */
export type ElementChildren<T extends string> = IsVoidElement<T> extends true
  ? never
  : unknown[];

/**
 * 要素固有の属性とグローバル属性をマージする型
 */
export type StrictAttributes<T> = T & GlobalAttributes;

/**
 * HTML要素のタグ名の型
 */
export type HTMLTagName =
  // コンテナ要素
  | "div"
  | "section"
  | "article"
  | "main"
  | "header"
  | "footer"
  | "nav"
  | "aside"
  // テキスト要素
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "a"
  | "strong"
  | "em"
  | "b"
  | "i"
  | "u"
  | "s"
  | "code"
  | "pre"
  | "blockquote"
  | "q"
  | "cite"
  | "abbr"
  | "time"
  | "mark"
  | "small"
  | "sub"
  | "sup"
  // リスト要素
  | "ul"
  | "ol"
  | "li"
  | "dl"
  | "dt"
  | "dd"
  // フォーム要素
  | "form"
  | "input"
  | "button"
  | "textarea"
  | "select"
  | "option"
  | "optgroup"
  | "label"
  | "fieldset"
  | "legend"
  // テーブル要素
  | "table"
  | "thead"
  | "tbody"
  | "tfoot"
  | "tr"
  | "td"
  | "th"
  | "caption"
  | "colgroup"
  | "col"
  // メディア要素
  | "img"
  | "video"
  | "audio"
  | "canvas"
  | "svg"
  | "picture"
  | "source"
  | "track"
  | "iframe"
  | "embed"
  | "object"
  | "param"
  // その他
  | "br"
  | "hr"
  | "wbr"
  | "details"
  | "summary"
  | "dialog"
  | "menu"
  | "script"
  | "noscript"
  | "style"
  | "link"
  | "meta"
  | "base"
  | "title";

/**
 * 型ガード：unknown値がBaseElementかどうかを判定
 */
export function isBaseElement<T extends string>(
  value: unknown
): value is BaseElement<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "tagName" in value &&
    (value as Record<string, unknown>).type === "element" &&
    typeof (value as Record<string, unknown>).tagName === "string"
  );
}

/**
 * 型ガード：タグ名がVoid要素かどうかを判定
 */
export function isVoidElement(tagName: string): boolean {
  const voidElements = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);

  return voidElements.has(tagName.toLowerCase());
}
