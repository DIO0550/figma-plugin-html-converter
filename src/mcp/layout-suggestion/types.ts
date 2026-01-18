/**
 * スマートレイアウト提案機能の型定義
 */
import type { Brand } from "../../types/brand";
import type { AutoLayoutProperties } from "../../converter/models/auto-layout";
import type { Styles } from "../../converter/models/styles";

// =============================================================================
// Brand型
// =============================================================================

/**
 * 提案ID
 */
export type SuggestionId = Brand<string, "SuggestionId">;

/**
 * HTMLノードパス（要素の位置を特定するパス）
 */
export type NodePath = Brand<string, "NodePath">;

// =============================================================================
// レイアウト問題
// =============================================================================

/**
 * レイアウト問題の種類
 */
export type LayoutProblemType =
  | "missing-flex-container" // Flexコンテナがない
  | "inefficient-nesting" // 非効率なネスト構造
  | "inconsistent-spacing" // 一貫性のないスペーシング
  | "missing-alignment" // 配置指定がない
  | "suboptimal-direction"; // 最適でない方向指定

/**
 * 問題の重大度
 */
export type ProblemSeverity = "low" | "medium" | "high";

/**
 * レイアウト問題
 */
export interface LayoutProblem {
  /** 問題の種類 */
  type: LayoutProblemType;
  /** 重大度 */
  severity: ProblemSeverity;
  /** HTMLノードのパス */
  location: NodePath;
  /** 問題の説明 */
  description: string;
  /** 現在の値（存在する場合） */
  currentValue?: string;
}

// =============================================================================
// 改善提案
// =============================================================================

/**
 * 改善提案
 */
export interface LayoutSuggestion {
  /** 提案ID */
  id: SuggestionId;
  /** 対応する問題 */
  problem: LayoutProblem;
  /** 提案内容（人間が読める説明） */
  suggestion: string;
  /** 改善後のレイアウトプロパティ */
  improvedLayout?: AutoLayoutProperties;
  /** 改善後のスタイル */
  improvedStyles?: Record<string, string>;
  /** AI信頼度（0-1） */
  confidence: number;
  /** 自動適用可能かどうか */
  autoApplicable: boolean;
}

// =============================================================================
// 分析結果
// =============================================================================

/**
 * レイアウト分析コンテキスト
 */
export interface LayoutAnalysisContext {
  /** HTML文字列 */
  html: string;
  /** 親要素のスタイル（存在する場合） */
  parentStyles?: Styles;
  /** ネストの深さ */
  nestingDepth: number;
}

/**
 * レイアウト分析結果
 */
export interface LayoutAnalysisResult {
  /** 検出された問題のリスト */
  problems: LayoutProblem[];
  /** 分析対象のノード数 */
  analyzedNodeCount: number;
  /** 分析完了時刻 */
  analyzedAt: Date;
}

/**
 * 提案生成結果
 */
export interface SuggestionResult {
  /** 生成された提案のリスト */
  suggestions: LayoutSuggestion[];
  /** AI分析が使用されたかどうか */
  usedAI: boolean;
  /** 生成完了時刻 */
  generatedAt: Date;
}

// =============================================================================
// AI連携
// =============================================================================

/**
 * AI分析リクエスト
 */
export interface AIAnalysisRequest {
  /** 分析対象のHTML */
  html: string;
  /** 検出された問題 */
  problems: LayoutProblem[];
  /** 追加のコンテキスト */
  context?: string;
}

/**
 * AI分析レスポンス
 */
export interface AIAnalysisResponse {
  /** AIが生成した提案 */
  suggestions: AIGeneratedSuggestion[];
  /** 処理時間（ミリ秒） */
  processingTimeMs: number;
}

/**
 * AIが生成した提案
 */
export interface AIGeneratedSuggestion {
  /** 対応する問題のインデックス */
  problemIndex: number;
  /** 提案内容 */
  suggestion: string;
  /** 推奨されるスタイル変更 */
  recommendedStyles?: Record<string, string>;
  /** 信頼度（0-1） */
  confidence: number;
}

// =============================================================================
// 提案適用
// =============================================================================

/**
 * 適用結果
 */
export interface ApplyResult {
  /** 適用が成功したかどうか */
  success: boolean;
  /** 適用された提案ID */
  appliedSuggestionId: SuggestionId;
  /** エラーメッセージ（失敗時） */
  errorMessage?: string;
}

// =============================================================================
// ユーザー設定
// =============================================================================

/**
 * 提案機能の設定
 */
export interface SuggestionSettings {
  /** 機能が有効かどうか */
  enabled: boolean;
  /** 提案を自動表示するかどうか */
  autoShow: boolean;
  /** 表示する最小信頼度（0-1） */
  minConfidence: number;
  /** 表示する最大提案数 */
  maxSuggestions: number;
}

/**
 * デフォルト設定
 */
export const DEFAULT_SUGGESTION_SETTINGS: SuggestionSettings = {
  enabled: true,
  autoShow: true,
  minConfidence: 0.5,
  maxSuggestions: 5,
};

// =============================================================================
// ファクトリ関数
// =============================================================================

/**
 * SuggestionIdを作成する
 */
export function createSuggestionId(value: string): SuggestionId {
  return value as SuggestionId;
}

/**
 * NodePathを作成する
 */
export function createNodePath(value: string): NodePath {
  return value as NodePath;
}

/**
 * ユニークなSuggestionIdを生成する
 *
 * 注意: この実装はtimestamp + randomの組み合わせを使用しています。
 * 同じミリ秒内に複数回呼び出された場合、理論上は重複する可能性があります。
 * より堅牢なID生成が必要な場合は、以下の代替手段を検討してください:
 * - crypto.randomUUID() (Web Crypto API)
 * - nanoid ライブラリ
 * - ulid ライブラリ
 *
 * 現在の用途（レイアウト提案の一時的な識別）では、
 * 重複リスクは実用上問題ないレベルです。
 */
export function generateSuggestionId(): SuggestionId {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return createSuggestionId(`suggestion-${timestamp}-${random}`);
}
