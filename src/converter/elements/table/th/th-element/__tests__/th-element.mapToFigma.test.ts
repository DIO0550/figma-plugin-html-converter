import { test, expect } from "vitest";
import { ThElement } from "../th-element";

test("ThElement.mapToFigma() - 有効なThElementをFigmaNodeConfigに変換する", () => {
  const element = ThElement.create();

  const config = ThElement.mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config!.name).toBe("th");
  expect(config!.type).toBe("FRAME");
});

test("ThElement.mapToFigma() - scope属性を持つth要素を変換する", () => {
  const element = ThElement.create({ scope: "col" });

  const config = ThElement.mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config!.name).toBe("th-col");
});

test("ThElement.mapToFigma() - 属性を持つth要素を変換する", () => {
  const element = ThElement.create({
    id: "header-1",
    style: "background-color: blue;",
  });

  const config = ThElement.mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config!.fills).toBeDefined();
});

test("ThElement.mapToFigma() - th以外の要素に対してnullを返す", () => {
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  const config = ThElement.mapToFigma(divElement);

  expect(config).toBeNull();
});

test("ThElement.mapToFigma() - td要素に対してnullを返す", () => {
  const tdElement = {
    type: "element",
    tagName: "td",
    attributes: {},
    children: [],
  };

  const config = ThElement.mapToFigma(tdElement);

  expect(config).toBeNull();
});

test("ThElement.mapToFigma() - nullに対してnullを返す", () => {
  const config = ThElement.mapToFigma(null);

  expect(config).toBeNull();
});

test("ThElement.mapToFigma() - undefinedに対してnullを返す", () => {
  const config = ThElement.mapToFigma(undefined);

  expect(config).toBeNull();
});

test("ThElement.mapToFigma() - 互換性のあるHTMLNodeをThElementに変換してからFigmaNodeConfigに変換する", () => {
  const htmlNode = {
    type: "element",
    tagName: "th",
    attributes: {
      scope: "row",
      style: "padding: 5px;",
    },
  };

  const config = ThElement.mapToFigma(htmlNode);

  expect(config).not.toBeNull();
  expect(config!.name).toBe("th-row");
  expect(config!.paddingTop).toBe(5);
});
