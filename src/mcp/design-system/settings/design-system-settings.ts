/**
 * デザインシステム設定管理
 *
 * デザインシステム機能の設定を管理し、
 * Figma clientStorageに永続化する。
 */
import type {
  DesignSystemSettings,
  MappingRule,
  MappingRuleId,
} from "../types";
import { DEFAULT_DESIGN_SYSTEM_SETTINGS } from "../types";

/**
 * ストレージキー
 */
export const STORAGE_KEY = "design-system-settings";

// =============================================================================
// バリデーション定数
// =============================================================================

/** 信頼度の最小値 */
const MIN_CONFIDENCE_VALUE = 0;
/** 信頼度の最大値 */
const MAX_CONFIDENCE_VALUE = 1;

/**
 * 検証結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * デザインシステム設定マネージャークラス
 */
export class DesignSystemSettingsManager {
  private currentSettings: DesignSystemSettings;

  private constructor() {
    this.currentSettings = { ...DEFAULT_DESIGN_SYSTEM_SETTINGS };
  }

  /**
   * マネージャーインスタンスを作成する
   */
  static create(): DesignSystemSettingsManager {
    return new DesignSystemSettingsManager();
  }

  /**
   * 設定を読み込む
   */
  async load(): Promise<DesignSystemSettings> {
    try {
      const saved = await figma.clientStorage.getAsync(STORAGE_KEY);
      if (saved && this.isValidSettings(saved)) {
        this.currentSettings = saved as DesignSystemSettings;
      } else {
        this.currentSettings = { ...DEFAULT_DESIGN_SYSTEM_SETTINGS };
      }
    } catch (error) {
      console.warn(
        "[DesignSystemSettingsManager] 設定の読み込みに失敗、デフォルト設定を使用:",
        error instanceof Error ? error.message : error,
      );
      this.currentSettings = { ...DEFAULT_DESIGN_SYSTEM_SETTINGS };
    }
    return this.currentSettings;
  }

  /**
   * 設定を保存する
   */
  async save(settings: DesignSystemSettings): Promise<void> {
    try {
      await figma.clientStorage.setAsync(STORAGE_KEY, settings);
      this.currentSettings = { ...settings };
    } catch (error) {
      console.error(
        "[DesignSystemSettingsManager] 設定の保存に失敗:",
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  /**
   * 設定を部分的に更新する
   */
  async update(partial: Partial<DesignSystemSettings>): Promise<void> {
    const newSettings = {
      ...this.currentSettings,
      ...partial,
    };
    await this.save(newSettings);
  }

  /**
   * 設定をデフォルトにリセットする
   */
  async reset(): Promise<void> {
    await this.save({ ...DEFAULT_DESIGN_SYSTEM_SETTINGS });
  }

  /**
   * 現在の設定を取得する
   */
  getCurrentSettings(): DesignSystemSettings {
    return { ...this.currentSettings };
  }

  /**
   * カスタムルールを追加する
   */
  async addCustomRule(rule: MappingRule): Promise<void> {
    const newRules = [...this.currentSettings.customRules, rule];
    await this.update({ customRules: newRules });
  }

  /**
   * カスタムルールを削除する
   */
  async removeCustomRule(ruleId: MappingRuleId): Promise<void> {
    const newRules = this.currentSettings.customRules.filter(
      (rule) => rule.id !== ruleId,
    );
    await this.update({ customRules: newRules });
  }

  /**
   * カスタムルールを更新する
   */
  async updateCustomRule(
    ruleId: MappingRuleId,
    updates: Partial<MappingRule>,
  ): Promise<void> {
    const newRules = this.currentSettings.customRules.map((rule) =>
      rule.id === ruleId ? { ...rule, ...updates } : rule,
    );
    await this.update({ customRules: newRules });
  }

  /**
   * 設定を検証する
   */
  validate(settings: DesignSystemSettings): ValidationResult {
    const errors: string[] = [];

    // minConfidenceの検証
    if (
      settings.minConfidence < MIN_CONFIDENCE_VALUE ||
      settings.minConfidence > MAX_CONFIDENCE_VALUE
    ) {
      errors.push("minConfidenceは0から1の範囲で指定してください");
    }

    // カスタムルールの検証
    for (const rule of settings.customRules) {
      if (!rule.id) {
        errors.push("カスタムルールにはIDが必要です");
      }
      if (!rule.name) {
        errors.push("カスタムルールには名前が必要です");
      }
      if (!rule.condition) {
        errors.push("カスタムルールには条件が必要です");
      }
      if (!rule.action) {
        errors.push("カスタムルールにはアクションが必要です");
      }
      if (rule.priority !== undefined && rule.priority < 0) {
        errors.push("カスタムルールの優先度は0以上で指定してください");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private isValidSettings(obj: unknown): boolean {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }

    const settings = obj as Record<string, unknown>;

    return (
      typeof settings.enabled === "boolean" &&
      typeof settings.autoApply === "boolean" &&
      typeof settings.minConfidence === "number" &&
      typeof settings.useAIOptimization === "boolean" &&
      Array.isArray(settings.customRules)
    );
  }
}
