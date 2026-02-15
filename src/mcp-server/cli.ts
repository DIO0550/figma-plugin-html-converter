export interface CliOptions {
  transport: "stdio" | "http";
  port: number;
  warnings: string[];
}

export const DEFAULT_PORT = 3000;

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
