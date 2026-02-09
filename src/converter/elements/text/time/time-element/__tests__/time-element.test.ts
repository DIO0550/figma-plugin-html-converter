import { test, expect } from "vitest";
import { TimeElement } from "../time-element";

test("TimeElement.isTimeElement - time要素の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "time",
    attributes: {},
    children: [],
  };

  expect(TimeElement.isTimeElement(element)).toBe(true);
});

test("TimeElement.isTimeElement - time要素（子要素なし）の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "time",
    attributes: {},
  };

  expect(TimeElement.isTimeElement(element)).toBe(true);
});

test("TimeElement.isTimeElement - datetime属性を持つtime要素の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "time",
    attributes: { datetime: "2024-12-25" },
    children: [],
  };

  expect(TimeElement.isTimeElement(element)).toBe(true);
});

test("TimeElement.isTimeElement - 異なるタグ名の場合 - falseを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  expect(TimeElement.isTimeElement(element)).toBe(false);
});

test("TimeElement.isTimeElement - 異なるtypeの場合 - falseを返す", () => {
  const element = {
    type: "text",
    tagName: "time",
    attributes: {},
  };

  expect(TimeElement.isTimeElement(element)).toBe(false);
});

test("TimeElement.isTimeElement - nullの場合 - falseを返す", () => {
  expect(TimeElement.isTimeElement(null)).toBe(false);
});

test("TimeElement.isTimeElement - undefinedの場合 - falseを返す", () => {
  expect(TimeElement.isTimeElement(undefined)).toBe(false);
});

test("TimeElement.isTimeElement - 文字列の場合 - falseを返す", () => {
  expect(TimeElement.isTimeElement("time")).toBe(false);
});

test("TimeElement.isTimeElement - 必須プロパティが欠けている場合 - falseを返す", () => {
  const elementWithoutType = {
    tagName: "time",
    attributes: {},
  };

  const elementWithoutTagName = {
    type: "element",
    attributes: {},
  };

  expect(TimeElement.isTimeElement(elementWithoutType)).toBe(false);
  expect(TimeElement.isTimeElement(elementWithoutTagName)).toBe(false);
});

test("TimeElement.create - デフォルト値 - time要素を作成する", () => {
  const element = TimeElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("time");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("TimeElement.create - 属性付き - time要素を作成する", () => {
  const element = TimeElement.create({
    datetime: "2024-12-25T10:00:00",
    id: "event-time",
  });

  expect(element.attributes?.datetime).toBe("2024-12-25T10:00:00");
  expect(element.attributes?.id).toBe("event-time");
});

test("TimeElement.create - 子要素付き - time要素を作成する", () => {
  const children = [{ type: "text" as const, textContent: "December 25" }];
  const element = TimeElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("TimeElement.getId - id属性がある場合 - id属性を取得する", () => {
  const element = TimeElement.create({ id: "event-time" });
  expect(TimeElement.getId(element)).toBe("event-time");
});

test("TimeElement.getClass - class属性がある場合 - class属性を取得する", () => {
  const element = TimeElement.create({ class: "event-date" });
  expect(TimeElement.getClass(element)).toBe("event-date");
});

test("TimeElement.getStyle - style属性がある場合 - style属性を取得する", () => {
  const element = TimeElement.create({ style: "color: blue" });
  expect(TimeElement.getStyle(element)).toBe("color: blue");
});

test("TimeElement.getDatetime - datetime属性がある場合 - datetime属性を取得する", () => {
  const element = TimeElement.create({ datetime: "2024-12-25" });
  expect(TimeElement.getDatetime(element)).toBe("2024-12-25");
});

test("TimeElement.getDatetime - datetime属性がない場合 - undefinedを返す", () => {
  const element = TimeElement.create({});
  expect(TimeElement.getDatetime(element)).toBeUndefined();
});
