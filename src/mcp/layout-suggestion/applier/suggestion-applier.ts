/**
 * 提案適用器
 *
 * 提案をスタイルに適用する
 */
import type { LayoutSuggestion, ApplyResult, SuggestionId } from "../types";
import { Styles } from "../../../converter/models/styles";

/**
 * 提案適用器のコンパニオンオブジェクト
 */
export const SuggestionApplier = {
  /**
   * 提案を適用できるかどうかを判定する
   *
   * @param suggestion - 提案
   * @returns 適用可能な場合はtrue
   */
  canApply(suggestion: LayoutSuggestion): boolean {
    return (
      suggestion.autoApplicable === true &&
      suggestion.improvedStyles !== undefined &&
      Object.keys(suggestion.improvedStyles).length > 0
    );
  },

  /**
   * 提案を適用する
   *
   * @param suggestion - 適用する提案
   * @param originalStyles - 元のスタイル
   * @returns 適用結果（成功時は新しいスタイルを含む）
   */
  apply(suggestion: LayoutSuggestion, originalStyles: Styles): ApplyResult {
    if (!SuggestionApplier.canApply(suggestion)) {
      return {
        success: false,
        appliedSuggestionId: suggestion.id,
        errorMessage: "この提案は自動適用できません",
      };
    }

    try {
      // 新しいスタイルを生成
      const newStyles = SuggestionApplier.generateNewStyles(
        originalStyles,
        suggestion.improvedStyles!,
      );

      return {
        success: true,
        appliedSuggestionId: suggestion.id,
        appliedStyles: newStyles,
      };
    } catch (error) {
      return {
        success: false,
        appliedSuggestionId: suggestion.id,
        errorMessage:
          error instanceof Error
            ? error.message
            : "スタイルの適用に失敗しました",
      };
    }
  },

  /**
   * 新しいスタイルを生成する
   *
   * @param originalStyles - 元のスタイル
   * @param improvedStyles - 改善スタイル
   * @returns 新しいスタイル
   */
  generateNewStyles(
    originalStyles: Styles,
    improvedStyles: Record<string, string>,
  ): Styles {
    let newStyles = originalStyles;

    for (const [property, value] of Object.entries(improvedStyles)) {
      newStyles = Styles.set(newStyles, property, value);
    }

    return newStyles;
  },

  /**
   * スタイル文字列を生成する
   *
   * @param styles - スタイル
   * @returns スタイル文字列
   */
  generateStyleString(styles: Styles): string {
    return Styles.toString(styles);
  },

  /**
   * 複数の提案を適用する
   *
   * @param suggestions - 提案リスト
   * @param originalStyles - 元のスタイル
   * @returns 適用結果リスト
   */
  applyMultiple(
    suggestions: LayoutSuggestion[],
    originalStyles: Styles,
  ): ApplyResult[] {
    const results: ApplyResult[] = [];
    let currentStyles = originalStyles;

    for (const suggestion of suggestions) {
      const result = SuggestionApplier.apply(suggestion, currentStyles);
      results.push(result);

      // 成功した場合、スタイルを更新して次の提案に引き継ぐ
      if (result.success && suggestion.improvedStyles) {
        currentStyles = SuggestionApplier.generateNewStyles(
          currentStyles,
          suggestion.improvedStyles,
        );
      }
    }

    return results;
  },

  /**
   * 適用可能な提案をフィルタリングする
   *
   * @param suggestions - 提案リスト
   * @returns 適用可能な提案リスト
   */
  filterApplicable(suggestions: LayoutSuggestion[]): LayoutSuggestion[] {
    return suggestions.filter((s) => SuggestionApplier.canApply(s));
  },

  /**
   * 適用結果のサマリーを生成する
   *
   * @param results - 適用結果リスト
   * @returns サマリー
   */
  summarizeResults(results: ApplyResult[]): {
    total: number;
    successful: number;
    failed: number;
    successIds: SuggestionId[];
    failedIds: SuggestionId[];
  } {
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return {
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      successIds: successful.map((r) => r.appliedSuggestionId),
      failedIds: failed.map((r) => r.appliedSuggestionId),
    };
  },
};
