import { test, expect } from "vitest";
import { TdElement } from "../td-element";
import type { TdAttributes } from "../../td-attributes";

test("TdElement.create() - デフォルト属性で基本的なtd要素を作成する", () => {
  // Act
  const element = TdElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("td");
  expect(element.attributes).toBeDefined();
  expect(element.children).toEqual([]);
});

test("TdElement.create() - 指定された属性でtd要素を作成する", () => {
  // Arrange
  const attributes: TdAttributes = {
    id: "cell-1",
    className: "table-cell",
    width: "100px",
    height: "50px",
  };

  // Act
  const element = TdElement.create(attributes);

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("td");
  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual([]);
});

test("TdElement.create() - width 属性のみでtd要素を作成する", () => {
  // Act
  const element = TdElement.create({ width: "150px" });

  // Assert
  expect(element.attributes?.width).toBe("150px");
  expect(element.attributes?.height).toBeUndefined();
});

test("TdElement.create() - height 属性のみでtd要素を作成する", () => {
  // Act
  const element = TdElement.create({ height: "75px" });

  // Assert
  expect(element.attributes?.height).toBe("75px");
  expect(element.attributes?.width).toBeUndefined();
});

test("TdElement.create() - style 属性でtd要素を作成する", () => {
  // Act
  const element = TdElement.create({
    style: "border: 1px solid black; padding: 10px;",
  });

  // Assert
  expect(element.attributes?.style).toBe(
    "border: 1px solid black; padding: 10px;",
  );
});
