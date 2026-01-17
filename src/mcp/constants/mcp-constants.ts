/**
 * MCP関連の定数定義
 */

/**
 * デフォルトのリトライ設定
 */
export const DEFAULT_RETRY_CONFIG = {
  /** 最大リトライ回数 */
  maxAttempts: 3,
  /** 初回リトライまでの待機時間（ミリ秒） */
  initialDelayMs: 1000,
  /** 最大待機時間（ミリ秒） */
  maxDelayMs: 30000,
  /** バックオフ乗数 */
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
  /** JSON形式のContent-Type */
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
  /** 初期化 */
  INITIALIZE: "initialize",
  /** 初期化完了通知 */
  INITIALIZED: "notifications/initialized",
  /** シャットダウン */
  SHUTDOWN: "shutdown",
  /** ツール一覧取得 */
  LIST_TOOLS: "tools/list",
  /** ツール呼び出し */
  CALL_TOOL: "tools/call",
  /** リソース一覧取得 */
  LIST_RESOURCES: "resources/list",
  /** リソース読み取り */
  READ_RESOURCE: "resources/read",
  /** プロンプト一覧取得 */
  LIST_PROMPTS: "prompts/list",
  /** プロンプト取得 */
  GET_PROMPT: "prompts/get",
} as const;

/**
 * デフォルトのサーバーURL（開発用）
 */
export const DEFAULT_SERVER_URL = "http://localhost:3000" as const;

/**
 * メッセージID生成の定数
 *
 * Math.random().toString(36) は "0.xyz..." 形式の文字列を返すため、
 * substring(RANDOM_ID_START, RANDOM_ID_START + RANDOM_ID_LENGTH) で
 * 先頭の "0." を除いたランダムな英数字を取得する
 */
export const MESSAGE_ID_CONFIG = {
  /** 基数36（0-9, a-z）でエンコード */
  BASE36_RADIX: 36,
  /** ランダム部分の開始位置（"0." をスキップするため2から開始） */
  RANDOM_ID_START: 2,
  /** ランダム部分の文字数 */
  RANDOM_ID_LENGTH: 7,
} as const;

/**
 * クライアント情報
 */
export const CLIENT_INFO = {
  /** クライアント名 */
  name: "figma-html-converter",
  /** クライアントバージョン */
  version: "1.0.0",
} as const;
