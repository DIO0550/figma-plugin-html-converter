/**
 * HTML要素のアクセシビリティチェッカー統合
 */
import type { A11yIssue, A11yCheckContext, A11yRule } from "../../types";
import { AltTextRule } from "./alt-text-rule";
import { AriaRule } from "./aria-rule";
import { SemanticRule } from "./semantic-rule";
import { TextSizeRule } from "./text-size-rule";

/**
 * 全HTMLルールを統合してチェックする
 */
export class HtmlA11yChecker {
  private readonly rules: readonly A11yRule[];

  constructor() {
    this.rules = [
      new AltTextRule(),
      new AriaRule(),
      new SemanticRule(),
      new TextSizeRule(),
    ];
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
