/**
 * MCP統合基盤
 *
 * Figmaプラグイン用のMCP (Model Context Protocol) クライアント実装
 *
 * ## 使用方法
 *
 * ```typescript
 * import { MCPClient, DEFAULT_SERVER_URL } from "./mcp";
 *
 * // クライアント作成
 * const client = MCPClient.create({
 *   serverUrl: DEFAULT_SERVER_URL as MCPServerUrl,
 * });
 *
 * // サーバーに接続
 * const result = await MCPClient.connect(client);
 * if (!result.success) {
 *   console.error(result.error);
 *   return;
 * }
 *
 * // リクエスト送信（リトライ付き）
 * const response = await MCPClient.requestWithRetry(client, "tools/list");
 *
 * // 切断
 * MCPClient.disconnect(client);
 * ```
 *
 * ## セットアップ
 *
 * 1. MCPサーバーをlocalhost:3000で起動
 * 2. manifest.jsonのnetworkAccessでlocalhost:3000が許可されていることを確認
 * 3. 上記の使用方法に従ってクライアントを初期化
 *
 * TODO(#143): 統合テストは、専用のテストサーバー環境構築後に対応予定
 * 現在はローカル開発環境でのマニュアルテストで実施
 */

// 型定義
export type {
  MCPMessageId,
  MCPServerUrl,
  ConnectionState as ConnectionStateType,
  MCPResult,
  MCPErrorCode,
  MCPError,
  MCPRequest,
  MCPResponse,
  PluginBridgeMessage,
  RetryConfig,
  MCPClientConfig,
  TransportConfig,
} from "./types";

// 定数
export {
  DEFAULT_RETRY_CONFIG,
  DEFAULT_TIMEOUT_MS,
  JSONRPC_VERSION,
  MCP_PROTOCOL_VERSION,
  MCP_METHODS,
  DEFAULT_SERVER_URL,
  ERROR_MESSAGES,
  JSONRPC_ERROR_CODES,
} from "./constants";

// メッセージング
export { MCPMessage, PluginBridge } from "./message";

// トランスポート
export { HttpTransport } from "./transport";
export type { HttpTransportState } from "./transport";

// 接続管理
export { ConnectionState, RetryLogic } from "./connection";
export type { RetryState } from "./connection";

// クライアント
export { MCPClient } from "./client";
export type { MCPClientState } from "./client";

// フォールバック
export { FallbackHandler } from "./fallback";
export type { FallbackMode, FallbackHandlerState } from "./fallback";
