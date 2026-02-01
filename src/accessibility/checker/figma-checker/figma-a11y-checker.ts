/**
 * Figmaノードのアクセシビリティチェッカー統合
 */
import type { A11yIssue, A11yCheckContext, A11yRule } from "../../types";
import { FigmaContrastRule } from "./contrast-rule";
import { FigmaTextSizeRule } from "./figma-text-size-rule";

/**
 * 全Figmaルールを統合してチェックする
 */
export class FigmaA11yChecker {
  private readonly rules: readonly A11yRule[];

  constructor() {
    this.rules = [new FigmaContrastRule(), new FigmaTextSizeRule()];
  }

  check(context: A11yCheckContext): readonly A11yIssue[] {
    const issues: A11yIssue[] = [];

    for (const rule of this.rules) {
      if (context.config.enabledRules.includes(rule.id)) {
        issues.push(...rule.check(context));
      }
    }

    return issues;
  }
}
