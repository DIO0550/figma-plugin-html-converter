/**
 * トランスポート設定のコンパニオンオブジェクト
 */
import type { TransportConfig, MCPServerUrl } from "../types";
import { DEFAULT_TIMEOUT_MS, DEFAULT_SERVER_URL } from "../constants";

/**
 * トランスポート設定操作のためのコンパニオンオブジェクト
 */
export const TransportConfigUtils = {
  /**
   * デフォルトのトランスポート設定を取得する
   *
   * @returns デフォルトのトランスポート設定
   */
  getDefault(): TransportConfig {
    return {
      serverUrl: DEFAULT_SERVER_URL as MCPServerUrl,
      timeout: DEFAULT_TIMEOUT_MS,
    };
  },

  /**
   * トランスポート設定を作成する
   *
   * @param partial - 部分的な設定
   * @returns 完全なトランスポート設定
   */
  from(partial: Partial<TransportConfig>): TransportConfig {
    const defaults = TransportConfigUtils.getDefault();
    return {
      serverUrl: partial.serverUrl ?? defaults.serverUrl,
      timeout: partial.timeout ?? defaults.timeout,
    };
  },

  /**
   * トランスポート設定をマージする
   *
   * @param base - ベース設定
   * @param override - 上書き設定
   * @returns マージされた設定
   */
  merge(
    base: TransportConfig,
    override: Partial<TransportConfig>,
  ): TransportConfig {
    return {
      serverUrl: override.serverUrl ?? base.serverUrl,
      timeout: override.timeout ?? base.timeout,
    };
  },

  /**
   * トランスポート設定を検証する
   *
   * @param config - 検証対象の設定
   * @returns 有効な場合はtrue
   */
  validate(config: TransportConfig): boolean {
    if (!config.serverUrl || typeof config.serverUrl !== "string") {
      return false;
    }

    if (typeof config.timeout !== "number" || config.timeout <= 0) {
      return false;
    }

    try {
      new URL(config.serverUrl);
      return true;
    } catch {
      return false;
    }
  },
};
