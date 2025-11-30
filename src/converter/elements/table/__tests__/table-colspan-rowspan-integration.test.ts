import { test, expect } from "vitest";
import { TdElement, ThElement } from "../index";

// =============================================================================
// colspan/rowspan 統合テスト
// =============================================================================

test("TdElement と ThElement の colspan/rowspan ヘルパーがエクスポートされている", () => {
  expect(typeof TdElement.getColspan).toBe("function");
  expect(typeof TdElement.getRowspan).toBe("function");
  expect(typeof ThElement.getColspan).toBe("function");
  expect(typeof ThElement.getRowspan).toBe("function");
});

// =============================================================================
// colspan を使用したテーブル構造
// =============================================================================

test("colspanを持つヘッダー行のシミュレート", () => {
  // <thead>
  //   <tr>
  //     <th colspan="2">Name</th>
  //     <th colspan="3">Contact</th>
  //   </tr>
  // </thead>
  const th1 = ThElement.create({ colspan: "2" });
  const th2 = ThElement.create({ colspan: "3" });

  expect(ThElement.getColspan(th1)).toBe(2);
  expect(ThElement.getColspan(th2)).toBe(3);

  // 合計列数: 2 + 3 = 5
  const totalColumns = ThElement.getColspan(th1) + ThElement.getColspan(th2);
  expect(totalColumns).toBe(5);
});

test("colspanを持つデータセルのシミュレート", () => {
  // <tr>
  //   <td colspan="3">Merged cell spanning 3 columns</td>
  //   <td>Normal cell</td>
  // </tr>
  const td1 = TdElement.create({ colspan: "3" });
  const td2 = TdElement.create();

  expect(TdElement.getColspan(td1)).toBe(3);
  expect(TdElement.getColspan(td2)).toBe(1);
});

// =============================================================================
// rowspan を使用したテーブル構造
// =============================================================================

test("rowspanを持つヘッダーセルのシミュレート", () => {
  // <thead>
  //   <tr>
  //     <th rowspan="2">Category</th>
  //     <th colspan="2">Values</th>
  //   </tr>
  //   <tr>
  //     <th>Min</th>
  //     <th>Max</th>
  //   </tr>
  // </thead>
  const thCategory = ThElement.create({ rowspan: "2" });
  const thValues = ThElement.create({ colspan: "2" });
  const thMin = ThElement.create();
  const thMax = ThElement.create();

  expect(ThElement.getRowspan(thCategory)).toBe(2);
  expect(ThElement.getColspan(thValues)).toBe(2);
  expect(ThElement.getRowspan(thMin)).toBe(1);
  expect(ThElement.getRowspan(thMax)).toBe(1);
});

test("rowspanを持つデータセルのシミュレート", () => {
  // <tbody>
  //   <tr>
  //     <td rowspan="3">Group A</td>
  //     <td>Item 1</td>
  //   </tr>
  //   <tr>
  //     <td>Item 2</td>
  //   </tr>
  //   <tr>
  //     <td>Item 3</td>
  //   </tr>
  // </tbody>
  const tdGroup = TdElement.create({ rowspan: "3" });
  const tdItem1 = TdElement.create();
  const tdItem2 = TdElement.create();
  const tdItem3 = TdElement.create();

  expect(TdElement.getRowspan(tdGroup)).toBe(3);
  expect(TdElement.getRowspan(tdItem1)).toBe(1);
  expect(TdElement.getRowspan(tdItem2)).toBe(1);
  expect(TdElement.getRowspan(tdItem3)).toBe(1);
});

// =============================================================================
// colspan と rowspan の組み合わせ
// =============================================================================

test("colspan と rowspan の両方を持つセル", () => {
  // <th colspan="2" rowspan="2">Merged Header</th>
  const th = ThElement.create({ colspan: "2", rowspan: "2" });

  expect(ThElement.getColspan(th)).toBe(2);
  expect(ThElement.getRowspan(th)).toBe(2);

  // セルが占める領域: 2 * 2 = 4 セル分
  const cellArea = ThElement.getColspan(th) * ThElement.getRowspan(th);
  expect(cellArea).toBe(4);
});

test("複雑なテーブルヘッダー構造", () => {
  // 2行3列のヘッダー構造
  // +-------------+-------------+
  // |   Header    |   Data      |
  // |   (2x1)     +------+------+
  // |             | Col1 | Col2 |
  // +-------------+------+------+

  const thHeader = ThElement.create({ rowspan: "2" });
  const thData = ThElement.create({ colspan: "2" });
  const thCol1 = ThElement.create();
  const thCol2 = ThElement.create();

  expect(ThElement.getRowspan(thHeader)).toBe(2);
  expect(ThElement.getColspan(thData)).toBe(2);
  expect(ThElement.getColspan(thCol1)).toBe(1);
  expect(ThElement.getColspan(thCol2)).toBe(1);
});

// =============================================================================
// HTMLパース結果のシミュレート
// =============================================================================

test("HTMLパース結果からのcolspan/rowspan取得", () => {
  // HTMLパーサーからの出力をシミュレート
  const parsedTable = {
    thead: {
      tr: [
        {
          th: [
            {
              type: "element",
              tagName: "th",
              attributes: { colspan: "2", rowspan: "1" },
              children: [],
            },
            {
              type: "element",
              tagName: "th",
              attributes: { colspan: "1", rowspan: "2" },
              children: [],
            },
          ],
        },
      ],
    },
    tbody: {
      tr: [
        {
          td: [
            {
              type: "element",
              tagName: "td",
              attributes: { colspan: "1" },
              children: [],
            },
            {
              type: "element",
              tagName: "td",
              attributes: { rowspan: "2" },
              children: [],
            },
          ],
        },
      ],
    },
  };

  // th要素の検証
  const th1 = parsedTable.thead.tr[0].th[0];
  const th2 = parsedTable.thead.tr[0].th[1];

  expect(ThElement.isThElement(th1)).toBe(true);
  expect(ThElement.getColspan(th1 as ThElement)).toBe(2);
  expect(ThElement.getRowspan(th1 as ThElement)).toBe(1);
  expect(ThElement.getColspan(th2 as ThElement)).toBe(1);
  expect(ThElement.getRowspan(th2 as ThElement)).toBe(2);

  // td要素の検証
  const td1 = parsedTable.tbody.tr[0].td[0];
  const td2 = parsedTable.tbody.tr[0].td[1];

  expect(TdElement.isTdElement(td1)).toBe(true);
  expect(TdElement.getColspan(td1 as TdElement)).toBe(1);
  expect(TdElement.getRowspan(td2 as TdElement)).toBe(2);
});

// =============================================================================
// エッジケース
// =============================================================================

test("無効なcolspan/rowspan値のハンドリング", () => {
  const tdInvalidColspan = TdElement.create({ colspan: "abc" });
  const tdInvalidRowspan = TdElement.create({ rowspan: "-5" });
  const thZeroColspan = ThElement.create({ colspan: "0" });
  const thZeroRowspan = ThElement.create({ rowspan: "0" });

  // すべて無効な値はデフォルト1になる
  expect(TdElement.getColspan(tdInvalidColspan)).toBe(1);
  expect(TdElement.getRowspan(tdInvalidRowspan)).toBe(1);
  expect(ThElement.getColspan(thZeroColspan)).toBe(1);
  expect(ThElement.getRowspan(thZeroRowspan)).toBe(1);
});

test("大きなcolspan/rowspan値の処理", () => {
  const td = TdElement.create({ colspan: "100", rowspan: "50" });
  const th = ThElement.create({ colspan: "999", rowspan: "999" });

  expect(TdElement.getColspan(td)).toBe(100);
  expect(TdElement.getRowspan(td)).toBe(50);
  expect(ThElement.getColspan(th)).toBe(999);
  expect(ThElement.getRowspan(th)).toBe(999);
});

test("数値型で設定されたcolspan/rowspan（HTMLパース時のバリエーション）", () => {
  // 一部のパーサーは数値型で返す場合がある
  const tdNumeric = {
    type: "element" as const,
    tagName: "td" as const,
    attributes: { colspan: 3, rowspan: 2 },
    children: [],
  };

  expect(TdElement.isTdElement(tdNumeric)).toBe(true);
  // 数値型でも文字列型でも動作するように実装されている
  expect(TdElement.getColspan(tdNumeric as unknown as TdElement)).toBe(3);
  expect(TdElement.getRowspan(tdNumeric as unknown as TdElement)).toBe(2);
});

// =============================================================================
// 実用的なテーブル構造の例
// =============================================================================

test("カレンダー形式のテーブル（colspan使用）", () => {
  // <table>
  //   <thead>
  //     <tr><th colspan="7">November 2024</th></tr>
  //     <tr><th>Sun</th><th>Mon</th>...<th>Sat</th></tr>
  //   </thead>
  // </table>
  const thMonth = ThElement.create({ colspan: "7" });
  const dayHeaders = Array.from({ length: 7 }, () => ThElement.create());

  expect(ThElement.getColspan(thMonth)).toBe(7);
  dayHeaders.forEach((th) => {
    expect(ThElement.getColspan(th)).toBe(1);
  });
});

test("データグリッド形式のテーブル（rowspan使用）", () => {
  // 各カテゴリが複数行にまたがる
  // | Category | Item   | Value |
  // | A        | Item1  | 100   |
  // | (3rows)  | Item2  | 200   |
  // |          | Item3  | 300   |
  const tdCategory = TdElement.create({ rowspan: "3" });
  const items = [TdElement.create(), TdElement.create(), TdElement.create()];

  expect(TdElement.getRowspan(tdCategory)).toBe(3);
  items.forEach((td) => {
    expect(TdElement.getRowspan(td)).toBe(1);
  });
});

test("財務レポート形式のテーブル（複合的なマージ）", () => {
  // ヘッダー:
  // +------------------+------------------+
  // |                  |   Q1 2024        |
  // |   Item           +--------+---------+
  // |                  | Budget | Actual  |
  // +------------------+--------+---------+
  const thItem = ThElement.create({ rowspan: "2" });
  const thQ1 = ThElement.create({ colspan: "2" });
  const thBudget = ThElement.create();
  const thActual = ThElement.create();

  expect(ThElement.getRowspan(thItem)).toBe(2);
  expect(ThElement.getColspan(thQ1)).toBe(2);
  expect(ThElement.getColspan(thBudget)).toBe(1);
  expect(ThElement.getColspan(thActual)).toBe(1);
});
