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

test("MCPクライアントを作成できる", () => {
  const client = MCPClient.create({
    serverUrl: "http://localhost:3000" as MCPServerUrl,
  });

  expect(client).toBeDefined();
  expect(MCPClient.getState(client)).toBe("disconnected");
});

test("MCPサーバーに接続できる", async () => {
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
  });

  const result = await MCPClient.connect(client);

  expect(result.success).toBe(true);
  expect(MCPClient.getState(client)).toBe("connected");
});

test("接続失敗時にエラーを返す", async () => {
  mockFetch.mockRejectedValueOnce(new Error("Network error"));

  const client = MCPClient.create({
    serverUrl: "http://localhost:3000" as MCPServerUrl,
  });

  const result = await MCPClient.connect(client);

  expect(result.success).toBe(false);
  expect(MCPClient.getState(client)).toBe("error");
});
