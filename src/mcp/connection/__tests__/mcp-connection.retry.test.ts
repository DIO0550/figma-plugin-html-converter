import { test, expect } from "vitest";
import { RetryLogic } from "../mcp-connection";
import { DEFAULT_RETRY_CONFIG } from "../../constants";

test("リトライ設定からデフォルト値を取得できる", () => {
  const config = RetryLogic.getDefaultConfig();

  expect(config.maxAttempts).toBe(DEFAULT_RETRY_CONFIG.maxAttempts);
  expect(config.initialDelayMs).toBe(DEFAULT_RETRY_CONFIG.initialDelayMs);
  expect(config.maxDelayMs).toBe(DEFAULT_RETRY_CONFIG.maxDelayMs);
  expect(config.backoffMultiplier).toBe(DEFAULT_RETRY_CONFIG.backoffMultiplier);
});

test("リトライ可能かどうかを判定できる", () => {
  expect(RetryLogic.canRetry(1, 3)).toBe(true);
  expect(RetryLogic.canRetry(2, 3)).toBe(true);
  expect(RetryLogic.canRetry(3, 3)).toBe(false);
  expect(RetryLogic.canRetry(4, 3)).toBe(false);
});

test("リトライ遅延を計算できる（指数バックオフ）", () => {
  const config = {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
  };

  const delay1 = RetryLogic.calculateDelay(1, config);
  const delay2 = RetryLogic.calculateDelay(2, config);
  const delay3 = RetryLogic.calculateDelay(3, config);

  expect(delay1).toBe(1000);
  expect(delay2).toBe(2000);
  expect(delay3).toBe(4000);
});

test("リトライ遅延は最大遅延を超えない", () => {
  const config = {
    maxAttempts: 10,
    initialDelayMs: 10000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
  };

  // 最大遅延に到達する直前の試行
  const delayBeforeMax = RetryLogic.calculateDelay(1, config);
  expect(delayBeforeMax).toBe(10000);
  expect(delayBeforeMax).toBeLessThan(config.maxDelayMs);

  // 最大遅延より小さい値の試行
  const delayAtThreshold = RetryLogic.calculateDelay(2, config);
  expect(delayAtThreshold).toBe(20000);
  expect(delayAtThreshold).toBeLessThan(config.maxDelayMs);

  // 最大遅延を超える試行（キャップされる）
  const delayExceedsMax = RetryLogic.calculateDelay(3, config);
  expect(delayExceedsMax).toBe(config.maxDelayMs);

  // さらに大きな試行回数でもキャップが維持される
  const delay5 = RetryLogic.calculateDelay(5, config);
  expect(delay5).toBe(config.maxDelayMs);
});

test("リトライ状態を初期化できる", () => {
  const state = RetryLogic.createState();

  expect(state.attempts).toBe(0);
  expect(state.lastError).toBeNull();
});

test("リトライ状態を更新できる", () => {
  const state = RetryLogic.createState();
  const error = { code: "NETWORK_ERROR" as const, message: "Test error" };

  const newState = RetryLogic.incrementAttempt(state, error);

  expect(newState.attempts).toBe(1);
  expect(newState.lastError).toEqual(error);
});

test("リトライ状態をリセットできる", () => {
  const resetState = RetryLogic.reset();

  expect(resetState.attempts).toBe(0);
  expect(resetState.lastError).toBeNull();
});
