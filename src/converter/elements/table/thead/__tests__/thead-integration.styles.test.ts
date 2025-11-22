import { test, expect } from "vitest";
import { TheadElement } from "../thead-element";

test("thead要素がstyle属性を持つ場合、Figmaに変換される", () => {
  const thead = TheadElement.create({
    style: "background-color: #f0f0f0;",
  });

  const config = TheadElement.toFigmaNode(thead);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("thead");
});

test("thead要素が複数のstyle属性を持つ場合、Figmaに変換される", () => {
  const thead = TheadElement.create({
    style:
      "background-color: #f0f0f0; border-bottom: 2px solid black; font-weight: bold;",
  });

  const config = TheadElement.toFigmaNode(thead);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("thead");
});

test("thead要素がid、className、styleをすべて持つ場合", () => {
  const thead = TheadElement.create({
    id: "header-section",
    className: "sticky-header",
    style: "position: sticky; top: 0; z-index: 10;",
  });

  const config = TheadElement.toFigmaNode(thead);

  expect(config.name).toBe("thead#header-section");
  expect(config.type).toBe("FRAME");
});

test("thead要素がborder-bottomスタイルを持つ場合", () => {
  const thead = TheadElement.create({
    style: "border-bottom: 2px solid #333;",
  });

  const config = TheadElement.toFigmaNode(thead);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("thead");
});
