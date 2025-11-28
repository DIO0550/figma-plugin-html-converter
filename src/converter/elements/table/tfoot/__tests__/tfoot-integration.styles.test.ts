import { test, expect } from "vitest";
import { TfootElement } from "../tfoot-element";

test("tfoot要素がstyle属性を持つ場合、Figmaに変換される", () => {
  const tfoot = TfootElement.create({
    style: "background-color: #f0f0f0;",
  });

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tfoot");
});

test("tfoot要素が複数のstyle属性を持つ場合、Figmaに変換される", () => {
  const tfoot = TfootElement.create({
    style:
      "background-color: #f0f0f0; font-weight: bold; border-top: 2px solid #000;",
  });

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tfoot");
});

test("tfoot要素がid、className、styleをすべて持つ場合", () => {
  const tfoot = TfootElement.create({
    id: "footer-section",
    className: "total-footer",
    style: "background-color: #e9e9e9;",
  });

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.name).toBe("tfoot#footer-section");
  expect(config.type).toBe("FRAME");
});

test("tfoot要素がborderスタイルを持つ場合、strokesとstrokeWeightが設定される", () => {
  const tfoot = TfootElement.create({
    style: "border: 2px solid #333;",
  });

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tfoot");
  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBe(1);
  expect(config.strokeWeight).toBe(2);
});

test("tfoot要素がborder-topスタイルを持つ場合、セクション区切りの境界線として機能する", () => {
  const tfoot = TfootElement.create({
    style: "border-top: 2px solid #333;",
  });

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tfoot");
});

test("tfoot要素がborder-radiusスタイルを持つ場合、cornerRadiusとstrokes/strokeWeightが設定される", () => {
  const tfoot = TfootElement.create({
    style: "border: 1px solid #ddd; border-radius: 8px;",
  });

  const config = TfootElement.toFigmaNode(tfoot);

  expect(config.type).toBe("FRAME");
  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBe(1);
  expect(config.strokeWeight).toBe(1);
  expect(config.cornerRadius).toBe(8);
});
