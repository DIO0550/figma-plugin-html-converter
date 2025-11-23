import { test, expect } from "vitest";
import { TbodyElement } from "../tbody-element";
import { TrElement } from "../../tr";
import { TdElement } from "../../td";

test("tbodyがtr要素とtd要素を含むテーブルボディとして機能する", () => {
  const td1 = TdElement.create();
  const td2 = TdElement.create();
  const tr: TrElement = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [td1, td2],
  };
  const tbody: TbodyElement = {
    type: "element",
    tagName: "tbody",
    attributes: {},
    children: [tr],
  };

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
});

test("tbody要素が複数のtr要素を含む", () => {
  const tr1 = TrElement.create();
  const tr2 = TrElement.create();
  const tbody: TbodyElement = {
    type: "element",
    tagName: "tbody",
    attributes: {},
    children: [tr1, tr2],
  };

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
});

test("tbody要素にid属性とclassName属性が両方ある場合", () => {
  const tbody = TbodyElement.create({
    id: "data-body",
    className: "table-body-section",
  });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.name).toBe("tbody#data-body");
  expect(config.type).toBe("FRAME");
});
