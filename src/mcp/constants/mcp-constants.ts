/**
 * MCP関連の定数定義
 */

/**
 * デフォルトのリトライ設定
 */
export const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
} as const;

/**
 * デフォルトのタイムアウト設定（ミリ秒）
 *
 * 30秒に設定した理由:
 * - Figmaプラグインのユーザー体験を考慮（長すぎるとUIがフリーズしているように見える）
 * - MCPサーバーの応答時間（ローカルホストでのAI処理を想定）
 * - ネットワーク遅延のバッファを含む
 *
 * 一般的なHTTPリクエストタイムアウトは10-60秒の範囲で設定されることが多く、
 * 30秒はその中間値として妥当な選択である
 */
export const DEFAULT_TIMEOUT_MS = 30000;

/**
 * HTTPヘッダー関連の定数
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE_JSON: "application/json",
} as const;

/**
 * JSON-RPCバージョン
 */
export const JSONRPC_VERSION = "2.0" as const;

/**
 * MCPプロトコルバージョン
 */
export const MCP_PROTOCOL_VERSION = "2024-11-05" as const;

/**
 * MCPメソッド名
 */
export const MCP_METHODS = {
  INITIALIZE: "initialize",
  INITIALIZED: "notifications/initialized",
  SHUTDOWN: "shutdown",
  LIST_TOOLS: "tools/list",
  CALL_TOOL: "tools/call",
  LIST_RESOURCES: "resources/list",
  READ_RESOURCE: "resources/read",
  LIST_PROMPTS: "prompts/list",
  GET_PROMPT: "prompts/get",
} as const;

/**
 * デフォルトのサーバーURL（開発用）
 */
export const DEFAULT_SERVER_URL = "http://localhost:3000" as const;

/**
 * メッセージID生成の定数
 *
 * タイムスタンプ + ランダム値の組み合わせにより、
 * ID衝突を防ぎつつデバッグ時の追跡を容易にする
 */
export const MESSAGE_ID_CONFIG = {
  BASE36_RADIX: 36,
  RANDOM_ID_START: 2,
  RANDOM_ID_LENGTH: 7,
} as const;

/**
 * クライアント情報
 */
export const CLIENT_INFO = {
  name: "figma-html-converter",
  version: "1.0.0",
} as const;
