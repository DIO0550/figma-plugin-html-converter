import { test, expect, vi, beforeEach, afterEach } from "vitest";

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

const mockStdioTransportClose = vi.fn().mockResolvedValue(undefined);
const mockStdioTransportInstance = { close: mockStdioTransportClose };
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

type Listener = (...args: unknown[]) => void;
let sigintListenersBefore: Listener[];
let sigtermListenersBefore: Listener[];

beforeEach(() => {
  vi.clearAllMocks();
  mockPostHandler = undefined;
  sigintListenersBefore = process.listeners("SIGINT").slice();
  sigtermListenersBefore = process.listeners("SIGTERM").slice();
});

afterEach(() => {
  for (const listener of process.listeners("SIGINT")) {
    if (!sigintListenersBefore.includes(listener)) {
      process.removeListener("SIGINT", listener as () => void);
    }
  }
  for (const listener of process.listeners("SIGTERM")) {
    if (!sigtermListenersBefore.includes(listener)) {
      process.removeListener("SIGTERM", listener as () => void);
    }
  }
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

// --- startStdio シグナルハンドリングテスト ---

test("startStdio: SIGINTでtransport.closeとserver.closeが呼ばれること", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

  await startStdio();

  process.emit("SIGINT");

  await vi.waitFor(() => {
    expect(mockStdioTransportClose).toHaveBeenCalledOnce();
    expect(mockClose).toHaveBeenCalledOnce();
  });

  exitSpy.mockRestore();
  errorSpy.mockRestore();
});

test("startStdio: SIGTERMでtransport.closeとserver.closeが呼ばれること", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

  await startStdio();

  process.emit("SIGTERM");

  await vi.waitFor(() => {
    expect(mockStdioTransportClose).toHaveBeenCalledOnce();
    expect(mockClose).toHaveBeenCalledOnce();
  });

  exitSpy.mockRestore();
  errorSpy.mockRestore();
});

test("startStdio: cleanup内のclose()が失敗した時にエラーログが出力されること", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

  const closeError = new Error("stdio close failed");
  mockStdioTransportClose.mockRejectedValueOnce(closeError);

  await startStdio();

  process.emit("SIGINT");

  await vi.waitFor(() => {
    expect(errorSpy).toHaveBeenCalledWith(
      "MCPクリーンアップエラー (stdio):",
      closeError,
    );
  });

  exitSpy.mockRestore();
  errorSpy.mockRestore();
});

test("startStdio: 複数シグナルでもcloseは各1回のみ", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

  await startStdio();

  process.emit("SIGINT");

  await vi.waitFor(() => {
    expect(mockStdioTransportClose).toHaveBeenCalledOnce();
    expect(mockClose).toHaveBeenCalledOnce();
  });

  // 2回目のシグナルはcleanupPromise != nullなので強制終了パス
  // close()は追加で呼ばれない
  process.emit("SIGINT");

  expect(mockStdioTransportClose).toHaveBeenCalledTimes(1);
  expect(mockClose).toHaveBeenCalledTimes(1);

  exitSpy.mockRestore();
  errorSpy.mockRestore();
});

test("startStdio: close()完了前にprocess.exitが呼ばれないこと（Deferredパターン）", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

  let resolveClose!: () => void;
  mockStdioTransportClose.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        resolveClose = resolve;
      }),
  );

  await startStdio();

  process.emit("SIGINT");

  // close()完了前なのでexitはまだ呼ばれていない
  expect(exitSpy).not.toHaveBeenCalled();

  // close()を完了させる
  resolveClose();

  await vi.waitFor(() => {
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  exitSpy.mockRestore();
  errorSpy.mockRestore();
});

test("startStdio: 2回目のシグナルでprocess.exit(1)による強制終了", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

  let resolveClose!: () => void;
  mockStdioTransportClose.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        resolveClose = resolve;
      }),
  );

  await startStdio();

  // 1回目: クリーンアップ開始（close()は保留中）
  process.emit("SIGINT");
  expect(exitSpy).not.toHaveBeenCalled();

  // 2回目: 強制終了
  process.emit("SIGTERM");
  expect(exitSpy).toHaveBeenCalledWith(1);

  // クリーンアップ解放
  resolveClose();

  exitSpy.mockRestore();
  errorSpy.mockRestore();
});

test("startStdio: シグナルハンドラがconnect前に登録されること", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

  const callOrder: string[] = [];
  const onSpy = vi.spyOn(process, "on");
  onSpy.mockImplementation(((event: string, ..._args: unknown[]) => {
    if (event === "SIGINT" || event === "SIGTERM") {
      callOrder.push(`process.on(${event})`);
    }
    return process;
  }) as typeof process.on);

  mockConnect.mockImplementationOnce(() => {
    callOrder.push("connect");
    return Promise.resolve();
  });

  await startStdio();

  expect(callOrder.indexOf("process.on(SIGINT)")).toBeLessThan(
    callOrder.indexOf("connect"),
  );
  expect(callOrder.indexOf("process.on(SIGTERM)")).toBeLessThan(
    callOrder.indexOf("connect"),
  );

  onSpy.mockRestore();
  exitSpy.mockRestore();
  errorSpy.mockRestore();
});
