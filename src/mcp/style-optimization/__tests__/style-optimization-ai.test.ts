import { test, expect, describe, vi } from "vitest";
import { StyleOptimizationAI } from "../style-optimization-ai";

function createMockClient(connected: boolean, response?: unknown) {
  return {
    isConnected: () => connected,
    sendRequest: vi.fn().mockResolvedValue(response ?? { proposals: [] }),
  };
}

describe("StyleOptimizationAI.requestOptimization", () => {
  test("MCP未接続時は空の提案を返す", async () => {
    const client = createMockClient(false);
    const result = await StyleOptimizationAI.requestOptimization(client, {
      styles: { color: "red" },
    });
    expect(result.proposals).toHaveLength(0);
    expect(result.processingTimeMs).toBe(0);
    expect(client.sendRequest).not.toHaveBeenCalled();
  });

  test("MCP接続時はAI提案を返す", async () => {
    const mockProposals = [
      {
        property: "color",
        suggestion: "use design token",
        reason: "consistency",
        confidence: 0.8,
      },
    ];
    const client = createMockClient(true, { proposals: mockProposals });

    const result = await StyleOptimizationAI.requestOptimization(client, {
      styles: { color: "red" },
    });
    expect(result.proposals).toHaveLength(1);
    expect(result.proposals[0].property).toBe("color");
    expect(result.proposals[0].confidence).toBe(0.8);
    expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
  });

  test("MCP通信エラー時はフォールバック", async () => {
    const client = {
      isConnected: () => true,
      sendRequest: vi.fn().mockRejectedValue(new Error("Connection failed")),
    };

    const result = await StyleOptimizationAI.requestOptimization(client, {
      styles: { color: "red" },
    });
    expect(result.proposals).toHaveLength(0);
    expect(result.processingTimeMs).toBe(0);
  });

  test("不正な提案はフィルタリングされる", async () => {
    const mockProposals = [
      {
        property: "color",
        suggestion: "valid",
        reason: "ok",
        confidence: 0.8,
      },
      {
        property: "",
        suggestion: "invalid - empty property",
        reason: "x",
        confidence: 0.5,
      },
      {
        property: "font",
        suggestion: "invalid - confidence > 1",
        reason: "x",
        confidence: 1.5,
      },
    ];
    const client = createMockClient(true, { proposals: mockProposals });

    const result = await StyleOptimizationAI.requestOptimization(client, {
      styles: {},
    });
    expect(result.proposals).toHaveLength(1);
    expect(result.proposals[0].property).toBe("color");
  });

  test("レスポンスにproposalsがない場合は空配列", async () => {
    const client = createMockClient(true, {});

    const result = await StyleOptimizationAI.requestOptimization(client, {
      styles: {},
    });
    expect(result.proposals).toHaveLength(0);
  });

  test("リクエストにhtmlとcontextを含む", async () => {
    const client = createMockClient(true, { proposals: [] });

    await StyleOptimizationAI.requestOptimization(client, {
      styles: { color: "red" },
      html: "<div>test</div>",
      context: "accessibility",
    });

    expect(client.sendRequest).toHaveBeenCalledWith("tools/call", {
      name: "style-optimization",
      arguments: {
        styles: { color: "red" },
        html: "<div>test</div>",
        context: "accessibility",
      },
    });
  });
});
