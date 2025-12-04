import { test, expect } from "vitest";
import {
  CircleElement,
  RectElement,
  LineElement,
  EllipseElement,
} from "../index";

// 複数図形の同時変換
test("SVG基本図形統合テスト - circle, rect, line, ellipseを同時に変換 - 全要素が正しいノードタイプで変換される", () => {
  // Arrange
  const circle = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
    fill: "#ff0000",
  });

  const rect = RectElement.create({
    x: 100,
    y: 10,
    width: 80,
    height: 40,
    fill: "#00ff00",
  });

  const line = LineElement.create({
    x1: 200,
    y1: 10,
    x2: 280,
    y2: 50,
    stroke: "#0000ff",
    "stroke-width": 2,
  });

  const ellipse = EllipseElement.create({
    cx: 350,
    cy: 30,
    rx: 40,
    ry: 20,
    fill: "#ffff00",
  });

  // Act
  const circleConfig = CircleElement.toFigmaNode(circle);
  const rectConfig = RectElement.toFigmaNode(rect);
  const lineConfig = LineElement.toFigmaNode(line);
  const ellipseConfig = EllipseElement.toFigmaNode(ellipse);

  // Assert
  expect(circleConfig.name).toBe("circle");
  expect(rectConfig.name).toBe("rect");
  expect(lineConfig.name).toBe("line");
  expect(ellipseConfig.name).toBe("ellipse");

  expect(circleConfig.type).toBe("RECTANGLE");
  expect(rectConfig.type).toBe("RECTANGLE");
  expect(lineConfig.type).toBe("FRAME");
  expect(ellipseConfig.type).toBe("RECTANGLE");
});

// スタイル属性の一貫性テスト
test("SVG基本図形統合テスト - 全図形に同一fillを設定 - 全図形でfillが正しく適用される", () => {
  // Arrange
  const fillColor = "#ff5500";

  const circle = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
    fill: fillColor,
  });

  const rect = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    fill: fillColor,
  });

  const ellipse = EllipseElement.create({
    cx: 50,
    cy: 25,
    rx: 50,
    ry: 25,
    fill: fillColor,
  });

  // Act
  const circleConfig = CircleElement.toFigmaNode(circle);
  const rectConfig = RectElement.toFigmaNode(rect);
  const ellipseConfig = EllipseElement.toFigmaNode(ellipse);

  // Assert
  expect(circleConfig.fills?.length).toBe(1);
  expect(rectConfig.fills?.length).toBe(1);
  expect(ellipseConfig.fills?.length).toBe(1);
});

test("SVG基本図形統合テスト - 全図形に同一strokeを設定 - 全図形でstrokeが正しく適用される", () => {
  // Arrange
  const strokeColor = "#0000ff";
  const strokeWidth = 3;

  const circle = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
    fill: "none",
    stroke: strokeColor,
    "stroke-width": strokeWidth,
  });

  const rect = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    fill: "none",
    stroke: strokeColor,
    "stroke-width": strokeWidth,
  });

  const line = LineElement.create({
    x1: 0,
    y1: 0,
    x2: 100,
    y2: 50,
    stroke: strokeColor,
    "stroke-width": strokeWidth,
  });

  const ellipse = EllipseElement.create({
    cx: 50,
    cy: 25,
    rx: 50,
    ry: 25,
    fill: "none",
    stroke: strokeColor,
    "stroke-width": strokeWidth,
  });

  // Act
  const circleConfig = CircleElement.toFigmaNode(circle);
  const rectConfig = RectElement.toFigmaNode(rect);
  const lineConfig = LineElement.toFigmaNode(line);
  const ellipseConfig = EllipseElement.toFigmaNode(ellipse);

  // Assert
  expect(circleConfig.strokes?.length).toBe(1);
  expect(circleConfig.strokeWeight).toBe(strokeWidth);

  expect(rectConfig.strokes?.length).toBe(1);
  expect(rectConfig.strokeWeight).toBe(strokeWidth);

  expect(lineConfig.strokes?.length).toBe(1);
  expect(lineConfig.strokeWeight).toBe(strokeWidth);

  expect(ellipseConfig.strokes?.length).toBe(1);
  expect(ellipseConfig.strokeWeight).toBe(strokeWidth);
});

test("SVG基本図形統合テスト - 全図形にfill='none'を設定 - 全図形のfillが空になる", () => {
  // Arrange
  const circle = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
    fill: "none",
  });

  const rect = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    fill: "none",
  });

  const ellipse = EllipseElement.create({
    cx: 50,
    cy: 25,
    rx: 50,
    ry: 25,
    fill: "none",
  });

  // Act
  const circleConfig = CircleElement.toFigmaNode(circle);
  const rectConfig = RectElement.toFigmaNode(rect);
  const ellipseConfig = EllipseElement.toFigmaNode(ellipse);

  // Assert
  expect(circleConfig.fills?.length).toBe(0);
  expect(rectConfig.fills?.length).toBe(0);
  expect(ellipseConfig.fills?.length).toBe(0);
});

// mapToFigma関数の互換性テスト
test("SVG基本図形統合テスト - HTMLNodeライクなオブジェクトをマッピング - 各要素が正しい型で変換される", () => {
  // Arrange
  const circleNode = {
    type: "element",
    tagName: "circle",
    attributes: { cx: "50", cy: "50", r: "25" },
  };

  const rectNode = {
    type: "element",
    tagName: "rect",
    attributes: { x: "0", y: "0", width: "100", height: "50" },
  };

  const lineNode = {
    type: "element",
    tagName: "line",
    attributes: { x1: "0", y1: "0", x2: "100", y2: "50" },
  };

  const ellipseNode = {
    type: "element",
    tagName: "ellipse",
    attributes: { cx: "50", cy: "25", rx: "50", ry: "25" },
  };

  // Act & Assert
  expect(CircleElement.mapToFigma(circleNode)).not.toBeNull();
  expect(CircleElement.mapToFigma(rectNode)).toBeNull();

  expect(RectElement.mapToFigma(rectNode)).not.toBeNull();
  expect(RectElement.mapToFigma(circleNode)).toBeNull();

  expect(LineElement.mapToFigma(lineNode)).not.toBeNull();
  expect(LineElement.mapToFigma(circleNode)).toBeNull();

  expect(EllipseElement.mapToFigma(ellipseNode)).not.toBeNull();
  expect(EllipseElement.mapToFigma(circleNode)).toBeNull();
});

// 座標変換の正確性テスト
test("SVG基本図形統合テスト - circle/ellipseの中心座標変換 - 境界ボックスが正しく計算される", () => {
  // Arrange
  const circle = CircleElement.create({
    cx: 100,
    cy: 100,
    r: 50,
  });

  const ellipse = EllipseElement.create({
    cx: 100,
    cy: 100,
    rx: 80,
    ry: 40,
  });

  // Act
  const circleConfig = CircleElement.toFigmaNode(circle);
  const ellipseConfig = EllipseElement.toFigmaNode(ellipse);

  // Assert
  expect(circleConfig.x).toBe(50);
  expect(circleConfig.y).toBe(50);
  expect(circleConfig.width).toBe(100);
  expect(circleConfig.height).toBe(100);

  expect(ellipseConfig.x).toBe(20);
  expect(ellipseConfig.y).toBe(60);
  expect(ellipseConfig.width).toBe(160);
  expect(ellipseConfig.height).toBe(80);
});

test("SVG基本図形統合テスト - lineの始点・終点座標変換 - 境界ボックスが正しく計算される", () => {
  // Arrange
  const line = LineElement.create({
    x1: 10,
    y1: 20,
    x2: 100,
    y2: 80,
  });

  // Act
  const lineConfig = LineElement.toFigmaNode(line);

  // Assert
  expect(lineConfig.x).toBe(10);
  expect(lineConfig.y).toBe(20);
  expect(lineConfig.width).toBe(90);
  expect(lineConfig.height).toBe(60);
});

test("SVG基本図形統合テスト - rectの左上座標変換 - 座標がそのまま設定される", () => {
  // Arrange
  const rect = RectElement.create({
    x: 10,
    y: 20,
    width: 100,
    height: 50,
  });

  // Act
  const rectConfig = RectElement.toFigmaNode(rect);

  // Assert
  expect(rectConfig.x).toBe(10);
  expect(rectConfig.y).toBe(20);
  expect(rectConfig.width).toBe(100);
  expect(rectConfig.height).toBe(50);
});
