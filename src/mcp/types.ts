/**
 * MCP統合基盤の型定義
 */
import type { Brand } from "../types/brand";

// =============================================================================
// Brand型（意味論的型安全性）
// =============================================================================

/**
 * MCPメッセージID
 */
export type MCPMessageId = Brand<string, "MCPMessageId">;

/**
 * MCPサーバーURL
 */
export type MCPServerUrl = Brand<string, "MCPServerUrl">;

// =============================================================================
// 接続状態
// =============================================================================

/**
 * MCP接続状態
 */
export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

// =============================================================================
// 結果型・エラー型
// =============================================================================

/**
 * MCP操作の結果型
 */
export type MCPResult<T> =
  | { success: true; data: T }
  | { success: false; error: MCPError };

/**
 * MCPエラーコード
 */
export type MCPErrorCode =
  | "CONNECTION_FAILED"
  | "CONNECTION_TIMEOUT"
  | "REQUEST_TIMEOUT"
  | "INVALID_RESPONSE"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "SESSION_EXPIRED";

/**
 * MCPエラー
 */
export interface MCPError {
  code: MCPErrorCode;
  message: string;
  details?: unknown;
}

// =============================================================================
// MCPメッセージ（JSON-RPC 2.0ベース）
// =============================================================================

/**
 * MCPリクエスト
 */
export interface MCPRequest {
  jsonrpc: "2.0";
  id: MCPMessageId;
  method: string;
  params?: Record<string, unknown>;
}

/**
 * MCPレスポンス
 */
export interface MCPResponse<T = unknown> {
  jsonrpc: "2.0";
  id: MCPMessageId;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

// =============================================================================
// プラグインブリッジメッセージ（UI ↔ メインスレッド通信）
// =============================================================================

/**
 * プラグインブリッジメッセージ型
 */
export type PluginBridgeMessage =
  | { type: "mcp-connect"; serverUrl: string }
  | { type: "mcp-disconnect" }
  | { type: "mcp-request"; request: MCPRequest }
  | { type: "mcp-connection-state"; state: ConnectionState }
  | { type: "mcp-response"; response: MCPResponse }
  | { type: "mcp-error"; error: MCPError };

// =============================================================================
// 設定
// =============================================================================

/**
 * リトライ設定
 */
export interface RetryConfig {
  /** 最大リトライ回数 */
  maxAttempts: number;
  /** 初回リトライまでの待機時間（ミリ秒） */
  initialDelayMs: number;
  /** 最大待機時間（ミリ秒） */
  maxDelayMs: number;
  /** バックオフ乗数 */
  backoffMultiplier: number;
}

/**
 * MCPクライアント設定
 */
export interface MCPClientConfig {
  /** MCPサーバーURL */
  serverUrl: MCPServerUrl;
  /** リクエストタイムアウト（ミリ秒） */
  timeout?: number;
  /** リトライ設定 */
  retryConfig?: RetryConfig;
}

/**
 * トランスポート設定
 */
export interface TransportConfig {
  /** サーバーURL */
  serverUrl: MCPServerUrl;
  /** タイムアウト（ミリ秒） */
  timeout: number;
}
