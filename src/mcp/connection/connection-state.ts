/**
 * 接続状態管理のコンパニオンオブジェクト
 */
import type { ConnectionState as ConnectionStateType } from "../types";

/**
 * 有効な状態遷移を定義
 */
const VALID_TRANSITIONS: Record<ConnectionStateType, ConnectionStateType[]> = {
  disconnected: ["connecting"],
  connecting: ["connected", "error", "disconnected"],
  connected: ["disconnected", "reconnecting", "error"],
  reconnecting: ["connected", "error", "disconnected"],
  error: ["disconnected", "connecting"],
};

/**
 * 接続状態操作のためのコンパニオンオブジェクト
 */
export const ConnectionState = {
  /**
   * 初期状態を取得する
   *
   * @returns 初期状態（disconnected）
   */
  initial(): ConnectionStateType {
    return "disconnected";
  },

  /**
   * 状態遷移が可能かどうかを判定する
   *
   * @param from - 現在の状態
   * @param to - 遷移先の状態
   * @returns 遷移可能な場合はtrue
   */
  canTransition(from: ConnectionStateType, to: ConnectionStateType): boolean {
    const validNextStates = VALID_TRANSITIONS[from];
    return validNextStates.includes(to);
  },

  /**
   * 接続済み状態かどうかを判定する
   *
   * @param state - 判定対象の状態
   * @returns 接続済みの場合はtrue
   */
  isConnected(state: ConnectionStateType): boolean {
    return state === "connected";
  },

  /**
   * 接続中状態かどうかを判定する
   *
   * @param state - 判定対象の状態
   * @returns 接続中の場合はtrue
   */
  isConnecting(state: ConnectionStateType): boolean {
    return state === "connecting" || state === "reconnecting";
  },

  /**
   * 切断状態かどうかを判定する
   *
   * @param state - 判定対象の状態
   * @returns 切断状態の場合はtrue
   */
  isDisconnected(state: ConnectionStateType): boolean {
    return state === "disconnected";
  },

  /**
   * エラー状態かどうかを判定する
   *
   * @param state - 判定対象の状態
   * @returns エラー状態の場合はtrue
   */
  isError(state: ConnectionStateType): boolean {
    return state === "error";
  },
};
