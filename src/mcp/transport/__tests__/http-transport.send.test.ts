import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { HttpTransport } from "../http-transport";
import type { MCPServerUrl, MCPMessageId } from "../../types";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

test("リクエストを送信できる", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        jsonrpc: "2.0",
        id: "test-id",
        result: { success: true },
      }),
  });

  const transport = HttpTransport.create({
    serverUrl: "http://localhost:3000" as MCPServerUrl,
    timeout: 5000,
  });

  const request = {
    jsonrpc: "2.0" as const,
    id: "test-id" as MCPMessageId,
    method: "test",
  };

  const result = await HttpTransport.send(transport, request);

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toEqual({ success: true });
  }

  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockFetch).toHaveBeenCalledWith(
    "http://localhost:3000",
    expect.objectContaining({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }),
  );
});

test("パラメータ付きリクエストを送信できる", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        jsonrpc: "2.0",
        id: "test-id-2",
        result: { tools: [] },
      }),
  });

  const transport = HttpTransport.create({
    serverUrl: "http://localhost:3000" as MCPServerUrl,
    timeout: 5000,
  });

  const request = {
    jsonrpc: "2.0" as const,
    id: "test-id-2" as MCPMessageId,
    method: "tools/list",
    params: { cursor: "abc" },
  };

  const result = await HttpTransport.send(transport, request);

  expect(result.success).toBe(true);
  expect(mockFetch).toHaveBeenCalledWith(
    "http://localhost:3000",
    expect.objectContaining({
      body: JSON.stringify(request),
    }),
  );
});
