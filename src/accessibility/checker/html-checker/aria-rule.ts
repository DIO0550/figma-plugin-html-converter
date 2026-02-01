/**
 * WCAG 4.1.2: ARIA属性チェックルール
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
import { VALID_ARIA_ROLES } from "../../constants";

let issueCounter = 0;

function nextIssueId(): string {
  issueCounter++;
  return `aria-${issueCounter}`;
}

/**
 * ラベルが必要なインタラクティブ要素
 */
const INTERACTIVE_ELEMENTS = ["button", "input", "select", "textarea"] as const;

/**
 * ARIA属性をチェックするルール
 */
export class AriaRule implements A11yRule {
  readonly id: A11yIssueType = "invalid-aria-role";
  readonly wcagCriterion: WcagCriterion = "4.1.2";
  readonly severity: A11ySeverity = "error";

  check(context: A11yCheckContext): readonly A11yIssue[] {
    if (!context.parsedNodes) {
      return [];
    }
    const issues: A11yIssue[] = [];
    const allNodes = this.flattenNodes(context.parsedNodes);

    this.checkInvalidRoles(allNodes, issues);
    this.checkDuplicateIds(allNodes, issues);
    this.checkMissingLabels(allNodes, issues);

    return issues;
  }

  private flattenNodes(nodes: readonly ParsedHtmlNode[]): ParsedHtmlNode[] {
    const result: ParsedHtmlNode[] = [];
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) {
        result.push(...this.flattenNodes(node.children));
      }
    }
    return result;
  }

  private checkInvalidRoles(
    nodes: ParsedHtmlNode[],
    issues: A11yIssue[],
  ): void {
    for (const node of nodes) {
      const role = node.attributes["role"];
      if (
        role &&
        !VALID_ARIA_ROLES.includes(role as (typeof VALID_ARIA_ROLES)[number])
      ) {
        issues.push({
          id: createA11yIssueId(nextIssueId()),
          type: "invalid-aria-role",
          severity: "error",
          wcagCriterion: "4.1.2",
          target: "html",
          element: {
            tagName: node.tagName,
            xpath: node.xpath,
            attributes: node.attributes,
          },
          message: `無効なARIAロール「${role}」が指定されています`,
        });
      }
    }
  }

  private checkDuplicateIds(
    nodes: ParsedHtmlNode[],
    issues: A11yIssue[],
  ): void {
    const idMap = new Map<string, ParsedHtmlNode[]>();

    for (const node of nodes) {
      const id = node.attributes["id"];
      if (id) {
        const existing = idMap.get(id) ?? [];
        existing.push(node);
        idMap.set(id, existing);
      }
    }

    for (const [id, elements] of idMap) {
      if (elements.length > 1) {
        issues.push({
          id: createA11yIssueId(nextIssueId()),
          type: "duplicate-aria-id",
          severity: "error",
          wcagCriterion: "4.1.2",
          target: "html",
          element: {
            tagName: elements[0].tagName,
            xpath: elements[0].xpath,
            attributes: elements[0].attributes,
          },
          message: `id="${id}"が${elements.length}回重複しています`,
        });
      }
    }
  }

  private checkMissingLabels(
    nodes: ParsedHtmlNode[],
    issues: A11yIssue[],
  ): void {
    for (const node of nodes) {
      if (
        INTERACTIVE_ELEMENTS.includes(
          node.tagName as (typeof INTERACTIVE_ELEMENTS)[number],
        )
      ) {
        const hasLabel =
          node.attributes["aria-label"] ||
          node.attributes["aria-labelledby"] ||
          node.attributes["title"] ||
          node.textContent.trim();

        if (!hasLabel) {
          issues.push({
            id: createA11yIssueId(nextIssueId()),
            type: "missing-aria-label",
            severity: "error",
            wcagCriterion: "4.1.2",
            target: "html",
            element: {
              tagName: node.tagName,
              xpath: node.xpath,
              attributes: node.attributes,
            },
            message: `${node.tagName}要素にアクセシブルな名前がありません`,
          });
        }
      }
    }
  }
}
