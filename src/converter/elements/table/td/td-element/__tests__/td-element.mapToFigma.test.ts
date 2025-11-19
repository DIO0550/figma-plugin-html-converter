import { test, expect } from "vitest";
import { TdElement } from "../td-element";

test("TdElement.mapToFigma() - 有効なTdElementをFigmaNodeConfigに変換する", () => {
  const element = TdElement.create();

  const config = TdElement.mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config!.name).toBe("td");
  expect(config!.type).toBe("FRAME");
});

test("TdElement.mapToFigma() - 属性を持つtd要素を変換する", () => {
  const element = TdElement.create({
    id: "cell-1",
    style: "background-color: blue;",
  });

  const config = TdElement.mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config!.fills).toBeDefined();
});

test("TdElement.mapToFigma() - td以外の要素に対してnullを返す", () => {
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  const config = TdElement.mapToFigma(divElement);

  expect(config).toBeNull();
});

test("TdElement.mapToFigma() - nullに対してnullを返す", () => {
  const config = TdElement.mapToFigma(null);

  expect(config).toBeNull();
});

test("TdElement.mapToFigma() - undefinedに対してnullを返す", () => {
  const config = TdElement.mapToFigma(undefined);

  expect(config).toBeNull();
});

test("TdElement.mapToFigma() - 互換性のあるHTMLNodeをTdElementに変換してからFigmaNodeConfigに変換する", () => {
  const htmlNode = {
    type: "element",
    tagName: "td",
    attributes: {
      style: "padding: 5px;",
    },
  };

  const config = TdElement.mapToFigma(htmlNode);

  expect(config).not.toBeNull();
  expect(config!.name).toBe("td");
  expect(config!.paddingTop).toBe(5);
});
