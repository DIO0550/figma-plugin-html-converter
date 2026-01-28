/**
 * マッピング最適化機能
 *
 * MCP経由でAI分析を行い、HTML要素とデザインシステムの
 * 最適なマッピングを提案する。
 */
import type {
  DesignSystem,
  MappingRule,
  AIOptimizationRequest,
  AIOptimizationResponse,
  AIRecommendedMapping,
} from "../types";
import type { ElementInfo } from "../mapper";

/**
 * マッピング検証結果
 */
export interface MappingValidation {
  isValid: boolean;
  confidence: number;
  reason?: string;
}

/**
 * MCPクライアントインターフェース（依存性注入用）
 */
interface McpClientInterface {
  isConnected(): boolean;
  sendRequest<T>(method: string, params: unknown): Promise<T>;
}

/**
 * フォールバック用のレスポンス
 */
const FALLBACK_RESPONSE: AIOptimizationResponse = {
  recommendedMappings: [],
  processingTimeMs: 0,
};

/**
 * マッピング最適化クラス
 */
export class MappingOptimizer {
  private mcpClient: McpClientInterface | null = null;

  private constructor() {}

  /**
   * オプティマイザーインスタンスを作成する
   */
  static create(): MappingOptimizer {
    return new MappingOptimizer();
  }

  /**
   * MCPクライアントを設定する
   */
  setMcpClient(client: McpClientInterface): void {
    this.mcpClient = client;
  }

  /**
   * マッピングを最適化する
   */
  async optimize(
    request: AIOptimizationRequest,
  ): Promise<AIOptimizationResponse> {
    // MCPクライアントがない、または未接続の場合はフォールバック
    if (!this.mcpClient || !this.mcpClient.isConnected()) {
      return FALLBACK_RESPONSE;
    }

    try {
      const response = await this.mcpClient.sendRequest<AIOptimizationResponse>(
        "design-system/optimize-mapping",
        {
          html: request.html,
          designSystem: this.serializeDesignSystem(request.designSystem),
          currentRules: request.currentRules.map((r) => this.serializeRule(r)),
          context: request.context,
        },
      );
      return response;
    } catch {
      return FALLBACK_RESPONSE;
    }
  }

  /**
   * HTMLからルール候補を提案する
   */
  async suggestRulesFromHtml(
    html: string,
    designSystem: DesignSystem,
  ): Promise<AIRecommendedMapping[]> {
    const response = await this.optimize({
      html,
      designSystem,
      currentRules: [],
      context: "Suggest new mapping rules based on HTML structure",
    });

    return response.recommendedMappings;
  }

  /**
   * マッチしなかった要素を分析する
   */
  async analyzeUnmatchedElements(
    unmatchedPaths: string[],
    html: string,
    designSystem: DesignSystem,
  ): Promise<AIOptimizationResponse> {
    return this.optimize({
      html,
      designSystem,
      currentRules: [],
      context: `Analyze unmatched elements: ${unmatchedPaths.join(", ")}`,
    });
  }

  /**
   * マッピングの妥当性を検証する
   */
  async validateMapping(
    element: ElementInfo,
    styleName: string,
    designSystem: DesignSystem,
  ): Promise<MappingValidation> {
    // スタイルが存在するか確認
    const styleExists = designSystem.styles.some(
      (style) => style.name === styleName,
    );

    if (!styleExists) {
      return {
        isValid: false,
        confidence: 0.2,
        reason: `Style "${styleName}" not found in design system`,
      };
    }

    // 基本的な妥当性チェック
    const confidence = this.calculateValidationConfidence(
      element,
      styleName,
      designSystem,
    );

    return {
      isValid: confidence > 0.5,
      confidence,
      reason:
        confidence > 0.5
          ? "Mapping appears valid based on element type and style category"
          : "Mapping may not be optimal for this element type",
    };
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private calculateValidationConfidence(
    element: ElementInfo,
    styleName: string,
    _designSystem: DesignSystem,
  ): number {
    let confidence = 0.5;

    // スタイル名にタグ名が含まれているか
    const styleNameLower = styleName.toLowerCase();
    const tagNameLower = element.tagName.toLowerCase();

    if (styleNameLower.includes(tagNameLower)) {
      confidence += 0.2;
    }

    // タイポグラフィスタイルとテキスト要素の対応
    const textElements = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a"];
    const isTextElement = textElements.includes(tagNameLower);
    const isTypographyStyle =
      styleNameLower.includes("typography") ||
      styleNameLower.includes("heading") ||
      styleNameLower.includes("body") ||
      styleNameLower.includes("text");

    if (isTextElement && isTypographyStyle) {
      confidence += 0.2;
    }

    // 見出しレベルの一致
    const headingMatch = tagNameLower.match(/h(\d)/);
    if (headingMatch) {
      const level = headingMatch[1];
      if (styleNameLower.includes(`h${level}`)) {
        confidence += 0.1;
      }
    }

    return Math.min(confidence, 1.0);
  }

  private serializeDesignSystem(
    designSystem: DesignSystem,
  ): Record<string, unknown> {
    return {
      styles: designSystem.styles.map((style) => ({
        id: style.id,
        name: style.name,
        type: style.type,
      })),
      components: designSystem.components.map((component) => ({
        id: component.id,
        name: component.name,
      })),
    };
  }

  private serializeRule(rule: MappingRule): Record<string, unknown> {
    return {
      id: rule.id,
      name: rule.name,
      condition: rule.condition,
      action: {
        applyStyleName: rule.action.applyStyleName,
        applyComponentName: rule.action.applyComponentName,
        category: rule.action.category,
      },
      priority: rule.priority,
      enabled: rule.enabled,
    };
  }
}
