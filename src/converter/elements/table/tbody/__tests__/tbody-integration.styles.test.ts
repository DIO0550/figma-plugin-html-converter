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

test("tbody要素がborderスタイルを持つ場合、strokesとstrokeWeightが設定される", () => {
  const tbody = TbodyElement.create({
    style: "border: 1px solid #ddd;",
  });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBe(1);
  expect(config.strokeWeight).toBe(1);
});

test("tbody要素が異なる太さのborderスタイルを持つ場合、strokeWeightが正しく設定される", () => {
  const tbody = TbodyElement.create({
    style: "border: 2px solid #000;",
  });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBe(1);
  expect(config.strokeWeight).toBe(2);
});

test("tbody要素がborder-radiusスタイルを持つ場合、cornerRadiusとstrokes/strokeWeightが設定される", () => {
  const tbody = TbodyElement.create({
    style: "border: 1px solid #ddd; border-radius: 4px;",
  });

  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe("FRAME");
  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBe(1);
  expect(config.strokeWeight).toBe(1);
  expect(config.cornerRadius).toBe(4);
});
