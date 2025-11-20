# ThElement Quick Start Guide

**Version**: 1.0.0
**Date**: 2025-11-17

## はじめに

このガイドでは、ThElement（テーブルヘッダー要素）の基本的な使用方法を説明します。

## インストール

th要素は本プロジェクトの一部として提供されます。特別なインストールは不要です。

## 基本的な使い方

### 1. インポート

```typescript
import { ThElement } from "@/converter/elements/table/th";
import type { ThAttributes } from "@/converter/elements/table/th";
```

### 2. 要素の作成

#### パターンA: 属性なしで作成

```typescript
const headerCell = ThElement.create();

console.log(headerCell);
// Output:
// {
//   type: "element",
//   tagName: "th",
//   attributes: {},
//   children: []
// }
```

#### パターンB: 属性を指定して作成

```typescript
const headerCell = ThElement.create({
  scope: "col",
  width: "100px",
  style: "background-color: #f0f0f0; font-weight: bold;"
});

console.log(headerCell);
// Output:
// {
//   type: "element",
//   tagName: "th",
//   attributes: {
//     scope: "col",
//     width: "100px",
//     style: "background-color: #f0f0f0; font-weight: bold;"
//   },
//   children: []
// }
```

### 3. 型ガード

```typescript
function processNode(node: unknown) {
  if (ThElement.isThElement(node)) {
    // ここではnodeの型がThElementに絞り込まれる
    console.log(`Processing th element with scope: ${node.attributes.scope}`);

    // Figmaノードに変換
    const figmaNode = ThElement.toFigmaNode(node);
    return figmaNode;
  }

  return null;
}
```

### 4. Figma変換

```typescript
const headerCell = ThElement.create({
  scope: "col",
  width: "120px",
  style: "text-align: left; padding: 8px;"
});

const figmaNode = ThElement.toFigmaNode(headerCell);

console.log(figmaNode);
// Output: FigmaNodeConfig with:
// - type: "FRAME"
// - name: "th-col"
// - default styles applied (bold, center-aligned)
// - user styles override defaults
```

### 5. mapToFigmaを使用した変換

```typescript
function convertUnknownNode(node: unknown) {
  const figmaNode = ThElement.mapToFigma(node);

  if (figmaNode) {
    console.log("Successfully converted to Figma node");
    return figmaNode;
  } else {
    console.log("Not a valid ThElement");
    return null;
  }
}

// 使用例
const validNode = ThElement.create({ scope: "row" });
const result1 = convertUnknownNode(validNode); // → FigmaNodeConfig

const invalidNode = { type: "text", content: "Hello" };
const result2 = convertUnknownNode(invalidNode); // → null
```

## よくある使用例

### 例1: テーブルヘッダー行の作成

```typescript
// 列ヘッダーの作成
const headers = [
  ThElement.create({ scope: "col", abbr: "Name" }),
  ThElement.create({ scope: "col", abbr: "Age" }),
  ThElement.create({ scope: "col", abbr: "Email" }),
];

// Figmaノードに変換
const figmaHeaders = headers.map(header => ThElement.toFigmaNode(header));
```

### 例2: 行ヘッダーの作成

```typescript
const rowHeader = ThElement.create({
  scope: "row",
  style: "font-weight: bold; background-color: #e0e0e0; padding: 10px;"
});

const figmaNode = ThElement.toFigmaNode(rowHeader);
```

### 例3: 結合セル（colspan/rowspan）

```typescript
const mergedHeader = ThElement.create({
  scope: "colgroup",
  colspan: "3",
  style: "text-align: center; background-color: #d0d0d0;"
});

const figmaNode = ThElement.toFigmaNode(mergedHeader);
```

### 例4: カスタムスタイルで上書き

```typescript
// デフォルトは太字・中央揃えだが、ユーザースタイルで上書き
const customHeader = ThElement.create({
  scope: "col",
  style: "font-weight: normal; text-align: left; color: #333;"
});

const figmaNode = ThElement.toFigmaNode(customHeader);
// → font-weight: normal, text-align: left が適用される
```

## scope属性の使用

scope属性はヘッダーセルが適用される範囲を示します。

### col: 列ヘッダー

```typescript
const columnHeader = ThElement.create({ scope: "col" });
const figmaNode = ThElement.toFigmaNode(columnHeader);
// → ノード名: "th-col"
```

### row: 行ヘッダー

```typescript
const rowHeader = ThElement.create({ scope: "row" });
const figmaNode = ThElement.toFigmaNode(rowHeader);
// → ノード名: "th-row"
```

### colgroup: 列グループヘッダー

```typescript
const colGroupHeader = ThElement.create({
  scope: "colgroup",
  colspan: "3"
});
const figmaNode = ThElement.toFigmaNode(colGroupHeader);
// → ノード名: "th-colgroup"
```

### rowgroup: 行グループヘッダー

```typescript
const rowGroupHeader = ThElement.create({
  scope: "rowgroup",
  rowspan: "2"
});
const figmaNode = ThElement.toFigmaNode(rowGroupHeader);
// → ノード名: "th-rowgroup"
```

## デフォルトスタイル

th要素には以下のデフォルトスタイルが自動的に適用されます：

1. **font-weight: bold** (太字)
2. **text-align: center** (中央揃え)
3. **vertical-align: middle** (垂直方向の中央揃え)

これらはユーザー指定のstyle属性で上書きできます。

### デフォルトスタイルをそのまま使用

```typescript
const header = ThElement.create({ scope: "col" });
const figmaNode = ThElement.toFigmaNode(header);
// → 太字・中央揃えで表示される
```

### デフォルトスタイルを上書き

```typescript
const header = ThElement.create({
  scope: "col",
  style: "font-weight: normal; text-align: left;"
});
const figmaNode = ThElement.toFigmaNode(header);
// → 通常の太さ・左揃えで表示される
```

## 型定義

### ThAttributes

```typescript
interface ThAttributes extends GlobalAttributes {
  width?: string;          // セルの幅
  height?: string;         // セルの高さ
  scope?: "col" | "row" | "colgroup" | "rowgroup";  // 適用範囲
  abbr?: string;           // 省略形テキスト
  colspan?: string;        // 列の結合数
  rowspan?: string;        // 行の結合数
}
```

### ThElement

```typescript
interface ThElement extends BaseElement<"th", ThAttributes> {
  type: "element";
  tagName: "th";
  attributes: ThAttributes;
  children: ThElement[] | [];
}
```

## エラーハンドリング

### 型ガードによる安全な処理

```typescript
function safeFigmaConversion(node: unknown): FigmaNodeConfig | null {
  try {
    if (ThElement.isThElement(node)) {
      return ThElement.toFigmaNode(node);
    }
    return null;
  } catch (error) {
    console.error("Conversion error:", error);
    return null;
  }
}
```

### mapToFigmaを使用した安全な変換

```typescript
// mapToFigmaは内部でエラーハンドリングを行うため、
// 常にnullまたはFigmaNodeConfigを返す（例外を投げない）
const figmaNode = ThElement.mapToFigma(unknownNode);

if (figmaNode) {
  // 成功
  console.log("Conversion successful");
} else {
  // 失敗
  console.log("Not a valid ThElement");
}
```

## ベストプラクティス

### 1. 型安全性を活用する

```typescript
// Good: 型推論を活用
const header = ThElement.create({ scope: "col" });

// Bad: any型を使用しない
const header: any = { type: "element", tagName: "th" };
```

### 2. scope属性を適切に使用する

```typescript
// Good: 列ヘッダーにはscope="col"
const columnHeader = ThElement.create({ scope: "col" });

// Good: 行ヘッダーにはscope="row"
const rowHeader = ThElement.create({ scope: "row" });
```

### 3. スタイルはCSS文字列で指定する

```typescript
// Good: CSS文字列で指定
const header = ThElement.create({
  style: "background-color: #f0f0f0; padding: 8px;"
});

// Bad: オブジェクトは使用できない（GlobalAttributesのstyleは文字列）
const header = ThElement.create({
  style: { backgroundColor: "#f0f0f0", padding: "8px" } // ❌ エラー
});
```

### 4. バリデーションを実装する

```typescript
function createValidHeader(attrs: Partial<ThAttributes>): ThElement | null {
  // 属性のバリデーション
  if (attrs.colspan) {
    const num = parseInt(attrs.colspan, 10);
    if (isNaN(num) || num < 1) {
      console.error("Invalid colspan value");
      return null;
    }
  }

  return ThElement.create(attrs);
}
```

## トラブルシューティング

### Q1: Figma変換後のスタイルが期待通りでない

**A**: ユーザー指定のstyle属性がデフォルトスタイルを上書きします。意図しない上書きがないか確認してください。

```typescript
// デフォルトは太字だが、normalで上書きされる
const header = ThElement.create({
  style: "font-weight: normal;"  // これがデフォルトを上書き
});
```

### Q2: scope属性がFigmaノードに反映されない

**A**: scope属性はFigmaノードの`name`プロパティに反映されます。Figmaのレイヤーパネルでノード名を確認してください。

```typescript
const header = ThElement.create({ scope: "col" });
const figmaNode = ThElement.toFigmaNode(header);
console.log(figmaNode.name);  // → "th-col"
```

### Q3: 型エラーが発生する

**A**: 必ず`ThElement.create()`を使用して要素を作成してください。手動でオブジェクトを作成すると型エラーが発生する可能性があります。

```typescript
// Good ✅
const header = ThElement.create({ scope: "col" });

// Bad ❌
const header: ThElement = {
  type: "element",
  tagName: "th",
  attributes: { scope: "col" },
  children: []
};
```

## 次のステップ

- [API Contract](./contracts/th-element-api.md): 詳細なAPI仕様
- [Data Model](./data-model.md): データモデルの詳細
- [Research](./research.md): 技術調査の詳細

## サポート

問題が発生した場合は、プロジェクトのIssueトラッカーで報告してください。
