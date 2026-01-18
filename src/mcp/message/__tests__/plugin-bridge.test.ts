import { test, expect } from "vitest";
import { PluginBridge } from "../plugin-bridge";
import type { PluginBridgeMessage, MCPMessageId } from "../../types";

test("接続メッセージを作成できる", () => {
  const message = PluginBridge.createConnectMessage("http://localhost:3000");

  expect(message.type).toBe("mcp-connect");
  if (message.type === "mcp-connect") {
    expect(message.serverUrl).toBe("http://localhost:3000");
  }
});

test("切断メッセージを作成できる", () => {
  const message = PluginBridge.createDisconnectMessage();

  expect(message.type).toBe("mcp-disconnect");
});

test("接続状態メッセージを作成できる", () => {
  const message = PluginBridge.createConnectionStateMessage("connected");

  expect(message.type).toBe("mcp-connection-state");
  if (message.type === "mcp-connection-state") {
    expect(message.state).toBe("connected");
  }
});

test("レスポンスメッセージを作成できる", () => {
  const response = {
    jsonrpc: "2.0" as const,
    id: "test-id" as MCPMessageId,
    result: { data: "test" },
  };
  const message = PluginBridge.createResponseMessage(response);

  expect(message.type).toBe("mcp-response");
  if (message.type === "mcp-response") {
    expect(message.response.id).toBe("test-id");
    expect(message.response.result).toEqual({ data: "test" });
  }
});

test("エラーメッセージを作成できる", () => {
  const error = {
    code: "CONNECTION_FAILED" as const,
    message: "接続に失敗しました",
  };
  const message = PluginBridge.createErrorMessage(error);

  expect(message.type).toBe("mcp-error");
  if (message.type === "mcp-error") {
    expect(message.error.code).toBe("CONNECTION_FAILED");
    expect(message.error.message).toBe("接続に失敗しました");
  }
});

test("有効なプラグインブリッジメッセージを判定できる", () => {
  const validMessage: PluginBridgeMessage = {
    type: "mcp-connect",
    serverUrl: "http://localhost:3000",
  };

  expect(PluginBridge.isPluginBridgeMessage(validMessage)).toBe(true);
});

test("無効なメッセージを判定できる", () => {
  const invalidMessage = { foo: "bar" };

  expect(PluginBridge.isPluginBridgeMessage(invalidMessage)).toBe(false);
});

test("nullは無効なメッセージ", () => {
  expect(PluginBridge.isPluginBridgeMessage(null)).toBe(false);
});

test("接続メッセージかどうかを判定できる", () => {
  const connectMessage: PluginBridgeMessage = {
    type: "mcp-connect",
    serverUrl: "http://localhost:3000",
  };
  const disconnectMessage: PluginBridgeMessage = {
    type: "mcp-disconnect",
  };

  expect(PluginBridge.isConnectMessage(connectMessage)).toBe(true);
  expect(PluginBridge.isConnectMessage(disconnectMessage)).toBe(false);
});
