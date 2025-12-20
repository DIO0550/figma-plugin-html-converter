# Research: Caption, Colgroup, Col 要素の実装

**Date**: 2025-11-28
**Feature**: Issue #129 - Phase 1-4: キャプションとカラムグループの実装

## 1. HTML仕様調査

### 1.1 Caption要素

**Decision**: caption要素はFigma FrameNodeに変換し、テキストコンテンツを含める

**Rationale**:
- caption要素は単純なテキストだけでなく、他のHTML要素を含むことができる
- FrameNodeを使用することで、複雑なキャプション構造にも対応可能
- 既存のコンテナ要素（div, section）と同様のアプローチ

**Alternatives considered**:
- TextNode直接使用 → テキストのみの場合は軽量だが、子要素対応が困難
- GROUP使用 → Auto Layoutが使えず、位置調整が複雑

**MDN参照**: https://developer.mozilla.org/ja/docs/Web/HTML/Element/caption

### 1.2 Colgroup要素

**Decision**: colgroup要素はメタデータとして処理し、視覚的ノードは生成しない

**Rationale**:
- colgroupはセマンティック/スタイル適用目的の要素
- Figmaには「列グループ」の概念がない
- 列スタイル情報として保持し、td/thセル生成時に適用

**Alternatives considered**:
- 空のFrameNode生成 → 無意味な構造が増える
- 完全に無視 → span属性やスタイル情報が失われる

**MDN参照**: https://developer.mozilla.org/ja/docs/Web/HTML/Element/colgroup

### 1.3 Col要素

**Decision**: col要素はメタデータとして処理し、列幅情報をセルに適用

**Rationale**:
- col要素は空要素で視覚的表現を持たない
- width属性/スタイルは対応する列の全セルに適用すべき
- span属性で複数列への適用を制御

**Alternatives considered**:
- 個別セルに直接幅適用 → col要素の情報集約機能が失われる
- 完全に無視 → 列幅指定機能が失われる

**MDN参照**: https://developer.mozilla.org/ja/docs/Web/HTML/Element/col

## 2. 既存実装パターン分析

### 2.1 要素構造パターン

既存のthead/tbody/tfoot実装から抽出したパターン:

```
src/converter/elements/table/{element}/
├── index.ts                    # エクスポート
├── {element}-attributes/
│   ├── index.ts
│   ├── {element}-attributes.ts # 属性インターフェース
│   └── __tests__/
│       └── {element}-attributes.test.ts
└── {element}-element/
    ├── index.ts
    ├── {element}-element.ts    # 要素定義（型ガード、ファクトリ、変換）
    └── __tests__/
        ├── {element}-element.factory.test.ts
        ├── {element}-element.typeguards.test.ts
        ├── {element}-element.toFigmaNode.test.ts
        └── {element}-element.mapToFigma.test.ts
```

### 2.2 コンパニオンオブジェクトパターン

```typescript
export const XxxElement = {
  isXxxElement(node: unknown): node is XxxElement { ... },
  create(attributes: Partial<XxxAttributes> = {}): XxxElement { ... },
  toFigmaNode(element: XxxElement): FigmaNodeConfig { ... },
  mapToFigma(node: unknown): FigmaNodeConfig | null { ... },
};
```

### 2.3 属性パターン

```typescript
import type { GlobalAttributes } from "../../../base";

export interface XxxAttributes extends GlobalAttributes {
  // 要素固有の属性
}
```

## 3. 技術的課題と解決策

### 3.1 Caption配置

**課題**: caption要素はテーブルの上部または下部に配置される

**解決策**:
- `caption-side` CSSプロパティをパース
- デフォルトは上部配置（`caption-side: top`）
- 下部配置時はテーブルのAuto Layout順序を調整

### 3.2 列幅の適用

**課題**: Figma Auto Layoutでの列幅制御

**解決策**:
- col要素のwidth情報を収集
- テーブルレンダリング時にtd/thセルの幅に適用
- Auto Layout constraints（FIXED vs FILL）を適切に設定

### 3.3 span属性の処理

**課題**: col/colgroupのspan属性で複数列への適用

**解決策**:
- span値をパースし、適用対象列のインデックスを計算
- 各列のスタイル情報を配列として保持
- セル生成時に対応する列インデックスのスタイルを参照

## 4. 実装優先度

1. **Caption要素** (高優先度)
   - 視覚的に重要な要素
   - 実装パターンが明確（既存のFrameNode変換と類似）

2. **Col要素** (中優先度)
   - 列幅設定に必要
   - 単純な属性パースとメタデータ保持

3. **Colgroup要素** (中優先度)
   - col要素のコンテナ
   - span属性の処理が必要

4. **統合** (高優先度)
   - table要素との連携
   - 列幅情報のセルへの適用

## 5. テスト戦略

### 5.1 単体テスト

- 各要素の型ガードテスト
- ファクトリメソッドテスト
- Figma変換テスト
- 属性パーステスト

### 5.2 統合テスト

- caption含むテーブル全体の変換
- colgroup/col含むテーブルの列幅適用
- caption-side: bottom のテスト
- 複雑なspan属性のテスト

## 6. 未解決事項

- [ ] colgroup/colのスタイル情報をどこに保持するか（TableElement内? 別管理?）
- [ ] caption内の子要素（リンクや強調など）の処理方法

→ これらは実装フェーズで具体化する
