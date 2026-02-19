import { expect, test } from "vitest";
import { parseArgs, DEFAULT_PORT } from "../cli";

test("parseArgs: デフォルト値 - 引数なし → stdio, port 3000, warnings空", () => {
  const result = parseArgs([]);
  expect(result).toEqual({
    transport: "stdio",
    port: DEFAULT_PORT,
    warnings: [],
  });
});

test("parseArgs: transport指定 - --transport http", () => {
  const result = parseArgs(["--transport", "http"]);
  expect(result.transport).toBe("http");
});

test("parseArgs: port指定 - --transport http --port 8080", () => {
  const result = parseArgs(["--transport", "http", "--port", "8080"]);
  expect(result.transport).toBe("http");
  expect(result.port).toBe(8080);
  expect(result.warnings).toEqual([]);
});

test("parseArgs: = 区切り形式 - --transport=http", () => {
  const result = parseArgs(["--transport=http"]);
  expect(result.transport).toBe("http");
});

test("parseArgs: 不正transport - --transport websocket → エラー", () => {
  expect(() => parseArgs(["--transport", "websocket"])).toThrow(
    'エラー: --transport は "stdio" または "http" を指定してください（指定値: "websocket"）',
  );
});

test("parseArgs: 不正port（非整数文字列） - --port abc → エラー", () => {
  expect(() => parseArgs(["--port", "abc"])).toThrow(
    'エラー: --port は整数を指定してください（指定値: "abc"）',
  );
});

test("parseArgs: 不正port（小数） - --port 8080.5 → エラー", () => {
  expect(() => parseArgs(["--port", "8080.5"])).toThrow(
    'エラー: --port は整数を指定してください（指定値: "8080.5"）',
  );
});

test("parseArgs: 不正port（範囲外 0） - --port 0 → エラー", () => {
  expect(() => parseArgs(["--port", "0"])).toThrow(
    "エラー: --port は1〜65535の範囲で指定してください（指定値: 0）",
  );
});

test("parseArgs: 不正port（範囲外 99999） - --port 99999 → エラー", () => {
  expect(() => parseArgs(["--port", "99999"])).toThrow(
    "エラー: --port は1〜65535の範囲で指定してください（指定値: 99999）",
  );
});

test("parseArgs: port警告 - --port 8080（transportなし）→ warnings配列に警告", () => {
  const result = parseArgs(["--port", "8080"]);
  expect(result.transport).toBe("stdio");
  expect(result.port).toBe(8080);
  expect(result.warnings).toContain("--port はHTTPモード時のみ有効です");
});

test("parseArgs: 未知オプション - --verbose → エラー", () => {
  expect(() => parseArgs(["--verbose"])).toThrow(
    'エラー: 不明なオプション "--verbose"',
  );
});

test("parseArgs: 値欠落 - --port が末尾 → エラー", () => {
  expect(() => parseArgs(["--port"])).toThrow(
    "エラー: --port の値が指定されていません",
  );
});

test("parseArgs: 重複指定 - --port 3000 --port 4000 → 後勝ち port=4000", () => {
  const result = parseArgs([
    "--transport",
    "http",
    "--port",
    "3000",
    "--port",
    "4000",
  ]);
  expect(result.port).toBe(4000);
});

test("parseArgs: 非10進表記 - --port 1e3 → エラー", () => {
  expect(() => parseArgs(["--port", "1e3"])).toThrow(
    'エラー: --port は整数を指定してください（指定値: "1e3"）',
  );
});

test("parseArgs: 非10進表記 - --port 0x1F → エラー", () => {
  expect(() => parseArgs(["--port", "0x1F"])).toThrow(
    'エラー: --port は整数を指定してください（指定値: "0x1F"）',
  );
});
