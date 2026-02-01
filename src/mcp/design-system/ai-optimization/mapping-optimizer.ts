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

// =============================================================================
// バリデーション信頼度の重み付け定数
// =============================================================================

/** バリデーション信頼度のベースライン */
const BASE_VALIDATION_CONFIDENCE = 0.5;
/** タグ名がスタイル名に含まれる場合の重み */
const TAG_NAME_MATCH_WEIGHT = 0.2;
/** タイポグラフィスタイルとテキスト要素の対応の重み */
const TYPOGRAPHY_MATCH_WEIGHT = 0.2;
/** 見出しレベル一致の重み */
const HEADING_LEVEL_MATCH_WEIGHT = 0.1;
/** バリデーション信頼度の最大値 */
const MAX_VALIDATION_CONFIDENCE = 1.0;
/** スタイル未発見時の信頼度 */
const STYLE_NOT_FOUND_CONFIDENCE = 0.2;
/** バリデーション有効/無効の閾値 */
const VALIDATION_THRESHOLD = 0.5;

/** テキスト系HTML要素のタグ名一覧 */
const TEXT_ELEMENT_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "a",
];

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
    } catch (error) {
      console.error(
        "[MappingOptimizer] MCP最適化リクエスト失敗:",
        error instanceof Error ? error.message : error,
      );
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
        confidence: STYLE_NOT_FOUND_CONFIDENCE,
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
      isValid: confidence > VALIDATION_THRESHOLD,
      confidence,
      reason:
        confidence > VALIDATION_THRESHOLD
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
    let confidence = BASE_VALIDATION_CONFIDENCE;

    // スタイル名にタグ名が含まれているか
    const styleNameLower = styleName.toLowerCase();
    const tagNameLower = element.tagName.toLowerCase();

    if (styleNameLower.includes(tagNameLower)) {
      confidence += TAG_NAME_MATCH_WEIGHT;
    }

    // タイポグラフィスタイルとテキスト要素の対応
    const isTextElement = TEXT_ELEMENT_TAGS.includes(tagNameLower);
    const isTypographyStyle =
      styleNameLower.includes("typography") ||
      styleNameLower.includes("heading") ||
      styleNameLower.includes("body") ||
      styleNameLower.includes("text");

    if (isTextElement && isTypographyStyle) {
      confidence += TYPOGRAPHY_MATCH_WEIGHT;
    }

    // 見出しレベルの一致
    const headingMatch = tagNameLower.match(/h(\d)/);
    if (headingMatch) {
      const level = headingMatch[1];
      if (styleNameLower.includes(`h${level}`)) {
        confidence += HEADING_LEVEL_MATCH_WEIGHT;
      }
    }

    return Math.min(confidence, MAX_VALIDATION_CONFIDENCE);
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
