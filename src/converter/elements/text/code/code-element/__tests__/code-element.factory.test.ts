import { test, expect } from "vitest";
import { CodeElement } from "../code-element";

test("CodeElement.create - 属性なしで空のcode要素を作成できる", () => {
  const element = CodeElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("code");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("CodeElement.create - id属性を持つcode要素を作成できる", () => {
  const element = CodeElement.create({ id: "inline-code" });

  expect(element.attributes?.id).toBe("inline-code");
});

test("CodeElement.create - class属性を持つcode要素を作成できる", () => {
  const element = CodeElement.create({ class: "language-typescript" });

  expect(element.attributes?.class).toBe("language-typescript");
});

test("CodeElement.create - 子要素を持つcode要素を作成できる", () => {
  const children = [{ type: "text" as const, textContent: "const x = 10;" }];
  const element = CodeElement.create({}, children);

  expect(element.children).toHaveLength(1);
  expect(element.children?.[0]).toEqual(children[0]);
});
