# Feature Specification: Caption, Colgroup, Col 要素の実装

**Issue**: [#129](https://github.com/DIO0550/figma-plugin-html-converter/issues/129)
**Phase**: 1-4
**Parent Issue**: [#120 - Phase 1: テーブル要素のサポート実装](https://github.com/DIO0550/figma-plugin-html-converter/issues/120)

## 概要

テーブルキャプションとカラムグループ要素（caption, colgroup, col）のFigma変換機能を実装します。

## 対象要素

### 1. `<caption>` - テーブルキャプション

テーブルのタイトルや説明を表示する要素。

**HTML仕様**:
- テーブルの最初の子要素として配置
- テーブルの上部（デフォルト）または下部に表示可能
- `caption-side` CSSプロパティで位置を制御

**属性**:
- グローバル属性のみ（id, class, style等）

**変換仕様**:
- Figma TextNodeまたはFrameNodeとして変換
- テーブルの上部または下部に配置
- `caption-side: bottom` の場合はテーブル下部に配置

### 2. `<colgroup>` - カラムグループ

テーブルの列をグループ化する要素。

**HTML仕様**:
- caption要素の後、thead/tbody/tfoot/tr要素の前に配置
- col要素を子として持つか、span属性で列数を指定

**属性**:
- `span`: グループ化する列数（col要素がない場合）
- グローバル属性

**変換仕様**:
- Figmaではメタデータとして処理
- 列スタイルの一括適用に使用
- 視覚的な要素としては直接表示されない

### 3. `<col>` - カラム定義

個々の列のスタイルや属性を定義する要素。

**HTML仕様**:
- colgroup要素の子として配置
- 空要素（終了タグなし）

**属性**:
- `span`: この要素が適用される列数（デフォルト: 1）
- `width`: 列の幅（非推奨、CSSを推奨）
- グローバル属性

**変換仕様**:
- Figmaではメタデータとして処理
- 対応する列のセルに幅やスタイルを適用

## 機能要件

### FR-1: Caption要素の変換

- [ ] caption要素をFigma TextNode/FrameNodeに変換
- [ ] テーブル上部にデフォルト配置
- [ ] `caption-side: bottom` スタイルでテーブル下部に配置
- [ ] テキストスタイル（font-size, font-weight, color等）の適用

### FR-2: Colgroup要素の処理

- [ ] colgroup要素のパース
- [ ] span属性の処理
- [ ] 子col要素の収集

### FR-3: Col要素の処理

- [ ] col要素のパース
- [ ] span属性の処理
- [ ] width属性/スタイルの処理
- [ ] 対応する列へのスタイル適用

### FR-4: 統合

- [ ] table要素内でのcaption配置処理
- [ ] colgroup/colによる列幅設定の適用
- [ ] 既存のthead/tbody/tfoot/tr/td/th要素との連携

## 非機能要件

### NFR-1: テストカバレッジ
- 90%以上のコードカバレッジ

### NFR-2: パフォーマンス
- 大規模テーブル（100行×10列）でも許容範囲内の処理速度

### NFR-3: ドキュメント
- 全パブリックAPIにJSDoc完備

## 技術的制約

1. **Figma制限**: colgroup/colは視覚的要素ではないため、Figmaノードとして直接表現されない
2. **列幅適用**: Auto Layoutの制約内で列幅を適用する必要がある
3. **caption配置**: テーブル構造の外側に配置する必要がある

## 実装パターン

既存の実装パターン（thead, tbody, tfoot）に従う:

1. `{element}-attributes.ts` - 属性インターフェース定義
2. `{element}-element.ts` - 要素クラス（型ガード、ファクトリ、変換）
3. `index.ts` - エクスポート
4. `__tests__/` - テストファイル群

## 完了条件

- [ ] テストがグリーン（カバレッジ90%以上）
- [ ] キャプションが適切な位置に配置される
- [ ] colgroup/colによるカラム幅設定が機能する
- [ ] APIドキュメント（JSDoc）が完備
