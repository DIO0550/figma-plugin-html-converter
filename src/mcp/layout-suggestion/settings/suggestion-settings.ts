/**
 * ユーザー設定管理
 *
 * 提案機能の設定を管理する
 */
import type { SuggestionSettings } from "../types";
import { DEFAULT_SUGGESTION_SETTINGS } from "../types";

/**
 * 設定管理のコンパニオンオブジェクト
 */
export const SuggestionSettingsManager = {
  /**
   * デフォルト設定を取得する
   *
   * @returns デフォルト設定
   */
  getDefaults(): SuggestionSettings {
    return { ...DEFAULT_SUGGESTION_SETTINGS };
  },

  /**
   * カスタム設定で新しい設定を作成する
   *
   * @param options - 上書きするオプション
   * @returns 設定
   */
  create(options: Partial<SuggestionSettings>): SuggestionSettings {
    return {
      ...DEFAULT_SUGGESTION_SETTINGS,
      ...options,
    };
  },

  /**
   * 設定を検証する
   *
   * 境界条件について:
   * - minConfidence: 0.0〜1.0の範囲（両端を含む）
   *   確率/信頼度を表すため、0%（0.0）から100%（1.0）まで有効
   * - maxSuggestions: 1以上の正の整数
   *   最低1つの提案を表示する必要があるため、0は無効
   *
   * @param settings - 検証する設定
   * @returns 有効な場合はtrue
   */
  validate(settings: SuggestionSettings): boolean {
    if (
      typeof settings.enabled !== "boolean" ||
      typeof settings.autoShow !== "boolean"
    ) {
      return false;
    }

    // minConfidence: 0.0〜1.0（確率として両端を含む）
    if (settings.minConfidence < 0 || settings.minConfidence > 1) {
      return false;
    }

    // maxSuggestions: 1以上（少なくとも1つの提案が必要）
    if (settings.maxSuggestions < 1) {
      return false;
    }

    return true;
  },

  /**
   * 設定を部分的に更新する
   *
   * @param current - 現在の設定
   * @param updates - 更新内容
   * @returns 更新された設定
   */
  update(
    current: SuggestionSettings,
    updates: Partial<SuggestionSettings>,
  ): SuggestionSettings {
    return {
      ...current,
      ...updates,
    };
  },

  /**
   * enabled設定を更新する
   *
   * @param settings - 設定
   * @param enabled - 新しい値
   * @returns 更新された設定
   */
  setEnabled(
    settings: SuggestionSettings,
    enabled: boolean,
  ): SuggestionSettings {
    return { ...settings, enabled };
  },

  /**
   * autoShow設定を更新する
   *
   * @param settings - 設定
   * @param autoShow - 新しい値
   * @returns 更新された設定
   */
  setAutoShow(
    settings: SuggestionSettings,
    autoShow: boolean,
  ): SuggestionSettings {
    return { ...settings, autoShow };
  },

  /**
   * minConfidence設定を更新する
   *
   * @param settings - 設定
   * @param minConfidence - 新しい値（0-1の範囲に制限される）
   * @returns 更新された設定
   */
  setMinConfidence(
    settings: SuggestionSettings,
    minConfidence: number,
  ): SuggestionSettings {
    const clampedValue = Math.max(0, Math.min(1, minConfidence));
    return { ...settings, minConfidence: clampedValue };
  },

  /**
   * maxSuggestions設定を更新する
   *
   * @param settings - 設定
   * @param maxSuggestions - 新しい値（1以上に制限される）
   * @returns 更新された設定
   */
  setMaxSuggestions(
    settings: SuggestionSettings,
    maxSuggestions: number,
  ): SuggestionSettings {
    const clampedValue = Math.max(1, maxSuggestions);
    return { ...settings, maxSuggestions: clampedValue };
  },

  /**
   * 提案を自動表示すべきかどうかを判定する
   *
   * @param settings - 設定
   * @returns 表示すべき場合はtrue
   */
  shouldShowSuggestions(settings: SuggestionSettings): boolean {
    return settings.enabled && settings.autoShow;
  },

  /**
   * 設定をJSON文字列にシリアライズする
   *
   * @param settings - 設定
   * @returns JSON文字列
   */
  toJSON(settings: SuggestionSettings): string {
    return JSON.stringify(settings);
  },

  /**
   * JSON文字列から設定を復元する
   *
   * @param json - JSON文字列
   * @returns 設定（パースに失敗した場合はデフォルト設定）
   */
  fromJSON(json: string): SuggestionSettings {
    try {
      const parsed = JSON.parse(json) as SuggestionSettings;
      if (SuggestionSettingsManager.validate(parsed)) {
        return parsed;
      }
      return SuggestionSettingsManager.getDefaults();
    } catch {
      return SuggestionSettingsManager.getDefaults();
    }
  },
};
