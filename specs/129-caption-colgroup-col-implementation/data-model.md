# Data Model: Caption, Colgroup, Col 要素

**Date**: 2025-11-28
**Feature**: Issue #129 - Phase 1-4

## エンティティ定義

### 1. CaptionElement

テーブルキャプションを表す要素。

```typescript
/**
 * caption要素の属性インターフェース
 */
export interface CaptionAttributes extends GlobalAttributes {
  // caption要素にはHTML5で固有の属性はない
  // 以前のalign属性は非推奨
}

/**
 * caption要素の型定義
 */
export interface CaptionElement extends BaseElement<"caption", CaptionAttributes> {
  /**
   * 子要素
   * caption要素はフローコンテンツを子として持てる
   */
  children: (TextNode | Element)[];
}

/**
 * CaptionElementコンパニオンオブジェクト
 */
export const CaptionElement = {
  isCaptionElement(node: unknown): node is CaptionElement;
  create(attributes?: Partial<CaptionAttributes>): CaptionElement;
  toFigmaNode(element: CaptionElement): FigmaNodeConfig;
  mapToFigma(node: unknown): FigmaNodeConfig | null;
};
```

### 2. ColgroupElement

テーブルの列グループを表す要素。

```typescript
/**
 * colgroup要素の属性インターフェース
 */
export interface ColgroupAttributes extends GlobalAttributes {
  /**
   * グループ化する列数
   * col要素が子にない場合のみ有効
   * @default 1
   */
  span?: number | string;
}

/**
 * colgroup要素の型定義
 */
export interface ColgroupElement extends BaseElement<"colgroup", ColgroupAttributes> {
  /**
   * 子要素（col要素の配列）
   */
  children: ColElement[];
}

/**
 * ColgroupElementコンパニオンオブジェクト
 */
export const ColgroupElement = {
  isColgroupElement(node: unknown): node is ColgroupElement;
  create(attributes?: Partial<ColgroupAttributes>): ColgroupElement;
  toFigmaNode(element: ColgroupElement): FigmaNodeConfig | null; // 視覚的ノードなし
  mapToFigma(node: unknown): FigmaNodeConfig | null;
  getColumnCount(element: ColgroupElement): number;
};
```

### 3. ColElement

個々の列を定義する要素。

```typescript
/**
 * col要素の属性インターフェース
 */
export interface ColAttributes extends GlobalAttributes {
  /**
   * この要素が適用される列数
   * @default 1
   */
  span?: number | string;

  /**
   * 列の幅（非推奨、CSSを推奨）
   * ただし後方互換性のためサポート
   */
  width?: string | number;
}

/**
 * col要素の型定義
 */
export interface ColElement extends BaseElement<"col", ColAttributes> {
  /**
   * 子要素（空要素のため常に空）
   */
  children: never[];
}

/**
 * ColElementコンパニオンオブジェクト
 */
export const ColElement = {
  isColElement(node: unknown): node is ColElement;
  create(attributes?: Partial<ColAttributes>): ColElement;
  toFigmaNode(element: ColElement): FigmaNodeConfig | null; // 視覚的ノードなし
  mapToFigma(node: unknown): FigmaNodeConfig | null;
  getSpan(element: ColElement): number;
  getWidth(element: ColElement): string | number | undefined;
};
```

## 関係性

```
TableElement
├── CaptionElement? (0..1)     # オプショナル、最初の子
├── ColgroupElement* (0..*)    # 0個以上
│   └── ColElement* (0..*)     # 0個以上
├── TheadElement? (0..1)
├── TbodyElement* (0..*)
└── TfootElement? (0..1)
```

## バリデーションルール

### CaptionElement

1. テーブル内で最大1つ
2. テーブルの最初の子要素として配置

### ColgroupElement

1. caption要素の後に配置
2. thead/tbody/tfoot/trの前に配置
3. span属性は正の整数

### ColElement

1. colgroup要素の子としてのみ有効
2. 空要素（子要素を持たない）
3. span属性は正の整数

## 状態遷移

これらの要素は状態遷移を持たない静的要素です。

## Figma変換マッピング

| HTML Element | Figma Node | Notes |
|--------------|------------|-------|
| caption | FRAME | テキスト/フローコンテンツを含むフレーム |
| colgroup | null | 視覚的表現なし、メタデータとして処理 |
| col | null | 視覚的表現なし、列スタイル情報として処理 |

## 列情報の管理

```typescript
/**
 * 列スタイル情報
 */
interface ColumnStyleInfo {
  /** 列インデックス（0始まり） */
  index: number;
  /** 列幅 */
  width?: string | number;
  /** 適用するスタイル */
  style?: string;
}

/**
 * テーブルの列情報を収集
 */
function collectColumnInfo(
  colgroups: ColgroupElement[]
): ColumnStyleInfo[] {
  const columns: ColumnStyleInfo[] = [];
  let currentIndex = 0;

  for (const colgroup of colgroups) {
    if (colgroup.children.length === 0) {
      // span属性で列数を決定
      const span = parseInt(String(colgroup.attributes.span || 1), 10);
      for (let i = 0; i < span; i++) {
        columns.push({
          index: currentIndex++,
          style: colgroup.attributes.style,
        });
      }
    } else {
      // col要素から列情報を収集
      for (const col of colgroup.children) {
        const span = parseInt(String(col.attributes.span || 1), 10);
        for (let i = 0; i < span; i++) {
          columns.push({
            index: currentIndex++,
            width: col.attributes.width,
            style: col.attributes.style,
          });
        }
      }
    }
  }

  return columns;
}
```
