import { test, expect } from "vitest";
import { TdElement } from "../td-element";

test("TdElement.mapToFigma() - 有効なTdElementをFigmaNodeConfigに変換する", () => {
  // Arrange
  const element = TdElement.create();

  // Act
  const config = TdElement.mapToFigma(element);

  // Assert
  expect(config).not.toBeNull();
  expect(config!.name).toBe("td");
  expect(config!.type).toBe("FRAME");
});

test("TdElement.mapToFigma() - 属性を持つtd要素を変換する", () => {
  // Arrange
  const element = TdElement.create({
    id: "cell-1",
    style: "background-color: blue;",
  });

  // Act
  const config = TdElement.mapToFigma(element);

  // Assert
  expect(config).not.toBeNull();
  expect(config!.fills).toBeDefined();
});

test("TdElement.mapToFigma() - td以外の要素に対してnullを返す", () => {
  // Arrange
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  // Act
  const config = TdElement.mapToFigma(divElement);

  // Assert
  expect(config).toBeNull();
});

test("TdElement.mapToFigma() - nullに対してnullを返す", () => {
  // Act
  const config = TdElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});

test("TdElement.mapToFigma() - undefinedに対してnullを返す", () => {
  // Act
  const config = TdElement.mapToFigma(undefined);

  // Assert
  expect(config).toBeNull();
});

test("TdElement.mapToFigma() - 互換性のあるHTMLNodeをTdElementに変換してからFigmaNodeConfigに変換する", () => {
  // Arrange
  const htmlNode = {
    type: "element",
    tagName: "td",
    attributes: {
      style: "padding: 5px;",
    },
  };

  // Act
  const config = TdElement.mapToFigma(htmlNode);

  // Assert
  expect(config).not.toBeNull();
  expect(config!.name).toBe("td");
  expect(config!.paddingTop).toBe(5);
});
