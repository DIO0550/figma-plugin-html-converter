/**
 * 提案生成器
 *
 * レイアウト問題から改善提案を生成する
 */
import type {
  LayoutProblem,
  LayoutSuggestion,
  SuggestionResult,
  ProblemSeverity,
} from "../types";
import { generateSuggestionId } from "../types";

/**
 * 問題タイプ別の提案テンプレート
 *
 * confidence値の設定根拠（リスクベースの評価）:
 *
 * 0.9 (高信頼度):
 *   - 適用リスク: 低 - 副作用がほぼない安全な変更
 *   - 判断根拠: 明確なベストプラクティスに基づく
 *   - 例: 複数子要素へのFlexbox適用
 *
 * 0.7 (中高信頼度):
 *   - 適用リスク: 低〜中 - 一部ケースで意図しない結果の可能性
 *   - 判断根拠: 一般的に有効だが、具体的な値はユーザー意図に依存
 *   - 例: 配置プロパティの追加（値の選択は状況依存）
 *
 * 0.6 (中信頼度):
 *   - 適用リスク: 中 - デザイン意図を確認する必要あり
 *   - 判断根拠: 改善の可能性は高いが、意図的な設計の可能性
 *   - 例: スペーシングの統一（意図的な差異かもしれない）
 *
 * 0.5 (低信頼度):
 *   - 適用リスク: 中〜高 - レイアウト全体に影響する可能性
 *   - 判断根拠: 提案として価値があるが、ユーザーの慎重な検討が必要
 *   - 例: flex-directionの変更、構造の簡素化
 *
 * これらの値は経験則に基づく初期設定です。
 * 将来的にはユーザーフィードバックや機械学習で動的に調整することを検討。
 */
const SUGGESTION_TEMPLATES: Record<
  LayoutProblem["type"],
  {
    suggestion: string;
    confidence: number;
    autoApplicable: boolean;
    recommendedStyles?: Record<string, string>;
  }
> = {
  "missing-flex-container": {
    suggestion:
      "この要素に `display: flex` を追加することで、子要素のレイアウトを簡単に制御できます。`Flexbox` を使用すると、配置、間隔、方向の調整が容易になります。",
    // 高信頼度: 複数子要素にFlexbox適用は明確に有効なパターン
    confidence: 0.9,
    autoApplicable: true,
    recommendedStyles: {
      display: "flex",
    },
  },
  "missing-alignment": {
    suggestion:
      "`justify-content` と `align-items` を追加して、要素の配置を明示的に指定することをお勧めします。一般的な値: `center`（中央揃え）、`flex-start`（開始位置）、`space-between`（均等配置）",
    // 中高信頼度: 配置指定は有効だが、推奨値はユーザーの意図次第
    confidence: 0.7,
    autoApplicable: true,
    recommendedStyles: {
      "justify-content": "flex-start",
      "align-items": "center",
    },
  },
  "inconsistent-spacing": {
    suggestion:
      "デザインの一貫性のために、`gap` と `padding` に同じベース値（例: `8px`, `16px`, `24px`）を使用することを検討してください。デザインシステムのスペーシングスケールに従うと、より統一感のあるUIになります。",
    // 中信頼度: 一貫性は重要だが、意図的な差異の可能性もある
    confidence: 0.6,
    autoApplicable: false,
  },
  "suboptimal-direction": {
    suggestion:
      "現在の横並び（`row`）から縦並び（`column`）に変更することを検討してください。コンテナの幅に対して子要素が多い場合、縦並びの方が見やすくなることがあります。",
    // 低信頼度: デザイン意図が不明確なため、慎重な判断が必要
    confidence: 0.5,
    autoApplicable: true,
    recommendedStyles: {
      "flex-direction": "column",
    },
  },
  "inefficient-nesting": {
    suggestion:
      "HTML構造を簡素化することを検討してください。不要なラッパー要素を削除し、`Flexbox` や `Grid` を活用することで、より効率的なマークアップが実現できます。",
    // 低信頼度: 構造変更は影響範囲が大きく、慎重な検討が必要
    confidence: 0.5,
    autoApplicable: false,
  },
};

/**
 * 重大度の優先順位
 */
const SEVERITY_PRIORITY: Record<ProblemSeverity, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * 提案生成器のコンパニオンオブジェクト
 */
export const SuggestionGenerator = {
  /**
   * 問題リストから提案を生成する
   *
   * @param problems - 問題のリスト
   * @returns 提案結果
   */
  generate(problems: LayoutProblem[]): SuggestionResult {
    const suggestions: LayoutSuggestion[] = [];

    for (const problem of problems) {
      const suggestion = SuggestionGenerator.generateForProblem(problem);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }

    return {
      suggestions,
      usedAI: false,
      generatedAt: new Date(),
    };
  },

  /**
   * 個別の問題から提案を生成する
   *
   * @param problem - 問題
   * @returns 提案（生成できない場合はnull）
   */
  generateForProblem(problem: LayoutProblem): LayoutSuggestion | null {
    const template = SUGGESTION_TEMPLATES[problem.type];
    if (!template) {
      return null;
    }

    return {
      id: generateSuggestionId(),
      problem,
      suggestion: template.suggestion,
      confidence: template.confidence,
      autoApplicable: template.autoApplicable,
      improvedStyles: template.recommendedStyles,
    };
  },

  /**
   * 信頼度でフィルタリングする
   *
   * @param result - 提案結果
   * @param minConfidence - 最小信頼度
   * @returns フィルタリングされた提案結果
   */
  filterByConfidence(
    result: SuggestionResult,
    minConfidence: number,
  ): SuggestionResult {
    return {
      ...result,
      suggestions: result.suggestions.filter(
        (s) => s.confidence >= minConfidence,
      ),
    };
  },

  /**
   * 重大度でソートする
   *
   * @param result - 提案結果
   * @returns ソートされた提案結果
   */
  sortBySeverity(result: SuggestionResult): SuggestionResult {
    const sortedSuggestions = [...result.suggestions].sort((a, b) => {
      const priorityA = SEVERITY_PRIORITY[a.problem.severity];
      const priorityB = SEVERITY_PRIORITY[b.problem.severity];
      return priorityB - priorityA;
    });

    return {
      ...result,
      suggestions: sortedSuggestions,
    };
  },

  /**
   * 提案を限定数に制限する
   *
   * @param result - 提案結果
   * @param limit - 最大数
   * @returns 制限された提案結果
   */
  limitSuggestions(result: SuggestionResult, limit: number): SuggestionResult {
    return {
      ...result,
      suggestions: result.suggestions.slice(0, limit),
    };
  },

  /**
   * 提案結果を最適化する（フィルタ、ソート、制限を適用）
   *
   * @param result - 提案結果
   * @param options - オプション
   * @returns 最適化された提案結果
   */
  optimize(
    result: SuggestionResult,
    options: {
      minConfidence?: number;
      maxSuggestions?: number;
      sortBySeverity?: boolean;
    } = {},
  ): SuggestionResult {
    let optimized = result;

    if (options.minConfidence !== undefined) {
      optimized = SuggestionGenerator.filterByConfidence(
        optimized,
        options.minConfidence,
      );
    }

    if (options.sortBySeverity) {
      optimized = SuggestionGenerator.sortBySeverity(optimized);
    }

    if (options.maxSuggestions !== undefined) {
      optimized = SuggestionGenerator.limitSuggestions(
        optimized,
        options.maxSuggestions,
      );
    }

    return optimized;
  },
};
