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
import { flattenNodes } from "./utils";

/**
 * ラベルが必要なインタラクティブ要素
 */
const INTERACTIVE_ELEMENTS = [
  "button",
  "input",
  "select",
  "textarea",
  "a",
  "area",
] as const;

/**
 * ARIA属性をチェックするルール
 */
export class AriaRule implements A11yRule {
  private issueCounter = 0;

  readonly id: A11yIssueType = "aria-attributes";
  readonly wcagCriterion: WcagCriterion = "4.1.2";
  readonly severity: A11ySeverity = "error";

  check(context: A11yCheckContext): readonly A11yIssue[] {
    this.issueCounter = 0;
    if (!context.parsedNodes) {
      return [];
    }
    const issues: A11yIssue[] = [];
    const allNodes = flattenNodes(context.parsedNodes);

    this.checkInvalidRoles(allNodes, issues);
    this.checkDuplicateIds(allNodes, issues);
    this.checkMissingLabels(allNodes, issues);

    return issues;
  }

  private nextIssueId(): string {
    this.issueCounter++;
    return `aria-${this.issueCounter}`;
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
          id: createA11yIssueId(this.nextIssueId()),
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
          id: createA11yIssueId(this.nextIssueId()),
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

  private isInteractiveElement(node: ParsedHtmlNode): boolean {
    // a要素はhref属性がある場合のみインタラクティブ
    if (node.tagName === "a") {
      return !!node.attributes["href"];
    }
    // area要素はhref属性がある場合のみインタラクティブ
    if (node.tagName === "area") {
      return !!node.attributes["href"];
    }
    return true;
  }

  private checkMissingLabels(
    nodes: ParsedHtmlNode[],
    issues: A11yIssue[],
  ): void {
    for (const node of nodes) {
      const isInteractive =
        INTERACTIVE_ELEMENTS.includes(
          node.tagName as (typeof INTERACTIVE_ELEMENTS)[number],
        ) && this.isInteractiveElement(node);

      if (isInteractive) {
        const hasLabel =
          node.attributes["aria-label"] ||
          node.attributes["aria-labelledby"] ||
          node.attributes["title"] ||
          node.textContent.trim();

        if (!hasLabel) {
          issues.push({
            id: createA11yIssueId(this.nextIssueId()),
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
