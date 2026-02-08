/**
 * AIAnalysis のテスト
 */
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { AIAnalysis } from "../ai-analysis";
import type {
  AIAnalysisRequest,
  AIAnalysisResponse,
  LayoutProblem,
} from "../../types";
import { createNodePath } from "../../types";

beforeEach(() => {
  vi.clearAllMocks();
});

test("AIAnalysis.createRequest - HTMLと問題 - AIリクエストを作成する", () => {
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

test("AIAnalysis.createRequest - 追加コンテキスト指定 - リクエストを作成する", () => {
      const html = "<div></div>";
      const problems: LayoutProblem[] = [];
      const context = "モバイルファーストのデザイン";

      const request = AIAnalysis.createRequest(html, problems, context);

  expect(request.context).toBe(context);
});

test("AIAnalysis.parseResponse - AIレスポンス - パースする", () => {
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

test("AIAnalysis.parseResponse - 不正なレスポンス - エラーをスローする", () => {
      const invalidResponse = { invalid: "data" };

  expect(() => AIAnalysis.parseResponse(invalidResponse)).toThrow();
});

test("AIAnalysis.parseResponse - 空の提案リスト - 正常にパースする", () => {
      const response = {
        suggestions: [],
        processingTimeMs: 50,
      };

      const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions).toEqual([]);
});

test("AIAnalysis.parseResponse - 0-1の範囲内のconfidence値 - 保持する", () => {
        const response = {
          suggestions: [
            { problemIndex: 0, suggestion: "test", confidence: 0.5 },
            { problemIndex: 1, suggestion: "test", confidence: 0 },
            { problemIndex: 2, suggestion: "test", confidence: 1 },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].confidence).toBe(0.5);
  expect(parsed.suggestions[1].confidence).toBe(0);
  expect(parsed.suggestions[2].confidence).toBe(1);
});

test("AIAnalysis.parseResponse - 負のconfidence値 - デフォルト値(0.5)に置き換える", () => {
        const response = {
          suggestions: [
            { problemIndex: 0, suggestion: "test", confidence: -0.1 },
            { problemIndex: 1, suggestion: "test", confidence: -1 },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].confidence).toBe(0.5);
  expect(parsed.suggestions[1].confidence).toBe(0.5);
});

test("AIAnalysis.parseResponse - 1を超えるconfidence値 - デフォルト値(0.5)に置き換える", () => {
        const response = {
          suggestions: [
            { problemIndex: 0, suggestion: "test", confidence: 1.1 },
            { problemIndex: 1, suggestion: "test", confidence: 2 },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].confidence).toBe(0.5);
  expect(parsed.suggestions[1].confidence).toBe(0.5);
});

test("AIAnalysis.parseResponse - NaNのconfidence値 - デフォルト値(0.5)に置き換える", () => {
        const response = {
          suggestions: [
            { problemIndex: 0, suggestion: "test", confidence: NaN },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].confidence).toBe(0.5);
});

test("AIAnalysis.parseResponse - confidence値が数値でない - デフォルト値(0.5)になる", () => {
        const response = {
          suggestions: [
            { problemIndex: 0, suggestion: "test", confidence: "0.8" },
            { problemIndex: 1, suggestion: "test", confidence: undefined },
            { problemIndex: 2, suggestion: "test" }, // confidenceなし
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].confidence).toBe(0.5);
  expect(parsed.suggestions[1].confidence).toBe(0.5);
  expect(parsed.suggestions[2].confidence).toBe(0.5);
});

test("AIAnalysis.parseResponse - 正常なrecommendedStyles - 保持する", () => {
        const response = {
          suggestions: [
            {
              problemIndex: 0,
              suggestion: "test",
              confidence: 0.8,
              recommendedStyles: { display: "flex", gap: "10px" },
            },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].recommendedStyles).toEqual({
    display: "flex",
    gap: "10px",
  });
});

test("AIAnalysis.parseResponse - undefinedのrecommendedStyles - undefinedのまま", () => {
        const response = {
          suggestions: [
            { problemIndex: 0, suggestion: "test", confidence: 0.8 },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].recommendedStyles).toBeUndefined();
});

test("AIAnalysis.parseResponse - nullのrecommendedStyles - undefinedに変換する", () => {
        const response = {
          suggestions: [
            {
              problemIndex: 0,
              suggestion: "test",
              confidence: 0.8,
              recommendedStyles: null,
            },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].recommendedStyles).toBeUndefined();
});

test("AIAnalysis.parseResponse - 配列のrecommendedStyles - undefinedに変換する", () => {
        const response = {
          suggestions: [
            {
              problemIndex: 0,
              suggestion: "test",
              confidence: 0.8,
              recommendedStyles: ["display", "flex"],
            },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].recommendedStyles).toBeUndefined();
});

test("AIAnalysis.parseResponse - 非文字列の値を含むrecommendedStyles - 有効なプロパティのみ保持する", () => {
        const response = {
          suggestions: [
            {
              problemIndex: 0,
              suggestion: "test",
              confidence: 0.8,
              recommendedStyles: {
                display: "flex",
                gap: 10, // 数値は無効
                padding: null, // nullは無効
                margin: undefined, // undefinedは無効
              },
            },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].recommendedStyles).toEqual({
    display: "flex",
  });
});

test("AIAnalysis.parseResponse - 空のオブジェクト - undefinedに変換する", () => {
        const response = {
          suggestions: [
            {
              problemIndex: 0,
              suggestion: "test",
              confidence: 0.8,
              recommendedStyles: {},
            },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].recommendedStyles).toBeUndefined();
});

test("AIAnalysis.parseResponse - 全て無効な値のオブジェクト - undefinedに変換する", () => {
        const response = {
          suggestions: [
            {
              problemIndex: 0,
              suggestion: "test",
              confidence: 0.8,
              recommendedStyles: {
                display: 123,
                gap: true,
                padding: {},
              },
            },
          ],
          processingTimeMs: 100,
        };

  const parsed = AIAnalysis.parseResponse(response);

  expect(parsed.suggestions[0].recommendedStyles).toBeUndefined();
});

test("AIAnalysis.mergeWithLocalSuggestions - AIの提案とローカル提案 - マージする", () => {
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

test("AIAnalysis.mergeWithLocalSuggestions - problemIndexが範囲外 - スキップする", () => {
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

test("AIAnalysis.buildMCPRequestParams - AIリクエスト - MCP用のリクエストパラメータを構築する", () => {
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
  expect(typeof params.problems).toBe("string");
});

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
  delete process.env.ENABLE_AI_ANALYSIS;
});

afterEach(() => {
  process.env = originalEnv;
});

test("AIAnalysis.isEnabled - 環境変数が未設定 - falseを返す", () => {
  const isEnabled = AIAnalysis.isEnabled();
  expect(isEnabled).toBe(false);
});

test("AIAnalysis.isEnabled - ENABLE_AI_ANALYSIS=true - trueを返す", () => {
  process.env.ENABLE_AI_ANALYSIS = "true";
  const isEnabled = AIAnalysis.isEnabled();
  expect(isEnabled).toBe(true);
});

test("AIAnalysis.isEnabled - ENABLE_AI_ANALYSIS=false - falseを返す", () => {
  process.env.ENABLE_AI_ANALYSIS = "false";
  const isEnabled = AIAnalysis.isEnabled();
  expect(isEnabled).toBe(false);
});

test("AIAnalysis.isEnabled - ENABLE_AI_ANALYSISが他の値 - falseを返す", () => {
  process.env.ENABLE_AI_ANALYSIS = "1";
  expect(AIAnalysis.isEnabled()).toBe(false);

  process.env.ENABLE_AI_ANALYSIS = "yes";
  expect(AIAnalysis.isEnabled()).toBe(false);

  process.env.ENABLE_AI_ANALYSIS = "TRUE";
  expect(AIAnalysis.isEnabled()).toBe(false);
});

test("AIAnalysis.getDefaultFallback - フォールバックレスポンス - 取得する", () => {
  const fallback = AIAnalysis.getDefaultFallback();

  expect(fallback.suggestions).toEqual([]);
  expect(fallback.processingTimeMs).toBe(0);
});
