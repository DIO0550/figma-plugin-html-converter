/**
 * セマンティクスチェックルール
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
import { LANDMARK_ELEMENTS, HEADING_ELEMENTS } from "../../constants";
import { flattenNodes } from "./utils";

/**
 * セマンティクスHTMLをチェックするルール
 */
export class SemanticRule implements A11yRule {
  private issueCounter = 0;
  readonly id: A11yIssueType = "missing-heading-hierarchy";
  readonly wcagCriterion: WcagCriterion = "1.3.1";
  readonly severity: A11ySeverity = "warning";

  check(context: A11yCheckContext): readonly A11yIssue[] {
    if (!context.parsedNodes) {
      return [];
    }
    const issues: A11yIssue[] = [];
    const allNodes = flattenNodes(context.parsedNodes);

    this.checkHeadingHierarchy(allNodes, issues);
    this.checkLandmarks(allNodes, issues);
    this.checkLangAttribute(allNodes, issues);

    return issues;
  }

  private nextIssueId(): string {
    this.issueCounter++;
    return `semantic-${this.issueCounter}`;
  }

  private checkHeadingHierarchy(
    nodes: ParsedHtmlNode[],
    issues: A11yIssue[],
  ): void {
    const headings = nodes.filter((n) =>
      HEADING_ELEMENTS.includes(n.tagName as (typeof HEADING_ELEMENTS)[number]),
    );

    for (let i = 1; i < headings.length; i++) {
      const prevLevel = this.getHeadingLevel(headings[i - 1].tagName);
      const currentLevel = this.getHeadingLevel(headings[i].tagName);

      if (currentLevel - prevLevel > 1) {
        issues.push({
          id: createA11yIssueId(this.nextIssueId()),
          type: "missing-heading-hierarchy",
          severity: "warning",
          wcagCriterion: "1.3.1",
          target: "html",
          element: {
            tagName: headings[i].tagName,
            xpath: headings[i].xpath,
            attributes: headings[i].attributes,
          },
          message: `見出し階層がスキップされています（${headings[i - 1].tagName}→${headings[i].tagName}）`,
        });
      }
    }
  }

  private getHeadingLevel(tagName: string): number {
    return parseInt(tagName.charAt(1), 10);
  }

  private checkLandmarks(nodes: ParsedHtmlNode[], issues: A11yIssue[]): void {
    const hasLandmark = nodes.some((n) =>
      LANDMARK_ELEMENTS.includes(
        n.tagName as (typeof LANDMARK_ELEMENTS)[number],
      ),
    );

    if (!hasLandmark && nodes.length > 0) {
      issues.push({
        id: createA11yIssueId(this.nextIssueId()),
        type: "missing-landmark",
        severity: "info",
        wcagCriterion: "1.3.1",
        target: "html",
        element: {
          tagName: "document",
          xpath: "/",
        },
        message:
          "ランドマーク要素（header, nav, main, aside, footer）が使用されていません",
      });
    }
  }

  private checkLangAttribute(
    nodes: ParsedHtmlNode[],
    issues: A11yIssue[],
  ): void {
    const htmlNode = nodes.find((n) => n.tagName === "html");

    if (htmlNode && !htmlNode.attributes["lang"]) {
      issues.push({
        id: createA11yIssueId(this.nextIssueId()),
        type: "missing-lang-attribute",
        severity: "error",
        wcagCriterion: "3.1.1",
        target: "html",
        element: {
          tagName: htmlNode.tagName,
          xpath: htmlNode.xpath,
          attributes: htmlNode.attributes,
        },
        message: "html要素にlang属性がありません",
      });
    }
  }
}
