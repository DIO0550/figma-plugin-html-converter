import { test, expect } from "vitest";
import { TbodyElement } from "../tbody-element";
import { TrElement } from "../../tr";

test("空のtbody要素が作成されてFigmaに変換される", () => {
  const tbody = TbodyElement.create();

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
  expect(config.children?.length ?? 0).toBe(0);
});

test("tbody要素がid属性を持つ場合、Figmaノード名に反映される", () => {
  const tbody = TbodyElement.create({ id: "table-body" });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.name).toBe("tbody#table-body");
});

test("tbody要素がclassName属性を持つ場合、正しく変換される", () => {
  const tbody = TbodyElement.create({ className: "striped-body" });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
});

test("tbody要素に1行のtr要素が含まれる", () => {
  const tr = TrElement.create();
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
