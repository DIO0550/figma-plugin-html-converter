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

export async function startStdio(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCPサーバーを起動しました（トランスポート: stdio）");
}

export async function startHttp(port: number): Promise<void> {
  const app = createMcpExpressApp();
  app.post("/mcp", async (req, res) => {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on("close", () => {
      transport.close();
      server.close();
    });
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
