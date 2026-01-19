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

    describe("confidence値のバリデーション", () => {
      test("0-1の範囲内のconfidence値は保持される", () => {
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

      test("負のconfidence値はデフォルト値（0.5）に置き換えられる", () => {
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

      test("1を超えるconfidence値はデフォルト値（0.5）に置き換えられる", () => {
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

      test("NaNのconfidence値はデフォルト値（0.5）に置き換えられる", () => {
        const response = {
          suggestions: [
            { problemIndex: 0, suggestion: "test", confidence: NaN },
          ],
          processingTimeMs: 100,
        };

        const parsed = AIAnalysis.parseResponse(response);

        expect(parsed.suggestions[0].confidence).toBe(0.5);
      });

      test("confidence値が数値でない場合はデフォルト値（0.5）になる", () => {
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
    });

    describe("recommendedStylesのバリデーション", () => {
      test("正常なrecommendedStylesは保持される", () => {
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

      test("undefinedのrecommendedStylesはundefinedのまま", () => {
        const response = {
          suggestions: [
            { problemIndex: 0, suggestion: "test", confidence: 0.8 },
          ],
          processingTimeMs: 100,
        };

        const parsed = AIAnalysis.parseResponse(response);

        expect(parsed.suggestions[0].recommendedStyles).toBeUndefined();
      });

      test("nullのrecommendedStylesはundefinedに変換される", () => {
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

      test("配列のrecommendedStylesはundefinedに変換される", () => {
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

      test("非文字列の値を含むrecommendedStylesは有効なプロパティのみ保持される", () => {
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

      test("空のオブジェクトはundefinedに変換される", () => {
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

      test("全て無効な値のオブジェクトはundefinedに変換される", () => {
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

  /**
   * isEnabled のテスト
   *
   * 注: このテストは環境変数を直接操作するため、並列テスト実行時に
   * 他のテストに影響を与える可能性があります。
   * Vitestはデフォルトでファイル間を並列実行しますが、ファイル内のテストは
   * 逐次実行されるため、通常の使用では問題ありません。
   * 将来的に並列化が必要な場合は、vi.stubEnv()の使用を検討してください。
   */
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
