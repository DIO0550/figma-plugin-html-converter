# Quick Start: テーブルセクション（tbody, tfoot）

**最終更新**: 2025-11-23

## 概要

このガイドでは、tbody/tfoot要素を使ってHTMLテーブルをFigmaに変換する方法を説明します。

## 基本的な使い方

### 1. 最小限の例

#### TbodyElement

```typescript
import { TbodyElement } from "./converter/elements/table/tbody";

// 空のtbody要素を作成
const tbody = TbodyElement.create();

console.log(tbody);
// {
//   type: "element",
//   tagName: "tbody",
//   attributes: {},
//   children: []
// }
```

#### TfootElement

```typescript
import { TfootElement } from "./converter/elements/table/tfoot";

// 空のtfoot要素を作成
const tfoot = TfootElement.create();

console.log(tfoot);
// {
//   type: "element",
//   tagName: "tfoot",
//   attributes: {},
//   children: []
// }
```

### 2. 属性付きの作成

```typescript
// ID付きのtbody要素
const tbodyWithId = TbodyElement.create({ id: "table-body" });

// クラス付きのtfoot要素
const tfootWithClass = TfootElement.create({ class: "table-footer" });

// 複数の属性
const styledTbody = TbodyElement.create({
  id: "data-section",
  class: "table-body striped",
  style: "background-color: #f5f5f5;"
});
```

### 3. 子要素を含む作成

```typescript
import { TbodyElement } from "./converter/elements/table/tbody";
import { TrElement } from "./converter/elements/table/tr";

// tbody要素に行を追加
const tbody = TbodyElement.create();
tbody.children = [
  TrElement.create(),
  TrElement.create(),
  TrElement.create()
];
```

### 4. Figma変換

```typescript
// TbodyElementをFigma FrameNodeに変換
const tbody = TbodyElement.create();
const figmaConfig = TbodyElement.toFigmaNode(tbody);

console.log(figmaConfig);
// {
//   name: "tbody",
//   layoutMode: "VERTICAL",
//   primaryAxisAlignItems: "MIN",
//   counterAxisAlignItems: "MIN",
//   itemSpacing: 0,
//   ...
// }
```

### 5. 型ガードの使用

```typescript
import { TbodyElement } from "./converter/elements/table/tbody";

function processTbodyElement(node: unknown) {
  if (TbodyElement.isTbodyElement(node)) {
    // nodeはTbodyElement型として扱える
    console.log(`Tbody with ${node.children.length} rows`);
    const figmaConfig = TbodyElement.toFigmaNode(node);
    return figmaConfig;
  }
  return null;
}
```

## 実用例

### 例1: 完全なテーブル構造

```typescript
import { TheadElement } from "./converter/elements/table/thead";
import { TbodyElement } from "./converter/elements/table/tbody";
import { TfootElement } from "./converter/elements/table/tfoot";
import { TrElement } from "./converter/elements/table/tr";

// ヘッダーセクション
const thead = TheadElement.create({ class: "table-header" });
thead.children = [TrElement.create()];

// ボディセクション
const tbody = TbodyElement.create({ class: "table-body" });
tbody.children = [
  TrElement.create(),
  TrElement.create(),
  TrElement.create()
];

// フッターセクション
const tfoot = TfootElement.create({ class: "table-footer" });
tfoot.children = [TrElement.create()];

// Figma変換
const theadConfig = TheadElement.toFigmaNode(thead);
const tbodyConfig = TbodyElement.toFigmaNode(tbody);
const tfootConfig = TfootElement.toFigmaNode(tfoot);
```

### 例2: データテーブル

```typescript
import { TbodyElement } from "./converter/elements/table/tbody";
import { TrElement } from "./converter/elements/table/tr";

// データ行を動的に生成
const data = [
  { name: "製品A", price: "¥1,000" },
  { name: "製品B", price: "¥2,000" },
  { name: "製品C", price: "¥3,000" }
];

const tbody = TbodyElement.create({ id: "product-list" });
tbody.children = data.map(() => TrElement.create());

// Figma変換
const figmaConfig = TbodyElement.toFigmaNode(tbody);
```

### 例3: スタイル付きセクション

```typescript
import { TbodyElement } from "./converter/elements/table/tbody";
import { TfootElement } from "./converter/elements/table/tfoot";

// ストライプ付きのボディ
const tbody = TbodyElement.create({
  class: "striped",
  style: "background-color: #ffffff;"
});

// 強調されたフッター
const tfoot = TfootElement.create({
  class: "summary",
  style: "font-weight: bold; background-color: #e0e0e0;"
});
```

## マッピング機能

### HTMLからFigmaへの自動変換

```typescript
import { TbodyElement } from "./converter/elements/table/tbody";

// 未知のオブジェクトをマッピング
const htmlNode = {
  type: "element",
  tagName: "tbody",
  attributes: { class: "data-section" },
  children: []
};

const figmaConfig = TbodyElement.mapToFigma(htmlNode);
if (figmaConfig) {
  console.log("変換成功:", figmaConfig);
} else {
  console.log("変換失敗");
}
```

## テスト駆動開発（TDD）

### テストの書き方

```typescript
import { describe, it, expect } from "vitest";
import { TbodyElement } from "./tbody-element";

describe("TbodyElement", () => {
  describe("create()", () => {
    it("should create tbody element with default values", () => {
      const tbody = TbodyElement.create();

      expect(tbody.type).toBe("element");
      expect(tbody.tagName).toBe("tbody");
      expect(tbody.children).toEqual([]);
    });

    it("should create tbody element with attributes", () => {
      const tbody = TbodyElement.create({ id: "test" });

      expect(tbody.attributes.id).toBe("test");
    });
  });

  describe("isTbodyElement()", () => {
    it("should return true for valid tbody element", () => {
      const tbody = TbodyElement.create();

      expect(TbodyElement.isTbodyElement(tbody)).toBe(true);
    });

    it("should return false for invalid element", () => {
      expect(TbodyElement.isTbodyElement(null)).toBe(false);
      expect(TbodyElement.isTbodyElement({})).toBe(false);
    });
  });

  describe("toFigmaNode()", () => {
    it("should convert to Figma FrameNode config", () => {
      const tbody = TbodyElement.create();
      const config = TbodyElement.toFigmaNode(tbody);

      expect(config.name).toBe("tbody");
      expect(config.layoutMode).toBe("VERTICAL");
    });
  });
});
```

## ベストプラクティス

### 1. 型安全性の活用

```typescript
// ✅ 推奨: 型ガードを使用
if (TbodyElement.isTbodyElement(node)) {
  const config = TbodyElement.toFigmaNode(node);
}

// ❌ 非推奨: 型チェックなし
const config = TbodyElement.toFigmaNode(node as TbodyElement);
```

### 2. 不変性の維持

```typescript
// ✅ 推奨: 新しいオブジェクトを作成
const tbody1 = TbodyElement.create();
const tbody2 = { ...tbody1, attributes: { ...tbody1.attributes, id: "new-id" } };

// ❌ 非推奨: 既存オブジェクトを変更
tbody1.attributes.id = "new-id";
```

### 3. テストファースト

```typescript
// 1. テストを先に書く
describe("TbodyElement.create()", () => {
  it("should create empty tbody", () => {
    const tbody = TbodyElement.create();
    expect(tbody.children).toEqual([]);
  });
});

// 2. テストを実行（失敗することを確認）
// npm test

// 3. 実装を追加
export const TbodyElement = {
  create(attributes = {}) {
    return {
      type: "element",
      tagName: "tbody",
      attributes,
      children: []
    };
  }
};

// 4. テストを再実行（成功することを確認）
// npm test
```

## トラブルシューティング

### 問題1: 型エラー

```typescript
// エラー: Type 'unknown' is not assignable to type 'TbodyElement'
const tbody: TbodyElement = someUnknownValue;

// 解決策: 型ガードを使用
if (TbodyElement.isTbodyElement(someUnknownValue)) {
  const tbody: TbodyElement = someUnknownValue;
}
```

### 問題2: 子要素の型エラー

```typescript
// エラー: Type 'Element[]' is not assignable to type 'TrElement[]'
tbody.children = [someElement1, someElement2];

// 解決策: TrElementのみを追加
tbody.children = [
  TrElement.create(),
  TrElement.create()
];
```

## 次のステップ

1. **実装開始**: [tasks.md](./tasks.md) を参照して実装タスクを確認
2. **データモデル**: [data-model.md](./data-model.md) で詳細な型定義を確認
3. **設計調査**: [research.md](./research.md) で設計の背景を理解

## 参考資料

- [HTML仕様: tbody](https://developer.mozilla.org/ja/docs/Web/HTML/Element/tbody)
- [HTML仕様: tfoot](https://developer.mozilla.org/ja/docs/Web/HTML/Element/tfoot)
- [Figma Plugin API: FrameNode](https://www.figma.com/plugin-docs/api/FrameNode/)
- [既存実装: thead要素](../../../src/converter/elements/table/thead/)
