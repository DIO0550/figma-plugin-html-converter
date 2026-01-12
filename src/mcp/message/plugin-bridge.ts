/**
 * プラグインブリッジ
 *
 * Figmaプラグインの UI ↔ メインスレッド間通信を管理する
 */
import type {
  PluginBridgeMessage,
  ConnectionState,
  MCPRequest,
  MCPResponse,
  MCPError,
} from "../types";

/**
 * 有効なメッセージタイプ一覧
 */
const VALID_MESSAGE_TYPES = [
  "mcp-connect",
  "mcp-disconnect",
  "mcp-request",
  "mcp-connection-state",
  "mcp-response",
  "mcp-error",
] as const;

/**
 * プラグインブリッジのコンパニオンオブジェクト
 */
export const PluginBridge = {
  /**
   * 接続メッセージを作成する
   *
   * @param serverUrl - MCPサーバーURL
   * @returns 接続メッセージ
   */
  createConnectMessage(serverUrl: string): PluginBridgeMessage {
    return {
      type: "mcp-connect",
      serverUrl,
    };
  },

  /**
   * 切断メッセージを作成する
   *
   * @returns 切断メッセージ
   */
  createDisconnectMessage(): PluginBridgeMessage {
    return {
      type: "mcp-disconnect",
    };
  },

  /**
   * リクエストメッセージを作成する
   *
   * @param request - MCPリクエスト
   * @returns リクエストメッセージ
   */
  createRequestMessage(request: MCPRequest): PluginBridgeMessage {
    return {
      type: "mcp-request",
      request,
    };
  },

  /**
   * 接続状態メッセージを作成する
   *
   * @param state - 接続状態
   * @returns 接続状態メッセージ
   */
  createConnectionStateMessage(state: ConnectionState): PluginBridgeMessage {
    return {
      type: "mcp-connection-state",
      state,
    };
  },

  /**
   * レスポンスメッセージを作成する
   *
   * @param response - MCPレスポンス
   * @returns レスポンスメッセージ
   */
  createResponseMessage(response: MCPResponse): PluginBridgeMessage {
    return {
      type: "mcp-response",
      response,
    };
  },

  /**
   * エラーメッセージを作成する
   *
   * @param error - MCPエラー
   * @returns エラーメッセージ
   */
  createErrorMessage(error: MCPError): PluginBridgeMessage {
    return {
      type: "mcp-error",
      error,
    };
  },

  /**
   * 値がPluginBridgeMessageかどうかを判定する
   *
   * @param value - 判定対象の値
   * @returns PluginBridgeMessageの場合true
   */
  isPluginBridgeMessage(value: unknown): value is PluginBridgeMessage {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value !== "object") {
      return false;
    }

    const obj = value as Record<string, unknown>;

    if (typeof obj.type !== "string") {
      return false;
    }

    return VALID_MESSAGE_TYPES.includes(
      obj.type as (typeof VALID_MESSAGE_TYPES)[number],
    );
  },

  /**
   * 接続メッセージかどうかを判定する
   *
   * @param message - 判定対象のメッセージ
   * @returns 接続メッセージの場合true
   */
  isConnectMessage(
    message: PluginBridgeMessage,
  ): message is Extract<PluginBridgeMessage, { type: "mcp-connect" }> {
    return message.type === "mcp-connect";
  },

  /**
   * 切断メッセージかどうかを判定する
   *
   * @param message - 判定対象のメッセージ
   * @returns 切断メッセージの場合true
   */
  isDisconnectMessage(
    message: PluginBridgeMessage,
  ): message is Extract<PluginBridgeMessage, { type: "mcp-disconnect" }> {
    return message.type === "mcp-disconnect";
  },

  /**
   * リクエストメッセージかどうかを判定する
   *
   * @param message - 判定対象のメッセージ
   * @returns リクエストメッセージの場合true
   */
  isRequestMessage(
    message: PluginBridgeMessage,
  ): message is Extract<PluginBridgeMessage, { type: "mcp-request" }> {
    return message.type === "mcp-request";
  },

  /**
   * 接続状態メッセージかどうかを判定する
   *
   * @param message - 判定対象のメッセージ
   * @returns 接続状態メッセージの場合true
   */
  isConnectionStateMessage(
    message: PluginBridgeMessage,
  ): message is Extract<PluginBridgeMessage, { type: "mcp-connection-state" }> {
    return message.type === "mcp-connection-state";
  },

  /**
   * レスポンスメッセージかどうかを判定する
   *
   * @param message - 判定対象のメッセージ
   * @returns レスポンスメッセージの場合true
   */
  isResponseMessage(
    message: PluginBridgeMessage,
  ): message is Extract<PluginBridgeMessage, { type: "mcp-response" }> {
    return message.type === "mcp-response";
  },

  /**
   * エラーメッセージかどうかを判定する
   *
   * @param message - 判定対象のメッセージ
   * @returns エラーメッセージの場合true
   */
  isErrorMessage(
    message: PluginBridgeMessage,
  ): message is Extract<PluginBridgeMessage, { type: "mcp-error" }> {
    return message.type === "mcp-error";
  },
};
