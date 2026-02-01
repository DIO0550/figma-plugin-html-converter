/**
 * アクセシビリティチェック機能の型定義
 */
import type { Brand } from "../types/brand";
import type { RGB } from "../converter/models/colors";

// =============================================================================
// Brand型
// =============================================================================

/**
 * アクセシビリティ問題ID
 */
export type A11yIssueId = Brand<string, "A11yIssueId">;

/**
 * A11yIssueId生成
 */
export function createA11yIssueId(value: string): A11yIssueId {
  return value as A11yIssueId;
}

// =============================================================================
// 列挙的Union型
// =============================================================================

/**
 * 問題の重要度
 */
export type A11ySeverity = "error" | "warning" | "info";

/**
 * WCAG基準
 */
export type WcagCriterion =
  | "1.1.1"
  | "1.3.1"
  | "1.4.3"
  | "1.4.4"
  | "3.1.1"
  | "4.1.2";

/**
 * チェック対象
 */
export type A11yCheckTarget = "html" | "figma" | "both";

/**
 * 問題の種類
 */
export type A11yIssueType =
  | "missing-alt-text"
  | "empty-alt-text"
  | "missing-aria-label"
  | "invalid-aria-role"
  | "duplicate-aria-id"
  | "low-contrast"
  | "insufficient-text-size"
  | "missing-heading-hierarchy"
  | "missing-landmark"
  | "missing-lang-attribute";

// =============================================================================
// 検出された問題
// =============================================================================

/**
 * アクセシビリティ問題の要素情報
 */
export interface A11yElementInfo {
  readonly tagName: string;
  readonly xpath?: string;
  readonly attributes?: Record<string, string>;
  readonly textContent?: string;
  readonly figmaNodeId?: string;
}

/**
 * 検出されたアクセシビリティ問題
 */
export interface A11yIssue {
  readonly id: A11yIssueId;
  readonly type: A11yIssueType;
  readonly severity: A11ySeverity;
  readonly wcagCriterion: WcagCriterion;
  readonly target: A11yCheckTarget;
  readonly element: A11yElementInfo;
  readonly message: string;
  readonly details?: string;
}

// =============================================================================
// 改善提案
// =============================================================================

/**
 * 修正コード
 */
export interface A11yFixCode {
  readonly before: string;
  readonly after: string;
  readonly language: "html" | "css";
}

/**
 * 改善提案
 */
export interface A11ySuggestion {
  readonly issueId: A11yIssueId;
  readonly description: string;
  readonly fixCode?: A11yFixCode;
  readonly wcagReference: string;
}

// =============================================================================
// コントラスト計算
// =============================================================================

/**
 * コントラスト計算結果
 */
export interface ContrastResult {
  readonly ratio: number;
  readonly meetsAA: boolean;
  readonly meetsAALarge: boolean;
  readonly foreground: RGB;
  readonly background: RGB;
}

// =============================================================================
// AI分析
// =============================================================================

/**
 * AI分析結果
 */
export interface A11yAIAnalysis {
  readonly additionalIssues: readonly A11yIssue[];
  readonly enhancedSuggestions: readonly A11ySuggestion[];
  readonly confidence: number;
}

// =============================================================================
// レポート
// =============================================================================

/**
 * WCAG準拠状態
 */
export interface WcagComplianceStatus {
  readonly "1.1.1": boolean;
  readonly "1.3.1": boolean;
  readonly "1.4.3": boolean;
  readonly "1.4.4": boolean;
  readonly "3.1.1": boolean;
  readonly "4.1.2": boolean;
  readonly overallAA: boolean;
}

/**
 * レポートサマリー
 */
export interface A11ySummary {
  readonly totalIssues: number;
  readonly errorCount: number;
  readonly warningCount: number;
  readonly infoCount: number;
  readonly wcagCompliance: WcagComplianceStatus;
}

/**
 * アクセシビリティレポート
 */
export interface A11yReport {
  readonly issues: readonly A11yIssue[];
  readonly suggestions: readonly A11ySuggestion[];
  readonly summary: A11ySummary;
  readonly timestamp: string;
  readonly aiAnalysis?: A11yAIAnalysis;
}

// =============================================================================
// チェッカー設定・コンテキスト
// =============================================================================

/**
 * チェッカー設定
 */
export interface A11yCheckerConfig {
  readonly enabledRules: readonly A11yIssueType[];
  readonly checkTarget: A11yCheckTarget;
  readonly useAIAnalysis: boolean;
  readonly contrastThreshold?: number;
  readonly minTextSize?: number;
}

/**
 * ルールインターフェース
 */
export interface A11yRule {
  readonly id: A11yIssueType;
  readonly wcagCriterion: WcagCriterion;
  readonly severity: A11ySeverity;
  check(context: A11yCheckContext): readonly A11yIssue[];
}

/**
 * パース済みHTMLノード
 */
export interface ParsedHtmlNode {
  readonly tagName: string;
  readonly attributes: Record<string, string>;
  readonly textContent: string;
  readonly children: readonly ParsedHtmlNode[];
  readonly xpath: string;
}

/**
 * Figmaノード情報
 */
export interface FigmaNodeInfo {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly fills?: readonly FigmaPaint[];
  readonly fontSize?: number;
  readonly parentFills?: readonly FigmaPaint[];
}

/**
 * Figmaペイント情報（簡易版）
 */
export interface FigmaPaint {
  readonly type: string;
  readonly color?: RGB;
  readonly opacity?: number;
}

/**
 * チェックコンテキスト
 */
export interface A11yCheckContext {
  readonly html?: string;
  readonly parsedNodes?: readonly ParsedHtmlNode[];
  readonly figmaNodes?: readonly FigmaNodeInfo[];
  readonly config: A11yCheckerConfig;
}
