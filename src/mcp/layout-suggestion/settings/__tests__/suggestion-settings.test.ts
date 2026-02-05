/**
 * SuggestionSettings のテスト
 */
import { it, expect } from "vitest";
import { SuggestionSettingsManager } from "../suggestion-settings";
import type { SuggestionSettings } from "../../types";
import { DEFAULT_SUGGESTION_SETTINGS } from "../../types";

it("SuggestionSettingsManager.getDefaults - デフォルト設定を取得 - デフォルト値を返す", () => {
  const defaults = SuggestionSettingsManager.getDefaults();

  expect(defaults.enabled).toBe(true);
  expect(defaults.autoShow).toBe(true);
  expect(defaults.minConfidence).toBe(0.5);
  expect(defaults.maxSuggestions).toBe(5);
});

it("SuggestionSettingsManager.create - カスタム設定指定 - マージした設定を返す", () => {
  const settings = SuggestionSettingsManager.create({
    enabled: false,
    minConfidence: 0.8,
  });

  expect(settings.enabled).toBe(false);
  expect(settings.minConfidence).toBe(0.8);
  expect(settings.autoShow).toBe(DEFAULT_SUGGESTION_SETTINGS.autoShow);
});

it("SuggestionSettingsManager.create - 空のオブジェクト指定 - デフォルト設定を返す", () => {
  const settings = SuggestionSettingsManager.create({});

  expect(settings).toEqual(DEFAULT_SUGGESTION_SETTINGS);
});

it("SuggestionSettingsManager.validate - 有効な設定 - trueを返す", () => {
  const settings: SuggestionSettings = {
    enabled: true,
    autoShow: true,
    minConfidence: 0.5,
    maxSuggestions: 5,
  };

  expect(SuggestionSettingsManager.validate(settings)).toBe(true);
});

it("SuggestionSettingsManager.validate - minConfidenceが範囲外 - falseを返す", () => {
  const settings: SuggestionSettings = {
    enabled: true,
    autoShow: true,
    minConfidence: 1.5,
    maxSuggestions: 5,
  };

  expect(SuggestionSettingsManager.validate(settings)).toBe(false);
});

it("SuggestionSettingsManager.validate - minConfidenceが負 - falseを返す", () => {
  const settings: SuggestionSettings = {
    enabled: true,
    autoShow: true,
    minConfidence: -0.1,
    maxSuggestions: 5,
  };

  expect(SuggestionSettingsManager.validate(settings)).toBe(false);
});

it("SuggestionSettingsManager.validate - maxSuggestionsが0以下 - falseを返す", () => {
  const settings: SuggestionSettings = {
    enabled: true,
    autoShow: true,
    minConfidence: 0.5,
    maxSuggestions: 0,
  };

  expect(SuggestionSettingsManager.validate(settings)).toBe(false);
});

it("SuggestionSettingsManager.update - 部分的な更新 - 指定したプロパティのみ更新する", () => {
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

it("SuggestionSettingsManager.setEnabled - enabled設定変更 - enabled値を更新する", () => {
  const original = SuggestionSettingsManager.getDefaults();

  const disabled = SuggestionSettingsManager.setEnabled(original, false);
  const enabled = SuggestionSettingsManager.setEnabled(disabled, true);

  expect(disabled.enabled).toBe(false);
  expect(enabled.enabled).toBe(true);
});

it("SuggestionSettingsManager.setAutoShow - autoShow設定変更 - autoShow値を更新する", () => {
  const original = SuggestionSettingsManager.getDefaults();

  const updated = SuggestionSettingsManager.setAutoShow(original, false);

  expect(updated.autoShow).toBe(false);
});

it("SuggestionSettingsManager.setMinConfidence - minConfidence設定変更 - minConfidence値を更新する", () => {
  const original = SuggestionSettingsManager.getDefaults();

  const updated = SuggestionSettingsManager.setMinConfidence(original, 0.8);

  expect(updated.minConfidence).toBe(0.8);
});

it("SuggestionSettingsManager.setMinConfidence - 範囲外の値 - 0-1の範囲に制限する", () => {
  const original = SuggestionSettingsManager.getDefaults();

  const tooHigh = SuggestionSettingsManager.setMinConfidence(original, 1.5);
  const tooLow = SuggestionSettingsManager.setMinConfidence(original, -0.5);

  expect(tooHigh.minConfidence).toBe(1);
  expect(tooLow.minConfidence).toBe(0);
});

it("SuggestionSettingsManager.setMaxSuggestions - maxSuggestions設定変更 - maxSuggestions値を更新する", () => {
  const original = SuggestionSettingsManager.getDefaults();

  const updated = SuggestionSettingsManager.setMaxSuggestions(original, 10);

  expect(updated.maxSuggestions).toBe(10);
});

it("SuggestionSettingsManager.setMaxSuggestions - 1未満の値 - 1に制限する", () => {
  const original = SuggestionSettingsManager.getDefaults();

  const updated = SuggestionSettingsManager.setMaxSuggestions(original, 0);

  expect(updated.maxSuggestions).toBe(1);
});

it("SuggestionSettingsManager.shouldShowSuggestions - enabledとautoShowがtrue - trueを返す", () => {
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

it("SuggestionSettingsManager.shouldShowSuggestions - enabledがfalse - falseを返す", () => {
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

it("SuggestionSettingsManager.shouldShowSuggestions - autoShowがfalse - falseを返す", () => {
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

it("SuggestionSettingsManager.toJSON/fromJSON - 有効な設定 - シリアライズと復元ができる", () => {
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

it("SuggestionSettingsManager.fromJSON - 不正なJSON - デフォルト設定を返す", () => {
  const invalidJSON = "invalid json";

  const settings = SuggestionSettingsManager.fromJSON(invalidJSON);

  expect(settings).toEqual(DEFAULT_SUGGESTION_SETTINGS);
});
