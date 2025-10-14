import { test, expect } from "vitest";
import { InsElement } from "../ins-element";

test("InsElement.getId - ID属性を取得できる", () => {
  const element = InsElement.create({ id: "ins-1" });
  expect(InsElement.getId(element)).toBe("ins-1");
});

test("InsElement.getId - ID属性がない場合はundefinedを返す", () => {
  const element = InsElement.create({});
  expect(InsElement.getId(element)).toBeUndefined();
});

test("InsElement.getId - 空文字のIDも取得できる", () => {
  const element = InsElement.create({ id: "" });
  expect(InsElement.getId(element)).toBe("");
});

test("InsElement.getClass - class属性を取得できる", () => {
  const element = InsElement.create({ class: "inserted-text" });
  expect(InsElement.getClass(element)).toBe("inserted-text");
});

test("InsElement.getClass - class属性がない場合はundefinedを返す", () => {
  const element = InsElement.create({});
  expect(InsElement.getClass(element)).toBeUndefined();
});

test("InsElement.getClass - 複数のクラスを取得できる", () => {
  const element = InsElement.create({ class: "inserted old obsolete" });
  expect(InsElement.getClass(element)).toBe("inserted old obsolete");
});

test("InsElement.getStyle - style属性を取得できる", () => {
  const element = InsElement.create({
    style: "text-decoration: line-through;",
  });
  expect(InsElement.getStyle(element)).toBe("text-decoration: line-through;");
});

test("InsElement.getStyle - style属性がない場合はundefinedを返す", () => {
  const element = InsElement.create({});
  expect(InsElement.getStyle(element)).toBeUndefined();
});

test("InsElement.getStyle - 複雑なスタイルも取得できる", () => {
  const style = "color: red; text-decoration: line-through; opacity: 0.5;";
  const element = InsElement.create({ style });
  expect(InsElement.getStyle(element)).toBe(style);
});

test("InsElement.getCite - cite属性を取得できる", () => {
  const element = InsElement.create({
    cite: "https://example.com/reason",
  });
  expect(InsElement.getCite(element)).toBe("https://example.com/reason");
});

test("InsElement.getCite - cite属性がない場合はundefinedを返す", () => {
  const element = InsElement.create({});
  expect(InsElement.getCite(element)).toBeUndefined();
});

test("InsElement.getCite - 相対URLのcite属性も取得できる", () => {
  const element = InsElement.create({ cite: "/changelog#v2.0" });
  expect(InsElement.getCite(element)).toBe("/changelog#v2.0");
});

test("InsElement.getCite - 空文字のcite属性も取得できる", () => {
  const element = InsElement.create({ cite: "" });
  expect(InsElement.getCite(element)).toBe("");
});

test("InsElement.getDatetime - datetime属性を取得できる", () => {
  const element = InsElement.create({
    datetime: "2024-01-01T12:00:00Z",
  });
  expect(InsElement.getDatetime(element)).toBe("2024-01-01T12:00:00Z");
});

test("InsElement.getDatetime - datetime属性がない場合はundefinedを返す", () => {
  const element = InsElement.create({});
  expect(InsElement.getDatetime(element)).toBeUndefined();
});

test("InsElement.getDatetime - 日付のみのdatetime属性も取得できる", () => {
  const element = InsElement.create({ datetime: "2024-01-01" });
  expect(InsElement.getDatetime(element)).toBe("2024-01-01");
});

test("InsElement.getDatetime - 時刻のみのdatetime属性も取得できる", () => {
  const element = InsElement.create({ datetime: "12:00:00" });
  expect(InsElement.getDatetime(element)).toBe("12:00:00");
});

test("InsElement - すべての属性を同時に取得できる", () => {
  const element = InsElement.create({
    id: "ins-1",
    class: "inserted",
    style: "color: red;",
    cite: "https://example.com",
    datetime: "2024-01-01",
  });

  expect(InsElement.getId(element)).toBe("ins-1");
  expect(InsElement.getClass(element)).toBe("inserted");
  expect(InsElement.getStyle(element)).toBe("color: red;");
  expect(InsElement.getCite(element)).toBe("https://example.com");
  expect(InsElement.getDatetime(element)).toBe("2024-01-01");
});

test("InsElement - 一部の属性のみ持つ要素から正しく取得できる", () => {
  const element = InsElement.create({
    id: "ins-2",
    cite: "https://example.com",
  });

  expect(InsElement.getId(element)).toBe("ins-2");
  expect(InsElement.getClass(element)).toBeUndefined();
  expect(InsElement.getStyle(element)).toBeUndefined();
  expect(InsElement.getCite(element)).toBe("https://example.com");
  expect(InsElement.getDatetime(element)).toBeUndefined();
});
