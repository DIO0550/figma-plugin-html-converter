/**
 * WCAG 1.4.4: テキストサイズチェックルール
 */
import type {
  A11yRule,
  A11yIssue,
  A11yCheckContext,
  A11yIssueType,
  WcagCriterion,
  A11ySeverity,
  ParsedHtmlNode,
} from "../../types";
import { createA11yIssueId } from "../../types";
import { TEXT_SIZE } from "../../constants";

const FONT_SIZE_PATTERN = /font-size:\s*([\d.]+)(px|pt)/;

/**
 * テキストサイズをチェックするルール
 */
export class TextSizeRule implements A11yRule {
  private issueCounter = 0;
  readonly id: A11yIssueType = "insufficient-text-size";
  readonly wcagCriterion: WcagCriterion = "1.4.4";
  readonly severity: A11ySeverity = "warning";

  check(context: A11yCheckContext): readonly A11yIssue[] {
    if (!context.parsedNodes) {
      return [];
    }
    const issues: A11yIssue[] = [];
    const minSize = context.config.minTextSize ?? TEXT_SIZE.MIN_FONT_SIZE_PX;
    this.checkNodes(context.parsedNodes, issues, minSize);
    return issues;
  }

  private checkNodes(
    nodes: readonly ParsedHtmlNode[],
    issues: A11yIssue[],
    minSize: number,
  ): void {
    for (const node of nodes) {
      this.checkFontSize(node, issues, minSize);
      if (node.children.length > 0) {
        this.checkNodes(node.children, issues, minSize);
      }
    }
  }

  private nextIssueId(): string {
    this.issueCounter++;
    return `text-size-${this.issueCounter}`;
  }

  private checkFontSize(
    node: ParsedHtmlNode,
    issues: A11yIssue[],
    minSize: number,
  ): void {
    const style = node.attributes["style"];
    if (!style) {
      return;
    }

    const fontSize = this.parseFontSize(style);
    if (fontSize === null) {
      return;
    }

    if (fontSize < minSize) {
      issues.push({
        id: createA11yIssueId(this.nextIssueId()),
        type: "insufficient-text-size",
        severity: "warning",
        wcagCriterion: "1.4.4",
        target: "html",
        element: {
          tagName: node.tagName,
          xpath: node.xpath,
          attributes: node.attributes,
        },
        message: `フォントサイズ（${fontSize}px）が最小サイズ（${minSize}px）未満です`,
      });
    }
  }

  private parseFontSize(style: string): number | null {
    const match = style.match(FONT_SIZE_PATTERN);
    if (!match) {
      return null;
    }

    const value = parseFloat(match[1]);
    const unit = match[2];

    if (unit === "pt") {
      return value * TEXT_SIZE.PT_TO_PX_RATIO;
    }
    return value;
  }
}
