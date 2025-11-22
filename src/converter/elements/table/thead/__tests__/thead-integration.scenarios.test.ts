import { test, expect } from "vitest";
import { TheadElement } from "../thead-element";
import { TrElement } from "../../tr";
import { ThElement } from "../../th"; // th要素のテストで使用

test("theadがtr要素とth要素を含むテーブルヘッダーとして機能する", () => {
  const th1 = ThElement.create({ scope: "col" });
  const th2 = ThElement.create({ scope: "col" });
  const tr: typeof TrElement.prototype = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [th1, th2],
  };
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

test("thead要素が複数のtr要素を含む", () => {
  const tr1 = TrElement.create();
  const tr2 = TrElement.create();
  const thead: typeof TheadElement.prototype = {
    type: "element",
    tagName: "thead",
    attributes: {},
    children: [tr1, tr2],
  };

  const config = TheadElement.toFigmaNode(thead);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("thead");
});

test("thead要素にid属性とclassName属性が両方ある場合", () => {
  const thead = TheadElement.create({
    id: "main-header",
    className: "table-header-section",
  });

  const config = TheadElement.toFigmaNode(thead);

  expect(config.name).toBe("thead#main-header");
  expect(config.type).toBe("FRAME");
});
