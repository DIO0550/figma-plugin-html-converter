import { test, expect } from "vitest";
import { PreElement } from "../pre-element";

test("PreElement.create - 属性なしで空のpre要素を作成できる", () => {
  const element = PreElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("pre");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("PreElement.create - id属性を持つpre要素を作成できる", () => {
  const element = PreElement.create({ id: "test-pre" });

  expect(element.attributes.id).toBe("test-pre");
});

test("PreElement.create - class属性を持つpre要素を作成できる", () => {
  const element = PreElement.create({ class: "code-block" });

  expect(element.attributes.class).toBe("code-block");
});

test("PreElement.create - 子要素を持つpre要素を作成できる", () => {
  const children = [
    {
      type: "text" as const,
      content: "console.log('Hello');",
    },
  ];
  const element = PreElement.create({}, children);

  expect(element.children).toHaveLength(1);
  expect(element.children?.[0]).toEqual(children[0]);
});
