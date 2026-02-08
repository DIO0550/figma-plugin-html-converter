import { test, expect } from "vitest";
import { Styles } from "../../styles";
import { StyleOptimizer } from "../style-optimizer";
import type { RedundancyIssue } from "../../redundancy-detector/types";
import type { OptimizationProposal } from "../types";

test("StyleOptimizer.generateProposals - default-value問題 - remove提案を生成", () => {
    const issues: RedundancyIssue[] = [
      {
        type: "default-value",
        severity: "low",
        property: "position",
        currentValue: "static",
        description: "デフォルト値",
      },
    ];
    const proposals = StyleOptimizer.generateProposals(issues);
    expect(proposals).toHaveLength(1);
    expect(proposals[0].action).toBe("remove");
    expect(proposals[0].source).toBe("local");
    expect(proposals[0].confidence).toBe(0.9);
});

test("StyleOptimizer.generateProposals - duplicate-property問題 - reviewアクションになる", () => {
    const issues: RedundancyIssue[] = [
      {
        type: "duplicate-property",
        severity: "high",
        property: "margin-top",
        currentValue: "20px",
        description: "重複",
      },
    ];
    const proposals = StyleOptimizer.generateProposals(issues);
    expect(proposals[0].action).toBe("review");
    expect(proposals[0].confidence).toBe(0.5);
});

test("StyleOptimizer.generateProposals - shorthand-opportunity問題 - mergeアクションになる", () => {
    const issues: RedundancyIssue[] = [
      {
        type: "shorthand-opportunity",
        severity: "medium",
        property: "margin",
        currentLonghandProperties: [
          "margin-top",
          "margin-right",
          "margin-bottom",
          "margin-left",
        ],
        suggestedValue: "margin: 10px",
        description: "ショートハンド統合",
      },
    ];
    const proposals = StyleOptimizer.generateProposals(issues);
    expect(proposals[0].action).toBe("merge");
    expect(proposals[0].confidence).toBe(0.8);
});

test("StyleOptimizer.generateProposals - 複数issue - ユニークなIDを付与", () => {
    const issues: RedundancyIssue[] = [
      {
        type: "default-value",
        severity: "low",
        property: "position",
        currentValue: "static",
        description: "a",
      },
      {
        type: "default-value",
        severity: "low",
        property: "opacity",
        currentValue: "1",
        description: "b",
      },
    ];
    const proposals = StyleOptimizer.generateProposals(issues);
    expect(proposals[0].id).not.toBe(proposals[1].id);
});

test("StyleOptimizer.mergeProposals - 同一IDでconfidence差あり - 高い方を採用", () => {
    const local: OptimizationProposal[] = [
      {
        id: "proposal-default-value-opacity",
        issue: {
          type: "default-value",
          severity: "low",
          property: "opacity",
          currentValue: "1",
          description: "local",
        },
        action: "remove",
        beforeValue: "1",
        afterValue: "",
        confidence: 0.7,
        source: "local",
      },
    ];
    const ai: OptimizationProposal[] = [
      {
        id: "proposal-default-value-opacity",
        issue: {
          type: "default-value",
          severity: "low",
          property: "opacity",
          currentValue: "1",
          description: "ai",
        },
        action: "remove",
        beforeValue: "1",
        afterValue: "",
        confidence: 0.9,
        source: "ai",
      },
    ];
    const merged = StyleOptimizer.mergeProposals(local, ai);
    expect(merged).toHaveLength(1);
    expect(merged[0].source).toBe("ai");
});

test("StyleOptimizer.mergeProposals - 同一IDでconfidence同値 - localを優先", () => {
    const local: OptimizationProposal[] = [
      {
        id: "proposal-default-value-opacity",
        issue: {
          type: "default-value",
          severity: "low",
          property: "opacity",
          currentValue: "1",
          description: "local",
        },
        action: "remove",
        beforeValue: "1",
        afterValue: "",
        confidence: 0.9,
        source: "local",
      },
    ];
    const ai: OptimizationProposal[] = [
      {
        id: "proposal-default-value-opacity",
        issue: {
          type: "default-value",
          severity: "low",
          property: "opacity",
          currentValue: "1",
          description: "ai",
        },
        action: "remove",
        beforeValue: "1",
        afterValue: "",
        confidence: 0.9,
        source: "ai",
      },
    ];
    const merged = StyleOptimizer.mergeProposals(local, ai);
    expect(merged).toHaveLength(1);
    expect(merged[0].source).toBe("local");
});

test("StyleOptimizer.mergeProposals - 異なるID - 両方保持", () => {
    const local: OptimizationProposal[] = [
      {
        id: "proposal-default-value-position",
        issue: {
          type: "default-value",
          severity: "low",
          property: "position",
          currentValue: "static",
          description: "",
        },
        action: "remove",
        beforeValue: "static",
        afterValue: "",
        confidence: 0.9,
        source: "local",
      },
    ];
    const ai: OptimizationProposal[] = [
      {
        id: "proposal-default-value-opacity",
        issue: {
          type: "default-value",
          severity: "low",
          property: "opacity",
          currentValue: "1",
          description: "",
        },
        action: "remove",
        beforeValue: "1",
        afterValue: "",
        confidence: 0.8,
        source: "ai",
      },
    ];
    const merged = StyleOptimizer.mergeProposals(local, ai);
    expect(merged).toHaveLength(2);
});

test("StyleOptimizer.mergeProposals - 同一プロパティでtype違い - 両方保持", () => {
    const local: OptimizationProposal[] = [
      {
        id: "proposal-duplicate-property-margin-top-div",
        issue: {
          type: "duplicate-property",
          severity: "high",
          property: "margin-top",
          currentValue: "10px",
          description: "",
        },
        action: "review",
        beforeValue: "10px",
        afterValue: "",
        confidence: 0.5,
        source: "local",
      },
    ];
    const ai: OptimizationProposal[] = [
      {
        id: "proposal-default-value-margin-top-div",
        issue: {
          type: "default-value",
          severity: "low",
          property: "margin-top",
          currentValue: "0px",
          description: "",
        },
        action: "remove",
        beforeValue: "0px",
        afterValue: "",
        confidence: 0.9,
        source: "ai",
      },
    ];
    const merged = StyleOptimizer.mergeProposals(local, ai);
    expect(merged).toHaveLength(2);
});

test("StyleOptimizer.applyProposal - removeアクション - プロパティを削除", () => {
    const styles = Styles.parse("position: static; color: red");
    const proposal: OptimizationProposal = {
      id: "1",
      issue: {
        type: "default-value",
        severity: "low",
        property: "position",
        currentValue: "static",
        description: "",
      },
      action: "remove",
      beforeValue: "static",
      afterValue: "",
      confidence: 0.9,
      source: "local",
    };
    const result = StyleOptimizer.applyProposal(styles, proposal);
    expect(result["position"]).toBeUndefined();
    expect(result["color"]).toBe("red");
});

test("StyleOptimizer.applyProposal - mergeアクション - shorthandを統合", () => {
    const styles = Styles.parse(
      "margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px",
    );
    const proposal: OptimizationProposal = {
      id: "1",
      issue: {
        type: "shorthand-opportunity",
        severity: "medium",
        property: "margin",
        currentLonghandProperties: [
          "margin-top",
          "margin-right",
          "margin-bottom",
          "margin-left",
        ],
        suggestedValue: "margin: 10px",
        description: "",
      },
      action: "merge",
      beforeValue: "margin-top, margin-right, margin-bottom, margin-left",
      afterValue: "margin: 10px",
      confidence: 0.8,
      source: "local",
    };
    const result = StyleOptimizer.applyProposal(styles, proposal);
    expect(result["margin"]).toBe("10px");
    expect(result["margin-top"]).toBeUndefined();
    expect(result["margin-right"]).toBeUndefined();
});

test("StyleOptimizer.applyApproved - 承認済みID指定 - 対象のみ適用", () => {
    const styles = Styles.parse("position: static; opacity: 1; color: red");
    const proposals: OptimizationProposal[] = [
      {
        id: "p1",
        issue: {
          type: "default-value",
          severity: "low",
          property: "position",
          currentValue: "static",
          description: "",
        },
        action: "remove",
        beforeValue: "static",
        afterValue: "",
        confidence: 0.9,
        source: "local",
      },
      {
        id: "p2",
        issue: {
          type: "default-value",
          severity: "low",
          property: "opacity",
          currentValue: "1",
          description: "",
        },
        action: "remove",
        beforeValue: "1",
        afterValue: "",
        confidence: 0.9,
        source: "local",
      },
    ];
    const result = StyleOptimizer.applyApproved(styles, proposals, ["p1"]);
    expect(result["position"]).toBeUndefined();
    expect(result["opacity"]).toBe("1");
    expect(result["color"]).toBe("red");
});

test("StyleOptimizer.compare - 削除あり - removedに含める", () => {
    const before = Styles.parse("position: static; color: red");
    const after = Styles.parse("color: red");
    const comparison = StyleOptimizer.compare(before, after);
    expect(comparison.removed).toEqual({ position: "static" });
    expect(comparison.unchanged).toEqual({ color: "red" });
    expect(comparison.reductionPercentage).toBe(50);
});

test("StyleOptimizer.compare - 追加あり - addedに含める", () => {
    const before = Styles.parse("color: red");
    const after = Styles.parse("color: red; margin: 10px");
    const comparison = StyleOptimizer.compare(before, after);
    expect(comparison.added).toEqual({ margin: "10px" });
});

test("StyleOptimizer.compare - 変更あり - changedに含める", () => {
    const before = Styles.parse("color: red");
    const after = Styles.parse("color: blue");
    const comparison = StyleOptimizer.compare(before, after);
    expect(comparison.changed).toHaveLength(1);
    expect(comparison.changed[0]).toEqual({
      property: "color",
      before: "red",
      after: "blue",
    });
});

test("StyleOptimizer.compare - 空スタイル同士 - 変化なし", () => {
    const before = Styles.parse("");
    const after = Styles.parse("");
    const comparison = StyleOptimizer.compare(before, after);
    expect(comparison.reductionPercentage).toBe(0);
    expect(Object.keys(comparison.removed)).toHaveLength(0);
});

test("StyleOptimizer.optimize - issuesあり - 最適化結果を返す", () => {
    const styles = Styles.parse("position: static; color: red; opacity: 1");
    const issues: RedundancyIssue[] = [
      {
        type: "default-value",
        severity: "low",
        property: "position",
        currentValue: "static",
        description: "",
      },
      {
        type: "default-value",
        severity: "low",
        property: "opacity",
        currentValue: "1",
        description: "",
      },
    ];
    const result = StyleOptimizer.optimize(styles, issues);
    expect(result.appliedCount).toBe(2);
    expect(result.optimizedStyles["position"]).toBeUndefined();
    expect(result.optimizedStyles["opacity"]).toBeUndefined();
    expect(result.optimizedStyles["color"]).toBe("red");
    expect(result.summary.totalIssues).toBe(2);
    expect(result.summary.byType["default-value"]).toBe(2);
});

test("StyleOptimizer.optimize - issuesなし - 入力スタイルを保持", () => {
    const styles = Styles.parse("color: red");
    const result = StyleOptimizer.optimize(styles, []);
    expect(result.appliedCount).toBe(0);
    expect(result.optimizedStyles["color"]).toBe("red");
    expect(result.summary.reductionPercentage).toBe(0);
});
