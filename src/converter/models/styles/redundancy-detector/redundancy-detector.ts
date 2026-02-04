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
      ...detectShorthandOpportunities(styles),
      ...detectShorthandLonghandConflictsFromStyles(styles),
    ];
  }

  /**
   * 重複プロパティを検出
   * Styles型はRecord<string, string>なのでパース済みの場合は重複がない。
   * この検出は主にparse前の生文字列レベルで使用することを想定しているが、
   * Styles型を入力とする場合は実質的にnoop。
   * ただし将来の拡張性を考慮して残す。
   */
  export function detectDuplicates(_styles: Styles): RedundancyIssue[] {
    // Styles型はRecord<string, string>のため、同一キーは後勝ちで上書き済み
    // 重複検出はparse前の文字列解析で行う必要がある
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
  ): RedundancyIssue[] {
    const issues: RedundancyIssue[] = [];
    const properties = toRecord(styles);

    for (const rule of SHORTHAND_RULES) {
      if (canMergeToShorthand(rule, properties)) {
        const shorthandValue = buildShorthandValue(rule, properties);
        const longhandList = rule.longhands.join(", ");

        issues.push({
          type: "shorthand-opportunity",
          severity: "medium",
          property: rule.shorthand,
          currentValue: longhandList,
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
