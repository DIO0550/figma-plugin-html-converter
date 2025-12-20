# Research: table要素の実装

**Date**: 2025-11-21
**Feature**: table要素（テーブル全体）の実装

## 概要

table要素の実装にあたり、既存のtd、tr、div要素の実装パターンを調査し、同じパターンを適用することを確認しました。

## 調査結果

### 1. 既存実装パターンの確認

#### コンパニオンオブジェクトパターン

**Decision**: コンパニオンオブジェクトパターンを使用
**Rationale**:
- クラスを使わず、interfaceとコンパニオンオブジェクトで実装
- 型ガード、ファクトリメソッド、変換ロジックを一箇所に集約
- 既存のtd、tr、div要素と一貫性を保つ

**参考実装**:
- `src/converter/elements/table/tr/tr-element/tr-element.ts`
- `src/converter/elements/table/td/td-element/td-element.ts`
- `src/converter/elements/container/div/div-element/div-element.ts`

**Alternatives considered**:
- クラスベースの実装: プロジェクトの方針に反するため却下
- 関数のみの実装: 型ガードとファクトリの一元管理が難しいため却下

### 2. ユーティリティ関数の活用

#### toFigmaNodeWith

**Decision**: `toFigmaNodeWith`ユーティリティを使用
**Rationale**:
- 共通スタイル適用ロジックを再利用
- カスタムスタイル適用も可能
- 既存要素と同じパターン

**使用例**:
```typescript
toFigmaNodeWith(
  element,
  (el) => {
    const config = FigmaNode.createFrame("table");
    return FigmaNodeConfig.applyHtmlElementDefaults(
      config,
      "table",
      el.attributes,
    );
  },
  {
    applyCommonStyles: true,
  },
);
```

#### mapToFigmaWith

**Decision**: `mapToFigmaWith`ユーティリティを使用
**Rationale**:
- 型ガード→ファクトリ→変換の標準フロー
- エラーハンドリングが統一
- コード重複の削減

**使用例**:
```typescript
mapToFigmaWith(
  node,
  "table",
  this.isTableElement,
  this.create,
  this.toFigmaNode,
);
```

### 3. Auto Layoutの設定

#### 縦方向レイアウト

**Decision**: VERTICAL（縦方向）のAuto Layoutを使用
**Rationale**:
- テーブルは行（tr）を縦に並べる構造
- itemSpacing: 0でボーダーのみで区切り
- primaryAxisAlignItems: MINで上揃え

**設定値**:
```typescript
{
  layoutMode: "VERTICAL",
  primaryAxisAlignItems: "MIN",
  counterAxisAlignItems: "MIN",
  itemSpacing: 0,
}
```

**Alternatives considered**:
- Gridレイアウト: Figma Plugin APIでは直接的なGrid設定が困難
- 手動配置: Auto Layoutの方がレスポンシブで保守性が高い

### 4. 子要素の型定義

#### TrElement[]

**Decision**: `children: TrElement[]`として定義
**Rationale**:
- table要素の直接の子はtr要素のみ（HTML仕様に準拠）
- 型安全性の向上
- 空配列も許容

**型定義**:
```typescript
export interface TableElement extends BaseElement<"table", TableAttributes> {
  children: TrElement[];
}
```

**Alternatives considered**:
- `children: BaseElement[]`: 型が緩すぎる
- `children: (TrElement | TheadElement | TbodyElement)[]`: Phase 1では不要な複雑性

### 5. border属性のサポート

#### 廃止予定だがサポート

**Decision**: border属性をサポート
**Rationale**:
- レガシーHTMLとの互換性
- 簡単なテーブルスタイリングに有用
- CSSのborderプロパティと併用可能

**実装方針**:
- `FigmaNodeConfig.applyHtmlElementDefaults`で自動処理
- 個別のborder処理は不要（既存の仕組みで対応）

**Alternatives considered**:
- border属性を無視: ユーザーの期待に反する可能性
- 独自のborder処理: 既存の仕組みで十分

### 6. テスト戦略

#### TDDアプローチ

**Decision**: Red-Green-Refactorサイクルで実装
**Rationale**:
- プロジェクトの必須要件
- 高いテストカバレッジ（90%以上）を維持
- 既存要素と同じテスト構造

**テストファイル構成**:
```
__tests__/
├── table-element.factory.test.ts      # create()メソッド
├── table-element.typeguards.test.ts   # isTableElement()
├── table-element.toFigmaNode.test.ts  # toFigmaNode()
└── table-element.mapToFigma.test.ts   # mapToFigma()
```

**テストケース**:
- 基本: 空のテーブル、1行1列
- 標準: 2x2、3x3テーブル
- スタイル: border、background-color、padding

### 7. 依存関係の確認

#### 既存要素への依存

**Decision**: tr、td、th要素の完成を前提
**Rationale**:
- table要素は子としてtr要素を持つ
- tr要素はtd/th要素を持つ
- これらは既に実装済み

**確認済み要素**:
- ✅ TdElement: `/workspace/src/converter/elements/table/td/`
- ✅ TrElement: `/workspace/src/converter/elements/table/tr/`
- ✅ ThElement: `/workspace/src/converter/elements/table/th/`

## まとめ

### 技術的決定事項

1. **実装パターン**: コンパニオンオブジェクトパターン
2. **ユーティリティ**: toFigmaNodeWith、mapToFigmaWith
3. **レイアウト**: VERTICAL Auto Layout
4. **子要素型**: TrElement[]
5. **属性**: border属性をサポート
6. **テスト**: TDD、カバレッジ90%以上

### 次のステップ

- Phase 1でdata-model.mdを作成
- 型定義の詳細化
- API契約の明確化
