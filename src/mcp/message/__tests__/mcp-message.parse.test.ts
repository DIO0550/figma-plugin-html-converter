import { test, expect } from "vitest";
import { MCPMessage } from "../mcp-message";
import type { MCPMessageId } from "../../types";

test("有効なMCPレスポンスをパースできる", () => {
  const rawResponse = {
    jsonrpc: "2.0",
    id: "test-id-123" as MCPMessageId,
    result: { tools: [] },
  };

  const result = MCPMessage.parseResponse(rawResponse);

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.jsonrpc).toBe("2.0");
    expect(result.data.id).toBe("test-id-123");
    expect(result.data.result).toEqual({ tools: [] });
  }
});

test("エラーを含むMCPレスポンスをパースできる", () => {
  const rawResponse = {
    jsonrpc: "2.0",
    id: "test-id-456" as MCPMessageId,
    error: {
      code: -32601,
      message: "Method not found",
    },
  };

  const result = MCPMessage.parseResponse(rawResponse);

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.error).toBeDefined();
    expect(result.data.error?.code).toBe(-32601);
    expect(result.data.error?.message).toBe("Method not found");
  }
});

test("無効なレスポンスでエラーを返す - jsonrpcがない", () => {
  const rawResponse = {
    id: "test-id",
    result: {},
  };

  const result = MCPMessage.parseResponse(rawResponse);

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("INVALID_RESPONSE");
  }
});

test("無効なレスポンスでエラーを返す - idがない", () => {
  const rawResponse = {
    jsonrpc: "2.0",
    result: {},
  };

  const result = MCPMessage.parseResponse(rawResponse);

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("INVALID_RESPONSE");
  }
});

test("nullをパースするとエラーを返す", () => {
  const result = MCPMessage.parseResponse(null);

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe("INVALID_RESPONSE");
  }
});
