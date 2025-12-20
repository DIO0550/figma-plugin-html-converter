# Feature Specification: テーブルセクション（tbody, tfoot）の実装

**Issue**: [#128](https://github.com/DIO0550/figma-plugin-html-converter/issues/128)
**Branch**: `128-tbody-tfoot-implementation`
**Status**: Planning
**Created**: 2025-11-23

## 概要

テーブルセクション要素（tbody, tfoot）のFigma変換機能を実装します。これらの要素により、テーブルを論理的なセクション（ヘッダー、ボディ、フッター）に分割し、視覚的にグループ化できるようになります。

## 目的

HTMLテーブルの構造を完全にサポートし、thead/tbody/tfootによる3層構造を適切にFigmaで表現可能にします。

## 対象要素

### 1. `<tbody>` - テーブルボディセクション

テーブルの主要なデータ行を含むセクションです。

**HTML仕様**: https://developer.mozilla.org/ja/docs/Web/HTML/Element/tbody

**特性**:
- テーブルのメインコンテンツを格納
- 複数のtr要素を子要素として持つ
- thead、tfootと組み合わせて使用

### 2. `<tfoot>` - テーブルフッターセクション

テーブルの列をまとめる情報（合計、集計など）を含むセクションです。

**HTML仕様**: https://developer.mozilla.org/ja/docs/Web/HTML/Element/tfoot

**特性**:
- テーブルのフッター情報を格納
- 複数のtr要素を子要素として持つ
- HTML5ではtable内のどの位置にも配置可能（ただしレンダリング時は最下部）

## 機能要件

### FR-1: TableBodySectionElement実装

- `<tbody>`要素をFigma FrameNodeに変換
- 子要素として`TrElement[]`を保持
- thead要素と同様のパターンで実装
- セクション特有のスタイリングをサポート

### FR-2: TableFooterSectionElement実装

- `<tfoot>`要素をFigma FrameNodeに変換
- 子要素として`TrElement[]`を保持
- thead要素と同様のパターンで実装
- セクション特有のスタイリングをサポート

### FR-3: セクショングループ化

- thead/tbody/tfootを視覚的に明確に区別
- 各セクション間の境界線処理
- セクションごとに異なるスタイルを適用可能

### FR-4: テーブル構造の完全サポート

- thead/tbody/tfoot全てを含む完全なテーブル構造をサポート
- セクションの省略も可能（tbody単体など）
- セクションの順序に依存しない適切な配置

## 技術仕様

### 型定義

```typescript
// TbodyElement
interface TbodyElement extends BaseElement<"tbody", TbodyAttributes> {
  children: TrElement[];
}

// TfootElement
interface TfootElement extends BaseElement<"tfoot", TfootAttributes> {
  children: TrElement[];
}
```

### コンパニオンオブジェクト

thead要素と同様のパターン:
- `create()`: 要素の生成
- `isXxxElement()`: 型ガード
- `toFigmaNode()`: Figma変換
- `mapToFigma()`: マッピング

### Figma変換仕様

**FrameNode設定**:
- `layoutMode`: "VERTICAL"（tr要素を縦方向に配置）
- `primaryAxisAlignItems`: "MIN"
- `counterAxisAlignItems`: "MIN"
- `itemSpacing`: 0

**命名規則**:
- tbody: "tbody"
- tfoot: "tfoot"

## 非機能要件

### NFR-1: パフォーマンス

- 大量の行を含むテーブルでも適切に動作
- セクション分割による処理の効率化

### NFR-2: 保守性

- thead要素と同じコードパターンを踏襲
- コードの一貫性を維持
- 理解しやすいドキュメント

### NFR-3: テストカバレッジ

- 単体テスト: 各セクション要素の基本機能
- 統合テスト: thead/tbody/tfootを含む完全なテーブル
- カバレッジ90%以上を維持

## ファイル構成

```
src/converter/elements/table/
├── tbody/
│   ├── index.ts
│   ├── tbody-attributes/
│   │   ├── index.ts
│   │   ├── tbody-attributes.ts
│   │   └── __tests__/
│   │       └── tbody-attributes.test.ts
│   ├── tbody-element/
│   │   ├── index.ts
│   │   ├── tbody-element.ts
│   │   └── __tests__/
│   │       ├── tbody-element.factory.test.ts
│   │       ├── tbody-element.mapToFigma.test.ts
│   │       ├── tbody-element.toFigmaNode.test.ts
│   │       └── tbody-element.typeguards.test.ts
│   └── __tests__/
│       ├── tbody-integration.basic.test.ts
│       ├── tbody-integration.scenarios.test.ts
│       └── tbody-integration.styles.test.ts
│
├── tfoot/
│   ├── index.ts
│   ├── tfoot-attributes/
│   │   ├── index.ts
│   │   ├── tfoot-attributes.ts
│   │   └── __tests__/
│   │       └── tfoot-attributes.test.ts
│   ├── tfoot-element/
│   │   ├── index.ts
│   │   ├── tfoot-element.ts
│   │   └── __tests__/
│   │       ├── tfoot-element.factory.test.ts
│   │       ├── tfoot-element.mapToFigma.test.ts
│   │       ├── tfoot-element.toFigmaNode.test.ts
│   │       └── tfoot-element.typeguards.test.ts
│   └── __tests__/
│       ├── tfoot-integration.basic.test.ts
│       ├── tfoot-integration.scenarios.test.ts
│       └── tfoot-integration.styles.test.ts
│
└── __tests__/
    └── table-sections-integration.test.ts  # thead/tbody/tfoot統合テスト
```

## タスク一覧

### Phase 1: tbody要素実装
- [ ] TbodyAttributesクラスの作成
- [ ] TbodyElementクラスの作成
- [ ] tbody要素の単体テスト
- [ ] tbody要素の統合テスト

### Phase 2: tfoot要素実装
- [ ] TfootAttributesクラスの作成
- [ ] TfootElementクラスの作成
- [ ] tfoot要素の単体テスト
- [ ] tfoot要素の統合テスト

### Phase 3: セクション統合
- [ ] セクション間の境界線処理
- [ ] thead/tbody/tfoot統合テスト
- [ ] table/index.tsへのエクスポート追加
- [ ] 使用例のドキュメント更新

## 完了条件

- [x] 全テストがグリーン（カバレッジ90%以上）
- [x] thead/tbody/tfootが適切にグループ化される
- [x] 各セクションに異なるスタイルを適用可能
- [x] APIドキュメント（JSDoc）が完備
- [x] 既存のテーブル機能に影響を与えない

## 参考資料

### 既存実装
- thead要素: `src/converter/elements/table/thead/`
- tr要素: `src/converter/elements/table/tr/`
- table要素: `src/converter/elements/table/table-element/`

### HTML仕様
- tbody: https://developer.mozilla.org/ja/docs/Web/HTML/Element/tbody
- tfoot: https://developer.mozilla.org/ja/docs/Web/HTML/Element/tfoot
- テーブル構造: https://developer.mozilla.org/ja/docs/Web/HTML/Element/table

### Figma API
- FrameNode: https://www.figma.com/plugin-docs/api/FrameNode/
- Auto Layout: https://www.figma.com/plugin-docs/api/properties/FrameNode-layoutmode/

## 見積もり

**工数**: 2-3日

**内訳**:
- tbody実装: 0.5日
- tfoot実装: 0.5日
- セクション統合: 0.5日
- テスト・ドキュメント: 0.5-1.5日

## リスク

### R-1: セクション順序の処理

**リスク**: HTML5ではtfootがtbodyの前に記述可能だが、レンダリング時は最下部に表示される

**対策**: Figma変換時にセクションの表示順序を適切に制御

### R-2: 既存テーブル実装への影響

**リスク**: table要素のchildren型定義の変更が必要になる可能性

**対策**: 後方互換性を保ちつつ、段階的に型定義を拡張

## 関連Issue

- 親Issue: [#120 - テーブル要素の実装](https://github.com/DIO0550/figma-plugin-html-converter/issues/120)
- 前提Issue: [#149 - tr要素の実装](https://github.com/DIO0550/figma-plugin-html-converter/issues/149)
- 前提Issue: [#127 - thead要素の実装](https://github.com/DIO0550/figma-plugin-html-converter/issues/127)
