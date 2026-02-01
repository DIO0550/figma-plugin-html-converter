/**
 * WCAG 1.4.3: Figmaノードのコントラスト比チェックルール
 */
import type {
  A11yRule,
  A11yIssue,
  A11yCheckContext,
  A11yIssueType,
  WcagCriterion,
  A11ySeverity,
  FigmaNodeInfo,
  FigmaPaint,
} from "../../types";
import type { RGB } from "../../../converter/models/colors";
import { createA11yIssueId } from "../../types";
import { checkContrast } from "../../contrast/contrast-calculator";

let issueCounter = 0;

function nextIssueId(): string {
  issueCounter++;
  return `figma-contrast-${issueCounter}`;
}

/**
 * Figmaテキストノードのコントラスト比をチェックするルール
 */
export class FigmaContrastRule implements A11yRule {
  readonly id: A11yIssueType = "low-contrast";
  readonly wcagCriterion: WcagCriterion = "1.4.3";
  readonly severity: A11ySeverity = "error";

  check(context: A11yCheckContext): readonly A11yIssue[] {
    if (!context.figmaNodes) {
      return [];
    }
    const issues: A11yIssue[] = [];

    for (const node of context.figmaNodes) {
      if (node.type !== "TEXT") {
        continue;
      }
      this.checkTextNode(node, issues);
    }

    return issues;
  }

  private checkTextNode(node: FigmaNodeInfo, issues: A11yIssue[]): void {
    const foreground = this.extractColor(node.fills);
    const background = this.extractColor(node.parentFills);

    if (!foreground || !background) {
      return;
    }

    const result = checkContrast(foreground, background);

    if (!result.meetsAA) {
      issues.push({
        id: createA11yIssueId(nextIssueId()),
        type: "low-contrast",
        severity: "error",
        wcagCriterion: "1.4.3",
        target: "figma",
        element: {
          tagName: "TEXT",
          figmaNodeId: node.id,
          textContent: node.name,
        },
        message: `コントラスト比が不十分です（${result.ratio.toFixed(2)}:1）。AA基準は4.5:1以上です`,
        details: `前景色: rgb(${Math.round(foreground.r * 255)}, ${Math.round(foreground.g * 255)}, ${Math.round(foreground.b * 255)}) / 背景色: rgb(${Math.round(background.r * 255)}, ${Math.round(background.g * 255)}, ${Math.round(background.b * 255)})`,
      });
    }
  }

  private extractColor(paints?: readonly FigmaPaint[]): RGB | null {
    if (!paints || paints.length === 0) {
      return null;
    }

    const solidPaint = paints.find((p) => p.type === "SOLID" && p.color);
    return solidPaint?.color ?? null;
  }
}
