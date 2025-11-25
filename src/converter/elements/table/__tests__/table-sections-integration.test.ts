/**
 * @fileoverview テーブルセクション要素(thead/tbody/tfoot)の統合テスト
 *
 * このテストファイルは、3つのテーブルセクション要素が独立したFRAMEノードとして
 * 正しく変換されることを検証します。
 *
 * ## テスト設計の注意事項
 *
 * 現在の実装では、TableElement.children は TrElement[] 型であり、
 * thead/tbody/tfoot要素を直接の子要素として持つことはできません。
 * そのため、このテストでは各セクション要素を個別に検証し、
 * それぞれが独立したFRAMEノードとして動作することを確認します。
 *
 * HTMLの実際の構造:
 * ```html
 * <table>
 *   <thead><tr>...</tr></thead>
 *   <tbody><tr>...</tr></tbody>
 *   <tfoot><tr>...</tr></tfoot>
 * </table>
 * ```
 *
 * Figma変換後の構造:
 * ```
 * table (FRAME)
 *   ├─ tr (FRAME) - theadの行が直接配置される
 *   ├─ tr (FRAME) - tbodyの行が直接配置される
 *   └─ tr (FRAME) - tfootの行が直接配置される
 * ```
 *
 * @see {@link https://developer.mozilla.org/ja/docs/Web/HTML/Element/thead}
 * @see {@link https://developer.mozilla.org/ja/docs/Web/HTML/Element/tbody}
 * @see {@link https://developer.mozilla.org/ja/docs/Web/HTML/Element/tfoot}
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

// 繰り返しパターンを共通化し、テストコードの冗長性を削減するためのヘルパー
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

// 基本的な3セクション統合

test("TableSections - thead/tbody/tfootの3セクションを作成すると、それぞれが独立したFRAMEノードとして動作する", () => {
  // Arrange & Act
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections();

  // Assert - 全てのセクションが独立して動作する
  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");
});

test("TableSections - thead/tbody/tfootのいずれもFRAME型ノードとして統一的に変換される", () => {
  // Arrange & Act
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections();

  // Assert
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);
});

// セクションごとの異なるスタイル適用

test("TableSections - id属性を持つセクションは、ノード名に#idが付与される", () => {
  // Arrange & Act
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections(
    { id: "table-header" },
    { id: "table-body" },
    { id: "table-footer" },
  );

  // Assert
  expect(theadConfig.name).toBe("thead#table-header");
  expect(tbodyConfig.name).toBe("tbody#table-body");
  expect(tfootConfig.name).toBe("tfoot#table-footer");
});

test("TableSections - className属性を持つセクションも正しくFRAME変換される", () => {
  // Arrange & Act
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections(
    { className: "sticky-header" },
    { className: "striped-body" },
    { className: "summary-footer" },
  );

  // Assert - className属性があってもFigma変換が正しく行われる
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);

  // 基本的な名前は変わらない
  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");
});

test("TableSections - 異なる属性（id, className）を持つセクションが共存できる", () => {
  // Arrange & Act
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections(
    { id: "header", className: "sticky" },
    { className: "striped" },
    { id: "footer" },
  );

  // Assert - 異なる属性を持つセクションが共存できる
  expect(theadConfig.name).toBe("thead#header");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot#footer");

  // 全て正しくFRAMEとして変換される
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);
});

// セクションの省略パターン

test("TableSections - tbody単体で変換しても、他セクションに依存せず正しくFRAMEノードが生成される", () => {
  // Arrange
  const tbody = TbodyElement.create();

  // Act
  const config = TbodyElement.toFigmaNode(tbody);

  // Assert
  expect(config.type).toBe(EXPECTED_NODE_TYPE);
  expect(config.name).toBe("tbody");
  expect(config.layoutMode).toBe(EXPECTED_LAYOUT_MODE);
});

test("TableSections - theadとtbodyは互いに依存せず独立してFRAME変換される", () => {
  // Arrange: thead, tbodyを個別に生成
  const thead = TheadElement.create();
  const tbody = TbodyElement.create();

  // Act: 各セクションを個別に変換
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);

  // Assert: 互いに依存せず正しく変換されること
  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);

  // theadとtbodyの変換結果が互いに影響しないこと
  expect(theadConfig).not.toEqual(tbodyConfig);
});

test("TableSections - tbodyとtfootは互いに依存せず独立してFRAME変換される", () => {
  // Arrange: tbody, tfootを個別に生成
  const tbody = TbodyElement.create();
  const tfoot = TfootElement.create();

  // Act: 各セクションを個別に変換
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert: 互いに依存せず正しく変換されること
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);

  // tbodyとtfootの変換結果が互いに影響しないこと
  expect(tbodyConfig).not.toEqual(tfootConfig);
});

test("TableSections - theadとtfootは互いに依存せず独立してFRAME変換される", () => {
  // Arrange: thead, tfootを個別に生成
  const thead = TheadElement.create();
  const tfoot = TfootElement.create();

  // Act: 各セクションを個別に変換
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert: 互いに依存せず正しく変換されること
  expect(theadConfig.name).toBe("thead");
  expect(tfootConfig.name).toBe("tfoot");
  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);

  // theadとtfootの変換結果が互いに影響しないこと
  expect(theadConfig).not.toEqual(tfootConfig);
});

test("TableSections - thead + tbody + tfoot の完全な組み合わせで全てが正しくVERTICALレイアウトのFRAMEとして変換される", () => {
  // Arrange & Act
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections();

  // Assert - 全てのセクションが正しく変換される
  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");

  expect(theadConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tbodyConfig.type).toBe(EXPECTED_NODE_TYPE);
  expect(tfootConfig.type).toBe(EXPECTED_NODE_TYPE);

  // 全てのセクションが同じレイアウトモード
  expect(theadConfig.layoutMode).toBe(EXPECTED_LAYOUT_MODE);
  expect(tbodyConfig.layoutMode).toBe(EXPECTED_LAYOUT_MODE);
  expect(tfootConfig.layoutMode).toBe(EXPECTED_LAYOUT_MODE);
});
