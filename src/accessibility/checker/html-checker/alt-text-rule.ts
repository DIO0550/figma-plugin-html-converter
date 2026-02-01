/**
 * WCAG 1.1.1: alt属性チェックルール
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

/**
 * img要素のalt属性をチェックするルール
 */
export class AltTextRule implements A11yRule {
  private issueCounter = 0;

  readonly id: A11yIssueType = "missing-alt-text";
  readonly wcagCriterion: WcagCriterion = "1.1.1";
  readonly severity: A11ySeverity = "error";

  check(context: A11yCheckContext): readonly A11yIssue[] {
    if (!context.parsedNodes) {
      return [];
    }
    const issues: A11yIssue[] = [];
    this.checkNodes(context.parsedNodes, issues);
    return issues;
  }

  private checkNodes(
    nodes: readonly ParsedHtmlNode[],
    issues: A11yIssue[],
  ): void {
    for (const node of nodes) {
      if (node.tagName === "img") {
        this.checkImgNode(node, issues);
      }
      if (node.children.length > 0) {
        this.checkNodes(node.children, issues);
      }
    }
  }

  private nextIssueId(): string {
    this.issueCounter++;
    return `alt-${this.issueCounter}`;
  }

  private checkImgNode(node: ParsedHtmlNode, issues: A11yIssue[]): void {
    // role="presentation" or role="none" の場合はスキップ（装飾画像）
    const role = node.attributes["role"];
    if (role === "presentation" || role === "none") {
      return;
    }

    const alt = node.attributes["alt"];

    if (alt === undefined) {
      issues.push({
        id: createA11yIssueId(this.nextIssueId()),
        type: "missing-alt-text",
        severity: "error",
        wcagCriterion: "1.1.1",
        target: "html",
        element: {
          tagName: node.tagName,
          xpath: node.xpath,
          attributes: node.attributes,
        },
        message: "img要素にalt属性がありません",
      });
    } else if (alt === "") {
      issues.push({
        id: createA11yIssueId(this.nextIssueId()),
        type: "empty-alt-text",
        severity: "warning",
        wcagCriterion: "1.1.1",
        target: "html",
        element: {
          tagName: node.tagName,
          xpath: node.xpath,
          attributes: node.attributes,
        },
        message:
          "img要素のalt属性が空です。装飾画像でない場合は説明テキストを追加してください",
      });
    }
  }
}
