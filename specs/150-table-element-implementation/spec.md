# Feature Specification: table要素（テーブル全体）の実装

**Issue**: [#150](https://github.com/DIO0550/figma-plugin-html-converter/issues/150)
**Created**: 2025-11-21
**Status**: In Planning

## 概要

テーブル要素（`<table>`）のFigma変換機能を実装します。HTMLのtable要素をFigmaのFrameNodeに変換し、縦方向のAuto Layoutで複数のtr要素（行）を配置します。

## 目的

- HTMLのtable要素をFigmaデザインに変換できるようにする
- 既存のtr、td、th要素と組み合わせて、完全なテーブル構造を表現する
- スタイル属性（border、background-color、padding）を適切にFigmaに反映する

## 機能要件

### 対象要素

- `<table>`: テーブル全体のコンテナ

### 変換仕様

- **Figmaノード**: FrameNode
- **レイアウト**: 縦方向（VERTICAL）のAuto Layout
  - layoutMode: VERTICAL（縦方向）
  - primaryAxisAlignItems: MIN（上揃え）
  - counterAxisAlignItems: MIN（左揃え）
  - itemSpacing: 0（行間隔なし、ボーダーで表現）
- **子要素**: TrElement[]（複数の行）
- **スタイリング**: border、background-color、paddingの変換

### サポートするHTML属性

- `border`: テーブル全体のボーダー（廃止予定だがサポート）
- グローバル属性（class、id、style等）

### 子要素の変換

- 各TrElementを`toFigmaNode`で変換
- 変換したノードを`children`に追加
- 縦方向に順次配置

### ボーダー処理

- table要素のborder属性がある場合、全体にstrokeを適用
- 各セルのボーダーとの重複を避ける調整を考慮

## 技術要件

### ファイル構成

```
src/converter/elements/table/
├── table-element/
│   ├── table-element.ts
│   ├── __tests__/
│   │   ├── table-element.factory.test.ts
│   │   ├── table-element.typeguards.test.ts
│   │   ├── table-element.toFigmaNode.test.ts
│   │   └── table-element.mapToFigma.test.ts
│   └── index.ts
├── table-attributes/
│   ├── table-attributes.ts
│   ├── __tests__/
│   │   └── table-attributes.test.ts
│   └── index.ts
└── index.ts  # 全体のエクスポート
```

### 型定義

#### TableAttributes

```typescript
export interface TableAttributes extends GlobalAttributes {
  border?: string;
}
```

#### TableElement

```typescript
export interface TableElement extends BaseElement<"table", TableAttributes> {
  children: TrElement[];
}
```

### 実装メソッド

1. **TableElement.create()**: ファクトリメソッド
2. **TableElement.isTableElement()**: 型ガード
3. **TableElement.toFigmaNode()**: Figma変換ロジック
4. **TableElement.mapToFigma()**: マッピングメソッド

### パターン

既存のtd、tr、div要素と同じコンパニオンオブジェクトパターンを使用:
- `toFigmaNodeWith`ユーティリティを使用
- `mapToFigmaWith`ユーティリティを使用
- `FigmaNodeConfig.applyHtmlElementDefaults`で基本スタイル適用

## テスト要件

### 単体テスト

#### TableAttributes
- [ ] border属性のパース
- [ ] グローバル属性の継承

#### TableElement
- [ ] `create()`メソッドのテスト
- [ ] `isTableElement()`型ガードのテスト
- [ ] `toFigmaNode()`変換ロジックのテスト
- [ ] `mapToFigma()`マッピングのテスト

### 統合テスト

- [ ] 基本的なtable要素の生成テスト
- [ ] Figma変換テスト（空のテーブル）
- [ ] 2x2テーブルの変換テスト
- [ ] 3x3テーブルの変換テスト
- [ ] スタイル適用テスト（border、background-color）
- [ ] 複雑なネスト構造のテスト

### テストケース

#### 基本テスト
- 空のテーブル
- 1行1列のテーブル

#### 標準テスト
- 2x2テーブル（最小の実用的なテーブル）
- 3x3テーブル

#### スタイルテスト
- ボーダーあり/なし
- 背景色あり/なし
- パディングあり/なし

## 完了条件

- [ ] テストがグリーン（カバレッジ90%以上）
- [ ] table要素が正しくFigma FrameNodeに変換される
- [ ] 子要素（tr）が縦方向に配置される
- [ ] 2x2、3x3のテーブルが正しく変換される
- [ ] スタイル属性が適切に適用される
- [ ] APIドキュメント（JSDoc）が完備
- [ ] lint/type-checkがパス

## 依存関係

### 必須
- ✅ td要素の実装が完了していること
- ✅ tr要素の実装が完了していること

### 使用する既存コンポーネント
- BaseElement型
- FigmaNodeConfig、FigmaNode
- toFigmaNodeWith、mapToFigmaWith ユーティリティ

## 制約事項

- TDD（テスト駆動開発）で実装すること
- 既存のコードパターンに従うこと
- ESLintルールを遵守すること
- TypeScript strictモードに準拠すること

## 見積もり工数

1-2日

## 関連Issue

- 親Issue: #126 - Phase 1-1: 基本テーブル構造（table、tr、td）の実装
- 依存: td要素の実装
- 依存: tr要素の実装
