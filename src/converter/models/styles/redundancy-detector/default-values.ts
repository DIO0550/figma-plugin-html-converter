/**
 * CSS仕様に基づくプロパティのデフォルト値マップ
 * https://www.w3.org/TR/CSS/
 */

/** 汎用CSSデフォルト値マップ（要素種別に依存しないもの） */
export const CSS_DEFAULT_VALUES: Readonly<Record<string, string>> = {
  position: "static",
  opacity: "1",
  visibility: "visible",
  overflow: "visible",
  "overflow-x": "visible",
  "overflow-y": "visible",
  float: "none",
  clear: "none",
  "vertical-align": "baseline",
  "text-decoration": "none",
  "text-transform": "none",
  "font-style": "normal",
  "font-weight": "normal",
  "font-variant": "normal",
  "font-stretch": "normal",
  "letter-spacing": "normal",
  "word-spacing": "normal",
  "white-space": "normal",
  "line-height": "normal",
  "text-align": "start",
  "text-indent": "0",
  "background-color": "transparent",
  "background-image": "none",
  "background-repeat": "repeat",
  "background-position": "0% 0%",
  "background-attachment": "scroll",
  "background-size": "auto",
  "border-style": "none",
  "border-width": "medium",
  "border-color": "currentcolor",
  "border-top-style": "none",
  "border-right-style": "none",
  "border-bottom-style": "none",
  "border-left-style": "none",
  "border-top-width": "medium",
  "border-right-width": "medium",
  "border-bottom-width": "medium",
  "border-left-width": "medium",
  "border-radius": "0",
  "border-top-left-radius": "0",
  "border-top-right-radius": "0",
  "border-bottom-right-radius": "0",
  "border-bottom-left-radius": "0",
  "outline-style": "none",
  "outline-width": "medium",
  "margin-top": "0",
  "margin-right": "0",
  "margin-bottom": "0",
  "margin-left": "0",
  "padding-top": "0",
  "padding-right": "0",
  "padding-bottom": "0",
  "padding-left": "0",
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto",
  "z-index": "auto",
  "flex-grow": "0",
  "flex-shrink": "1",
  "flex-basis": "auto",
  "flex-direction": "row",
  "flex-wrap": "nowrap",
  "justify-content": "normal",
  "align-items": "normal",
  "align-self": "auto",
  "align-content": "normal",
  order: "0",
  "column-gap": "normal",
  "row-gap": "normal",
  gap: "normal",
  "box-shadow": "none",
  "text-shadow": "none",
  transform: "none",
  transition: "none",
  animation: "none",
  cursor: "auto",
  "pointer-events": "auto",
  "user-select": "auto",
  resize: "none",
  "box-sizing": "content-box",
  "table-layout": "auto",
  "border-collapse": "separate",
  "border-spacing": "0",
  "empty-cells": "show",
  "caption-side": "top",
  "list-style-type": "disc",
  "list-style-position": "outside",
  "list-style-image": "none",
  content: "normal",
  "min-width": "auto",
  "min-height": "auto",
  "max-width": "none",
  "max-height": "none",
};

/** 要素別display初期値マップ */
const BLOCK_ELEMENTS = [
  "div",
  "section",
  "article",
  "aside",
  "nav",
  "header",
  "footer",
  "main",
  "figure",
  "figcaption",
  "details",
  "summary",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "pre",
  "address",
  "fieldset",
  "form",
  "hr",
  "dl",
  "dt",
  "dd",
  "ol",
  "ul",
] as const;

const INLINE_ELEMENTS = [
  "span",
  "a",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "small",
  "sub",
  "sup",
  "abbr",
  "cite",
  "code",
  "kbd",
  "samp",
  "var",
  "q",
  "time",
  "mark",
  "bdo",
  "bdi",
  "br",
  "wbr",
  "label",
  "output",
] as const;

const TABLE_DISPLAY_MAP: Readonly<Record<string, string>> = {
  table: "table",
  thead: "table-header-group",
  tbody: "table-row-group",
  tfoot: "table-footer-group",
  tr: "table-row",
  td: "table-cell",
  th: "table-cell",
  caption: "table-caption",
  colgroup: "table-column-group",
  col: "table-column",
};

/**
 * 要素のタグ名からdisplayのデフォルト値を取得する
 */
export function getDefaultDisplay(tagName: string): string {
  const lower = tagName.toLowerCase();

  if (BLOCK_ELEMENTS.includes(lower as (typeof BLOCK_ELEMENTS)[number])) {
    return "block";
  }

  if (INLINE_ELEMENTS.includes(lower as (typeof INLINE_ELEMENTS)[number])) {
    return "inline";
  }

  if (lower in TABLE_DISPLAY_MAP) {
    return TABLE_DISPLAY_MAP[lower];
  }

  if (lower === "li") {
    return "list-item";
  }

  if (
    lower === "img" ||
    lower === "input" ||
    lower === "button" ||
    lower === "select" ||
    lower === "textarea"
  ) {
    return "inline-block";
  }

  return "inline";
}

/**
 * 指定プロパティのデフォルト値を取得する
 * displayプロパティの場合はtagNameを考慮
 */
export function getDefaultValue(
  property: string,
  tagName?: string,
): string | undefined {
  if (property === "display" && tagName) {
    return getDefaultDisplay(tagName);
  }

  return CSS_DEFAULT_VALUES[property];
}

/**
 * 値がデフォルト値と一致するかチェック
 * !important付きやCSS変数を含む値は常にfalseを返す
 */
export function isDefaultValue(
  property: string,
  value: string,
  tagName?: string,
): boolean {
  if (value.includes("!important") || value.includes("var(")) {
    return false;
  }

  const defaultValue = getDefaultValue(property, tagName);
  if (defaultValue === undefined) {
    return false;
  }

  const normalizedValue = normalizeZeroValue(value.trim());
  const normalizedDefault = normalizeZeroValue(defaultValue.trim());

  return normalizedValue === normalizedDefault;
}

/**
 * 0値の正規化: 0px, 0em, 0rem → 0
 */
function normalizeZeroValue(value: string): string {
  return value.replace(/^0(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)$/, "0");
}
