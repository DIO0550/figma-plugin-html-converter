import { it, expect } from "vitest";
import { DesignSystemApplier } from "../design-system-applier";
import type {
  DesignSystem,
  MappingMatch,
  MappingRule,
  PaintStyleInfo,
  TextStyleInfo,
} from "../../types";
import { createDesignSystemStyleId, createMappingRuleId } from "../../types";

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
      id: createDesignSystemStyleId("S:text-h1"),
      name: "Typography/Heading/H1",
      type: "TEXT",
      key: "key2",
      fontFamily: "Inter",
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 40,
    } as TextStyleInfo,
  ],
  components: [],
  scannedAt: new Date(),
});

const createMockRule = (): MappingRule => ({
  id: createMappingRuleId("rule-h1"),
  name: "H1 Rule",
  condition: { tagName: "h1" },
  action: {
    applyStyleName: "Typography/Heading/H1",
    category: "typography",
  },
  priority: 100,
  enabled: true,
  isCustom: false,
});

const createMockMatch = (designSystem: DesignSystem): MappingMatch => ({
  rule: createMockRule(),
  elementPath: "/html/body/h1",
  appliedStyle: designSystem.styles.find((s) => s.type === "TEXT"),
  confidence: 0.8,
});

it("DesignSystemApplier.create - インスタンス作成 - Applierインスタンスが作成される", () => {
  // Act
  const applier = DesignSystemApplier.create();

  // Assert
  expect(applier).toBeInstanceOf(DesignSystemApplier);
});

it("DesignSystemApplier.applyToFigmaNodeConfig - テキストスタイルのマッチ - FigmaNodeConfigにテキストスタイルが適用される", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const match = createMockMatch(designSystem);
  const applier = DesignSystemApplier.create();

  // Act
  const config = applier.applyToFigmaNodeConfig(match, {
    type: "TEXT",
    name: "h1",
  });

  // Assert
  expect(config.fontSize).toBe(32);
  expect(config.fontWeight).toBe(700);
});

it("DesignSystemApplier.applyToFigmaNodeConfig - ペイントスタイルのマッチ - FigmaNodeConfigにペイントスタイルが適用される", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const match: MappingMatch = {
    rule: {
      ...createMockRule(),
      action: {
        applyStyleName: "Colors/Primary",
        category: "color",
      },
    },
    elementPath: "/html/body/div",
    appliedStyle: designSystem.styles.find((s) => s.type === "PAINT"),
    confidence: 0.8,
  };
  const applier = DesignSystemApplier.create();

  // Act
  const config = applier.applyToFigmaNodeConfig(match, {
    type: "FRAME",
    name: "div",
  });

  // Assert
  expect(config.fills).toBeDefined();
  expect(config.fills).toHaveLength(1);
});

it("DesignSystemApplier.applyToFigmaNodeConfig - スタイル未適用のマッチ - 元の設定をそのまま返す", () => {
  // Arrange
  const match: MappingMatch = {
    rule: createMockRule(),
    elementPath: "/html/body/div",
    appliedStyle: undefined,
    confidence: 0.5,
  };
  const applier = DesignSystemApplier.create();
  const originalConfig = { type: "FRAME" as const, name: "div" };

  // Act
  const config = applier.applyToFigmaNodeConfig(match, originalConfig);

  // Assert
  expect(config).toEqual(originalConfig);
});

it("DesignSystemApplier.applyMatches - 複数のマッチ - すべてのマッチが適用される", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const matches: MappingMatch[] = [
    createMockMatch(designSystem),
    {
      ...createMockMatch(designSystem),
      elementPath: "/html/body/p",
    },
  ];
  const applier = DesignSystemApplier.create();

  // Act
  const result = applier.applyMatches(matches, {
    minConfidence: 0.5,
  });

  // Assert
  expect(result.success).toBe(true);
  expect(result.appliedCount).toBe(2);
  expect(result.skippedCount).toBe(0);
});

it("DesignSystemApplier.applyMatches - 低信頼度のマッチを含む - 低信頼度のマッチはスキップされる", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const matches: MappingMatch[] = [
    { ...createMockMatch(designSystem), confidence: 0.3 },
    { ...createMockMatch(designSystem), confidence: 0.8 },
  ];
  const applier = DesignSystemApplier.create();

  // Act
  const result = applier.applyMatches(matches, {
    minConfidence: 0.5,
  });

  // Assert
  expect(result.appliedCount).toBe(1);
  expect(result.skippedCount).toBe(1);
});

it("DesignSystemApplier.generateCssFromMatch - スタイル適用済みのマッチ - CSS文字列が生成される", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const match = createMockMatch(designSystem);
  const applier = DesignSystemApplier.create();

  // Act
  const css = applier.generateCssFromMatch(match);

  // Assert
  expect(css).toContain("font-family");
  expect(css).toContain("font-size");
});

it("DesignSystemApplier.generateCssFromMatch - スタイル未適用のマッチ - 空文字列が返される", () => {
  // Arrange
  const match: MappingMatch = {
    rule: createMockRule(),
    elementPath: "/html/body/div",
    appliedStyle: undefined,
    confidence: 0.5,
  };
  const applier = DesignSystemApplier.create();

  // Act
  const css = applier.generateCssFromMatch(match);

  // Assert
  expect(css).toBe("");
});

it("DesignSystemApplier.previewApply - マッチのプレビュー - 適用結果のプレビューが生成される", () => {
  // Arrange
  const designSystem = createMockDesignSystem();
  const match = createMockMatch(designSystem);
  const applier = DesignSystemApplier.create();

  // Act
  const preview = applier.previewApply(match);

  // Assert
  expect(preview.elementPath).toBe("/html/body/h1");
  expect(preview.styleName).toBe("Typography/Heading/H1");
  expect(preview.changes).toBeDefined();
});
