import { describe, it, expect } from "vitest";
import { DesignSystemMapper } from "../design-system-mapper";
import type {
  DesignSystem,
  MappingRule,
  PaintStyleInfo,
  TextStyleInfo,
  DesignSystemComponent,
} from "../../types";
import {
  createDesignSystemStyleId,
  createDesignSystemComponentId,
  createMappingRuleId,
} from "../../types";

// =============================================================================
// テストデータ用の定数
// =============================================================================

/** テスト用タイポグラフィ - 見出しフォントサイズ */
const TEST_HEADING_FONT_SIZE = 32;
/** テスト用タイポグラフィ - 見出し行高さ */
const TEST_HEADING_LINE_HEIGHT = 40;
/** テスト用タイポグラフィ - 見出しフォントウェイト */
const TEST_HEADING_FONT_WEIGHT = 700;
/** テスト用タイポグラフィ - 本文フォントサイズ */
const TEST_BODY_FONT_SIZE = 16;
/** テスト用タイポグラフィ - 本文行高さ */
const TEST_BODY_LINE_HEIGHT = 24;
/** テスト用タイポグラフィ - 本文フォントウェイト */
const TEST_BODY_FONT_WEIGHT = 400;

/** テスト用ルール優先度 - 低 */
const TEST_PRIORITY_LOW = 50;
/** テスト用ルール優先度 - 標準 */
const TEST_PRIORITY_NORMAL = 100;
/** テスト用ルール優先度 - 高 */
const TEST_PRIORITY_HIGH = 200;

describe("DesignSystemMapper", () => {
  // テストデータのファクトリ
  const createMockDesignSystem = (): DesignSystem => ({
    styles: [
      {
        id: createDesignSystemStyleId("S:paint-primary"),
        name: "Colors/Primary",
        type: "PAINT",
        key: "key1",
        paints: [{ type: "SOLID", color: { r: 0, g: 0.4, b: 1 }, opacity: 1 }],
      } as PaintStyleInfo,
      {
        id: createDesignSystemStyleId("S:paint-secondary"),
        name: "Colors/Secondary",
        type: "PAINT",
        key: "key2",
        paints: [
          { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 }, opacity: 1 },
        ],
      } as PaintStyleInfo,
      {
        id: createDesignSystemStyleId("S:text-h1"),
        name: "Typography/Heading/H1",
        type: "TEXT",
        key: "key3",
        fontFamily: "Inter",
        fontSize: TEST_HEADING_FONT_SIZE,
        fontWeight: TEST_HEADING_FONT_WEIGHT,
        lineHeight: TEST_HEADING_LINE_HEIGHT,
      } as TextStyleInfo,
      {
        id: createDesignSystemStyleId("S:text-body"),
        name: "Typography/Body",
        type: "TEXT",
        key: "key4",
        fontFamily: "Inter",
        fontSize: TEST_BODY_FONT_SIZE,
        fontWeight: TEST_BODY_FONT_WEIGHT,
        lineHeight: TEST_BODY_LINE_HEIGHT,
      } as TextStyleInfo,
    ],
    components: [
      {
        id: createDesignSystemComponentId("C:button-primary"),
        name: "Button/Primary",
        key: "comp-key1",
        properties: [{ name: "label", type: "TEXT", defaultValue: "Button" }],
      } as DesignSystemComponent,
    ],
    scannedAt: new Date(),
  });

  const createDefaultRules = (): MappingRule[] => [
    {
      id: createMappingRuleId("rule-h1"),
      name: "H1 Heading Style",
      condition: { tagName: "h1" },
      action: {
        applyStyleName: "Typography/Heading/H1",
        category: "typography",
      },
      priority: TEST_PRIORITY_NORMAL,
      enabled: true,
      isCustom: false,
    },
    {
      id: createMappingRuleId("rule-p"),
      name: "Paragraph Style",
      condition: { tagName: "p" },
      action: {
        applyStyleName: "Typography/Body",
        category: "typography",
      },
      priority: TEST_PRIORITY_NORMAL,
      enabled: true,
      isCustom: false,
    },
    {
      id: createMappingRuleId("rule-btn-primary"),
      name: "Primary Button",
      condition: { tagName: "button", className: "btn-primary" },
      action: {
        applyComponentName: "Button/Primary",
        category: "layout",
      },
      priority: TEST_PRIORITY_HIGH,
      enabled: true,
      isCustom: false,
    },
  ];

  describe("create", () => {
    it("should create mapper instance", () => {
      const designSystem = createMockDesignSystem();

      const mapper = DesignSystemMapper.create(designSystem);

      expect(mapper).toBeInstanceOf(DesignSystemMapper);
    });
  });

  describe("addRule", () => {
    it("should add a rule", () => {
      const designSystem = createMockDesignSystem();
      const mapper = DesignSystemMapper.create(designSystem);
      const rule: MappingRule = {
        id: createMappingRuleId("rule-custom"),
        name: "Custom Rule",
        condition: { tagName: "div", className: "custom" },
        action: { applyStyleName: "Colors/Primary", category: "color" },
        priority: TEST_PRIORITY_LOW,
        enabled: true,
        isCustom: true,
      };

      mapper.addRule(rule);
      const rules = mapper.getRules();

      expect(rules).toContainEqual(rule);
    });
  });

  describe("removeRule", () => {
    it("should remove a rule", () => {
      const designSystem = createMockDesignSystem();
      const rules = createDefaultRules();
      const mapper = DesignSystemMapper.create(designSystem, rules);
      const ruleId = rules[0].id;

      mapper.removeRule(ruleId);

      const remainingRules = mapper.getRules();
      expect(remainingRules.find((r) => r.id === ruleId)).toBeUndefined();
    });
  });

  describe("matchElement", () => {
    it("should match element by tag name", () => {
      const designSystem = createMockDesignSystem();
      const rules = createDefaultRules();
      const mapper = DesignSystemMapper.create(designSystem, rules);

      const matches = mapper.matchElement({
        tagName: "h1",
        path: "/html/body/h1",
      });

      expect(matches).toHaveLength(1);
      expect(matches[0].rule.name).toBe("H1 Heading Style");
    });

    it("should match element by tag name and class name", () => {
      const designSystem = createMockDesignSystem();
      const rules = createDefaultRules();
      const mapper = DesignSystemMapper.create(designSystem, rules);

      const matches = mapper.matchElement({
        tagName: "button",
        className: "btn-primary",
        path: "/html/body/button",
      });

      expect(matches).toHaveLength(1);
      expect(matches[0].rule.name).toBe("Primary Button");
    });

    it("should return empty array when no rules match", () => {
      const designSystem = createMockDesignSystem();
      const rules = createDefaultRules();
      const mapper = DesignSystemMapper.create(designSystem, rules);

      const matches = mapper.matchElement({
        tagName: "span",
        path: "/html/body/span",
      });

      expect(matches).toHaveLength(0);
    });

    it("should skip disabled rules", () => {
      const designSystem = createMockDesignSystem();
      const rules: MappingRule[] = [
        {
          id: createMappingRuleId("rule-disabled"),
          name: "Disabled Rule",
          condition: { tagName: "h1" },
          action: {
            applyStyleName: "Typography/Heading/H1",
            category: "typography",
          },
          priority: TEST_PRIORITY_NORMAL,
          enabled: false,
          isCustom: false,
        },
      ];
      const mapper = DesignSystemMapper.create(designSystem, rules);

      const matches = mapper.matchElement({
        tagName: "h1",
        path: "/html/body/h1",
      });

      expect(matches).toHaveLength(0);
    });

    it("should match higher priority rules first", () => {
      const designSystem = createMockDesignSystem();
      const rules: MappingRule[] = [
        {
          id: createMappingRuleId("rule-low"),
          name: "Low Priority",
          condition: { tagName: "div" },
          action: { applyStyleName: "Colors/Secondary", category: "color" },
          priority: TEST_PRIORITY_LOW,
          enabled: true,
          isCustom: false,
        },
        {
          id: createMappingRuleId("rule-high"),
          name: "High Priority",
          condition: { tagName: "div" },
          action: { applyStyleName: "Colors/Primary", category: "color" },
          priority: TEST_PRIORITY_NORMAL,
          enabled: true,
          isCustom: false,
        },
      ];
      const mapper = DesignSystemMapper.create(designSystem, rules);

      const matches = mapper.matchElement({
        tagName: "div",
        path: "/html/body/div",
      });

      expect(matches).toHaveLength(2);
      expect(matches[0].rule.name).toBe("High Priority");
    });

    it("should resolve matched style", () => {
      const designSystem = createMockDesignSystem();
      const rules = createDefaultRules();
      const mapper = DesignSystemMapper.create(designSystem, rules);

      const matches = mapper.matchElement({
        tagName: "h1",
        path: "/html/body/h1",
      });

      expect(matches[0].appliedStyle).toBeDefined();
      expect(matches[0].appliedStyle?.name).toBe("Typography/Heading/H1");
    });

    it("should resolve matched component", () => {
      const designSystem = createMockDesignSystem();
      const rules = createDefaultRules();
      const mapper = DesignSystemMapper.create(designSystem, rules);

      const matches = mapper.matchElement({
        tagName: "button",
        className: "btn-primary",
        path: "/html/body/button",
      });

      expect(matches[0].appliedComponent).toBeDefined();
      expect(matches[0].appliedComponent?.name).toBe("Button/Primary");
    });
  });

  describe("mapHtml", () => {
    it("should map HTML element list", () => {
      const designSystem = createMockDesignSystem();
      const rules = createDefaultRules();
      const mapper = DesignSystemMapper.create(designSystem, rules);
      const elements = [
        { tagName: "h1", path: "/html/body/h1" },
        { tagName: "p", path: "/html/body/p" },
        { tagName: "div", path: "/html/body/div" },
      ];

      const result = mapper.mapHtml(elements);

      expect(result.matches).toHaveLength(2); // h1 と p がマッチ
      expect(result.unmatchedElements).toContain("/html/body/div");
    });

    it("should return mapping results for multiple elements", () => {
      const designSystem = createMockDesignSystem();
      const rules = createDefaultRules();
      const mapper = DesignSystemMapper.create(designSystem, rules);
      const elements = [
        { tagName: "h1", path: "/html/body/h1" },
        { tagName: "p", path: "/html/body/p[1]" },
        { tagName: "p", path: "/html/body/p[2]" },
      ];

      const result = mapper.mapHtml(elements);

      expect(result.matches).toHaveLength(3);
      expect(result.unmatchedElements).toHaveLength(0);
    });
  });

  describe("attribute condition matching", () => {
    it("should match element by attributes", () => {
      const designSystem = createMockDesignSystem();
      const rules: MappingRule[] = [
        {
          id: createMappingRuleId("rule-submit"),
          name: "Submit Button",
          condition: {
            tagName: "button",
            attributes: { type: "submit" },
          },
          action: { applyStyleName: "Colors/Primary", category: "color" },
          priority: TEST_PRIORITY_NORMAL,
          enabled: true,
          isCustom: false,
        },
      ];
      const mapper = DesignSystemMapper.create(designSystem, rules);

      const matches = mapper.matchElement({
        tagName: "button",
        attributes: { type: "submit" },
        path: "/html/body/form/button",
      });

      expect(matches).toHaveLength(1);
    });

    it("should not match when attributes do not match", () => {
      const designSystem = createMockDesignSystem();
      const rules: MappingRule[] = [
        {
          id: createMappingRuleId("rule-submit"),
          name: "Submit Button",
          condition: {
            tagName: "button",
            attributes: { type: "submit" },
          },
          action: { applyStyleName: "Colors/Primary", category: "color" },
          priority: TEST_PRIORITY_NORMAL,
          enabled: true,
          isCustom: false,
        },
      ];
      const mapper = DesignSystemMapper.create(designSystem, rules);

      const matches = mapper.matchElement({
        tagName: "button",
        attributes: { type: "button" },
        path: "/html/body/button",
      });

      expect(matches).toHaveLength(0);
    });
  });

  describe("getDefaultRules", () => {
    it("should return default rules", () => {
      const rules = DesignSystemMapper.getDefaultRules();

      expect(rules.length).toBeGreaterThan(0);
      expect(rules.every((r) => !r.isCustom)).toBe(true);
    });
  });
});
