import { test, expect } from "vitest";
import { CodeChildNode } from "../code-child-node";

test("CodeChildNode.create - content付き - CodeChildNodeを作成できる", () => {
  const node = CodeChildNode.create("const x = 10;");

  expect(node.kind).toBe("code");
  expect(node.content).toBe("const x = 10;");
  expect(node.styles).toBeUndefined();
});

test("CodeChildNode.create - styles付き - CodeChildNodeを作成できる", () => {
  const styles = { color: "red", "font-size": "14px" };
  const node = CodeChildNode.create("function test() {}", styles);

  expect(node.kind).toBe("code");
  expect(node.content).toBe("function test() {}");
  expect(node.styles).toEqual(styles);
});

test("CodeChildNode.from - 文字列を渡した場合 - CodeChildNodeを作成できる", () => {
  const node = CodeChildNode.from("console.log('test');");

  expect(node.kind).toBe("code");
  expect(node.content).toBe("console.log('test');");
});
