import { it, expect, vi, beforeEach } from "vitest";
import {
  DesignSystemSettingsManager,
  STORAGE_KEY,
} from "../design-system-settings";
import type { DesignSystemSettings, MappingRule } from "../../types";
import {
  createMappingRuleId,
  DEFAULT_DESIGN_SYSTEM_SETTINGS,
} from "../../types";

// Figma clientStorageのモック
const mockStorage: Record<string, unknown> = {};
const mockFigma = {
  clientStorage: {
    getAsync: vi.fn((key: string) => Promise.resolve(mockStorage[key])),
    setAsync: vi.fn((key: string, value: unknown) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    deleteAsync: vi.fn((key: string) => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
  },
};

vi.stubGlobal("figma", mockFigma);

beforeEach(() => {
  vi.clearAllMocks();
  // ストレージをクリア
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
});

it("DesignSystemSettingsManager.create - インスタンスを作成する - マネージャーインスタンスを返す", () => {
  // Act
  const manager = DesignSystemSettingsManager.create();

  // Assert
  expect(manager).toBeInstanceOf(DesignSystemSettingsManager);
});

it("DesignSystemSettingsManager.load - 保存された設定が存在する - 保存された設定を読み込む", async () => {
  // Arrange
  const savedSettings: DesignSystemSettings = {
    ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
    enabled: false,
    autoApply: true,
  };
  mockStorage[STORAGE_KEY] = savedSettings;
  const manager = DesignSystemSettingsManager.create();

  // Act
  const settings = await manager.load();

  // Assert
  expect(settings.enabled).toBe(false);
  expect(settings.autoApply).toBe(true);
});

it("DesignSystemSettingsManager.load - 保存された設定が存在しない - デフォルト設定を返す", async () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();

  // Act
  const settings = await manager.load();

  // Assert
  expect(settings).toEqual(DEFAULT_DESIGN_SYSTEM_SETTINGS);
});

it("DesignSystemSettingsManager.load - 保存されたデータが無効な型 - デフォルト設定を返す", async () => {
  // Arrange
  mockStorage[STORAGE_KEY] = "invalid string";
  const manager = DesignSystemSettingsManager.create();

  // Act
  const settings = await manager.load();

  // Assert
  expect(settings).toEqual(DEFAULT_DESIGN_SYSTEM_SETTINGS);
});

it("DesignSystemSettingsManager.load - 保存されたデータに必須フィールドが欠けている - デフォルト設定を返す", async () => {
  // Arrange
  mockStorage[STORAGE_KEY] = { enabled: true };
  const manager = DesignSystemSettingsManager.create();

  // Act
  const settings = await manager.load();

  // Assert
  expect(settings).toEqual(DEFAULT_DESIGN_SYSTEM_SETTINGS);
});

it("DesignSystemSettingsManager.load - ストレージがエラーをスローする - デフォルト設定を返す", async () => {
  // Arrange
  mockFigma.clientStorage.getAsync.mockRejectedValueOnce(
    new Error("Storage error"),
  );
  const manager = DesignSystemSettingsManager.create();

  // Act
  const settings = await manager.load();

  // Assert
  expect(settings).toEqual(DEFAULT_DESIGN_SYSTEM_SETTINGS);
});

it("DesignSystemSettingsManager.save - 新しい設定を保存する - ストレージに保存する", async () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();
  const newSettings: DesignSystemSettings = {
    ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
    enabled: false,
    minConfidence: 0.8,
  };

  // Act
  await manager.save(newSettings);

  // Assert
  expect(mockFigma.clientStorage.setAsync).toHaveBeenCalledWith(
    STORAGE_KEY,
    newSettings,
  );
});

it("DesignSystemSettingsManager.save - 新しい設定を保存する - 現在の設定を更新する", async () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();
  const newSettings: DesignSystemSettings = {
    ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
    autoApply: true,
  };

  // Act
  await manager.save(newSettings);
  const current = manager.getCurrentSettings();

  // Assert
  expect(current.autoApply).toBe(true);
});

it("DesignSystemSettingsManager.update - 設定を部分的に更新する - 指定したフィールドのみ更新する", async () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();
  await manager.load();

  // Act
  await manager.update({ minConfidence: 0.7 });

  // Assert
  const current = manager.getCurrentSettings();
  expect(current.minConfidence).toBe(0.7);
  expect(current.enabled).toBe(DEFAULT_DESIGN_SYSTEM_SETTINGS.enabled);
});

it("DesignSystemSettingsManager.reset - 設定をリセットする - デフォルト設定に戻す", async () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();
  await manager.save({
    ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
    enabled: false,
    autoApply: true,
    minConfidence: 0.9,
  });

  // Act
  await manager.reset();

  // Assert
  const current = manager.getCurrentSettings();
  expect(current).toEqual(DEFAULT_DESIGN_SYSTEM_SETTINGS);
});

it("DesignSystemSettingsManager.addCustomRule - カスタムルールを追加する - カスタムルールリストに追加される", async () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();
  await manager.load();
  const rule: MappingRule = {
    id: createMappingRuleId("custom-rule"),
    name: "Custom Rule",
    condition: { tagName: "div", className: "custom" },
    action: { applyStyleName: "Custom/Style", category: "color" },
    priority: 50,
    enabled: true,
    isCustom: true,
  };

  // Act
  await manager.addCustomRule(rule);

  // Assert
  const current = manager.getCurrentSettings();
  expect(current.customRules).toHaveLength(1);
  expect(current.customRules[0].name).toBe("Custom Rule");
});

it("DesignSystemSettingsManager.removeCustomRule - カスタムルールを削除する - カスタムルールリストから削除される", async () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();
  const rule: MappingRule = {
    id: createMappingRuleId("custom-rule"),
    name: "Custom Rule",
    condition: { tagName: "div" },
    action: { applyStyleName: "Custom/Style", category: "color" },
    priority: 50,
    enabled: true,
    isCustom: true,
  };
  await manager.save({
    ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
    customRules: [rule],
  });

  // Act
  await manager.removeCustomRule(rule.id);

  // Assert
  const current = manager.getCurrentSettings();
  expect(current.customRules).toHaveLength(0);
});

it("DesignSystemSettingsManager.updateCustomRule - カスタムルールを更新する - 指定したルールのフィールドが更新される", async () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();
  const rule: MappingRule = {
    id: createMappingRuleId("custom-rule"),
    name: "Custom Rule",
    condition: { tagName: "div" },
    action: { applyStyleName: "Custom/Style", category: "color" },
    priority: 50,
    enabled: true,
    isCustom: true,
  };
  await manager.save({
    ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
    customRules: [rule],
  });

  // Act
  await manager.updateCustomRule(rule.id, { priority: 100 });

  // Assert
  const current = manager.getCurrentSettings();
  expect(current.customRules[0].priority).toBe(100);
});

it("DesignSystemSettingsManager.validate - 有効な設定 - バリデーション成功を返す", () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();
  const settings: DesignSystemSettings = {
    enabled: true,
    autoApply: false,
    minConfidence: 0.5,
    useAIOptimization: true,
    customRules: [],
  };

  // Act
  const result = manager.validate(settings);

  // Assert
  expect(result.isValid).toBe(true);
  expect(result.errors).toHaveLength(0);
});

it("DesignSystemSettingsManager.validate - 無効なminConfidence値 - エラーを検出する", () => {
  // Arrange
  const manager = DesignSystemSettingsManager.create();
  const settings: DesignSystemSettings = {
    enabled: true,
    autoApply: false,
    minConfidence: 1.5, // 無効な値
    useAIOptimization: true,
    customRules: [],
  };

  // Act
  const result = manager.validate(settings);

  // Assert
  expect(result.isValid).toBe(false);
  expect(result.errors.some((e) => e.includes("0から1の範囲"))).toBe(true);
});
