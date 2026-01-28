/**
 * デザインシステム適用機能の型定義
 */
import type { Brand } from "../../types/brand";

// =============================================================================
// Brand型
// =============================================================================

/**
 * デザインシステムスタイルID
 */
export type DesignSystemStyleId = Brand<string, "DesignSystemStyleId">;

/**
 * デザインシステムコンポーネントID
 */
export type DesignSystemComponentId = Brand<string, "DesignSystemComponentId">;

/**
 * マッピングルールID
 */
export type MappingRuleId = Brand<string, "MappingRuleId">;

// =============================================================================
// スタイル種別
// =============================================================================

/**
 * Figmaスタイルの種類
 */
export type FigmaStyleType = "PAINT" | "TEXT" | "EFFECT" | "GRID";

/**
 * スタイルカテゴリ（マッピング用）
 */
export type StyleCategory =
  | "color" // 色（背景、テキスト色）
  | "typography" // タイポグラフィ
  | "spacing" // スペーシング
  | "effect" // エフェクト（シャドウ等）
  | "layout"; // レイアウト

// =============================================================================
// デザインシステムスタイル
// =============================================================================

/**
 * 基本スタイル情報
 */
export interface DesignSystemStyleBase {
  /** スタイルID */
  id: DesignSystemStyleId;
  /** スタイル名 */
  name: string;
  /** スタイルの種類 */
  type: FigmaStyleType;
  /** 説明 */
  description?: string;
  /** キー（Figma内部識別子） */
  key: string;
}

/**
 * ペイントスタイル（色、グラデーション）
 */
export interface PaintStyleInfo extends DesignSystemStyleBase {
  type: "PAINT";
  /** ペイント情報 */
  paints: readonly Paint[];
}

/**
 * テキストスタイル
 */
export interface TextStyleInfo extends DesignSystemStyleBase {
  type: "TEXT";
  /** フォントファミリー */
  fontFamily: string;
  /** フォントサイズ */
  fontSize: number;
  /** フォントウェイト */
  fontWeight: number;
  /** 行の高さ */
  lineHeight?: number | "AUTO";
  /** 文字間隔 */
  letterSpacing?: number;
}

/**
 * エフェクトスタイル
 */
export interface EffectStyleInfo extends DesignSystemStyleBase {
  type: "EFFECT";
  /** エフェクト情報 */
  effects: readonly Effect[];
}

/**
 * グリッドスタイル
 */
export interface GridStyleInfo extends DesignSystemStyleBase {
  type: "GRID";
  /** グリッド設定 */
  layoutGrids: readonly LayoutGrid[];
}

/**
 * デザインシステムスタイル（ユニオン型）
 */
export type DesignSystemStyle =
  | PaintStyleInfo
  | TextStyleInfo
  | EffectStyleInfo
  | GridStyleInfo;

// =============================================================================
// デザインシステムコンポーネント
// =============================================================================

/**
 * コンポーネントプロパティ
 */
export interface ComponentProperty {
  /** プロパティ名 */
  name: string;
  /** プロパティ型 */
  type: "BOOLEAN" | "TEXT" | "INSTANCE_SWAP" | "VARIANT";
  /** デフォルト値 */
  defaultValue?: string | boolean;
}

/**
 * デザインシステムコンポーネント
 */
export interface DesignSystemComponent {
  /** コンポーネントID */
  id: DesignSystemComponentId;
  /** コンポーネント名 */
  name: string;
  /** 説明 */
  description?: string;
  /** キー（Figma内部識別子） */
  key: string;
  /** プロパティ一覧 */
  properties: ComponentProperty[];
  /** バリアント名（バリアントの場合） */
  variantName?: string;
}

// =============================================================================
// デザインシステム全体
// =============================================================================

/**
 * デザインシステム情報
 */
export interface DesignSystem {
  /** スタイル一覧 */
  styles: DesignSystemStyle[];
  /** コンポーネント一覧 */
  components: DesignSystemComponent[];
  /** スキャン日時 */
  scannedAt: Date;
}

// =============================================================================
// マッピングルール
// =============================================================================

/**
 * マッチング条件
 */
export interface MatchCondition {
  /** HTML要素名（例: "h1", "p", "button"） */
  tagName?: string;
  /** CSSクラス名（例: "btn-primary"） */
  className?: string;
  /** 属性条件（例: { type: "submit" }） */
  attributes?: Record<string, string>;
  /** インラインスタイル条件（例: { "font-weight": "bold" }） */
  styleCondition?: Record<string, string>;
}

/**
 * マッピングアクション
 */
export interface MappingAction {
  /** 適用するスタイルID */
  applyStyleId?: DesignSystemStyleId;
  /** 適用するスタイル名（ID未解決時） */
  applyStyleName?: string;
  /** 適用するコンポーネントID */
  applyComponentId?: DesignSystemComponentId;
  /** 適用するコンポーネント名（ID未解決時） */
  applyComponentName?: string;
  /** スタイルカテゴリ */
  category: StyleCategory;
}

/**
 * マッピングルール
 */
export interface MappingRule {
  /** ルールID */
  id: MappingRuleId;
  /** ルール名 */
  name: string;
  /** 説明 */
  description?: string;
  /** マッチング条件 */
  condition: MatchCondition;
  /** マッピングアクション */
  action: MappingAction;
  /** 優先度（数値が大きいほど優先） */
  priority: number;
  /** ルールが有効かどうか */
  enabled: boolean;
  /** ユーザー定義ルールかどうか */
  isCustom: boolean;
}

// =============================================================================
// マッピング結果
// =============================================================================

/**
 * マッピングマッチ結果
 */
export interface MappingMatch {
  /** マッチしたルール */
  rule: MappingRule;
  /** マッチした要素のパス */
  elementPath: string;
  /** 適用されるスタイル */
  appliedStyle?: DesignSystemStyle;
  /** 適用されるコンポーネント */
  appliedComponent?: DesignSystemComponent;
  /** マッチ信頼度（0-1） */
  confidence: number;
}

/**
 * マッピング結果
 */
export interface MappingResult {
  /** マッチ一覧 */
  matches: MappingMatch[];
  /** マッチしなかった要素パス */
  unmatchedElements: string[];
  /** 処理日時 */
  processedAt: Date;
}

// =============================================================================
// AI最適化
// =============================================================================

/**
 * AI最適化リクエスト
 */
export interface AIOptimizationRequest {
  /** HTML文字列 */
  html: string;
  /** 利用可能なデザインシステム */
  designSystem: DesignSystem;
  /** 現在のマッピングルール */
  currentRules: MappingRule[];
  /** 追加コンテキスト */
  context?: string;
}

/**
 * AI最適化レスポンス
 */
export interface AIOptimizationResponse {
  /** 推奨マッピング */
  recommendedMappings: AIRecommendedMapping[];
  /** 処理時間（ミリ秒） */
  processingTimeMs: number;
}

/**
 * AI推奨マッピング
 */
export interface AIRecommendedMapping {
  /** 対象要素のパス */
  elementPath: string;
  /** 推奨スタイル名 */
  recommendedStyleName?: string;
  /** 推奨コンポーネント名 */
  recommendedComponentName?: string;
  /** 推奨理由 */
  reason: string;
  /** 信頼度（0-1） */
  confidence: number;
}

// =============================================================================
// 適用結果
// =============================================================================

/**
 * スタイル適用結果
 */
export interface ApplyDesignSystemResult {
  /** 適用が成功したかどうか */
  success: boolean;
  /** 適用されたマッピング数 */
  appliedCount: number;
  /** スキップされたマッピング数 */
  skippedCount: number;
  /** エラー一覧 */
  errors: ApplyError[];
  /** 適用日時 */
  appliedAt: Date;
}

/**
 * 適用エラー
 */
export interface ApplyError {
  /** エラーが発生した要素パス */
  elementPath: string;
  /** エラーメッセージ */
  message: string;
  /** エラーコード */
  code: string;
}

// =============================================================================
// ユーザー設定
// =============================================================================

/**
 * デザインシステム設定
 */
export interface DesignSystemSettings {
  /** 機能が有効かどうか */
  enabled: boolean;
  /** 自動適用するかどうか */
  autoApply: boolean;
  /** 表示する最小信頼度（0-1） */
  minConfidence: number;
  /** AI最適化を使用するかどうか */
  useAIOptimization: boolean;
  /** カスタムルール */
  customRules: MappingRule[];
}

/**
 * デフォルト設定
 */
export const DEFAULT_DESIGN_SYSTEM_SETTINGS: DesignSystemSettings = {
  enabled: true,
  autoApply: false,
  minConfidence: 0.5,
  useAIOptimization: true,
  customRules: [],
};

// =============================================================================
// ファクトリ関数
// =============================================================================

/**
 * DesignSystemStyleIdを作成する
 */
export function createDesignSystemStyleId(value: string): DesignSystemStyleId {
  return value as DesignSystemStyleId;
}

/**
 * DesignSystemComponentIdを作成する
 */
export function createDesignSystemComponentId(
  value: string,
): DesignSystemComponentId {
  return value as DesignSystemComponentId;
}

/**
 * MappingRuleIdを作成する
 */
export function createMappingRuleId(value: string): MappingRuleId {
  return value as MappingRuleId;
}

/**
 * ID生成用のカウンター
 */
let ruleIdCounter = 0;

/**
 * ユニークなMappingRuleIdを生成する
 */
export function generateMappingRuleId(): MappingRuleId {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return createMappingRuleId(`rule-${crypto.randomUUID()}`);
  }

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    const randomHex = Array.from(array)
      .map((n) => n.toString(16).padStart(8, "0"))
      .join("");
    return createMappingRuleId(`rule-${randomHex}`);
  }

  const timestamp = Date.now().toString(36);
  const counter = (ruleIdCounter++).toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return createMappingRuleId(`rule-${timestamp}-${counter}-${random}`);
}
