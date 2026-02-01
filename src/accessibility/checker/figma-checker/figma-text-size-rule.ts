/**
 * WCAG 1.4.4: Figmaテキストノードのフォントサイズチェックルール
 */
import type {
  A11yRule,
  A11yIssue,
  A11yCheckContext,
  A11yIssueType,
  WcagCriterion,
  A11ySeverity,
} from "../../types";
import { createA11yIssueId } from "../../types";
import { TEXT_SIZE } from "../../constants";

let issueCounter = 0;

function nextIssueId(): string {
  issueCounter++;
  return `figma-text-size-${issueCounter}`;
}

/**
 * Figmaテキストノードのフォントサイズをチェックするルール
 */
export class FigmaTextSizeRule implements A11yRule {
  readonly id: A11yIssueType = "insufficient-text-size";
  readonly wcagCriterion: WcagCriterion = "1.4.4";
  readonly severity: A11ySeverity = "warning";

  check(context: A11yCheckContext): readonly A11yIssue[] {
    if (!context.figmaNodes) {
      return [];
    }

    const issues: A11yIssue[] = [];
    const minSize = context.config.minTextSize ?? TEXT_SIZE.MIN_FONT_SIZE_PX;

    for (const node of context.figmaNodes) {
      if (node.type !== "TEXT") {
        continue;
      }
      if (node.fontSize === undefined) {
        continue;
      }
      if (node.fontSize < minSize) {
        issues.push({
          id: createA11yIssueId(nextIssueId()),
          type: "insufficient-text-size",
          severity: "warning",
          wcagCriterion: "1.4.4",
          target: "figma",
          element: {
            tagName: "TEXT",
            figmaNodeId: node.id,
            textContent: node.name,
          },
          message: `Figmaテキストノードのフォントサイズ（${node.fontSize}px）が最小サイズ（${minSize}px）未満です`,
        });
      }
    }

    return issues;
  }
}
