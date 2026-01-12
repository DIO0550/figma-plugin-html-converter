/**
 * フォールバックハンドラ
 *
 * MCP接続が利用できない場合のフォールバック処理を管理
 */
import type { MCPResult, MCPError } from "../types";

/**
 * フォールバックモード
 */
export type FallbackMode = "normal" | "offline" | "degraded";

/**
 * フォールバックハンドラの状態
 */
export interface FallbackHandlerState {
  /** 現在のモード */
  mode: FallbackMode;
  /** 自動フォールバックを有効にするか */
  autoFallback: boolean;
  /** 最後のエラー */
  lastError: MCPError | null;
}

/**
 * フォールバックハンドラのコンパニオンオブジェクト
 */
export const FallbackHandler = {
  /**
   * フォールバックハンドラを作成する
   *
   * @returns フォールバックハンドラ状態
   */
  create(): FallbackHandlerState {
    return {
      mode: "normal",
      autoFallback: true,
      lastError: null,
    };
  },

  /**
   * 現在のモードを取得する
   *
   * @param handler - フォールバックハンドラ状態
   * @returns 現在のモード
   */
  getMode(handler: FallbackHandlerState): FallbackMode {
    return handler.mode;
  },

  /**
   * モードを設定する
   *
   * @param handler - フォールバックハンドラ状態
   * @param mode - 新しいモード
   */
  setMode(handler: FallbackHandlerState, mode: FallbackMode): void {
    handler.mode = mode;
  },

  /**
   * 自動フォールバックを設定する
   *
   * @param handler - フォールバックハンドラ状態
   * @param enabled - 有効にするかどうか
   */
  setAutoFallback(handler: FallbackHandlerState, enabled: boolean): void {
    handler.autoFallback = enabled;
  },

  /**
   * MCPが利用可能かどうかを判定する
   *
   * @param handler - フォールバックハンドラ状態
   * @returns 利用可能な場合はtrue
   */
  isMCPAvailable(handler: FallbackHandlerState): boolean {
    return handler.mode !== "offline";
  },

  /**
   * オフラインモードかどうかを判定する
   *
   * @param handler - フォールバックハンドラ状態
   * @returns オフラインモードの場合はtrue
   */
  isOffline(handler: FallbackHandlerState): boolean {
    return handler.mode === "offline";
  },

  /**
   * フォールバック付きで処理を実行する
   *
   * @param handler - フォールバックハンドラ状態
   * @param onlineAction - オンライン時の処理
   * @param fallbackAction - フォールバック処理
   * @returns 処理結果
   */
  async executeWithFallback<T>(
    handler: FallbackHandlerState,
    onlineAction: () => Promise<MCPResult<T>>,
    fallbackAction: () => MCPResult<T>,
  ): Promise<MCPResult<T>> {
    if (handler.mode === "offline") {
      return fallbackAction();
    }

    try {
      return await onlineAction();
    } catch (error) {
      handler.lastError = {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      };

      if (handler.autoFallback) {
        return fallbackAction();
      }

      return {
        success: false,
        error: handler.lastError,
      };
    }
  },

  /**
   * 最後のエラーを取得する
   *
   * @param handler - フォールバックハンドラ状態
   * @returns 最後のエラーまたはnull
   */
  getLastError(handler: FallbackHandlerState): MCPError | null {
    return handler.lastError;
  },

  /**
   * エラーをクリアする
   *
   * @param handler - フォールバックハンドラ状態
   */
  clearError(handler: FallbackHandlerState): void {
    handler.lastError = null;
  },
};
