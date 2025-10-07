import { test, expect } from "vitest";
import { PreElement } from "../pre-element";

test("PreElement.create - 非常に長いid属性を処理できる", () => {
  const longId = "id-" + "x".repeat(1000);
  const element = PreElement.create({ id: longId });

  expect(element.attributes.id).toBe(longId);
  expect(element.attributes.id?.length).toBe(1003);
});

test("PreElement.create - 非常に長いclass属性を処理できる", () => {
  const longClass = "class-" + "y".repeat(1000);
  const element = PreElement.create({ class: longClass });

  expect(element.attributes.class).toBe(longClass);
  expect(element.attributes.class?.length).toBe(1006);
});

test("PreElement.create - 非常に長いstyle属性を処理できる", () => {
  const longStyle = "color: red; " + "padding: 1px; ".repeat(500);
  const element = PreElement.create({ style: longStyle });

  expect(element.attributes.style).toBe(longStyle);
  expect(element.attributes.style?.length).toBeGreaterThan(5000);
});

test("PreElement.create - 空文字列の属性を処理できる", () => {
  const element = PreElement.create({
    id: "",
    class: "",
    style: "",
  });

  expect(element.attributes.id).toBe("");
  expect(element.attributes.class).toBe("");
  expect(element.attributes.style).toBe("");
});

test("PreElement.create - 深くネストされた子要素を処理できる", () => {
  const deepChildren = Array(100)
    .fill(null)
    .map((_, i) => ({
      type: "text" as const,
      content: `line${i}`,
    }));

  const element = PreElement.create({}, deepChildren);

  expect(element.children).toHaveLength(100);
  expect(element.children?.[0].content).toBe("line0");
  expect(element.children?.[99].content).toBe("line99");
});

test("PreElement.create - 1000個の子要素を処理できる", () => {
  const manyChildren = Array(1000)
    .fill(null)
    .map((_, i) => ({
      type: "text" as const,
      content: `${i}`,
    }));

  const element = PreElement.create({}, manyChildren);

  expect(element.children).toHaveLength(1000);
  expect(element.children?.[999].content).toBe("999");
});

test("PreElement.create - 特殊文字を含むコンテンツを処理できる", () => {
  const specialChars = [
    { type: "text" as const, content: "<script>alert('xss')</script>" },
    { type: "text" as const, content: "日本語のコード" },
    { type: "text" as const, content: "emoji 🚀💻🔥" },
    { type: "text" as const, content: "\n\t\r" },
  ];

  const element = PreElement.create({}, specialChars);

  expect(element.children).toHaveLength(4);
  expect(element.children?.[0].content).toBe("<script>alert('xss')</script>");
  expect(element.children?.[1].content).toBe("日本語のコード");
  expect(element.children?.[2].content).toBe("emoji 🚀💻🔥");
  expect(element.children?.[3].content).toBe("\n\t\r");
});

test("PreElement.create - 非常に長いテキストコンテンツを処理できる", () => {
  const longText = "x".repeat(100000);
  const children = [{ type: "text" as const, content: longText }];
  const element = PreElement.create({}, children);

  expect(element.children?.[0].content).toBe(longText);
  expect(element.children?.[0].content.length).toBe(100000);
});

test("PreElement.create - 複数の改行とタブを含むコンテンツを処理できる", () => {
  const multilineCode =
    "function test() {\n\tif (true) {\n\t\treturn 42;\n\t}\n}";
  const children = [{ type: "text" as const, content: multilineCode }];
  const element = PreElement.create({}, children);

  expect(element.children?.[0].content).toBe(multilineCode);
  expect(element.children?.[0].content).toContain("\n");
  expect(element.children?.[0].content).toContain("\t");
});
