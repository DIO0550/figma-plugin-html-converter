/**
 * MCPクライアント
 *
 * MCPサーバーとの接続と通信を管理するメインクライアント
 */
import type {
  MCPClientConfig,
  MCPServerUrl,
  MCPResult,
  MCPResponse,
  MCPError,
  ConnectionState as ConnectionStateType,
  RetryConfig,
} from "../types";
import {
  DEFAULT_TIMEOUT_MS,
  MCP_PROTOCOL_VERSION,
  MCP_METHODS,
} from "../constants";
import { HttpTransport, type HttpTransportState } from "../transport";
import { MCPMessage } from "../message";
import { ConnectionState } from "../connection";
import { RetryLogic, type RetryState } from "../connection/mcp-connection";

/**
 * MCPクライアントの内部状態
 */
export interface MCPClientState {
  /** クライアント設定 */
  config: MCPClientConfig;
  /** トランスポート */
  transport: HttpTransportState;
  /** 接続状態 */
  connectionState: ConnectionStateType;
  /** リトライ状態 */
  retryState: RetryState;
}

/**
 * 初期化レスポンスの型
 */
interface InitializeResult {
  protocolVersion: string;
  capabilities: Record<string, unknown>;
  serverInfo: {
    name: string;
    version: string;
  };
}

/**
 * MCPクライアントのコンパニオンオブジェクト
 */
export const MCPClient = {
  /**
   * MCPクライアントを作成する
   *
   * @param config - クライアント設定
   * @returns MCPクライアント状態
   */
  create(
    config: Partial<MCPClientConfig> & { serverUrl: MCPServerUrl },
  ): MCPClientState {
    const fullConfig: MCPClientConfig = {
      serverUrl: config.serverUrl,
      timeout: config.timeout ?? DEFAULT_TIMEOUT_MS,
      retryConfig: config.retryConfig ?? RetryLogic.getDefaultConfig(),
    };

    return {
      config: fullConfig,
      transport: HttpTransport.create({
        serverUrl: fullConfig.serverUrl,
        timeout: fullConfig.timeout,
      }),
      connectionState: ConnectionState.initial(),
      retryState: RetryLogic.createState(),
    };
  },

  /**
   * MCPサーバーに接続する
   *
   * @param client - MCPクライアント状態
   * @returns 接続結果
   */
  async connect(client: MCPClientState): Promise<MCPResult<InitializeResult>> {
    if (!ConnectionState.canTransition(client.connectionState, "connecting")) {
      return {
        success: false,
        error: createConnectionError("接続を開始できる状態ではありません"),
      };
    }

    client.connectionState = "connecting";

    const request = MCPMessage.createRequest(MCP_METHODS.INITIALIZE, {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: {
        name: "figma-html-converter",
        version: "1.0.0",
      },
    });

    const result = await HttpTransport.send<InitializeResult>(
      client.transport,
      request,
    );

    if (!result.success) {
      client.connectionState = "error";
      client.retryState = RetryLogic.incrementAttempt(
        client.retryState,
        result.error,
      );
      return result;
    }

    if (MCPMessage.isErrorResponse(result.data)) {
      const error: MCPError = {
        code: "SERVER_ERROR",
        message: result.data.error?.message ?? "初期化に失敗しました",
      };
      client.connectionState = "error";
      client.retryState = RetryLogic.incrementAttempt(client.retryState, error);
      return { success: false, error };
    }

    client.connectionState = "connected";
    client.retryState = RetryLogic.reset();

    return {
      success: true,
      data: result.data.result as InitializeResult,
    };
  },

  /**
   * MCPサーバーから切断する
   *
   * @param client - MCPクライアント状態
   */
  disconnect(client: MCPClientState): void {
    if (ConnectionState.canTransition(client.connectionState, "disconnected")) {
      client.connectionState = "disconnected";
    }
  },

  /**
   * MCPリクエストを送信する
   *
   * @param client - MCPクライアント状態
   * @param method - メソッド名
   * @param params - パラメータ
   * @returns レスポンス結果
   */
  async request<T = unknown>(
    client: MCPClientState,
    method: string,
    params?: Record<string, unknown>,
  ): Promise<MCPResult<MCPResponse<T>>> {
    if (!ConnectionState.isConnected(client.connectionState)) {
      return {
        success: false,
        error: createConnectionError("サーバーに接続されていません"),
      };
    }

    const request = MCPMessage.createRequest(method, params);
    return HttpTransport.send<T>(client.transport, request);
  },

  /**
   * リトライ付きでMCPリクエストを送信する
   *
   * @param client - MCPクライアント状態
   * @param method - メソッド名
   * @param params - パラメータ
   * @returns レスポンス結果
   */
  async requestWithRetry<T = unknown>(
    client: MCPClientState,
    method: string,
    params?: Record<string, unknown>,
  ): Promise<MCPResult<MCPResponse<T>>> {
    const retryConfig = client.config.retryConfig as RetryConfig;
    let lastResult: MCPResult<MCPResponse<T>> | null = null;

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      lastResult = await MCPClient.request<T>(client, method, params);

      if (lastResult.success) {
        return lastResult;
      }

      if (!RetryLogic.canRetry(attempt, retryConfig.maxAttempts)) {
        break;
      }

      const delay = RetryLogic.calculateDelay(attempt, retryConfig);
      await RetryLogic.wait(delay);
    }

    return (
      lastResult ?? {
        success: false,
        error: createConnectionError("リクエストに失敗しました"),
      }
    );
  },

  /**
   * 接続状態を取得する
   *
   * @param client - MCPクライアント状態
   * @returns 接続状態
   */
  getState(client: MCPClientState): ConnectionStateType {
    return client.connectionState;
  },

  /**
   * 接続済みかどうかを判定する
   *
   * @param client - MCPクライアント状態
   * @returns 接続済みの場合はtrue
   */
  isConnected(client: MCPClientState): boolean {
    return ConnectionState.isConnected(client.connectionState);
  },

  /**
   * 設定を取得する
   *
   * @param client - MCPクライアント状態
   * @returns クライアント設定
   */
  getConfig(client: MCPClientState): MCPClientConfig {
    return client.config;
  },
};

/**
 * 接続エラーを作成する
 */
function createConnectionError(message: string): MCPError {
  return {
    code: "CONNECTION_FAILED",
    message,
  };
}
