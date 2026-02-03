/**
 * アクセシビリティチェッカーオーケストレーター
 */
import type { A11yIssue, A11yCheckContext } from "../types";
import { HtmlA11yChecker } from "./html-checker";
import { FigmaA11yChecker } from "./figma-checker";

/**
 * HTML + Figma の両方のアクセシビリティチェックを統合するオーケストレーター
 */
export class A11yChecker {
  private readonly htmlChecker = new HtmlA11yChecker();
  private readonly figmaChecker = new FigmaA11yChecker();

  check(context: A11yCheckContext): readonly A11yIssue[] {
    const issues: A11yIssue[] = [];
    const { checkTarget } = context.config;

    if (checkTarget === "html" || checkTarget === "both") {
      issues.push(...this.htmlChecker.check(context));
    }

    if (checkTarget === "figma" || checkTarget === "both") {
      issues.push(...this.figmaChecker.check(context));
    }

    return issues;
  }
}
