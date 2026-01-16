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

test("ネットワークエラー時にエラーを返す", async () => {
  mockFetch.mockRejectedValueOnce(new Error("Network error"));

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

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("NETWORK_ERROR");
  }
});

test("HTTPエラーステータス時にエラーを返す", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    statusText: "Internal Server Error",
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
    serverUrl: "http://localhost:3000" as MCPServerUrl,
    timeout: 5000,
  });

  const request = {
    jsonrpc: "2.0" as const,
    id: "test-id" as MCPMessageId,
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
    serverUrl: "http://localhost:3000" as MCPServerUrl,
    timeout: 100,
  });

  const request = {
    jsonrpc: "2.0" as const,
    id: "test-id" as MCPMessageId,
    method: "test",
  };

  const result = await HttpTransport.send(transport, request);

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("REQUEST_TIMEOUT");
  }
});
