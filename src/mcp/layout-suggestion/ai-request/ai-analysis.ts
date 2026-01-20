/**
 * AI分析モジュール
 *
 * MCP経由でAIにレイアウト分析を依頼する
 */
import type {
  LayoutProblem,
  AIAnalysisRequest,
  AIAnalysisResponse,
  AIGeneratedSuggestion,
  LayoutSuggestion,
} from "../types";
import { generateSuggestionId } from "../types";

/**
 * デフォルトのリクエストタイムアウト（ミリ秒）
 *
 * 30秒を選択した理由:
 * - AI分析の平均応答時間: 通常5-15秒程度だが、複雑なHTML構造では20秒超の場合がある
 * - ネットワーク遅延の考慮: 不安定な接続環境でもリトライ前に十分な待機時間を確保
 * - 業界標準: HTTPクライアントのデフォルトタイムアウトは30秒が一般的
 * - ユーザー体験: 30秒を超えると待機が長すぎると感じられる閾値
 *
 * 環境変数 AI_ANALYSIS_TIMEOUT_MS で上書き可能
 */
const DEFAULT_REQUEST_TIMEOUT_MS = 30000;

/**
 * 環境変数からタイムアウト値を取得する
 *
 * @returns タイムアウト値（ミリ秒）
 */
function getTimeoutFromEnv(): number {
  // 環境変数が利用できない環境（ブラウザ等）への対応
  if (typeof process === "undefined" || !process.env) {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }

  const envValue = process.env.AI_ANALYSIS_TIMEOUT_MS;
  if (!envValue) {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }

  const parsed = parseInt(envValue, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }

  return parsed;
}

/**
 * AI分析の設定定数
 *
 * これらの値はネットワーク環境やAIサービスの応答時間によって
 * 調整が必要になる可能性があります。
 * タイムアウト値は環境変数 AI_ANALYSIS_TIMEOUT_MS で設定可能です。
 */
const AI_ANALYSIS_CONFIG = {
  /**
   * MCPメソッド名
   * MCPサービスのAPI定義と一致している必要があります
   */
  MCP_METHOD: "layout/analyze",

  /**
   * リクエストタイムアウト（ミリ秒）
   * 環境変数 AI_ANALYSIS_TIMEOUT_MS から取得し、未設定時は30秒をデフォルトとする
   */
  get REQUEST_TIMEOUT_MS(): number {
    return getTimeoutFromEnv();
  },
} as const;

/**
 * recommendedStylesの型をバリデートする
 *
 * @param value - 検証対象の値
 * @returns Record<string, string> | undefined（不正な場合はundefined）
 */
function validateRecommendedStyles(
  value: unknown,
): Record<string, string> | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const validated: Record<string, string> = {};

  for (const [key, val] of Object.entries(record)) {
    if (typeof key === "string" && typeof val === "string") {
      validated[key] = val;
    }
  }

  // 有効なプロパティがない場合はundefinedを返す
  return Object.keys(validated).length > 0 ? validated : undefined;
}

/**
 * AIAnalysisのコンパニオンオブジェクト
 */
export const AIAnalysis = {
  /**
   * AI分析リクエストを作成する
   *
   * @param html - 分析対象のHTML
   * @param problems - 検出された問題
   * @param context - 追加のコンテキスト
   * @returns AIリクエスト
   */
  createRequest(
    html: string,
    problems: LayoutProblem[],
    context?: string,
  ): AIAnalysisRequest {
    return {
      html,
      problems,
      context,
    };
  },

  /**
   * AIレスポンスをパースする
   *
   * 部分的に不正なデータがある場合でも、有効な提案のみを返します。
   * 完全に不正なレスポンス（オブジェクトでない、suggestionsが配列でない）の場合のみ例外をスローします。
   *
   * @param rawResponse - 生のレスポンス
   * @returns パースされたレスポンス
   * @throws レスポンスの構造が根本的に不正な場合
   */
  parseResponse(rawResponse: unknown): AIAnalysisResponse {
    if (!rawResponse || typeof rawResponse !== "object") {
      throw new Error("Invalid AI response: response is not an object");
    }

    const response = rawResponse as Record<string, unknown>;

    if (!Array.isArray(response.suggestions)) {
      throw new Error("Invalid AI response: suggestions is not an array");
    }

    if (typeof response.processingTimeMs !== "number") {
      throw new Error("Invalid AI response: processingTimeMs is not a number");
    }

    // 部分的に不正なデータがあっても、有効な提案のみを返す
    const suggestions: AIGeneratedSuggestion[] = (
      response.suggestions as unknown[]
    )
      .map((s: unknown): AIGeneratedSuggestion | null => {
        // 要素がオブジェクトでない場合はスキップ
        if (!s || typeof s !== "object") {
          return null;
        }
        const suggestion = s as Record<string, unknown>;

        // confidence値のバリデーション: 0-1の範囲内に収める
        let confidence = 0.5; // デフォルト値
        if (typeof suggestion.confidence === "number") {
          if (
            suggestion.confidence >= 0 &&
            suggestion.confidence <= 1 &&
            !Number.isNaN(suggestion.confidence)
          ) {
            confidence = suggestion.confidence;
          }
          // 範囲外の場合はデフォルト値を使用
        }

        return {
          problemIndex:
            typeof suggestion.problemIndex === "number" &&
            !Number.isNaN(suggestion.problemIndex)
              ? suggestion.problemIndex
              : 0,
          suggestion:
            typeof suggestion.suggestion === "string"
              ? suggestion.suggestion
              : "",
          recommendedStyles: validateRecommendedStyles(
            suggestion.recommendedStyles,
          ),
          confidence,
        };
      })
      .filter((s): s is AIGeneratedSuggestion => s !== null);

    return {
      suggestions,
      processingTimeMs: response.processingTimeMs,
    };
  },

  /**
   * AIの提案をローカル提案とマージする
   *
   * @param problems - 元の問題リスト
   * @param aiResponse - AIレスポンス
   * @returns マージされた提案リスト
   */
  mergeWithLocalSuggestions(
    problems: LayoutProblem[],
    aiResponse: AIAnalysisResponse,
  ): LayoutSuggestion[] {
    const suggestions: LayoutSuggestion[] = [];

    for (const aiSuggestion of aiResponse.suggestions) {
      const problem = problems[aiSuggestion.problemIndex];
      if (!problem) {
        // problemIndexが範囲外の場合はスキップ
        continue;
      }

      suggestions.push({
        id: generateSuggestionId(),
        problem,
        suggestion: aiSuggestion.suggestion,
        confidence: aiSuggestion.confidence,
        autoApplicable: aiSuggestion.recommendedStyles !== undefined,
        improvedStyles: aiSuggestion.recommendedStyles,
      });
    }

    return suggestions;
  },

  /**
   * MCP用のリクエストパラメータを構築する
   *
   * @param request - AIリクエスト
   * @returns MCPリクエストパラメータ
   */
  buildMCPRequestParams(request: AIAnalysisRequest): Record<string, unknown> {
    return {
      html: request.html,
      problems: JSON.stringify(request.problems),
      context: request.context,
    };
  },

  /**
   * AI分析が有効かどうかを判定する
   *
   * 以下の順序で設定を確認します:
   * 1. ブラウザ環境: localStorage の ENABLE_AI_ANALYSIS
   * 2. Node.js環境: 環境変数 ENABLE_AI_ANALYSIS
   * 3. いずれも設定がない場合: 安全側のデフォルト（無効）
   *
   * 設定値:
   * - "true" の場合のみ有効
   * - 未設定または他の値の場合は無効
   *
   * 将来的な拡張:
   * - SuggestionSettings.enabled との連携
   * - MCPサーバーの接続状態のチェック
   *
   * @returns AI分析が有効な場合はtrue
   */
  isEnabled(): boolean {
    // 1. ブラウザ環境（localStorage利用可能）の場合
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
      try {
        const storage = globalThis.localStorage;
        const storedValue = storage?.getItem("ENABLE_AI_ANALYSIS");
        if (storedValue != null) {
          return storedValue === "true";
        }
      } catch {
        // localStorageアクセスがブロックされるケース:
        // - プライベートブラウジングモード（Safari等）
        // - ブラウザのセキュリティ設定でストレージが無効化されている場合
        // - iframe内でサードパーティCookieがブロックされている場合
        // - Content Security Policy (CSP) による制限
        // これらの場合は次の設定ソース（環境変数）にフォールスルーする
      }
    }

    // 2. Node.js環境（process.env利用可能）の場合
    if (typeof process !== "undefined" && process.env) {
      return process.env.ENABLE_AI_ANALYSIS === "true";
    }

    // 3. いずれの設定ソースも利用できない場合は安全側のデフォルト（無効）
    return false;
  },

  /**
   * デフォルトのフォールバックレスポンスを取得する
   *
   * @returns フォールバックレスポンス
   */
  getDefaultFallback(): AIAnalysisResponse {
    return {
      suggestions: [],
      processingTimeMs: 0,
    };
  },

  /**
   * MCPメソッド名を取得する
   *
   * @returns MCPメソッド名
   */
  getMCPMethod(): string {
    return AI_ANALYSIS_CONFIG.MCP_METHOD;
  },

  /**
   * リクエストタイムアウト（ミリ秒）を取得する
   *
   * @returns タイムアウト値
   */
  getTimeout(): number {
    return AI_ANALYSIS_CONFIG.REQUEST_TIMEOUT_MS;
  },
};
