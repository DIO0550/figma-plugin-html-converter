/**
 * MCP テスト用ヘルパー
 *
 * テスト間で共通して使用する定数やヘルパー関数を集約する。
 * これにより、各テストファイルでの重複定義を防ぎ、保守性を向上させる。
 */

import type { MCPMessageId, MCPServerUrl } from "../types";

// =============================================================================
// HTTPステータスコード
// =============================================================================

/**
 * HTTPステータスコード定数
 *
 * テストで使用する代表的なHTTPステータスコードを定義。
 * 本番コードでは使用せず、テスト専用とする。
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// =============================================================================
// テスト用定数
// =============================================================================

/** デフォルトのテストタイムアウト（ミリ秒） */
export const TEST_TIMEOUT_MS = 5000;

/** 短いテストタイムアウト（ミリ秒） */
export const SHORT_TIMEOUT_MS = 100;

/** テスト用サーバーURL */
export const TEST_SERVER_URL = "http://localhost:3000" as MCPServerUrl;

/** テスト用メッセージID */
export const TEST_MESSAGE_ID = "test-id" as MCPMessageId;
