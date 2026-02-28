import { test, expect, vi, beforeEach, afterEach } from "vitest";

type Listener = (...args: unknown[]) => void;
let rejectionListenersBefore: Listener[];

const mockParseArgs = vi.fn();
vi.mock("../cli", () => ({
  parseArgs: (...args: unknown[]) => mockParseArgs(...args),
}));

const mockStartStdio = vi.fn().mockResolvedValue(undefined);
const mockStartHttp = vi.fn().mockResolvedValue(undefined);
vi.mock("../index", () => ({
  startStdio: (...args: unknown[]) => mockStartStdio(...args),
  startHttp: (...args: unknown[]) => mockStartHttp(...args),
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  rejectionListenersBefore = process.listeners("unhandledRejection").slice();
});

afterEach(() => {
  for (const listener of process.listeners("unhandledRejection")) {
    if (!rejectionListenersBefore.includes(listener)) {
      process.removeListener(
        "unhandledRejection",
        listener as (...args: unknown[]) => void,
      );
    }
  }
  vi.restoreAllMocks();
});

test("stdio分岐: parseArgsがstdioを返す場合にstartStdioが呼ばれる", async () => {
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);
  mockParseArgs.mockReturnValue({
    transport: "stdio",
    port: 3000,
    warnings: [],
  });

  await import("../run");

  // main()はPromiseなのでマイクロタスクを待つ
  await vi.waitFor(() => {
    expect(mockStartStdio).toHaveBeenCalledOnce();
  });
  expect(mockStartHttp).not.toHaveBeenCalled();

  exitSpy.mockRestore();
});

test("http分岐: parseArgsがhttpを返す場合にstartHttpが正しいportで呼ばれる", async () => {
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);
  mockParseArgs.mockReturnValue({
    transport: "http",
    port: 8080,
    warnings: [],
  });

  await import("../run");

  await vi.waitFor(() => {
    expect(mockStartHttp).toHaveBeenCalledWith(8080);
  });
  expect(mockStartStdio).not.toHaveBeenCalled();

  exitSpy.mockRestore();
});

test("warningsがconsole.warnに出力される", async () => {
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  mockParseArgs.mockReturnValue({
    transport: "stdio",
    port: 3000,
    warnings: ["警告1", "警告2"],
  });

  await import("../run");

  await vi.waitFor(() => {
    expect(warnSpy).toHaveBeenCalledWith("警告1");
    expect(warnSpy).toHaveBeenCalledWith("警告2");
  });

  warnSpy.mockRestore();
  exitSpy.mockRestore();
});

test("startStdioがrejectした場合にconsole.errorとprocess.exit(1)が呼ばれる", async () => {
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  mockParseArgs.mockReturnValue({
    transport: "stdio",
    port: 3000,
    warnings: [],
  });
  mockStartStdio.mockRejectedValueOnce(new Error("stdio failed"));

  await import("../run");

  await vi.waitFor(() => {
    expect(errorSpy).toHaveBeenCalledWith(
      "エラー: 予期しないエラーが発生しました: stdio failed",
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  errorSpy.mockRestore();
  exitSpy.mockRestore();
});

test("parseArgsがthrowした場合にconsole.errorとprocess.exit(1)が呼ばれる", async () => {
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  mockParseArgs.mockImplementation(() => {
    throw new Error("invalid args");
  });

  await import("../run");

  await vi.waitFor(() => {
    expect(errorSpy).toHaveBeenCalledWith(
      "エラー: 予期しないエラーが発生しました: invalid args",
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  errorSpy.mockRestore();
  exitSpy.mockRestore();
});

test("unhandledRejectionリスナーが登録される", async () => {
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);
  mockParseArgs.mockReturnValue({
    transport: "stdio",
    port: 3000,
    warnings: [],
  });

  const listenersBefore = process.listeners("unhandledRejection").length;
  await import("../run");
  const listenersAfter = process.listeners("unhandledRejection").length;

  expect(listenersAfter).toBe(listenersBefore + 1);

  exitSpy.mockRestore();
});
