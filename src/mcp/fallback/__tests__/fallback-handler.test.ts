import { test, expect } from "vitest";
import { FallbackHandler } from "../fallback-handler";

test("フォールバックハンドラを作成できる", () => {
  const handler = FallbackHandler.create();

  expect(handler).toBeDefined();
  expect(FallbackHandler.getMode(handler)).toBe("normal");
});

test("オフラインモードに切り替えできる", () => {
  const handler = FallbackHandler.create();

  FallbackHandler.setMode(handler, "offline");

  expect(FallbackHandler.getMode(handler)).toBe("offline");
});

test("オンラインに戻れる", () => {
  const handler = FallbackHandler.create();

  FallbackHandler.setMode(handler, "offline");
  expect(FallbackHandler.getMode(handler)).toBe("offline");

  FallbackHandler.setMode(handler, "normal");
  expect(FallbackHandler.getMode(handler)).toBe("normal");
});

test("オフライン時にフォールバック処理が実行される", async () => {
  const handler = FallbackHandler.create();
  FallbackHandler.setMode(handler, "offline");

  const result = await FallbackHandler.executeWithFallback(
    handler,
    async () => ({ success: true, data: "online-result" }),
    () => ({ success: true, data: "fallback-result" }),
  );

  expect(result).toEqual({ success: true, data: "fallback-result" });
});

test("オンライン時に通常処理が実行される", async () => {
  const handler = FallbackHandler.create();
  FallbackHandler.setMode(handler, "normal");

  const result = await FallbackHandler.executeWithFallback(
    handler,
    async () => ({ success: true, data: "online-result" }),
    () => ({ success: true, data: "fallback-result" }),
  );

  expect(result).toEqual({ success: true, data: "online-result" });
});

test("オンライン処理が失敗した場合にフォールバック処理が実行される", async () => {
  const handler = FallbackHandler.create();
  FallbackHandler.setMode(handler, "normal");
  FallbackHandler.setAutoFallback(handler, true);

  const result = await FallbackHandler.executeWithFallback(
    handler,
    async () => {
      throw new Error("Network error");
    },
    () => ({ success: true, data: "fallback-result" }),
  );

  expect(result).toEqual({ success: true, data: "fallback-result" });
});

test("自動フォールバックが無効の場合はエラーを返す", async () => {
  const handler = FallbackHandler.create();
  FallbackHandler.setMode(handler, "normal");
  FallbackHandler.setAutoFallback(handler, false);

  const result = await FallbackHandler.executeWithFallback(
    handler,
    async () => {
      throw new Error("Network error");
    },
    () => ({ success: true, data: "fallback-result" }),
  );

  expect(result.success).toBe(false);
});

test("MCPが利用可能かどうかを判定できる", () => {
  const handler = FallbackHandler.create();

  expect(FallbackHandler.isMCPAvailable(handler)).toBe(true);

  FallbackHandler.setMode(handler, "offline");
  expect(FallbackHandler.isMCPAvailable(handler)).toBe(false);

  FallbackHandler.setMode(handler, "degraded");
  expect(FallbackHandler.isMCPAvailable(handler)).toBe(true);
});

test("オンライン処理がMCPResult形式のエラーを返した場合にフォールバック処理が実行される", async () => {
  // Arrange（準備）
  const handler = FallbackHandler.create();
  FallbackHandler.setMode(handler, "normal");
  FallbackHandler.setAutoFallback(handler, true);

  // Act（実行）
  const result = await FallbackHandler.executeWithFallback(
    handler,
    async () => ({
      success: false as const,
      error: { code: "SERVER_ERROR", message: "Server unavailable" },
    }),
    () => ({ success: true as const, data: "fallback-result" }),
  );

  // Assert（検証）
  expect(result).toEqual({ success: true, data: "fallback-result" });
  expect(FallbackHandler.getLastError(handler)).toEqual({
    code: "SERVER_ERROR",
    message: "Server unavailable",
  });
});

test("自動フォールバックが無効でMCPResult形式のエラーを返した場合はそのエラーを返す", async () => {
  // Arrange（準備）
  const handler = FallbackHandler.create();
  FallbackHandler.setMode(handler, "normal");
  FallbackHandler.setAutoFallback(handler, false);
  const expectedError = { code: "SERVER_ERROR", message: "Server unavailable" };

  // Act（実行）
  const result = await FallbackHandler.executeWithFallback(
    handler,
    async () => ({
      success: false as const,
      error: expectedError,
    }),
    () => ({ success: true as const, data: "fallback-result" }),
  );

  // Assert（検証）
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error).toEqual(expectedError);
  }
});
