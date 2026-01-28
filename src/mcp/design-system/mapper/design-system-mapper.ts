/**
 * デザインシステムマッパー
 *
 * HTML要素とデザインシステムのスタイル/コンポーネントを
 * マッピングするロジックを提供する。
 */
import type {
  DesignSystem,
  DesignSystemStyle,
  DesignSystemComponent,
  MappingRule,
  MappingMatch,
  MappingResult,
  MappingRuleId,
} from "../types";
import { createMappingRuleId } from "../types";

/**
 * マッチング対象の要素情報
 */
export interface ElementInfo {
  /** タグ名 */
  tagName: string;
  /** クラス名 */
  className?: string;
  /** 属性 */
  attributes?: Record<string, string>;
  /** スタイル */
  styles?: Record<string, string>;
  /** 要素のパス */
  path: string;
}

/**
 * デザインシステムマッパークラス
 */
export class DesignSystemMapper {
  private designSystem: DesignSystem;
  private rules: MappingRule[];

  private constructor(designSystem: DesignSystem, rules: MappingRule[] = []) {
    this.designSystem = designSystem;
    this.rules = [...rules];
  }

  /**
   * マッパーインスタンスを作成する
   */
  static create(
    designSystem: DesignSystem,
    rules: MappingRule[] = [],
  ): DesignSystemMapper {
    return new DesignSystemMapper(designSystem, rules);
  }

  /**
   * デフォルトのマッピングルールを取得する
   */
  static getDefaultRules(): MappingRule[] {
    return [
      // 見出しスタイル
      {
        id: createMappingRuleId("default-h1"),
        name: "H1 Heading",
        condition: { tagName: "h1" },
        action: {
          applyStyleName: "Typography/Heading/H1",
          category: "typography",
        },
        priority: 100,
        enabled: true,
        isCustom: false,
      },
      {
        id: createMappingRuleId("default-h2"),
        name: "H2 Heading",
        condition: { tagName: "h2" },
        action: {
          applyStyleName: "Typography/Heading/H2",
          category: "typography",
        },
        priority: 100,
        enabled: true,
        isCustom: false,
      },
      {
        id: createMappingRuleId("default-h3"),
        name: "H3 Heading",
        condition: { tagName: "h3" },
        action: {
          applyStyleName: "Typography/Heading/H3",
          category: "typography",
        },
        priority: 100,
        enabled: true,
        isCustom: false,
      },
      // 本文スタイル
      {
        id: createMappingRuleId("default-p"),
        name: "Paragraph",
        condition: { tagName: "p" },
        action: { applyStyleName: "Typography/Body", category: "typography" },
        priority: 100,
        enabled: true,
        isCustom: false,
      },
      // リンクスタイル
      {
        id: createMappingRuleId("default-a"),
        name: "Link",
        condition: { tagName: "a" },
        action: { applyStyleName: "Typography/Link", category: "typography" },
        priority: 100,
        enabled: true,
        isCustom: false,
      },
      // ボタンスタイル
      {
        id: createMappingRuleId("default-button"),
        name: "Button",
        condition: { tagName: "button" },
        action: { applyComponentName: "Button/Default", category: "layout" },
        priority: 100,
        enabled: true,
        isCustom: false,
      },
    ];
  }

  /**
   * ルールを追加する
   */
  addRule(rule: MappingRule): void {
    this.rules.push(rule);
    this.sortRulesByPriority();
  }

  /**
   * ルールを削除する
   */
  removeRule(ruleId: MappingRuleId): void {
    this.rules = this.rules.filter((rule) => rule.id !== ruleId);
  }

  /**
   * ルールを更新する
   */
  updateRule(ruleId: MappingRuleId, updates: Partial<MappingRule>): void {
    const index = this.rules.findIndex((rule) => rule.id === ruleId);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
      this.sortRulesByPriority();
    }
  }

  /**
   * すべてのルールを取得する
   */
  getRules(): MappingRule[] {
    return [...this.rules];
  }

  /**
   * 要素に対してマッチングを実行する
   */
  matchElement(element: ElementInfo): MappingMatch[] {
    const matches: MappingMatch[] = [];

    // 優先度順にソートされたルールに対してマッチング
    const sortedRules = this.getSortedRules();

    for (const rule of sortedRules) {
      if (!rule.enabled) {
        continue;
      }

      if (this.doesRuleMatch(rule, element)) {
        const match = this.createMatch(rule, element);
        matches.push(match);
      }
    }

    return matches;
  }

  /**
   * HTML要素リストをマッピングする
   */
  mapHtml(elements: ElementInfo[]): MappingResult {
    const matches: MappingMatch[] = [];
    const unmatchedElements: string[] = [];

    for (const element of elements) {
      const elementMatches = this.matchElement(element);
      if (elementMatches.length > 0) {
        matches.push(...elementMatches);
      } else {
        unmatchedElements.push(element.path);
      }
    }

    return {
      matches,
      unmatchedElements,
      processedAt: new Date(),
    };
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private sortRulesByPriority(): void {
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  private getSortedRules(): MappingRule[] {
    return [...this.rules].sort((a, b) => b.priority - a.priority);
  }

  private doesRuleMatch(rule: MappingRule, element: ElementInfo): boolean {
    const { condition } = rule;

    // タグ名のチェック
    if (condition.tagName && condition.tagName !== element.tagName) {
      return false;
    }

    // クラス名のチェック
    if (condition.className) {
      if (!element.className) {
        return false;
      }
      const elementClasses = element.className.split(/\s+/);
      if (!elementClasses.includes(condition.className)) {
        return false;
      }
    }

    // 属性のチェック
    if (condition.attributes) {
      if (!element.attributes) {
        return false;
      }
      for (const [key, value] of Object.entries(condition.attributes)) {
        if (element.attributes[key] !== value) {
          return false;
        }
      }
    }

    // スタイル条件のチェック
    if (condition.styleCondition) {
      if (!element.styles) {
        return false;
      }
      for (const [key, value] of Object.entries(condition.styleCondition)) {
        if (element.styles[key] !== value) {
          return false;
        }
      }
    }

    return true;
  }

  private createMatch(rule: MappingRule, element: ElementInfo): MappingMatch {
    const appliedStyle = this.resolveStyle(rule);
    const appliedComponent = this.resolveComponent(rule);

    return {
      rule,
      elementPath: element.path,
      appliedStyle,
      appliedComponent,
      confidence: this.calculateConfidence(rule, element),
    };
  }

  private resolveStyle(rule: MappingRule): DesignSystemStyle | undefined {
    const { action } = rule;

    if (action.applyStyleId) {
      return this.designSystem.styles.find(
        (style) => style.id === action.applyStyleId,
      );
    }

    if (action.applyStyleName) {
      return this.designSystem.styles.find(
        (style) => style.name === action.applyStyleName,
      );
    }

    return undefined;
  }

  private resolveComponent(
    rule: MappingRule,
  ): DesignSystemComponent | undefined {
    const { action } = rule;

    if (action.applyComponentId) {
      return this.designSystem.components.find(
        (component) => component.id === action.applyComponentId,
      );
    }

    if (action.applyComponentName) {
      return this.designSystem.components.find(
        (component) => component.name === action.applyComponentName,
      );
    }

    return undefined;
  }

  private calculateConfidence(
    rule: MappingRule,
    _element: ElementInfo,
  ): number {
    let confidence = 0.5; // ベースライン

    const { condition } = rule;

    // 条件が多いほど信頼度が高い
    if (condition.tagName) {
      confidence += 0.1;
    }
    if (condition.className) {
      confidence += 0.15;
    }
    if (condition.attributes && Object.keys(condition.attributes).length > 0) {
      confidence += 0.1 * Object.keys(condition.attributes).length;
    }
    if (
      condition.styleCondition &&
      Object.keys(condition.styleCondition).length > 0
    ) {
      confidence += 0.1 * Object.keys(condition.styleCondition).length;
    }

    // スタイル/コンポーネントが解決できた場合
    const resolvedStyle = this.resolveStyle(rule);
    const resolvedComponent = this.resolveComponent(rule);
    if (resolvedStyle || resolvedComponent) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }
}
