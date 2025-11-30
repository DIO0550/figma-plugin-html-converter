import { test, expect } from "vitest";
import { ColgroupElement } from "../colgroup-element";
import { ColElement } from "../../col";

// 統合テスト：colgroup要素の作成からFigma変換までの一連のフロー

test("colgroup要素を作成してFigma変換するとnullが返される（メタデータのみ）", () => {
  const colgroup = ColgroupElement.create();

  expect(ColgroupElement.isColgroupElement(colgroup)).toBe(true);

  const config = ColgroupElement.toFigmaNode(colgroup);

  expect(config).toBeNull();
});

test("span属性を持つcolgroup要素の作成とメタデータ取得", () => {
  const colgroup = ColgroupElement.create({ span: 4 });

  expect(ColgroupElement.isColgroupElement(colgroup)).toBe(true);
  expect(ColgroupElement.getSpan(colgroup)).toBe(4);
  expect(ColgroupElement.getColumnCount(colgroup)).toBe(4);

  const config = ColgroupElement.mapToFigma(colgroup);

  expect(config).toBeNull();
});

test("col子要素を持つcolgroup要素の作成と列数計算", () => {
  const col1 = ColElement.create({ span: 2 });
  const col2 = ColElement.create({ span: 3 });
  const colgroup = ColgroupElement.createWithChildren({}, [col1, col2]);

  expect(ColgroupElement.isColgroupElement(colgroup)).toBe(true);
  expect(colgroup.children.length).toBe(2);
  expect(ColgroupElement.getColumnCount(colgroup)).toBe(5);

  const config = ColgroupElement.mapToFigma(colgroup);

  expect(config).toBeNull();
});

test("複数属性を持つcolgroup要素の完全なフロー", () => {
  const colgroup = ColgroupElement.create({
    span: 3,
    id: "header-group",
    className: "styled-group",
    style: "background-color: #f0f0f0;",
  });

  // 型チェック
  expect(ColgroupElement.isColgroupElement(colgroup)).toBe(true);
  expect(colgroup.type).toBe("element");
  expect(colgroup.tagName).toBe("colgroup");

  // 属性確認
  expect(colgroup.attributes?.span).toBe(3);
  expect(colgroup.attributes?.id).toBe("header-group");
  expect(colgroup.attributes?.className).toBe("styled-group");
  expect(colgroup.attributes?.style).toBe("background-color: #f0f0f0;");

  // ヘルパーメソッド確認
  expect(ColgroupElement.getSpan(colgroup)).toBe(3);
  expect(ColgroupElement.getColumnCount(colgroup)).toBe(3);

  // Figma変換（メタデータのためnull）
  expect(ColgroupElement.toFigmaNode(colgroup)).toBeNull();
  expect(ColgroupElement.mapToFigma(colgroup)).toBeNull();
});

test("子col要素とspan属性の両方を持つcolgroup（子要素優先）", () => {
  const col1 = ColElement.create({ span: 2 });
  const col2 = ColElement.create({ span: 1 });

  // span: 10を設定しても、子要素があるので無視される
  const colgroup = ColgroupElement.createWithChildren({ span: 10 }, [
    col1,
    col2,
  ]);

  expect(colgroup.attributes?.span).toBe(10);
  // 子要素がある場合は子要素のspanの合計
  expect(ColgroupElement.getColumnCount(colgroup)).toBe(3);
});

test("外部から受け取ったcolgroup要素オブジェクトの処理", () => {
  // HTML パース結果をシミュレート
  const parsedColgroup = {
    type: "element" as const,
    tagName: "colgroup" as const,
    attributes: {
      span: "3",
    },
    children: [] as ColElement[],
  };

  expect(ColgroupElement.isColgroupElement(parsedColgroup)).toBe(true);

  // 文字列spanは正しくパースされる
  expect(ColgroupElement.getSpan(parsedColgroup as ColgroupElement)).toBe(3);
  expect(
    ColgroupElement.getColumnCount(parsedColgroup as ColgroupElement),
  ).toBe(3);

  // Figma変換はnull
  expect(ColgroupElement.mapToFigma(parsedColgroup)).toBeNull();
});

test("col子要素を持つパース結果の処理", () => {
  // HTML パース結果をシミュレート
  const parsedColgroup = {
    type: "element" as const,
    tagName: "colgroup" as const,
    attributes: {},
    children: [
      {
        type: "element" as const,
        tagName: "col" as const,
        attributes: { span: 2 },
        children: [] as never[],
      },
      {
        type: "element" as const,
        tagName: "col" as const,
        attributes: { span: "3" },
        children: [] as never[],
      },
    ],
  };

  expect(ColgroupElement.isColgroupElement(parsedColgroup)).toBe(true);
  expect(
    ColgroupElement.getColumnCount(parsedColgroup as ColgroupElement),
  ).toBe(5);
});

test("無効なオブジェクトはcolgroupとして認識されない", () => {
  const invalidObjects = [
    null,
    undefined,
    "colgroup",
    123,
    [],
    {},
    { type: "element" },
    { tagName: "colgroup" },
    { type: "text", tagName: "colgroup" },
    { type: "element", tagName: "col" },
  ];

  for (const obj of invalidObjects) {
    expect(ColgroupElement.isColgroupElement(obj)).toBe(false);
    expect(ColgroupElement.mapToFigma(obj)).toBeNull();
  }
});

test("実際のHTMLテーブル構造をシミュレート", () => {
  // <colgroup>
  //   <col span="1" style="background: #f0f0f0;">
  //   <col span="2">
  //   <col span="1" style="background: #e0e0e0;">
  // </colgroup>
  const col1 = ColElement.create({ span: 1, style: "background: #f0f0f0;" });
  const col2 = ColElement.create({ span: 2 });
  const col3 = ColElement.create({ span: 1, style: "background: #e0e0e0;" });

  const colgroup = ColgroupElement.createWithChildren({ id: "table-columns" }, [
    col1,
    col2,
    col3,
  ]);

  expect(colgroup.children.length).toBe(3);
  expect(ColgroupElement.getColumnCount(colgroup)).toBe(4); // 1+2+1

  // 各子col要素の検証
  expect(ColElement.isColElement(colgroup.children[0])).toBe(true);
  expect(ColElement.getSpan(colgroup.children[0])).toBe(1);
  expect(ColElement.getSpan(colgroup.children[1])).toBe(2);
  expect(ColElement.getSpan(colgroup.children[2])).toBe(1);
});
