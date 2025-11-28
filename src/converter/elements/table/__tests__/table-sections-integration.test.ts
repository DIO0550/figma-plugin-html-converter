/**
 * @fileoverview thead/tbody/tfootの統合動作を検証するテスト
 * 各セクション要素が独立したFRAMEノードとして正しく変換されることを確認します。
 */
import { test, expect } from "vitest";
import { TheadElement } from "../thead";
import { TbodyElement } from "../tbody";
import { TfootElement } from "../tfoot";
import type { TheadAttributes } from "../thead";
import type { TbodyAttributes } from "../tbody";
import type { TfootAttributes } from "../tfoot";
import type { FigmaNodeConfig } from "../../../models/figma-node/config/figma-node-config";

// テストで期待される値の定数
const EXPECTED_LAYOUT_MODE = "VERTICAL" as const;
const EXPECTED_NODE_TYPE = "FRAME" as const;

function createAndConvertSections(
  theadAttrs: Partial<TheadAttributes> = {},
  tbodyAttrs: Partial<TbodyAttributes> = {},
  tfootAttrs: Partial<TfootAttributes> = {},
): {
  theadConfig: FigmaNodeConfig;
  tbodyConfig: FigmaNodeConfig;
  tfootConfig: FigmaNodeConfig;
} {
  const thead = TheadElement.create(theadAttrs);
  const tbody = TbodyElement.create(tbodyAttrs);
  const tfoot = TfootElement.create(tfootAttrs);

  return {
    theadConfig: TheadElement.toFigmaNode(thead),
    tbodyConfig: TbodyElement.toFigmaNode(tbody),
    tfootConfig: TfootElement.toFigmaNode(tfoot),
  };
}

test("TableSections - thead/tbody/tfootの3セクションを作成すると、それぞれが独立したFRAMEノードとして動作する", () => {
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections();

  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");
});

test("TableSections - thead/tbody/tfootのいずれもFRAME型ノードとして統一的に変換される", () => {
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections();

  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);
});

test("TableSections - id属性を持つセクションは、ノード名に#idが付与される", () => {
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections(
    { id: "table-header" },
    { id: "table-body" },
    { id: "table-footer" },
  );

  expect(theadConfig.name).toBe("thead#table-header");
  expect(tbodyConfig.name).toBe("tbody#table-body");
  expect(tfootConfig.name).toBe("tfoot#table-footer");
});

test("TableSections - className属性を持つセクションも正しくFRAME変換される", () => {
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections(
    { className: "sticky-header" },
    { className: "striped-body" },
    { className: "summary-footer" },
  );

  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");
});

test("TableSections - 異なる属性（id, className）を持つセクションが共存できる", () => {
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections(
    { id: "header", className: "sticky" },
    { className: "striped" },
    { id: "footer" },
  );

  expect(theadConfig.name).toBe("thead#header");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot#footer");
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);
});

test("TableSections - tbody単体で変換しても、他セクションに依存せず正しくFRAMEノードが生成される", () => {
  const tbody = TbodyElement.create();
  const config = TbodyElement.toFigmaNode(tbody);

  expect(config.type).toBe(EXPECTED_NODE_TYPE);
  expect(config.name).toBe("tbody");
  expect(config.layoutMode).toBe(EXPECTED_LAYOUT_MODE);
});

test("TableSections - theadとtbodyは互いに依存せず独立してFRAME変換される", () => {
  const thead = TheadElement.create();
  const tbody = TbodyElement.create();
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);

  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(theadConfig).not.toEqual(tbodyConfig);
});

test("TableSections - tbodyとtfootは互いに依存せず独立してFRAME変換される", () => {
  const tbody = TbodyElement.create();
  const tfoot = TfootElement.create();
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig).not.toEqual(tfootConfig);
});

test("TableSections - theadとtfootは互いに依存せず独立してFRAME変換される", () => {
  const thead = TheadElement.create();
  const tfoot = TfootElement.create();
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  expect(theadConfig.name).toBe("thead");
  expect(tfootConfig.name).toBe("tfoot");
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(theadConfig).not.toEqual(tfootConfig);
});

test("TableSections - thead + tbody + tfoot の完全な組み合わせで全てが正しくVERTICALレイアウトのFRAMEとして変換される", () => {
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections();

  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(theadConfig.layoutMode).toBe(EXPECTED_LAYOUT_MODE);
  expect(tbodyConfig.layoutMode).toBe(EXPECTED_LAYOUT_MODE);
  expect(tfootConfig.layoutMode).toBe(EXPECTED_LAYOUT_MODE);
});

// セクション間の境界線処理テスト

test("TableSections - 各セクションに異なる境界線スタイルを適用できる", () => {
  const thead = TheadElement.create({
    style: "border: 2px solid #000;",
  });
  const tbody = TbodyElement.create({
    style: "border: 1px solid #ddd;",
  });
  const tfoot = TfootElement.create({
    style: "border: 2px solid #333;",
  });

  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // 各セクションがFRAMEとして変換される
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);

  // 各セクションに境界線が適用される
  expect(theadConfig.strokes).toBeDefined();
  expect(tbodyConfig.strokes).toBeDefined();
  expect(tfootConfig.strokes).toBeDefined();

  // 各セクションに異なる幅の境界線が適用される
  expect(theadConfig.strokeWeight).toBe(2);
  expect(tbodyConfig.strokeWeight).toBe(1);
  expect(tfootConfig.strokeWeight).toBe(2);
});

test("TableSections - theadとtbodyがそれぞれ独立した境界線スタイルを持つことができる", () => {
  const thead = TheadElement.create({
    style: "border: 2px solid #333;",
  });
  const tbody = TbodyElement.create({
    style: "border: 1px solid #ccc;",
  });

  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);

  // それぞれ独立してスタイルが適用される
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);

  // 両セクションに境界線が適用される
  expect(theadConfig.strokes).toBeDefined();
  expect(tbodyConfig.strokes).toBeDefined();
});

test("TableSections - tbodyとtfootがそれぞれ独立した境界線スタイルを持つことができる", () => {
  const tbody = TbodyElement.create({
    style: "border: 1px solid #ccc;",
  });
  const tfoot = TfootElement.create({
    style: "border: 2px solid #333;",
  });

  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // それぞれ独立してスタイルが適用される
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);

  // 両セクションに境界線が適用される
  expect(tbodyConfig.strokes).toBeDefined();
  expect(tfootConfig.strokes).toBeDefined();
});

test("TableSections - 全セクションに境界線と角丸を適用した完全なテーブルスタイリング", () => {
  const thead = TheadElement.create({
    style:
      "border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;",
  });
  const tbody = TbodyElement.create({
    style: "border: 1px solid #ddd;",
  });
  const tfoot = TfootElement.create({
    style:
      "border: 1px solid #ddd; border-radius: 4px; background-color: #f0f0f0;",
  });

  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // すべてのセクションに境界線が適用される
  expect(theadConfig.strokes).toBeDefined();
  expect(tbodyConfig.strokes).toBeDefined();
  expect(tfootConfig.strokes).toBeDefined();

  // すべてのセクションに同じ境界線幅が適用される
  expect(theadConfig.strokeWeight).toBe(1);
  expect(tbodyConfig.strokeWeight).toBe(1);
  expect(tfootConfig.strokeWeight).toBe(1);

  // theadとtfootには角丸が適用される
  expect(theadConfig.cornerRadius).toBe(4);
  expect(tfootConfig.cornerRadius).toBe(4);
});
