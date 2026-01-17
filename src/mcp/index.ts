/**
 * MCP統合基盤
 *
 * Figmaプラグイン用のMCP (Model Context Protocol) クライアント実装
 *
 * TODO: 統合テスト（実際のMCPサーバーとの通信テスト）は、
 * ローカル開発環境でのマニュアルテストで実施する。
 * CIでの自動実行は、専用のテストサーバー環境構築後に対応予定。
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
