import { parseArgs } from "./cli";
import { createServer } from "./server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import type { Express } from "express";

export { createServer } from "./server";

function listenAsync(app: Express, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve());
    server.once("error", reject);
  });
}

/**
 * stdioトランスポートでMCPサーバーを起動します。
 *
 * stdin/stdoutを使用してJSON-RPC通信を行います。
 * 起動ログはstderrに出力されます（stdoutはプロトコル通信に使用）。
 *
 * SIGINT/SIGTERMを受信するとtransport.close()とserver.close()を
 * awaitしてからプロセスを終了します。2回目のシグナルでは
 * close()がハングしている可能性があるため即座にexit(1)します。
 *
 * @throws サーバー接続に失敗した場合
 */
export async function startStdio(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  let cleanupPromise: Promise<void> | null = null;
  const cleanup = (): Promise<void> => {
    if (cleanupPromise) return cleanupPromise;
    cleanupPromise = (async () => {
      const results = await Promise.allSettled([
        transport.close(),
        server.close(),
      ]);
      for (const result of results) {
        if (result.status === "rejected") {
          console.error("MCPクリーンアップエラー (stdio):", result.reason);
        }
      }
    })();
    return cleanupPromise;
  };

  const removeSignalHandlers = () => {
    process.removeListener("SIGINT", onSigint);
    process.removeListener("SIGTERM", onSigterm);
  };

  const onSignal = (signal: string) => {
    if (cleanupPromise) {
      console.error(`シグナル ${signal} を再受信しました。強制終了します。`);
      process.exit(1);
      return;
    }
    console.error(
      `シグナル ${signal} を受信しました。クリーンアップを実行します...`,
    );
    cleanup().finally(() => {
      removeSignalHandlers();
      process.exit(0);
    });
  };

  const onSigint = () => onSignal("SIGINT");
  const onSigterm = () => onSignal("SIGTERM");

  process.on("SIGINT", onSigint);
  process.on("SIGTERM", onSigterm);

  try {
    await server.connect(transport);
  } catch (err) {
    if (cleanupPromise) {
      await cleanupPromise;
      return;
    }
    await cleanup();
    removeSignalHandlers();
    throw err;
  }

  console.error("MCPサーバーを起動しました（トランスポート: stdio）");
}

/**
 * Streamable HTTPトランスポートでMCPサーバーを起動します。
 *
 * `POST /mcp` エンドポイントでリクエストを受け付け、
 * リクエストごとにサーバーインスタンスを作成・クリーンアップします（ステートレスモード）。
 *
 * @param port 待ち受けポート番号（1〜65535）
 * @throws ポートが使用中（EADDRINUSE）などで起動に失敗した場合
 */
export async function startHttp(port: number): Promise<void> {
  const app = createMcpExpressApp();
  app.post("/mcp", async (req, res) => {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    let cleaned = false;
    const cleanup = async () => {
      if (cleaned) return;
      cleaned = true;
      const results = await Promise.allSettled([
        transport.close(),
        server.close(),
      ]);
      for (const result of results) {
        if (result.status === "rejected") {
          console.error("MCPクリーンアップエラー:", result.reason);
        }
      }
    };

    res.on("close", () => void cleanup());

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      if (err instanceof Error) {
        console.error("MCPリクエスト処理エラー:", err.message, err);
      } else {
        console.error("MCPリクエスト処理エラー:", err);
      }
      await cleanup();
      throw err;
    }
  });
  await listenAsync(app, port);
  console.error(
    `MCPサーバーを起動しました（トランスポート: HTTP, ポート: ${port}）`,
  );
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  for (const w of options.warnings) {
    console.warn(w);
  }
  if (options.transport === "stdio") {
    await startStdio();
  } else {
    await startHttp(options.port);
  }
}

process.on("unhandledRejection", (reason) => {
  console.error(
    `未処理のPromise rejection: ${reason instanceof Error ? reason.message : String(reason)}`,
  );
});

main().catch((err) => {
  console.error(
    `エラー: 予期しないエラーが発生しました: ${err instanceof Error ? err.message : String(err)}`,
  );
  process.exit(1);
});
