# Quickstart: Caption, Colgroup, Col 要素の実装

**Date**: 2025-11-28
**Feature**: Issue #129 - Phase 1-4

## 概要

このドキュメントは、caption、colgroup、col要素の実装を開始するためのクイックガイドです。

## 前提条件

- Node.js >= 18.0.0
- TypeScript
- 既存のテーブル要素実装（table, tr, td, th, thead, tbody, tfoot）

## プロジェクト構造

```
src/converter/elements/table/
├── caption/
│   ├── index.ts
│   ├── caption-attributes/
│   │   ├── index.ts
│   │   ├── caption-attributes.ts
│   │   └── __tests__/
│   │       └── caption-attributes.test.ts
│   ├── caption-element/
│   │   ├── index.ts
│   │   ├── caption-element.ts
│   │   └── __tests__/
│   │       ├── caption-element.factory.test.ts
│   │       ├── caption-element.typeguards.test.ts
│   │       ├── caption-element.toFigmaNode.test.ts
│   │       └── caption-element.mapToFigma.test.ts
│   └── __tests__/
│       ├── caption-integration.basic.test.ts
│       └── caption-integration.styles.test.ts
├── colgroup/
│   ├── index.ts
│   ├── colgroup-attributes/
│   │   ├── index.ts
│   │   ├── colgroup-attributes.ts
│   │   └── __tests__/
│   │       └── colgroup-attributes.test.ts
│   ├── colgroup-element/
│   │   ├── index.ts
│   │   ├── colgroup-element.ts
│   │   └── __tests__/
│   │       ├── colgroup-element.factory.test.ts
│   │       ├── colgroup-element.typeguards.test.ts
│   │       └── colgroup-element.mapToFigma.test.ts
│   └── __tests__/
│       └── colgroup-integration.test.ts
├── col/
│   ├── index.ts
│   ├── col-attributes/
│   │   ├── index.ts
│   │   ├── col-attributes.ts
│   │   └── __tests__/
│   │       └── col-attributes.test.ts
│   ├── col-element/
│   │   ├── index.ts
│   │   ├── col-element.ts
│   │   └── __tests__/
│   │       ├── col-element.factory.test.ts
│   │       ├── col-element.typeguards.test.ts
│   │       └── col-element.mapToFigma.test.ts
│   └── __tests__/
│       └── col-integration.test.ts
└── __tests__/
    └── table-caption-col-integration.test.ts  # 新規追加
```

## 実装手順

### Step 1: Caption要素の実装

1. **属性定義** (`caption-attributes.ts`)
```typescript
import type { GlobalAttributes } from "../../../base";

export interface CaptionAttributes extends GlobalAttributes {}
```

2. **要素実装** (`caption-element.ts`)
```typescript
// thead-element.ts をベースに実装
// 主な違い: children の型が TrElement[] ではなく汎用的なコンテンツ
```

3. **テスト作成** (TDD: Red → Green → Refactor)

### Step 2: Col要素の実装

1. **属性定義** (`col-attributes.ts`)
```typescript
import type { GlobalAttributes } from "../../../base";

export interface ColAttributes extends GlobalAttributes {
  span?: number | string;
  width?: string | number;
}
```

2. **要素実装** (`col-element.ts`)
```typescript
// 空要素として実装
// toFigmaNode は null を返す（視覚的ノードなし）
```

### Step 3: Colgroup要素の実装

1. **属性定義** (`colgroup-attributes.ts`)
```typescript
import type { GlobalAttributes } from "../../../base";

export interface ColgroupAttributes extends GlobalAttributes {
  span?: number | string;
}
```

2. **要素実装** (`colgroup-element.ts`)
```typescript
// col要素を子として持つ
// toFigmaNode は null を返す（視覚的ノードなし）
```

### Step 4: エクスポート更新

`src/converter/elements/table/index.ts` に追加:

```typescript
export { CaptionElement } from "./caption";
export type { CaptionAttributes } from "./caption";
export { ColgroupElement } from "./colgroup";
export type { ColgroupAttributes } from "./colgroup";
export { ColElement } from "./col";
export type { ColAttributes } from "./col";
```

### Step 5: 統合テスト

`table-caption-col-integration.test.ts` で以下をテスト:

- caption付きテーブルの変換
- colgroup/col付きテーブルの変換
- 列幅指定の適用

## コマンド

```bash
# テスト実行
npm run test -- --run src/converter/elements/table/caption/
npm run test -- --run src/converter/elements/table/col/
npm run test -- --run src/converter/elements/table/colgroup/

# カバレッジ確認
npm run coverage -- --run src/converter/elements/table/caption/ src/converter/elements/table/col/ src/converter/elements/table/colgroup/

# lint チェック
npm run lint

# 型チェック
npm run type-check
```

## 参考実装

既存の実装を参考にする:

- `src/converter/elements/table/thead/` - セクション要素の実装パターン
- `src/converter/elements/table/tbody/` - 同上
- `src/converter/elements/table/th/` - セル要素の実装パターン

## 注意事項

1. **TDDの徹底**: テストを先に書いてから実装
2. **品質チェック**: コード変更後は必ず `npm run test`, `npm run lint`, `npm run type-check` を実行
3. **JSDoc**: 全パブリックAPIにドキュメント必須
4. **カバレッジ**: 90%以上を維持
