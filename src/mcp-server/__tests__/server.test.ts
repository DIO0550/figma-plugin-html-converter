import { expect, beforeAll, afterAll, test } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../server";
import { MAX_HTML_SIZE } from "../tools/convert-html/convert-html-tool";

let client: Client;
let cleanup: () => Promise<void> = async () => {};

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

test("createServer()がMcpServerインスタンスを返す", () => {
  const server = createServer();
  expect(server).toBeDefined();
  expect(server.server).toBeDefined();
});

test("ツール一覧にconvert_htmlが含まれる", async () => {
  const result = await client.listTools();
  const toolNames = result.tools.map((t) => t.name);
  expect(toolNames).toContain("convert_html");
});

test("convert_htmlツール呼び出しE2E: HTML入力→JSON出力", async () => {
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

test("空HTML入力のE2E: Rootフレーム返却", async () => {
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

test("サイズ超過HTMLのE2E: エラー応答", async () => {
  const largeHtml = "a".repeat(MAX_HTML_SIZE + 1);

  const result = await client.callTool({
    name: "convert_html",
    arguments: { html: largeHtml },
  });

  expect(result.isError).toBe(true);
  const content = result.content as Array<{ type: string; text: string }>;
  expect(content[0].text).toContain("入力HTMLのサイズが上限");
  expect(content[0].text).toContain("を超えています");
});

test("未知キー（トップレベル）の拒否", async () => {
  const result = await client.callTool({
    name: "convert_html",
    arguments: { html: "<div></div>", extra: 1 },
  });

  expect(result.isError).toBe(true);
});

test("未知キー（options内）の拒否", async () => {
  const result = await client.callTool({
    name: "convert_html",
    arguments: {
      html: "<div></div>",
      options: { extra: 1 },
    },
  });

  expect(result.isError).toBe(true);
});

test("containerWidth/containerHeight が有効値の場合に E2E が成功する", async () => {
  const result = await client.callTool({
    name: "convert_html",
    arguments: {
      html: "<div>container size</div>",
      options: {
        containerWidth: 800,
        containerHeight: 600,
      },
    },
  });

  expect(result.isError).toBeFalsy();
  const content = result.content as Array<{ type: string; text: string }>;
  expect(content).toHaveLength(1);
  const parsed = JSON.parse(content[0].text);
  expect(parsed.type).toBe("FRAME");
});

test("containerWidth に 0 以下を指定した場合に Zod バリデーションエラーが返る", async () => {
  const result = await client.callTool({
    name: "convert_html",
    arguments: {
      html: "<div>invalid width</div>",
      options: {
        containerWidth: 0,
      },
    },
  });

  expect(result.isError).toBe(true);
  const content = result.content as Array<{ type: string; text: string }>;
  expect(content[0].type).toBe("text");
  expect(content[0].text).not.toHaveLength(0);
});

test("containerHeight に 0 以下を指定した場合に Zod バリデーションエラーが返る", async () => {
  const result = await client.callTool({
    name: "convert_html",
    arguments: {
      html: "<div>invalid height</div>",
      options: {
        containerHeight: -100,
      },
    },
  });

  expect(result.isError).toBe(true);
  const content = result.content as Array<{ type: string; text: string }>;
  expect(content[0].type).toBe("text");
  expect(content[0].text).not.toHaveLength(0);
});

test("存在しないツール名(nonexistent_tool)でcallToolを呼び出すとisError応答が返る", async () => {
  const result = await client.callTool({
    name: "nonexistent_tool",
    arguments: {},
  });

  expect(result.isError).toBe(true);
  const content = result.content as Array<{ type: string; text: string }>;
  expect(content[0].text).toContain("nonexistent_tool");
});

test("connect/closeライフサイクルが正常に動作する", async () => {
  const server = createServer();
  const lifecycleClient = new Client({
    name: "lifecycle-client",
    version: "1.0.0",
  });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();

  await server.connect(serverTransport);
  await lifecycleClient.connect(clientTransport);

  await lifecycleClient.close();
  await server.close();

  await expect(lifecycleClient.listTools()).rejects.toThrow();
});

test("不正な引数型でisError応答が返る", async () => {
  const result = await client.callTool({
    name: "convert_html",
    arguments: { html: 123 },
  });

  expect(result.isError).toBe(true);
  const content = result.content as Array<{ type: string; text: string }>;
  expect(content[0].text).not.toHaveLength(0);
});
