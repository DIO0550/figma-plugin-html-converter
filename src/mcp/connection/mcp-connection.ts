/**
 * MCP接続管理
 *
 * 接続状態とリトライロジックを管理する
 */
import type { RetryConfig, MCPError } from "../types";
import { DEFAULT_RETRY_CONFIG } from "../constants";

/**
 * リトライ状態
 */
export interface RetryState {
  /** リトライ試行回数 */
  attempts: number;
  /** 最後のエラー */
  lastError: MCPError | null;
}

/**
 * リトライロジックのコンパニオンオブジェクト
 */
export const RetryLogic = {
  /**
   * デフォルトのリトライ設定を取得する
   *
   * @returns デフォルトのリトライ設定
   */
  getDefaultConfig(): RetryConfig {
    return { ...DEFAULT_RETRY_CONFIG };
  },

  /**
   * リトライ可能かどうかを判定する
   *
   * @param currentAttempt - 現在の試行回数
   * @param maxAttempts - 最大試行回数
   * @returns リトライ可能な場合はtrue
   */
  canRetry(currentAttempt: number, maxAttempts: number): boolean {
    return currentAttempt < maxAttempts;
  },

  /**
   * リトライ遅延を計算する（指数バックオフ）
   *
   * @param attempt - 試行回数（1から開始）
   * @param config - リトライ設定
   * @returns 遅延時間（ミリ秒）
   */
  calculateDelay(attempt: number, config: RetryConfig): number {
    const delay =
      config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1);
    return Math.min(delay, config.maxDelayMs);
  },

  /**
   * リトライ状態を初期化する
   *
   * @returns 初期リトライ状態
   */
  createState(): RetryState {
    return {
      attempts: 0,
      lastError: null,
    };
  },

  /**
   * リトライ試行回数をインクリメントする
   *
   * @param state - 現在のリトライ状態
   * @param error - 発生したエラー
   * @returns 更新されたリトライ状態
   */
  incrementAttempt(state: RetryState, error: MCPError): RetryState {
    return {
      attempts: state.attempts + 1,
      lastError: error,
    };
  },

  /**
   * リトライ状態をリセットする
   *
   * @param _state - 現在のリトライ状態（未使用）
   * @returns リセットされたリトライ状態
   */
  reset(_state: RetryState): RetryState {
    return {
      attempts: 0,
      lastError: null,
    };
  },

  /**
   * 指定した時間待機する
   *
   * @param ms - 待機時間（ミリ秒）
   * @returns Promise
   */
  async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
