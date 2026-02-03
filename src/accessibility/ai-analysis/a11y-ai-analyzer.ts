/**
 * MCP AI分析モジュール
 */
import type { A11yIssue, A11yAIAnalysis } from "../types";
import { AI_ANALYSIS } from "../constants";

/**
 * MCPクライアントインターフェース
 */
export interface McpClientInterface {
  isConnected(): boolean;
  sendRequest<T>(method: string, params: Record<string, unknown>): Promise<T>;
}

/**
 * フォールバック用の空結果
 */
const FALLBACK_ANALYSIS: A11yAIAnalysis = {
  additionalIssues: [],
  enhancedSuggestions: [],
  confidence: 0,
};

/**
 * アクセシビリティ問題のAI分析を行うモジュール
 */
export class A11yAIAnalyzer {
  private mcpClient: McpClientInterface | null = null;

  setMcpClient(client: McpClientInterface): void {
    this.mcpClient = client;
  }

  async analyze(issues: readonly A11yIssue[]): Promise<A11yAIAnalysis> {
    if (!this.mcpClient || !this.mcpClient.isConnected()) {
      return FALLBACK_ANALYSIS;
    }

    try {
      let timeoutId: ReturnType<typeof setTimeout>;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("AI analysis timed out")),
          AI_ANALYSIS.TIMEOUT_MS,
        );
      });

      const requestPromise = this.mcpClient
        .sendRequest<A11yAIAnalysis>("accessibility/analyze", {
          issues: issues.map((issue) => ({
            type: issue.type,
            severity: issue.severity,
            wcagCriterion: issue.wcagCriterion,
            element: issue.element,
            message: issue.message,
          })),
        })
        .finally(() => clearTimeout(timeoutId));

      return await Promise.race([requestPromise, timeoutPromise]);
    } catch {
      return FALLBACK_ANALYSIS;
    }
  }
}
