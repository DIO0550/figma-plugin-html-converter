export interface CliOptions {
  transport: "stdio" | "http";
  port: number;
  warnings: string[];
}

export const DEFAULT_PORT = 3000;

/**
 * CLI引数配列を解析して、サーバー起動に必要なオプションを構築します。
 *
 * 純粋関数であり、副作用はありません（グローバル状態やI/Oには一切影響しません）。
 *
 * @param argv `process.argv.slice(2)` などから渡されるCLI引数配列。
 *             例: `["--transport=http", "--port", "3000"]`
 * @returns 解析済みのオプションオブジェクト。
 *          - `transport`: 通信方式（"stdio" または "http"）
 *          - `port`: HTTPモード時に使用するポート番号（1〜65535、デフォルトは {@link DEFAULT_PORT}）
 *          - `warnings`: 利用条件に応じた警告メッセージの配列
 *
 * @throws Error 以下の場合にエラーをスローします。
 *         - `"--"` で始まらない不明な引数が含まれている場合
 *         - `--transport` または `--port` に値が指定されていない場合
 *         - `--transport` に "stdio" / "http" 以外の値が指定された場合
 *         - `--port` に10進整数以外、または 1〜65535 の範囲外の値が指定された場合
 */
export function parseArgs(argv: string[]): CliOptions {
  let transport: "stdio" | "http" = "stdio";
  let port: number = DEFAULT_PORT;
  const warnings: string[] = [];

  let i = 0;
  while (i < argv.length) {
    let key: string;
    let inlineValue: string | undefined;

    const arg = argv[i];

    if (!arg.startsWith("--")) {
      throw new Error(`エラー: 不明なオプション "${arg}"`);
    }

    const eqIndex = arg.indexOf("=");
    if (eqIndex !== -1) {
      key = arg.slice(0, eqIndex);
      inlineValue = arg.slice(eqIndex + 1);
    } else {
      key = arg;
      inlineValue = undefined;
    }

    switch (key) {
      case "--transport": {
        const value = inlineValue ?? argv[++i];
        if (value === undefined) {
          throw new Error("エラー: --transport の値が指定されていません");
        }
        if (value !== "stdio" && value !== "http") {
          throw new Error(
            `エラー: --transport は "stdio" または "http" を指定してください（指定値: "${value}"）`,
          );
        }
        transport = value;
        break;
      }
      case "--port": {
        const value = inlineValue ?? argv[++i];
        if (value === undefined) {
          throw new Error("エラー: --port の値が指定されていません");
        }
        if (!/^[0-9]+$/.test(value)) {
          throw new Error(
            `エラー: --port は整数を指定してください（指定値: "${value}"）`,
          );
        }
        const num = Number(value);
        if (num < 1 || num > 65535) {
          throw new Error(
            `エラー: --port は1〜65535の範囲で指定してください（指定値: ${num}）`,
          );
        }
        port = num;
        break;
      }
      default:
        throw new Error(`エラー: 不明なオプション "${key}"`);
    }

    i++;
  }

  if (transport === "stdio" && argv.some((a) => a.startsWith("--port"))) {
    warnings.push("--port はHTTPモード時のみ有効です");
  }

  return { transport, port, warnings };
}
