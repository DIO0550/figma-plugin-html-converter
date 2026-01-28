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
    } catch {
      this.currentSettings = { ...DEFAULT_DESIGN_SYSTEM_SETTINGS };
    }
    return this.currentSettings;
  }

  /**
   * 設定を保存する
   */
  async save(settings: DesignSystemSettings): Promise<void> {
    await figma.clientStorage.setAsync(STORAGE_KEY, settings);
    this.currentSettings = { ...settings };
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
    if (settings.minConfidence < 0 || settings.minConfidence > 1) {
      errors.push("minConfidence must be between 0 and 1");
    }

    // カスタムルールの検証
    for (const rule of settings.customRules) {
      if (!rule.id) {
        errors.push("Custom rule must have an id");
      }
      if (!rule.name) {
        errors.push("Custom rule must have a name");
      }
      if (!rule.condition) {
        errors.push("Custom rule must have a condition");
      }
      if (!rule.action) {
        errors.push("Custom rule must have an action");
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
