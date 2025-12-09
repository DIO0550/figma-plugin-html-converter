import { describe, test, expect } from "vitest";
import { DefsElement } from "../defs-element";

describe("DefsElement.create", () => {
  test("引数なしでdefs要素を作成する", () => {
    const element = DefsElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("defs");
    expect(element.attributes).toBeDefined();
  });

  test("id属性を指定してdefs要素を作成する", () => {
    const element = DefsElement.create({
      id: "definitions",
    });

    expect(element.attributes.id).toBe("definitions");
  });

  test("子要素（定義）を指定してdefs要素を作成する", () => {
    const element = DefsElement.create({}, [
      {
        type: "element",
        tagName: "linearGradient",
        attributes: { id: "grad1" },
      },
    ]);

    expect(element.children).toHaveLength(1);
    expect(element.children?.[0].tagName).toBe("linearGradient");
  });

  test("複数の子要素を指定してdefs要素を作成する", () => {
    const element = DefsElement.create({}, [
      {
        type: "element",
        tagName: "linearGradient",
        attributes: { id: "grad1" },
      },
      { type: "element", tagName: "pattern", attributes: { id: "pattern1" } },
      { type: "element", tagName: "clipPath", attributes: { id: "clip1" } },
    ]);

    expect(element.children).toHaveLength(3);
  });
});
