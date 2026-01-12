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
  /** 不正なJSON */
  PARSE_ERROR: -32700,
  /** 不正なリクエスト */
  INVALID_REQUEST: -32600,
  /** メソッドが見つからない */
  METHOD_NOT_FOUND: -32601,
  /** 不正なパラメータ */
  INVALID_PARAMS: -32602,
  /** 内部エラー */
  INTERNAL_ERROR: -32603,
  /** サーバーエラー範囲の開始 */
  SERVER_ERROR_START: -32099,
  /** サーバーエラー範囲の終了 */
  SERVER_ERROR_END: -32000,
} as const;
