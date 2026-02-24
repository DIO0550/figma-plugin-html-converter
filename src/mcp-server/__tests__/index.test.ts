import { test, expect, vi, beforeEach } from "vitest";

// --- モック設定 ---

const mockConnect = vi.fn().mockResolvedValue(undefined);
const mockClose = vi.fn().mockResolvedValue(undefined);
vi.mock("../server", () => ({
  createServer: vi.fn(() => ({
    connect: mockConnect,
    close: mockClose,
    server: {},
  })),
}));

const mockStdioTransportInstance = {};
vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => ({
  StdioServerTransport: vi.fn(() => mockStdioTransportInstance),
}));

const mockHandleRequest = vi.fn().mockResolvedValue(undefined);
const mockTransportClose = vi.fn().mockResolvedValue(undefined);
vi.mock("@modelcontextprotocol/sdk/server/streamableHttp.js", () => ({
  StreamableHTTPServerTransport: vi.fn(() => ({
    handleRequest: mockHandleRequest,
    close: mockTransportClose,
  })),
}));

let mockPostHandler:
  | ((req: unknown, res: unknown) => Promise<void>)
  | undefined;
const mockListen = vi.fn((_port: number, callback: () => void) => {
  const server = {
    once: vi.fn(),
  };
  callback();
  return server;
});
const mockPost = vi.fn(
  (path: string, handler: (req: unknown, res: unknown) => Promise<void>) => {
    if (path === "/mcp") {
      mockPostHandler = handler;
    }
  },
);
vi.mock("@modelcontextprotocol/sdk/server/express.js", () => ({
  createMcpExpressApp: vi.fn(() => ({
    post: mockPost,
    listen: mockListen,
  })),
}));

// --- テスト ---

import { startStdio, startHttp } from "../index";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

beforeEach(() => {
  vi.clearAllMocks();
  mockPostHandler = undefined;
});

test("startStdio: StdioServerTransportを作成してconnectを呼ぶ", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  await startStdio();

  expect(StdioServerTransport).toHaveBeenCalledOnce();
  expect(mockConnect).toHaveBeenCalledWith(mockStdioTransportInstance);

  errorSpy.mockRestore();
});

test("startStdio: stderrにstdio起動ログを出力する", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  await startStdio();

  expect(errorSpy).toHaveBeenCalledWith(
    "MCPサーバーを起動しました（トランスポート: stdio）",
  );

  errorSpy.mockRestore();
});

test("startHttp: createMcpExpressAppとlistenを呼ぶ", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  await startHttp(3000);

  expect(createMcpExpressApp).toHaveBeenCalledOnce();
  expect(mockListen).toHaveBeenCalled();
  const listenPort = mockListen.mock.calls[0][0];
  expect(listenPort).toBe(3000);

  errorSpy.mockRestore();
});

test("startHttp: POST /mcp ルートが登録される", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  await startHttp(3000);

  expect(mockPost).toHaveBeenCalledWith("/mcp", expect.any(Function));

  errorSpy.mockRestore();
});

test("startHttp: stderrにHTTP起動ログを出力する", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  await startHttp(8080);

  expect(errorSpy).toHaveBeenCalledWith(
    "MCPサーバーを起動しました（トランスポート: HTTP, ポート: 8080）",
  );

  errorSpy.mockRestore();
});

test("startHttp: /mcp ハンドラがStreamableHTTPServerTransportを作成する", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  await startHttp(3000);

  expect(mockPostHandler).toBeDefined();

  const mockReq = { body: {} };
  const mockRes = { on: vi.fn() };
  await mockPostHandler!(mockReq, mockRes);

  expect(StreamableHTTPServerTransport).toHaveBeenCalledWith({
    sessionIdGenerator: undefined,
  });
  expect(mockConnect).toHaveBeenCalled();
  expect(mockHandleRequest).toHaveBeenCalledWith(
    mockReq,
    mockRes,
    mockReq.body,
  );

  errorSpy.mockRestore();
});

test("startHttp: /mcp ハンドラのcloseコールバックでtransport/serverがクリーンアップされる", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  await startHttp(3000);

  const mockReq = { body: {} };
  const mockRes = { on: vi.fn() };
  await mockPostHandler!(mockReq, mockRes);

  expect(mockRes.on).toHaveBeenCalledWith("close", expect.any(Function));

  const closeCallback = mockRes.on.mock.calls.find(
    (call: unknown[]) => call[0] === "close",
  )![1] as () => void;
  closeCallback();

  // cleanup は async なので Promise を待つ
  await vi.waitFor(() => {
    expect(mockTransportClose).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  errorSpy.mockRestore();
});

test("startHttp: closeリスナーがhandleRequest前に登録される", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  const callOrder: string[] = [];
  const mockRes = {
    on: vi.fn(() => {
      callOrder.push("res.on");
    }),
  };
  mockHandleRequest.mockImplementationOnce(() => {
    callOrder.push("handleRequest");
    return Promise.resolve();
  });

  await startHttp(3000);

  const mockReq = { body: {} };
  await mockPostHandler!(mockReq, mockRes);

  expect(callOrder.indexOf("res.on")).toBeLessThan(
    callOrder.indexOf("handleRequest"),
  );

  errorSpy.mockRestore();
});

test("startHttp: handleRequestがrejectした時にcleanupが呼ばれる", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  mockHandleRequest.mockRejectedValueOnce(new Error("request failed"));

  await startHttp(3000);

  const mockReq = { body: {} };
  const mockRes = { on: vi.fn() };
  await expect(mockPostHandler!(mockReq, mockRes)).rejects.toThrow(
    "request failed",
  );

  expect(mockTransportClose).toHaveBeenCalled();
  expect(mockClose).toHaveBeenCalled();

  errorSpy.mockRestore();
});

test("startHttp: handleRequestがrejectした時にエラーログが出力される", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  const error = new Error("request failed");
  mockHandleRequest.mockRejectedValueOnce(error);

  await startHttp(3000);

  const mockReq = { body: {} };
  const mockRes = { on: vi.fn() };
  await expect(mockPostHandler!(mockReq, mockRes)).rejects.toThrow();

  expect(errorSpy).toHaveBeenCalledWith(
    "MCPリクエスト処理エラー:",
    "request failed",
    error,
  );

  errorSpy.mockRestore();
});

test("startHttp: handleRequestがrejectした時に例外が再throwされる", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  const originalError = new Error("original error");
  mockHandleRequest.mockRejectedValueOnce(originalError);

  await startHttp(3000);

  const mockReq = { body: {} };
  const mockRes = { on: vi.fn() };
  await expect(mockPostHandler!(mockReq, mockRes)).rejects.toBe(originalError);

  errorSpy.mockRestore();
});

test("startHttp: connectがrejectした時にcleanupが呼ばれ例外が伝播する", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  const connectError = new Error("connect failed");
  mockConnect.mockRejectedValueOnce(connectError);

  await startHttp(3000);

  const mockReq = { body: {} };
  const mockRes = { on: vi.fn() };
  await expect(mockPostHandler!(mockReq, mockRes)).rejects.toBe(connectError);

  expect(mockTransportClose).toHaveBeenCalled();
  expect(mockClose).toHaveBeenCalled();

  errorSpy.mockRestore();
});

test("startHttp: handleRequest完了前にcloseが来てもcleanup済みになる（Deferredパターン）", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  let resolveHandleRequest!: () => void;
  mockHandleRequest.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        resolveHandleRequest = resolve;
      }),
  );

  await startHttp(3000);

  const mockReq = { body: {} };
  const mockRes = { on: vi.fn() };

  // ハンドラを起動（handleRequest で待機中）
  const handlerPromise = mockPostHandler!(mockReq, mockRes);

  // handleRequest 完了前に close を発火
  const closeCallback = mockRes.on.mock.calls.find(
    (call: unknown[]) => call[0] === "close",
  )![1] as () => void;
  closeCallback();

  // cleanup が呼ばれたことを検証
  await vi.waitFor(() => {
    expect(mockTransportClose).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  // handleRequest を完了させてハンドラを終了
  resolveHandleRequest();
  await handlerPromise;

  errorSpy.mockRestore();
});

test("startHttp: cleanupが複数回呼ばれてもtransport.close/server.closeは各1回のみ", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  mockHandleRequest.mockRejectedValueOnce(new Error("fail"));

  await startHttp(3000);

  const mockReq = { body: {} };
  const mockRes = { on: vi.fn() };

  // catch で cleanup が呼ばれる
  await expect(mockPostHandler!(mockReq, mockRes)).rejects.toThrow();

  // close でも cleanup が呼ばれる
  const closeCallback = mockRes.on.mock.calls.find(
    (call: unknown[]) => call[0] === "close",
  )![1] as () => void;
  closeCallback();

  // 少し待って非同期処理を完了させる
  await vi.waitFor(() => {
    expect(mockTransportClose).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  errorSpy.mockRestore();
});

test("startHttp: cleanup内のclose()が失敗した時にエラーログが出力される", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  const closeError = new Error("close failed");
  mockTransportClose.mockRejectedValueOnce(closeError);

  await startHttp(3000);

  const mockReq = { body: {} };
  const mockRes = { on: vi.fn() };
  await mockPostHandler!(mockReq, mockRes);

  // close イベントで cleanup を発火
  const closeCallback = mockRes.on.mock.calls.find(
    (call: unknown[]) => call[0] === "close",
  )![1] as () => void;
  closeCallback();

  await vi.waitFor(() => {
    expect(errorSpy).toHaveBeenCalledWith(
      "MCPクリーンアップエラー:",
      closeError,
    );
  });

  errorSpy.mockRestore();
});

test("startHttp: 起動失敗（EADDRINUSE）時にエラーがスローされる", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  mockListen.mockImplementationOnce((_port: number, _callback: () => void) => {
    const server = {
      once: vi.fn((event: string, handler: (err: Error) => void) => {
        if (event === "error") {
          const error = new Error("listen EADDRINUSE: address already in use");
          handler(error);
        }
      }),
    };
    return server;
  });

  await expect(startHttp(3000)).rejects.toThrow("EADDRINUSE");

  errorSpy.mockRestore();
});
