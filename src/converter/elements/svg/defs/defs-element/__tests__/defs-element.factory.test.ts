import { test, expect } from "vitest";
import { DefsElement } from "../defs-element";

test("DefsElement.create - 引数なし - type=element, tagName=defsの要素を作成する", () => {
  // Arrange & Act
  const element = DefsElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("defs");
  expect(element.attributes).toBeDefined();
});

test("DefsElement.create - id属性を指定 - id属性が設定された要素を作成する", () => {
  // Arrange & Act
  const element = DefsElement.create({
    id: "definitions",
  });

  // Assert
  expect(element.attributes.id).toBe("definitions");
});

test("DefsElement.create - 単一の子要素（定義）を指定 - 子要素を持つ要素を作成する", () => {
  // Arrange & Act
  const element = DefsElement.create({}, [
    {
      type: "element",
      tagName: "linearGradient",
      attributes: { id: "grad1" },
    },
  ]);

  // Assert
  expect(element.children).toHaveLength(1);
  expect(element.children?.[0].tagName).toBe("linearGradient");
});

test("DefsElement.create - 複数の子要素を指定 - 複数の定義を持つ要素を作成する", () => {
  // Arrange & Act
  const element = DefsElement.create({}, [
    {
      type: "element",
      tagName: "linearGradient",
      attributes: { id: "grad1" },
    },
    { type: "element", tagName: "pattern", attributes: { id: "pattern1" } },
    { type: "element", tagName: "clipPath", attributes: { id: "clip1" } },
  ]);

  // Assert
  expect(element.children).toHaveLength(3);
});
