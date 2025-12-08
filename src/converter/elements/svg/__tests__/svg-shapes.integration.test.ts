import { test, expect } from "vitest";
import {
  CircleElement,
  RectElement,
  LineElement,
  EllipseElement,
  PathElement,
  PolygonElement,
  PolylineElement,
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

  // Act
  const circleResult = CircleElement.mapToFigma(circleNode);
  const circleFromRect = CircleElement.mapToFigma(rectNode);
  const rectResult = RectElement.mapToFigma(rectNode);
  const rectFromCircle = RectElement.mapToFigma(circleNode);
  const lineResult = LineElement.mapToFigma(lineNode);
  const lineFromCircle = LineElement.mapToFigma(circleNode);
  const ellipseResult = EllipseElement.mapToFigma(ellipseNode);
  const ellipseFromCircle = EllipseElement.mapToFigma(circleNode);

  // Assert
  expect(circleResult).not.toBeNull();
  expect(circleFromRect).toBeNull();
  expect(rectResult).not.toBeNull();
  expect(rectFromCircle).toBeNull();
  expect(lineResult).not.toBeNull();
  expect(lineFromCircle).toBeNull();
  expect(ellipseResult).not.toBeNull();
  expect(ellipseFromCircle).toBeNull();
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

// PathElement統合テスト
test("SVG図形統合テスト - pathを含む全図形を変換 - 全要素が正しいノードタイプで変換される", () => {
  // Arrange
  const path = PathElement.create({
    d: "M10 20 L50 80 L90 20 Z",
    fill: "#ff0000",
  });

  const circle = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
    fill: "#00ff00",
  });

  // Act
  const pathConfig = PathElement.toFigmaNode(path);
  const circleConfig = CircleElement.toFigmaNode(circle);

  // Assert
  expect(pathConfig.name).toBe("path");
  expect(pathConfig.type).toBe("FRAME");
  expect(circleConfig.name).toBe("circle");
  expect(circleConfig.type).toBe("RECTANGLE");
});

test("SVG図形統合テスト - pathにfillとstrokeを設定 - fillsとstrokesが正しく適用される", () => {
  // Arrange
  const path = PathElement.create({
    d: "M0 0 L100 0 L100 50 L0 50 Z",
    fill: "#ff5500",
    stroke: "#0000ff",
    "stroke-width": 2,
  });

  // Act
  const pathConfig = PathElement.toFigmaNode(path);

  // Assert
  expect(pathConfig.fills?.length).toBe(1);
  expect(pathConfig.strokes?.length).toBe(1);
  expect(pathConfig.strokeWeight).toBe(2);
});

test("SVG図形統合テスト - pathのHTMLNodeライクなオブジェクトをマッピング - FigmaNodeConfigを返す", () => {
  // Arrange
  const pathNode = {
    type: "element",
    tagName: "path",
    attributes: { d: "M0 0 L100 100", fill: "#ff0000" },
  };

  // Act
  const pathResult = PathElement.mapToFigma(pathNode);
  const pathFromRect = PathElement.mapToFigma({
    type: "element",
    tagName: "rect",
  });

  // Assert
  expect(pathResult).not.toBeNull();
  expect(pathFromRect).toBeNull();
});

test("SVG図形統合テスト - pathの境界ボックス計算 - 正しい座標とサイズが設定される", () => {
  // Arrange
  const path = PathElement.create({
    d: "M10 20 L90 20 L90 80 L10 80 Z",
  });

  // Act
  const pathConfig = PathElement.toFigmaNode(path);

  // Assert
  expect(pathConfig.x).toBe(10);
  expect(pathConfig.y).toBe(20);
  expect(pathConfig.width).toBe(80);
  expect(pathConfig.height).toBe(60);
});

test("SVG図形統合テスト - 複雑なパスデータ - ベジェ曲線を含むパスが変換される", () => {
  // Arrange
  const path = PathElement.create({
    d: "M0 50 C25 0 75 0 100 50 C75 100 25 100 0 50",
    fill: "#ff0000",
  });

  // Act
  const pathConfig = PathElement.toFigmaNode(path);

  // Assert
  expect(pathConfig.type).toBe("FRAME");
  expect(pathConfig.width).toBeGreaterThan(0);
  expect(pathConfig.height).toBeGreaterThan(0);
  expect(pathConfig.fills?.length).toBe(1);
});

// Polygon/Polyline統合テスト
test("SVG図形統合テスト - polygon, polylineを同時に変換 - 全要素が正しいノードタイプで変換される", () => {
  // Arrange
  const polygon = PolygonElement.create({
    points: "100,10 40,198 190,78 10,78 160,198",
    fill: "#ff0000",
  });

  const polyline = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80",
    stroke: "#0000ff",
    "stroke-width": 2,
    fill: "none",
  });

  // Act
  const polygonConfig = PolygonElement.toFigmaNode(polygon);
  const polylineConfig = PolylineElement.toFigmaNode(polyline);

  // Assert
  expect(polygonConfig.name).toBe("polygon");
  expect(polygonConfig.type).toBe("FRAME");
  expect(polylineConfig.name).toBe("polyline");
  expect(polylineConfig.type).toBe("FRAME");
});

test("SVG図形統合テスト - polygonの星形 - 正しい境界ボックスが計算される", () => {
  // Arrange (5点星形)
  const polygon = PolygonElement.create({
    points: "100,10 40,198 190,78 10,78 160,198",
    fill: "#ffff00",
  });

  // Act
  const polygonConfig = PolygonElement.toFigmaNode(polygon);

  // Assert
  expect(polygonConfig.x).toBe(10);
  expect(polygonConfig.y).toBe(10);
  expect(polygonConfig.width).toBe(180);
  expect(polygonConfig.height).toBe(188);
  expect(polygonConfig.fills?.length).toBe(1);
});

test("SVG図形統合テスト - polylineの階段パターン - 正しい境界ボックスが計算される", () => {
  // Arrange
  const polyline = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80 80,120 120,120",
    stroke: "#000000",
    "stroke-width": 2,
    fill: "none",
  });

  // Act
  const polylineConfig = PolylineElement.toFigmaNode(polyline);

  // Assert
  expect(polylineConfig.x).toBe(0);
  expect(polylineConfig.y).toBe(40);
  expect(polylineConfig.width).toBe(120);
  expect(polylineConfig.height).toBe(80);
  expect(polylineConfig.fills).toEqual([]);
  expect(polylineConfig.strokes?.length).toBe(1);
});

test("SVG図形統合テスト - polygon/polylineのHTMLNodeライクなオブジェクトをマッピング - 正しく変換される", () => {
  // Arrange
  const polygonNode = {
    type: "element",
    tagName: "polygon",
    attributes: { points: "100,10 40,198 190,78" },
  };

  const polylineNode = {
    type: "element",
    tagName: "polyline",
    attributes: { points: "0,40 40,40 40,80 80,80" },
  };

  // Act
  const polygonResult = PolygonElement.mapToFigma(polygonNode);
  const polygonFromPolyline = PolygonElement.mapToFigma(polylineNode);
  const polylineResult = PolylineElement.mapToFigma(polylineNode);
  const polylineFromPolygon = PolylineElement.mapToFigma(polygonNode);

  // Assert
  expect(polygonResult).not.toBeNull();
  expect(polygonFromPolyline).toBeNull();
  expect(polylineResult).not.toBeNull();
  expect(polylineFromPolygon).toBeNull();
});

test("SVG図形統合テスト - 全図形にstrokeを設定 - polygon/polyline含め全図形でstrokeが適用される", () => {
  // Arrange
  const strokeColor = "#0000ff";
  const strokeWidth = 3;

  const polygon = PolygonElement.create({
    points: "100,10 40,198 190,78",
    fill: "none",
    stroke: strokeColor,
    "stroke-width": strokeWidth,
  });

  const polyline = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80",
    fill: "none",
    stroke: strokeColor,
    "stroke-width": strokeWidth,
  });

  const circle = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
    fill: "none",
    stroke: strokeColor,
    "stroke-width": strokeWidth,
  });

  // Act
  const polygonConfig = PolygonElement.toFigmaNode(polygon);
  const polylineConfig = PolylineElement.toFigmaNode(polyline);
  const circleConfig = CircleElement.toFigmaNode(circle);

  // Assert
  expect(polygonConfig.strokes?.length).toBe(1);
  expect(polygonConfig.strokeWeight).toBe(strokeWidth);

  expect(polylineConfig.strokes?.length).toBe(1);
  expect(polylineConfig.strokeWeight).toBe(strokeWidth);

  expect(circleConfig.strokes?.length).toBe(1);
  expect(circleConfig.strokeWeight).toBe(strokeWidth);
});

test("SVG図形統合テスト - 複雑なpolygon座標 - 負の座標を含む場合も正しく計算される", () => {
  // Arrange
  const polygon = PolygonElement.create({
    points: "-50,-50 50,-50 50,50 -50,50",
    fill: "#ff0000",
  });

  // Act
  const polygonConfig = PolygonElement.toFigmaNode(polygon);

  // Assert
  expect(polygonConfig.x).toBe(-50);
  expect(polygonConfig.y).toBe(-50);
  expect(polygonConfig.width).toBe(100);
  expect(polygonConfig.height).toBe(100);
});
