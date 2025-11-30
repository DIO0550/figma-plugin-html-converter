import { test, expect } from "vitest";
import { ColElement } from "../col-element";

// 統合テスト：col要素の作成からFigma変換までの一連のフロー

test("col要素を作成してFigma変換するとnullが返される（メタデータのみ）", () => {
  const col = ColElement.create();

  expect(ColElement.isColElement(col)).toBe(true);

  const config = ColElement.toFigmaNode(col);

  expect(config).toBeNull();
});

test("span属性を持つcol要素の作成とメタデータ取得", () => {
  const col = ColElement.create({ span: 3 });

  expect(ColElement.isColElement(col)).toBe(true);
  expect(ColElement.getSpan(col)).toBe(3);

  const config = ColElement.mapToFigma(col);

  expect(config).toBeNull();
});

test("width属性を持つcol要素の作成とメタデータ取得", () => {
  const col = ColElement.create({ width: "150px" });

  expect(ColElement.isColElement(col)).toBe(true);
  expect(ColElement.getWidth(col)).toBe("150px");

  const config = ColElement.mapToFigma(col);

  expect(config).toBeNull();
});

test("複数属性を持つcol要素の完全なフロー", () => {
  const col = ColElement.create({
    span: 2,
    width: 200,
    id: "column-group-1",
    className: "highlight-column",
    style: "background-color: #f0f0f0;",
  });

  // 型チェック
  expect(ColElement.isColElement(col)).toBe(true);
  expect(col.type).toBe("element");
  expect(col.tagName).toBe("col");

  // 属性確認
  expect(col.attributes?.span).toBe(2);
  expect(col.attributes?.width).toBe(200);
  expect(col.attributes?.id).toBe("column-group-1");
  expect(col.attributes?.className).toBe("highlight-column");
  expect(col.attributes?.style).toBe("background-color: #f0f0f0;");

  // ヘルパーメソッド確認
  expect(ColElement.getSpan(col)).toBe(2);
  expect(ColElement.getWidth(col)).toBe("200px");

  // Figma変換（メタデータのためnull）
  expect(ColElement.toFigmaNode(col)).toBeNull();
  expect(ColElement.mapToFigma(col)).toBeNull();
});

test("col要素は常に空の子要素配列を持つ", () => {
  const col = ColElement.create({ span: 2 });

  expect(col.children).toEqual([]);
  expect(col.children.length).toBe(0);
});

test("外部から受け取ったcol要素オブジェクトの処理", () => {
  // HTML パース結果をシミュレート
  const parsedCol = {
    type: "element" as const,
    tagName: "col" as const,
    attributes: {
      span: "3",
      width: "100px",
    },
    children: [] as never[],
  };

  expect(ColElement.isColElement(parsedCol)).toBe(true);

  // 文字列spanは正しくパースされる
  expect(ColElement.getSpan(parsedCol as ColElement)).toBe(3);
  expect(ColElement.getWidth(parsedCol as ColElement)).toBe("100px");

  // Figma変換はnull
  expect(ColElement.mapToFigma(parsedCol)).toBeNull();
});

test("無効なオブジェクトはcolとして認識されない", () => {
  const invalidObjects = [
    null,
    undefined,
    "col",
    123,
    [],
    {},
    { type: "element" },
    { tagName: "col" },
    { type: "text", tagName: "col" },
    { type: "element", tagName: "colgroup" },
  ];

  for (const obj of invalidObjects) {
    expect(ColElement.isColElement(obj)).toBe(false);
    expect(ColElement.mapToFigma(obj)).toBeNull();
  }
});

test("span属性のエッジケース処理", () => {
  // デフォルト（未設定）
  expect(ColElement.getSpan(ColElement.create())).toBe(1);

  // 有効な値
  expect(ColElement.getSpan(ColElement.create({ span: 5 }))).toBe(5);
  expect(ColElement.getSpan(ColElement.create({ span: "10" }))).toBe(10);

  // 無効な値はデフォルト1
  expect(ColElement.getSpan(ColElement.create({ span: 0 }))).toBe(1);
  expect(ColElement.getSpan(ColElement.create({ span: -1 }))).toBe(1);
  expect(ColElement.getSpan(ColElement.create({ span: "invalid" }))).toBe(1);
});

test("width属性のエッジケース処理", () => {
  // デフォルト（未設定）
  expect(ColElement.getWidth(ColElement.create())).toBeUndefined();

  // 文字列値はそのまま
  expect(ColElement.getWidth(ColElement.create({ width: "100px" }))).toBe(
    "100px",
  );
  expect(ColElement.getWidth(ColElement.create({ width: "50%" }))).toBe("50%");
  expect(ColElement.getWidth(ColElement.create({ width: "10em" }))).toBe(
    "10em",
  );

  // 数値はpxに変換
  expect(ColElement.getWidth(ColElement.create({ width: 200 }))).toBe("200px");
  expect(ColElement.getWidth(ColElement.create({ width: 0 }))).toBe("0px");
});
