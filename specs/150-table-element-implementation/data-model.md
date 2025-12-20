# Data Model: table要素

**Date**: 2025-11-21
**Feature**: table要素（テーブル全体）の実装

## 概要

table要素のデータモデルを定義します。既存のBaseElement型を継承し、table固有の属性と子要素の型を定義します。

## エンティティ定義

### 1. TableAttributes

table要素の属性インターフェース。GlobalAttributesを拡張します。

#### フィールド

| フィールド | 型 | 必須 | 説明 |
|----------|------|------|------|
| (継承) | GlobalAttributes | - | class, id, style等のグローバル属性 |
| border | string | ❌ | テーブル全体のボーダー幅（廃止予定だがサポート） |

#### 型定義

```typescript
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

#### バリデーションルール

- `border`: 数値文字列（例: "1", "2"）
- 空の場合はボーダーなし
- グローバル属性は`GlobalAttributes`の検証に従う

### 2. TableElement

table要素のインターフェース。BaseElementを継承します。

#### フィールド

| フィールド | 型 | 必須 | 説明 |
|----------|------|------|------|
| type | "element" | ✅ | ノードタイプ（常に"element"） |
| tagName | "table" | ✅ | HTML要素のタグ名（常に"table"） |
| attributes | TableAttributes | ❌ | table要素の属性 |
| children | TrElement[] | ✅ | 子要素（tr要素の配列） |

#### 型定義

```typescript
/**
 * table要素の型定義
 * BaseElementを継承した専用の型
 */
export interface TableElement extends BaseElement<"table", TableAttributes> {
  /**
   * 子要素（tr要素の配列）
   *
   * table要素の直接の子はtr要素のみです。
   * 空配列も許容されます（空のテーブル）。
   */
  children: TrElement[];
}
```

#### 状態遷移

table要素自体に状態遷移はありません。作成後は不変です。

#### 関係性

```
TableElement (1) ---> (*) TrElement
                      |
                      +---> (*) TdElement | ThElement
```

- 1つのTableElementは0個以上のTrElementを持つ
- 各TrElementは0個以上のTdElement/ThElementを持つ

### 3. TableElementコンパニオンオブジェクト

TableElementに対する操作を提供するコンパニオンオブジェクト。

#### メソッド

##### create

```typescript
/**
 * TableElement生成
 *
 * @param attributes - table要素の属性（オプショナル）
 * @returns 新しいTableElementオブジェクト
 */
create(attributes: Partial<TableAttributes> = {}): TableElement
```

**パラメータ**:
- `attributes`: TableAttributesの部分型（全フィールドオプショナル）

**戻り値**:
- 初期化されたTableElement（children: []）

**例**:
```typescript
const table = TableElement.create();
const tableWithBorder = TableElement.create({ border: "1" });
```

##### isTableElement

```typescript
/**
 * TableElement型ガード
 *
 * @param node - 判定対象のオブジェクト
 * @returns TableElementであればtrue
 */
isTableElement(node: unknown): node is TableElement
```

**検証項目**:
1. `typeof node === "object" && node !== null`
2. `"type" in node && node.type === "element"`
3. `"tagName" in node && node.tagName === "table"`

##### toFigmaNode

```typescript
/**
 * Figma変換
 *
 * @param element - 変換対象のTableElement
 * @returns FigmaNodeConfig（FrameNode設定）
 */
toFigmaNode(element: TableElement): FigmaNodeConfig
```

**処理フロー**:
1. `toFigmaNodeWith`ユーティリティを使用
2. `FigmaNode.createFrame("table")`でFrameNode作成
3. `FigmaNodeConfig.applyHtmlElementDefaults`で基本スタイル適用
4. Auto Layout設定（VERTICAL、MIN、MIN、itemSpacing: 0）
5. 子要素（TrElement[]）を変換して追加

**戻り値**:
- FrameNode設定を持つFigmaNodeConfig

##### mapToFigma

```typescript
/**
 * マッピング
 *
 * @param node - マッピング対象のオブジェクト
 * @returns FigmaNodeConfigまたはnull（変換失敗時）
 */
mapToFigma(node: unknown): FigmaNodeConfig | null
```

**処理フロー**:
1. `mapToFigmaWith`ユーティリティを使用
2. 型ガード → ファクトリ → 変換の順で実行
3. エラー時はnullを返す

## データフロー

### 作成フロー

```
HTMLパース
  ↓
TableElement.create({ border: "1" })
  ↓
{ type: "element", tagName: "table", attributes: { border: "1" }, children: [] }
```

### 変換フロー

```
TableElement (with TrElement[])
  ↓
TableElement.toFigmaNode()
  ↓
toFigmaNodeWith()
  ↓
FigmaNode.createFrame("table")
  ↓
FigmaNodeConfig.applyHtmlElementDefaults()
  ↓
子要素の変換（各TrElement.toFigmaNode()）
  ↓
FigmaNodeConfig (FrameNode)
```

## 依存関係

### 型依存

```
TableElement
  ├─> BaseElement<"table", TableAttributes>
  ├─> TableAttributes extends GlobalAttributes
  └─> children: TrElement[]
       └─> TrElement (既存)
```

### 実行時依存

- `FigmaNode.createFrame()`
- `FigmaNodeConfig.applyHtmlElementDefaults()`
- `toFigmaNodeWith()`
- `mapToFigmaWith()`

## 制約と不変条件

### 不変条件

1. `type`は常に`"element"`
2. `tagName`は常に`"table"`
3. `children`は`TrElement[]`型（他の要素型は含まない）
4. `border`は数値文字列または未定義

### パフォーマンス制約

- table要素の変換は<1秒で完了すること
- 子要素の数が100個を超える場合でも正常に動作すること

## テストデータ例

### 最小構成

```typescript
{
  type: "element",
  tagName: "table",
  attributes: {},
  children: []
}
```

### 基本構成（2x2テーブル）

```typescript
{
  type: "element",
  tagName: "table",
  attributes: { border: "1" },
  children: [
    {
      type: "element",
      tagName: "tr",
      children: [
        { type: "element", tagName: "td", children: [] },
        { type: "element", tagName: "td", children: [] }
      ]
    },
    {
      type: "element",
      tagName: "tr",
      children: [
        { type: "element", tagName: "td", children: [] },
        { type: "element", tagName: "td", children: [] }
      ]
    }
  ]
}
```

### スタイル付き

```typescript
{
  type: "element",
  tagName: "table",
  attributes: {
    border: "1",
    style: "background-color: #f0f0f0; padding: 10px;"
  },
  children: [...]
}
```
