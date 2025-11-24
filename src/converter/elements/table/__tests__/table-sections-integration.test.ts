import { test, expect } from "vitest";
import { TheadElement } from "../thead";
import { TbodyElement } from "../tbody";
import { TfootElement } from "../tfoot";

// 基本的な3セクション統合

test("TableSections - thead/tbody/tfootの3セクションを作成すると、それぞれが独立したFRAMEノードとして動作する", () => {
  // Arrange
  const thead = TheadElement.create();
  const tbody = TbodyElement.create();
  const tfoot = TfootElement.create();

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert - 全てのセクションが独立して動作する
  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");
});

test("TableSections - thead/tbody/tfootのいずれもFRAME型ノードとして統一的に変換される", () => {
  // Arrange
  const thead = TheadElement.create();
  const tbody = TbodyElement.create();
  const tfoot = TfootElement.create();

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert
  expect(theadConfig.type).toBe("FRAME");
  expect(tbodyConfig.type).toBe("FRAME");
  expect(tfootConfig.type).toBe("FRAME");
});

// セクションの視覚的区別

test("TableSections - 各セクション（thead/tbody/tfoot）は異なる名前を持ち、明確に区別される", () => {
  // Arrange
  const thead = TheadElement.create();
  const tbody = TbodyElement.create();
  const tfoot = TfootElement.create();

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert - 各セクションが明確に区別される名前を持つ
  expect(theadConfig.name).toBe("thead");
  expect(tbodyConfig.name).toBe("tbody");
  expect(tfootConfig.name).toBe("tfoot");

  // 名前が全て異なる
  const names = [theadConfig.name, tbodyConfig.name, tfootConfig.name];
  const uniqueNames = new Set(names);
  expect(uniqueNames.size).toBe(3);
});

test("TableSections - 各セクションはVERTICALレイアウトモードを持つFRAMEとして変換される", () => {
  // Arrange
  const thead = TheadElement.create();
  const tbody = TbodyElement.create();
  const tfoot = TfootElement.create();

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert - 全てのセクションがVERTICALレイアウト
  expect(theadConfig.layoutMode).toBe("VERTICAL");
  expect(tbodyConfig.layoutMode).toBe("VERTICAL");
  expect(tfootConfig.layoutMode).toBe("VERTICAL");
});

// セクション間の境界線処理

test("TableSections - 各セクションが独立したFRAMEとして機能し、VERTICALレイアウトを持つ", () => {
  // Arrange
  const thead = TheadElement.create();
  const tbody = TbodyElement.create();
  const tfoot = TfootElement.create();

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert - 各セクションが独立したFRAMEとして作成される
  expect(theadConfig.type).toBe("FRAME");
  expect(tbodyConfig.type).toBe("FRAME");
  expect(tfootConfig.type).toBe("FRAME");

  // 各セクションがVERTICALレイアウトを持つ
  expect(theadConfig.layoutMode).toBe("VERTICAL");
  expect(tbodyConfig.layoutMode).toBe("VERTICAL");
  expect(tfootConfig.layoutMode).toBe("VERTICAL");
});

// セクションごとの異なるスタイル適用

test("TableSections - id属性を持つセクションは、ノード名に#idが付与される", () => {
  // Arrange
  const thead = TheadElement.create({ id: "table-header" });
  const tbody = TbodyElement.create({ id: "table-body" });
  const tfoot = TfootElement.create({ id: "table-footer" });

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

  // Assert
  expect(theadConfig.name).toBe("thead#table-header");
  expect(tbodyConfig.name).toBe("tbody#table-body");
  expect(tfootConfig.name).toBe("tfoot#table-footer");
});

test("TableSections - className属性を持つセクションも正しくFRAME変換される", () => {
  // Arrange
  const thead = TheadElement.create({ className: "sticky-header" });
  const tbody = TbodyElement.create({ className: "striped-body" });
  const tfoot = TfootElement.create({ className: "summary-footer" });

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

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
  // Arrange
  const thead = TheadElement.create({ id: "header", className: "sticky" });
  const tbody = TbodyElement.create({ className: "striped" });
  const tfoot = TfootElement.create({ id: "footer" });

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

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
  // Arrange
  const thead = TheadElement.create();
  const tbody = TbodyElement.create();
  const tfoot = TfootElement.create();

  // Act
  const theadConfig = TheadElement.toFigmaNode(thead);
  const tbodyConfig = TbodyElement.toFigmaNode(tbody);
  const tfootConfig = TfootElement.toFigmaNode(tfoot);

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
