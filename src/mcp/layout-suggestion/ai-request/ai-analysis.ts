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
   * @param rawResponse - 生のレスポンス
   * @returns パースされたレスポンス
   * @throws レスポンスが不正な場合
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

    const suggestions: AIGeneratedSuggestion[] = response.suggestions.map(
      (s: unknown) => {
        if (!s || typeof s !== "object") {
          throw new Error("Invalid AI response: suggestion is not an object");
        }
        const suggestion = s as Record<string, unknown>;
        return {
          problemIndex:
            typeof suggestion.problemIndex === "number"
              ? suggestion.problemIndex
              : 0,
          suggestion:
            typeof suggestion.suggestion === "string"
              ? suggestion.suggestion
              : "",
          recommendedStyles: suggestion.recommendedStyles as
            | Record<string, string>
            | undefined,
          confidence:
            typeof suggestion.confidence === "number"
              ? suggestion.confidence
              : 0.5,
        };
      },
    );

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
    // 環境変数やフラグで制御する想定
    // 現時点ではデフォルトでtrueを返す
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
    return "layout/analyze";
  },

  /**
   * リクエストタイムアウト（ミリ秒）を取得する
   *
   * @returns タイムアウト値
   */
  getTimeout(): number {
    return 30000; // 30秒
  },
};
