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

/**
 * ヘルパー関数: 3つのセクション要素を作成してFigmaノードに変換
 *
 * @param theadAttrs - thead要素の属性
 * @param tbodyAttrs - tbody要素の属性
 * @param tfootAttrs - tfoot要素の属性
 * @returns 変換後のFigmaノード設定
 */
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
  expect(theadConfig.type).toBe("FRAME");
  expect(tbodyConfig.type).toBe("FRAME");
  expect(tfootConfig.type).toBe("FRAME");
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
  expect(theadConfig.type).toBe("FRAME");
  expect(tbodyConfig.type).toBe("FRAME");
  expect(tfootConfig.type).toBe("FRAME");

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
  expect(theadConfig.type).toBe("FRAME");
  expect(tbodyConfig.type).toBe("FRAME");
  expect(tfootConfig.type).toBe("FRAME");
});

// セクションの省略パターン

test("TableSections - tbody単体で変換しても、他セクションに依存せず正しくFRAMEノードが生成される", () => {
  // Arrange
  const tbody = TbodyElement.create();

  // Act
  const config = TbodyElement.toFigmaNode(tbody);

  // Assert
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("tbody");
  expect(config.layoutMode).toBe("VERTICAL");
});

test("TableSections - thead + tbody の組み合わせで両方が正しくFRAME変換される", () => {
  // Arrange
  const thead = TheadElement.create();
  const tbody = TbodyElement.create();

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);

  // Assert
  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");

  expect(theadConfig.type).toBe("FRAME");
  expect(tbodyConfig.type).toBe("FRAME");
});

test("TableSections - tbody + tfoot の組み合わせで両方が正しくFRAME変換される", () => {
  // Arrange
  const tbody = TbodyElement.create();
  const tfoot = TfootElement.create();

  // Act
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");

  expect(tbodyConfig.type).toBe("FRAME");
  expect(tfootConfig.type).toBe("FRAME");
});

test("TableSections - thead + tfoot の組み合わせで両方が正しくFRAME変換される", () => {
  // Arrange
  const thead = TheadElement.create();
  const tfoot = TfootElement.create();

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert
  expect(theadConfig.name).toBe("thead");
  expect(tfootConfig.name).toBe("tfoot");

  expect(theadConfig.type).toBe("FRAME");
  expect(tfootConfig.type).toBe("FRAME");
});

test("TableSections - thead + tbody + tfoot の完全な組み合わせで全てが正しくVERTICALレイアウトのFRAMEとして変換される", () => {
  // Arrange & Act
  const { theadConfig, tbodyConfig, tfootConfig } = createAndConvertSections();

  // Assert - 全てのセクションが正しく変換される
  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");

  expect(theadConfig.type).toBe("FRAME");
  expect(tbodyConfig.type).toBe("FRAME");
  expect(tfootConfig.type).toBe("FRAME");

  // 全てのセクションが同じレイアウトモード
  expect(theadConfig.layoutMode).toBe("VERTICAL");
  expect(tbodyConfig.layoutMode).toBe("VERTICAL");
  expect(tfootConfig.layoutMode).toBe("VERTICAL");
});
