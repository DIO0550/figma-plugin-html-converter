import type { FigmaNodeConfig } from "../../models/figma-node";

/**
 * classNameをclassに変換した属性オブジェクトを返す
 *
 * HTML要素の属性でclassNameとして渡されるものを、
 * Figmaノード生成時に必要なclass属性に変換する。
 *
 * @template T - 属性オブジェクトの型
 * @param attributes - 元の属性オブジェクト
 * @returns classNameがclassに変換された属性オブジェクト
 *
 * @example
 * normalizeClassNameAttribute({ className: "btn primary" })
 * // => { className: "btn primary", class: "btn primary" }
 */
export function normalizeClassNameAttribute<T extends Record<string, unknown>>(
  attributes: T | undefined,
): T & { class?: string } {
  if (!attributes) {
    return {} as T & { class?: string };
  }

  // classが既に存在する場合はそのまま使用
  if ("class" in attributes) {
    return attributes as T & { class?: string };
  }

  // classNameが存在し、かつ型がstringの場合はclassに変換
  if (
    "className" in attributes &&
    attributes.className !== undefined &&
    attributes.className !== null &&
    typeof attributes.className === "string"
  ) {
    return {
      ...attributes,
      class: attributes.className,
    } as T & { class?: string };
  }

  // classNameもclassも存在しない場合
  return attributes as T & { class?: string };
}

/**
 * セマンティック要素のpaddingとitemSpacingを0で初期化
 *
 * header, footer, main などのセマンティック要素のベース設定として
 * すべてのpadding値とitemSpacingを0に設定する。
 *
 * @param config - 初期化対象のFigmaNodeConfig
 * @returns padding/itemSpacingが0に設定されたFigmaNodeConfig
 *
 * @example
 * const config = { type: "FRAME", name: "header" };
 * initializeSemanticFramePadding(config);
 * // => { type: "FRAME", name: "header", paddingLeft: 0, ... itemSpacing: 0 }
 */
export function initializeSemanticFramePadding(
  config: FigmaNodeConfig,
): FigmaNodeConfig {
  return {
    ...config,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    itemSpacing: 0,
  };
}

/**
 * 複数クラス対応のノード名を生成（#id と .class 対応）
 *
 * HTML要素のtagName, id, classNameから、Figmaノードの名前を生成する。
 * - IDとクラスがある場合: "tagName#id.class1.class2"
 * - IDのみ: "tagName#id"
 * - クラスのみ: "tagName.class1.class2"
 * - どちらもない: "tagName"
 *
 * @param tagName - HTML要素のタグ名
 * @param id - HTML要素のid属性（任意）
 * @param className - HTML要素のclass属性（複数クラス対応、任意）
 * @returns 生成されたノード名
 *
 * @example
 * generateNodeName("header", "main-header", "nav primary")
 * // => "header#main-header.nav.primary"
 *
 * @example
 * generateNodeName("footer", undefined, "dark compact")
 * // => "footer.dark.compact"
 */
export function generateNodeName(
  tagName: string,
  id: string | undefined,
  className: string | undefined,
): string {
  // 空文字列をundefinedとして扱う
  const normalizedId = id && id.trim() ? id : undefined;
  const normalizedClassName =
    className && className.trim() ? className : undefined;

  // クラス名を分割して整形
  const classes = normalizedClassName
    ? normalizedClassName.split(/\s+/).filter(Boolean)
    : [];

  // ノード名を生成
  let name = tagName;

  if (normalizedId) {
    name += `#${normalizedId}`;
  }

  if (classes.length > 0) {
    name += `.${classes.join(".")}`;
  }

  return name;
}
