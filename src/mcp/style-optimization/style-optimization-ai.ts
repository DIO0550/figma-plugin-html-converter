import type {
  AIStyleOptimizationRequest,
  AIStyleOptimizationResponse,
  AIStyleOptimizationProposal,
} from "./types";

/**
 * MCPクライアントインターフェース
 */
interface McpClientInterface {
  isConnected(): boolean;
  sendRequest<T>(method: string, params: unknown): Promise<T>;
}

/** フォールバック用のレスポンス */
const FALLBACK_RESPONSE: AIStyleOptimizationResponse = {
  proposals: [],
  processingTimeMs: 0,
};

/**
 * MCP経由でAIにスタイル最適化の高度な提案をリクエストするモジュール
 * コンパニオンオブジェクトパターンで実装
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StyleOptimizationAI {
  /**
   * AIスタイル最適化提案をリクエスト
   * MCP接続が利用できない場合は空の提案を返す
   */
  export async function requestOptimization(
    client: McpClientInterface,
    request: AIStyleOptimizationRequest,
  ): Promise<AIStyleOptimizationResponse> {
    if (!client.isConnected()) {
      return FALLBACK_RESPONSE;
    }

    try {
      const startTime = Date.now();
      const response = await client.sendRequest<{
        proposals: AIStyleOptimizationProposal[];
      }>("tools/call", {
        name: "style-optimization",
        arguments: {
          styles: request.styles,
          html: request.html,
          context: request.context,
        },
      });

      const processingTimeMs = Date.now() - startTime;

      return {
        proposals: validateProposals(response.proposals ?? []),
        processingTimeMs,
      };
    } catch (error) {
      console.error(
        "[StyleOptimizationAI] MCP style-optimization request failed:",
        error,
      );
      return FALLBACK_RESPONSE;
    }
  }

  /**
   * AI提案のバリデーション
   */
  function validateProposals(
    proposals: AIStyleOptimizationProposal[],
  ): AIStyleOptimizationProposal[] {
    return proposals.filter(
      (p) =>
        typeof p.property === "string" &&
        p.property.length > 0 &&
        typeof p.suggestion === "string" &&
        typeof p.confidence === "number" &&
        p.confidence >= 0 &&
        p.confidence <= 1,
    );
  }
}
