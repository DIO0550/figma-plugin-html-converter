import { Styles } from "../styles";
import type { RedundancyIssue } from "../redundancy-detector/types";
import type {
  OptimizationProposal,
  OptimizationResult,
  StyleComparison,
  OptimizationSummary,
} from "./types";

let proposalCounter = 0;

function generateId(): string {
  proposalCounter += 1;
  return `proposal-${proposalCounter}`;
}

/**
 * スタイル最適化の提案生成と適用を行うモジュール
 * コンパニオンオブジェクトパターンで実装
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StyleOptimizer {
  /**
   * IDカウンターをリセット（テスト用）
   */
  export function resetIdCounter(): void {
    proposalCounter = 0;
  }

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

      return {
        id: generateId(),
        issue,
        action,
        beforeValue: issue.currentValue,
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
          // shorthand統合の場合: 各longhandを削除してshorthandを追加
          if (proposal.issue.type === "shorthand-opportunity") {
            const shorthandMatch = proposal.afterValue.match(/^(\S+):\s*(.+)$/);
            if (shorthandMatch) {
              const [, shorthandProp, shorthandVal] = shorthandMatch;
              // longhandを削除
              const currentValueList = proposal.issue.currentValue
                .split(",")
                .map((s) => s.trim());
              for (const longhand of currentValueList) {
                delete record[longhand];
              }
              record[shorthandProp] = shorthandVal;
            }
          } else {
            record[proposal.issue.property] = proposal.afterValue;
          }
        }
        break;

      case "merge":
        // shorthand統合
        if (proposal.afterValue) {
          const shorthandMatch = proposal.afterValue.match(/^(\S+):\s*(.+)$/);
          if (shorthandMatch) {
            const [, shorthandProp, shorthandVal] = shorthandMatch;
            const currentValueList = proposal.issue.currentValue
              .split(",")
              .map((s) => s.trim());
            for (const longhand of currentValueList) {
              delete record[longhand];
            }
            record[shorthandProp] = shorthandVal;
          }
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
        return 1.0;
      case "default-value":
        return 0.9;
      case "shorthand-opportunity":
        return 0.8;
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
