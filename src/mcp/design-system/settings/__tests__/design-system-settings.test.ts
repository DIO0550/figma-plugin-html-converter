import { describe, it, expect, vi, beforeEach } from "vitest";
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

describe("DesignSystemSettingsManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // ストレージをクリア
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  });

  describe("create", () => {
    it("should create manager instance", () => {
      // Act
      const manager = DesignSystemSettingsManager.create();

      // Assert
      expect(manager).toBeInstanceOf(DesignSystemSettingsManager);
    });
  });

  describe("load", () => {
    it("should load saved settings", async () => {
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

    it("should return default settings when no saved settings exist", async () => {
      // Arrange
      const manager = DesignSystemSettingsManager.create();

      // Act
      const settings = await manager.load();

      // Assert
      expect(settings).toEqual(DEFAULT_DESIGN_SYSTEM_SETTINGS);
    });
  });

  describe("save", () => {
    it("should save settings", async () => {
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

    it("should update current settings after save", async () => {
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
  });

  describe("update", () => {
    it("should partially update settings", async () => {
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
  });

  describe("reset", () => {
    it("should reset settings to defaults", async () => {
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
  });

  describe("addCustomRule", () => {
    it("should add custom rule", async () => {
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
  });

  describe("removeCustomRule", () => {
    it("should remove custom rule", async () => {
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
  });

  describe("updateCustomRule", () => {
    it("should update custom rule", async () => {
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
  });

  describe("validate", () => {
    it("should validate valid settings", () => {
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

    it("should detect invalid minConfidence", () => {
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
  });
});
