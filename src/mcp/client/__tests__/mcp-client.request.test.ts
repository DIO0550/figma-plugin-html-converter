import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { MCPClient } from "../mcp-client";
import type { MCPServerUrl, MCPMessageId } from "../../types";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

test("接続済みクライアントでリクエストを送信できる", async () => {
  mockFetch
    .mockResolvedValueOnce({
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
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          jsonrpc: "2.0",
          id: "req-id" as MCPMessageId,
          result: { tools: [] },
        }),
    });

  const client = MCPClient.create({
    serverUrl: "http://localhost:3000" as MCPServerUrl,
  });

  await MCPClient.connect(client);
  const result = await MCPClient.request(client, "tools/list");

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toEqual({ tools: [] });
  }
});

test("未接続クライアントでリクエストを送信するとエラーを返す", async () => {
  const client = MCPClient.create({
    serverUrl: "http://localhost:3000" as MCPServerUrl,
  });

  const result = await MCPClient.request(client, "tools/list");

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("CONNECTION_FAILED");
  }
});
