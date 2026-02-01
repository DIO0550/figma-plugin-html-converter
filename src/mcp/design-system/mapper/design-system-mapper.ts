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

// =============================================================================
// 信頼度計算の重み付け定数
// =============================================================================

/** 信頼度のベースライン */
const BASE_CONFIDENCE = 0.5;
/** タグ名マッチの重み */
const TAG_NAME_WEIGHT = 0.1;
/** クラス名マッチの重み */
const CLASS_NAME_WEIGHT = 0.15;
/** 属性条件1件あたりの重み */
const ATTRIBUTE_WEIGHT_PER_ITEM = 0.1;
/** スタイル条件1件あたりの重み */
const STYLE_CONDITION_WEIGHT_PER_ITEM = 0.1;
/** スタイル/コンポーネント解決ボーナス */
const STYLE_RESOLVED_BONUS = 0.1;
/** 信頼度の最大値 */
const MAX_CONFIDENCE = 1.0;

// =============================================================================
// デフォルトルール優先度
// =============================================================================

/** タグ名のみの基本ルール優先度 */
const PRIORITY_TAG_ONLY = 100;
/** タグ名＋クラス名の複合ルール優先度 */
const PRIORITY_TAG_AND_CLASS = 150;

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
    // NOTE: condition/actionのネストされたオブジェクトもコピーし、
    // 外部からの変更が内部状態に影響しないようにする
    this.rules = rules.map((rule) => ({
      ...rule,
      condition: { ...rule.condition },
      action: { ...rule.action },
    }));
    this.sortRulesByPriority();
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
      // 見出しスタイル（タグ名のみ: 基本優先度）
      {
        id: createMappingRuleId("default-h1"),
        name: "H1 Heading",
        condition: { tagName: "h1" },
        action: {
          applyStyleName: "Typography/Heading/H1",
          category: "typography",
        },
        priority: PRIORITY_TAG_ONLY,
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
        priority: PRIORITY_TAG_ONLY,
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
        priority: PRIORITY_TAG_ONLY,
        enabled: true,
        isCustom: false,
      },
      // 本文スタイル
      {
        id: createMappingRuleId("default-p"),
        name: "Paragraph",
        condition: { tagName: "p" },
        action: { applyStyleName: "Typography/Body", category: "typography" },
        priority: PRIORITY_TAG_ONLY,
        enabled: true,
        isCustom: false,
      },
      // リンクスタイル
      {
        id: createMappingRuleId("default-a"),
        name: "Link",
        condition: { tagName: "a" },
        action: { applyStyleName: "Typography/Link", category: "typography" },
        priority: PRIORITY_TAG_ONLY,
        enabled: true,
        isCustom: false,
      },
      // ボタンスタイル（コンポーネント適用: 複合条件優先度）
      {
        id: createMappingRuleId("default-button"),
        name: "Button",
        condition: { tagName: "button" },
        action: { applyComponentName: "Button/Default", category: "layout" },
        priority: PRIORITY_TAG_AND_CLASS,
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

    // this.rulesは常にソート済みの状態で保持されている
    for (const rule of this.rules) {
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

  // TODO(#145): _elementパラメータを使用して、要素の実際の内容（テキスト、属性値の類似性）に基づく
  // 信頼度計算を実装する。現在はルール条件のみで信頼度を算出している。
  // 優先度: 中（AI最適化機能の精度向上に寄与）
  private calculateConfidence(
    rule: MappingRule,
    _element: ElementInfo,
  ): number {
    let confidence = BASE_CONFIDENCE;

    const { condition } = rule;

    // 条件が多いほど信頼度が高い
    if (condition.tagName) {
      confidence += TAG_NAME_WEIGHT;
    }
    if (condition.className) {
      confidence += CLASS_NAME_WEIGHT;
    }
    if (condition.attributes && Object.keys(condition.attributes).length > 0) {
      confidence +=
        ATTRIBUTE_WEIGHT_PER_ITEM * Object.keys(condition.attributes).length;
    }
    if (
      condition.styleCondition &&
      Object.keys(condition.styleCondition).length > 0
    ) {
      confidence +=
        STYLE_CONDITION_WEIGHT_PER_ITEM *
        Object.keys(condition.styleCondition).length;
    }

    // スタイル/コンポーネントが解決できた場合
    const resolvedStyle = this.resolveStyle(rule);
    const resolvedComponent = this.resolveComponent(rule);
    if (resolvedStyle || resolvedComponent) {
      confidence += STYLE_RESOLVED_BONUS;
    }

    return Math.min(confidence, MAX_CONFIDENCE);
  }
}
