import { describe, test, expect } from "vitest";
import { TimeElement } from "../time-element";

describe("TimeElement.isTimeElement", () => {
  test("time要素の場合trueを返す", () => {
    const element = {
      type: "element",
      tagName: "time",
      attributes: {},
      children: [],
    };

    expect(TimeElement.isTimeElement(element)).toBe(true);
  });

  test("time要素（子要素なし）の場合もtrueを返す", () => {
    const element = {
      type: "element",
      tagName: "time",
      attributes: {},
    };

    expect(TimeElement.isTimeElement(element)).toBe(true);
  });

  test("datetime属性を持つtime要素の場合trueを返す", () => {
    const element = {
      type: "element",
      tagName: "time",
      attributes: { datetime: "2024-12-25" },
      children: [],
    };

    expect(TimeElement.isTimeElement(element)).toBe(true);
  });

  test("異なるタグ名の場合falseを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    expect(TimeElement.isTimeElement(element)).toBe(false);
  });

  test("異なるtypeの場合falseを返す", () => {
    const element = {
      type: "text",
      tagName: "time",
      attributes: {},
    };

    expect(TimeElement.isTimeElement(element)).toBe(false);
  });

  test("nullの場合falseを返す", () => {
    expect(TimeElement.isTimeElement(null)).toBe(false);
  });

  test("undefinedの場合falseを返す", () => {
    expect(TimeElement.isTimeElement(undefined)).toBe(false);
  });

  test("文字列の場合falseを返す", () => {
    expect(TimeElement.isTimeElement("time")).toBe(false);
  });

  test("必須プロパティが欠けている場合falseを返す", () => {
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
});

describe("TimeElement.create", () => {
  test("デフォルト値でtime要素を作成する", () => {
    const element = TimeElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("time");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("属性付きでtime要素を作成する", () => {
    const element = TimeElement.create({
      datetime: "2024-12-25T10:00:00",
      id: "event-time",
    });

    expect(element.attributes?.datetime).toBe("2024-12-25T10:00:00");
    expect(element.attributes?.id).toBe("event-time");
  });

  test("子要素付きでtime要素を作成する", () => {
    const children = [{ type: "text" as const, textContent: "December 25" }];
    const element = TimeElement.create({}, children);

    expect(element.children).toEqual(children);
  });
});

describe("TimeElement accessors", () => {
  test("getIdはid属性を取得する", () => {
    const element = TimeElement.create({ id: "event-time" });
    expect(TimeElement.getId(element)).toBe("event-time");
  });

  test("getClassはclass属性を取得する", () => {
    const element = TimeElement.create({ class: "event-date" });
    expect(TimeElement.getClass(element)).toBe("event-date");
  });

  test("getStyleはstyle属性を取得する", () => {
    const element = TimeElement.create({ style: "color: blue" });
    expect(TimeElement.getStyle(element)).toBe("color: blue");
  });

  test("getDatetimeはdatetime属性を取得する", () => {
    const element = TimeElement.create({ datetime: "2024-12-25" });
    expect(TimeElement.getDatetime(element)).toBe("2024-12-25");
  });

  test("datetime属性がない場合undefinedを返す", () => {
    const element = TimeElement.create({});
    expect(TimeElement.getDatetime(element)).toBeUndefined();
  });
});
