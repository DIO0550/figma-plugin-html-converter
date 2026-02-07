import type { Styles } from "../styles";
import type { RedundancyIssue } from "./types";
import { isDefaultValue } from "./default-values";
import {
  SHORTHAND_RULES,
  canMergeToShorthand,
  buildShorthandValue,
  detectShorthandLonghandConflicts,
} from "./shorthand-rules";

/**
 * スタイルの冗長性を検出するモジュール
 * コンパニオンオブジェクトパターンで実装
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RedundancyDetector {
  /**
   * 全パターンで冗長性を検出
   */
  export function detect(styles: Styles, tagName?: string): RedundancyIssue[] {
    return [
      ...detectDuplicates(styles),
      ...detectDefaults(styles, tagName),
      ...detectShorthandOpportunities(styles, tagName),
      ...detectShorthandLonghandConflictsFromStyles(styles),
    ];
  }

  /**
   * 完全一致の重複プロパティを検出
   *
   * NOTE: Styles型はRecord<string, string>のため、Styles.parse()経由の入力では
   * 同一キーが後勝ちで上書きされ、完全一致の重複は存在しない（常に空配列を返す）。
   * ショートハンド/ロングハンド間の意味的重複は detectShorthandLonghandConflictsFromStyles()で検出する。
   * 本メソッドはインターフェースの一貫性と将来のparse前文字列解析対応のために維持している。
   */
  export function detectDuplicates(_styles: Styles): RedundancyIssue[] {
    return [];
  }

  /**
   * CSSデフォルト値を検出
   */
  export function detectDefaults(
    styles: Styles,
    tagName?: string,
  ): RedundancyIssue[] {
    const issues: RedundancyIssue[] = [];

    for (const [property, value] of Object.entries(styles)) {
      if (property === "__brand") continue;
      if (isDefaultValue(property, value, tagName)) {
        issues.push({
          type: "default-value",
          severity: "low",
          property,
          currentValue: value,
          description: `"${property}: ${value}" はCSS初期値のため不要です`,
        });
      }
    }

    return issues;
  }

  /**
   * ショートハンド統合の機会を検出
   */
  export function detectShorthandOpportunities(
    styles: Styles,
    tagName?: string,
  ): RedundancyIssue[] {
    const issues: RedundancyIssue[] = [];
    const properties = toRecord(styles);

    for (const rule of SHORTHAND_RULES) {
      if (canMergeToShorthand(rule, properties)) {
        const allLonghandsAreDefault = rule.longhands.every((longhand) =>
          isDefaultValue(longhand, properties[longhand], tagName),
        );
        if (allLonghandsAreDefault) continue;

        const shorthandValue = buildShorthandValue(rule, properties);
        const longhandList = rule.longhands.join(", ");

        issues.push({
          type: "shorthand-opportunity",
          severity: "medium",
          property: rule.shorthand,
          currentLonghandProperties: rule.longhands,
          suggestedValue: `${rule.shorthand}: ${shorthandValue}`,
          description: `${longhandList} を "${rule.shorthand}: ${shorthandValue}" に統合できます`,
        });
      }
    }

    return issues;
  }

  /**
   * ショートハンドとlonghandの混在を検出
   */
  export function detectShorthandLonghandConflictsFromStyles(
    styles: Styles,
  ): RedundancyIssue[] {
    const properties = toRecord(styles);
    const conflicts = detectShorthandLonghandConflicts(properties);

    return conflicts.map((conflict) => ({
      type: "duplicate-property" as const,
      severity: "high" as const,
      property: conflict.longhand,
      currentValue: conflict.longhandValue,
      description: `"${conflict.longhand}" は "${conflict.shorthand}" と重複しています。ショートハンドが優先されるため不要です`,
    }));
  }

  /**
   * Stylesオブジェクトからブランドを除いたRecord<string, string>を取得
   */
  function toRecord(styles: Styles): Record<string, string> {
    const record: Record<string, string> = {};
    for (const [key, value] of Object.entries(styles)) {
      if (key === "__brand") continue;
      record[key] = value;
    }
    return record;
  }
}
