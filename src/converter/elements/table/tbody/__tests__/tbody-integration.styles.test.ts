import { test, expect } from "vitest";
import { TbodyElement } from "../tbody-element";

test("tbody要素がstyle属性を持つ場合、Figmaに変換される", () => {
  const tbody = TbodyElement.create({
    style: "background-color: #ffffff;",
  });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
});

test("tbody要素が複数のstyle属性を持つ場合、Figmaに変換される", () => {
  const tbody = TbodyElement.create({
    style: "background-color: #ffffff; font-size: 14px; color: #333;",
  });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
});

test("tbody要素がid、className、styleをすべて持つ場合", () => {
  const tbody = TbodyElement.create({
    id: "body-section",
    className: "striped-body",
    style: "background-color: #f9f9f9;",
  });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.name).toBe("tbody#body-section");
  expect(config.type).toBe("FRAME");
});

test("tbody要素がborderスタイルを持つ場合", () => {
  const tbody = TbodyElement.create({
    style: "border: 1px solid #ddd;",
  });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
});
