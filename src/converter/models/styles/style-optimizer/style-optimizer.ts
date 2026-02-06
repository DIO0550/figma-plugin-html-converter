import { Styles } from "../styles";
import type { RedundancyIssue } from "../redundancy-detector/types";
import type {
  OptimizationProposal,
  OptimizationResult,
  StyleComparison,
  OptimizationSummary,
} from "./types";

function generateDeterministicId(issue: RedundancyIssue): string {
  return `proposal-${issue.type}-${issue.property}`;
}

/**
 * スタイル最適化の提案生成と適用を行うモジュール
 * コンパニオンオブジェクトパターンで実装
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StyleOptimizer {
  /**
   * 最適化を実行（検出→提案→適用の一連の処理）
   */
  export function optimize(
    styles: Styles,
    issues: RedundancyIssue[],
  ): OptimizationResult {
    const proposals = generateProposals(issues);
    const optimizedStyles = applyAll(styles, proposals);
    const appliedCount = proposals.length;
    const skippedCount = 0;

    return {
      originalStyles: styles,
      optimizedStyles,
      proposals,
      appliedCount,
      skippedCount,
      summary: buildSummary(
        issues,
        appliedCount,
        skippedCount,
        styles,
        optimizedStyles,
      ),
    };
  }

  /**
   * 冗長性問題から最適化提案を生成
   */
  export function generateProposals(
    issues: RedundancyIssue[],
  ): OptimizationProposal[] {
    return issues.map((issue) => {
      const action = determineAction(issue);
      const afterValue = issue.suggestedValue ?? "";
      const beforeValue =
        issue.type === "shorthand-opportunity"
          ? issue.currentLonghandProperties.join(", ")
          : issue.currentValue;

      return {
        id: generateDeterministicId(issue),
        issue,
        action,
        beforeValue,
        afterValue,
        confidence: calculateConfidence(issue),
        source: "local" as const,
      };
    });
  }

  /**
   * ローカル提案とAI提案を統合
   * 同一プロパティの場合はconfidenceが高い方を優先、同値ならローカル優先
   */
  export function mergeProposals(
    local: OptimizationProposal[],
    ai: OptimizationProposal[],
  ): OptimizationProposal[] {
    const merged = new Map<string, OptimizationProposal>();

    for (const proposal of local) {
      merged.set(proposal.issue.property, proposal);
    }

    for (const proposal of ai) {
      const existing = merged.get(proposal.issue.property);
      if (!existing || proposal.confidence > existing.confidence) {
        merged.set(proposal.issue.property, proposal);
      }
    }

    return Array.from(merged.values());
  }

  /**
   * 個別提案を適用してStylesを返す
   */
  export function applyProposal(
    styles: Styles,
    proposal: OptimizationProposal,
  ): Styles {
    const record: Record<string, string> = {};

    for (const [key, value] of Object.entries(styles)) {
      if (key === "__brand") continue;
      record[key] = value;
    }

    switch (proposal.action) {
      case "remove":
        delete record[proposal.issue.property];
        break;

      case "replace":
        if (proposal.afterValue) {
          if (proposal.issue.type === "shorthand-opportunity") {
            applyShorthandMerge(record, proposal);
          } else {
            record[proposal.issue.property] = proposal.afterValue;
          }
        }
        break;

      case "merge":
        if (proposal.afterValue) {
          applyShorthandMerge(record, proposal);
        }
        break;
    }

    return Styles.parse(
      Object.entries(record)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; "),
    );
  }

  /**
   * 全提案を適用
   */
  export function applyAll(
    styles: Styles,
    proposals: OptimizationProposal[],
  ): Styles {
    let result = styles;
    for (const proposal of proposals) {
      result = applyProposal(result, proposal);
    }
    return result;
  }

  /**
   * 承認済み提案のみ適用（手動モード用）
   */
  export function applyApproved(
    styles: Styles,
    proposals: OptimizationProposal[],
    approvedIds: string[],
  ): Styles {
    const approvedSet = new Set(approvedIds);
    const approvedProposals = proposals.filter((p) => approvedSet.has(p.id));
    return applyAll(styles, approvedProposals);
  }

  /**
   * ビフォー・アフター比較
   */
  export function compare(before: Styles, after: Styles): StyleComparison {
    const beforeEntries = toRecord(before);
    const afterEntries = toRecord(after);

    const added: Record<string, string> = {};
    const removed: Record<string, string> = {};
    const changed: Array<{ property: string; before: string; after: string }> =
      [];
    const unchanged: Record<string, string> = {};

    for (const [prop, val] of Object.entries(beforeEntries)) {
      if (!(prop in afterEntries)) {
        removed[prop] = val;
      } else if (afterEntries[prop] !== val) {
        changed.push({
          property: prop,
          before: val,
          after: afterEntries[prop],
        });
      } else {
        unchanged[prop] = val;
      }
    }

    for (const [prop, val] of Object.entries(afterEntries)) {
      if (!(prop in beforeEntries)) {
        added[prop] = val;
      }
    }

    const beforeCount = Object.keys(beforeEntries).length;
    const afterCount = Object.keys(afterEntries).length;
    const reductionPercentage =
      beforeCount > 0
        ? Math.round(((beforeCount - afterCount) / beforeCount) * 100)
        : 0;

    return { added, removed, changed, unchanged, reductionPercentage };
  }

  /**
   * ショートハンド統合の共通処理: longhandを削除してshorthandを追加
   *
   * - proposal.afterValue は `"property: value"` 形式を想定
   * - proposal.issue は shorthand-opportunity の場合 currentLonghandProperties を持つ
   */
  function applyShorthandMerge(
    record: Record<string, string>,
    proposal: OptimizationProposal,
  ): void {
    const shorthandMatch = proposal.afterValue.match(/^(\S+):\s*(.+)$/);
    if (!shorthandMatch) {
      console.warn(
        `[StyleOptimizer] Invalid shorthand format: "${proposal.afterValue}"`,
      );
      return;
    }

    const [, shorthandProp, shorthandVal] = shorthandMatch;
    const issue = proposal.issue;

    let longhandList: readonly string[];
    if (issue.type === "shorthand-opportunity") {
      longhandList = issue.currentLonghandProperties;
    } else {
      // duplicate-property / default-value の場合はcurrentValueからフォールバック
      const raw = issue.currentValue;
      if (!raw || typeof raw !== "string") return;
      longhandList = raw
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    if (longhandList.length === 0) {
      return;
    }

    for (const longhand of longhandList) {
      delete record[longhand];
    }
    record[shorthandProp] = shorthandVal;
  }

  const CONFIDENCE_LEVELS = {
    DUPLICATE_PROPERTY: 1.0,
    DEFAULT_VALUE: 0.9,
    SHORTHAND_OPPORTUNITY: 0.8,
  } as const;

  function determineAction(
    issue: RedundancyIssue,
  ): "remove" | "replace" | "merge" {
    switch (issue.type) {
      case "default-value":
        return "remove";
      case "duplicate-property":
        return "remove";
      case "shorthand-opportunity":
        return issue.suggestedValue ? "merge" : "remove";
    }
  }

  function calculateConfidence(issue: RedundancyIssue): number {
    switch (issue.type) {
      case "duplicate-property":
        return CONFIDENCE_LEVELS.DUPLICATE_PROPERTY;
      case "default-value":
        return CONFIDENCE_LEVELS.DEFAULT_VALUE;
      case "shorthand-opportunity":
        return CONFIDENCE_LEVELS.SHORTHAND_OPPORTUNITY;
    }
  }

  function buildSummary(
    issues: RedundancyIssue[],
    applied: number,
    skipped: number,
    originalStyles: Styles,
    optimizedStyles: Styles,
  ): OptimizationSummary {
    const beforeCount = Object.keys(toRecord(originalStyles)).length;
    const afterCount = Object.keys(toRecord(optimizedStyles)).length;
    const reductionPercentage =
      beforeCount > 0
        ? Math.round(((beforeCount - afterCount) / beforeCount) * 100)
        : 0;

    const byType: Record<string, number> = {
      "duplicate-property": 0,
      "default-value": 0,
      "shorthand-opportunity": 0,
    };

    for (const issue of issues) {
      byType[issue.type] = (byType[issue.type] || 0) + 1;
    }

    return {
      totalIssues: issues.length,
      applied,
      skipped,
      reductionPercentage,
      byType: byType as OptimizationSummary["byType"],
    };
  }

  function toRecord(styles: Styles): Record<string, string> {
    const record: Record<string, string> = {};
    for (const [key, value] of Object.entries(styles)) {
      if (key === "__brand") continue;
      record[key] = value;
    }
    return record;
  }
}
