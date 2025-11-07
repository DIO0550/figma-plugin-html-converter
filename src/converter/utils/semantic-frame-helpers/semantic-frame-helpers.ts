import type { FigmaNodeConfig } from "../../models/figma-node";
import { FigmaNodeConfig as FigmaNodeConfigUtil } from "../../models/figma-node";
import { Styles } from "../../models/styles";

type AttributesWithClass<T> = T & { class?: string };

/**
 * セマンティック要素のデフォルトパディング値
 * header, footer, main などのセマンティック要素の初期padding/itemSpacingは0
 */
const SEMANTIC_FRAME_DEFAULT_PADDING = 0;

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
): AttributesWithClass<T> {
  if (!attributes) {
    return {} as AttributesWithClass<T>;
  }

  if ("class" in attributes) {
    return attributes as AttributesWithClass<T>;
  }

  if ("className" in attributes && typeof attributes.className === "string") {
    return {
      ...attributes,
      class: attributes.className,
    } as AttributesWithClass<T>;
  }

  return attributes as AttributesWithClass<T>;
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
    paddingLeft: SEMANTIC_FRAME_DEFAULT_PADDING,
    paddingRight: SEMANTIC_FRAME_DEFAULT_PADDING,
    paddingTop: SEMANTIC_FRAME_DEFAULT_PADDING,
    paddingBottom: SEMANTIC_FRAME_DEFAULT_PADDING,
    itemSpacing: SEMANTIC_FRAME_DEFAULT_PADDING,
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
  const normalizedId = id && id.trim() ? id : undefined;
  const normalizedClassName =
    className && className.trim() ? className : undefined;

  const classes = normalizedClassName
    ? normalizedClassName.split(/\s+/).filter(Boolean)
    : [];

  let name = tagName;

  if (normalizedId) {
    name += `#${normalizedId}`;
  }

  if (classes.length > 0) {
    name += `.${classes.join(".")}`;
  }

  return name;
}

/**
 * セマンティック要素共通のFlexboxスタイルを適用
 *
 * 5つのセマンティック要素（section, nav, header, footer, article）で
 * 共通して使用されるFlexboxスタイル適用ロジックを提供する。
 *
 * 適用内容:
 * - Flexboxレイアウトの設定（display, flex-direction, align-items, justify-content）
 * - gap → itemSpacing のマッピング
 * - height指定時の layoutSizingVertical = "FIXED"
 *
 * @param config - スタイルを適用するFigmaNodeConfig
 * @param styles - 解析済みのStyles
 * @returns Flexboxスタイルが適用されたFigmaNodeConfig
 *
 * @example
 * const config = { type: "FRAME", name: "section" };
 * const styles = Styles.parse("display: flex; gap: 16px; height: 100px");
 * const result = applySemanticFlexboxStyles(config, styles);
 * // => { ...config, layoutMode: "HORIZONTAL", itemSpacing: 16, layoutSizingVertical: "FIXED" }
 */
export function applySemanticFlexboxStyles(
  config: FigmaNodeConfig,
  styles: Styles,
): FigmaNodeConfig {
  // Flexboxスタイルを適用
  const flexboxOptions = Styles.extractFlexboxOptions(styles);
  const result = FigmaNodeConfigUtil.applyFlexboxStyles(config, flexboxOptions);

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
}
