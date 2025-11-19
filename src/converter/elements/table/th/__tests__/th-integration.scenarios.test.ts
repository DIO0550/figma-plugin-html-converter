import { test, expect } from "vitest";
import { ThElement } from "../th-element";

test("テーブルヘッダー行のth要素を作成できる", () => {
  const headers = [
    ThElement.create({ scope: "col", abbr: "Name" }),
    ThElement.create({ scope: "col", abbr: "Age" }),
    ThElement.create({ scope: "col", abbr: "Email" }),
  ];

  const figmaNodes = headers.map((header) => ThElement.toFigmaNode(header));

  expect(figmaNodes).toHaveLength(3);
  figmaNodes.forEach((node) => {
    expect(node.type).toBe("FRAME");
    expect(node.name).toBe("th-col");
  });
});

test("行ヘッダーのth要素を作成できる", () => {
  const rowHeader = ThElement.create({
    scope: "row",
    style: "font-weight: bold; background-color: #e0e0e0;",
  });

  const figmaNode = ThElement.toFigmaNode(rowHeader);

  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.name).toBe("th-row");
});

test("結合セル(colspan)のth要素を作成できる", () => {
  const mergedHeader = ThElement.create({
    scope: "colgroup",
    colspan: "3",
    style: "text-align: center;",
  });

  const figmaNode = ThElement.toFigmaNode(mergedHeader);

  expect(figmaNode.type).toBe("FRAME");
  expect(figmaNode.name).toBe("th-colgroup");
});
