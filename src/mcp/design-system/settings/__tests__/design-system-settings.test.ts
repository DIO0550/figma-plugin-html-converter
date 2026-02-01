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
      const manager = DesignSystemSettingsManager.create();

      expect(manager).toBeInstanceOf(DesignSystemSettingsManager);
    });
  });

  describe("load", () => {
    it("should load saved settings", async () => {
      const savedSettings: DesignSystemSettings = {
        ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
        enabled: false,
        autoApply: true,
      };
      mockStorage[STORAGE_KEY] = savedSettings;
      const manager = DesignSystemSettingsManager.create();

      const settings = await manager.load();

      expect(settings.enabled).toBe(false);
      expect(settings.autoApply).toBe(true);
    });

    it("should return default settings when no saved settings exist", async () => {
      const manager = DesignSystemSettingsManager.create();

      const settings = await manager.load();

      expect(settings).toEqual(DEFAULT_DESIGN_SYSTEM_SETTINGS);
    });
  });

  describe("save", () => {
    it("should save settings", async () => {
      const manager = DesignSystemSettingsManager.create();
      const newSettings: DesignSystemSettings = {
        ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
        enabled: false,
        minConfidence: 0.8,
      };

      await manager.save(newSettings);

      expect(mockFigma.clientStorage.setAsync).toHaveBeenCalledWith(
        STORAGE_KEY,
        newSettings,
      );
    });

    it("should update current settings after save", async () => {
      const manager = DesignSystemSettingsManager.create();
      const newSettings: DesignSystemSettings = {
        ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
        autoApply: true,
      };

      await manager.save(newSettings);
      const current = manager.getCurrentSettings();

      expect(current.autoApply).toBe(true);
    });
  });

  describe("update", () => {
    it("should partially update settings", async () => {
      const manager = DesignSystemSettingsManager.create();
      await manager.load();

      await manager.update({ minConfidence: 0.7 });

      const current = manager.getCurrentSettings();
      expect(current.minConfidence).toBe(0.7);
      expect(current.enabled).toBe(DEFAULT_DESIGN_SYSTEM_SETTINGS.enabled);
    });
  });

  describe("reset", () => {
    it("should reset settings to defaults", async () => {
      const manager = DesignSystemSettingsManager.create();
      await manager.save({
        ...DEFAULT_DESIGN_SYSTEM_SETTINGS,
        enabled: false,
        autoApply: true,
        minConfidence: 0.9,
      });

      await manager.reset();

      const current = manager.getCurrentSettings();
      expect(current).toEqual(DEFAULT_DESIGN_SYSTEM_SETTINGS);
    });
  });

  describe("addCustomRule", () => {
    it("should add custom rule", async () => {
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

      await manager.addCustomRule(rule);

      const current = manager.getCurrentSettings();
      expect(current.customRules).toHaveLength(1);
      expect(current.customRules[0].name).toBe("Custom Rule");
    });
  });

  describe("removeCustomRule", () => {
    it("should remove custom rule", async () => {
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

      await manager.removeCustomRule(rule.id);

      const current = manager.getCurrentSettings();
      expect(current.customRules).toHaveLength(0);
    });
  });

  describe("updateCustomRule", () => {
    it("should update custom rule", async () => {
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

      await manager.updateCustomRule(rule.id, { priority: 100 });

      const current = manager.getCurrentSettings();
      expect(current.customRules[0].priority).toBe(100);
    });
  });

  describe("validate", () => {
    it("should validate valid settings", () => {
      const manager = DesignSystemSettingsManager.create();
      const settings: DesignSystemSettings = {
        enabled: true,
        autoApply: false,
        minConfidence: 0.5,
        useAIOptimization: true,
        customRules: [],
      };

      const result = manager.validate(settings);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect invalid minConfidence", () => {
      const manager = DesignSystemSettingsManager.create();
      const settings: DesignSystemSettings = {
        enabled: true,
        autoApply: false,
        minConfidence: 1.5, // 無効な値
        useAIOptimization: true,
        customRules: [],
      };

      const result = manager.validate(settings);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("0から1の範囲"))).toBe(true);
    });
  });
});
