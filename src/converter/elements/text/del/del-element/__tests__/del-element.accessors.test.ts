import { test, expect } from "vitest";
import { DelElement } from "../del-element";

test("DelElement.getId - ID属性を取得できる", () => {
  const element = DelElement.create({ id: "del-1" });
  expect(DelElement.getId(element)).toBe("del-1");
});

test("DelElement.getId - ID属性がない場合はundefinedを返す", () => {
  const element = DelElement.create({});
  expect(DelElement.getId(element)).toBeUndefined();
});

test("DelElement.getId - 空文字のIDも取得できる", () => {
  const element = DelElement.create({ id: "" });
  expect(DelElement.getId(element)).toBe("");
});

test("DelElement.getClass - class属性を取得できる", () => {
  const element = DelElement.create({ class: "deleted-text" });
  expect(DelElement.getClass(element)).toBe("deleted-text");
});

test("DelElement.getClass - class属性がない場合はundefinedを返す", () => {
  const element = DelElement.create({});
  expect(DelElement.getClass(element)).toBeUndefined();
});

test("DelElement.getClass - 複数のクラスを取得できる", () => {
  const element = DelElement.create({ class: "deleted old obsolete" });
  expect(DelElement.getClass(element)).toBe("deleted old obsolete");
});

test("DelElement.getStyle - style属性を取得できる", () => {
  const element = DelElement.create({
    style: "text-decoration: line-through;",
  });
  expect(DelElement.getStyle(element)).toBe("text-decoration: line-through;");
});

test("DelElement.getStyle - style属性がない場合はundefinedを返す", () => {
  const element = DelElement.create({});
  expect(DelElement.getStyle(element)).toBeUndefined();
});

test("DelElement.getStyle - 複雑なスタイルも取得できる", () => {
  const style = "color: red; text-decoration: line-through; opacity: 0.5;";
  const element = DelElement.create({ style });
  expect(DelElement.getStyle(element)).toBe(style);
});

test("DelElement.getCite - cite属性を取得できる", () => {
  const element = DelElement.create({
    cite: "https://example.com/reason",
  });
  expect(DelElement.getCite(element)).toBe("https://example.com/reason");
});

test("DelElement.getCite - cite属性がない場合はundefinedを返す", () => {
  const element = DelElement.create({});
  expect(DelElement.getCite(element)).toBeUndefined();
});

test("DelElement.getCite - 相対URLのcite属性も取得できる", () => {
  const element = DelElement.create({ cite: "/changelog#v2.0" });
  expect(DelElement.getCite(element)).toBe("/changelog#v2.0");
});

test("DelElement.getCite - 空文字のcite属性も取得できる", () => {
  const element = DelElement.create({ cite: "" });
  expect(DelElement.getCite(element)).toBe("");
});

test("DelElement.getDatetime - datetime属性を取得できる", () => {
  const element = DelElement.create({
    datetime: "2024-01-01T12:00:00Z",
  });
  expect(DelElement.getDatetime(element)).toBe("2024-01-01T12:00:00Z");
});

test("DelElement.getDatetime - datetime属性がない場合はundefinedを返す", () => {
  const element = DelElement.create({});
  expect(DelElement.getDatetime(element)).toBeUndefined();
});

test("DelElement.getDatetime - 日付のみのdatetime属性も取得できる", () => {
  const element = DelElement.create({ datetime: "2024-01-01" });
  expect(DelElement.getDatetime(element)).toBe("2024-01-01");
});

test("DelElement.getDatetime - 時刻のみのdatetime属性も取得できる", () => {
  const element = DelElement.create({ datetime: "12:00:00" });
  expect(DelElement.getDatetime(element)).toBe("12:00:00");
});

test("DelElement - すべての属性を同時に取得できる", () => {
  const element = DelElement.create({
    id: "del-1",
    class: "deleted",
    style: "color: red;",
    cite: "https://example.com",
    datetime: "2024-01-01",
  });

  expect(DelElement.getId(element)).toBe("del-1");
  expect(DelElement.getClass(element)).toBe("deleted");
  expect(DelElement.getStyle(element)).toBe("color: red;");
  expect(DelElement.getCite(element)).toBe("https://example.com");
  expect(DelElement.getDatetime(element)).toBe("2024-01-01");
});

test("DelElement - 一部の属性のみ持つ要素から正しく取得できる", () => {
  const element = DelElement.create({
    id: "del-2",
    cite: "https://example.com",
  });

  expect(DelElement.getId(element)).toBe("del-2");
  expect(DelElement.getClass(element)).toBeUndefined();
  expect(DelElement.getStyle(element)).toBeUndefined();
  expect(DelElement.getCite(element)).toBe("https://example.com");
  expect(DelElement.getDatetime(element)).toBeUndefined();
});
