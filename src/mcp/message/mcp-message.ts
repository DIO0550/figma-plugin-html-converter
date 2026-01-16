/**
 * MCPメッセージのコンパニオンオブジェクト
 *
 * MCPプロトコルのJSON-RPC 2.0メッセージを生成・パースする
 */
import type {
  MCPMessageId,
  MCPRequest,
  MCPResponse,
  MCPResult,
  MCPError,
} from "../types";
import {
  JSONRPC_VERSION,
  MESSAGE_ID_CONFIG,
  JSONRPC_ERROR_CODES,
} from "../constants";

/**
 * 一意なメッセージIDを生成する
 */
const generateMessageId = (): MCPMessageId => {
  const timestamp = Date.now().toString(MESSAGE_ID_CONFIG.BASE36_RADIX);
  const randomEnd =
    MESSAGE_ID_CONFIG.RANDOM_ID_START + MESSAGE_ID_CONFIG.RANDOM_ID_LENGTH;
  const random = Math.random()
    .toString(MESSAGE_ID_CONFIG.BASE36_RADIX)
    .substring(MESSAGE_ID_CONFIG.RANDOM_ID_START, randomEnd);
  return `${timestamp}-${random}` as MCPMessageId;
};

/**
 * MCPメッセージ操作のためのコンパニオンオブジェクト
 */
export const MCPMessage = {
  /**
   * MCPリクエストを作成する
   *
   * @param method - メソッド名
   * @param params - パラメータ（オプション）
   * @returns MCPリクエストオブジェクト
   */
  createRequest(method: string, params?: Record<string, unknown>): MCPRequest {
    const request: MCPRequest = {
      jsonrpc: JSONRPC_VERSION,
      id: generateMessageId(),
      method,
    };

    if (params !== undefined) {
      request.params = params;
    }

    return request;
  },

  /**
   * 生のレスポンスデータをMCPResponseにパースする
   *
   * @param data - パース対象のデータ
   * @returns パース結果（成功時はMCPResponse、失敗時はMCPError）
   */
  parseResponse<T = unknown>(data: unknown): MCPResult<MCPResponse<T>> {
    if (data === null || data === undefined) {
      return {
        success: false,
        error: createInvalidResponseError(
          "レスポンスがnullまたはundefinedです",
        ),
      };
    }

    if (typeof data !== "object") {
      return {
        success: false,
        error: createInvalidResponseError(
          "レスポンスがオブジェクトではありません",
        ),
      };
    }

    const response = data as Record<string, unknown>;

    if (response.jsonrpc !== "2.0") {
      return {
        success: false,
        error: createInvalidResponseError("jsonrpcバージョンが不正です"),
      };
    }

    if (typeof response.id !== "string" || response.id === "") {
      return {
        success: false,
        error: createInvalidResponseError("メッセージIDが不正です"),
      };
    }

    const mcpResponse: MCPResponse<T> = {
      jsonrpc: "2.0",
      id: response.id as MCPMessageId,
    };

    if ("result" in response) {
      mcpResponse.result = response.result as T;
    }

    if ("error" in response && response.error !== null) {
      const errorObj = response.error as Record<string, unknown>;
      mcpResponse.error = {
        code:
          typeof errorObj.code === "number"
            ? errorObj.code
            : JSONRPC_ERROR_CODES.UNKNOWN,
        message:
          typeof errorObj.message === "string"
            ? errorObj.message
            : "Unknown error",
        data: errorObj.data,
      };
    }

    return {
      success: true,
      data: mcpResponse,
    };
  },

  /**
   * レスポンスがエラーかどうかを判定する
   *
   * @param response - MCPレスポンス
   * @returns エラーの場合はtrue
   */
  isErrorResponse(response: MCPResponse): boolean {
    return response.error !== undefined;
  },

  /**
   * レスポンスが成功かどうかを判定する
   *
   * @param response - MCPレスポンス
   * @returns 成功の場合はtrue
   */
  isSuccessResponse<T>(
    response: MCPResponse<T>,
  ): response is MCPResponse<T> & { result: T } {
    return response.result !== undefined && response.error === undefined;
  },
};

/**
 * 無効なレスポンスエラーを作成する
 */
function createInvalidResponseError(message: string): MCPError {
  return {
    code: "INVALID_RESPONSE",
    message,
  };
}
