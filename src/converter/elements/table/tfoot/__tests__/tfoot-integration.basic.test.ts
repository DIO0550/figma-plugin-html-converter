import { test, expect } from "vitest";
import { TfootElement } from "../tfoot-element";
import { TrElement } from "../../tr";

test("空のtfoot要素が作成されてFigmaに変換される", () => {
  const tfoot = TfootElement.create();

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tfoot");
  expect(config.children?.length ?? 0).toBe(0);
});

test("tfoot要素がid属性を持つ場合、Figmaノード名に反映される", () => {
  const tfoot = TfootElement.create({ id: "table-footer" });

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.name).toBe("tfoot#table-footer");
});

test("tfoot要素がclassName属性を持つ場合、正しく変換される", () => {
  const tfoot = TfootElement.create({ className: "total-footer" });

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tfoot");
});

test("tfoot要素に1行のtr要素が含まれる", () => {
  const tr = TrElement.create();
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
