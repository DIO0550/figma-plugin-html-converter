import { describe, it, expect, vi, beforeEach } from "vitest";
import { MappingOptimizer } from "../mapping-optimizer";
import type {
  DesignSystem,
  MappingRule,
  AIOptimizationResponse,
  PaintStyleInfo,
  TextStyleInfo,
} from "../../types";
import { createDesignSystemStyleId, createMappingRuleId } from "../../types";

// MCPClientのモック
const mockMcpClient = {
  isConnected: vi.fn(),
  sendRequest: vi.fn(),
};

describe("MappingOptimizer", () => {
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
      } as TextStyleInfo,
    ],
    components: [],
    scannedAt: new Date(),
  });

  const createMockRules = (): MappingRule[] => [
    {
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
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockMcpClient.isConnected.mockReturnValue(true);
  });

  describe("create", () => {
    it("オプティマイザーインスタンスを作成できる", () => {
      // Act
      const optimizer = MappingOptimizer.create();

      // Assert
      expect(optimizer).toBeInstanceOf(MappingOptimizer);
    });
  });

  describe("optimize", () => {
    it("MCP接続時にAI最適化を実行する", async () => {
      // Arrange
      const mockResponse: AIOptimizationResponse = {
        recommendedMappings: [
          {
            elementPath: "/html/body/h1",
            recommendedStyleName: "Typography/Heading/H1",
            reason: "h1要素には見出しスタイルが適切",
            confidence: 0.9,
          },
        ],
        processingTimeMs: 100,
      };
      mockMcpClient.sendRequest.mockResolvedValue(mockResponse);
      const optimizer = MappingOptimizer.create();
      optimizer.setMcpClient(mockMcpClient);

      // Act
      const result = await optimizer.optimize({
        html: "<h1>Hello</h1>",
        designSystem: createMockDesignSystem(),
        currentRules: createMockRules(),
      });

      // Assert
      expect(result.recommendedMappings).toHaveLength(1);
      expect(result.recommendedMappings[0].confidence).toBe(0.9);
    });

    it("MCP未接続時はフォールバック結果を返す", async () => {
      // Arrange
      mockMcpClient.isConnected.mockReturnValue(false);
      const optimizer = MappingOptimizer.create();

      // Act
      const result = await optimizer.optimize({
        html: "<h1>Hello</h1>",
        designSystem: createMockDesignSystem(),
        currentRules: createMockRules(),
      });

      // Assert
      expect(result.recommendedMappings).toHaveLength(0);
      expect(result.processingTimeMs).toBe(0);
    });

    it("MCPリクエストエラー時はフォールバック結果を返す", async () => {
      // Arrange
      mockMcpClient.sendRequest.mockRejectedValue(
        new Error("Connection failed"),
      );
      const optimizer = MappingOptimizer.create();
      optimizer.setMcpClient(mockMcpClient);

      // Act
      const result = await optimizer.optimize({
        html: "<h1>Hello</h1>",
        designSystem: createMockDesignSystem(),
        currentRules: createMockRules(),
      });

      // Assert
      expect(result.recommendedMappings).toHaveLength(0);
    });
  });

  describe("suggestRulesFromHtml", () => {
    it("HTMLからルール候補を提案する", async () => {
      // Arrange
      const mockResponse: AIOptimizationResponse = {
        recommendedMappings: [
          {
            elementPath: "/html/body/div.card",
            recommendedStyleName: "Card/Default",
            reason: "card クラスにはカードスタイルが適切",
            confidence: 0.8,
          },
        ],
        processingTimeMs: 50,
      };
      mockMcpClient.sendRequest.mockResolvedValue(mockResponse);
      const optimizer = MappingOptimizer.create();
      optimizer.setMcpClient(mockMcpClient);

      // Act
      const suggestions = await optimizer.suggestRulesFromHtml(
        '<div class="card">Content</div>',
        createMockDesignSystem(),
      );

      // Assert
      expect(suggestions).toHaveLength(1);
      expect(suggestions[0].recommendedStyleName).toBe("Card/Default");
    });
  });

  describe("analyzeUnmatchedElements", () => {
    it("マッチしなかった要素を分析する", async () => {
      // Arrange
      const mockResponse: AIOptimizationResponse = {
        recommendedMappings: [
          {
            elementPath: "/html/body/article",
            recommendedStyleName: "Container/Article",
            reason: "article要素にはコンテナスタイルを推奨",
            confidence: 0.7,
          },
        ],
        processingTimeMs: 30,
      };
      mockMcpClient.sendRequest.mockResolvedValue(mockResponse);
      const optimizer = MappingOptimizer.create();
      optimizer.setMcpClient(mockMcpClient);

      // Act
      const analysis = await optimizer.analyzeUnmatchedElements(
        ["/html/body/article", "/html/body/aside"],
        "<article>Content</article><aside>Sidebar</aside>",
        createMockDesignSystem(),
      );

      // Assert
      expect(analysis.recommendedMappings.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("validateMapping", () => {
    it("マッピングの妥当性を検証する", async () => {
      // Arrange
      mockMcpClient.sendRequest.mockResolvedValue({
        recommendedMappings: [],
        processingTimeMs: 10,
      });
      const optimizer = MappingOptimizer.create();

      // Act
      const validation = await optimizer.validateMapping(
        { tagName: "h1", path: "/html/body/h1" },
        "Typography/Heading/H1",
        createMockDesignSystem(),
      );

      // Assert
      expect(validation).toHaveProperty("isValid");
      expect(validation).toHaveProperty("confidence");
    });

    it("スタイルが存在する場合は高い信頼度を返す", async () => {
      // Arrange
      const optimizer = MappingOptimizer.create();

      // Act
      const validation = await optimizer.validateMapping(
        { tagName: "h1", path: "/html/body/h1" },
        "Typography/Heading/H1",
        createMockDesignSystem(),
      );

      // Assert
      expect(validation.isValid).toBe(true);
      expect(validation.confidence).toBeGreaterThan(0.5);
    });

    it("スタイルが存在しない場合は低い信頼度を返す", async () => {
      // Arrange
      const optimizer = MappingOptimizer.create();

      // Act
      const validation = await optimizer.validateMapping(
        { tagName: "h1", path: "/html/body/h1" },
        "NonExistent/Style",
        createMockDesignSystem(),
      );

      // Assert
      expect(validation.isValid).toBe(false);
      expect(validation.confidence).toBeLessThan(0.5);
    });
  });
});
