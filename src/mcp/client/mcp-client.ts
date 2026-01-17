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
  CLIENT_INFO,
  RETRY_START_ATTEMPT,
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
 *
 * 注: connect/disconnectメソッドは状態を直接変更するミュータブルな設計を採用している。
 * これは、WebSocket接続のような長時間の非同期操作において、呼び出し元が同じ参照で
 * 状態を監視できるようにするため。将来的にイミュータブルな設計に移行する場合は、
 * 状態変更を購読できるコールバック機構の追加を検討する。
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
      clientInfo: CLIENT_INFO,
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

    // リトライ設定が不正な場合は、リトライなしで1回だけリクエストを実行する
    if (!isValidRetryConfig(retryConfig)) {
      return MCPClient.request<T>(client, method, params);
    }

    let lastResult: MCPResult<MCPResponse<T>> = await MCPClient.request<T>(
      client,
      method,
      params,
    );

    if (lastResult.success) {
      return lastResult;
    }

    for (
      let attempt = RETRY_START_ATTEMPT;
      attempt <= retryConfig.maxAttempts;
      attempt++
    ) {
      // calculateDelayは1ベースの試行回数を期待するため、attemptから1を引いて渡す
      // （例: attempt=2のとき、1回目のリトライなので calculateDelay(1) を呼び出す）
      const delay = RetryLogic.calculateDelay(attempt - 1, retryConfig);
      await RetryLogic.wait(delay);

      lastResult = await MCPClient.request<T>(client, method, params);

      if (lastResult.success) {
        return lastResult;
      }
    }

    return lastResult;
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

/**
 * リトライ設定の妥当性を検証する
 */
function isValidRetryConfig(
  config: RetryConfig | undefined,
): config is RetryConfig {
  if (!config) {
    return false;
  }

  return (
    config.maxAttempts >= 1 &&
    config.initialDelayMs > 0 &&
    config.maxDelayMs > 0 &&
    config.backoffMultiplier > 0
  );
}
