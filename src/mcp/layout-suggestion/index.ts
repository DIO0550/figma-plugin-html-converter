/**
 * スマートレイアウト提案機能
 *
 * HTML構造を分析し、レイアウトの問題点を検出して改善提案を生成するモジュール
 *
 * ## 使用方法
 *
 * ```typescript
 * import {
 *   LayoutAnalyzer,
 *   SuggestionGenerator,
 *   SuggestionSettingsManager,
 * } from "./mcp/layout-suggestion";
 *
 * // 1. 設定の初期化
 * const settings = SuggestionSettingsManager.getDefaults();
 *
 * // 2. HTMLを分析
 * const analysisResult = LayoutAnalyzer.analyze({
 *   html: '<div><span>Child 1</span><span>Child 2</span></div>',
 *   nestingDepth: 0,
 * });
 *
 * // 3. 提案を生成
 * const suggestionResult = SuggestionGenerator.generate(analysisResult.problems);
 *
 * // 4. 提案を最適化（フィルタ、ソート、制限）
 * const optimizedResult = SuggestionGenerator.optimize(suggestionResult, {
 *   minConfidence: settings.minConfidence,
 *   maxSuggestions: settings.maxSuggestions,
 *   sortBySeverity: true,
 * });
 *
 * // 5. 提案を適用
 * for (const suggestion of optimizedResult.suggestions) {
 *   if (SuggestionApplier.canApply(suggestion)) {
 *     const result = SuggestionApplier.apply(suggestion, originalStyles);
 *     console.log(result.success ? "適用成功" : result.errorMessage);
 *   }
 * }
 * ```
 *
 * ## AI連携（オプション）
 *
 * ```typescript
 * import { AIAnalysis, MCPClient } from "./mcp";
 *
 * // AI分析リクエストを作成
 * const aiRequest = AIAnalysis.createRequest(html, problems);
 *
 * // MCPクライアント経由でAI分析を実行
 * const params = AIAnalysis.buildMCPRequestParams(aiRequest);
 * const response = await MCPClient.request(client, AIAnalysis.getMCPMethod(), params);
 *
 * // レスポンスをパース
 * const aiResponse = AIAnalysis.parseResponse(response);
 *
 * // AIの提案をマージ
 * const mergedSuggestions = AIAnalysis.mergeWithLocalSuggestions(problems, aiResponse);
 * ```
 */

// 型定義
export type {
  SuggestionId,
  NodePath,
  LayoutProblemType,
  ProblemSeverity,
  LayoutProblem,
  LayoutSuggestion,
  LayoutAnalysisContext,
  LayoutAnalysisResult,
  SuggestionResult,
  AIAnalysisRequest,
  AIAnalysisResponse,
  AIGeneratedSuggestion,
  ApplyResult,
  SuggestionSettings,
} from "./types";

// 定数とファクトリ関数
export {
  DEFAULT_SUGGESTION_SETTINGS,
  createSuggestionId,
  createNodePath,
  generateSuggestionId,
} from "./types";

// 分析モジュール
export { LayoutAnalyzer, ProblemDetector } from "./analyzer";
export type { AnalysisSummary } from "./analyzer";

// 提案生成モジュール
export { SuggestionGenerator } from "./suggestion";

// AI連携モジュール
export { AIAnalysis } from "./ai-request";

// 提案適用モジュール
export { SuggestionApplier } from "./applier";

// 設定管理モジュール
export { SuggestionSettingsManager } from "./settings";
