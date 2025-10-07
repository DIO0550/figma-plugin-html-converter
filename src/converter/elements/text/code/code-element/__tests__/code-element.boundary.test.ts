import { test, expect } from "vitest";
import { CodeElement } from "../code-element";
import { HTMLNode } from "../../../../../models/html-node";

test("CodeElement.create - 非常に長いid属性を処理できる", () => {
  const longId = "id-" + "x".repeat(1000);
  const element = CodeElement.create({ id: longId });

  expect(element.attributes?.id).toBe(longId);
  expect(element.attributes?.id?.length).toBe(1003);
});

test("CodeElement.create - 非常に長いclass属性を処理できる", () => {
  const longClass = "class-" + "y".repeat(1000);
  const element = CodeElement.create({ class: longClass });

  expect(element.attributes?.class).toBe(longClass);
  expect(element.attributes?.class?.length).toBe(1006);
});

test("CodeElement.create - 非常に長いstyle属性を処理できる", () => {
  const longStyle = "color: red; " + "padding: 1px; ".repeat(500);
  const element = CodeElement.create({ style: longStyle });

  expect(element.attributes?.style).toBe(longStyle);
  expect(element.attributes?.style?.length).toBeGreaterThan(5000);
});

test("CodeElement.create - 空文字列の属性を処理できる", () => {
  const element = CodeElement.create({
    id: "",
    class: "",
    style: "",
  });

  expect(element.attributes?.id).toBe("");
  expect(element.attributes?.class).toBe("");
  expect(element.attributes?.style).toBe("");
});

test("CodeElement.create - 深くネストされた子要素を処理できる", () => {
  const deepChildren = Array(100)
    .fill(null)
    .map((_, i) => ({
      type: "text" as const,
      textContent: `line${i}`,
    }));

  const element = CodeElement.create({}, deepChildren);

  expect(element.children).toHaveLength(100);
  const firstChild = element.children?.[0];
  const lastChild = element.children?.[99];
  if (firstChild && HTMLNode.isText(firstChild)) {
    expect(firstChild.textContent).toBe("line0");
  }
  if (lastChild && HTMLNode.isText(lastChild)) {
    expect(lastChild.textContent).toBe("line99");
  }
});

test("CodeElement.create - 1000個の子要素を処理できる", () => {
  const manyChildren = Array(1000)
    .fill(null)
    .map((_, i) => ({
      type: "text" as const,
      textContent: `${i}`,
    }));

  const element = CodeElement.create({}, manyChildren);

  expect(element.children).toHaveLength(1000);
  const lastChild = element.children?.[999];
  if (lastChild && HTMLNode.isText(lastChild)) {
    expect(lastChild.textContent).toBe("999");
  }
});

test("CodeElement.create - 特殊文字を含むコンテンツを処理できる", () => {
  const specialChars = [
    { type: "text" as const, textContent: "<script>alert('xss')</script>" },
    { type: "text" as const, textContent: "日本語のコード" },
    { type: "text" as const, textContent: "emoji 🚀💻🔥" },
    { type: "text" as const, textContent: "\n\t\r" },
  ];

  const element = CodeElement.create({}, specialChars);

  expect(element.children).toHaveLength(4);
  if (element.children?.[0] && HTMLNode.isText(element.children[0])) {
    expect(element.children[0].textContent).toBe(
      "<script>alert('xss')</script>",
    );
  }
  if (element.children?.[1] && HTMLNode.isText(element.children[1])) {
    expect(element.children[1].textContent).toBe("日本語のコード");
  }
  if (element.children?.[2] && HTMLNode.isText(element.children[2])) {
    expect(element.children[2].textContent).toBe("emoji 🚀💻🔥");
  }
  if (element.children?.[3] && HTMLNode.isText(element.children[3])) {
    expect(element.children[3].textContent).toBe("\n\t\r");
  }
});
