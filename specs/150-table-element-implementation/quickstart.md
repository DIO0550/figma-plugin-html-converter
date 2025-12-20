# Quick Start: table要素の実装

**Date**: 2025-11-21
**Feature**: table要素（テーブル全体）の実装

## 概要

このドキュメントは、table要素の実装を開始するための手順書です。TDD（テスト駆動開発）のアプローチに従い、段階的に実装を進めます。

## 前提条件

### 環境

- Node.js >= 18.0.0
- TypeScript 5.4.3
- Vitest 3.2.4

### 依存要素の確認

以下の要素が実装済みであることを確認してください:

```bash
# TrElement の確認
ls src/converter/elements/table/tr/tr-element/tr-element.ts

# TdElement の確認
ls src/converter/elements/table/td/td-element/td-element.ts

# ThElement の確認
ls src/converter/elements/table/th/th-element/th-element.ts
```

## 実装手順

### Phase 1: TableAttributes の実装

#### ステップ1-1: ディレクトリ作成

```bash
mkdir -p src/converter/elements/table/table-attributes/__tests__
```

#### ステップ1-2: テストファイル作成

**ファイル**: `src/converter/elements/table/table-attributes/__tests__/table-attributes.test.ts`

```typescript
import { test, expect } from "vitest";
import type { TableAttributes } from "../table-attributes";

test("GlobalAttributesを継承してclassとid属性が使用できる", () => {
  const attrs: TableAttributes = {
    class: "my-table",
    id: "table-1",
  };
  expect(attrs.class).toBe("my-table");
  expect(attrs.id).toBe("table-1");
});

test("border属性が正しく設定できる", () => {
  const attrs: TableAttributes = {
    border: "1",
  };
  expect(attrs.border).toBe("1");
});

test("全ての属性がオプショナルで空オブジェクトが作成できる", () => {
  const attrs: TableAttributes = {};
  expect(attrs).toBeDefined();
});
```

#### ステップ1-3: テスト実行（Red）

```bash
npm test -- table-attributes.test.ts
```

期待結果: テストが失敗（ファイルが存在しないため）

#### ステップ1-4: 型定義作成

**ファイル**: `src/converter/elements/table/table-attributes/table-attributes.ts`

```typescript
/**
 * @fileoverview table要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * table要素の属性インターフェース
 *
 * table要素はテーブル全体のコンテナを表します。
 * GlobalAttributesを拡張し、border属性を追加しています。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/table
 */
export interface TableAttributes extends GlobalAttributes {
  /**
   * テーブルのボーダー幅
   *
   * 廃止予定の属性ですが、互換性のためサポートします。
   * ピクセル値を文字列で指定します。
   *
   * @deprecated CSSのborderプロパティを使用してください
   * @example "1" - 1pxのボーダー
   */
  border?: string;
}
```

#### ステップ1-5: エクスポート設定

**ファイル**: `src/converter/elements/table/table-attributes/index.ts`

```typescript
export type { TableAttributes } from "./table-attributes";
```

#### ステップ1-6: テスト実行（Green）

```bash
npm test -- table-attributes.test.ts
```

期待結果: 全テストがパス

### Phase 2: TableElement の実装

#### ステップ2-1: ディレクトリ作成

```bash
mkdir -p src/converter/elements/table/table-element/__tests__
```

#### ステップ2-2: ファクトリメソッドのテスト作成

**ファイル**: `src/converter/elements/table/table-element/__tests__/table-element.factory.test.ts`

```typescript
import { test, expect } from "vitest";
import { TableElement } from "../table-element";

test("デフォルト値でtable要素が作成できる", () => {
  const table = TableElement.create();
  expect(table.type).toBe("element");
  expect(table.tagName).toBe("table");
  expect(table.children).toEqual([]);
});

test("border属性を指定してtable要素が作成できる", () => {
  const table = TableElement.create({ border: "1" });
  expect(table.attributes).toEqual({ border: "1" });
});

test("複数の属性を指定してtable要素が作成できる", () => {
  const table = TableElement.create({
    border: "1",
    class: "my-table",
    id: "table-1",
  });
  expect(table.attributes?.border).toBe("1");
  expect(table.attributes?.class).toBe("my-table");
  expect(table.attributes?.id).toBe("table-1");
});
```

#### ステップ2-3: テスト実行（Red）

```bash
npm test -- table-element.factory.test.ts
```

#### ステップ2-4: TableElement実装（最小実装）

**ファイル**: `src/converter/elements/table/table-element/table-element.ts`

```typescript
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { TableAttributes } from "../table-attributes";
import type { BaseElement } from "../../../base/base-element";
import type { TrElement } from "../../tr/tr-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * table要素の型定義
 * BaseElementを継承した専用の型
 */
export interface TableElement extends BaseElement<"table", TableAttributes> {
  children: TrElement[];
}

/**
 * TableElementコンパニオンオブジェクト
 */
export const TableElement = {
  /**
   * TableElement型ガード
   *
   * @param node - 判定対象のオブジェクト
   * @returns TableElementであればtrue
   */
  isTableElement(node: unknown): node is TableElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "table"
    );
  },

  /**
   * TableElement生成
   *
   * @param attributes - table要素の属性（オプショナル）
   * @returns 新しいTableElementオブジェクト
   */
  create(attributes: Partial<TableAttributes> = {}): TableElement {
    return {
      type: "element",
      tagName: "table",
      attributes: attributes as TableAttributes,
      children: [],
    };
  },

  /**
   * Figma変換
   *
   * @param element - 変換対象のTableElement
   * @returns FigmaNodeConfig（FrameNode設定）
   */
  toFigmaNode(element: TableElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("table");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "table",
          el.attributes,
        );
      },
      {
        applyCommonStyles: true,
      },
    );
  },

  /**
   * マッピング
   *
   * @param node - マッピング対象のオブジェクト
   * @returns FigmaNodeConfigまたはnull（変換失敗時）
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "table",
      this.isTableElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
```

#### ステップ2-5: 残りのテストファイル作成

他のテストファイル（typeguards、toFigmaNode、mapToFigma）も同様に作成します。
詳細は既存のtr-elementのテストを参考にしてください。

#### ステップ2-6: エクスポート設定

**ファイル**: `src/converter/elements/table/table-element/index.ts`

```typescript
export type { TableElement } from "./table-element";
export { TableElement } from "./table-element";
```

**ファイル**: `src/converter/elements/table/index.ts`

```typescript
// 既存のエクスポートに追加
export type { TableElement } from "./table-element";
export { TableElement } from "./table-element";
export type { TableAttributes } from "./table-attributes";
```

### Phase 3: 品質チェック

#### ステップ3-1: 全テスト実行

```bash
npm test
```

期待結果: 全テストがパス

#### ステップ3-2: Lint チェック

```bash
npm run lint
```

期待結果: エラーなし

#### ステップ3-3: 型チェック

```bash
npm run type-check
```

期待結果: エラーなし

#### ステップ3-4: カバレッジ確認

```bash
npm run coverage
```

期待結果: 90%以上のカバレッジ

## トラブルシューティング

### よくあるエラー

#### エラー1: TrElementが見つからない

**症状**: `Cannot find module 'TrElement'`

**解決策**:
```typescript
// インポートパスを確認
import type { TrElement } from "../../tr/tr-element";
```

#### エラー2: GlobalAttributesが見つからない

**症状**: `Cannot find module 'GlobalAttributes'`

**解決策**:
```typescript
// 正しいインポート
import type { GlobalAttributes } from "../../../base";
```

#### エラー3: テストが失敗する

**症状**: テストが期待通りに動作しない

**解決策**:
1. `npm test -- --reporter=verbose`で詳細を確認
2. 既存のtr-elementのテストと比較
3. 型定義が正しいか確認

## 次のステップ

1. **統合テストの追加**: 2x2、3x3テーブルのテスト
2. **スタイルテストの追加**: border、background-color等
3. **ドキュメント整備**: JSDocの追加・更新
4. **PRの作成**: 実装完了後、プルリクエストを作成

## 参考リソース

- [spec.md](./spec.md): 機能仕様
- [data-model.md](./data-model.md): データモデル定義
- [contracts/table-element-api.md](./contracts/table-element-api.md): API契約
- 既存実装:
  - `src/converter/elements/table/tr/`
  - `src/converter/elements/table/td/`
  - `src/converter/elements/container/div/`
