import { test, expect } from "vitest";
import { MCPMessage } from "../mcp-message";

test("MCPリクエストを作成できる", () => {
  const request = MCPMessage.createRequest("initialize", {
    protocolVersion: "2024-11-05",
  });

  expect(request.jsonrpc).toBe("2.0");
  expect(request.method).toBe("initialize");
  expect(request.params).toEqual({ protocolVersion: "2024-11-05" });
  expect(typeof request.id).toBe("string");
  expect(request.id.length).toBeGreaterThan(0);
});

test("パラメータなしでMCPリクエストを作成できる", () => {
  const request = MCPMessage.createRequest("shutdown");

  expect(request.jsonrpc).toBe("2.0");
  expect(request.method).toBe("shutdown");
  expect(request.params).toBeUndefined();
});

test("リクエストIDが一意である", () => {
  const request1 = MCPMessage.createRequest("test");
  const request2 = MCPMessage.createRequest("test");

  expect(request1.id).not.toBe(request2.id);
});
