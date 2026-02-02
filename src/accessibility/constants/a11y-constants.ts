/**
 * アクセシビリティチェック機能の定数
 */
import type { A11yCheckerConfig, A11yIssueType } from "../types";

// =============================================================================
// WCAG 2.1 コントラスト基準値
// =============================================================================

/**
 * WCAG 2.1 Level AA コントラスト比の基準値
 */
export const WCAG_CONTRAST = {
  /** 通常テキスト（18pt未満）の最低コントラスト比 */
  AA_NORMAL_TEXT: 4.5,
  /** 大きいテキスト（18pt以上 or 14pt太字以上）の最低コントラスト比 */
  AA_LARGE_TEXT: 3.0,
  /** コントラスト比の最大値（黒と白） */
  MAX_RATIO: 21,
  /** コントラスト比の最小値（同色） */
  MIN_RATIO: 1,
} as const;

// =============================================================================
// テキストサイズ基準値
// =============================================================================

/**
 * テキストサイズの基準値
 */
export const TEXT_SIZE = {
  /** 最小フォントサイズ（px） */
  MIN_FONT_SIZE_PX: 12,
  /** 大きいテキストの閾値（pt） */
  LARGE_TEXT_THRESHOLD_PT: 18,
  /** 太字の大きいテキストの閾値（pt） */
  LARGE_TEXT_BOLD_THRESHOLD_PT: 14,
  /** pt → px 変換係数 */
  PT_TO_PX_RATIO: 1.333,
} as const;

// =============================================================================
// 相対輝度計算
// =============================================================================

/**
 * sRGB → リニアRGB変換の定数
 */
export const SRGB_LINEAR = {
  /** sRGBリニア変換の閾値 */
  THRESHOLD: 0.04045,
  /** 低値の除数 */
  LOW_DIVISOR: 12.92,
  /** 高値のオフセット */
  HIGH_OFFSET: 0.055,
  /** 高値の除数 */
  HIGH_DIVISOR: 1.055,
  /** ガンマ指数 */
  GAMMA: 2.4,
} as const;

/**
 * 相対輝度の重み係数（WCAG準拠: ITU-R BT.709）
 */
export const RELATIVE_LUMINANCE_WEIGHTS = {
  RED: 0.2126,
  GREEN: 0.7152,
  BLUE: 0.0722,
} as const;

/**
 * コントラスト比計算のオフセット
 */
export const CONTRAST_OFFSET = 0.05;

// =============================================================================
// 有効なARIAロール
// =============================================================================

/**
 * 有効なARIAロール一覧
 */
export const VALID_ARIA_ROLES = [
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "button",
  "cell",
  "checkbox",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "dialog",
  "directory",
  "document",
  "feed",
  "figure",
  "form",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "navigation",
  "none",
  "note",
  "option",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",
] as const;

/**
 * ランドマーク要素
 */
export const LANDMARK_ELEMENTS = [
  "header",
  "nav",
  "main",
  "aside",
  "footer",
] as const;

/**
 * 見出し要素（階層順）
 */
export const HEADING_ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

// =============================================================================
// WCAG基準リファレンスURL
// =============================================================================

/**
 * WCAG基準リファレンスURL
 */
export const WCAG_REFERENCE_URLS = {
  "1.1.1": "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",
  "1.3.1":
    "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",
  "1.4.3": "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",
  "1.4.4": "https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html",
  "3.1.1": "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html",
  "4.1.2": "https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html",
} as const;

// =============================================================================
// デフォルト設定
// =============================================================================

/**
 * 全ルールのリスト
 */
export const ALL_A11Y_RULES: readonly A11yIssueType[] = [
  "missing-alt-text",
  "empty-alt-text",
  "missing-aria-label",
  "invalid-aria-role",
  "duplicate-aria-id",
  "aria-attributes",
  "low-contrast",
  "insufficient-text-size",
  "missing-heading-hierarchy",
  "missing-landmark",
  "missing-lang-attribute",
  "semantic-html",
] as const;

/**
 * デフォルトのチェッカー設定
 */
export const DEFAULT_A11Y_CONFIG: A11yCheckerConfig = {
  enabledRules: ALL_A11Y_RULES,
  checkTarget: "both",
  useAIAnalysis: false,
  contrastThreshold: WCAG_CONTRAST.AA_NORMAL_TEXT,
  minTextSize: TEXT_SIZE.MIN_FONT_SIZE_PX,
} as const;

// =============================================================================
// AI分析設定
// =============================================================================

/**
 * AI分析の設定
 */
export const AI_ANALYSIS = {
  /** AI分析のタイムアウト（ミリ秒） */
  TIMEOUT_MS: 30000,
  /** AI分析の最小信頼度 */
  MIN_CONFIDENCE: 0.5,
} as const;
