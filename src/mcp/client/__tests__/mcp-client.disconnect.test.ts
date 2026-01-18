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

test("接続済みクライアントを切断できる", async () => {
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

  await MCPClient.connect(client);
  expect(MCPClient.getState(client)).toBe("connected");

  MCPClient.disconnect(client);
  expect(MCPClient.getState(client)).toBe("disconnected");
});

test("未接続クライアントの切断は状態を変更しない", () => {
  const client = MCPClient.create({
    serverUrl: "http://localhost:3000" as MCPServerUrl,
  });

  expect(MCPClient.getState(client)).toBe("disconnected");

  MCPClient.disconnect(client);
  expect(MCPClient.getState(client)).toBe("disconnected");
});
