/**
 * MCP関連の定数定義を集約するバレルファイル
 *
 * プロトコル/接続設定とエラーコードを別ファイルに分離することで責務を分け、
 * それらをこのファイルから一括エクスポートして利用側のimportを単純化している
 */
export {
  DEFAULT_RETRY_CONFIG,
  DEFAULT_TIMEOUT_MS,
  JSONRPC_VERSION,
  MCP_PROTOCOL_VERSION,
  MCP_METHODS,
  DEFAULT_SERVER_URL,
  MESSAGE_ID_CONFIG,
  CLIENT_INFO,
} from "./mcp-constants";

export { ERROR_MESSAGES, JSONRPC_ERROR_CODES } from "./error-codes";
