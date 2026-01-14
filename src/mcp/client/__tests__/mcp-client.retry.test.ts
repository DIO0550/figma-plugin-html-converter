import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { MCPClient } from "../mcp-client";
import type { MCPServerUrl, MCPMessageId } from "../../types";
import { RetryLogic } from "../../connection/mcp-connection";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  // waitをモックして即座に解決するようにする
  vi.spyOn(RetryLogic, "wait").mockResolvedValue(undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

/**
 * 接続済みクライアントを作成するヘルパー
 */
async function createConnectedClient() {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        jsonrpc: "2.0",
        id: "init-id" as MCPMessageId,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          serverInfo: { name: "test-server", version: "1.0.0" },
        },
      }),
  });

  const client = MCPClient.create({
    serverUrl: "http://localhost:3000" as MCPServerUrl,
    retryConfig: {
      maxAttempts: 3,
      initialDelayMs: 100,
      maxDelayMs: 1000,
      backoffMultiplier: 2,
    },
  });

  await MCPClient.connect(client);
  return client;
}

test("リトライが成功するケース（最初は失敗、2回目で成功）", async () => {
  // Arrange（準備）
  const client = await createConnectedClient();

  // 1回目: 失敗
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    statusText: "Internal Server Error",
  });

  // 2回目: 成功
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        jsonrpc: "2.0",
        id: "retry-id" as MCPMessageId,
        result: { tools: [] },
      }),
  });

  // Act（実行）
  const result = await MCPClient.requestWithRetry(client, "tools/list");

  // Assert（検証）
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toEqual({ tools: [] });
  }
  // リトライ間の待機が呼ばれたことを確認
  expect(RetryLogic.wait).toHaveBeenCalledTimes(1);
});

test("全てのリトライが失敗するケース", async () => {
  // Arrange（準備）
  const client = await createConnectedClient();

  // 全てのリトライで失敗
  mockFetch
    .mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    })
    .mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    })
    .mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

  // Act（実行）
  const result = await MCPClient.requestWithRetry(client, "tools/list");

  // Assert（検証）
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("SERVER_ERROR");
  }
  // リトライ間の待機が2回呼ばれたことを確認（3回試行、間に2回の待機）
  expect(RetryLogic.wait).toHaveBeenCalledTimes(2);
});

test("リトライ間の遅延が正しく適用されるケース", async () => {
  // Arrange（準備）
  const client = await createConnectedClient();

  // 1回目と2回目: 失敗
  mockFetch
    .mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    })
    .mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

  // 3回目: 成功
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        jsonrpc: "2.0",
        id: "retry-id" as MCPMessageId,
        result: { tools: [] },
      }),
  });

  // Act（実行）
  await MCPClient.requestWithRetry(client, "tools/list");

  // Assert（検証）
  // 初回遅延: 100ms, 2回目遅延: 200ms（指数バックオフ）
  expect(RetryLogic.wait).toHaveBeenNthCalledWith(1, 100);
  expect(RetryLogic.wait).toHaveBeenNthCalledWith(2, 200);
});

test("最大リトライ回数に達した場合の動作", async () => {
  // Arrange（準備）
  const client = await createConnectedClient();

  // maxAttempts=3なので、3回全て失敗
  mockFetch
    .mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    })
    .mockResolvedValueOnce({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
    })
    .mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    });

  // Act（実行）
  const result = await MCPClient.requestWithRetry(client, "tools/list");

  // Assert（検証）
  expect(result.success).toBe(false);
  // 最後のエラーが返されることを確認
  if (!result.success) {
    expect(result.error.code).toBe("SERVER_ERROR");
  }
  // fetchは3回呼ばれる（接続1回 + リトライ3回）
  expect(mockFetch).toHaveBeenCalledTimes(4);
});
