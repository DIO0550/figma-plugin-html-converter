import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../server";
import { MAX_HTML_SIZE } from "../tools/convert-html/convert-html-tool";

describe("MCPサーバー統合テスト", () => {
  let client: Client;
  let cleanup: () => Promise<void>;

  beforeAll(async () => {
    const server = createServer();
    client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    cleanup = async () => {
      await client.close();
      await server.close();
    };
  });

  afterAll(async () => {
    await cleanup();
  });

  it("createServer()がMcpServerインスタンスを返す", () => {
    const server = createServer();
    expect(server).toBeDefined();
    expect(server.server).toBeDefined();
  });

  it("ツール一覧にconvert_htmlが含まれる", async () => {
    const result = await client.listTools();
    const toolNames = result.tools.map((t) => t.name);
    expect(toolNames).toContain("convert_html");
  });

  it("convert_htmlツール呼び出しE2E: HTML入力→JSON出力", async () => {
    const result = await client.callTool({
      name: "convert_html",
      arguments: { html: "<div>test</div>" },
    });

    expect(result.isError).toBeFalsy();
    expect(result.content).toHaveLength(1);

    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].type).toBe("text");

    const parsed = JSON.parse(content[0].text);
    expect(parsed.type).toBe("FRAME");
  });

  it("空HTML入力のE2E: Rootフレーム返却", async () => {
    const result = await client.callTool({
      name: "convert_html",
      arguments: { html: "" },
    });

    expect(result.isError).toBeFalsy();

    const content = result.content as Array<{ type: string; text: string }>;
    const parsed = JSON.parse(content[0].text);
    expect(parsed.type).toBe("FRAME");
    expect(parsed.name).toBe("Root");
  });

  it("サイズ超過HTMLのE2E: エラー応答", async () => {
    const largeHtml = "a".repeat(MAX_HTML_SIZE + 1);

    const result = await client.callTool({
      name: "convert_html",
      arguments: { html: largeHtml },
    });

    expect(result.isError).toBe(true);
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].text).toBe(
      "入力HTMLのサイズが上限（1,048,576文字（UTF-16 code unit））を超えています",
    );
  });

  it("未知キー（トップレベル）の拒否", async () => {
    const result = await client.callTool({
      name: "convert_html",
      arguments: { html: "<div></div>", extra: 1 },
    });

    expect(result.isError).toBe(true);
  });

  it("未知キー（options内）の拒否", async () => {
    const result = await client.callTool({
      name: "convert_html",
      arguments: {
        html: "<div></div>",
        options: { extra: 1 },
      },
    });

    expect(result.isError).toBe(true);
  });
});
