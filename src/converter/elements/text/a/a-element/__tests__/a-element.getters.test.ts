import { test, expect } from "vitest";
import { AElement } from "../a-element";
import { createAElement } from "./test-helpers";

test("AElement.getHref() - href属性が存在する場合その値を返す", () => {
  const element = createAElement({
    attributes: { href: "https://example.com" },
  });

  const result = AElement.getHref(element);

  expect(result).toBe("https://example.com");
});

test("AElement.getHref() - href属性が空文字列の場合空文字列を返す", () => {
  const element = createAElement({
    attributes: { href: "" },
  });

  const result = AElement.getHref(element);

  expect(result).toBe("");
});

test("AElement.getHref() - href属性が存在しない場合undefinedを返す", () => {
  const element = createAElement({
    attributes: { target: "_blank" },
  });

  const result = AElement.getHref(element);

  expect(result).toBeUndefined();
});

test("AElement.getHref() - attributes自体が存在しない場合undefinedを返す", () => {
  const element = createAElement();

  const result = AElement.getHref(element);

  expect(result).toBeUndefined();
});

test("AElement.getHref() - 特殊文字を含むhref値を正しく取得できる", () => {
  const specialUrl = "https://example.com/path?q=test&foo=bar#section";
  const element = createAElement({
    attributes: { href: specialUrl },
  });

  const result = AElement.getHref(element);

  expect(result).toBe(specialUrl);
});

test("AElement.getTarget() - target属性が存在する場合その値を返す", () => {
  const element = createAElement({
    attributes: { target: "_blank" },
  });

  const result = AElement.getTarget(element);

  expect(result).toBe("_blank");
});

test("AElement.getTarget() - カスタムtarget値を返す", () => {
  const element = createAElement({
    attributes: { target: "myFrame" },
  });

  const result = AElement.getTarget(element);

  expect(result).toBe("myFrame");
});

test("AElement.getTarget() - target属性が存在しない場合undefinedを返す", () => {
  const element = createAElement({
    attributes: { href: "https://example.com" },
  });

  const result = AElement.getTarget(element);

  expect(result).toBeUndefined();
});

test("AElement.getStyle() - style属性が存在する場合その値を返す", () => {
  const styleValue = "color: blue; text-decoration: underline;";
  const element = createAElement({
    attributes: { style: styleValue },
  });

  const result = AElement.getStyle(element);

  expect(result).toBe(styleValue);
});

test("AElement.getStyle() - style属性が空文字列の場合空文字列を返す", () => {
  const element = createAElement({
    attributes: { style: "" },
  });

  const result = AElement.getStyle(element);

  expect(result).toBe("");
});

test("AElement.getStyle() - style属性が存在しない場合undefinedを返す", () => {
  const element = createAElement({
    attributes: { href: "#" },
  });

  const result = AElement.getStyle(element);

  expect(result).toBeUndefined();
});
