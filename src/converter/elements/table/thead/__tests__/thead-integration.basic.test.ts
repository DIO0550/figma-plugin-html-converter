import { test, expect } from "vitest";
import { TheadElement } from "../thead-element";
import { TrElement } from "../../tr";

test("空のthead要素が作成されてFigmaに変換される", () => {
  const thead = TheadElement.create();

  const config = TheadElement.toFigmaNode(thead);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("thead");
  expect(config.children?.length ?? 0).toBe(0);
});

test("thead要素がid属性を持つ場合、Figmaノード名に反映される", () => {
  const thead = TheadElement.create({ id: "table-header" });

  const config = TheadElement.toFigmaNode(thead);

  expect(config.name).toBe("thead#table-header");
});

test("thead要素がclassName属性を持つ場合、正しく変換される", () => {
  const thead = TheadElement.create({ className: "sticky-header" });

  const config = TheadElement.toFigmaNode(thead);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("thead");
});

test("thead要素に1行のtr要素が含まれる", () => {
  const tr = TrElement.create();
  const thead: typeof TheadElement.prototype = {
    type: "element",
    tagName: "thead",
    attributes: {},
    children: [tr],
  };

  const config = TheadElement.toFigmaNode(thead);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("thead");
});
