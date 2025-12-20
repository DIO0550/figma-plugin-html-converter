# Element API Contract: Caption, Colgroup, Col

**Date**: 2025-11-28
**Feature**: Issue #129 - Phase 1-4

## Overview

このドキュメントは、caption、colgroup、col要素の公開APIを定義します。

## API Contract

### CaptionElement API

```typescript
// エクスポート
export { CaptionElement } from "./caption-element";
export type { CaptionAttributes } from "./caption-attributes";

// 使用例
import { CaptionElement, CaptionAttributes } from "./caption";

// 型ガード
const isCaptionElement: (node: unknown) => node is CaptionElement;

// ファクトリ
const create: (attributes?: Partial<CaptionAttributes>) => CaptionElement;

// Figma変換
const toFigmaNode: (element: CaptionElement) => FigmaNodeConfig;

// マッピング
const mapToFigma: (node: unknown) => FigmaNodeConfig | null;
```

### ColgroupElement API

```typescript
// エクスポート
export { ColgroupElement } from "./colgroup-element";
export type { ColgroupAttributes } from "./colgroup-attributes";

// 使用例
import { ColgroupElement, ColgroupAttributes } from "./colgroup";

// 型ガード
const isColgroupElement: (node: unknown) => node is ColgroupElement;

// ファクトリ
const create: (attributes?: Partial<ColgroupAttributes>) => ColgroupElement;

// Figma変換（メタデータ要素のため null を返す可能性あり）
const toFigmaNode: (element: ColgroupElement) => FigmaNodeConfig | null;

// マッピング
const mapToFigma: (node: unknown) => FigmaNodeConfig | null;

// ユーティリティ
const getColumnCount: (element: ColgroupElement) => number;
```

### ColElement API

```typescript
// エクスポート
export { ColElement } from "./col-element";
export type { ColAttributes } from "./col-attributes";

// 使用例
import { ColElement, ColAttributes } from "./col";

// 型ガード
const isColElement: (node: unknown) => node is ColElement;

// ファクトリ
const create: (attributes?: Partial<ColAttributes>) => ColElement;

// Figma変換（メタデータ要素のため null を返す）
const toFigmaNode: (element: ColElement) => FigmaNodeConfig | null;

// マッピング
const mapToFigma: (node: unknown) => FigmaNodeConfig | null;

// ユーティリティ
const getSpan: (element: ColElement) => number;
const getWidth: (element: ColElement) => string | number | undefined;
```

## Table Index エクスポート更新

```typescript
// src/converter/elements/table/index.ts への追加

export { CaptionElement } from "./caption";
export type { CaptionAttributes } from "./caption";
export { ColgroupElement } from "./colgroup";
export type { ColgroupAttributes } from "./colgroup";
export { ColElement } from "./col";
export type { ColAttributes } from "./col";
```

## Error Handling

### 型ガード失敗

- `isXxxElement()` は無効な入力に対して `false` を返す
- 例外をスローしない

### 変換失敗

- `mapToFigma()` は変換できない場合 `null` を返す
- 例外をスローしない

### 無効な属性値

- `span` 属性が無効な値の場合、デフォルト値 `1` を使用
- `width` 属性が無効な値の場合、無視される

## Compatibility

### 既存API との互換性

- 既存の `TableElement`, `TrElement`, `TdElement`, `ThElement`,
  `TheadElement`, `TbodyElement`, `TfootElement` との互換性を維持
- 同じコンパニオンオブジェクトパターンを使用

### Breaking Changes

なし - 新規追加のみ
