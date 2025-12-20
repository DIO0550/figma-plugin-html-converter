import { describe, test, expect } from "vitest";
import { SummaryElement } from "../summary-element";

describe("SummaryElement.create", () => {
  test("空の属性でsummary要素を作成できる", () => {
    const element = SummaryElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("summary");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("id属性を指定してsummary要素を作成できる", () => {
    const element = SummaryElement.create({ id: "summary-1" });

    expect(element.attributes.id).toBe("summary-1");
  });

  test("class属性を指定してsummary要素を作成できる", () => {
    const element = SummaryElement.create({ class: "summary-class" });

    expect(element.attributes.class).toBe("summary-class");
  });

  test("style属性を指定してsummary要素を作成できる", () => {
    const element = SummaryElement.create({ style: "font-weight: bold;" });

    expect(element.attributes.style).toBe("font-weight: bold;");
  });

  test("複数の属性を指定してsummary要素を作成できる", () => {
    const element = SummaryElement.create({
      id: "my-summary",
      class: "summary-class",
      style: "cursor: pointer;",
    });

    expect(element.attributes.id).toBe("my-summary");
    expect(element.attributes.class).toBe("summary-class");
    expect(element.attributes.style).toBe("cursor: pointer;");
  });
});
