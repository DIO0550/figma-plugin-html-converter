import { test, expect } from "vitest";
import { SummaryElement } from "../summary-element";

test("SummaryElement.create - 空の属性 - summary要素を作成できる", () => {
  const element = SummaryElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("summary");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("SummaryElement.create - id属性指定 - summary要素を作成できる", () => {
  const element = SummaryElement.create({ id: "summary-1" });

  expect(element.attributes.id).toBe("summary-1");
});

test("SummaryElement.create - class属性指定 - summary要素を作成できる", () => {
  const element = SummaryElement.create({ class: "summary-class" });

  expect(element.attributes.class).toBe("summary-class");
});

test("SummaryElement.create - style属性指定 - summary要素を作成できる", () => {
  const element = SummaryElement.create({ style: "font-weight: bold;" });

  expect(element.attributes.style).toBe("font-weight: bold;");
});

test("SummaryElement.create - 複数の属性指定 - summary要素を作成できる", () => {
  const element = SummaryElement.create({
    id: "my-summary",
    class: "summary-class",
    style: "cursor: pointer;",
  });

  expect(element.attributes.id).toBe("my-summary");
  expect(element.attributes.class).toBe("summary-class");
  expect(element.attributes.style).toBe("cursor: pointer;");
});
