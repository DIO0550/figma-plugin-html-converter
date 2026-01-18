/**
 * HTTPトランスポート
 *
 * fetch APIを使用したMCPサーバーとのHTTP通信を実装
 */
import type {
  TransportConfig,
  MCPRequest,
  MCPResponse,
  MCPResult,
  MCPError,
  MCPServerUrl,
} from "../types";
import { DEFAULT_TIMEOUT_MS, HTTP_HEADERS, ERROR_MESSAGES } from "../constants";
import { MCPMessage } from "../message";

/**
 * HTTPトランスポートの内部状態
 */
export interface HttpTransportState {
  readonly config: TransportConfig;
}

/**
 * HTTPトランスポートのコンパニオンオブジェクト
 */
export const HttpTransport = {
  /**
   * HTTPトランスポートを作成する
   *
   * @param config - トランスポート設定
   * @returns HTTPトランスポート状態
   */
  create(
    config: Partial<TransportConfig> & { serverUrl: MCPServerUrl },
  ): HttpTransportState {
    return {
      config: {
        serverUrl: config.serverUrl,
        timeout: config.timeout ?? DEFAULT_TIMEOUT_MS,
      },
    };
  },

  /**
   * MCPリクエストを送信する
   *
   * @param transport - HTTPトランスポート状態
   * @param request - MCPリクエスト
   * @returns MCPレスポンスまたはエラー
   */
  async send<T = unknown>(
    transport: HttpTransportState,
    request: MCPRequest,
  ): Promise<MCPResult<MCPResponse<T>>> {
    const { config } = transport;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(config.serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": HTTP_HEADERS.CONTENT_TYPE_JSON,
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: createServerError(response.status, response.statusText),
        };
      }

      const data = await response.json();
      return MCPMessage.parseResponse<T>(data);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: createTimeoutError(),
          };
        }

        if (error instanceof SyntaxError) {
          return {
            success: false,
            error: createInvalidResponseError(error.message),
          };
        }

        return {
          success: false,
          error: createNetworkError(error.message),
        };
      }

      return {
        success: false,
        error: createNetworkError("Unknown error"),
      };
    }
  },

  /**
   * トランスポートの設定を取得する
   *
   * @param transport - HTTPトランスポート状態
   * @returns トランスポート設定
   */
  getConfig(transport: HttpTransportState): TransportConfig {
    return transport.config;
  },
};

/**
 * ネットワークエラーを作成する
 */
function createNetworkError(message: string): MCPError {
  return {
    code: "NETWORK_ERROR",
    message: `${ERROR_MESSAGES.NETWORK_ERROR}: ${message}`,
  };
}

/**
 * サーバーエラーを作成する
 */
function createServerError(status: number, statusText: string): MCPError {
  return {
    code: "SERVER_ERROR",
    message: `${ERROR_MESSAGES.SERVER_ERROR}: ${status} ${statusText}`,
    details: { status, statusText },
  };
}

/**
 * タイムアウトエラーを作成する
 */
function createTimeoutError(): MCPError {
  return {
    code: "REQUEST_TIMEOUT",
    message: ERROR_MESSAGES.REQUEST_TIMEOUT,
  };
}

/**
 * 無効なレスポンスエラーを作成する
 */
function createInvalidResponseError(message: string): MCPError {
  return {
    code: "INVALID_RESPONSE",
    message: `${ERROR_MESSAGES.INVALID_RESPONSE}: ${message}`,
  };
}
