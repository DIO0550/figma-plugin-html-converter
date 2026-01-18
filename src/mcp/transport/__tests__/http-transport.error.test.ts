import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { HttpTransport } from "../http-transport";
import {
  HTTP_STATUS,
  TEST_TIMEOUT_MS,
  SHORT_TIMEOUT_MS,
  TEST_SERVER_URL,
  TEST_MESSAGE_ID,
} from "../../__tests__/test-helpers";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

test("ネットワークエラー時にエラーを返す", async () => {
  mockFetch.mockRejectedValueOnce(new Error("Network error"));

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

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("NETWORK_ERROR");
  }
});

test("HTTPエラーステータス時にエラーを返す", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    statusText: "Internal Server Error",
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

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("SERVER_ERROR");
  }
});

test("JSONパースエラー時にエラーを返す", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.reject(new SyntaxError("Unexpected token")),
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

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("INVALID_RESPONSE");
  }
});

test("タイムアウト時にエラーを返す", async () => {
  const abortError = new Error("Aborted");
  abortError.name = "AbortError";
  mockFetch.mockRejectedValueOnce(abortError);

  const transport = HttpTransport.create({
    serverUrl: TEST_SERVER_URL,
    timeout: SHORT_TIMEOUT_MS,
  });

  const request = {
    jsonrpc: "2.0" as const,
    id: TEST_MESSAGE_ID,
    method: "test",
  };

  const result = await HttpTransport.send(transport, request);

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("REQUEST_TIMEOUT");
  }
});
