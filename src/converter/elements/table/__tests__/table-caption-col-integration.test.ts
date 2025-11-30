import { test, expect } from "vitest";
import {
  CaptionElement,
  CaptionAttributes,
  ColElement,
  ColAttributes,
  ColgroupElement,
  ColgroupAttributes,
} from "../index";

// =============================================================================
// Caption エクスポート確認
// =============================================================================

test("CaptionElementがtable/index.tsからエクスポートされている", () => {
  expect(CaptionElement).toBeDefined();
  expect(typeof CaptionElement.create).toBe("function");
  expect(typeof CaptionElement.isCaptionElement).toBe("function");
  expect(typeof CaptionElement.toFigmaNode).toBe("function");
  expect(typeof CaptionElement.mapToFigma).toBe("function");
});

test("CaptionAttributesがtable/index.tsからエクスポートされている", () => {
  const attrs: CaptionAttributes = {
    id: "test-caption",
    className: "caption-class",
  };
  expect(attrs.id).toBe("test-caption");
});

// =============================================================================
// Col エクスポート確認
// =============================================================================

test("ColElementがtable/index.tsからエクスポートされている", () => {
  expect(ColElement).toBeDefined();
  expect(typeof ColElement.create).toBe("function");
  expect(typeof ColElement.isColElement).toBe("function");
  expect(typeof ColElement.toFigmaNode).toBe("function");
  expect(typeof ColElement.mapToFigma).toBe("function");
  expect(typeof ColElement.getSpan).toBe("function");
  expect(typeof ColElement.getWidth).toBe("function");
});

test("ColAttributesがtable/index.tsからエクスポートされている", () => {
  const attrs: ColAttributes = {
    span: 2,
    width: "100px",
  };
  expect(attrs.span).toBe(2);
  expect(attrs.width).toBe("100px");
});

// =============================================================================
// Colgroup エクスポート確認
// =============================================================================

test("ColgroupElementがtable/index.tsからエクスポートされている", () => {
  expect(ColgroupElement).toBeDefined();
  expect(typeof ColgroupElement.create).toBe("function");
  expect(typeof ColgroupElement.createWithChildren).toBe("function");
  expect(typeof ColgroupElement.isColgroupElement).toBe("function");
  expect(typeof ColgroupElement.toFigmaNode).toBe("function");
  expect(typeof ColgroupElement.mapToFigma).toBe("function");
  expect(typeof ColgroupElement.getSpan).toBe("function");
  expect(typeof ColgroupElement.getColumnCount).toBe("function");
});

test("ColgroupAttributesがtable/index.tsからエクスポートされている", () => {
  const attrs: ColgroupAttributes = {
    span: 3,
  };
  expect(attrs.span).toBe(3);
});

// =============================================================================
// 統合シナリオ: Caption + Colgroup + Col の組み合わせ
// =============================================================================

test("Caption要素を作成してFigma変換できる", () => {
  const caption = CaptionElement.create({ id: "table-title" });

  expect(CaptionElement.isCaptionElement(caption)).toBe(true);

  const config = CaptionElement.toFigmaNode(caption);

  expect(config).not.toBeNull();
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("caption#table-title");
});

test("Col要素を作成してメタデータを取得できる", () => {
  const col = ColElement.create({ span: 2, width: "150px" });

  expect(ColElement.isColElement(col)).toBe(true);
  expect(ColElement.getSpan(col)).toBe(2);
  expect(ColElement.getWidth(col)).toBe("150px");

  // col要素はFigmaノードを生成しない
  const config = ColElement.toFigmaNode(col);
  expect(config).toBeNull();
});

test("Colgroup要素をCol子要素付きで作成して列数を計算できる", () => {
  const col1 = ColElement.create({ span: 1 });
  const col2 = ColElement.create({ span: 2 });
  const col3 = ColElement.create({ span: 1 });

  const colgroup = ColgroupElement.createWithChildren({}, [col1, col2, col3]);

  expect(ColgroupElement.isColgroupElement(colgroup)).toBe(true);
  expect(ColgroupElement.getColumnCount(colgroup)).toBe(4);

  // colgroup要素はFigmaノードを生成しない
  const config = ColgroupElement.toFigmaNode(colgroup);
  expect(config).toBeNull();
});

test("実際のテーブル構造をシミュレート: caption + colgroup + cols", () => {
  // <table>
  //   <caption>Sales Data 2024</caption>
  //   <colgroup>
  //     <col span="1" style="width: 200px;">  <!-- 商品名 -->
  //     <col span="2" style="width: 100px;">  <!-- Q1, Q2 -->
  //     <col span="2" style="width: 100px;">  <!-- Q3, Q4 -->
  //   </colgroup>
  //   ...
  // </table>

  const caption = CaptionElement.create({
    id: "sales-caption",
    style: "text-align: center; font-weight: bold;",
  });

  const colProduct = ColElement.create({ span: 1, width: "200px" });
  const colQ1Q2 = ColElement.create({ span: 2, width: "100px" });
  const colQ3Q4 = ColElement.create({ span: 2, width: "100px" });

  const colgroup = ColgroupElement.createWithChildren({ id: "sales-columns" }, [
    colProduct,
    colQ1Q2,
    colQ3Q4,
  ]);

  // Caption検証
  expect(CaptionElement.isCaptionElement(caption)).toBe(true);
  const captionConfig = CaptionElement.toFigmaNode(caption);
  expect(captionConfig.type).toBe("FRAME");
  expect(captionConfig.name).toBe("caption#sales-caption");

  // Colgroup検証
  expect(ColgroupElement.isColgroupElement(colgroup)).toBe(true);
  expect(colgroup.children.length).toBe(3);
  expect(ColgroupElement.getColumnCount(colgroup)).toBe(5); // 1+2+2

  // 各Col検証
  expect(ColElement.getSpan(colProduct)).toBe(1);
  expect(ColElement.getWidth(colProduct)).toBe("200px");
  expect(ColElement.getSpan(colQ1Q2)).toBe(2);
  expect(ColElement.getSpan(colQ3Q4)).toBe(2);
});

test("mapToFigmaによる要素の判別とマッピング", () => {
  const caption = CaptionElement.create();
  const col = ColElement.create({ span: 2 });
  const colgroup = ColgroupElement.create({ span: 3 });

  // captionはFigmaノードを生成
  const captionResult = CaptionElement.mapToFigma(caption);
  expect(captionResult).not.toBeNull();
  expect(captionResult?.type).toBe("FRAME");

  // col/colgroupはnullを返す（メタデータのみ）
  expect(ColElement.mapToFigma(col)).toBeNull();
  expect(ColgroupElement.mapToFigma(colgroup)).toBeNull();
});

test("無効なオブジェクトは各要素として認識されない", () => {
  const invalidObject = { type: "element", tagName: "div" };

  expect(CaptionElement.isCaptionElement(invalidObject)).toBe(false);
  expect(ColElement.isColElement(invalidObject)).toBe(false);
  expect(ColgroupElement.isColgroupElement(invalidObject)).toBe(false);

  expect(CaptionElement.mapToFigma(invalidObject)).toBeNull();
  expect(ColElement.mapToFigma(invalidObject)).toBeNull();
  expect(ColgroupElement.mapToFigma(invalidObject)).toBeNull();
});

test("複数のcolgroupを持つテーブル構造", () => {
  // <table>
  //   <colgroup span="2"></colgroup>  <!-- 最初の2列 -->
  //   <colgroup>
  //     <col span="1">
  //     <col span="3">
  //   </colgroup>
  // </table>

  const colgroup1 = ColgroupElement.create({ span: 2 });
  const col1 = ColElement.create({ span: 1 });
  const col2 = ColElement.create({ span: 3 });
  const colgroup2 = ColgroupElement.createWithChildren({}, [col1, col2]);

  expect(ColgroupElement.getColumnCount(colgroup1)).toBe(2);
  expect(ColgroupElement.getColumnCount(colgroup2)).toBe(4);

  // 合計列数
  const totalColumns =
    ColgroupElement.getColumnCount(colgroup1) +
    ColgroupElement.getColumnCount(colgroup2);
  expect(totalColumns).toBe(6);
});
