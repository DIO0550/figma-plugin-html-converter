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
 */
export const DEFAULT_TIMEOUT_MS = 30000;

/**
 * 接続タイムアウト（ミリ秒）
 */
export const CONNECTION_TIMEOUT_MS = 10000;

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
 */
export const MESSAGE_ID_CONFIG = {
  /** 基数36（0-9, a-z）でエンコード */
  BASE36_RADIX: 36,
  /** ランダム部分の開始位置 */
  RANDOM_ID_START: 2,
  /** ランダム部分の終了位置 */
  RANDOM_ID_END: 9,
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
