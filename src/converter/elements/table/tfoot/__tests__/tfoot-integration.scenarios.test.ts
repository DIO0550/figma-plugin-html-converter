import { test, expect } from "vitest";
import { TfootElement } from "../tfoot-element";
import { TrElement } from "../../tr";
import { TdElement } from "../../td";

test("tfootがtr要素とtd要素を含むテーブルフッターとして機能する", () => {
  const td1 = TdElement.create();
  const td2 = TdElement.create();
  const tr: TrElement = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [td1, td2],
  };
  const tfoot: TfootElement = {
    type: "element",
    tagName: "tfoot",
    attributes: {},
    children: [tr],
  };

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tfoot");
});

test("tfoot要素が複数のtr要素を含む", () => {
  const tr1 = TrElement.create();
  const tr2 = TrElement.create();
  const tfoot: TfootElement = {
    type: "element",
    tagName: "tfoot",
    attributes: {},
    children: [tr1, tr2],
  };

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tfoot");
});

test("tfoot要素にid属性とclassName属性が両方ある場合", () => {
  const tfoot = TfootElement.create({
    id: "summary-footer",
    className: "table-footer-section",
  });

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.name).toBe("tfoot#summary-footer");
  expect(config.type).toBe("FRAME");
});
