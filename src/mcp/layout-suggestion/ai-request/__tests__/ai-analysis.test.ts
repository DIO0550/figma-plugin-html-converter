/**
 * AIAnalysis のテスト
 */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { AIAnalysis } from "../ai-analysis";
import type {
  AIAnalysisRequest,
  AIAnalysisResponse,
  LayoutProblem,
} from "../../types";
import { createNodePath } from "../../types";

describe("AIAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createRequest", () => {
    test("AIリクエストを作成できる", () => {
      const html = '<div style="display: block;"><span>Test</span></div>';
      const problems: LayoutProblem[] = [
        {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "Flexコンテナがありません",
        },
      ];

      const request = AIAnalysis.createRequest(html, problems);

      expect(request.html).toBe(html);
      expect(request.problems).toEqual(problems);
      expect(request.context).toBeUndefined();
    });

    test("追加コンテキストを含むリクエストを作成できる", () => {
      const html = "<div></div>";
      const problems: LayoutProblem[] = [];
      const context = "モバイルファーストのデザイン";

      const request = AIAnalysis.createRequest(html, problems, context);

      expect(request.context).toBe(context);
    });
  });

  describe("parseResponse", () => {
    test("AIレスポンスをパースできる", () => {
      const rawResponse = {
        suggestions: [
          {
            problemIndex: 0,
            suggestion: "display: flexを追加してください",
            recommendedStyles: { display: "flex" },
            confidence: 0.9,
          },
        ],
        processingTimeMs: 150,
      };

      const response = AIAnalysis.parseResponse(rawResponse);

      expect(response.suggestions.length).toBe(1);
      expect(response.suggestions[0].suggestion).toBe(
        "display: flexを追加してください",
      );
      expect(response.processingTimeMs).toBe(150);
    });

    test("不正なレスポンスでエラーをスローする", () => {
      const invalidResponse = { invalid: "data" };

      expect(() => AIAnalysis.parseResponse(invalidResponse)).toThrow();
    });

    test("空の提案リストでも正常にパースできる", () => {
      const response = {
        suggestions: [],
        processingTimeMs: 50,
      };

      const parsed = AIAnalysis.parseResponse(response);

      expect(parsed.suggestions).toEqual([]);
    });
  });

  describe("mergeWithLocalSuggestions", () => {
    test("AIの提案をローカル提案とマージできる", () => {
      const problems: LayoutProblem[] = [
        {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "Flexコンテナがありません",
        },
      ];
      const aiResponse: AIAnalysisResponse = {
        suggestions: [
          {
            problemIndex: 0,
            suggestion: "AIからの提案: Flexboxを使用",
            recommendedStyles: { display: "flex" },
            confidence: 0.95,
          },
        ],
        processingTimeMs: 100,
      };

      const merged = AIAnalysis.mergeWithLocalSuggestions(problems, aiResponse);

      expect(merged.length).toBe(1);
      expect(merged[0].suggestion).toContain("AIからの提案");
      expect(merged[0].confidence).toBe(0.95);
    });

    test("problemIndexが範囲外の場合はスキップする", () => {
      const problems: LayoutProblem[] = [
        {
          type: "missing-flex-container",
          severity: "medium",
          location: createNodePath("root > div"),
          description: "Flexコンテナがありません",
        },
      ];
      const aiResponse: AIAnalysisResponse = {
        suggestions: [
          {
            problemIndex: 99, // 範囲外
            suggestion: "無効な提案",
            confidence: 0.9,
          },
        ],
        processingTimeMs: 100,
      };

      const merged = AIAnalysis.mergeWithLocalSuggestions(problems, aiResponse);

      expect(merged.length).toBe(0);
    });
  });

  describe("buildMCPRequestParams", () => {
    test("MCP用のリクエストパラメータを構築できる", () => {
      const request: AIAnalysisRequest = {
        html: "<div></div>",
        problems: [
          {
            type: "missing-flex-container",
            severity: "medium",
            location: createNodePath("root > div"),
            description: "Flexコンテナがありません",
          },
        ],
      };

      const params = AIAnalysis.buildMCPRequestParams(request);

      expect(params.html).toBe(request.html);
      expect(params.problems).toBeDefined();
      expect(typeof params.problems).toBe("string"); // JSON文字列
    });
  });

  describe("isEnabled", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // 各テスト前に環境変数をリセット
      process.env = { ...originalEnv };
      delete process.env.ENABLE_AI_ANALYSIS;
    });

    afterEach(() => {
      // テスト後に環境変数を復元
      process.env = originalEnv;
    });

    test("環境変数が未設定の場合はfalseを返す", () => {
      const isEnabled = AIAnalysis.isEnabled();
      expect(isEnabled).toBe(false);
    });

    test("ENABLE_AI_ANALYSIS=trueの場合はtrueを返す", () => {
      process.env.ENABLE_AI_ANALYSIS = "true";
      const isEnabled = AIAnalysis.isEnabled();
      expect(isEnabled).toBe(true);
    });

    test("ENABLE_AI_ANALYSIS=falseの場合はfalseを返す", () => {
      process.env.ENABLE_AI_ANALYSIS = "false";
      const isEnabled = AIAnalysis.isEnabled();
      expect(isEnabled).toBe(false);
    });

    test("ENABLE_AI_ANALYSISが他の値の場合はfalseを返す", () => {
      process.env.ENABLE_AI_ANALYSIS = "1";
      expect(AIAnalysis.isEnabled()).toBe(false);

      process.env.ENABLE_AI_ANALYSIS = "yes";
      expect(AIAnalysis.isEnabled()).toBe(false);

      process.env.ENABLE_AI_ANALYSIS = "TRUE";
      expect(AIAnalysis.isEnabled()).toBe(false);
    });
  });

  describe("getDefaultFallback", () => {
    test("フォールバックレスポンスを取得できる", () => {
      const fallback = AIAnalysis.getDefaultFallback();

      expect(fallback.suggestions).toEqual([]);
      expect(fallback.processingTimeMs).toBe(0);
    });
  });
});
