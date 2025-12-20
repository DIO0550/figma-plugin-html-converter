# Feature Specification: Table Header Element (th)

**Branch**: `001-table-header-element` | **Date**: 2025-11-17

## Overview

HTMLの`<th>`要素（テーブルヘッダーセル）をFigmaノードに変換する機能を実装します。th要素はテーブルのヘッダーセルを表し、通常はテーブルの列または行の見出しとして使用されます。

## Background

### Current State
- ✅ td要素（テーブルデータセル）は実装済み
- ✅ BaseElement、GlobalAttributesなどの基盤は整備済み
- ❌ th要素は未実装

### Problem Statement
テーブルのヘッダー行を正確に表現するため、th要素のサポートが必要です。th要素はtd要素と類似していますが、以下の点で異なります：

1. **セマンティクス**: ヘッダーセルであることを明示的に表現
2. **デフォルトスタイル**: 通常は太字、中央揃え
3. **scope属性**: ヘッダーがどの範囲に適用されるか（col, row, colgroup, rowgroup）

## Requirements

### Functional Requirements

#### FR1: th要素の型定義
- BaseElementを継承したThElement型を定義
- ThAttributes型を定義（GlobalAttributes + 固有属性）
- 型ガード関数（isThElement）を実装

#### FR2: th要素固有の属性サポート
- `width`: セルの幅（ピクセルまたは相対値）
- `height`: セルの高さ（ピクセルまたは相対値）
- `scope`: ヘッダーの適用範囲（"col" | "row" | "colgroup" | "rowgroup"）
- `abbr`: ヘッダーセルの省略形テキスト
- `colspan`: 列の結合数
- `rowspan`: 行の結合数

#### FR3: Figma変換機能
- ThElementをFigma FrameNodeに変換
- デフォルトでテキストを太字にする（font-weight: bold）
- デフォルトでテキストを中央揃えにする（text-align: center）
- 共通スタイル属性を適用（border, background-color, padding等）

#### FR4: ファクトリメソッド
- `ThElement.create()`: 新しいThElementインスタンスを生成
- デフォルト値の設定

### Non-Functional Requirements

#### NFR1: テスト駆動開発
- すべての機能に対してユニットテストを作成
- 統合テストで実際の変換結果を検証
- カバレッジ95%以上を維持

#### NFR2: 型安全性
- TypeScriptの厳格な型チェックに準拠
- 型推論を活用した使いやすいAPI

#### NFR3: 保守性
- td要素と同様のコード構造を維持
- 明確なJSDocコメントを記載
- 命名規則の統一

## Technical Approach

### Architecture

```
src/converter/elements/table/th/
├── index.ts                              # エクスポート定義
├── th-element/
│   ├── index.ts                          # エクスポート
│   ├── th-element.ts                     # ThElement型と変換ロジック
│   └── __tests__/
│       └── th-element.test.ts            # ユニットテスト
├── th-attributes/
│   ├── index.ts                          # エクスポート
│   ├── th-attributes.ts                  # ThAttributes型定義
│   └── __tests__/
│       └── th-attributes.test.ts         # 属性テスト
└── __tests__/
    └── th-integration.test.ts            # 統合テスト
```

### Implementation Strategy

1. **Phase 1: 属性定義**
   - ThAttributes型の定義
   - 属性のテスト作成

2. **Phase 2: 要素実装**
   - ThElement型の定義
   - 型ガード関数の実装
   - ファクトリメソッドの実装

3. **Phase 3: Figma変換**
   - toFigmaNode関数の実装
   - デフォルトスタイルの適用
   - mapToFigma関数の実装

4. **Phase 4: テスト**
   - ユニットテストの実装
   - 統合テストの実装
   - エッジケースのテスト

### Dependencies

- `src/converter/elements/base/`: BaseElement, GlobalAttributes
- `src/models/figma-node/`: FigmaNode, FigmaNodeConfig
- `src/utils/`: element-utils, to-figma-node-with

### Constraints

- td要素の実装パターンを踏襲する
- 既存のユーティリティ関数を活用する
- パフォーマンスへの影響を最小限にする

## Success Criteria

1. ✅ ThElement型とThAttributes型が正しく定義されている
2. ✅ th要素からFigmaノードへの変換が正しく動作する
3. ✅ scope属性が適切に解釈される
4. ✅ デフォルトスタイル（太字、中央揃え）が適用される
5. ✅ すべてのテストがパスする
6. ✅ コードカバレッジが95%以上
7. ✅ 型エラーが存在しない
8. ✅ Lintエラーが存在しない

## Out of Scope

以下は本仕様の対象外とします：

- `<tr>` 要素の実装
- `<table>` 要素全体の実装
- `<thead>`, `<tbody>`, `<tfoot>` 要素の実装
- 複雑なテーブルレイアウトの最適化
- アクセシビリティ機能（ARIA属性など）の詳細な実装

## References

- [MDN: &lt;th&gt; 要素](https://developer.mozilla.org/ja/docs/Web/HTML/Element/th)
- [HTML Standard: The th element](https://html.spec.whatwg.org/multipage/tables.html#the-th-element)
- 既存実装: `src/converter/elements/table/td/`
