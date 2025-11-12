import { test, expect } from "vitest";
import { SubConverter } from "../sub-converter";
import { SubElement } from "../../sub-element";
import { createSubElement, createTextNode } from "./test-helpers";

test("SubConverter.mapToFigma() - 正しいsub要素を変換する", () => {
  const element = SubElement.create({}, [createTextNode("test")]);
  const result = SubConverter.mapToFigma(element);
  expect(result).not.toBeNull();
  expect(result?.type).toBe("TEXT");
});

test("SubConverter.mapToFigma() - 型ガード: 正しくないオブジェクトに対してnullを返す", () => {
  const invalidElement = { type: "element", tagName: "div" };
  const result = SubConverter.mapToFigma(invalidElement);
  expect(result).toBeNull();
});

test("SubConverter.mapToFigma() - 型ガード: null入力に対してnullを返す", () => {
  const result = SubConverter.mapToFigma(null);
  expect(result).toBeNull();
});

test("SubConverter.mapToFigma() - 型ガード: undefined入力に対してnullを返す", () => {
  const result = SubConverter.mapToFigma(undefined);
  expect(result).toBeNull();
});

test("SubConverter.mapToFigma() - 型ガード: 文字列入力に対してnullを返す", () => {
  const result = SubConverter.mapToFigma("not a sub element");
  expect(result).toBeNull();
});

test("SubConverter.mapToFigma() - 型ガード: 数値入力に対してnullを返す", () => {
  const result = SubConverter.mapToFigma(123);
  expect(result).toBeNull();
});

test("SubConverter.mapToFigma() - 型ガード: 配列入力に対してnullを返す", () => {
  const result = SubConverter.mapToFigma([]);
  expect(result).toBeNull();
});

test("SubConverter.mapToFigma() - 型ガード: 空のオブジェクトに対してnullを返す", () => {
  const result = SubConverter.mapToFigma({});
  expect(result).toBeNull();
});

test("SubConverter.mapToFigma() - 型ガード: 異なるtagNameを持つ要素に対してnullを返す", () => {
  const result = SubConverter.mapToFigma({
    type: "element",
    tagName: "sup",
  });
  expect(result).toBeNull();
});

test("SubConverter.mapToFigma() - 属性を持つsub要素を変換する", () => {
  const element = createSubElement({ id: "test-id", class: "test-class" }, [
    createTextNode("content"),
  ]);
  const result = SubConverter.mapToFigma(element);
  expect(result).not.toBeNull();
  expect(result?.name).toContain("test-id");
});
