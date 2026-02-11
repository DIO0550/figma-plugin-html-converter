import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleConvertHtml } from "./tools/convert-html/convert-html-tool";

declare const __MCP_SERVER_VERSION__: string;

const SERVER_INFO = {
  name: "html-to-figma",
  version:
    typeof __MCP_SERVER_VERSION__ !== "undefined"
      ? __MCP_SERVER_VERSION__
      : "0.0.0",
};

export function createServer(): McpServer {
  const server = new McpServer(SERVER_INFO);

  server.registerTool(
    "convert_html",
    {
      description: "HTML文字列をFigma互換のノード構造(JSON)に変換する",
      inputSchema: z.strictObject({
        html: z.string().describe("変換対象のHTML文字列"),
        options: z
          .strictObject({
            containerWidth: z
              .number()
              .positive()
              .optional()
              .describe("コンテナの幅（px）。デフォルト: 800"),
            containerHeight: z
              .number()
              .positive()
              .optional()
              .describe("コンテナの高さ（px）。デフォルト: 600"),
          })
          .optional()
          .describe("変換オプション"),
      }),
    },
    handleConvertHtml,
  );

  return server;
}
