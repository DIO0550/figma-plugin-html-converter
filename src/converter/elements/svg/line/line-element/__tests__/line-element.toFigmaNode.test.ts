import { describe, test, expect } from "vitest";
import { LineElement } from "../line-element";

describe("LineElement.toFigmaNode", () => {
  test("基本的なFrameNodeを生成する（線はFrameで表現）", () => {
    const element = LineElement.create({
      x1: 10,
      y1: 20,
      x2: 100,
      y2: 80,
    });

    const config = LineElement.toFigmaNode(element);

    expect(config.name).toBe("line");
    expect(config.type).toBe("FRAME");
  });

  test("正しい位置とサイズを設定する", () => {
    const element = LineElement.create({
      x1: 10,
      y1: 20,
      x2: 100,
      y2: 80,
    });

    const config = LineElement.toFigmaNode(element);

    // 境界ボックスの左上角
    expect(config.x).toBe(10);
    expect(config.y).toBe(20);
    // 境界ボックスのサイズ
    expect(config.width).toBe(90);
    expect(config.height).toBe(60);
  });

  test("strokeを適用する", () => {
    const element = LineElement.create({
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      stroke: "#ff0000",
      "stroke-width": 2,
    });

    const config = LineElement.toFigmaNode(element);

    expect(config.strokes).toBeDefined();
    expect(config.strokes?.length).toBe(1);
    expect(config.strokeWeight).toBe(2);
  });

  test("strokeがない場合デフォルトでストロークを設定", () => {
    const element = LineElement.create({
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
    });

    const config = LineElement.toFigmaNode(element);

    // lineはfillではなくstrokeで描画されるため、デフォルトでストロークを設定
    expect(config.strokes).toBeDefined();
  });

  test("逆方向の線を正しく変換する", () => {
    const element = LineElement.create({
      x1: 100,
      y1: 80,
      x2: 10,
      y2: 20,
    });

    const config = LineElement.toFigmaNode(element);

    // 境界ボックスは常に左上から
    expect(config.x).toBe(10);
    expect(config.y).toBe(20);
    expect(config.width).toBe(90);
    expect(config.height).toBe(60);
  });

  test("水平線を正しく変換する", () => {
    const element = LineElement.create({
      x1: 0,
      y1: 50,
      x2: 100,
      y2: 50,
    });

    const config = LineElement.toFigmaNode(element);

    expect(config.x).toBe(0);
    expect(config.y).toBe(50);
    expect(config.width).toBe(100);
    expect(config.height).toBe(0);
  });

  test("垂直線を正しく変換する", () => {
    const element = LineElement.create({
      x1: 50,
      y1: 0,
      x2: 50,
      y2: 100,
    });

    const config = LineElement.toFigmaNode(element);

    expect(config.x).toBe(50);
    expect(config.y).toBe(0);
    expect(config.width).toBe(0);
    expect(config.height).toBe(100);
  });

  test("デフォルト値でline要素を変換する", () => {
    const element = LineElement.create();

    const config = LineElement.toFigmaNode(element);

    expect(config.x).toBe(0);
    expect(config.y).toBe(0);
    expect(config.width).toBe(0);
    expect(config.height).toBe(0);
  });
});
