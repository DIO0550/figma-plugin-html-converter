import { test, expect } from "vitest";
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

test("DesignSystemMapper.create - デザインシステムを渡す - マッパーインスタンスを作成する", () => {
  // Arrange
  const designSystem = createMockDesignSystem();

  // Act
  const mapper = DesignSystemMapper.create(designSystem);

  // Assert
  expect(mapper).toBeInstanceOf(DesignSystemMapper);
});

test("DesignSystemMapper.addRule - ルールを追加する - ルールリストに追加される", () => {
  // Arrange
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

  // Act
  mapper.addRule(rule);
  const rules = mapper.getRules();

  // Assert
  expect(rules).toContainEqual(rule);
});

test("DesignSystemMapper.removeRule - ルールIDを指定する - ルールが削除される", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const rules = createDefaultRules();
  const mapper = DesignSystemMapper.create(designSystem, rules);
  const ruleId = rules[0].id;

  // Act
  mapper.removeRule(ruleId);

  // Assert
  const remainingRules = mapper.getRules();
  expect(remainingRules.find((r) => r.id === ruleId)).toBeUndefined();
});

test("DesignSystemMapper.matchElement - タグ名でマッチする要素を渡す - マッチするルールを返す", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const rules = createDefaultRules();
  const mapper = DesignSystemMapper.create(designSystem, rules);

  // Act
  const matches = mapper.matchElement({
    tagName: "h1",
    path: "/html/body/h1",
  });

  // Assert
  expect(matches).toHaveLength(1);
  expect(matches[0].rule.name).toBe("H1 Heading Style");
});

test("DesignSystemMapper.matchElement - タグ名とクラス名でマッチする要素を渡す - マッチするルールを返す", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const rules = createDefaultRules();
  const mapper = DesignSystemMapper.create(designSystem, rules);

  // Act
  const matches = mapper.matchElement({
    tagName: "button",
    className: "btn-primary",
    path: "/html/body/button",
  });

  // Assert
  expect(matches).toHaveLength(1);
  expect(matches[0].rule.name).toBe("Primary Button");
});

test("DesignSystemMapper.matchElement - マッチするルールがない要素を渡す - 空配列を返す", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const rules = createDefaultRules();
  const mapper = DesignSystemMapper.create(designSystem, rules);

  // Act
  const matches = mapper.matchElement({
    tagName: "span",
    path: "/html/body/span",
  });

  // Assert
  expect(matches).toHaveLength(0);
});

test("DesignSystemMapper.matchElement - 無効化されたルールが存在する - 無効化されたルールはスキップされる", () => {
  // Arrange
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

  // Act
  const matches = mapper.matchElement({
    tagName: "h1",
    path: "/html/body/h1",
  });

  // Assert
  expect(matches).toHaveLength(0);
});

test("DesignSystemMapper.matchElement - 複数のルールがマッチする要素を渡す - 優先度の高いルールが先に返される", () => {
  // Arrange
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

  // Act
  const matches = mapper.matchElement({
    tagName: "div",
    path: "/html/body/div",
  });

  // Assert
  expect(matches).toHaveLength(2);
  expect(matches[0].rule.name).toBe("High Priority");
});

test("DesignSystemMapper.matchElement - スタイル適用ルールにマッチする要素を渡す - マッチしたスタイルが解決される", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const rules = createDefaultRules();
  const mapper = DesignSystemMapper.create(designSystem, rules);

  // Act
  const matches = mapper.matchElement({
    tagName: "h1",
    path: "/html/body/h1",
  });

  // Assert
  expect(matches[0].appliedStyle).toBeDefined();
  expect(matches[0].appliedStyle?.name).toBe("Typography/Heading/H1");
});

test("DesignSystemMapper.matchElement - コンポーネント適用ルールにマッチする要素を渡す - マッチしたコンポーネントが解決される", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const rules = createDefaultRules();
  const mapper = DesignSystemMapper.create(designSystem, rules);

  // Act
  const matches = mapper.matchElement({
    tagName: "button",
    className: "btn-primary",
    path: "/html/body/button",
  });

  // Assert
  expect(matches[0].appliedComponent).toBeDefined();
  expect(matches[0].appliedComponent?.name).toBe("Button/Primary");
});

test("DesignSystemMapper.mapHtml - 複数のHTML要素を渡す - 各要素のマッピング結果を返す", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const rules = createDefaultRules();
  const mapper = DesignSystemMapper.create(designSystem, rules);
  const elements = [
    { tagName: "h1", path: "/html/body/h1" },
    { tagName: "p", path: "/html/body/p" },
    { tagName: "div", path: "/html/body/div" },
  ];

  // Act
  const result = mapper.mapHtml(elements);

  // Assert
  expect(result.matches).toHaveLength(2); // h1 と p がマッチ
  expect(result.unmatchedElements).toContain("/html/body/div");
});

test("DesignSystemMapper.mapHtml - 全てマッチする複数のHTML要素を渡す - 全要素のマッピング結果を返す", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const rules = createDefaultRules();
  const mapper = DesignSystemMapper.create(designSystem, rules);
  const elements = [
    { tagName: "h1", path: "/html/body/h1" },
    { tagName: "p", path: "/html/body/p[1]" },
    { tagName: "p", path: "/html/body/p[2]" },
  ];

  // Act
  const result = mapper.mapHtml(elements);

  // Assert
  expect(result.matches).toHaveLength(3);
  expect(result.unmatchedElements).toHaveLength(0);
});

test("DesignSystemMapper.matchElement - 属性条件を持つルールと属性がマッチする要素を渡す - マッチするルールを返す", () => {
  // Arrange
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

  // Act
  const matches = mapper.matchElement({
    tagName: "button",
    attributes: { type: "submit" },
    path: "/html/body/form/button",
  });

  // Assert
  expect(matches).toHaveLength(1);
});

test("DesignSystemMapper.matchElement - 属性条件を持つルールと属性が一致しない要素を渡す - マッチしない", () => {
  // Arrange
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

  // Act
  const matches = mapper.matchElement({
    tagName: "button",
    attributes: { type: "button" },
    path: "/html/body/button",
  });

  // Assert
  expect(matches).toHaveLength(0);
});

test("DesignSystemMapper.getDefaultRules - デフォルトルールを取得する - カスタムでないルールのリストを返す", () => {
  // Act
  const rules = DesignSystemMapper.getDefaultRules();

  // Assert
  expect(rules.length).toBeGreaterThan(0);
  expect(rules.every((r) => !r.isCustom)).toBe(true);
});
