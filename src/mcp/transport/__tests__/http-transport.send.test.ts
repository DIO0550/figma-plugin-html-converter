import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { HttpTransport } from "../http-transport";
import type { MCPMessageId } from "../../types";
import {
  TEST_TIMEOUT_MS,
  TEST_SERVER_URL,
  TEST_MESSAGE_ID,
} from "../../__tests__/test-helpers";

const TEST_MESSAGE_ID_2 = "test-id-2" as MCPMessageId;

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

test("有効なリクエストを送信すると、成功レスポンスが返される", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        jsonrpc: "2.0",
        id: TEST_MESSAGE_ID,
        result: { success: true },
      }),
  });

  const transport = HttpTransport.create({
    serverUrl: TEST_SERVER_URL,
    timeout: TEST_TIMEOUT_MS,
  });

  const request = {
    jsonrpc: "2.0" as const,
    id: TEST_MESSAGE_ID,
    method: "test",
  };

  const result = await HttpTransport.send(transport, request);

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.result).toEqual({ success: true });
  }

  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockFetch).toHaveBeenCalledWith(
    TEST_SERVER_URL,
    expect.objectContaining({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }),
  );
});

test("パラメータを含むリクエストを送信すると、パラメータがJSON本文に含まれる", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        jsonrpc: "2.0",
        id: TEST_MESSAGE_ID_2,
        result: { tools: [] },
      }),
  });

  const transport = HttpTransport.create({
    serverUrl: TEST_SERVER_URL,
    timeout: TEST_TIMEOUT_MS,
  });

  const request = {
    jsonrpc: "2.0" as const,
    id: TEST_MESSAGE_ID_2,
    method: "tools/list",
    params: { cursor: "abc" },
  };

  const result = await HttpTransport.send(transport, request);

  expect(result.success).toBe(true);
  expect(mockFetch).toHaveBeenCalledWith(
    TEST_SERVER_URL,
    expect.objectContaining({
      body: JSON.stringify(request),
    }),
  );
});
