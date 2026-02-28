import { test, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

test("index.tsをimportしてもunhandledRejectionリスナーが追加されない", async () => {
  const listenersBefore = process.listeners("unhandledRejection").length;
  await import("../index");
  const listenersAfter = process.listeners("unhandledRejection").length;
  expect(listenersAfter).toBe(listenersBefore);
});

test("index.tsをimportしてもprocess.exitが呼ばれない", async () => {
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);
  await import("../index");
  expect(exitSpy).not.toHaveBeenCalled();
  exitSpy.mockRestore();
});

test("index.tsをimportしてもstartStdio/startHttpが実行されない", async () => {
  const exitSpy = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  await import("../index");
  expect(exitSpy).not.toHaveBeenCalled();
  expect(errorSpy).not.toHaveBeenCalled();
  exitSpy.mockRestore();
  errorSpy.mockRestore();
});
