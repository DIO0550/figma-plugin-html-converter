/**
 * SuggestionSettings のテスト
 */
import { describe, test, expect } from "vitest";
import { SuggestionSettingsManager } from "../suggestion-settings";
import type { SuggestionSettings } from "../../types";
import { DEFAULT_SUGGESTION_SETTINGS } from "../../types";

describe("SuggestionSettingsManager", () => {
  describe("getDefaults", () => {
    test("デフォルト設定を取得できる", () => {
      const defaults = SuggestionSettingsManager.getDefaults();

      expect(defaults.enabled).toBe(true);
      expect(defaults.autoShow).toBe(true);
      expect(defaults.minConfidence).toBe(0.5);
      expect(defaults.maxSuggestions).toBe(5);
    });
  });

  describe("create", () => {
    test("カスタム設定で作成できる", () => {
      const settings = SuggestionSettingsManager.create({
        enabled: false,
        minConfidence: 0.8,
      });

      expect(settings.enabled).toBe(false);
      expect(settings.minConfidence).toBe(0.8);
      expect(settings.autoShow).toBe(DEFAULT_SUGGESTION_SETTINGS.autoShow);
    });

    test("空のオブジェクトでデフォルト設定を返す", () => {
      const settings = SuggestionSettingsManager.create({});

      expect(settings).toEqual(DEFAULT_SUGGESTION_SETTINGS);
    });
  });

  describe("validate", () => {
    test("有効な設定はtrueを返す", () => {
      const settings: SuggestionSettings = {
        enabled: true,
        autoShow: true,
        minConfidence: 0.5,
        maxSuggestions: 5,
      };

      expect(SuggestionSettingsManager.validate(settings)).toBe(true);
    });

    test("minConfidenceが範囲外の場合はfalseを返す", () => {
      const settings: SuggestionSettings = {
        enabled: true,
        autoShow: true,
        minConfidence: 1.5, // 範囲外
        maxSuggestions: 5,
      };

      expect(SuggestionSettingsManager.validate(settings)).toBe(false);
    });

    test("minConfidenceが負の場合はfalseを返す", () => {
      const settings: SuggestionSettings = {
        enabled: true,
        autoShow: true,
        minConfidence: -0.1,
        maxSuggestions: 5,
      };

      expect(SuggestionSettingsManager.validate(settings)).toBe(false);
    });

    test("maxSuggestionsが0以下の場合はfalseを返す", () => {
      const settings: SuggestionSettings = {
        enabled: true,
        autoShow: true,
        minConfidence: 0.5,
        maxSuggestions: 0,
      };

      expect(SuggestionSettingsManager.validate(settings)).toBe(false);
    });
  });

  describe("update", () => {
    test("設定を部分的に更新できる", () => {
      const original: SuggestionSettings = {
        enabled: true,
        autoShow: true,
        minConfidence: 0.5,
        maxSuggestions: 5,
      };

      const updated = SuggestionSettingsManager.update(original, {
        enabled: false,
      });

      expect(updated.enabled).toBe(false);
      expect(updated.autoShow).toBe(true);
      expect(updated.minConfidence).toBe(0.5);
      expect(updated.maxSuggestions).toBe(5);
    });
  });

  describe("setEnabled", () => {
    test("enabled設定を更新できる", () => {
      const original = SuggestionSettingsManager.getDefaults();

      const disabled = SuggestionSettingsManager.setEnabled(original, false);
      const enabled = SuggestionSettingsManager.setEnabled(disabled, true);

      expect(disabled.enabled).toBe(false);
      expect(enabled.enabled).toBe(true);
    });
  });

  describe("setAutoShow", () => {
    test("autoShow設定を更新できる", () => {
      const original = SuggestionSettingsManager.getDefaults();

      const updated = SuggestionSettingsManager.setAutoShow(original, false);

      expect(updated.autoShow).toBe(false);
    });
  });

  describe("setMinConfidence", () => {
    test("minConfidence設定を更新できる", () => {
      const original = SuggestionSettingsManager.getDefaults();

      const updated = SuggestionSettingsManager.setMinConfidence(original, 0.8);

      expect(updated.minConfidence).toBe(0.8);
    });

    test("範囲外の値は制限される", () => {
      const original = SuggestionSettingsManager.getDefaults();

      const tooHigh = SuggestionSettingsManager.setMinConfidence(original, 1.5);
      const tooLow = SuggestionSettingsManager.setMinConfidence(original, -0.5);

      expect(tooHigh.minConfidence).toBe(1);
      expect(tooLow.minConfidence).toBe(0);
    });
  });

  describe("setMaxSuggestions", () => {
    test("maxSuggestions設定を更新できる", () => {
      const original = SuggestionSettingsManager.getDefaults();

      const updated = SuggestionSettingsManager.setMaxSuggestions(original, 10);

      expect(updated.maxSuggestions).toBe(10);
    });

    test("1未満の値は1に制限される", () => {
      const original = SuggestionSettingsManager.getDefaults();

      const updated = SuggestionSettingsManager.setMaxSuggestions(original, 0);

      expect(updated.maxSuggestions).toBe(1);
    });
  });

  describe("shouldShowSuggestions", () => {
    test("enabledとautoShowがtrueの場合はtrueを返す", () => {
      const settings: SuggestionSettings = {
        enabled: true,
        autoShow: true,
        minConfidence: 0.5,
        maxSuggestions: 5,
      };

      expect(SuggestionSettingsManager.shouldShowSuggestions(settings)).toBe(
        true,
      );
    });

    test("enabledがfalseの場合はfalseを返す", () => {
      const settings: SuggestionSettings = {
        enabled: false,
        autoShow: true,
        minConfidence: 0.5,
        maxSuggestions: 5,
      };

      expect(SuggestionSettingsManager.shouldShowSuggestions(settings)).toBe(
        false,
      );
    });

    test("autoShowがfalseの場合はfalseを返す", () => {
      const settings: SuggestionSettings = {
        enabled: true,
        autoShow: false,
        minConfidence: 0.5,
        maxSuggestions: 5,
      };

      expect(SuggestionSettingsManager.shouldShowSuggestions(settings)).toBe(
        false,
      );
    });
  });

  describe("toJSON / fromJSON", () => {
    test("JSONへのシリアライズと復元ができる", () => {
      const original: SuggestionSettings = {
        enabled: true,
        autoShow: false,
        minConfidence: 0.7,
        maxSuggestions: 3,
      };

      const json = SuggestionSettingsManager.toJSON(original);
      const restored = SuggestionSettingsManager.fromJSON(json);

      expect(restored).toEqual(original);
    });

    test("不正なJSONはデフォルト設定を返す", () => {
      const invalidJSON = "invalid json";

      const settings = SuggestionSettingsManager.fromJSON(invalidJSON);

      expect(settings).toEqual(DEFAULT_SUGGESTION_SETTINGS);
    });
  });
});
