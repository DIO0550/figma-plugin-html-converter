import { test, expect, vi, beforeEach } from "vitest";
import { A11yAIAnalyzer } from "../a11y-ai-analyzer";
import type { A11yIssue, A11yAIAnalysis } from "../../types";
import { createA11yIssueId } from "../../types";

// =============================================================================
// テスト用モック
// =============================================================================

function createMockIssue(type: string): A11yIssue {
  return {
    id: createA11yIssueId(`test-${type}`),
    type: "missing-alt-text",
    severity: "error",
    wcagCriterion: "1.1.1",
    target: "html",
    element: { tagName: "img", xpath: "/img" },
    message: "テスト問題",
  };
}

interface MockMcpClient {
  isConnected: () => boolean;
  sendRequest: <T>(
    method: string,
    params: Record<string, unknown>,
  ) => Promise<T>;
}

let analyzer: A11yAIAnalyzer;

beforeEach(() => {
  analyzer = new A11yAIAnalyzer();
});

// =============================================================================
// MCPクライアント未接続時
// =============================================================================

test("MCPクライアント未設定の場合はフォールバック結果を返す", async () => {
  const issues = [createMockIssue("1")];
  const result = await analyzer.analyze(issues);

  expect(result.additionalIssues).toHaveLength(0);
  expect(result.enhancedSuggestions).toHaveLength(0);
  expect(result.confidence).toBe(0);
});

test("MCPクライアントが未接続の場合はフォールバック結果を返す", async () => {
  const mockClient: MockMcpClient = {
    isConnected: () => false,
    sendRequest: vi.fn(),
  };
  analyzer.setMcpClient(mockClient);

  const issues = [createMockIssue("1")];
  const result = await analyzer.analyze(issues);

  expect(result.confidence).toBe(0);
  expect(mockClient.sendRequest).not.toHaveBeenCalled();
});

// =============================================================================
// MCPクライアント接続時
// =============================================================================

test("MCPクライアント接続時にAI分析結果を返す", async () => {
  const mockAnalysis: A11yAIAnalysis = {
    additionalIssues: [],
    enhancedSuggestions: [],
    confidence: 0.85,
  };

  const mockClient: MockMcpClient = {
    isConnected: () => true,
    sendRequest: vi.fn().mockResolvedValue(mockAnalysis),
  };
  analyzer.setMcpClient(mockClient);

  const issues = [createMockIssue("1")];
  const result = await analyzer.analyze(issues);

  expect(result.confidence).toBe(0.85);
  expect(mockClient.sendRequest).toHaveBeenCalledOnce();
});

test("MCPリクエストが失敗した場合はフォールバック結果を返す", async () => {
  const mockClient: MockMcpClient = {
    isConnected: () => true,
    sendRequest: vi.fn().mockRejectedValue(new Error("Connection failed")),
  };
  analyzer.setMcpClient(mockClient);

  const issues = [createMockIssue("1")];
  const result = await analyzer.analyze(issues);

  expect(result.confidence).toBe(0);
  expect(result.additionalIssues).toHaveLength(0);
});

// =============================================================================
// フォールバック
// =============================================================================

test("空の問題リストでも正常に動作する", async () => {
  const result = await analyzer.analyze([]);
  expect(result.additionalIssues).toHaveLength(0);
  expect(result.confidence).toBe(0);
});
