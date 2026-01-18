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
 * AI分析の設定定数
 *
 * これらの値はネットワーク環境やAIサービスの応答時間によって
 * 調整が必要になる可能性があります。
 * 将来的には環境変数や設定ファイルから取得することを検討してください。
 */
const AI_ANALYSIS_CONFIG = {
  /**
   * MCPメソッド名
   * MCPサービスのAPI定義と一致している必要があります
   */
  MCP_METHOD: "layout/analyze",

  /**
   * リクエストタイムアウト（ミリ秒）
   * AI分析の処理時間を考慮し、30秒に設定
   */
  REQUEST_TIMEOUT_MS: 30000,
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
   * @returns AI分析が有効な場合はtrue
   */
  isEnabled(): boolean {
    // TODO: 環境変数やフラグで制御する実装を追加
    // 以下のような実装を想定:
    // - 環境変数 ENABLE_AI_ANALYSIS をチェック
    // - SuggestionSettings.enabled との連携
    // - MCPサーバーの接続状態をチェック
    // 現時点ではデフォルトでtrueを返す（常にAI分析を有効化）
    return true;
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
