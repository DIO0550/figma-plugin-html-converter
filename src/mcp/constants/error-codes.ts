/**
 * MCPエラーコード定義
 */

import type { MCPErrorCode } from "../types";

/**
 * エラーコードとメッセージのマッピング
 */
export const ERROR_MESSAGES: Record<MCPErrorCode, string> = {
  CONNECTION_FAILED: "MCPサーバーへの接続に失敗しました",
  CONNECTION_TIMEOUT: "MCPサーバーへの接続がタイムアウトしました",
  REQUEST_TIMEOUT: "リクエストがタイムアウトしました",
  INVALID_RESPONSE: "無効なレスポンスを受信しました",
  SERVER_ERROR: "サーバーエラーが発生しました",
  NETWORK_ERROR: "ネットワークエラーが発生しました",
  SESSION_EXPIRED: "セッションが期限切れです",
};

/**
 * JSON-RPCエラーコード（標準）
 */
export const JSONRPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  SERVER_ERROR_START: -32099,
  SERVER_ERROR_END: -32000,
  UNKNOWN: -1,
} as const;
